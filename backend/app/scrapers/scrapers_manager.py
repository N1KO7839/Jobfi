import argparse
import asyncio
import logging
from typing import Sequence, Type
from sqlalchemy.ext.asyncio import AsyncSession

from .base_scraper import BaseScraper
from .JustJoinIt_scraper import JustJoinItScraper
from .Pracujpl_scraper import PracujPlScraper
from .NoFluffJobs_scraper import NoFluffJobsScraper
from .TheProtocol_scraper import TheProtocolScraper
from .Bulldogjob_scraper import BulldogjobScraper

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


class ScraperConfig:
    def __init__(
        self,
        scraper_class: Type[BaseScraper],
        default_query: str,
        offers_count: int = 15,
        enabled: bool = True,
    ):
        self.scraper_class = scraper_class
        self.default_query = default_query
        self.offers_count = offers_count
        self.enabled = enabled

    @property
    def name(self) -> str:
        return getattr(self.scraper_class, "name", self.scraper_class.__name__)


SCRAPER_REGISTRY: list[ScraperConfig] = [
    ScraperConfig(
        scraper_class=JustJoinItScraper,
        default_query="https://justjoin.it/job-offers/all-locations?orderBy=DESC&sortBy=newest",
        offers_count=15,
    ),
    ScraperConfig(
        scraper_class=PracujPlScraper,
        default_query="https://www.pracuj.pl/praca?cc=5015%2C5016%2C5013",
        offers_count=15,
    ),
    ScraperConfig(
        scraper_class=NoFluffJobsScraper,
        default_query="https://nofluffjobs.com/pl/praca-it?criteria=jobLanguage%3Dpl,en",
        offers_count=15,
    ),
    ScraperConfig(
        scraper_class=TheProtocolScraper,
        default_query="https://theprotocol.it/filtry/wszystkie;p",
        offers_count=15,
    ),
    ScraperConfig(
        scraper_class=BulldogjobScraper,
        default_query="https://bulldogjob.pl/companies/jobs",
        offers_count=15,
    ),
]


def register_scraper(
    scraper_class: Type[BaseScraper],
    default_query: str,
    offers_count: int = 15,
    enabled: bool = True,
):
    existing = [c for c in SCRAPER_REGISTRY if c.scraper_class == scraper_class]
    if not existing:
        SCRAPER_REGISTRY.append(
            ScraperConfig(scraper_class, default_query, offers_count, enabled)
        )


async def run_single_scraper(
    config: ScraperConfig, session: AsyncSession, offers_limit: int | None = None
) -> list:
    name = config.name
    count = offers_limit or config.offers_count
    logger.info(f"[{name}] Starting scraper (limit={count})...")
    try:
        scraper = config.scraper_class(count, session)
        results = await scraper.scrape(config.default_query)
        logger.info(
            f"[{name}] Completed: successfully processed {len(results or [])} offers."
        )
        return results or []
    except Exception as e:
        logger.error(f"[{name}] Scraper encountered an error: {e}", exc_info=True)
        return []


async def scrape_all(
    session: AsyncSession,
    offers_limit: int | None = None,
    platforms: Sequence[str] | None = None,
) -> dict[str, int]:
    summary = {}
    normalized_platforms = [p.lower() for p in platforms] if platforms else None

    for config in SCRAPER_REGISTRY:
        if not config.enabled:
            continue

        if normalized_platforms:
            if config.name.lower() not in normalized_platforms:
                continue

        results = await run_single_scraper(config, session, offers_limit=offers_limit)
        summary[config.name] = len(results)

    logger.info(f"Scrape cycle finished. Summary: {summary}")
    return summary


async def _cli_main():
    parser = argparse.ArgumentParser(description="Jobfi Scraper Runner")
    parser.add_argument(
        "--platform",
        "-p",
        nargs="+",
        help="Specific platform(s) to scrape (e.g. JustJoinIt Pracuj.pl NoFluffJobs)",
    )
    parser.add_argument(
        "--limit",
        "-l",
        type=int,
        default=5,
        help="Number of offers to scrape per platform",
    )
    args = parser.parse_args()

    from app.core.db import async_session

    async with async_session() as session:
        await scrape_all(session, offers_limit=args.limit, platforms=args.platform)


if __name__ == "__main__":
    asyncio.run(_cli_main())
