import 'server-only';
import { env,rpc,sb } from './server';
import { copy } from './translations';
import type { Locale } from './core';
export async function sendPendingMail(){
 for(let n=0;n<2;n++){
 const jobs=await rpc('inquiry_claim_mail',{});if(!jobs.length)return;const job=jobs[0];
 try{
 const rows=await sb('/rest/v1/inquiries?id=eq.'+job.inquiry_id+'&select=*');const i=rows[0];if(!i||i.deletion_requested_at){await sb('/rest/v1/inquiry_outbox?id=eq.'+job.id,{method:'PATCH',body:JSON.stringify({state:'cancelled',lease_until:null})});continue;}
 const p=i.payload;const c=copy[(p.locale||'en') as Locale];
 // Persist exact provider payload before sending: retries must not change body.
 const payload=job.message_payload||{from:env('INQUIRY_MAIL_FROM'),to:[job.kind==='staff'?'support@seekapi.ai':p.email],reply_to:job.kind==='staff'?p.email:'support@seekapi.ai',subject:job.kind==='staff'?`SeekAPI inquiry ${i.reference}`:`SeekAPI — ${c.reference} ${i.reference}`,text:job.kind==='staff'?`${i.reference}\n${p.name} · ${p.country}\n${p.email}\n${p.services.join(', ')}\n\n${p.message}\n\nReview: ${env('INQUIRY_SITE_URL')}/admin/inquiries/${i.id}`:`${c.received}\n\n${c.reference}: ${i.reference}\n${i.created_at}\n\n${c.boundary}\n\nsupport@seekapi.ai`};
 if(!job.message_payload)await sb('/rest/v1/inquiry_outbox?id=eq.'+job.id,{method:'PATCH',body:JSON.stringify({message_payload:payload})});
 const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env('INQUIRY_RESEND_API_KEY'),'Content-Type':'application/json','Idempotency-Key':'inquiry/'+job.id},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
 if(!res.ok)throw new Error('mail provider unavailable');const result=await res.json();
 await sb('/rest/v1/inquiry_outbox?id=eq.'+job.id,{method:'PATCH',body:JSON.stringify({state:'provider_accepted',provider_id:result.id,lease_until:null})});
 }catch{await sb('/rest/v1/inquiry_outbox?id=eq.'+job.id,{method:'PATCH',body:JSON.stringify({state:'pending',lease_until:null,next_attempt_at:new Date(Date.now()+Math.min(3600000,60000*2**job.attempts)).toISOString()})});}
 }
}
