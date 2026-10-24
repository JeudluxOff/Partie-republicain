import {db,json,sameOrigin,getContent,safeImage} from '../../../../lib/server';
import {govSession,ensureGov} from '../../../../lib/gov-server';
import {ensureExtras} from '../../../../lib/extra-db';
import {ensureOffice} from '../../../../lib/office-server';
import {officeCan,applicationStatuses} from '../../../../lib/office';
import {trackingPath} from '../../../../lib/tracking';
export async function GET(req:Request){try{
 const u=await govSession(),q=new URL(req.url).searchParams,s=q.get('section');
 if(s==='recruitment'&&officeCan(u,'recruitment','read')){await ensureOffice();const {results}=await db().prepare('SELECT id,name,discord,phone,district,profession,interest,motivation,availability,status,notes,created_at,revision,interview_at FROM applications ORDER BY created_at DESC LIMIT 2001').all();return json({items:results.slice(0,2000).map((r:any)=>({...r,trackingPath:trackingPath(r.id)})),truncated:results.length>2000});}
 if(s==='communication'&&officeCan(u,'communication','read')){const c=await getContent();return json({news:c.content.news,press:c.content.press||[],revision:c.revision});}
 if(s==='inbox'&&officeCan(u,'communication','read')){await ensureExtras();return json({items:(await db().prepare('SELECT * FROM inbox ORDER BY created_at DESC LIMIT 2000').all()).results});}
 return json({error:'Accès refusé.'},403);
 }catch{return json({error:'Chargement impossible. Réessayez.'},503);}}
export async function POST(req:Request){if(!sameOrigin(req))return json({error:'Origine refusée.'},403);try{
 const u=await govSession();if(!u||u.technical)return json({error:'Compte gouvernemental requis.'},403);const raw=await req.text();if(raw.length>1200000)return json({error:'Contenu trop volumineux.'},413);const b=JSON.parse(raw);
 if(b.action==='application'){
 if(!officeCan(u,'recruitment','read')||!officeCan(u,'recruitment','edit'))return json({error:'Modification non autorisée.'},403);
 await ensureOffice();await ensureGov();const old=await db().prepare('SELECT * FROM applications WHERE id=?').bind(b.id).first<any>();if(!old)return json({error:'Candidature introuvable.'},404);
 if(b.revision!==old.revision)return json({error:'Dossier modifié par un collègue. Actualisez.'},409);
 if(!applicationStatuses.includes(b.status)||typeof b.notes!=='string'||b.notes.length>10000||typeof b.interview_at!=='string'||(b.interview_at&&(!Number.isFinite(Date.parse(b.interview_at))||b.interview_at.length>40)))return json({error:'Statut, notes ou date invalides.'},400);
 if(b.status!==old.status&&(['acceptée','refusée','archivée'].includes(b.status)||['acceptée','refusée','archivée'].includes(old.status))&&!officeCan(u,'recruitment','validate'))return json({error:'La décision finale nécessite le droit Valider.'},403);
 if(b.status==='entretien prévu'&&!b.interview_at)return json({error:'Renseignez la date et l’heure de l’entretien.'},400);
 const saved=await db().prepare("WITH changed AS (UPDATE applications SET status=?,notes=?,interview_at=?,revision=revision+1 WHERE id=? AND revision=? RETURNING *), logged AS (INSERT INTO gov_audit(id,record_id,department,actor,action,revision,snapshot,created_at) SELECT ?,id,'recruitment',?,'application',revision,row_to_json(changed)::text,? FROM changed RETURNING id) SELECT id,revision FROM changed").bind(b.status,b.notes,b.interview_at,b.id,b.revision,crypto.randomUUID(),u.name,new Date().toISOString()).first();return saved?json({ok:true}):json({error:'Dossier modifié. Actualisez.'},409);
 }
 if(b.action==='inbox'){
 if(!officeCan(u,'communication','read')||!officeCan(u,'communication','edit'))return json({error:'Accès refusé.'},403);if(!['nouveau','en cours','traité'].includes(b.status))return json({error:'Statut invalide.'},400);await ensureExtras();const r=await db().prepare('UPDATE inbox SET status=? WHERE id=? AND status=? RETURNING id').bind(b.status,b.id,b.previous).first();return r?json({ok:true}):json({error:'Message modifié ou supprimé. Actualisez.'},409);
 }
 if(b.action==='communication'){
 if(!officeCan(u,'communication','read')||!officeCan(u,'communication','edit'))return json({error:'Modification non autorisée.'},403);
 const {content,revision}=await getContent();if(b.revision!==revision)return json({error:'Le site a changé. Actualisez avant de recommencer.'},409);
 const news=b.news,press=b.press;
 if(!Array.isArray(news)||news.length>200||!Array.isArray(press)||press.length>100)return json({error:'Limite : 200 publications et 100 visuels.'},400);
 if(news.some(n=>!n||!['id','title','category','date','excerpt','body','image'].every(k=>typeof n[k]==='string')||!n.id||!n.title.trim()||n.title.length>200||n.body.length>50000||n.excerpt.length>3000||!Number.isFinite(Date.parse(n.date))||typeof n.published!=='boolean'||!safeImage(n.image)||(n.publishAt&&(!Number.isFinite(Date.parse(n.publishAt))||typeof n.publishAt!=='string'))||(n.featured!==undefined&&typeof n.featured!=='boolean'))||new Set(news.map(n=>n.id)).size!==news.length)return json({error:'Publication invalide. Vérifiez le titre, les dates et l’image.'},400);
 if(press.some(p=>!p||typeof p.id!=='string'||!p.id||typeof p.title!=='string'||!p.title.trim()||p.title.length>200||!p.url||!safeImage(p.url))||new Set(press.map(p=>p.id)).size!==press.length)return json({error:'Visuel presse invalide.'},400);
 for(const [items,oldItems,isPress] of [[news,content.news,false],[press,content.press||[],true]] as const){
 for(const item of items){const old=oldItems.find((o:any)=>o.id===item.id);if(!old&&!officeCan(u,'communication','create'))return json({error:'Création non autorisée.'},403);if(JSON.stringify(item)!==JSON.stringify(old)&&(isPress||item.published||(old as any)?.published)&&!officeCan(u,'communication','validate'))return json({error:'Le droit Valider est requis pour publier ou modifier un contenu public.'},403);}
 if(oldItems.some((o:any)=>!items.some((i:any)=>i.id===o.id))&&(!officeCan(u,'communication','delete')||!officeCan(u,'communication','validate')))return json({error:'Retrait réservé aux responsables de publication.'},403);
 }
 const next={...content,news,press};if(JSON.stringify(next).length>1000000)return json({error:'Limite de contenu atteinte.'},400);await ensureExtras();
 await db().prepare('INSERT INTO content_history(revision,payload,author,created_at) SELECT revision,payload,?,? FROM content WHERE id=? AND revision=? ON CONFLICT(revision) DO NOTHING').bind(u.name,new Date().toISOString(),'main',revision).run();
 const result=revision===0?await db().prepare('INSERT INTO content(id,payload,revision) VALUES(?,?,1) ON CONFLICT(id) DO NOTHING').bind('main',JSON.stringify(next)).run():await db().prepare('UPDATE content SET payload=?,revision=revision+1 WHERE id=? AND revision=?').bind(JSON.stringify(next),'main',revision).run();return result.meta.changes?json({ok:true,revision:revision+1}):json({error:'Le site a changé. Actualisez.'},409);
 }
 return json({error:'Action inconnue.'},400);
 }catch{return json({error:'Enregistrement impossible. Vérifiez les champs et réessayez.'},400);}}
