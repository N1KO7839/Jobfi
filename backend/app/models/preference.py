from datetime import datetime
from sqlalchemy import TIMESTAMP, Column, text
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4


class UserPreference(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(default_factory=uuid4, foreign_key="user.id")
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
