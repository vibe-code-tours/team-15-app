import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

// User achievements table - tracks unlocked achievements
export const userAchievements = sqliteTable("user_achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: text("unlocked_at").notNull(),
  seen: integer("seen", { mode: "boolean" }).notNull().default(false),
}, (table) => [
  index("userAchievements_userId_idx").on(table.userId),
  index("userAchievements_achievementId_idx").on(table.achievementId),
])
