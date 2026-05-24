from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import text
from sqlmodel import Field, SQLModel
from typing import Literal


class JobOffer(SQLModel, table=True):
    __tablename__ = "job_offers"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str
    company: str
    salary: Decimal = Field(default=0)
    currency: str = "PLN"
    salary_period: str = "monthly"
    tech_stack: str = ""
    location: Optional[str] = None
    working_mode: str = "Remote"
    url: str
    created_datetime: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": text("now()")},
    )
    updated_datetime: datetime = Field(
        default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": text("now()")}
    )
    
    
ordered_by_type = Literal["payment_asc", "payment_desc", "date_asc", "date_desc"]