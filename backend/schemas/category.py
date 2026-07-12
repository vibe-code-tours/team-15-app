from pydantic import BaseModel, ConfigDict
from uuid import UUID


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    parent_category_id: UUID | None = None
