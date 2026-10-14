import {list} from '@vercel/blob';
import {allowed} from '../../../lib/auth';
import {json} from '../../../lib/server';
export async function GET(req:Request){if(!await allowed('direction','communication'))return json({error:'Accès refusé.'},403);try{const cursor=new URL(req.url).searchParams.get('cursor')||undefined;const result=await list({prefix:'san-andreas-republican-party/',limit:100,cursor});return json({items:result.blobs.map(b=>({url:b.url,name:b.pathname.split('/').pop()})),cursor:result.hasMore?result.cursor:null});}catch{return json({error:'Galerie indisponible. Vérifiez BLOB_READ_WRITE_TOKEN.'},503);}}
