import {db,json,sameOrigin} from '../../../lib/server';
import {session,hashPassword} from '../../../lib/auth';
import {ensureExtras} from '../../../lib/extra-db';
export async function GET(req:Request){try{const u=await session();if(!u)return json({error:'Accès refusé.'},403);await ensureExtras();const kind=new URL(req.url).searchParams.get('kind');
if(kind==='users'&&u.role==='direction')return json({items:(await db().prepare('SELECT id,username,role FROM admin_users ORDER BY username').all()).results});
if(kind==='history'&&u.role==='direction')return json({items:(await db().prepare('SELECT revision,author,created_at FROM content_history ORDER BY revision DESC LIMIT 50').all()).results});
if(kind==='snapshot'&&u.role==='direction'){const rev=Number(new URL(req.url).searchParams.get('revision'));const row=await db().prepare('SELECT payload FROM content_history WHERE revision=?').bind(rev).first<{payload:string}>();return row?json({content:JSON.parse(row.payload)}):json({error:'Version introuvable.'},404);}
if(kind==='inbox'&&['direction','communication'].includes(u.role))return json({items:(await db().prepare('SELECT * FROM inbox ORDER BY created_at DESC LIMIT 2000').all()).results});
return json({error:'Accès refusé.'},403);}catch{return json({error:'Chargement impossible.'},503);}}
export async function POST(req:Request){if(!sameOrigin(req))return json({error:'Origine refusée.'},403);try{const u=await session();if(!u)return json({error:'Accès refusé.'},403);const raw=await req.text();if(raw.length>10000)return json({error:'Requête trop volumineuse.'},413);const b=JSON.parse(raw);await ensureExtras();
if(b.action==='user'&&u.role==='direction'){
if(typeof b.username!=='string'||! /^[a-z0-9._-]{3,60}$/.test(b.username)||b.username==='admin'||!['direction','communication','recrutement'].includes(b.role)||typeof b.password!=='string'||b.password.length<16||b.password.length>200)return json({error:'Identifiant : 3–60 lettres minuscules/chiffres. Mot de passe : 16 caractères minimum.'},400);
await db().prepare('INSERT INTO admin_users(id,username,password_hash,role) VALUES(?,?,?,?) ON CONFLICT(username) DO UPDATE SET password_hash=EXCLUDED.password_hash,role=EXCLUDED.role,version=admin_users.version+1').bind(crypto.randomUUID(),b.username,hashPassword(b.password),b.role).run();return json({ok:true});}
if(b.action==='delete-user'&&u.role==='direction'){if(b.id===u.id)return json({error:'Vous ne pouvez pas supprimer votre propre compte.'},400);await db().prepare('DELETE FROM admin_users WHERE id=?').bind(b.id).run();return json({ok:true});}
if(['inbox-status','delete-message'].includes(b.action)&&['direction','communication'].includes(u.role)){
if(b.action==='delete-message')await db().prepare('DELETE FROM inbox WHERE id=?').bind(b.id).run();else{if(!['nouveau','en cours','traité'].includes(b.status))return json({error:'Statut invalide.'},400);await db().prepare('UPDATE inbox SET status=? WHERE id=?').bind(b.status,b.id).run();}return json({ok:true});}
return json({error:'Accès refusé.'},403);}catch{return json({error:'Enregistrement impossible.'},503);}}
