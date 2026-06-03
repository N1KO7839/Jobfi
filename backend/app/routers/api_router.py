from fastapi import APIRouter
from app.routers import auth, offers, preferences

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(offers.router, prefix="/offers", tags=["offers"])
api_router.include_router(preferences.router, prefix="/preferences", tags=["preferences"])

