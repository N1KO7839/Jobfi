from .base_repository import BaseRepository
from uuid import UUID
from sqlalchemy import select
from ..models.user import User

class UserRepository(BaseRepository):
    async def get_by_id(self, user_id: UUID) -> User | None:
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, user_email: str) -> User | None:
        stmt = select(User).where(User.email == user_email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
    
    async def insert_user(self, user: User) -> User:
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
