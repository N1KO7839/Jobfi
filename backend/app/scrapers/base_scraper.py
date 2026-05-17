from abc import ABC, abstractmethod
import re
from decimal import Decimal
from ..repositories.job_offers_repository import JobOffersRepository


def _parse_salary(salary_raw):
    if isinstance(salary_raw, (int, float, Decimal)):
        return Decimal(salary_raw), "PLN", "monthly"

    text_val = str(salary_raw).replace(" ", "").replace("\xa0", "").replace(",", ".")
    text_lower = text_val.lower()
    
    currency = "USD" if "usd" in text_lower or "$" in text_lower else "PLN"
    period = "hourly" if "hour" in text_lower or "/h" in text_lower or "godz" in text_lower else "monthly"
    
    numbers = re.findall(r"\d+(?:\.\d+)?", text_val)

    result_val = Decimal(0)
    if numbers:
        if len(numbers) >= 2:
            result_val = Decimal(round((float(numbers[0]) + float(numbers[1])) / 2))
        else:
            result_val = Decimal(round(float(numbers[0])))

    if result_val > 0:
        if result_val < 500 and period == "monthly":
            period = "hourly"
        elif 500 <= result_val < 3000 and period == "monthly":
            period = "daily"

    return result_val, currency, period


class BaseScraper(ABC):
    def __init__(self, numberOfOffers, session=None):
        self.number_of_offers = numberOfOffers
        self.session = session

    @abstractmethod
    async def scrape(self, query) -> list:
        pass

    async def save_to_db(self, job_offer_dict: dict) -> bool:
        if not self.session:
            return False
        try:
            from app.models.job import JobOffer

            job_repository = JobOffersRepository(self.session)

            clean_url = job_offer_dict.get("url", "").split("?")[0]

            is_job_present = await job_repository.get_by_url(clean_url)
            if is_job_present is not None:
                return False
            else:
                salary_val, currency, period = _parse_salary(job_offer_dict.get("salary", 0))
                new_offer = JobOffer(
                    title=job_offer_dict.get("title", "Unknown"),
                    company=job_offer_dict.get("company", "Unknown"),
                    salary=salary_val,
                    currency=currency,
                    salary_period=period,
                    tech_stack=",".join(job_offer_dict.get("techStack", [])),
                    location=job_offer_dict.get("location", "Remote"),
                    working_mode=job_offer_dict.get("workingMode", "Remote")[:50],
                    url=clean_url,
                )
                await job_repository.insert_offer(new_offer)
                return True
        except Exception as e:
            print(f"Error saving job offer to database: {e}")
            return False
