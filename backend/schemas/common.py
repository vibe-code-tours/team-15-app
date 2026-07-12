from pydantic import BaseModel
from typing import Generic, TypeVar

T = TypeVar("T")


class MessageResponse(BaseModel):
    detail: str


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    per_page: int
