import {Content,News} from './content';
export function isLive(n:News,now=Date.now()){return n.published&&(!n.publishAt||Date.parse(n.publishAt)<=now);}
export function publicContent(c:Content):Content{return {...c,news:c.news.filter(n=>isLive(n)),people:c.people.filter(p=>p.published),events:(c.events||[]).filter(e=>e.published),campaign:c.campaign?.enabled?c.campaign:undefined};}
