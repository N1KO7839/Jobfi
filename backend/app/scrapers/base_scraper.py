from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.jobOfferSchema import JobOfferSchema
from app.core.repositories.job_offers_repository import JobOffersRepository



class baseScraper(ABC):
    @abstractmethod
    async def scrape(self, query) -> list[JobOfferSchema]:
        pass

    async def save_to_db(self, job_offer: JobOfferSchema) -> bool:
        try:
            job_repository = JobOffersRepository()
            is_job_present = job_repository.get_by_url(job_offer.url)
            if is_job_present == None:
                return False
            else:
                job_repository.insert_offer(job_offer)
                return True
        except Exception as e:
            print(f"Error saving job offer to database: {e}")
            return False
