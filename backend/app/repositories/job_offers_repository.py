from .base_repository import BaseRepository
from uuid import UUID
from sqlalchemy import select
from ..models.job import JobOffer, ordered_by_type


class JobOffersRepository(BaseRepository):
    async def get_by_id(self, job_offer_id: UUID) -> JobOffer:
        stmt = select(JobOffer).where(JobOffer.id == job_offer_id)
        result = await self.session.scalar(statement=stmt)
        return result

    async def get_by_url(self, job_offer_url: str) -> JobOffer:
        stmt = select(JobOffer).where(JobOffer.url == job_offer_url)
        result = await self.session.scalar(statement=stmt)
        return result

    async def insert_offer(self, job_offer: JobOffer) -> JobOffer:
        self.session.add(job_offer)
        await self.session.commit()
        return job_offer

    async def get_paginated(
        self,
        offset: int,
        limit: int,
        ordered_by: ordered_by_type,
        min_salary: int | None = None,
        max_salary: int | None = None,
        working_mode: str | None = None,
        location: str | None = None,
    ) -> list[JobOffer]:
        stmt = select(JobOffer)

        if min_salary is not None:
            stmt = stmt.where(JobOffer.salary >= min_salary)
        if max_salary is not None:
            stmt = stmt.where(JobOffer.salary <= max_salary)
        if working_mode:
            stmt = stmt.where(JobOffer.working_mode.ilike(f"%{working_mode}%"))
        if location:
            stmt = stmt.where(JobOffer.location.ilike(f"%{location}%"))

        match ordered_by:
            case "payment_asc":
                stmt = stmt.order_by(JobOffer.salary.asc(), JobOffer.id.asc())
            case "payment_desc":
                stmt = stmt.order_by(JobOffer.salary.desc(), JobOffer.id.asc())
            case "date_asc":
                stmt = stmt.order_by(JobOffer.created_datetime.asc(), JobOffer.id.asc())
            case "date_desc":
                stmt = stmt.order_by(
                    JobOffer.created_datetime.desc(), JobOffer.id.asc()
                )

        stmt = stmt.limit(limit).offset(offset)

        result = await self.session.scalars(statement=stmt)
        return list(result.all())

    async def get_total_count(
        self,
        min_salary: int | None = None,
        max_salary: int | None = None,
        working_mode: str | None = None,
        location: str | None = None,
    ) -> int:
        from sqlalchemy import func

        stmt = select(func.count()).select_from(JobOffer)

        if min_salary is not None:
            stmt = stmt.where(JobOffer.salary >= min_salary)
        if max_salary is not None:
            stmt = stmt.where(JobOffer.salary <= max_salary)
        if working_mode:
            stmt = stmt.where(JobOffer.working_mode.ilike(f"%{working_mode}%"))
        if location:
            stmt = stmt.where(JobOffer.location.ilike(f"%{location}%"))

        result = await self.session.scalar(stmt)
        return result or 0

    async def get_locations(self) -> list[str]:
        stmt = (
            select(JobOffer.location).distinct().where(JobOffer.location.is_not(None))
        )
        result = await self.session.scalars(stmt)
        locations = result.all()

        cleaned = set()
        for loc in locations:
            parts = loc.split(",")
            city = parts[-1].strip()
            if not any(char.isdigit() for char in city) and len(city) < 30:
                cleaned.add(city.title())

        return sorted(list(cleaned))
