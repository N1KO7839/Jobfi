from datetime import datetime
from sqlalchemy import TIMESTAMP, Column, text
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4

class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str
    password: str = Field(nullable=False)
    created_datetime: datetime = Field(sa_column=Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()")))
    updated_datetime: datetime = Field(sa_column=Column(TIMESTAMP(timezone=True),
                        nullable=False, server_onupdate=text("now()")))
