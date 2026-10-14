CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  discord TEXT NOT NULL,
  phone TEXT NOT NULL,
  district TEXT NOT NULL,
  profession TEXT NOT NULL,
  interest TEXT NOT NULL,
  motivation TEXT NOT NULL,
  availability TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'nouvelle',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  fingerprint TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS applications_created_idx ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS applications_discord_idx ON applications(lower(discord));
CREATE INDEX IF NOT EXISTS applications_fingerprint_idx ON applications(fingerprint);
CREATE TABLE IF NOT EXISTS login_limits (
  id TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  reset_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS content_history (revision INTEGER PRIMARY KEY, payload TEXT NOT NULL, author TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS inbox (id TEXT PRIMARY KEY, kind TEXT NOT NULL, event_id TEXT NOT NULL DEFAULT '', name TEXT NOT NULL, discord TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'nouveau', created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS inbox_created_idx ON inbox(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS inbox_event_unique ON inbox(event_id,lower(discord)) WHERE kind='event';
