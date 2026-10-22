import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, json, sameOrigin } from '../../../../lib/server';
import { checkPassword } from '../../../../lib/auth';
import { GOV_COOKIE, govSession, govToken, ensureGov, rateLimit } from '../../../../lib/gov-server';
export async function GET() { try {
    return json({ user: await govSession() });
}
catch {
    return json({ error: 'Connexion à la base indisponible.' }, 503);
} }
export async function POST(req: Request) { if (!sameOrigin(req))
    return json({ error: 'Origine refusée.' }, 403); try {
    if ((process.env.SESSION_SECRET?.length || 0) < 32)
        return json({ error: 'Configurez SESSION_SECRET.' }, 503);
    const raw = await req.text();
    if (raw.length > 4096)
        return json({ error: 'Requête trop longue.' }, 413);
    const b = JSON.parse(raw);
    if (typeof b.username !== 'string' || typeof b.password !== 'string' || b.password.length > 200)
        return json({ error: 'Identifiants invalides.' }, 400);
    await ensureGov();
    if (!await rateLimit(req, 'gov-login', 10))
        return json({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' }, 429);
    const u = await db().prepare('SELECT id,version,password_hash FROM gov_users WHERE username=?').bind(b.username.toLowerCase().trim()).first<any>();
    if (!u || !checkPassword(b.password, u.password_hash))
        return json({ error: 'Identifiants incorrects.' }, 401);
    const res = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
    res.cookies.set(GOV_COOKIE, govToken(u), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 43200 });
    return res;
}
catch {
    return json({ error: 'Connexion impossible. Vérifiez la base Neon.' }, 503);
} }
export async function DELETE(req: Request) { if (!sameOrigin(req))
    return json({ error: 'Origine refusée.' }, 403); (await cookies()).delete(GOV_COOKIE); return json({ ok: true }); }
