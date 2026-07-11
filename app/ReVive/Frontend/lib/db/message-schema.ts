import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

// Conversations table
export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  listingId: integer("listing_id"),
  donorId: text("donor_id").notNull(),
  requesterId: text("requester_id").notNull(),
  status: text("status").notNull().default("active"), // active, closed, archived
  lastMessageAt: text("last_message_at"),
  createdAt: text("created_at").notNull().default(""),
}, (table) => [
  index("conversations_donorId_idx").on(table.donorId),
  index("conversations_requesterId_idx").on(table.requesterId),
])

// Messages table
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  senderId: text("sender_id").notNull(),
  content: text("content").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(""),
}, (table) => [
  index("messages_conversationId_idx").on(table.conversationId),
  index("messages_senderId_idx").on(table.senderId),
])

// Item requests table
export const itemRequests = sqliteTable("item_requests", {
  id: text("id").primaryKey(),
  listingId: integer("listing_id").notNull(),
  requesterId: text("requester_id").notNull(),
  donorId: text("donor_id").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, completed
  createdAt: text("created_at").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(""),
}, (table) => [
  index("itemRequests_listingId_idx").on(table.listingId),
  index("itemRequests_requesterId_idx").on(table.requesterId),
  index("itemRequests_donorId_idx").on(table.donorId),
])

// Flagged content table
export const flaggedContent = sqliteTable("flagged_content", {
  id: text("id").primaryKey(),
  reporterId: text("reporter_id").notNull(),
  targetType: text("target_type").notNull(), // listing, user, message
  targetId: text("target_id").notNull(),
  reason: text("reason").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, reviewed, resolved, dismissed
  createdAt: text("created_at").notNull().default(""),
}, (table) => [
  index("flaggedContent_targetType_targetId_idx").on(table.targetType, table.targetId),
  index("flaggedContent_status_idx").on(table.status),
])

// Saved items / Watchlist table
export const savedItems = sqliteTable("saved_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  listingId: integer("listing_id").notNull(),
  createdAt: text("created_at").notNull().default(""),
}, (table) => [
  index("savedItems_userId_idx").on(table.userId),
  index("savedItems_listingId_idx").on(table.listingId),
])
