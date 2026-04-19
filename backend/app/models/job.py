from datetime import datetime
from decimal import Decimal
from typing import Literal
from sqlalchemy import TIMESTAMP, Column, text, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4

class JobOffer(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str
    company: str
    salary: Decimal = Field(default=0, nullable=False)
    tech_stack: list[str] = Field(sa_column=Column(ARRAY(String)))
    location: str | None = None
    workingMode: Literal["Remote", "Hybrid", "Office"] = Field(sa_column=Column(String))
    url: str
    created_datetime: datetime = Field(sa_column=Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()")))
    updated_datetime: datetime = Field(sa_column=Column(TIMESTAMP(timezone=True),
                        nullable=False, server_onupdate=text("now()")))
