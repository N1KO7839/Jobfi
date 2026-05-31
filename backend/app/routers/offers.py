from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.services.offers import get_paginated_offers, get_locations

router = APIRouter()


@router.get("/locations")
async def get_all_locations(session: AsyncSession = Depends(get_session)):
    return await get_locations(session)


@router.get("")
async def getAllOffers(
    page: int = 1,
    size: int = 8,
    sort_type: str = "date_desc",
    min_salary: int | None = None,
    max_salary: int | None = None,
    working_mode: str | None = None,
    location: str | None = None,
    session: AsyncSession = Depends(get_session),
):
    try:
        offers = await get_paginated_offers(
            session=session,
            page_num=page,
            page_size=size,
            sort_type=sort_type,
            min_salary=min_salary,
            max_salary=max_salary,
            working_mode=working_mode,
            location=location,
        )
        return offers
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
