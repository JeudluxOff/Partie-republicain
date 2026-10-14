import Site from '../../site';
import {getContent} from '../../../lib/server';
import {notFound} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const {content}=await getContent();if(!content.priorities.some(p=>p.id===id))notFound();return <Site page="programme" detail={id}/>;}
