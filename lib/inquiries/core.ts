export const locales = ['en', 'ja', 'es', 'ar', 'de', 'pt-BR', 'ru'] as const;
export type Locale = typeof locales[number];
export const states = ['new','reviewing','needs_information','quoted','in_progress','closed','spam'] as const;
export const detailKeys = ['company','website','role','preferred_contact','wechat','whatsapp','phone','telegram','preferred_language','timezone','product','quantity','budget','deadline','destination','suppliers','certification','logistics','nda','allowed_actions','prohibited_actions','required_evidence','approval_contact','task_type'] as const;
export type Inquiry = {name:string;email:string;country:string;message:string;locale:Locale;audience:'company'|'agent';services:string[];details:Record<string,string>;consent:true;compliance:boolean;source:string};
export class InputError extends Error {}
function object(value:unknown):Record<string,unknown>{if(!value || typeof value!=='object'||Array.isArray(value))throw new InputError('Invalid request');return value as Record<string,unknown>;}
function string(value:unknown,max:number,required=false){if(value===undefined&&!required)return '';if(typeof value!=='string'||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))throw new InputError('Invalid field');const v=value.trim();if(required&&!v)throw new InputError('Required field');return v;}
export function parseInquiry(value:unknown):Inquiry{
  const v=object(value);const details=object(v.details||{});const out:Record<string,string>={};
  for(const key of detailKeys)out[key]=string(details[key],key.endsWith('actions')||key==='required_evidence'?4000:2000);
  const email=string(v.email,254,true);if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)||/[\r\n]/.test(email))throw new InputError('Invalid email');
  if(!locales.includes(v.locale as Locale)||!['company','agent'].includes(String(v.audience))||v.consent!==true)throw new InputError('Invalid consent or language');
  if(v.locale==='ru'&&v.compliance!==true)throw new InputError('Compliance acknowledgement required');
  if(!Array.isArray(v.services)||v.services.length>16)throw new InputError('Invalid services');
  if(v.audience==='agent'&&['allowed_actions','prohibited_actions','required_evidence','approval_contact'].some(k=>!out[k]))throw new InputError('Agent permissions and approval contact required');
  const source=string(v.source,500);if(source&&!/^\/(?!\/)[^\r\n?#]*$/.test(source))throw new InputError('Invalid source');
  return {name:string(v.name,150,true),email,country:string(v.country,100,true),message:string(v.message,12000,true),locale:v.locale as Locale,audience:v.audience as Inquiry['audience'],services:v.services.map(x=>string(x,150,true)),details:out,consent:true,compliance:v.compliance===true,source};
}
export function rejectAttachments(value:unknown){if(value===undefined)return;if(!Array.isArray(value)||value.length)throw new InputError('Attachments are not accepted in this version');}
export function validId(v:unknown):v is string{return typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);}
export function validToken(v:unknown):v is string{return typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);}
export function csvCell(value:unknown){let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
