from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
import os
from pydantic import BaseModel
from app.services.auth import (
    create_access_token,
    register_user,
    login_user,
    verify_token,
    create_verification_token,
    create_password_reset_token,
)
from app.services.emails import send_verification_mail, send_reset_password_mail, send_login_mail
from app.models.user import UserCreateLogin
from app.repositories.user_repository import UserRepository
from app.core.db import get_session
import bcrypt

router = APIRouter()
FRONTEND_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:3000/")

class EmailSchema(BaseModel):
    email: str

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str

class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str

@router.post("/register")
async def register(
    user_passed: UserCreateLogin, session: AsyncSession = Depends(get_session)
):
    try:
        user = await register_user(user=user_passed, session=session)
        v_token = create_verification_token(data={"sub": user.email, "id": str(user.id)})
        v_link = f"{FRONTEND_URL.rstrip('/')}/auth/verify?token={v_token}"
        try:
            send_verification_mail(user.email, v_link)
        except Exception as e:
            print(f"Failed to send verification email: {e}")
            
        return {"email": user.email, "id": user.id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/verify")
async def verify_email(token: str, session: AsyncSession = Depends(get_session)):
    verified_token = verify_token(token)
    if not verified_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )
    user_id = verified_token.get("id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )
    usr_repo = UserRepository(session)
    user = await usr_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user.is_verified = True
    await session.merge(user)
    await session.commit()
    return {"message": "Email verified successfully", "user": user}

@router.post("/forgot-password")
async def forgot_password(
    data: EmailSchema, session: AsyncSession = Depends(get_session)
):
    usr_repo = UserRepository(session)
    user = await usr_repo.get_by_email(data.email)
    if not user:
        return {"message": "If that email is in our system, we have sent a reset link to it."}
    
    reset_token = create_password_reset_token(data={"sub": user.email, "id": str(user.id)})
    reset_link = f"{FRONTEND_URL.rstrip('/')}/auth/reset-password?token={reset_token}"
    
    try:
        send_reset_password_mail(user.email, reset_link)
    except Exception as e:
        print(f"Failed to send reset email: {e}")
        
    return {"message": "If that email is in our system, we have sent a reset link to it."}

@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordSchema, session: AsyncSession = Depends(get_session)
):
    verified_token = verify_token(data.token)
    if not verified_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )
    
    user_id = verified_token.get("id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )
    usr_repo = UserRepository(session)
    user = await usr_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    hashed_password = bcrypt.hashpw(
        data.new_password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")
    
    user.password = hashed_password
    await session.merge(user)
    await session.commit()
    return {"message": "Password updated successfully"}


@router.post("/change-password")
async def change_password(
    data: ChangePasswordSchema,
    authorization: str = Header(None),
    session: AsyncSession = Depends(get_session)
):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing"
        )
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    verified_token = verify_token(token)
    if not verified_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = verified_token.get("id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    usr_repo = UserRepository(session)
    user = await usr_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not bcrypt.checkpw(data.current_password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    hashed_password = bcrypt.hashpw(
        data.new_password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")
    
    user.password = hashed_password
    await session.merge(user)
    await session.commit()
    
    return {"message": "Password changed successfully"}


@router.post("/login")
async def login(
    user_passed: UserCreateLogin, session: AsyncSession = Depends(get_session)
):
    try:
        tokens = await login_user(user=user_passed, session=session)
        try:
            send_login_mail(user_passed.email, frontend_url=FRONTEND_URL.rstrip('/'))
        except Exception as e:
            print(f"Failed to send login email: {e}")
            
        return tokens
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/refresh")
async def refresh(refreshToken: str):
    verified_token = verify_token(refreshToken)

    if not verified_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    user_email = verified_token.get("sub")
    user_id = verified_token.get("id")

    access_token = create_access_token(data={"sub": user_email, "id": user_id})

    return {"access_token": access_token, "type": "bearer"}
