import {db} from './server';
let ready:Promise<void>|undefined;
export function ensureOffice(){return ready??=(async()=>{
 await db().prepare("ALTER TABLE applications ADD COLUMN IF NOT EXISTS revision INTEGER NOT NULL DEFAULT 1").run();
 await db().prepare("ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_at TEXT NOT NULL DEFAULT ''").run();
})().catch(e=>{ready=undefined;throw e});}
