import logging
from patchright.async_api import async_playwright
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


TWO_WORD_CITY_ENDINGS = {
    "góra",
    "sącz",
    "wola",
    "targ",
    "śląska",
    "górnicza",
    "mazowiecki",
    "wielkopolski",
    "trybunalski",
}


def _split_company_and_city(line: str) -> tuple[str, str]:
    parts = line.split()
    if len(parts) < 2:
        return (parts[0] if parts else "Unknown"), "Remote"

    city_words = 2 if parts[-1].lower() in TWO_WORD_CITY_ENDINGS else 1
    if len(parts) <= city_words:
        city_words = 1

    return " ".join(parts[:-city_words]), " ".join(parts[-city_words:])


class SolidJobsScraper(BaseScraper):
    name = "Solid.Jobs"

    def __init__(self, numberOfOffers: int = 15, session=None):
        super().__init__(numberOfOffers, session)
        self.job_offers = []

    async def scrape(self, query: str = "https://solid.jobs/offers/it") -> list:
        self.job_offers = []
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                viewport={"width": 1920, "height": 1080},
            )
            page = await context.new_page()

            try:
                await page.goto(query, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(3000)

                for cookie_btn in [
                    'button:has-text("Zaakceptuj")',
                    'button:has-text("Akceptuję")',
                    'button:has-text("Zgadzam")',
                    'button[id*="accept"]',
                ]:
                    try:
                        btn = page.locator(cookie_btn).first
                        if await btn.is_visible(timeout=1500):
                            await btn.click()
                            await page.wait_for_timeout(500)
                            break
                    except Exception:
                        pass

                card_locator = page.locator("a[href*='/offer/']")
                count = await card_locator.count()
                logger.info(f"[{self.name}] Discovered {count} job cards on page.")

                limit = min(self.number_of_offers, count)
                for i in range(limit):
                    try:
                        card = card_locator.nth(i)
                        href = await card.get_attribute("href")
                        if not href:
                            continue

                        full_url = href.split("?")[0]
                        if not full_url.startswith("http"):
                            full_url = f"https://solid.jobs{full_url}"

                        raw = (await card.inner_text()).replace("\xa0", " ")
                        lines = [
                            line.strip() for line in raw.split("\n") if line.strip()
                        ]

                        title = lines[0] if lines else "Unknown"

                        company = "Unknown"
                        location = "Remote"
                        if len(lines) > 1:
                            company, location = _split_company_and_city(lines[1])

                        tech_stack = [
                            line.lstrip("#").strip()
                            for line in lines
                            if line.startswith("#") and len(line) <= 30
                        ]

                        salary_str = "Undisclosed"
                        for line in lines:
                            if any(
                                curr in line.lower()
                                for curr in ["pln", "eur", "usd", "zł"]
                            ) and any(char.isdigit() for char in line):
                                salary_str = line
                                break

                        raw_lower = raw.lower()
                        if "zdalnie" in raw_lower or "remote" in raw_lower:
                            working_mode = "Remote"
                        elif "hybryd" in raw_lower or "hybrid" in raw_lower:
                            working_mode = "Hybrid"
                        else:
                            working_mode = (
                                "Hybrid" if location != "Remote" else "Remote"
                            )

                        job_data = {
                            "title": title,
                            "company": company,
                            "salary": salary_str,
                            "techStack": tech_stack,
                            "location": location,
                            "workingMode": working_mode,
                            "source": self.name,
                            "url": full_url,
                        }

                        self.job_offers.append(job_data)
                    except Exception as e:
                        logger.warning(f"[{self.name}] Error extracting card #{i}: {e}")
                        continue

            except Exception as e:
                logger.error(f"[{self.name}] Error loading listings page: {e}")
            finally:
                await browser.close()

        for job_offer in self.job_offers:
            await self.save_to_db(job_offer)

        return self.job_offers
