from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.scheduler_setup import start_scheduler, scheduler
from app.routers.api_router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)

app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Jobfi API"}
