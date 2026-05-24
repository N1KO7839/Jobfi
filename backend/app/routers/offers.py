from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.services.offers import get_paginated_offers

router = APIRouter()

@router.get("/offers")
async def getAllOffers(
    page: int = 1,
    size: int = 8,
    sort_type: str = "date_desc",
    session: AsyncSession = Depends(get_session)
):
    try:
        offers = await get_paginated_offers(
            session=session, 
            page_num=page, 
            page_size=size, 
            sort_type=sort_type
        )
        return offers
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))