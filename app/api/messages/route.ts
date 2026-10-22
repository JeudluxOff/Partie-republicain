import { createHash } from 'node:crypto';
import { db, getContent, json, sameOrigin } from '../../../lib/server';
import { ensureExtras } from '../../../lib/extra-db';
export async function POST(req: Request) {
    if (!sameOrigin(req))
        return json({ error: 'Origine refusée.' }, 403);
    try {
        const raw = await req.text();
        if (raw.length > 12000)
            return json({ error: 'Message trop long.' }, 413);
        const b = JSON.parse(raw);
        if (b.website)
            return json({ error: 'Envoi refusé.' }, 400);
        if (!['contact', 'event'].includes(b.kind) || typeof b.name !== 'string' || b.name.trim().length < 2 || b.name.length > 120 || typeof b.discord !== 'string' || b.discord.trim().length < 2 || b.discord.length > 100 || typeof b.message !== 'string' || b.message.length > 4000 || b.consent !== true)
            return json({ error: 'Vérifiez les champs et votre consentement.' }, 400);
        const ip = (req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-forwarded-for') || 'local').split(',')[0];
        const key = 'inbox-' + createHash('sha256').update((process.env.SESSION_SECRET || '') + ip).digest('hex');
        const now = Date.now();
        const limit = await db().prepare('INSERT INTO login_limits(id,attempts,reset_at) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=CASE WHEN login_limits.reset_at < ? THEN 1 ELSE login_limits.attempts+1 END, reset_at=CASE WHEN login_limits.reset_at < ? THEN ? ELSE login_limits.reset_at END RETURNING attempts').bind(key, now + 3600000, now, now, now + 3600000).first<{
            attempts: number;
        }>();
        if (!limit || limit.attempts > 10)
            return json({ error: 'Trop d’envois. Réessayez dans une heure.' }, 429);
        let subject = '';
        let eventId = '';
        if (b.kind === 'event') {
            const { content } = await getContent();
            const e = (content.events || []).find(e => e.id === b.eventId && e.published && e.registration && Date.parse(e.date) > now);
            if (!e)
                return json({ error: 'Les inscriptions sont fermées.' }, 400);
            eventId = e.id;
            subject = e.title;
        }
        else {
            if (typeof b.subject !== 'string' || b.subject.trim().length < 2 || b.subject.length > 200 || b.message.trim().length < 10)
                return json({ error: 'Précisez l’objet et votre message (10 caractères minimum).' }, 400);
            subject = b.subject.trim();
        }
        await ensureExtras();
        const result = await db().prepare('INSERT INTO inbox(id,kind,event_id,name,discord,subject,message,created_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT DO NOTHING').bind(crypto.randomUUID(), b.kind, eventId, b.name.trim(), b.discord.trim(), subject, b.message.trim(), new Date().toISOString()).run();
        if (!result.meta.changes)
            return json({ error: 'Ce contact Discord est déjà inscrit à cet événement.' }, 409);
        return json({ ok: true });
    }
    catch {
        return json({ error: 'Envoi impossible. Réessayez plus tard.' }, 503);
    }
}
