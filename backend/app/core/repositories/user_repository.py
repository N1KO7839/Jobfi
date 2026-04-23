from .base_repository import BaseRepository
from uuid import UUID
from sqlalchemy import select
from ...models.user import Offer

class UserRepository(BaseRepository):

    async def get_by_id(self, user_id: UUID):
        stmt = select(Offer).where(Offer.id == user_id)
        result = await self.session.execute(stmt)
        return result.first()