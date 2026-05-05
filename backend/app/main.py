from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.scheduler_setup import start_scheduler, scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    pass
