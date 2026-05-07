import json
from patchright.async_api import async_playwright
from .base_scraper import BaseScraper


class JustJoinItScraper(BaseScraper):
    def __init__(self, numberOfOffers, session=None):
        super().__init__(numberOfOffers, session)
        self.job_offers = []
        

    async def scrape(self, query) -> list:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            )
            page = await context.new_page()

            await page.goto(query, wait_until="domcontentloaded")
            await page.wait_for_selector("a.offer-card")

            links = []
            cards = page.locator("a.offer-card")
            count = await cards.count()

            for i in range(min(self.number_of_offers, count)):
                links.append(await cards.nth(i).get_attribute("href"))

            for link in links:
                try:
                    await page.goto(
                        f"https://justjoin.it{link}",
                        wait_until="domcontentloaded",
                        timeout=25000,
                    )

                    await page.wait_for_selector(
                        'script[type="application/ld+json"]', state="attached"
                    )

                    script_content = await page.locator(
                        'script[type="application/ld+json"]'
                    ).first.text_content()
                    try:
                        schema_data = json.loads(script_content)
                    except json.JSONDecodeError:
                        schema_data = {}

                    if isinstance(schema_data, list):
                        schema_data = next(
                            (
                                item
                                for item in schema_data
                                if item.get("@type") == "JobPosting"
                            ),
                            {},
                        )

                    hiring_org = schema_data.get("hiringOrganization", {}) or {}
                    job_loc = schema_data.get("jobLocation", {}) or {}
                    address = job_loc.get("address", {}) or {}

                    base_salary = schema_data.get("baseSalary", {}) or {}
                    salary_value = base_salary.get("value", {}) or {}
                    min_s = salary_value.get("minValue")
                    max_s = salary_value.get("maxValue")
                    curr = base_salary.get("currency", "")

                    if min_s and max_s:
                        salary_str = f"{min_s} - {max_s} {curr}"
                    else:
                        try:
                            salary_str = await page.locator(
                                "div.mui-1f21jp8"
                            ).first.inner_text()
                        except:
                            salary_str = "Undisclosed"

                    job_data = {
                        "title": schema_data.get("title")
                        or await page.locator("h1").inner_text(),
                        "company": hiring_org.get("name")
                        or await page.locator("h2.mui-1lgfpg4").inner_text(),
                        "salary": salary_str,
                        "techStack": await page.locator(
                            "div.mui-vdxqko"
                        ).all_inner_texts(),
                        "location": address.get("addressLocality")
                        or await page.locator("div.mui-1lgfpg4").first.inner_text(),
                        "workingMode": await page.locator(".mui-15p6y0p")
                        .nth(3)
                        .inner_text(),
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
