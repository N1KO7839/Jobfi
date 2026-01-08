from abc import ABC, abstractmethod
from app.schemas.jobOfferSchema import JobOfferSchema

class baseScraper(ABC):
    @abstractmethod
    async def scrape(self, query) -> list[JobOfferSchema]:
        pass