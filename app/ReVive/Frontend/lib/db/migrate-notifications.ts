import Database from "better-sqlite3"

// Run this script to create the notifications table
// Usage: npx tsx lib/db/migrate-notifications.ts

function migrate() {
  const sqlite = new Database("./revive.db")

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      action_url TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS notifications_userId_idx ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read);
    CREATE INDEX IF NOT EXISTS notifications_createdAt_idx ON notifications(created_at);
  `)

  sqlite.close()
  console.log("✅ Notifications table created successfully!")
}

migrate()
