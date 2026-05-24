from sqlalchemy.ext.asyncio import AsyncSession
from ..models.job import ordered_by_type
from ..repositories.job_offers_repository import JobOffersRepository
import math

async def get_paginated_offers(session: AsyncSession, page_num: int = 1, page_size: int = 8, sort_type: ordered_by_type = "date_desc") -> dict:
    job_repo = JobOffersRepository(session)
    offset = (page_num - 1) * page_size
    
    items = await job_repo.get_paginated(offset=offset, limit=page_size, ordered_by=sort_type)
    total_items = await job_repo.get_total_count()
    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 1
    
    return {
        "items": items,
        "total_items": total_items,
        "page": page_num,
        "page_size": page_size,
        "total_pages": total_pages
    }