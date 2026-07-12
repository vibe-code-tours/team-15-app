# ReVive Backend

FastAPI backend for the ReVive e-waste donation platform.

## Project Structure

```
Backend/
├── main.py              # App entry point, CORS, router registration
├── config.py            # Settings (DATABASE_URL, SECRET_KEY, etc.)
├── database.py          # Database connection and session
├── dependencies.py      # Auth dependency (get_current_user)
├── models/              # Database models (one file per domain)
│   ├── __init__.py      # Re-exports all models
│   ├── base.py          # Shared enums (UserStatus, AuthProvider)
│   ├── auth.py          # User, OTPCode
│   ├── regions.py       # Region
│   ├── categories.py    # Category
│   ├── listings.py      # Listing, ListingPhoto, WatchlistItem
│   ├── requests.py      # Request, Message
│   ├── moderation.py    # Report, AdminAction
│   ├── notifications.py # Notification
│   ├── pickups.py       # Pickup (e-waste listings)
│   ├── referrals.py     # Referral
│   ├── gamification.py  # UserPoints, ImpactEvent
│   └── settings.py      # UserSetting
├── schemas/             # Request/response validation (Pydantic)
│   ├── auth.py, user.py, listing.py, pickup.py
│   ├── referral.py, search.py, admin.py
│   ├── request.py, message.py, notification.py
│   ├── report.py, category.py, user_settings.py
│   └── response.py      # Response wrapper helpers
├── routers/             # API endpoints
│   ├── auth.py          # Register, login, get current user
│   ├── users.py         # User profile, stats, settings
│   ├── listings.py      # Listing CRUD (marketplace)
│   ├── pickups.py       # Pickup CRUD (e-waste donations)
│   ├── categories.py    # Category list
│   ├── requests.py      # Item requests between users
│   ├── messages.py      # Messaging between users
│   ├── referrals.py     # Referral codes and stats
│   ├── search.py        # Search pickups with filters
│   ├── admin.py         # Admin stats, reports, actions
│   ├── notifications.py # User notifications
│   └── reports.py       # Content reporting
├── services/            # Business logic
│   ├── auth_service.py      # Password hashing, JWT tokens
│   ├── pickup_service.py    # Pickup CRUD, search logic
│   ├── referral_service.py  # Referral codes, gamification
│   ├── admin_service.py     # Admin dashboard stats
│   └── user_service.py      # User stats, settings, export
├── tests/               # Tests
│   ├── conftest.py      # Test fixtures and setup
│   ├── test_auth.py     # Auth endpoint tests
│   ├── test_listings.py # Listing CRUD tests
│   └── test_pickups.py  # Pickup, search, referral tests
├── alembic/             # Database migrations
│   └── versions/        # Migration files
├── alembic.ini          # Alembic config
├── requirements.txt     # Python dependencies
└── .env.example         # Environment variables template
```

## How to Run

### 1. Install Python dependencies

```bash
cd Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` if needed. Default values work for local development.

### 3. Set up the database

You need PostgreSQL running. Then create the database and run migrations:

```bash
# Create database (run in psql or pgAdmin)
CREATE DATABASE revive_db;

# Run migrations
alembic upgrade head
```

### 4. Start the server

```bash
uvicorn main:app --reload
```

The server starts at `http://localhost:8000`.

### 5. Open API docs

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## How to Run Tests

Tests use SQLite (no PostgreSQL needed):

```bash
source .venv/bin/activate
python -m pytest tests/ -v
```

## API Overview

All endpoints use the format: `{ success: true, data: ... }`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create account |
| `/api/auth/login` | POST | Login, get token |
| `/api/auth/me` | GET | Get current user |
| `/api/pickups/` | GET/POST | List/create e-waste pickups |
| `/api/pickups/{id}` | GET/PATCH/DELETE | Get/update/delete pickup |
| `/api/search/` | POST | Search pickups with filters |
| `/api/search/stats` | GET | Search breakdown stats |
| `/api/referrals/` | GET | Get referral code and stats |
| `/api/referrals/` | POST | Apply a referral code |
| `/api/users/me` | GET/PUT | Get/update profile |
| `/api/users/me/stats` | GET | Get user stats |
| `/api/admin/stats` | GET | Admin dashboard stats |
| `/api/admin/pickups` | GET | All pickups (admin) |
| `/api/admin/users` | GET | All users (admin) |
| `/api/listings/` | GET/POST | Marketplace listings |
| `/api/categories/` | GET | List categories |
| `/api/requests/` | GET/POST | Item requests |
| `/api/messages/{id}` | GET/POST | Messages per request |
| `/api/notifications/` | GET | User notifications |
| `/api/reports/` | POST | Report content |

## Tech Stack

- **FastAPI** - Web framework
- **SQLAlchemy** - Database ORM
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **JWT (python-jose)** - Authentication tokens
- **bcrypt (passlib)** - Password hashing
- **pytest** - Testing
