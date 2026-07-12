# ReVive Backend (FastAPI)

## Project Overview

FastAPI backend for the ReVive peer-to-peer e-waste donation platform. Provides REST API endpoints for authentication, listings, requests, messaging, referrals, gamification, admin, and search.

## Tech Stack

- **Framework**: FastAPI + Uvicorn
- **Language**: Python 3.13
- **Database**: PostgreSQL (SQLAlchemy 2.0 ORM + Alembic migrations)
- **Auth**: JWT (python-jose) + bcrypt (passlib)
- **Validation**: Pydantic v2
- **Testing**: pytest + httpx

## Commands

```bash
# Setup
cp .env.example .env
source .venv/bin/activate
pip install -r requirements.txt

# Database
alembic upgrade head           # Apply migrations
alembic revision --autogenerate -m "msg"  # Generate migration

# Run
uvicorn main:app --reload      # Start dev server on :8000
# Swagger docs at http://localhost:8000/docs

# Test
python -m pytest tests/ -v
```

## Architecture

```
Backend/
├── main.py              # App entry, CORS, router registration
├── config.py            # Settings via pydantic-settings
├── database.py          # SQLAlchemy engine + session
├── dependencies.py      # get_current_user (JWT auth)
├── models.py            # All SQLAlchemy ORM models
├── schemas/             # Pydantic request/response models
├── routers/             # API endpoint modules
├── services/            # Business logic layer
├── tests/               # pytest tests
└── alembic/             # Database migrations
```

## Key Conventions

- All routers use `/api` prefix
- Auth-protected endpoints use `Depends(get_current_user)`
- UUID primary keys; wrap with `uuid.UUID(str_val)` for SQLite test compatibility
- Response schemas use `ConfigDict(from_attributes=True)`
- Business logic in `services/`, not in routers
- Soft delete via `status` field or `archived_at`

## Environment Variables

See `.env.example` for required configuration:
- `DATABASE_URL` — PostgreSQL connection string
- `SECRET_KEY` — JWT signing secret
- `CORS_ORIGINS` — Allowed frontend origins
