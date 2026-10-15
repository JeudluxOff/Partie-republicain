import {GovRecord,GovUser,Kind,Department,DocTemplate,templates,departments,roles,calculateTax,renderDocument,can} from './government';
import {record} from './gov-server';
function str(d:any,k:string,max=8000,required=false){const v=d[k]??'';if(typeof v!=='string'||v.length>max||required&&!v.trim())throw Error('Champ invalide : '+k);return v.trim();}
function integer(d:any,k:string,max=1e12){const v=d[k];if(!Number.isSafeInteger(v)||v<0||v>max)throw Error('Montant invalide : '+k);return v;}
function date(d:any,k:string){const v=str(d,k,10,true);if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v)))throw Error('Date invalide.');return v;}
export async function cleanData(kind:Kind,dep:Department,input:any,u:GovUser,id:string,old:GovRecord|null){
if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Données invalides.');
if(kind==='company')return {owner:str(input,'owner',120,true),contact:str(input,'contact',120),activity:str(input,'activity',500,true),registration:str(input,'registration',100),notes:str(input,'notes')};
if(kind==='tax')return {basisPoints:integer(input,'basisPoints',10000),baseLabel:str(input,'baseLabel',200,true),effective:date(input,'effective'),notes:str(input,'notes')};
if(kind==='budget'){const allocatedCents=integer(input,'allocatedCents'),spentCents=integer(input,'spentCents');return {allocatedCents,spentCents,period:str(input,'period',100,true),notes:str(input,'notes')};}
if(kind==='assessment'){
 if(old&&(old.approved_at||old.status==='approved'||old.status==='archived'||old.data.payments?.length))throw Error('Un avis validé ne se modifie plus. Utilisez le suivi des paiements.');
 const company=await record(str(input,'companyId',100,true)),tax=await record(str(input,'taxId',100,true));
 if(!company||company.kind!=='company'||company.department!=='economy'||company.status!=='approved'||!tax||tax.kind!=='tax'||tax.department!=='economy'||tax.status!=='approved'||tax.data.effective>new Date().toISOString().slice(0,10))throw Error('Choisissez une entreprise et un taux validés, déjà applicables.');
 const baseCents=integer(input,'baseCents'),basisPoints=tax.data.basisPoints;return {companyId:company.id,companyName:company.title,taxId:tax.id,taxName:tax.title,taxRevision:tax.revision,baseCents,basisPoints,totalCents:calculateTax(baseCents,basisPoints),period:str(input,'period',100,true),due:date(input,'due'),notes:str(input,'notes'),payments:[]};
}
if(kind==='alert')return {level:str(input,'level',100,true),instructions:str(input,'instructions',12000,true),effective:date(input,'effective')};
if(kind==='secret')return {value:str(input,'value',4000,true),instructions:str(input,'instructions'),expires:str(input,'expires',10)};
if(kind==='task')return {assignee:str(input,'assignee',120,true),due:date(input,'due'),progress:['à faire','en cours','terminée'].includes(input.progress)?input.progress:'à faire',body:str(input,'body',12000)};
if(kind==='note')return {body:str(input,'body',20000,true)};
if(kind==='template'){
 if(!Array.isArray(input.fields)||input.fields.length>30)throw Error('30 champs maximum.');const keys=new Set<string>();
 const fields=input.fields.map((f:any)=>{if(!f||typeof f.key!=='string'||! /^[a-z_]{1,40}$/.test(f.key)||['reference','date','service','redacteur','fonction','entreprise','responsable'].includes(f.key)||keys.has(f.key)||!['text','textarea','date','number'].includes(f.type)||typeof f.required!=='boolean')throw Error('Clé de champ invalide, réservée ou répétée.');keys.add(f.key);return {key:f.key,label:str(f,'label',120,true),type:f.type,required:f.required}});
 const body=str(input,'body',20000,true);const allowed=new Set(['reference','date','service','redacteur','fonction','entreprise','responsable',...keys]);for(const m of body.matchAll(/\{\{([a-z_]+)\}\}/g))if(!allowed.has(m[1]))throw Error('Variable inconnue : '+m[1]);return {body,fields};
}
if(kind==='document'){
 if(old)return {body:str(input,'body',40000,true),reference:old.data.reference,templateTitle:old.data.templateTitle,companyName:old.data.companyName||''};
 let tpl:DocTemplate|undefined=templates.find(t=>t.id===input.templateId&&t.department===dep);
 if(!tpl){const custom=await record(str(input,'templateId',100,true));if(custom?.kind==='template'&&custom.department===dep&&custom.status==='approved')tpl={id:custom.id,department:dep,title:custom.title,body:custom.data.body,fields:custom.data.fields};}
 if(!tpl)throw Error('Modèle introuvable ou non validé.');const values:Record<string,string>={};
 for(const f of tpl.fields){const v=str(input.values||{},f.key,5000,f.required);if(v&&f.type==='number'&&!Number.isFinite(Number(v)))throw Error('Nombre invalide : '+f.label);if(v&&f.type==='date'&&!/^\d{4}-\d{2}-\d{2}$/.test(v))throw Error('Date invalide : '+f.label);values[f.key]=v;}
 let companyName='',owner='';if(input.companyId){if(!can(u,'economy','read'))throw Error('Accès entreprise refusé.');const c=await record(str(input,'companyId',100,true));if(!c||c.kind!=='company'||c.department!=='economy')throw Error('Entreprise introuvable.');companyName=c.title;owner=c.data.owner;}
 const reference='GOV-'+new Date().getFullYear()+'-'+id.slice(0,8).toUpperCase();Object.assign(values,{reference,date:new Date().toLocaleDateString('fr-FR',{timeZone:'Europe/Paris'}),service:departments[dep],redacteur:u.name,fonction:roles[u.role],entreprise:companyName,responsable:owner});
 return {body:renderDocument(tpl.body,values),reference,templateTitle:tpl.title,companyName};
}throw Error('Type inconnu.');}
