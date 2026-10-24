import {GovUser,Action,can} from './government';
export type OfficeSection='recruitment'|'communication';
export function officeCan(u:GovUser|null,section:OfficeSection,action:Action){return !!u&&!u.technical&&(u.role==='governor'||u.role==='general'||can(u,section,action));}
export function governmentApplication(interest:string){return interest.startsWith('Gouvernement — ')||['Rejoindre un cabinet','Proposer ma candidature'].includes(interest);}
export const applicationStatuses=['nouvelle','en cours','entretien prévu','acceptée','refusée','archivée'];
