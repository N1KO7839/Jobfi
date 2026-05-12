from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.auth import register_user, login_user
from app.models.user import UserCreateLogin
from app.core.db import get_session

router = APIRouter()

@router.post("/register")
async def register(user_passed: UserCreateLogin, session: AsyncSession = Depends(get_session)):
    try:
        user = await register_user(user=user_passed, session=session)
        return {"email": user.email, "id": user.id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login")
async def login(user_passed: UserCreateLogin, session: AsyncSession = Depends(get_session)):
    try:
        tokens = await login_user(user=user_passed, session=session)
        return tokens
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
