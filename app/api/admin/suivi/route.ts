import {allowed} from '../../../../lib/auth';
import {db,isAdmin,json,sameOrigin} from '../../../../lib/server';
import {trackingPath} from '../../../../lib/tracking';
export const runtime = 'nodejs';
export async function POST(req:Request) {
  if (!sameOrigin(req) || !await allowed('direction','recrutement')) return json({error:'Accès réservé à l’administrateur.'},403);
  try {
    const raw=await req.text();
    if(raw.length>512)return json({error:'Requête trop volumineuse.'},400);
    const {id}=JSON.parse(raw);
    if(typeof id!=='string'||id.length!==36)return json({error:'Identifiant invalide.'},400);
    const row=await db().prepare('SELECT id FROM applications WHERE id=?').bind(id).first<{id:string}>();
    if(!row)return json({error:'Demande introuvable.'},404);
    return json({path:trackingPath(row.id)});
  }catch{return json({error:'Impossible de créer le lien de suivi.'},503);}
}
