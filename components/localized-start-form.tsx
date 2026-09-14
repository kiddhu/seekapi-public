'use client';
import { FormEvent, useState } from 'react';
import type { FormCopy } from '@/lib/localized-content';

export function LocalizedStartForm({copy, russian=false}:{copy:FormCopy;russian?:boolean}){
  const [message,setMessage]=useState(''); const [preparedHref,setPreparedHref]=useState('');
  function prepare(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;if(!form.checkValidity()){setPreparedHref('');setMessage(copy.missing);form.reportValidity();return;}const values=new FormData(form);const lines=['SeekAPI scope review request'];for(const [key,value] of values.entries()){if(String(value).trim())lines.push(`${key}: ${String(value).trim()}`);}lines.push('',russian?'I confirm that the request is for lawful civilian goods and disclose the buyer, payer, consignee, end user, end use and full route. I am not requesting sanctions, export-control, customs or banking evasion.':'This email requests a scope review. It is not task acceptance, a contract or payment authorization.');setPreparedHref(`mailto:support@seekapi.ai?subject=${encodeURIComponent(russian?'SeekAPI compliance sourcing review':'SeekAPI company scope review')}&body=${encodeURIComponent(lines.join('\n'))}`);setMessage(copy.ready);}
  return <div className="form-card"><div className="notice" id="localized-sensitive-note"><strong>{copy.notice}</strong></div><form aria-describedby="localized-sensitive-note" onSubmit={prepare} onReset={()=>{setMessage(copy.cleared);setPreparedHref('')}} noValidate><h2>{copy.title}</h2><div className="form-grid">
    <div className="field"><label htmlFor="organization">{copy.organization}</label><input id="organization" name="organization" required autoComplete="organization"/></div>
    <div className="field"><label htmlFor="role">{copy.role}</label><input id="role" name="role" required/></div>
    <div className="field"><label htmlFor="country">{copy.country}</label><input id="country" name="country" required autoComplete="country-name"/></div>
    <div className="field"><label htmlFor="contact">{copy.email}</label><input id="contact" name="contact" type="email" required autoComplete="email"/></div>
    <div className="field full"><label htmlFor="help_type">{copy.help}</label><select id="help_type" name="help_type" required defaultValue=""><option value="">—</option>{copy.options.map(option=><option key={option}>{option}</option>)}</select></div>
    <div className="field full"><label htmlFor="issue">{copy.issue}</label><textarea id="issue" name="issue" required placeholder={copy.issuePlaceholder}/></div>
    <div className="field full"><label htmlFor="data_sensitivity">{copy.sensitivity}</label><select id="data_sensitivity" name="data_sensitivity" required defaultValue=""><option value="">—</option>{copy.sensitivityOptions.map(option=><option key={option}>{option}</option>)}</select></div>
  </div><div className="button-row form-actions"><button className="button" type="submit">{copy.prepare}</button><button className="button button-ghost" type="reset">{copy.clear}</button>{preparedHref?<a className="button button-success" href={preparedHref}>{copy.open}</a>:null}</div><p className="form-status" role="status" aria-live="polite">{message}</p><p className="form-note">{copy.note}</p></form></div>;
}
