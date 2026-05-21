from datetime import datetime, timedelta, timezone
from app.models.user import User, UserCreateLogin
import bcrypt
from app.repositories.user_repository import UserRepository
from jose import JWTError, jwt
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
import os

load_dotenv()

JWT_SECRET = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "14"))


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


def create_verification_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=60) # 1 hour
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def create_password_reset_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=15) # 15 minutes
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not isinstance(username, str):
            return None
        return payload
    except JWTError:
        return None


async def register_user(user: UserCreateLogin, session: AsyncSession) -> User:
    usr_repo = UserRepository(session)
    is_usr_present = await usr_repo.get_by_email(user_email=user.email)

    if is_usr_present:
        raise ValueError("User already exists")

    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")
    now = datetime.now(timezone.utc)
    new_user = User(
        email=user.email,
        password=hashed_password,
        created_datetime=now,
        updated_datetime=now,
    )
    inserted_usr = await usr_repo.insert_user(new_user)
    return inserted_usr


async def login_user(user: UserCreateLogin, session: AsyncSession):
    usr_repo = UserRepository(session)
    usr = await usr_repo.get_by_email(user_email=user.email)

    if usr is None:
        raise ValueError("User with this email doesn't exist")

    if not bcrypt.checkpw(user.password.encode("utf-8"), usr.password.encode("utf-8")):
        raise ValueError("Password doesn't match")

    if not usr.is_verified:
        raise ValueError("Email is not verified. Please check your inbox.")

    access_token = create_access_token(data={"sub": usr.email, "id": str(usr.id)})
    refresh_token = create_refresh_token(data={"sub": usr.email, "id": str(usr.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }
