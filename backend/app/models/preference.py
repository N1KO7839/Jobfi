from datetime import datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import ARRAY, TIMESTAMP, Column, String, text
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4


class UserPreference(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(default_factory=uuid4, foreign_key="user.id")
    min_preferred_salary: Optional[Decimal] = Field(default=0)
    max_preferred_salary: Optional[Decimal]  = Field(default=Decimal('9999999'))
    preferred_currency: Optional[str] = Field(default="PLN")
    preferred_working_mode: Optional[str] = Field(default=None)
    preferred_location: Optional[str] = Field(default=None)
    preferred_tech_stack: Optional[list[str]] = Field(default=None, sa_column=Column(ARRAY(String)))
    preferred_salary_period: Optional[str] = Field(default=None)
    created_datetime: datetime = Field(
        sa_column=Column(
            TIMESTAMP(timezone=True), nullable=False, server_default=text("now()")
        )
    )
    updated_datetime: datetime = Field(
        sa_column=Column(
            TIMESTAMP(timezone=True), nullable=False, server_onupdate=text("now()")
        )
    )
