from patchright.async_api import async_playwright
from scrapers.baseScraper import baseScraper
from app.schemas.jobOfferSchema import JobOfferSchema 

class JustJoinItScraper(baseScraper):
    def __init__(self, numberOfOffers):
        self.numberOfOffers = numberOfOffers
        self.jobOffers: list[JobOfferSchema] = []
        
    async def scrape(self, query) -> list[JobOfferSchema]:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context()
            page = await context.new_page()
            
            await page.goto(query)
            links = []
            for i in range(self.numberOfOffers):
                links.append(await page.locator("a.offer-card").nth(i).get_attribute("href"))
            
            for link in links[:self.numberOfOffers]:
                await page.goto(f"https://justjoin.it{link}")
                
                job_data = {
                    "title": await page.locator("h1").inner_text(),
                    "company": await page.locator("h2.mui-1jfrpka").inner_text(),
                    "salary": await page.locator("div.mui-1bzxsz6").first.inner_text(),
                    "techStack": await page.locator("div.mui-jfr3nf").all_inner_texts(),
                    "location": await page.locator("div.mui-1jfrpka").first.inner_text(),
                    "workingMode": await page.locator(".mui-aa3a55").nth(3).inner_text(),
                    "url": page.url
                }
                
                self.jobOffers.append(JobOfferSchema(**job_data))
                
            await browser.close()
        return self.jobOffers