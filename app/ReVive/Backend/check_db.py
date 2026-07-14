import os
from sqlalchemy import create_engine, text

# Load DATABASE_URL from .env
from dotenv import load_dotenv
load_dotenv(".env")
database_url = os.environ.get("DATABASE_URL")

engine = create_engine(database_url)
with engine.connect() as conn:
    # Check if images column exists in pickups table
    result = conn.execute(text("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='pickups' AND column_name='images';
    """))
    row = result.fetchone()
    if row:
        print("Column 'images' exists!")
    else:
        print("Column 'images' does NOT exist!")
