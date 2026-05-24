from .base_repository import BaseRepository
from uuid import UUID
from sqlalchemy import select
from ..models.job import JobOffer, ordered_by_type

class JobOffersRepository(BaseRepository):
    async def get_by_id(self, job_offer_id: UUID) -> JobOffer:
        stmt = select(JobOffer).where(JobOffer.id == job_offer_id)
        result = await self.session.scalar(statement=stmt)
        return result

    async def get_by_url(self, job_offer_url: str) -> JobOffer:
        stmt = select(JobOffer).where(JobOffer.url == job_offer_url)
        result = await self.session.scalar(statement=stmt)
        return result

    async def insert_offer(self, job_offer: JobOffer) -> JobOffer:
        self.session.add(job_offer)
        await self.session.commit()
        return job_offer
    
    async def get_paginated(self, offset: int, limit: int, ordered_by: ordered_by_type) -> list[JobOffer]:
        match ordered_by:
            case "payment_asc":
                stmt = select(JobOffer).order_by(JobOffer.salary.asc(), JobOffer.id.asc())
            case "payment_desc":
                stmt = select(JobOffer).order_by(JobOffer.salary.desc(), JobOffer.id.asc())
            case "date_asc":
                stmt = select(JobOffer).order_by(JobOffer.created_datetime.asc(), JobOffer.id.asc())
            case "date_desc":
                stmt = select(JobOffer).order_by(JobOffer.created_datetime.desc(), JobOffer.id.asc())

        stmt += stmt.limit({limit}).offset({offset})
        
        result = await self.session.scalars(statement=stmt)
        return list(result.all())