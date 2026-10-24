import {db,json,sameOrigin} from '../../../../lib/server';
import {govSession,ensureGov,record,saveRecord} from '../../../../lib/gov-server';
import {can,GovRecord,departments} from '../../../../lib/government';
import {councilMember,councilTransition,isCouncil} from '../../../../lib/council';
export async function GET(req:Request){try{
 const u=await govSession();if(!u||!councilMember(u))return json({error:'Compte gouvernemental requis.'},403);await ensureGov();
 const id=new URL(req.url).searchParams.get('history');
 if(id){const r=await record(id);if(!r||!isCouncil(r))return json({error:'Dossier introuvable.'},404);const {results}=await db().prepare('SELECT id,actor,action,revision,created_at FROM gov_audit WHERE record_id=? AND department=? ORDER BY revision DESC LIMIT 100').bind(id,'general').all();return json({items:results});}
 const {results}=await db().prepare("SELECT * FROM gov_records WHERE department='general' AND kind='meeting' AND payload::jsonb->>'council'='true' ORDER BY updated_at DESC,id LIMIT 1001").all();
 return json({items:results.slice(0,1000).map((r:any)=>{const {payload,...rest}=r;return {...rest,data:JSON.parse(payload)}}),truncated:results.length>1000});
 }catch{return json({error:'Chargement du Conseil impossible. Réessayez.'},503);}}
export async function POST(req:Request){if(!sameOrigin(req))return json({error:'Origine refusée.'},403);try{
 const u=await govSession();if(!u||!councilMember(u))return json({error:'Compte gouvernemental requis.'},403);await ensureGov();
 const raw=await req.text();if(raw.length>20000)return json({error:'Requête trop volumineuse.'},413);const b=JSON.parse(raw);
 if(b.action==='create'){
  const source=typeof b.sourceId==='string'?await record(b.sourceId):null;
  if(!source||source.kind!=='document'||!source.data.legislative||!can(u,source.department,'read')||!can(u,source.department,'create'))return json({error:'Choisissez un document législatif dans un service autorisé.'},403);
  if(source.revision!==b.sourceRevision)return json({error:'Le document a changé. Actualisez avant de le transmettre.'},409);
  if(source.status==='archived')return json({error:'Un document archivé ne peut pas être transmis.'},400);
  const r:GovRecord={id:crypto.randomUUID(),department:'general',kind:'meeting',title:source.title,status:'pending',revision:1,author:u.name,updated_at:new Date().toISOString(),approved_by:null,approved_at:null,data:{council:true,stage:'review',sourceId:source.id,sourceRevision:source.revision,sourceReference:source.data.reference||source.id,sourceDepartment:departments[source.department],body:source.data.body,opinions:{},submittedBy:u.name,submittedById:u.id}};
  const saved=await saveRecord(r,u,0,'council:create',true);return saved?json({ok:true,...saved}):json({error:'Conflit de version.'},409);
 }
 const old=typeof b.id==='string'?await record(b.id):null;if(!old||!isCouncil(old))return json({error:'Dossier introuvable.'},404);
 if(!Number.isInteger(b.revision)||old.revision!==b.revision)return json({error:'Ce dossier a changé. Actualisez avant de recommencer.'},409);
 let next:GovRecord;try{next=councilTransition(old,u,b)}catch(e){return json({error:(e as Error).message},400);}
 const saved=await saveRecord(next,u,old.revision,'council:'+b.action);return saved?json({ok:true,...saved}):json({error:'Ce dossier a été modifié par un collègue. Actualisez.'},409);
 }catch{return json({error:'Enregistrement impossible. Vérifiez votre connexion et les champs.'},400);}}
