# Create New Backend API Endpoint

Analyze the request and create a new FastAPI endpoint following project conventions.

## Steps

1. **Define the schema** in `schemas/` — request body (Create/Update) and response model
2. **Create the router** in `routers/` with proper prefix and tags
3. **Add business logic** in `services/` if complex (simple CRUD can stay in router)
4. **Register the router** in `main.py` with `app.include_router()`
5. **Write tests** in `tests/` covering happy path + error cases
6. **Run tests** to verify everything works

## Request

$ARGUMENTS
