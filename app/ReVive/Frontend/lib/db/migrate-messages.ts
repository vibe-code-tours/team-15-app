import Database from "better-sqlite3"

// Run this script to create messaging and flagging tables
// Usage: npx tsx lib/db/migrate-messages.ts

function migrate() {
  const sqlite = new Database("./revive.db")

  sqlite.exec(`
    -- Conversations table
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      listing_id INTEGER,
      donor_id TEXT NOT NULL,
      requester_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      last_message_at TEXT,
      created_at TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (donor_id) REFERENCES user(id) ON DELETE CASCADE,
      FOREIGN KEY (requester_id) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS conversations_donorId_idx ON conversations(donor_id);
    CREATE INDEX IF NOT EXISTS conversations_requesterId_idx ON conversations(requester_id);

    -- Messages table
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS messages_conversationId_idx ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS messages_senderId_idx ON messages(sender_id);

    -- Item requests table
    CREATE TABLE IF NOT EXISTS item_requests (
      id TEXT PRIMARY KEY,
      listing_id INTEGER NOT NULL,
      requester_id TEXT NOT NULL,
      donor_id TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (requester_id) REFERENCES user(id) ON DELETE CASCADE,
      FOREIGN KEY (donor_id) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS itemRequests_listingId_idx ON item_requests(listing_id);
    CREATE INDEX IF NOT EXISTS itemRequests_requesterId_idx ON item_requests(requester_id);
    CREATE INDEX IF NOT EXISTS itemRequests_donorId_idx ON item_requests(donor_id);

    -- Flagged content table
    CREATE TABLE IF NOT EXISTS flagged_content (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (reporter_id) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS flagged_content_status_idx ON flagged_content(status);

    -- Saved items / Watchlist table
    CREATE TABLE IF NOT EXISTS saved_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      listing_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS saved_items_userId_idx ON saved_items(user_id);
    CREATE INDEX IF NOT EXISTS saved_items_listingId_idx ON saved_items(listing_id);

    -- Note: User region settings columns are handled in settings-schema.ts
    -- The user_settings table already has city, state, postal_code columns
  `)

  sqlite.close()
  console.log("✅ Messaging, flagging, and saved items tables created successfully!")
}

migrate()
