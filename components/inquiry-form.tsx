'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { copy,fieldOrder,fieldLabel,policyLabels,previewLabels } from '@/lib/inquiries/translations';
import type { Locale } from '@/lib/inquiries/core';
const englishServices=['Sourcing / RFQ','Supplier verification / communication','Samples / NPI','Production / quality','Compliance / registration','Trademark / IP','Customs / tax / documentation','Logistics / warehousing','Returns / claims','Ongoing China Desk','Agent handoff','Other / not sure'];
export function InquiryForm({locale='en',services=englishServices}:{locale?:Locale;services?:string[]}){
 const c=copy[locale];const path=usePathname();const params=useSearchParams();const [audience,setAudience]=useState(locale==='en'&&params.get('audience')==='agent'?'agent':'company');
 const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);const [locked,setLocked]=useState(false);const [receipt,setReceipt]=useState('');
 const session=useRef<{id:string;token:string;inquiry:unknown}|null>(null);const result=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(receipt)result.current?.focus();},[receipt]);
 async function post(url:string,body:unknown){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw new Error('Submission failed');return data;}
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const form=e.currentTarget;if(busy||receipt)return;
 if(!locked&&!form.reportValidity())return;setBusy(true);setMessage('');
 try{
  if(!session.current){const f=new FormData(form);const details=Object.fromEntries(fieldOrder.map(k=>[k,String(f.get(k)||'')]));const bytes=crypto.getRandomValues(new Uint8Array(32));session.current={id:crypto.randomUUID(),token:Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join(''),inquiry:{name:f.get('name'),email:f.get('email'),country:f.get('country'),message:f.get('message'),audience,locale,services:f.getAll('services'),details,consent:f.get('consent')==='on',compliance:f.get('compliance')==='on',source:path}};setLocked(true);}
  const s=session.current;await post('/api/inquiries/draft',{...s,files:[],website_check:String(new FormData(form).get('website_check')||'')});
  const r=await post('/api/inquiries/finalize',{id:s.id,token:s.token});setReceipt(r.reference);session.current=null;
 }catch{setMessage(c.error);}finally{setBusy(false);}}
 function restart(){session.current=null;setLocked(false);setMessage('');}
 function field(key:typeof fieldOrder[number],required=false){const long=['product','suppliers','certification','logistics','allowed_actions','prohibited_actions','required_evidence'].includes(key);return <div key={key} className={'field'+(long?' full':'')}><label htmlFor={'inq-'+key}>{fieldLabel(locale,key)}{required?' *':''}</label>{long?<textarea id={'inq-'+key} name={key} maxLength={key.endsWith('actions')||key==='required_evidence'?4000:2000} required={required}/>:<input id={'inq-'+key} name={key} maxLength={2000} required={required} type={key==='website'?'url':'text'}/>}</div>;}
 return <div className="form-card inquiry-card" lang={locale} dir={locale==='ar'?'rtl':'ltr'}>
  {receipt?<div className="inquiry-receipt" role="status" tabIndex={-1} ref={result}><h2>{c.received}</h2><p>{c.reference}: <strong>{receipt}</strong></p><p>{c.boundary}</p><a href="mailto:support@seekapi.ai">support@seekapi.ai</a></div>:<>
  <h2>{c.title}</h2>{process.env.NEXT_PUBLIC_INQUIRY_PREVIEW==='1'?<p className="notice">{previewLabels[locale]}</p>:null}<p>{c.intro}</p>
  <form onSubmit={submit} aria-label={c.title}>
   <fieldset disabled={locked||busy} className="inquiry-fields">
   {locale==='en'?<div className="mode-switch"><button type="button" aria-pressed={audience==='company'} onClick={()=>setAudience('company')}>{c.company}</button><button type="button" aria-pressed={audience==='agent'} onClick={()=>setAudience('agent')}>{c.agent}</button></div>:null}
   <div className="form-grid">
    <div className="field"><label htmlFor="inq-name">{c.name} *</label><input id="inq-name" name="name" autoComplete="name" required maxLength={150}/></div>
    <div className="field"><label htmlFor="inq-email">{c.email} *</label><input id="inq-email" name="email" type="email" autoComplete="email" required maxLength={254}/></div>
    <div className="field"><label htmlFor="inq-country">{c.country} *</label><input id="inq-country" name="country" autoComplete="country-name" required maxLength={100}/></div>
    <div className="field full"><label htmlFor="inq-message">{c.message} *</label><textarea id="inq-message" name="message" rows={6} required maxLength={12000}/></div>
   </div>
   <div className="inquiry-services">{services.map(s=><label key={s}><input type="checkbox" name="services" value={s}/><span>{s}</span></label>)}</div>
   <details className="inquiry-details"><summary>{c.details}</summary><div className="form-grid">{fieldOrder.slice(0,19).map(k=>field(k))}</div></details>
   {audience==='agent'?<fieldset className="inquiry-details"><legend>{c.permissions}</legend><div className="form-grid">{fieldOrder.slice(19).map(k=>field(k,k!=='task_type'))}</div></fieldset>:null}
   {locale==='ru'?<label className="inquiry-consent"><input type="checkbox" name="compliance" required/><span>{c.compliance}</span></label>:null}
   <label className="inquiry-consent"><input type="checkbox" name="consent" required/><span>{c.consent} <a href={'/inquiry-privacy?lang='+locale} target="_blank" rel="noopener">{policyLabels[locale]} ↗</a></span></label>
   <div className="inquiry-honeypot" aria-hidden="true"><label>Website check<input name="website_check" tabIndex={-1} autoComplete="off"/></label></div>
   </fieldset>
   <div className="button-row"><button className="button" type="submit" disabled={busy}>{busy?c.submitting:c.submit}</button>{locked&&!busy?<button className="button button-ghost" type="button" onClick={restart}>{c.restart}</button>:null}</div>
   {message?<p role="alert" className="form-status">{message}</p>:null}<p className="form-note">{c.boundary}</p>
  </form></>}
 </div>;
}
