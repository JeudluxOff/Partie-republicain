import {db,json,sameOrigin} from '../../../lib/server';
import {trackingId} from '../../../lib/tracking';
export const runtime = 'nodejs';
export async function POST(req:Request) {
  if (!sameOrigin(req)) return json({error:'Origine refusée.'},403);
  try {
    const raw = await req.text();
    if (raw.length > 512) return json({error:'Code invalide.'},400);
    let body; try {body=JSON.parse(raw);} catch {return json({error:'Code invalide.'},400);}
    const id = trackingId(body?.token);
    if (!id) return json({error:'Code de suivi invalide ou expiré.'},404);
    const row = await db().prepare('SELECT id,status,created_at FROM applications WHERE id=?').bind(id).first<{id:string;status:string;created_at:string}>();
    if (!row) return json({error:'Cette demande est introuvable ou a été supprimée.'},404);
    return json({reference:row.id.slice(0,8).toUpperCase(),status:row.status,createdAt:row.created_at});
  } catch {return json({error:'Le suivi est momentanément indisponible. Réessayez.'},503);}
}
