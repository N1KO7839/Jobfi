from abc import ABC, abstractmethod
import re
from decimal import Decimal
from ..repositories.job_offers_repository import JobOffersRepository


def _parse_salary(salary_raw):
    if isinstance(salary_raw, (int, float, Decimal)):
        return Decimal(salary_raw), "PLN", "monthly"

    text_val = str(salary_raw).replace("\xa0", " ").strip()
    text_lower = text_val.lower()

    if "eur" in text_lower or "€" in text_lower:
        currency = "EUR"
    elif "usd" in text_lower or "$" in text_lower:
        currency = "USD"
    elif "chf" in text_lower:
        currency = "CHF"
    elif "gbp" in text_lower or "£" in text_lower:
        currency = "GBP"
    else:
        currency = "PLN"

    if (
        "hour" in text_lower
        or "/h" in text_lower
        or "godz" in text_lower
        or "rbh" in text_lower
    ):
        period = "hourly"
    elif "dzień" in text_lower or "dzien" in text_lower or "/d" in text_lower:
        period = "daily"
    elif "rok" in text_lower or "year" in text_lower or "annum" in text_lower:
        period = "annual"
    else:
        period = "monthly"

    normalized_for_num = text_lower.replace(" ", "").replace(",", ".")
    matches = re.findall(r"(\d+(?:\.\d+)?)\s*(k|tys|tis)?", normalized_for_num)

    values = []
    for num_str, multiplier in matches:
        if not num_str:
            continue
        try:
            val = float(num_str)
            if multiplier in ("k", "tys", "tis"):
                val *= 1000
            values.append(val)
        except ValueError:
            continue

    result_val = Decimal(0)
    if values:
        if len(values) >= 2:
            if values[0] < 1000 and values[1] >= 1000 and (values[1] / values[0] > 10):
                values[0] *= 1000
            result_val = Decimal(round((values[0] + values[1]) / 2))
        else:
            result_val = Decimal(round(values[0]))

    if result_val > 0:
        if result_val < 500 and period == "monthly":
            period = "hourly"
        elif 500 <= result_val < 3000 and period == "monthly":
            period = "daily"
        elif result_val > 80000 and period == "annual":
            result_val = Decimal(round(result_val / 12))
            period = "monthly"

    return result_val, currency, period


class BaseScraper(ABC):
    name: str = "Unknown"

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
                salary_val, currency, period = _parse_salary(
                    job_offer_dict.get("salary", 0)
                )
                raw_tech = job_offer_dict.get("techStack", [])
                tech_stack = (
                    ",".join(raw_tech) if isinstance(raw_tech, list) else str(raw_tech)
                )
                source_name = job_offer_dict.get("source") or getattr(
                    self, "name", "Unknown"
                )

                new_offer = JobOffer(
                    title=job_offer_dict.get("title", "Unknown"),
                    company=job_offer_dict.get("company", "Unknown"),
                    salary=salary_val,
                    currency=currency,
                    salary_period=period,
                    tech_stack=tech_stack,
                    location=job_offer_dict.get("location", "Remote"),
                    working_mode=job_offer_dict.get("workingMode", "Remote")[:50],
                    source=source_name,
                    url=clean_url,
                )
                await job_repository.insert_offer(new_offer)
                return True
        except Exception as e:
            print(f"Error saving job offer to database: {e}")
            return False
