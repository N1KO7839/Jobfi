from pydantic import BaseModel
from typing import Optional, Literal

class JobOfferSchema(BaseModel):
    title: str
    company: str
    salary: str
    techStack: list
    location: Optional[str] = None
    workingMode: Literal["Remote", "Hybrid", "Office"]
    url: str