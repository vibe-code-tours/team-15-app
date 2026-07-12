---
name: backend-api
description: Create and manage FastAPI backend API endpoints with proper schemas, routers, services, and tests.
---

# Backend API Skill

This skill helps create and manage FastAPI backend API endpoints for the ReVive e-waste platform.

## When to Use

- Creating new API endpoints
- Modifying existing endpoints
- Adding new database models
- Creating Pydantic schemas
- Writing API tests

## Workflow

1. **Understand the requirement** — what data needs to be exposed/modified
2. **Define schemas** — Pydantic models for request/response in `schemas/`
3. **Create/update models** — SQLAlchemy ORM models in `models.py` if new tables needed
4. **Generate migration** — `alembic revision --autogenerate -m "description"`
5. **Build router** — FastAPI APIRouter with endpoints in `routers/`
6. **Add service logic** — Business logic in `services/` for complex operations
7. **Register router** — Add `app.include_router()` in `main.py`
8. **Write tests** — pytest tests in `tests/`
9. **Verify** — Run `python -m pytest tests/ -v`

## Conventions

- All routers use `/api` prefix
- Protected endpoints use `Depends(get_current_user)`
- Use `ConfigDict(from_attributes=True)` for ORM-compatible response schemas
- UUID comparisons: wrap string IDs with `uuid.UUID(str_value)`
- Services layer separates business logic from HTTP concerns

## File Templates

### Router
```python
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from schemas.<domain> import <Schemas>
import models

router = APIRouter(prefix="/api/<domain>", tags=["<domain>"])
```

### Schema
```python
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

class <Name>Response(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    # fields...
```

### Service
```python
from sqlalchemy.orm import Session
import models

def <function_name>(db: Session, ...) -> <return_type>:
    # business logic
    pass
```
