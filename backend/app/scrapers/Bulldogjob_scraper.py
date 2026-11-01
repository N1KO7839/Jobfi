import logging
import re
from patchright.async_api import async_playwright
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class BulldogjobScraper(BaseScraper):
    name = "Bulldogjob"

    def __init__(self, numberOfOffers: int = 15, session=None):
        super().__init__(numberOfOffers, session)
        self.job_offers = []

    async def scrape(self, query: str = "https://bulldogjob.pl/companies/jobs") -> list:
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

                card_locator = page.locator("a[href*='/companies/jobs/']")
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
                            full_url = f"https://bulldogjob.pl{full_url}"

                        card_raw = await card.inner_text()
                        lines = [
                            line_text.strip()
                            for line_text in card_raw.split("\n")
                            if line_text.strip()
                        ]

                        title = lines[0] if len(lines) > 0 else "Unknown"
                        company = lines[1] if len(lines) > 1 else "Unknown"
                        location = (
                            lines[2].split("+")[0].strip()
                            if len(lines) > 2
                            else "Remote"
                        )

                        card_raw_lower = card_raw.lower()
                        if "remote" in card_raw_lower or "zdaln" in card_raw_lower:
                            working_mode = "Remote"
                        elif "hybrid" in card_raw_lower or "hybryd" in card_raw_lower:
                            working_mode = "Hybrid"
                        else:
                            working_mode = (
                                "Hybrid" if location != "Remote" else "Remote"
                            )

                        salary_str = "Undisclosed"
                        salary_el = card.locator("[class*='font-extrabold']").first
                        if await salary_el.count() > 0:
                            salary_str = (await salary_el.inner_text()).strip()
                        else:
                            matches = re.findall(
                                r"(\d[\d\s]*(?:–|-)\s*[\d\s]+\s*(?:PLN|EUR|USD|zł))",
                                card_raw,
                                re.IGNORECASE,
                            )
                            if matches:
                                salary_str = matches[0].strip()

                        tech_stack = []
                        for line in lines[3:]:
                            line_l = line.lower()
                            if (
                                line_l
                                not in {
                                    "umowa o pracę",
                                    "b2b",
                                    "zlecenie",
                                    "junior",
                                    "mid/regular",
                                    "senior",
                                    "lead",
                                    "trainee",
                                }
                                and not any(
                                    curr in line_l
                                    for curr in ["pln", "eur", "usd", "zł"]
                                )
                                and len(line) <= 30
                            ):
                                if line not in tech_stack:
                                    tech_stack.append(line)

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
