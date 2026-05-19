from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.auth import (
    create_access_token,
    register_user,
    login_user,
    verify_token,
)
from app.models.user import UserCreateLogin
from app.core.db import get_session

router = APIRouter()


@router.post("/register")
async def register(
    user_passed: UserCreateLogin, session: AsyncSession = Depends(get_session)
):
    try:
        user = await register_user(user=user_passed, session=session)
        return {"email": user.email, "id": user.id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login")
async def login(
    user_passed: UserCreateLogin, session: AsyncSession = Depends(get_session)
):
    try:
        tokens = await login_user(user=user_passed, session=session)
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
