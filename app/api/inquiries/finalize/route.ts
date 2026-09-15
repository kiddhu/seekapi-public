import { after } from 'next/server';
import { validId,validToken,InputError } from '@/lib/inquiries/core';
import { enabled,origin,json,rate,draft,rpc,hash,response,failure,HttpError } from '@/lib/inquiries/server';
import { sendPendingMail } from '@/lib/inquiries/mail';
export const runtime='nodejs';
export async function POST(req:Request){try{
 if(!enabled())throw new HttpError(503,'Online inquiries are not enabled.');origin(req);await rate(req,'finalize');const b=await json(req);
 if(!validId(b.id)||!validToken(b.token))throw new InputError('Invalid session');await draft(b.id,b.token);
 const result=await rpc('inquiry_finalize',{p_id:b.id,p_token_hash:hash(b.token)});
 after(async()=>{try{await sendPendingMail();}catch{/* Durable outbox remains pending; worker retries. */}});
 return response(result);
}catch(e){return failure(e);}}
