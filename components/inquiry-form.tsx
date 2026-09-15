'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { copy,fieldOrder,fieldLabel } from '@/lib/inquiries/translations';
import { extensions,parseFiles,type Locale } from '@/lib/inquiries/core';
const englishServices=['Sourcing / RFQ','Supplier verification / communication','Samples / NPI','Production / quality','Compliance / registration','Trademark / IP','Customs / tax / documentation','Logistics / warehousing','Returns / claims','Ongoing China Desk','Agent handoff','Other / not sure'];
export function InquiryForm({locale='en',services=englishServices}:{locale?:Locale;services?:string[]}){
 const c=copy[locale];const path=usePathname();const params=useSearchParams();const [audience,setAudience]=useState(locale==='en'&&params.get('audience')==='agent'?'agent':'company');
 const [files,setFiles]=useState<File[]>([]);const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);const [locked,setLocked]=useState(false);const [progress,setProgress]=useState<Record<string,number>>({});const [receipt,setReceipt]=useState('');
 const session=useRef<{id:string;token:string;inquiry:unknown}|null>(null);const fileInput=useRef<HTMLInputElement>(null);const result=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(receipt)result.current?.focus();},[receipt]);
 function addFiles(incoming:File[]){if(locked||busy)return;const next=[...files,...incoming];try{parseFiles(next.map(f=>({name:f.name,size:f.size})));setFiles(next);setMessage('');}catch{setMessage(c.fileHelp);}}
 async function post(url:string,body:unknown){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw new Error('Submission failed');return data;}
 function upload(file:File,url:string,index:number){return new Promise<void>((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('PUT',url);xhr.timeout=180000;xhr.setRequestHeader('Content-Type','application/octet-stream');xhr.upload.onprogress=e=>{if(e.lengthComputable)setProgress(p=>({...p,[index]:Math.round(e.loaded/e.total*100)}));};xhr.onload=()=>{if((xhr.status>=200&&xhr.status<300)||xhr.status===409){setProgress(p=>({...p,[index]:100}));resolve();}else reject(new Error('Upload failed'));};xhr.onerror=xhr.ontimeout=()=>reject(new Error('Upload failed'));xhr.send(file);});}
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const form=e.currentTarget;if(busy||receipt)return;
 if(!locked&&!form.reportValidity())return;setBusy(true);setMessage('');
 try{
  if(!session.current){const f=new FormData(form);const details=Object.fromEntries(fieldOrder.map(k=>[k,String(f.get(k)||'')]));const bytes=crypto.getRandomValues(new Uint8Array(32));session.current={id:crypto.randomUUID(),token:Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join(''),inquiry:{name:f.get('name'),email:f.get('email'),country:f.get('country'),message:f.get('message'),audience,locale,services:f.getAll('services'),details,consent:f.get('consent')==='on',compliance:f.get('compliance')==='on',source:path}};setLocked(true);}
  const s=session.current;const d=await post('/api/inquiries/draft',{...s,files:files.map(f=>({name:f.name,size:f.size})),website_check:String(new FormData(form).get('website_check')||'')});
  for(let i=0;i<files.length;i++)await upload(files[i],d.uploads[i].url,i);
  const r=await post('/api/inquiries/finalize',{id:s.id,token:s.token});setReceipt(r.reference);session.current=null;
 }catch{setMessage(c.error);}finally{setBusy(false);}}
 function restart(){session.current=null;setLocked(false);setProgress({});setMessage('');}
 function field(key:typeof fieldOrder[number],required=false){const long=['product','suppliers','certification','logistics','allowed_actions','prohibited_actions','required_evidence'].includes(key);return <div key={key} className={'field'+(long?' full':'')}><label htmlFor={'inq-'+key}>{fieldLabel(locale,key)}{required?' *':''}</label>{long?<textarea id={'inq-'+key} name={key} maxLength={key.endsWith('actions')||key==='required_evidence'?4000:2000} required={required}/>:<input id={'inq-'+key} name={key} maxLength={2000} required={required} type={key==='website'?'url':'text'}/>}</div>;}
 return <div className="form-card inquiry-card" lang={locale} dir={locale==='ar'?'rtl':'ltr'}>
  {receipt?<div className="inquiry-receipt" role="status" tabIndex={-1} ref={result}><h2>{c.received}</h2><p>{c.reference}: <strong>{receipt}</strong></p><p>{c.boundary}</p><a href="mailto:support@seekapi.ai">support@seekapi.ai</a></div>:<>
  <h2>{c.title}</h2>{process.env.NEXT_PUBLIC_INQUIRY_PREVIEW==='1'?<p className="notice">Preview · Online submission is not connected. Use synthetic test data only.</p>:null}<p>{c.intro}</p>
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
   <section className="inquiry-upload" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();addFiles(Array.from(e.dataTransfer.files));}}>
    <label htmlFor="inq-files"><strong>{c.files}</strong></label><p id="inq-file-help">{c.fileHelp}</p><input ref={fileInput} id="inq-files" type="file" multiple accept={extensions.map(x=>'.'+x).join(',')} aria-describedby="inq-file-help" onChange={e=>{addFiles(Array.from(e.target.files||[]));e.target.value='';}}/>
    <ul>{files.map((f,i)=><li key={i}><span>{f.name} · {(f.size/1024/1024).toFixed(1)} MB</span><button type="button" onClick={()=>setFiles(files.filter((_,j)=>j!==i))} aria-label={c.remove+' '+f.name}>{c.remove}</button></li>)}</ul>
   </section>
   {locale==='ru'?<label className="inquiry-consent"><input type="checkbox" name="compliance" required/><span>{c.compliance}</span></label>:null}
   <label className="inquiry-consent"><input type="checkbox" name="consent" required/><span>{c.consent} <a href={'/inquiry-privacy?lang='+locale} target="_blank" rel="noopener">↗</a></span></label>
   <div className="inquiry-honeypot" aria-hidden="true"><label>Website check<input name="website_check" tabIndex={-1} autoComplete="off"/></label></div>
   </fieldset>
   {locked&&files.length?<ul className="inquiry-progress">{files.map((f,i)=><li key={i}>{f.name}<progress max={100} value={progress[i]||0} aria-label={f.name}/><span>{progress[i]||0}%</span></li>)}</ul>:null}
   <div className="button-row"><button className="button" type="submit" disabled={busy}>{busy?c.submitting:c.submit}</button>{locked&&!busy?<button className="button button-ghost" type="button" onClick={restart}>{c.restart}</button>:null}</div>
   {message?<p role="alert" className="form-status">{message}</p>:null}<p className="form-note">{c.boundary}</p>
  </form></>}
 </div>;
}
