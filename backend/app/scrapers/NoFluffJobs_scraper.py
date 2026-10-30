import logging
from patchright.async_api import async_playwright
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class NoFluffJobsScraper(BaseScraper):
    name = "NoFluffJobs"

    def __init__(self, numberOfOffers: int = 15, session=None):
        super().__init__(numberOfOffers, session)
        self.job_offers = []

    async def scrape(
        self,
        query: str = "https://nofluffjobs.com/pl/praca-it?criteria=jobLanguage%3Dpl,en",
    ) -> list:
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
                    "#onetrust-accept-btn-handler",
                    'button[id*="accept"]',
                    'button:has-text("Zaakceptuj")',
                    'button:has-text("Akceptuję")',
                    'button:has-text("Zgadzam")',
                ]:
                    try:
                        btn = page.locator(cookie_btn).first
                        if await btn.is_visible(timeout=1500):
                            await btn.click()
                            await page.wait_for_timeout(500)
                            break
                    except Exception:
                        pass

                card_locator = page.locator("a[href*='/job/']")
                count = await card_locator.count()
                logger.info(f"[{self.name}] Discovered {count} job cards on page.")

                limit = min(self.number_of_offers, count)
                for i in range(limit):
                    try:
                        card = card_locator.nth(i)
                        href = await card.get_attribute("href")
                        if not href:
                            continue

                        full_url = (
                            f"https://nofluffjobs.com{href}"
                            if href.startswith("/")
                            else href
                        )

                        title = "Unknown"
                        title_el = card.locator(
                            'h3[data-cy="title position on the job offer listing"], h3, h4'
                        ).first
                        if await title_el.count() > 0:
                            title = (await title_el.inner_text()).strip()

                        company = "Unknown"
                        company_el = (
                            card.locator('[commonicon="job_offer"]').locator("..").first
                        )
                        if await company_el.count() > 0:
                            company = (await company_el.inner_text()).strip()
                        if not company or company == "Unknown":
                            spans = await card.locator(
                                ".tw-font-semibold"
                            ).all_inner_texts()
                            if len(spans) > 1 and spans[1].strip():
                                company = spans[1].strip()

                        salary_str = "Undisclosed"
                        salary_el = card.locator(
                            '[data-cy="salary ranges on the job offer listing"]'
                        ).first
                        if await salary_el.count() > 0:
                            salary_str = (await salary_el.inner_text()).strip()

                        tech_stack = []
                        cat_elements = card.locator(
                            '[data-cy="category name on the job offer listing"]'
                        )
                        cat_count = await cat_elements.count()
                        for c in range(cat_count):
                            tag = (await cat_elements.nth(c).inner_text()).strip()
                            if tag:
                                tech_stack.append(tag)

                        location = "Remote"
                        working_mode = "Remote"

                        card_text = await card.inner_text()
                        loc_el = card.locator(
                            '[data-cy="location on the job offer listing"]'
                        ).first
                        if await loc_el.count() > 0:
                            location = (await loc_el.inner_text()).strip()

                        card_text_lower = card_text.lower()
                        if "zdalnie" in card_text_lower or "remote" in card_text_lower:
                            working_mode = "Remote"
                        elif (
                            "hybrydowo" in card_text_lower
                            or "hybrid" in card_text_lower
                        ):
                            working_mode = "Hybrid"
                        elif "biurze" in card_text_lower or "office" in card_text_lower:
                            working_mode = "Office"

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
