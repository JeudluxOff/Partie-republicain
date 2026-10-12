import {neon} from '@neondatabase/serverless';
import {initialContent,Content} from './content';
export {isAdmin} from './auth';
export function db(){
  if(!process.env.DATABASE_URL)throw new Error('Configurez DATABASE_URL et initialisez la base de données.');
  const sql=neon(process.env.DATABASE_URL);
  return {prepare(query:string){
    let i=0;const statement=query.replace(/\?/g,()=>'$'+(++i));let values:unknown[]=[];
    return {
      bind(...args:unknown[]){values=args;return this;},
      async first<T=Record<string,unknown>>():Promise<T|null>{const rows=await sql.query(statement,values);return (rows[0] as T)??null;},
      async all(){return {results:await sql.query(statement,values)};},
      async run(){const result=await sql.query(statement,values,{fullResults:true});return {meta:{changes:result.rowCount??0}};}
    };
  }};
}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}});}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
export async function getContent(){if(!process.env.DATABASE_URL)return {content:initialContent,revision:0};const row=await db().prepare('SELECT payload,revision FROM content WHERE id=?').bind('main').first<{payload:string;revision:number}>();const content=row?JSON.parse(row.payload) as Content:initialContent; if(/^(union civique|parti civique|union civique de los santos)$/i.test(content.name.trim()))content.name='San Andreas Republican Party';if(!content.logoImage)content.logoImage='/images/logo-republican.png';return {content,revision:row?.revision??0};}
export function safeImage(s:unknown){return typeof s==='string'&&(s===''||/^\/images\/[\w.-]+$/.test(s)||/^https:\/\//.test(s));}
