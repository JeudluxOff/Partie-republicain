import {db} from './server';
let ready:Promise<void>|undefined;
export function ensureExtras(){return ready??=(async()=>{
await db().prepare("CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1)").run();
await db().prepare("CREATE TABLE IF NOT EXISTS content_history (revision INTEGER PRIMARY KEY, payload TEXT NOT NULL, author TEXT NOT NULL, created_at TEXT NOT NULL)").run();
await db().prepare("CREATE TABLE IF NOT EXISTS inbox (id TEXT PRIMARY KEY, kind TEXT NOT NULL, event_id TEXT NOT NULL DEFAULT '', name TEXT NOT NULL, discord TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'nouveau', created_at TEXT NOT NULL)").run();
await db().prepare("CREATE UNIQUE INDEX IF NOT EXISTS inbox_event_unique ON inbox(event_id,lower(discord)) WHERE kind='event'").run();
})().catch(e=>{ready=undefined;throw e});}
