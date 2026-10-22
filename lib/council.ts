import { GovRecord, GovUser } from './government';
export const councilStages = { review: 'Examen interne', submitted: 'Soumis au vote', rejected: 'Refusé par le gouverneur', adopted: 'Adopté en Conseil', vote_rejected: 'Rejeté en Conseil' };
export type CouncilStage = keyof typeof councilStages;
export function isCouncil(r: GovRecord) { return r.kind === 'meeting' && r.department === 'general' && r.data.council === true; }
export function councilMember(u: GovUser) { return !u.technical; }
function text(v: unknown, max = 4000) { if (typeof v !== 'string' || !v.trim() || v.length > max)
    throw Error('Renseignez le commentaire ou le champ demandé (' + max + ' caractères maximum).'); return v.trim(); }
export function councilTransition(old: GovRecord, u: GovUser, b: any, now = new Date().toISOString()): GovRecord {
    if (!councilMember(u) || !isCouncil(old))
        throw Error('Accès refusé.');
    const next = { ...old, data: { ...old.data }, approved_by: null as string | null, approved_at: null as string | null };
    const d = next.data;
    if (b.action === 'opinion') {
        if (!['lieutenant', 'general'].includes(u.role) || d.stage !== 'review')
            throw Error('Avis réservé au lieutenant-gouverneur et au secrétaire général pendant l’examen.');
        if (!['favorable', 'unfavorable'].includes(b.choice))
            throw Error('Choisissez un avis.');
        d.opinions = { ...d.opinions, [u.role]: { choice: b.choice, comment: text(b.comment), actor: u.name, actorId: u.id, date: now } };
    }
    else if (b.action === 'decide') {
        if (u.role !== 'governor' || !['review', 'submitted'].includes(d.stage))
            throw Error('Décision réservée au gouverneur sur un dossier en cours.');
        if (!['submit', 'reject'].includes(b.choice) || (b.choice === 'submit' && d.stage !== 'review'))
            throw Error('Décision invalide.');
        d.decision = { choice: b.choice, comment: text(b.comment), actor: u.name, actorId: u.id, date: now };
        d.stage = b.choice === 'submit' ? 'submitted' : 'rejected';
    }
    else if (b.action === 'result') {
        if (!['governor', 'general'].includes(u.role) || d.stage !== 'submitted')
            throw Error('Le résultat est saisi par le gouverneur ou le secrétaire général après soumission.');
        if (!['adopted', 'vote_rejected'].includes(b.outcome))
            throw Error('Choisissez le résultat proclamé en séance.');
        const counts = [b.for, b.against, b.abstentions];
        if (counts.some(n => !Number.isInteger(n) || n < 0 || n > 10000) || counts.reduce((a, c) => a + c, 0) === 0)
            throw Error('Indiquez des nombres de voix valides, avec au moins un participant.');
        if (typeof b.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.date) || !Number.isFinite(Date.parse(b.date)) || new Date(b.date).toISOString().slice(0, 10) !== b.date || b.date > now.slice(0, 10))
            throw Error('Indiquez une date de séance valide, non future.');
        d.result = { outcome: b.outcome, for: b.for, against: b.against, abstentions: b.abstentions, date: b.date, minutes: text(b.minutes, 12000), actor: u.name, actorId: u.id, recordedAt: now };
        d.stage = b.outcome;
    }
    else
        throw Error('Action inconnue.');
    next.status = ['review', 'submitted'].includes(d.stage) ? 'pending' : d.stage === 'adopted' ? 'approved' : 'archived';
    if (d.stage === 'adopted') {
        next.approved_by = u.name;
        next.approved_at = now;
    }
    return next;
}
