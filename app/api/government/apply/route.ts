import {submitApplication} from '../../../../lib/application-submit';
export async function POST(req:Request){return submitApplication(req,true)}
