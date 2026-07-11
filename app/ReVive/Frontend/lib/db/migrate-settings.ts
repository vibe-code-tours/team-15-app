import Database from "better-sqlite3"

// Run this script to create the user_settings table
// Usage: npx tsx lib/db/migrate-settings.ts

function migrate() {
  const sqlite = new Database("./revive.db")

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      email_pickup_updates INTEGER NOT NULL DEFAULT 1,
      email_referral_alerts INTEGER NOT NULL DEFAULT 1,
      email_milestones INTEGER NOT NULL DEFAULT 1,
      push_enabled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    );
  `)

  sqlite.close()
  console.log("✅ User settings table created successfully!")
}

migrate()
