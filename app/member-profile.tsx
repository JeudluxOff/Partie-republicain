import {Users,ListOrdered,HeartHandshake} from 'lucide-react';
import type {Person} from '../lib/content';
export default function MemberProfile({person:p,logo,name}:{person:Person;logo:string;name:string}) {
 const rows=[{label:'Rôle',value:p.profileRole||p.role,Icon:Users},{label:'Priorités',value:p.priorities,Icon:ListOrdered},{label:'Valeurs',value:p.values,Icon:HeartHandshake}];
 return <article className="member-poster" aria-label={'Présentation de '+p.name}>
  <div className="member-poster-heading"><div className="member-ornament" aria-hidden="true"><span>★★★</span><img src={logo||'/images/logo-republican.png'} alt=""/><span>★★★</span></div><h1>Membres du parti</h1><p>Présentation individuelle</p><div className="member-title-stars" aria-hidden="true">★ ★ ★</div></div>
  <div className="member-poster-body"><div className="member-cutout">{p.image?<img src={p.image} alt={p.name}/>:<span className="member-initials">{p.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span>}</div><div className="member-details"><div className="member-identity"><p>{p.role||p.group}</p><h2>{p.name}</h2></div><dl>{rows.map(({label,value,Icon})=><div className="member-fact" key={label}><dt><Icon aria-hidden="true"/><span>{label}</span></dt><dd>{value?.trim()||'À venir'}</dd></div>)}</dl></div></div>
  <footer className="member-poster-footer"><span aria-hidden="true">★ ★ ★</span><div><strong>{name}</strong><small>God bless San Andreas.</small></div><span aria-hidden="true">★ ★ ★</span></footer>
 </article>;
}
