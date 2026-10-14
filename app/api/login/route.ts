import {ensureExtras} from '../../../lib/extra-db';
import {checkPassword} from '../../../lib/auth';
import {NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {db,json,sameOrigin} from '../../../lib/server';
import {authConfigured,passwordMatches,createSession,COOKIE,SESSION_SECONDS} from '../../../lib/auth';
export const runtime='nodejs';
export async function POST(req:Request){
  if(!sameOrigin(req))return json({error:'Origine refusée.'},403);
  if(!authConfigured()||!process.env.DATABASE_URL)return json({error:'Configuration incomplète : ajoutez DATABASE_URL, ADMIN_PASSWORD (16 caractères minimum) et SESSION_SECRET (32 caractères minimum) dans Vercel, puis initialisez la base et redéployez.'},503);
  try{
    if(Number(req.headers.get('content-length'))>4096)return json({error:'Requête trop volumineuse.'},413);
    const {password,username}=await req.json();if(typeof password!=='string'||password.length>1024)return json({error:'Mot de passe invalide.'},400);
    const ip=(req.headers.get('x-vercel-forwarded-for')||req.headers.get('x-forwarded-for')||'local').split(',')[0].trim();
    const id=createHash('sha256').update(process.env.SESSION_SECRET!+'|'+ip).digest('hex');const now=Date.now();
    const limit=await db().prepare('INSERT INTO login_limits(id,attempts,reset_at) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=CASE WHEN login_limits.reset_at < ? THEN 1 ELSE login_limits.attempts+1 END, reset_at=CASE WHEN login_limits.reset_at < ? THEN ? ELSE login_limits.reset_at END RETURNING attempts').bind(id,now+900000,now,now,now+900000).first<{attempts:number}>();
    if(!limit||limit.attempts>10)return json({error:'Trop de tentatives. Réessayez dans 15 minutes.'},429);
    let account:{id:string;version:number}|undefined;
    if(username&&username!=='admin'){
      if(typeof username!=='string'||username.length>60)return json({error:'Identifiants incorrects.'},401);
      await ensureExtras();const user=await db().prepare('SELECT id,password_hash,version FROM admin_users WHERE username=?').bind(username.toLowerCase().trim()).first<{id:string;password_hash:string;version:number}>();
      if(!user||!checkPassword(password,user.password_hash))return json({error:'Identifiants incorrects.'},401);account=user;
    }else if(!passwordMatches(password))return json({error:'Identifiants incorrects.'},401);
    await db().prepare('DELETE FROM login_limits WHERE id=? OR reset_at<?').bind(id,now).run();
    const response=NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
    response.cookies.set(COOKIE,createSession(account),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:SESSION_SECONDS});return response;
  }catch{return json({error:'Connexion impossible. Vérifiez la connexion Neon et exécutez database/schema.sql dans son éditeur SQL.'},503);}
}
