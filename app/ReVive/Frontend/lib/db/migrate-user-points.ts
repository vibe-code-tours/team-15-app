import Database from "better-sqlite3"

// Run this script to fix the user_points table (add missing created_at column)
// Usage: node -e "$(cat lib/db/migrate-user-points.ts)" or install tsx

function migrate() {
  const sqlite = new Database("./revive.db")

  // Check if column already exists before adding
  const tableInfo = sqlite.prepare("PRAGMA table_info(user_points)").all()
  const hasCreatedAt = tableInfo.some(
    (col: any) => col.name === "created_at"
  )

  if (!hasCreatedAt) {
    sqlite.exec(`
      ALTER TABLE user_points ADD COLUMN created_at TEXT NOT NULL DEFAULT '';
    `)
    console.log("✅ Added 'created_at' column to user_points table")
  } else {
    console.log("ℹ️  'created_at' column already exists, skipping")
  }

  sqlite.close()
}

migrate()
