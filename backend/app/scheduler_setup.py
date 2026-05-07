from pytz import utc

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.asyncio import AsyncIOExecutor
from apscheduler.executors.pool import ProcessPoolExecutor, ThreadPoolExecutor

import os
from dotenv import load_dotenv

from app.core.db import async_session
from app.scrapers.scrapers_manager import scrape_all


load_dotenv()
database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise ValueError("DATABASE_URL is not set")

sync_database_url = database_url.replace("+asyncpg", "")

jobstores = {
    'default': SQLAlchemyJobStore(url=sync_database_url)
}
executors = {
    'default': AsyncIOExecutor(),
    'processpool': ProcessPoolExecutor(max_workers=5),
    'threadpool': ThreadPoolExecutor(max_workers=20)
}
job_defaults = {
    'coalesce': True,
    'max_instances': 1,
    "misfire_grace_time": 3600
}
scheduler = AsyncIOScheduler()

scheduler.configure(jobstores=jobstores, executors=executors, job_defaults=job_defaults, timezone=utc)

async def scheduled_scrape_task():
    async with async_session() as session:
        await scrape_all(session)

def start_scheduler():
    scheduler.add_job(
        scheduled_scrape_task,
        trigger='interval',
        hours=4,
        id='scrape_all_job',
        replace_existing=True
    )
    scheduler.start()
