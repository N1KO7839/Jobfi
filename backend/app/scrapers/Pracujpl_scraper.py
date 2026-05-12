from patchright.async_api import async_playwright
from .base_scraper import BaseScraper
from pyvirtualdisplay import Display


class PracujPlScraper(BaseScraper):
    def __init__(self, number_of_offers, session=None):
        super().__init__(number_of_offers, session)
        self.job_offers = []

    async def scrape(self, query) -> list:
        display = Display(visible=0, size=(1920, 1080))
        display.start()

        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=False,
                    slow_mo=300,
                    args=["--disable-blink-features=AutomationControlled"],
                )
                context = await browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
                )
                page = await context.new_page()

                await page.goto(query, wait_until="domcontentloaded")

                try:
                    await page.locator('button[data-test="button-submitCookie"]').click(
                        timeout=3000
                    )
                    print("Cookies accepted")
                except Exception:
                    pass
                offer_link_selector = 'a[data-test="link-offer"]'

                try:
                    await page.wait_for_selector(offer_link_selector, timeout=10000)
                except Exception as e:
                    print(f"Could not find offer links on the list page: {e}")

                links = []
                cards = page.locator(offer_link_selector)
                count = await cards.count()

                for i in range(min(self.number_of_offers, count)):
                    href = await cards.nth(i).get_attribute("href")
                    if href:
                        full_url = (
                            href
                            if href.startswith("http")
                            else f"https://www.pracuj.pl{href}"
                        )
                        links.append(full_url)

                for link in links:
                    try:
                        await page.goto(
                            link, wait_until="domcontentloaded", timeout=25000
                        )

                        try:
                            title = await page.locator(
                                '[data-test="text-positionName"]'
                            ).first.inner_text()
                        except Exception:
                            title = "Unknown"

                        try:
                            company_raw = await page.locator(
                                '[data-test="text-employerName"]'
                            ).first.inner_text()
                            company = (
                                company_raw.replace("O firmie", "")
                                .replace("About the company", "")
                                .strip()
                            )
                        except Exception:
                            company = "Unknown"

                        try:
                            salary_raw = await page.locator(
                                '[data-test="text-earningAmount"]'
                            ).first.inner_text()
                            salary_str = salary_raw.replace("\xa0", " ").strip()
                        except Exception:
                            salary_str = "Undisclosed"

                        try:
                            location_raw = await page.locator(
                                '[data-test="sections-benefit-workplaces"] [data-test="offer-badge-title"]'
                            ).first.inner_text()
                            location = location_raw.split("(")[0].strip()
                        except Exception:
                            location = "Unknown"

                        try:
                            working_mode = await page.locator(
                                '[data-test="sections-benefit-work-schedule"] [data-test="offer-badge-title"]'
                            ).first.inner_text()
                        except Exception:
                            working_mode = "Unknown"

                        try:
                            description = await page.locator(
                                '[data-test="text-about-project"]'
                            ).first.inner_text()
                        except Exception:
                            description = ""

                        try:
                            tech_stack_raw = await page.locator(
                                '[data-test="item-technologies-expected"]'
                            ).all_inner_texts()
                            tech_stack = [
                                tech.strip() for tech in tech_stack_raw if tech.strip()
                            ]
                        except Exception:
                            tech_stack = []

                        job_data = {
                            "title": title,
                            "company": company,
                            "salary": salary_str,
                            "location": location,
                            "workingMode": working_mode,
                            "techStack": tech_stack,
                            "description": description,
                            "url": page.url,
                        }
                        self.job_offers.append(job_data)

                    except Exception as e:
                        print(f"Skipping {link} due to error: {e}")
                        continue

                await browser.close()

                for jobOffer in self.job_offers:
                    await self.save_to_db(jobOffer)

            return self.job_offers

        finally:
            display.stop()
