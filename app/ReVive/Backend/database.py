import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Default to a local postgres database if env var is not set
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/revive_db"
)

# For SQLAlchemy 2.0+ with PostgreSQL, asyncpg is often preferred for async operations,
# but for a standard sync setup psycopg2 is used. We will stick to a standard sync 
# engine for now, which can easily be upgraded to async later if needed.
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
