from fastapi import FastAPI
from scrapers.JustJoinItScraper import JustJoinItScraper

app = FastAPI()


@app.get("/")
async def root():
    scraperJustJoin = JustJoinItScraper(5)
    jobOffers = await scraperJustJoin.scrape(
        "https://justjoin.it/job-offers/remote?workplace=hybrid&with-salary=yes&orderBy=DESC&sortBy=published"
    )
    return jobOffers
