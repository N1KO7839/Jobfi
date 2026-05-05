from .base_repository import BaseRepository
from uuid import UUID
from sqlalchemy import select
from ..models.job import JobOffer


class JobOffersRepository(BaseRepository):
    async def get_by_id(self, job_offer_id: UUID) -> JobOffer:
        stmt = select(JobOffer).where(JobOffer.id == job_offer_id)
        result = await self.session.scalar(stmt)
        return result

    async def get_by_url(self, job_offer_url: str) -> JobOffer:
        stmt = select(JobOffer).where(JobOffer.url == job_offer_url)
        result = await self.session.scalar(statement=stmt)
        return result

    async def insert_offer(self, job_offer: JobOffer) -> JobOffer:
        self.session.add(job_offer)
        await self.session.commit()
