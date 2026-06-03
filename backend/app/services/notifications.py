from datetime import datetime, timedelta
from app.core.db import async_session
from app.models.user import User
from app.models.preference import UserPreference
from app.models.job import JobOffer
from app.services.emails import send_job_notifications_mail
from sqlmodel import select
import os

FRONTEND_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:3000/")

async def process_notifications(frequency: str):
    async with async_session() as session:
        stmt = select(UserPreference, User).join(User, UserPreference.user_id == User.id).where(UserPreference.notification_frequency == frequency)
        results = await session.execute(stmt)
        user_prefs = results.all()

        if not user_prefs:
            return

        days_back = 1 if frequency == "daily" else 7
        cutoff_date = datetime.utcnow() - timedelta(days=days_back)

        for pref, user in user_prefs:
            job_stmt = select(JobOffer).where(JobOffer.created_datetime >= cutoff_date)

            if pref.min_preferred_salary:
                job_stmt = job_stmt.where(JobOffer.salary >= pref.min_preferred_salary)
            if pref.preferred_currency:
                job_stmt = job_stmt.where(JobOffer.currency == pref.preferred_currency)
            if pref.preferred_working_mode:
                job_stmt = job_stmt.where(JobOffer.working_mode.ilike(f"%{pref.preferred_working_mode}%"))
            if pref.preferred_location:
                job_stmt = job_stmt.where(JobOffer.location.ilike(f"%{pref.preferred_location}%"))
            
            job_results = await session.execute(job_stmt)
            jobs = job_results.scalars().all()

            if jobs:
                try:
                    send_job_notifications_mail(user.email, jobs[:10], frequency, frontend_url=FRONTEND_URL.rstrip('/'))
                except Exception as e:
                    print(f"Failed to send {frequency} notification to {user.email}: {e}")

async def send_daily_notifications():
    await process_notifications("daily")

async def send_weekly_notifications():
    await process_notifications("weekly")
