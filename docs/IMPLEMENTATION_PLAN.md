# ReVive Platform - New Files Implementation Plan

## Current State Assessment

### Already Implemented ✅
1. **User Authentication** - Sign-in/sign-up with better-auth, email/password
2. **Pickup Scheduling** - Multi-step form at `/donate`
3. **Pickup Tracking** - Dashboard with pickup list, cancel/delete functionality
4. **Referral System** - Unique codes, double impact points, referral tracking
5. **Impact Statistics** - CO2 saved, points system, impact timeline
6. **Landing Page** - Complete with hero, features, testimonials, CTA

### Database Schema ✅
- `user` - User accounts
- `session` - Auth sessions
- `pickups` - E-waste pickup requests
- `referrals` - Referral codes and tracking
- `userPoints` - Gamification points
- `impactEvents` - Impact tracking events

---

## Phase 1: Admin Dashboard (New Files)

### Goal
Allow admins to manage pickups, view statistics, and moderate the platform.

### New Files to Create

#### 1. Admin Layout & Authentication
```
app/admin/layout.tsx           - Admin layout with sidebar navigation
app/admin/page.tsx             - Admin dashboard overview
```

#### 2. Pickup Management
```
app/admin/pickups/page.tsx     - List all pickups with filters
components/admin/pickup-table.tsx      - Data table for pickups
components/admin/pickup-detail-modal.tsx - Detailed pickup view
components/admin/pickup-status-badge.tsx - Status indicators
```

#### 3. User Management
```
app/admin/users/page.tsx       - User list and management
components/admin/user-table.tsx        - User data table
components/admin/user-detail-modal.tsx  - User details view
```

#### 4. Admin Statistics
```
app/admin/analytics/page.tsx   - Platform analytics
components/admin/analytics-charts.tsx  - Charts and graphs
components/admin/metric-cards.tsx      - Key metrics display
```

#### 5. Server Actions
```
app/actions/admin.ts           - Admin-only server actions
```

### Implementation Details

**Admin Auth Check** - Use existing `auth.ts` to verify admin status
**Layout** - Sidebar with navigation: Dashboard, Pickups, Users, Analytics
**Pickup Table** - Sortable, filterable table with status management
**Charts** - Use CSS-only charts (no external chart library needed)

---

## Phase 2: Notifications System (New Files)

### Goal
Notify users about pickup status changes, referral activities, and milestones.

### New Files to Create

#### 1. Notification Components
```
components/notifications/notification-bell.tsx    - Bell icon with unread count
components/notifications/notification-dropdown.tsx - Dropdown panel
components/notifications/notification-item.tsx     - Individual notification
components/notifications/notification-list.tsx     - Notification list
```

#### 2. Database & Server Actions
```
lib/db/notification-schema.ts     - Notification table schema (not editing existing schema.ts)
app/actions/notifications.ts     - Notification CRUD operations
```

#### 3. Notification Types
```
lib/notifications/types.ts       - Notification type definitions
lib/notifications/templates.ts   - Notification message templates
```

### Implementation Details

**Schema Extension** - Create separate notification schema file (extends existing schema)
**Real-time** - Use polling or Server-Sent Events for updates
**Types** - pickup_scheduled, pickup_completed, referral_signup, milestone_reached
**Storage** - SQLite table with read/unread status

---

## Phase 3: Advanced Search & Filtering (New Files)

### Goal
Allow users to search and filter their pickup history with advanced options.

### New Files to Create

#### 1. Search Components
```
components/search/search-bar.tsx           - Main search input
components/search/filter-panel.tsx         - Advanced filters
components/search/search-results.tsx       - Results display
components/search/filter-chips.tsx         - Active filter indicators
```

#### 2. Search Page
```
app/dashboard/search/page.tsx    - Dedicated search page
```

#### 3. Search Utilities
```
lib/search/types.ts              - Search type definitions
lib/search/query-builder.ts      - Query construction utilities
```

### Implementation Details

**Search Fields** - Device name, category, address, date range
**Filters** - Status, category, date range, condition
**UI** - Filter chips, collapsible panels, real-time results
**Integration** - Add search button/link to existing dashboard (new component, not editing existing)

---

## Phase 4: User Settings & Profile (New Files)

### Goal
Allow users to manage their profile, preferences, and account settings.

### New Files to Create

#### 1. Settings Pages
```
app/settings/page.tsx           - Settings overview
app/settings/profile/page.tsx   - Profile editing
app/settings/notifications/page.tsx - Notification preferences
app/settings/account/page.tsx   - Account management
```

#### 2. Settings Components
```
components/settings/profile-form.tsx         - Profile editing form
components/settings/notification-preferences.tsx - Notification toggles
components/settings/account-actions.tsx      - Delete account, export data
components/settings/settings-nav.tsx         - Settings navigation
```

### Implementation Details

**Profile** - Name, email display, avatar placeholder
**Notifications** - Toggle email/push notifications per type
**Account** - Change password, delete account, export data (GDPR)
**Navigation** - Add settings link to AppHeader (new component variant)

---

## Phase 5: Enhanced API Routes (New Files)

### Goal
Add RESTful API endpoints for external integrations and mobile apps.

### New Files to Create

#### 1. API Routes
```
app/api/pickups/route.ts        - GET pickups, POST new pickup
app/api/pickups/[id]/route.ts   - GET, PATCH, DELETE specific pickup
app/api/user/profile/route.ts   - GET, PUT user profile
app/api/user/stats/route.ts     - GET user statistics
app/api/referrals/route.ts      - GET referral code, POST apply code
app/api/admin/stats/route.ts    - GET platform statistics (admin only)
```

#### 2. API Utilities
```
lib/api/middleware.ts           - Auth middleware for API routes
lib/api/validators.ts          - Input validation schemas
lib/api/responses.ts           - Standardized response helpers
```

### Implementation Details

**Auth** - Bearer token authentication using existing sessions
**Validation** - Input sanitization and validation
**Error Handling** - Standardized error responses
**Rate Limiting** - Basic rate limiting (can add later)

---

## Phase 6: Achievement System (New Files)

### Goal
Gamify the recycling experience with badges and milestones.

### New Files to Create

#### 1. Achievement Components
```
components/achievements/achievement-badge.tsx     - Badge display
components/achievements/achievement-grid.tsx      - Badge collection
components/achievements/milestone-progress.tsx    - Progress indicators
components/achievements/new-achievement-modal.tsx - Celebration modal
```

#### 2. Achievement Logic
```
lib/achievements/types.ts       - Achievement definitions
lib/achievements/checker.ts     - Achievement unlock logic
app/actions/achievements.ts     - Achievement server actions
```

#### 3. Database (New Table)
```
lib/db/achievement-schema.ts    - User achievements table
```

### Achievement Ideas
- **First Donation** - Complete first pickup
- **Eco Warrior** - Donate 10+ devices
- **Referral Master** - Refer 5 friends
- **CO2 Champion** - Save 50kg+ CO2
- **Streak** - Donate 3 months in a row

---

## Implementation Strategy

### Order of Implementation
1. **Admin Dashboard** (Highest value, enables platform management)
2. **Notifications** (Improves user engagement)
3. **Search & Filtering** (Better UX for power users)
4. **User Settings** (Essential for user control)
5. **API Routes** (Enables future integrations)
6. **Achievement System** (Gamification layer)

### Time Estimates
- **Admin Dashboard**: 2-3 days
- **Notifications**: 1-2 days
- **Search & Filtering**: 1 day
- **User Settings**: 1 day
- **API Routes**: 1-2 days
- **Achievement System**: 1-2 days

**Total Estimated Time**: 7-11 days

### Dependencies
- All phases are independent and can be developed in parallel
- Each phase only adds new files
- No modifications to existing components or pages

### Testing Strategy
- Each new component should be testable independently
- Server actions can be tested via API routes
- UI components can be previewed in isolation

---

## File Structure Summary

```
app/
├── admin/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── pickups/page.tsx
│   ├── users/page.tsx
│   └── analytics/page.tsx
├── settings/
│   ├── page.tsx
│   ├── profile/page.tsx
│   ├── notifications/page.tsx
│   └── account/page.tsx
├── dashboard/
│   └── search/page.tsx (new)
├── api/
│   ├── pickups/route.ts
│   ├── pickups/[id]/route.ts
│   ├── user/profile/route.ts
│   ├── user/stats/route.ts
│   ├── referrals/route.ts
│   └── admin/stats/route.ts

components/
├── admin/
│   ├── pickup-table.tsx
│   ├── pickup-detail-modal.tsx
│   ├── pickup-status-badge.tsx
│   ├── user-table.tsx
│   ├── user-detail-modal.tsx
│   ├── analytics-charts.tsx
│   └── metric-cards.tsx
├── notifications/
│   ├── notification-bell.tsx
│   ├── notification-dropdown.tsx
│   ├── notification-item.tsx
│   └── notification-list.tsx
├── search/
│   ├── search-bar.tsx
│   ├── filter-panel.tsx
│   ├── search-results.tsx
│   └── filter-chips.tsx
├── settings/
│   ├── profile-form.tsx
│   ├── notification-preferences.tsx
│   ├── account-actions.tsx
│   └── settings-nav.tsx
├── achievements/
│   ├── achievement-badge.tsx
│   ├── achievement-grid.tsx
│   ├── milestone-progress.tsx
│   └── new-achievement-modal.tsx

lib/
├── api/
│   ├── middleware.ts
│   ├── validators.ts
│   └── responses.ts
├── search/
│   ├── types.ts
│   └── query-builder.ts
├── notifications/
│   ├── types.ts
│   └── templates.ts
├── achievements/
│   ├── types.ts
│   └── checker.ts
└── db/
    ├── notification-schema.ts
    └── achievement-schema.ts

app/actions/
├── admin.ts
├── notifications.ts
└── achievements.ts
```

---

## Next Steps

1. Review this plan and prioritize phases
2. Start with Phase 1 (Admin Dashboard)
3. Create files incrementally, testing as you go
4. Each phase can be deployed independently
5. Gather feedback and iterate

All implementations will be **new files only** - no modifications to existing code.
