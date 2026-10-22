import { createHmac, timingSafeEqual, createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from './server';
import { session } from './auth';
import { GovUser, GovRecord, Grants, Department, Action, departments, actions } from './government';
export const GOV_COOKIE = 'sarp_government';
let ready: Promise<void> | undefined;
export function ensureGov() {
    return ready ??= (async () => {
        await db().prepare("CREATE TABLE IF NOT EXISTS gov_users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL, department TEXT NOT NULL, grants TEXT NOT NULL, password_hash TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1)").run();
        await db().prepare("CREATE TABLE IF NOT EXISTS gov_records (id TEXT PRIMARY KEY, department TEXT NOT NULL, kind TEXT NOT NULL, title TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', payload TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, author TEXT NOT NULL, updated_at TEXT NOT NULL, approved_by TEXT, approved_at TEXT)").run();
        await db().prepare("CREATE TABLE IF NOT EXISTS gov_audit (id TEXT PRIMARY KEY, record_id TEXT NOT NULL, department TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL, revision INTEGER NOT NULL, snapshot TEXT NOT NULL, created_at TEXT NOT NULL)").run();
    })().catch(e => { ready = undefined; throw e; });
}
function sign(s: string) { return createHmac('sha256', process.env.SESSION_SECRET!).update('government-v1|' + s).digest('base64url'); }
export function govToken(u: {
    id: string;
    version: number;
}) { const p = Buffer.from(JSON.stringify({ id: u.id, version: u.version, expires: Date.now() + 43200000 })).toString('base64url'); return p + '.' + sign(p); }
export async function govSession(): Promise<GovUser | null> {
    if ((process.env.SESSION_SECRET?.length || 0) < 32)
        return null;
    const token = (await cookies()).get(GOV_COOKIE)?.value || '';
    try {
        const [p, s, ...extra] = token.split('.');
        if (p && s && !extra.length) {
            const a = Buffer.from(sign(p)), b = Buffer.from(s);
            if (a.length === b.length && timingSafeEqual(a, b)) {
                const v = JSON.parse(Buffer.from(p, 'base64url').toString());
                if (v.expires > Date.now()) {
                    await ensureGov();
                    const u = await db().prepare('SELECT id,username,name,role,department,grants,version FROM gov_users WHERE id=? AND version=?').bind(v.id, v.version).first<any>();
                    if (u)
                        return { ...u, grants: JSON.parse(u.grants) };
                }
            }
        }
    }
    catch { }
    const admin = await session();
    return admin?.role === 'direction' ? { id: 'technical-' + admin.id, username: admin.username, name: admin.username, role: 'governor', department: 'general', grants: {}, version: 0, technical: true } : null;
}
export function validateGrants(value: unknown): Grants { if (!value || typeof value !== 'object' || Array.isArray(value))
    throw Error('Droits invalides.'); const g: Grants = {}; for (const [d, a] of Object.entries(value)) {
    if (!Object.hasOwn(departments, d) || !Array.isArray(a) || a.some(x => !actions.includes(x)) || a.length > 5 || (a.length && !a.includes('read')))
        throw Error('Chaque permission nécessite la consultation.');
    g[d as Department] = [...new Set(a)] as Action[];
} return g; }
export async function record(id: string): Promise<GovRecord | null> { const row = await db().prepare('SELECT * FROM gov_records WHERE id=?').bind(id).first<any>(); if (!row)
    return null; const { payload, ...rest } = row; return { ...rest, data: JSON.parse(payload) }; }
export async function rateLimit(req: Request, scope: string, max: number) { const ip = (req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-forwarded-for') || 'local').split(',')[0]; const key = scope + '-' + createHash('sha256').update((process.env.SESSION_SECRET || '') + ip).digest('hex'); const now = Date.now(); const result = await db().prepare('INSERT INTO login_limits(id,attempts,reset_at) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=CASE WHEN login_limits.reset_at < ? THEN 1 ELSE login_limits.attempts+1 END, reset_at=CASE WHEN login_limits.reset_at < ? THEN ? ELSE login_limits.reset_at END RETURNING attempts').bind(key, now + 900000, now, now, now + 900000).first<{
    attempts: number;
}>(); return !!result && result.attempts <= max; }
export async function saveRecord(r: GovRecord, u: GovUser, expected: number, action: string, isNew = false) {
    const now = new Date().toISOString();
    const values = isNew ? [r.id, r.department, r.kind, r.title, r.status, JSON.stringify(r.data), u.name, now, r.approved_by, r.approved_at] : [r.title, r.status, JSON.stringify(r.data), now, r.approved_by, r.approved_at, r.id, expected];
    const mutation = isNew ? 'INSERT INTO gov_records(id,department,kind,title,status,payload,author,updated_at,approved_by,approved_at) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING RETURNING *' : 'UPDATE gov_records SET title=?,status=?,payload=?,updated_at=?,approved_by=?,approved_at=?,revision=revision+1 WHERE id=? AND revision=? RETURNING *';
    // Mutation and audit are one PostgreSQL statement: no partial write, no audit on conflict.
    return await db().prepare('WITH changed AS (' + mutation + '), logged AS (INSERT INTO gov_audit(id,record_id,department,actor,action,revision,snapshot,created_at) SELECT ?,id,department,?,?,revision,row_to_json(changed)::text,? FROM changed RETURNING id) SELECT id,revision FROM changed').bind(...values, crypto.randomUUID(), u.name + ' (' + u.username + ')', action, now).first<{
        id: string;
        revision: number;
    }>();
}
