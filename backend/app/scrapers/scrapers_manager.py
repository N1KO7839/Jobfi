from .Pracujpl_scraper import PracujPlScraper
from .JustJoinIt_scraper import JustJoinItScraper
from sqlalchemy.ext.asyncio import AsyncSession


async def scrape_all(session: AsyncSession):
    justJoinItScraper = JustJoinItScraper(10, session)
    await justJoinItScraper.scrape(
        "https://justjoin.it/job-offers/all-locations?orderBy=DESC&sortBy=newest"
    )
    pracujPLScraper = PracujPlScraper(10, session)
    await pracujPLScraper.scrape("https://www.pracuj.pl/praca?cc=5015%2C5016%2C5013")
