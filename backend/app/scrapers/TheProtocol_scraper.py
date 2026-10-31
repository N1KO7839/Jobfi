import logging
import re
from patchright.async_api import async_playwright
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class TheProtocolScraper(BaseScraper):
    name = "The Protocol"

    def __init__(self, numberOfOffers: int = 15, session=None):
        super().__init__(numberOfOffers, session)
        self.job_offers = []

    async def scrape(
        self, query: str = "https://theprotocol.it/filtry/wszystkie;p"
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
                    'button[data-test="button-submitCookie"]',
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

                card_locator = page.locator(
                    "a[href*='/szczegoly/praca/'], a[href*='/szczegoly/oferta/']"
                )
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
                            full_url = f"https://theprotocol.it{full_url}"

                        title = "Unknown"
                        title_el = card.locator(
                            '[data-test="text-jobTitle"], h2, h3'
                        ).first
                        if await title_el.count() > 0:
                            title = (await title_el.inner_text()).strip()

                        company = "Unknown"
                        emp_el = card.locator('[data-test="text-employerName"]').first
                        if await emp_el.count() > 0:
                            company = (await emp_el.inner_text()).strip()

                        working_mode = "Remote"
                        mode_el = card.locator('[data-test="text-workModes"]').first
                        if await mode_el.count() > 0:
                            raw_mode = (await mode_el.inner_text()).strip().lower()
                            if "zdaln" in raw_mode or "remote" in raw_mode:
                                working_mode = "Remote"
                            elif "hybryd" in raw_mode or "hybrid" in raw_mode:
                                working_mode = "Hybrid"
                            elif "stacjonarn" in raw_mode or "office" in raw_mode:
                                working_mode = "Office"

                        location = "Remote"
                        loc_el = card.locator('[data-test="text-workplaces"]').first
                        if await loc_el.count() > 0:
                            location = (await loc_el.inner_text()).strip()

                        all_texts = [
                            t.strip()
                            for t in (await card.inner_text()).split("\n")
                            if t.strip()
                        ]

                        salary_str = "Undisclosed"
                        tech_stack = []

                        ignored_words = {
                            "new",
                            "start asap",
                            "aplikuj szybko",
                            "ekstra benefity",
                            "quick apply",
                            "mobilna",
                            "stacjonarna",
                            "zdalna",
                            "hybrydowa",
                            title.lower(),
                            company.lower(),
                            working_mode.lower(),
                            location.lower(),
                        }

                        i = 0
                        salary_candidates = []
                        while i < len(all_texts):
                            t = all_texts[i]
                            tl = t.lower()
                            next_tl = (
                                all_texts[i + 1].lower()
                                if i + 1 < len(all_texts)
                                else ""
                            )

                            if re.search(
                                r"^\d+([.,]\d+)?\s*k?\s*[-–—]\s*\d+([.,]\d+)?\s*k?$",
                                t.strip(),
                            ) and any(
                                curr in next_tl
                                for curr in [
                                    "zł",
                                    "pln",
                                    "eur",
                                    "usd",
                                    "mies",
                                    "godz",
                                    "hr",
                                    "uop",
                                    "b2b",
                                ]
                            ):
                                salary_candidates.append(
                                    f"{t.strip()} {all_texts[i + 1].strip()}"
                                )
                                i += 2
                                continue

                            if any(
                                curr in tl
                                for curr in [
                                    "zł",
                                    "pln",
                                    "eur",
                                    "usd",
                                    "mies.",
                                    "godz.",
                                    "uop",
                                    "b2b",
                                ]
                            ) and re.search(r"\d", t):
                                salary_candidates.append(t.strip())
                                i += 1
                                continue

                            if (
                                len(t) <= 30
                                and tl not in ignored_words
                                and not any(
                                    ig in tl
                                    for ig in ["benefity", "oferta", "szczegóły"]
                                )
                                and not t.startswith("+")
                            ):
                                tech_stack.append(t)
                            i += 1

                        if salary_candidates:
                            salary_str = " ".join(salary_candidates)

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
