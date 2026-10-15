CREATE TABLE IF NOT EXISTS gov_users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL, department TEXT NOT NULL, grants TEXT NOT NULL, password_hash TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS gov_records (id TEXT PRIMARY KEY, department TEXT NOT NULL, kind TEXT NOT NULL, title TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', payload TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, author TEXT NOT NULL, updated_at TEXT NOT NULL, approved_by TEXT, approved_at TEXT);
CREATE INDEX IF NOT EXISTS gov_records_department_idx ON gov_records(department,updated_at DESC);
CREATE TABLE IF NOT EXISTS gov_audit (id TEXT PRIMARY KEY, record_id TEXT NOT NULL, department TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL, revision INTEGER NOT NULL, snapshot TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS gov_audit_record_idx ON gov_audit(record_id,created_at DESC);
