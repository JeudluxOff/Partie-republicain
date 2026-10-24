import {NextResponse} from 'next/server';
import {COOKIE} from '../../../lib/auth';
import {sameOrigin,json} from '../../../lib/server';
export async function POST(req:Request){if(!sameOrigin(req))return json({error:'Origine refusée.'},403);const response=NextResponse.redirect(new URL('/',req.url),303);response.cookies.set(COOKIE,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0});return response;}
