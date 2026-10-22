import { createHmac, timingSafeEqual } from 'node:crypto';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function signature(id: string) {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32)
        throw new Error('Configurez SESSION_SECRET pour le suivi.');
    return createHmac('sha256', secret).update('adhesion-tracking-v1:' + id).digest('base64url');
}
export function trackingToken(id: string) {
    if (!UUID.test(id))
        throw new Error('Identifiant invalide.');
    return id + '.' + signature(id);
}
export function trackingId(token: unknown): string | null {
    if (typeof token !== 'string' || token.length > 100)
        return null;
    const [id, sig, extra] = token.split('.');
    if (!UUID.test(id) || !sig || extra !== undefined)
        return null;
    const actual = Buffer.from(sig), expected = Buffer.from(signature(id));
    return actual.length === expected.length && timingSafeEqual(actual, expected) ? id : null;
}
export function trackingPath(id: string) { return '/suivi#' + trackingToken(id); }
