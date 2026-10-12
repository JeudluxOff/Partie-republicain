import {createHmac,createHash,timingSafeEqual,randomBytes} from 'node:crypto';
import {cookies} from 'next/headers';
export const COOKIE='uc_admin_session';
export const SESSION_SECONDS=12*60*60;
export function authConfigured(){return (process.env.SESSION_SECRET?.length??0)>=32 && (process.env.ADMIN_PASSWORD?.length??0)>=16;}
export function passwordMatches(value:string){if(!authConfigured())return false;return timingSafeEqual(createHash('sha256').update(value).digest(),createHash('sha256').update(process.env.ADMIN_PASSWORD!).digest());}
function sign(value:string){return createHmac('sha256',process.env.SESSION_SECRET!).update(value+'|'+createHash('sha256').update(process.env.ADMIN_PASSWORD!).digest('hex')).digest('base64url');}
export function createSession(){if(!authConfigured())throw new Error('Configurez les secrets administrateur.');const payload=Buffer.from(JSON.stringify({role:'admin',expires:Date.now()+SESSION_SECONDS*1000,nonce:randomBytes(20).toString('hex')})).toString('base64url');return payload+'.'+sign(payload);}
export function validSession(token:string){if(!authConfigured())return false;try{const [payload,signature,...rest]=token.split('.');if(rest.length||!payload||!signature)return false;const wanted=Buffer.from(sign(payload));const actual=Buffer.from(signature);if(wanted.length!==actual.length||!timingSafeEqual(wanted,actual))return false;const value=JSON.parse(Buffer.from(payload,'base64url').toString());return value.role==='admin'&&typeof value.expires==='number'&&value.expires>Date.now();}catch{return false;}}
export async function isAdmin(){return validSession((await cookies()).get(COOKIE)?.value??'');}
