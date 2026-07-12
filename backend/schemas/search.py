from pydantic import BaseModel, Field


class SearchFilters(BaseModel):
    query: str = ""
    status: list[str] = []
    categories: list[str] = []
    date_from: str | None = None
    date_to: str | None = None
    condition: list[str] = []
    sort_by: str = "date"
    sort_order: str = "desc"


class SearchRequest(BaseModel):
    filters: SearchFilters = SearchFilters()
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=10, ge=1, le=50)


class SearchResult(BaseModel):
    id: int
    user_id: str
    category: str
    device_name: str
    quantity: int
    condition: str
    pickup_date: str
    time_slot: str
    address: str
    notes: str | None
    status: str
    created_at: str
    match_highlights: dict[str, bool] = {}


class SearchResponse(BaseModel):
    results: list[SearchResult]
    total: int
    page: int
    limit: int
    total_pages: int


class SearchStatsResponse(BaseModel):
    by_status: dict[str, int]
    by_category: dict[str, int]
    by_condition: dict[str, int]
    total_pickups: int
