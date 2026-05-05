from .JustJoinIt_scraper import JustJoinItScraper
from sqlalchemy.ext.asyncio import AsyncSession


async def scrape_all(session: AsyncSession):
    justJoinItScraper = JustJoinItScraper(2, session)
    await justJoinItScraper.scrape(
        "https://justjoin.it/job-offers/all-locations?orderBy=DESC&sortBy=newest"
    )