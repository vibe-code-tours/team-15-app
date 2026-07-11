import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

// User settings table - separate from main schema
export const userSettings = sqliteTable("user_settings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  emailPickupUpdates: integer("email_pickup_updates", { mode: "boolean" }).notNull().default(true),
  emailReferralAlerts: integer("email_referral_alerts", { mode: "boolean" }).notNull().default(true),
  emailMilestones: integer("email_milestones", { mode: "boolean" }).notNull().default(true),
  pushEnabled: integer("push_enabled", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(""),
})
