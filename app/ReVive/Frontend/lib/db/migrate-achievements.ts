import Database from "better-sqlite3"

// Run this script to create the user_achievements table
// Usage: npx tsx lib/db/migrate-achievements.ts

function migrate() {
  const sqlite = new Database("./revive.db")

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      unlocked_at TEXT NOT NULL,
      seen INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS userAchievements_userId_idx ON user_achievements(user_id);
    CREATE INDEX IF NOT EXISTS userAchievements_achievementId_idx ON user_achievements(achievement_id);
  `)

  sqlite.close()
  console.log("✅ User achievements table created successfully!")
}

migrate()
