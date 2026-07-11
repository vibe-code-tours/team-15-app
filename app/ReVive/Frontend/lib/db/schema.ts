import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.
// All boolean fields stored as text, all dates stored as ISO strings.

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: text("emailVerified").notNull().default("false"),
  image: text("image"),
  createdAt: text("createdAt").notNull().default(""),
  updatedAt: text("updatedAt").notNull().default(""),
})

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: text("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: text("createdAt").notNull().default(""),
  updatedAt: text("updatedAt").notNull().default(""),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: text("accessTokenExpiresAt"),
  refreshTokenExpiresAt: text("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: text("createdAt").notNull().default(""),
  updatedAt: text("updatedAt").notNull().default(""),
})

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: text("expiresAt").notNull(),
  createdAt: text("createdAt").default(""),
  updatedAt: text("updatedAt").default(""),
})

// --- App tables ------------------------------------------------------------
// Scoped per user via the `userId` column.

export const pickups = sqliteTable("pickups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull(),
  category: text("category").notNull(),
  deviceName: text("deviceName").notNull(),
  quantity: integer("quantity").notNull().default(1),
  condition: text("condition").notNull().default("working"),
  pickupDate: text("pickupDate").notNull(),
  timeSlot: text("timeSlot").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("scheduled"),
  createdAt: text("createdAt").notNull().default(""),
}, (table) => [
  index("pickups_userId_idx").on(table.userId),
])

// --- Referral & Gamification tables -----------------------------------------

export const referrals = sqliteTable("referrals", {
  id: text("id").primaryKey(),
  referrerId: text("referrer_id").notNull().references(() => user.id),
  referredId: text("referred_id").references(() => user.id),
  referralCode: text("referral_code").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, completed, expired
  createdAt: text("created_at").notNull().default(""),
  completedAt: text("completed_at"),
}, (table) => [
  index("referrals_referrerId_idx").on(table.referrerId),
  index("referrals_referredId_idx").on(table.referredId),
  index("referrals_status_idx").on(table.status),
])

export const userPoints = sqliteTable("user_points", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id).unique(),
  totalPoints: integer("total_points").notNull().default(0),
  doublePointsEarned: integer("double_points_earned").notNull().default(0),
  referralsMade: integer("referrals_made").notNull().default(0),
  co2SavedFromReferrals: real("co2_saved_from_referrals").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(""),
})

export const impactEvents = sqliteTable("impact_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  pickupId: integer("pickup_id").references(() => pickups.id),
  type: text("type").notNull(), // donation, referral_bonus, double_impact
  points: integer("points").notNull(),
  co2Saved: real("co2_saved"),
  referralId: text("referral_id").references(() => referrals.id),
  createdAt: text("created_at").notNull().default(""),
}, (table) => [
  index("impactEvents_userId_idx").on(table.userId),
  index("impactEvents_referralId_idx").on(table.referralId),
])
