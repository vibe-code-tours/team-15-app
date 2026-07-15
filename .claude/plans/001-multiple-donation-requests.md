# Plan: Support Multiple Requests per Donation Item + Donor Browse View

## Problem
The `pickups` table currently has a single `requested_by` column, meaning only ONE user can request a donation item at a time. When a new request comes in, it overwrites the previous requester's data. The donor also has no dedicated browse view to see all requests across their items.

## Goal
1. Allow multiple users to request the same donation item
2. Let the donor accept/reject individual requests (accepting one rejects all others)
3. Give the donor a browse-style view to see all incoming requests

---

## Changes

### 1. New Model: `PickupRequest` (`Backend/models/pickup_requests.py`)

Create a new table `pickup_requests`:

| Column | Type | Notes |
|--------|------|-------|
| `id` | Integer PK | auto-increment |
| `pickup_id` | Integer FK → pickups.id | the item being requested |
| `requester_id` | String | user_id of requester |
| `pickup_from` | String nullable | requester preferred start date |
| `pickup_to` | String nullable | requester preferred end date |
| `time_slot` | String nullable | requester preferred time |
| `status` | String | "pending", "accepted", "rejected" |
| `created_at` | String | ISO timestamp |

Composite unique index on `(pickup_id, requester_id)` to prevent duplicate requests.

### 2. Update Model: `Pickup` (`Backend/models/pickups.py`)

- Remove columns: `requested_by`, `requested_pickup_from`, `requested_pickup_to`, `requested_time_slot`
- Add relationship: `requests = relationship("PickupRequest", back_populates="pickup", cascade="all, delete-orphan")`

### 3. Alembic Migration (`Backend/alembic/versions/006_add_pickup_requests.py`)

- Create `pickup_requests` table
- Drop old request columns from `pickups`
- Data migration: copy any existing `requested_by` data into the new table

### 4. Update `models/__init__.py`

- Import `PickupRequest` and add to `__all__`

### 5. Update Service: `pickup_service.py`

- `request_pickup()` → Insert into `pickup_requests` table (instead of updating pickup columns). Allow if pickup status is "available" OR "requested" (to let multiple people request). Only block if status is "accepted" or "picked_up".
- `accept_request()` → Accept a specific `pickup_request` by ID, reject all other pending requests for that pickup, set pickup status to "accepted".
- `reject_request()` → Reject a specific `pickup_request` by ID. If no other pending requests remain, set pickup status back to "available".
- `get_donor_requests()` → Query all `pickup_requests` for pickups owned by the donor, grouped by pickup.
- `get_requested_pickups()` → Query all `pickup_requests` where requester_id matches, joined with pickup info.

### 6. Update Router: `pickups.py`

- Update `_pickup_to_dict()` to include `requests` list from the relationship
- Update `PATCH /{pickup_id}` to accept `request_id` in body for accept/reject actions
- Update `GET /donor-requests` to return grouped data (pickup + list of requests)
- Update `GET /requested` to return pickup info for each request

### 7. Update Schema: `schemas/pickup.py`

- Add `request_id: int | None` to `PickupAction` for targeting specific requests

### 8. Frontend Types (`Frontend/src/features/pickups/types.ts`)

- Add `PickupRequest` type
- Update `Pickup` type to include `requests: PickupRequest[]` instead of single requester fields

### 9. Frontend Service: `account.ts`

- Update `getDonorRequests()` to handle new response shape
- Update `acceptRequest()` and `rejectRequest()` to accept `requestId` parameter

### 10. Frontend Component: `donor-requests-full.tsx`

- Redesign to show each pickup item with a list of requests underneath
- Each request shows requester info + accept/reject buttons
- Accepting one request auto-rejects others (backend handles this)

### 11. Frontend Browse Service: `browse.ts`

- Update `requestItem()` to work with the new backend

### 12. Frontend Browse Grid: `browse-grid.tsx`

- Show request count on items that have requests (for the donor's own items)
- Show "Already Requested" badge if the current user has already requested

---

## File Change Order

1. `Backend/models/pickup_requests.py` (new)
2. `Backend/models/pickups.py` (update)
3. `Backend/models/__init__.py` (update)
4. `Backend/alembic/versions/006_add_pickup_requests.py` (new migration)
5. `Backend/schemas/pickup.py` (update)
6. `Backend/services/pickup_service.py` (major update)
7. `Backend/routers/pickups.py` (update)
8. `Frontend/src/features/pickups/types.ts` (update)
9. `Frontend/src/features/account/services/account.ts` (update)
10. `Frontend/src/features/account/components/donor-requests-full.tsx` (major update)
11. `Frontend/src/features/browse/services/browse.ts` (update)
12. `Frontend/src/features/browse/components/browse-grid.tsx` (minor update)
