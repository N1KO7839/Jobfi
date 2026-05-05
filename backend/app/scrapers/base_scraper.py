from abc import ABC, abstractmethod
from app.schemas.jobOfferSchema import JobOfferSchema
from ..repositories.job_offers_repository import JobOffersRepository


class BaseScraper(ABC):
    @abstractmethod
    async def scrape(self, query) -> list[JobOfferSchema]:
        pass

    async def save_to_db(self, job_offer: JobOfferSchema, session) -> bool:
        try:
            job_repository = JobOffersRepository()
            is_job_present = job_repository.get_by_url(job_offer.url)
            if is_job_present is not None:
                return False
            else:
                job_repository.insert_offer(job_offer)
                return True
        except Exception as e:
            print(f"Error saving job offer to database: {e}")
            return False
