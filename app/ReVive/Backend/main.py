import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from config import get_settings
from database import get_db
from middleware.rate_limit import rate_limiter
from routers import (
    auth, users, listings, categories, requests, messages,
    notifications, reports, admin, pickups, referrals, search, browse,
    upload,
)

settings = get_settings()

async def cleanup_rate_limiter():
    while True:
        await asyncio.sleep(300)
        rate_limiter.cleanup()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    task = asyncio.create_task(cleanup_rate_limiter())
    yield
    # Shutdown
    task.cancel()

app = FastAPI(title="ReVive API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(listings.router)
app.include_router(categories.router)
app.include_router(requests.router)
app.include_router(messages.router)
app.include_router(notifications.router)
app.include_router(reports.router)
app.include_router(admin.router)
app.include_router(pickups.router)
app.include_router(referrals.router)
app.include_router(search.router)
app.include_router(browse.router)
app.include_router(upload.router)

# Serve uploaded files
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/")
def read_root():
    return {"message": "Welcome to the ReVive Backend API"}


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable",
        ) from exc

    return {"status": "ok", "database": "connected"}
