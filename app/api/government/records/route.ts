import {db,json,sameOrigin} from '../../../../lib/server';
import {govSession,ensureGov,record,saveRecord} from '../../../../lib/gov-server';
import {can,departments,kinds,kindAllowed,GovRecord,Department,Kind,templates,managesUsers} from '../../../../lib/government';
import {cleanData} from '../../../../lib/gov-validation';
export async function GET(req:Request){try{const u=await govSession();if(!u)return json({error:'Connectez-vous.'},401);await ensureGov();const q=new URL(req.url).searchParams;const dep=q.get('department') as Department;
 if(q.get('accountsAudit')==='1'){if(!managesUsers(u))return json({error:'Accès refusé.'},403);return json({items:(await db().prepare("SELECT actor,action,record_id,created_at FROM gov_audit WHERE department='accounts' ORDER BY created_at DESC LIMIT 100").all()).results});}
 if(!can(u,dep,'read'))return json({error:'Accès refusé à ce service.'},403);
 if(q.get('history')){const items=(await db().prepare('SELECT id,actor,action,revision,created_at,snapshot FROM gov_audit WHERE record_id=? AND department=? ORDER BY revision DESC LIMIT 100').bind(q.get('history'),dep).all()).results;return json({items:items.map((x:any)=>({...x,snapshot:JSON.parse(x.snapshot)}))});}
 const {results}=await db().prepare('SELECT * FROM gov_records WHERE department=? ORDER BY updated_at DESC,id LIMIT 1001').bind(dep).all();return json({items:results.slice(0,1000).map((r:any)=>{const {payload,...rest}=r;return {...rest,data:JSON.parse(payload)}}),truncated:results.length>1000,templates:templates.filter(t=>t.department===dep)});
}catch{return json({error:'Chargement impossible. Vérifiez Neon.'},503);}}
export async function POST(req:Request){if(!sameOrigin(req))return json({error:'Origine refusée.'},403);try{const u=await govSession();if(!u)return json({error:'Connectez-vous.'},401);await ensureGov();const raw=await req.text();if(raw.length>150000)return json({error:'Dossier trop volumineux.'},413);const b=JSON.parse(raw);const old=b.id?await record(b.id):null;if(b.id&&!old)return json({error:'Dossier introuvable.'},404);const dep=(old?.department||b.department) as Department,kind=(old?.kind||b.kind) as Kind;
 if(!Object.hasOwn(departments,dep)||!Object.hasOwn(kinds,kind)||!kindAllowed(kind,dep))return json({error:'Service ou type invalide.'},400);if(!can(u,dep,'read'))return json({error:'Accès refusé.'},403);
 if(old&&(!Number.isInteger(b.revision)||b.revision!==old.revision))return json({error:'Dossier modifié par un collègue. Actualisez avant de recommencer.'},409);
 if(b.action==='delete'){
 if(!old||!can(u,dep,'delete'))return json({error:'Suppression non autorisée.'},403);if(old.status!=='draft'||old.data.payments?.length)return json({error:'Seuls les brouillons sans paiement peuvent être supprimés. Archivez les autres dossiers.'},400);
 const result=await db().prepare("WITH changed AS (DELETE FROM gov_records WHERE id=? AND revision=? RETURNING *), logged AS (INSERT INTO gov_audit(id,record_id,department,actor,action,revision,snapshot,created_at) SELECT ?,id,department,?,'delete',revision,row_to_json(changed)::text,? FROM changed RETURNING id) SELECT id FROM changed").bind(old.id,old.revision,crypto.randomUUID(),u.name,new Date().toISOString()).first();return result?json({ok:true}):json({error:'Conflit de version.'},409);}
 let next:GovRecord=old?{...old,data:{...old.data}}:{id:crypto.randomUUID(),department:dep,kind,title:'',status:'draft',data:{},revision:1,author:u.name,updated_at:new Date().toISOString(),approved_by:null,approved_at:null};
 if(b.action==='save'){
 if(!can(u,dep,old?'edit':'create'))return json({error:'Modification non autorisée.'},403);if(old?.status==='archived')return json({error:'Rouvrez le dossier avant modification.'},400);if(typeof b.title!=='string'||!b.title.trim()||b.title.length>200)return json({error:'Titre requis (200 caractères maximum).'},400);
 next.title=b.title.trim();next.data=await cleanData(kind,dep,b.data,u,next.id,old);next.status='draft';next.approved_by=null;next.approved_at=null;
 }else if(b.action==='status'){
 if(!old)return json({error:'Enregistrez d’abord le dossier.'},400);
 if(b.status==='pending'&&old.status==='draft'&&can(u,dep,'edit'))next.status='pending';
 else if(b.status==='approved'&&['draft','pending'].includes(old.status)&&can(u,dep,'validate')){next.status='approved';next.approved_by=u.name;next.approved_at=new Date().toISOString();}
 else if(b.status==='archived'&&can(u,dep,'validate'))next.status='archived';
 else if(b.status==='draft'&&can(u,dep,'validate')&&!(kind==='assessment'&&(old.approved_at||old.data.payments?.length))) {next.status='draft';next.approved_by=null;next.approved_at=null;}
 else return json({error:'Transition ou validation non autorisée.'},403);
 }else if(b.action==='payment'){
 if(!old||kind!=='assessment'||old.status!=='approved'||!can(u,dep,'validate'))return json({error:'Paiement réservé aux responsables, sur un avis validé.'},403);
 const amount=b.amountCents,paid=(old.data.payments||[]).reduce((n:number,p:any)=>n+p.amountCents,0);if(!Number.isSafeInteger(amount)||amount<=0||amount>old.data.totalCents-paid||typeof b.reference!=='string'||!b.reference.trim()||b.reference.length>120||old.data.payments.some((p:any)=>p.reference===b.reference.trim()))return json({error:'Montant supérieur au restant dû ou référence déjà utilisée/invalide.'},400);
 next.data.payments=[...old.data.payments,{id:crypto.randomUUID(),amountCents:amount,reference:b.reference.trim(),date:new Date().toISOString(),actor:u.name}];
 }else return json({error:'Action inconnue.'},400);
 const result=await saveRecord(next,u,old?.revision||0,b.action==='status'?b.status:b.action,!old);return result?json({ok:true,...result}):json({error:'Dossier modifié dans une autre fenêtre. Actualisez.'},409);
}catch(e){return json({error:e instanceof Error&&/^(Champ|Montant|Date|Données|Choisissez|Un avis|Clé|30 champs|Variable|Modèle|Nombre|Accès entreprise|Entreprise|Type)/.test(e.message)?e.message:'Enregistrement impossible. Vérifiez les champs et votre connexion.'},400);}}
