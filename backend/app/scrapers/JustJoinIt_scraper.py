from patchright.async_api import async_playwright


class JustJoinItScraper:
    def __init__(self, numberOfOffers):
        self.numberOfOffers = numberOfOffers
        self.jobOffers = []

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

            for i in range(min(self.numberOfOffers, count)):
                links.append(await cards.nth(i).get_attribute("href"))

            for link in links:
                try:
                    await page.goto(
                        f"https://justjoin.it{link}",
                        wait_until="domcontentloaded",
                        timeout=45000,
                    )

                    await page.wait_for_selector("h1")

                    job_data = {
                        "title": await page.locator("h1").inner_text(),
                        "company": await page.locator("h2.mui-1lgfpg4").inner_text(),
                        "salary": await page.locator(
                            "div.mui-1f21jp8"
                        ).first.inner_text(),
                        "techStack": await page.locator(
                            "div.mui-6r2fzw"
                        ).all_inner_texts(),
                        "location": await page.locator(
                            "div.mui-1lgfpg4"
                        ).first.inner_text(),
                        "workingMode": await page.locator(".mui-9ffzmz")
                        .nth(3)
                        .inner_text(),
                        "url": page.url,
                    }
                    self.jobOffers.append(job_data)

                except Exception as e:
                    print(f"Skipping {link} due to error: {e}")
                    continue

            await browser.close()
        return self.jobOffers
