import {createHmac,createHash,timingSafeEqual,randomBytes,scryptSync} from 'node:crypto';
import {cookies} from 'next/headers';
export const COOKIE='uc_admin_session';
export const SESSION_SECONDS=12*60*60;
export function authConfigured(){return (process.env.SESSION_SECRET?.length??0)>=32 && (process.env.ADMIN_PASSWORD?.length??0)>=16;}
export function passwordMatches(value:string){if(!authConfigured())return false;return timingSafeEqual(createHash('sha256').update(value).digest(),createHash('sha256').update(process.env.ADMIN_PASSWORD!).digest());}
function sign(value:string){return createHmac('sha256',process.env.SESSION_SECRET!).update(value+'|'+createHash('sha256').update(process.env.ADMIN_PASSWORD!).digest('hex')).digest('base64url');}
export function createSession(account?:{id:string;version:number}){if(!authConfigured())throw new Error('Configurez les secrets administrateur.');const payload=Buffer.from(JSON.stringify({role:'admin',account,expires:Date.now()+SESSION_SECONDS*1000,nonce:randomBytes(20).toString('hex')})).toString('base64url');return payload+'.'+sign(payload);}
export function validSession(token:string){if(!authConfigured())return false;try{const [payload,signature,...rest]=token.split('.');if(rest.length||!payload||!signature)return false;const wanted=Buffer.from(sign(payload));const actual=Buffer.from(signature);if(wanted.length!==actual.length||!timingSafeEqual(wanted,actual))return false;const value=JSON.parse(Buffer.from(payload,'base64url').toString());return value.role==='admin'&&typeof value.expires==='number'&&value.expires>Date.now();}catch{return false;}}
export type Role='direction'|'communication'|'recrutement';
export type Session={id:string;username:string;role:Role};
export function hashPassword(password:string){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(password,salt,64).toString('hex');}
export function checkPassword(password:string,stored:string){try{const [salt,hash]=stored.split(':');const a=Buffer.from(hash,'hex');const b=scryptSync(password,salt,64);return a.length===b.length&&timingSafeEqual(a,b);}catch{return false;}}
export async function session():Promise<Session|null>{
 const token=(await cookies()).get(COOKIE)?.value??'';if(!validSession(token))return null;
 const value=JSON.parse(Buffer.from(token.split('.')[0],'base64url').toString());
 if(!value.account)return {id:'owner',username:'admin',role:'direction'};
 const {db}=await import('./server');
 const row=await db().prepare('SELECT id,username,role,version FROM admin_users WHERE id=?').bind(value.account.id).first<{id:string;username:string;role:Role;version:number}>();
 return row&&row.version===value.account.version?row:null;
}
export async function allowed(...roles:Role[]){const s=await session();return !!s&&roles.includes(s.role);}
export async function isAdmin(){return !!await session();}
