import { parseInquiry,rejectAttachments,validId,validToken,InputError } from '@/lib/inquiries/core';
import { env,enabled,origin,json,rate,rpc,hash,sb,response,failure,HttpError } from '@/lib/inquiries/server';
export const runtime='nodejs';
export async function POST(req:Request){try{
  if(!enabled())throw new HttpError(503,'Online inquiries are not enabled. Please email support@seekapi.ai.');origin(req);for(const key of ['INQUIRY_RESEND_API_KEY','INQUIRY_MAIL_FROM','INQUIRY_SITE_URL','INQUIRY_STORAGE_REGION_LABEL'])env(key);await rate(req,'draft');
  const body=await json(req);if(body.website_check)throw new InputError('Invalid request');
  if(!validId(body.id)||!validToken(body.token))throw new InputError('Invalid session');
  rejectAttachments(body.files);
  const health=await sb('/rest/v1/inquiry_worker_health?select=last_ok&limit=1');if(!health.length||Date.parse(health[0].last_ok)<Date.now()-600000)throw new HttpError(503,'Online intake is temporarily unavailable. Please email support@seekapi.ai.');
  const payload=parseInquiry(body.inquiry);const digest=hash(JSON.stringify({payload,files:[]}));
  if(!await rpc('inquiry_create_draft',{p_id:body.id,p_token_hash:hash(body.token),p_payload_hash:digest,p_payload:payload,p_files:[]}))throw new HttpError(409,'Submission changed or expired. Start a new submission.');
  return response({uploads:[]});
}catch(e){return failure(e);}}
