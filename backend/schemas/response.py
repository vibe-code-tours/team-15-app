from pydantic import BaseModel
from typing import Any, Generic, TypeVar

T = TypeVar("T")


class SuccessResponse(BaseModel):
    success: bool = True
    data: Any = None
    message: str | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: str


class PaginatedData(BaseModel):
    items: list[Any]
    total: int
    page: int
    total_pages: int


def success_response(data: Any = None, message: str | None = None) -> dict:
    return {"success": True, "data": data, "message": message}


def error_response(error: str) -> dict:
    return {"success": False, "error": error}


def paginated_response(items: list, total: int, page: int, total_pages: int) -> dict:
    return {
        "success": True,
        "data": {
            "items": items,
            "total": total,
            "page": page,
            "totalPages": total_pages,
        },
    }
