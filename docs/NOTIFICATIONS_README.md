# Notifications System

## Overview

The notifications system provides real-time updates to users about their pickups, referrals, and achievements.

## Features

- 🔔 **Notification Bell** - Shows unread count in the header
- 📋 **Notification Dropdown** - Quick view of recent notifications
- 📄 **Notifications Page** - Full list with management options
- 🎨 **Type-based Icons** - Visual indicators for different notification types
- ✅ **Read/Unread Status** - Track which notifications have been seen
- 🗑️ **Delete & Clear** - Manage notification history

## Setup

### 1. Run Database Migration

```bash
npx tsx lib/db/migrate-notifications.ts
```

This creates the `notifications` table in your SQLite database.

### 2. Integration Options

#### Option A: Add Bell to Existing Header (Manual)

To add the notification bell to your existing `AppHeader` component, you'll need to:

1. Open `components/app-header.tsx`
2. Import the NotificationBell component:
   ```tsx
   import { NotificationBell } from "@/components/notifications/notification-bell"
   ```
3. Add it to the header layout:
   ```tsx
   <div className="flex items-center gap-2">
     {/* existing header content */}
     <NotificationBell />
   </div>
   ```

#### Option B: Use Standalone Notifications Page

The notifications page is already available at:
```
/dashboard/notifications
```

Users can access it to view and manage all their notifications.

## Notification Types

| Type | Icon | Description |
|------|------|-------------|
| `pickup_scheduled` | 📦 | When a pickup is scheduled |
| `pickup_completed` | ✅ | When a pickup is completed |
| `pickup_cancelled` | ❌ | When a pickup is cancelled |
| `referral_signup` | 👥 | When someone uses your referral code |
| `referral_completed` | 🎊 | When your referral completes first pickup |
| `milestone_reached` | 🏆 | When you achieve a milestone |
| `system` | 🔔 | General system notifications |

## Usage Examples

### Creating Notifications

Notifications are created automatically through server actions:

```tsx
import { notifyPickupCompleted } from "@/app/actions/notifications"

// When a pickup is completed
await notifyPickupCompleted(userId, pickupId, "iPhone 12", 200)
```

### Manual Notification Creation

```tsx
import { createNotification } from "@/app/actions/notifications"

await createNotification({
  userId: "user-id",
  type: "system",
  title: "Welcome!",
  message: "Welcome to ReVive!",
  actionUrl: "/dashboard",
})
```

## File Structure

```
lib/
├── db/
│   └── notification-schema.ts     # Database schema
│   └── migrate-notifications.ts   # Migration script
└── notifications/
    ├── types.ts                   # TypeScript types
    └── templates.ts               # Notification templates

app/
├── actions/
│   └── notifications.ts           # Server actions
└── dashboard/
    └── notifications/
        └── page.tsx               # Notifications page

components/
└── notifications/
    ├── notification-bell.tsx           # Bell icon with count
    ├── notification-bell-wrapper.tsx   # Easy integration wrapper
    ├── notification-dropdown.tsx       # Dropdown panel
    ├── notification-item.tsx           # Single notification
    └── notification-list.tsx           # Full notifications list
```

## API Reference

### Server Actions

#### `createNotification(input: NotificationInput)`
Create a new notification.

#### `getNotifications(limit?: number)`
Get notifications for the current user.

#### `getUnreadCount()`
Get count of unread notifications.

#### `markAsRead(id: string)`
Mark a single notification as read.

#### `markAllAsRead()`
Mark all notifications as read.

#### `deleteNotification(id: string)`
Delete a single notification.

#### `clearAllNotifications()`
Delete all notifications for the current user.

### Helper Functions

#### `notifyPickupScheduled(userId, pickupId, deviceName, pickupDate)`
Create a pickup scheduled notification.

#### `notifyPickupCompleted(userId, pickupId, deviceName, points)`
Create a pickup completed notification.

#### `notifyReferralSignup(referrerId, referrerName, referralCode)`
Create a referral signup notification.

#### `notifyReferralCompleted(referrerId, points)`
Create a referral completed notification.

#### `notifyMilestone(userId, milestone)`
Create a milestone notification.

## Customization

### Adding New Notification Types

1. Add the type to `lib/notifications/types.ts`:
   ```tsx
   export type NotificationType = 
     | "existing_type"
     | "new_type"
   ```

2. Add template in `lib/notifications/templates.ts`:
   ```tsx
   new_type: {
     title: "New Notification",
     message: (m) => `Your custom message with ${m.someField}`,
     actionUrl: () => "/some-page",
   },
   ```

3. Create helper function in `app/actions/notifications.ts`:
   ```tsx
   export async function notifyNewType(userId: string, someField: string) {
     return createNotification({
       userId,
       type: "new_type",
       title: "",
       message: "",
       metadata: { someField },
     })
   }
   ```

## Notes

- Notifications are created server-side via server actions
- The notification bell polls for updates every 30 seconds
- All notifications are scoped to the authenticated user
- The `metadata` field stores additional context as JSON
- Notifications are soft-deleted (removed from list but not database)
