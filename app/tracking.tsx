'use client';
import {FormEvent,useEffect,useState} from 'react';
const statuses:Record<string,{title:string;text:string;step:number}>={
 'nouvelle':{title:'Demande reçue',text:'Votre dossier a bien été enregistré. L’équipe chargée du recrutement va l’examiner.',step:0},
 'entretien prévu':{title:'Entretien prévu',text:'Un entretien est prévu. L’équipe vous communiquera les informations pratiques sur Discord.',step:1},
 'en cours':{title:'En cours d’examen',text:'L’équipe étudie votre demande. Surveillez vos messages Discord pour un éventuel échange.',step:1},
 'acceptée':{title:'Demande acceptée',text:'Votre candidature a été acceptée. L’équipe vous précisera les prochaines étapes sur Discord.',step:2},
 'refusée':{title:'Demande refusée',text:'Votre demande n’a pas été retenue. Vous pouvez contacter l’équipe chargée du recrutement sur Discord pour en savoir plus.',step:2},
 'archivée':{title:'Dossier archivé',text:'Ce dossier a été classé. Contactez l’équipe chargée du recrutement sur Discord pour toute question.',step:2}
};
export function TrackingAccess({path}:{path:string}){
 const [copied,setCopied]=useState(false),[url,setUrl]=useState(path),[failed,setFailed]=useState(false);
 useEffect(()=>setUrl(new URL(path,window.location.origin).href),[path]);
 return <div className="tracking-access"><p><strong>Conservez votre lien privé de suivi.</strong><br/>Il permet de consulter votre statut, sans compte.</p><input aria-label="Lien privé de suivi" readOnly value={url} onFocus={e=>e.target.select()}/><div className="tracking-actions"><a className="button" href={path}>Suivre ma demande</a><button type="button" className="subtle-button" onClick={async()=>{try{await navigator.clipboard.writeText(url);setCopied(true);setFailed(false);}catch{setFailed(true);}}}>{copied?'Lien copié':'Copier le lien'}</button></div>{failed&&<p role="status">Sélectionnez le lien ci-dessus pour le copier manuellement.</p>}<small>Gardez ce lien pour vous : toute personne qui le possède peut consulter le statut.</small></div>;
}
export function AdminTrackingLink({id}:{id:string}){
 const [path,setPath]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 return <div className="tracking-admin">{path?<TrackingAccess path={path}/>:<button type="button" className="subtle-button" disabled={busy} onClick={async()=>{setBusy(true);setError('');try{const r=await fetch('/api/admin/suivi',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});const d=await r.json();if(!r.ok)throw Error(d.error);setPath(d.path);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>{busy?'Préparation…':'Obtenir le lien de suivi du candidat'}</button>}{error&&<p role="alert">{error}</p>}</div>;
}
export default function Tracking(){
 const [input,setInput]=useState(''),[token,setToken]=useState(''),[data,setData]=useState<{reference:string;status:string;createdAt:string}|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[checked,setChecked]=useState(''),[refresh,setRefresh]=useState(0);
 useEffect(()=>{const read=()=>{const hash=window.location.hash.slice(1);setToken(hash);setInput(hash);};read();window.addEventListener('hashchange',read);return()=>window.removeEventListener('hashchange',read);},[]);
 useEffect(()=>{
  setData(null);setError('');setChecked('');if(!token)return;
  let stopped=false,active=false;const controller=new AbortController();
  async function update(){if(active||stopped)return;active=true;setBusy(true);try{
   const r=await fetch('/api/suivi',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token}),cache:'no-store',signal:controller.signal});const d=await r.json();if(stopped)return;
   if(!r.ok){if(r.status===404||r.status===400)setData(null);throw Error(d.error);}
   setData(d);setError('');setChecked(new Date().toLocaleTimeString('fr-FR'));
  }catch(e){if(!stopped)setError((e as Error).message);}finally{active=false;if(!stopped)setBusy(false);}}
  void update();const timer=setInterval(()=>{if(document.visibilityState==='visible')void update();},15000);
  const visible=()=>{if(document.visibilityState==='visible')void update();};document.addEventListener('visibilitychange',visible);
  return()=>{stopped=true;controller.abort();clearInterval(timer);document.removeEventListener('visibilitychange',visible);};
 },[token,refresh]);
 function submit(e:FormEvent){e.preventDefault();let value=input.trim();if(value.includes('#'))value=value.slice(value.indexOf('#')+1);if(!/^[a-f0-9-]{36}\.[A-Za-z0-9_-]{43}$/i.test(value)){setError('Collez le lien privé complet ou son code de suivi. La référence de 8 caractères ne suffit pas.');return;}window.history.replaceState(null,'','/suivi#'+value);setToken(value);setRefresh(n=>n+1);}
 const current=data?statuses[data.status]:null;
 return <section className="wrap tracking-page"><div className="kicker">VOTRE ADHÉSION</div><h1>Suivre ma demande.</h1><p>Retrouvez ici l’avancement de votre candidature au mouvement.</p><form className="tracking-form" onSubmit={submit}><label htmlFor="tracking-code">Votre lien privé ou code de suivi</label><input id="tracking-code" value={input} onChange={e=>setInput(e.target.value)} required autoComplete="off" spellCheck={false} placeholder="Collez le lien reçu après l’envoi"/><button className="button" disabled={busy}>Consulter mon dossier</button></form>{error&&<p className="notice error" role="alert">{error}</p>}{busy&&!data&&<p role="status">Recherche de votre demande…</p>}{data&&current&&<div className="tracking-card" aria-live="polite"><span className="meta">DOSSIER {data.reference}</span><h2>{current.title}</h2><p>{current.text}</p><ol className="tracking-steps">{['Demande reçue','Examen du dossier','Décision / clôture'].map((s,i)=><li key={s} className={i<=current.step?'done':''} aria-current={i===current.step?'step':undefined}><span>{i+1}</span>{s}</li>)}</ol><p>Envoyée le {new Date(data.createdAt).toLocaleDateString('fr-FR')}</p><div className="tracking-actions"><small>{error?'Connexion interrompue : le statut affiché peut être ancien.':`Actualisation automatique toutes les 15 secondes · Dernière vérification : ${checked}`}</small><button className="subtle-button" disabled={busy} onClick={()=>setRefresh(n=>n+1)}>{busy?'Actualisation…':'Actualiser'}</button></div></div>}<p className="tracking-help">Vous avez perdu votre lien, ou envoyé votre demande avant la mise en place du suivi ? Contactez l’équipe chargée du recrutement sur Discord avec votre référence : elle pourra vous transmettre votre lien privé.</p></section>;
}
