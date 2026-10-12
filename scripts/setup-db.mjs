import {neon} from '@neondatabase/serverless';
import {readFile} from 'node:fs/promises';
if(!process.env.DATABASE_URL){console.error('Ajoute DATABASE_URL à .env.local avant de lancer npm run db:setup.');process.exit(1);}
const sql=neon(process.env.DATABASE_URL);
const schema=await readFile(new URL('../database/schema.sql',import.meta.url),'utf8');
const statements=schema.split(';').map(s=>s.trim()).filter(Boolean);
await sql.transaction(statements.map(s=>sql.query(s,[])));
console.log('La base de données est prête. Aucune donnée existante n’a été effacée.');
