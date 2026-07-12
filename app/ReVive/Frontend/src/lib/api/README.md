# API Routes Documentation

## Overview

ReVive provides RESTful API endpoints for external integrations and mobile apps.

## Authentication

All API endpoints require authentication via session cookies or Bearer token.

### Headers

```
Cookie: session=<session-token>
```

or

```
Authorization: Bearer <session-token>
```

## Base URL

```
https://your-domain.com/api
```

## Endpoints

### User Endpoints

#### GET /api/user/profile
Get current user's profile and stats.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "stats": {
      "totalPickups": 5,
      "totalPoints": 500,
      "totalReferrals": 2
    }
  }
}
```

#### PUT /api/user/profile
Update user profile.

**Request Body:**
```json
{
  "name": "New Name"
}
```

#### GET /api/user/stats
Get user statistics.

---

### Pickups Endpoints

#### GET /api/pickups
Get all pickups for the authenticated user.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 50)
- `status` (string: "scheduled" | "completed" | "cancelled")

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 25,
    "page": 1,
    "totalPages": 2
  }
}
```

#### POST /api/pickups
Create a new pickup.

**Request Body:**
```json
{
  "category": "Phones",
  "deviceName": "iPhone 12",
  "quantity": 1,
  "condition": "working",
  "pickupDate": "2024-12-20",
  "timeSlot": "morning",
  "address": "123 Main St, City"
}
```

#### GET /api/pickups/[id]
Get specific pickup details.

#### PATCH /api/pickups/[id]
Update pickup status.

**Request Body:**
```json
{
  "action": "complete" | "cancel"
}
```

#### DELETE /api/pickups/[id]
Delete a pickup.

---

### Referrals Endpoints

#### GET /api/referrals
Get referral code and stats.

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "ABC12345",
    "stats": {
      "totalPoints": 500,
      "referralsMade": 3,
      "pendingReferrals": 1
    },
    "referralUrl": "https://revive.app/sign-up?ref=ABC12345"
  }
}
```

#### POST /api/referrals
Apply a referral code.

**Request Body:**
```json
{
  "code": "ABC12345"
}
```

---

### Admin Endpoints

#### GET /api/admin/stats
Get platform statistics (admin only).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPickups": 150,
    "completedPickups": 120,
    "activeUsers": 50,
    "totalCo2Saved": "264.0"
  }
}
```

#### GET /api/search
Search pickups with filters.

**Request Body:**
```json
{
  "filters": {
    "query": "iPhone",
    "status": ["completed"],
    "categories": ["Phones"]
  },
  "page": 1,
  "limit": 10
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- **Authenticated users**: 100 requests per minute
- **Admin endpoints**: 200 requests per minute

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Fetch pickups
const response = await fetch('/api/pickups?page=1&limit=10', {
  credentials: 'include'
})
const { data } = await response.json()
console.log(data.items)

// Create pickup
await fetch('/api/pickups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    category: 'Phones',
    deviceName: 'iPhone 12',
    pickupDate: '2024-12-20',
    timeSlot: 'morning',
    address: '123 Main St'
  })
})
```

### cURL

```bash
# Get pickups
curl -b "session=your-session-token" \
  https://revive.app/api/pickups

# Create pickup
curl -X POST \
  -b "session=your-session-token" \
  -H "Content-Type: application/json" \
  -d '{"category":"Phones","deviceName":"iPhone 12",...}' \
  https://revive.app/api/pickups
```

---

## Webhooks (Future)

Webhooks will be available for:
- Pickup status changes
- New referrals
- Achievement unlocks

Coming soon...
