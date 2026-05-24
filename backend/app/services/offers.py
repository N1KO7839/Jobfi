from ..models.job import JobOffer, ordered_by_type
from ..repositories.job_offers_repository import JobOffersRepository


async def get_paginated_offers(page_num: int = 1, page_size: int = 8, sort_type: ordered_by_type = "date_desc")  -> list[JobOffer]:
    job_repo = JobOffersRepository()
    offset = (page_num-1)*page_size
    
    await job_repo.get_paginated(offset=offset, limit=page_size, ordered_by=sort_type) 
    