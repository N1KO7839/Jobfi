from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from sqlmodel import select

from app.core.db import get_session
from app.models.preference import UserPreference
from app.services.auth import get_current_user
from app.models.user import User

router = APIRouter()


class PreferenceUpdate(BaseModel):
    min_preferred_salary: Optional[Decimal] = None
    max_preferred_salary: Optional[Decimal] = None
    preferred_currency: Optional[str] = None
    preferred_working_mode: Optional[str] = None
    preferred_location: Optional[str] = None
    preferred_tech_stack: Optional[List[str]] = None
    preferred_salary_period: Optional[str] = None
    notification_frequency: Optional[str] = None


@router.get("/", response_model=UserPreference)
async def get_preferences(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(UserPreference).where(UserPreference.user_id == current_user.id)
    )
    preference = result.scalars().first()
    if not preference:
        preference = UserPreference(user_id=current_user.id)
        session.add(preference)
        await session.commit()
        await session.refresh(preference)
    return preference


@router.put("/", response_model=UserPreference)
async def update_preferences(
    prefs_in: PreferenceUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(UserPreference).where(UserPreference.user_id == current_user.id)
    )
    preference = result.scalars().first()

    if not preference:
        preference = UserPreference(user_id=current_user.id)
        session.add(preference)

    update_data = prefs_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(preference, key, value)

    await session.commit()
    await session.refresh(preference)
    return preference
