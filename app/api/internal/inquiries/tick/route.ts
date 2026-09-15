import { timingSafeEqual } from 'node:crypto';
import { env,response,failure,HttpError } from '@/lib/inquiries/server';
import { sendPendingMail } from '@/lib/inquiries/mail';
export async function POST(req:Request){try{const actual=Buffer.from(req.headers.get('authorization')||'');const expected=Buffer.from('Bearer '+env('INQUIRY_WORKER_TOKEN'));if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new HttpError(403,'Access not permitted');await sendPendingMail();return response({ok:true});}catch(e){return failure(e);}}
