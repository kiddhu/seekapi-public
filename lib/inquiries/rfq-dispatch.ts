import {createHash} from 'node:crypto';
type Payload=Record<string,unknown>;
function canonical(value:unknown):unknown{
 if(Array.isArray(value))return value.map(canonical);
 if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical((value as Payload)[k])]));
 return value;
}
/** Existing worker checks current canonical eligibility on EVERY RFQ send/retry.
 * Context is private queue metadata, never a new grant or a provider mail field. */
export async function rfqProviderPayload(job:{id:string},inquiry:Payload,payload:Payload,fetchImpl:typeof fetch=fetch,now:()=>number=()=>Date.now()):Promise<Payload|null>{
 const rfq=inquiry.kind==='INTERNAL_RFQ_NOTIFICATION'||Object.hasOwn(payload,'seekapi_rfq_dispatch')
  ||Array.isArray(payload.tags)&&payload.tags.some(t=>t&&typeof t==='object'&&(t as Payload).name==='rfq_mail_type');
 if(!rfq)return payload;
 const {seekapi_rfq_dispatch:raw,...outbound}=payload;if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 const context=raw as Payload,expires=typeof context.expiresAt==='string'?Date.parse(context.expiresAt):NaN;
 const digest=createHash('sha256').update(JSON.stringify(canonical(outbound))).digest('hex');
 if(context.schemaVersion!=='rfq.mail-dispatch.v1'||context.jobId!==job.id||context.payloadDigest!==digest
  ||typeof context.signature!=='string'||!/^[a-f0-9]{64}$/.test(context.signature)||!Number.isFinite(expires)||expires<=now())return null;
 const response=await fetchImpl('https://api.seekapi.ai/checkout/stripe/rfq-mail-authorization',{
  method:'POST',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify({authorization:context}),signal:AbortSignal.timeout(8000)});
 if(response.status===401||response.status===403)return null;
 if(!response.ok)throw Error('RFQ_MAIL_ELIGIBILITY_UNAVAILABLE');
 const current=await response.json();
 if(current.schemaVersion!=='rfq.mail-dispatch.v1'||current.authorized!==true||current.jobId!==job.id
  ||current.authorityDigest!==context.authorityDigest||current.expiresAt!==context.expiresAt||expires<=now())return null;
 return outbound;
}
