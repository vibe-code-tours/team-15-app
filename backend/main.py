from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from routers import (
    auth, users, listings, categories, requests, messages,
    notifications, reports, admin, pickups, referrals, search, browse,
)

settings = get_settings()

app = FastAPI(title="ReVive API")

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


@app.get("/")
def read_root():
    return {"message": "Welcome to the ReVive Backend API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
