import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

// Notifications table - separate from main schema to avoid editing existing files
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // pickup_scheduled, pickup_completed, referral_signup, milestone_reached, system
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  actionUrl: text("action_url"), // Optional URL to navigate to when clicked
  metadata: text("metadata"), // JSON string for additional data
  createdAt: text("created_at").notNull().default(""),
}, (table) => [
  index("notifications_userId_idx").on(table.userId),
  index("notifications_read_idx").on(table.read),
  index("notifications_createdAt_idx").on(table.createdAt),
])
