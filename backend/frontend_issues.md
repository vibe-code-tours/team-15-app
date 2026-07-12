# Frontend API Integration Issues

This document lists issues that require changes on the **Frontend** side to integrate with the FastAPI backend. All Backend-side fixes have already been applied.

---

## Issue 1: Response Wrapper Access Pattern

**Status:** Backend fixed ✅ | Frontend needs update ⚠️

The Backend now returns all responses in the `{ success: true, data: ... }` format that the Frontend's `withAuth` middleware expects. However, the Frontend currently calls its own internal Next.js API routes (which also use this wrapper). When switching to call the Backend directly, the Frontend must ensure it reads from `response.data` (not `response` directly).

**Affected routes:**
- `GET /api/pickups/` — Frontend expects `response.data.items`
- `POST /api/pickups/` — Frontend expects `response.data.success`
- `GET /api/referrals/` — Frontend expects `response.data.code`, `response.data.stats`
- `GET /api/admin/stats` — Frontend expects `response.data.totalPickups`, etc.
- `GET /api/users/me/stats` — Frontend expects `response.data.totalPickups`, etc.
- `GET /api/user/profile` — Frontend expects `response.data.user`, `response.data.stats`

**Action needed:** Update all `fetch()` calls in the Frontend to read from the `.data` property of the JSON response.

---

## Issue 2: API Base URL Configuration

**Status:** Frontend needs update ⚠️

The Frontend currently calls its own API routes at `/api/...` (same origin). To call the Backend, the Frontend needs to point to `http://localhost:8000/api/...`.

**Action needed:**
1. Add `NEXT_PUBLIC_API_URL=http://localhost:8000` to Frontend `.env.local`
2. Update all `fetch()` calls to use `${process.env.NEXT_PUBLIC_API_URL}/api/...`

---

## Issue 3: Auth Token Handling

**Status:** Frontend needs update ⚠️

The Backend uses JWT Bearer tokens (`Authorization: Bearer <token>`). The Frontend currently uses better-auth sessions (cookies). When switching to the Backend:

**Action needed:**
1. Store the JWT token from `POST /api/auth/login` response (in `response.data.accessToken`)
2. Send it as `Authorization: Bearer <token>` header on all authenticated requests
3. Remove or bypass the better-auth `withAuth` middleware for Backend calls

---

## Issue 4: Field Naming Convention

**Status:** Backend fixed ✅ | Frontend already compatible ✅

The Backend now returns camelCase field names matching the Frontend's expectations:
- `deviceName` (not `device_name`)
- `pickupDate` (not `pickup_date`)
- `userId` (not `user_id`)
- `createdAt` (not `created_at`)
- `totalPickups` (not `total_pickups`)
- `referralUrl` (not `referral_url`)

No Frontend changes needed for field names.

---

## Issue 5: Referral Apply Endpoint Path

**Status:** Backend fixed ✅ | Frontend needs update ⚠️

The Backend's referral apply endpoint is at `POST /api/referrals/` (root of referrals resource). The Frontend currently calls `POST /api/referrals` which matches.

**Action needed:** None — paths are aligned.

---

## Issue 6: Pickups List Response Shape

**Status:** Backend fixed ✅ | Frontend needs update ⚠️

The Backend now returns paginated pickups in:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 10,
    "page": 1,
    "totalPages": 2
  }
}
```

The Frontend's `createPaginatedResponse` uses `totalPages` (camelCase). The Backend uses `totalPages` in the response. This matches.

**Action needed:** Ensure the Frontend reads from `response.data.items` (not `response.data` directly).

---

## Issue 7: Search Response (No Wrapper)

**Status:** Backend fixed ✅ | Frontend already compatible ✅

The search endpoints (`POST /api/search/` and `GET /api/search/stats`) return raw JSON without the `{ success, data }` wrapper, matching the Frontend's current behavior. Field names are camelCase.

No changes needed.

---

## Issue 8: Delete Response Format

**Status:** Backend fixed ✅ | Frontend needs update ⚠️

The Backend's `DELETE /api/pickups/{id}` now returns a success response body (not just 204 No Content) to match the Frontend's expectation of `{ success: true, data: { success: true }, message: "Listing deleted" }`.

**Action needed:** Verify the Frontend handles the response body on DELETE (it may ignore it).

---

## Issue 9: User Profile Response Shape

**Status:** Backend fixed ✅ | Frontend needs update ⚠️

The Backend's `GET /api/users/me` returns:
```json
{
  "success": true,
  "data": { "id": "...", "name": "...", "email": "..." }
}
```

The Frontend's `GET /api/user/profile` expects:
```json
{
  "success": true,
  "data": { "user": { "id": "...", "name": "...", "email": "..." }, "stats": { ... } }
}
```

**Action needed:** Either:
1. Update the Backend to nest user under `data.user` and include stats, OR
2. Update the Frontend to call `GET /api/users/me` for profile and `GET /api/users/me/stats` for stats separately

---

## Summary

| Issue | Backend Status | Frontend Action Required |
|-------|---------------|------------------------|
| Response wrapper format | ✅ Fixed | Update `fetch()` calls to read `.data` |
| API base URL | ✅ N/A | Add `NEXT_PUBLIC_API_URL` env var |
| Auth token handling | ✅ JWT ready | Switch from cookie sessions to Bearer tokens |
| Field naming (camelCase) | ✅ Fixed | None |
| Referral apply path | ✅ Aligned | None |
| Pickups list pagination | ✅ Fixed | Read from `response.data.items` |
| Search response format | ✅ Aligned | None |
| Delete response body | ✅ Fixed | Verify DELETE handling |
| User profile shape | ✅ Fixed | Decide on nested vs separate calls |
