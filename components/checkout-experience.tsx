'use client';
import { useEffect, useState } from 'react';
import { copy, customerState, isOrderPointer, orderPointerKey, type CustomerReport, type CustomerState } from '@/lib/checkout-contract';

export function ReportView({report}:{report:CustomerReport}){
  return <section className="checkout-report" aria-label="Your China Supply Check result">
    <div className="checkout-report-head"><p className="eyebrow">Your China Supply Check</p><h2>{report.product}</h2><p>{report.quantity} {report.unit}</p><p>{report.conclusion}</p></div>
    {report.unknowns.length>0&&<div className="checkout-note"><h3>Points to confirm</h3><ul>{report.unknowns.map((v,i)=><li key={i}>{v}</li>)}</ul></div>}
    {report.suppliers.map((supplier,i)=><article className="checkout-supplier" key={i}><p className="eyebrow">Candidate {i+1}</p><h3>{supplier.name}</h3><p>{supplier.title}</p><p>{supplier.reason}</p>
      <dl><dt>Published price</dt><dd>{supplier.price||'Not captured in this report'}</dd><dt>Minimum order quantity</dt><dd>{supplier.moq||'Not captured in this report'}</dd><dt>Observed</dt><dd>{supplier.observedAt||'Not recorded'}</dd></dl>
      {supplier.matches.length>0&&<><h4>Matching evidence</h4><ul>{supplier.matches.map((v,n)=><li key={n}>{v}</li>)}</ul></>}
      {supplier.mismatches.length>0&&<><h4>Differences to review</h4><ul>{supplier.mismatches.map((v,n)=><li key={n}>{v}</li>)}</ul></>}
      {supplier.unknowns.length>0&&<><h4>Confirm with the supplier</h4><ul>{supplier.unknowns.map((v,n)=><li key={n}>{v}</li>)}</ul></>}
      <div className="button-row">{supplier.url&&<a className="button button-ghost" href={supplier.url} target="_blank" rel="noopener noreferrer">View source listing</a>}{supplier.contact&&supplier.contact!==supplier.url&&<a className="text-link" href={supplier.contact} target="_blank" rel="noopener noreferrer">Supplier contact page</a>}</div>
    </article>)}
    <p className="checkout-note">Use the source evidence to decide which candidates to contact. A listed price and a supplier’s confirmed offer for your exact request are different steps. Supplier outreach is not included in this check.</p>
  </section>;
}
export function StatusView({state,busy=false}:{state:CustomerState;busy?:boolean}){
  return <div role="status" aria-live="polite" aria-busy={busy}>
    <span className={"checkout-status-icon "+(state==='READY'?'checkout-success':'')} aria-hidden="true">{state==='READY'?'✓':state==='CONFIRMING'?'…':'i'}</span>
    <h1>{copy[state].title}</h1><p className="checkout-lead">{copy[state].body}</p>
  </div>;
}
export function CheckoutExperience({showResult=false}:{showResult?:boolean}){
  const [state,setState]=useState<CustomerState>('CONFIRMING');
  const [busy,setBusy]=useState(false),[report,setReport]=useState<CustomerReport|null>(null),[testMode,setTestMode]=useState(false);
  const [expires,setExpires]=useState<string|null>(null),[round,setRound]=useState(0);
  useEffect(()=>{
    let stopped=false;let timer:ReturnType<typeof setTimeout>|undefined;
    const controller=new AbortController();let attempts=0;const started=Date.now();
    let order:string|null=null;
    try{order=sessionStorage.getItem(orderPointerKey)}catch{}
    if(!isOrderPointer(order)){setState('NO_ACCESS');return};
    const post=async(operation:string)=>{
      const timeout=setTimeout(()=>controller.abort(),10000);
      try{return await fetch('/checkout/stripe/'+operation,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json','x-seekapi-card-claim':'1'},body:JSON.stringify({order_id:order}),signal:controller.signal})}finally{clearTimeout(timeout)}
    };
    const check=async()=>{
      if(stopped||Date.now()-started>=60000)return;
      if(document.visibilityState==='hidden'){timer=setTimeout(check,5000);return;}
      setBusy(true);
      try{
        const response=await post('customer-status');
        const data=await response.json();
        if(stopped)return;
        const next=response.ok?customerState(data.state):[401,403].includes(response.status)?'NO_ACCESS':'UNKNOWN';
        setState(next);setTestMode(data.test_mode===true);setExpires(typeof data.access_expires_at==='string'?data.access_expires_at:null);
        if(next!=='READY')setReport(null);
        if(next==='READY'&&showResult){
          const result=await post('result'),body=await result.json();
          if(stopped)return;
          if(result.ok&&body.report&&Array.isArray(body.report.suppliers))setReport(body.report);
          else{setReport(null);setState('RESULT_UNAVAILABLE')}
        }
        attempts++;
        if((next==='CONFIRMING'||next==='PROCESSING')&&attempts<12&&Date.now()-started<60000)timer=setTimeout(check,5000);
      }catch{if(!stopped){setState('UNKNOWN');setReport(null)}}finally{if(!stopped)setBusy(false)}
    };
    void check();
    return()=>{stopped=true;controller.abort();if(timer)clearTimeout(timer)};
  },[round,showResult]);
  return <div className="checkout-wrap">
    <div className="checkout-card">
      <div className="checkout-kicker"><span>CHINA SUPPLY CHECK</span><span>USD $2.99 · One time</span></div>
      {testMode&&<p className="checkout-test">Test checkout · No real payment</p>}
      <StatusView state={state} busy={busy}/>
      <noscript><p>JavaScript is needed to securely check this purchase. Enable it in this browser or contact support@seekapi.ai. Do not pay again yet.</p></noscript>
      <div className="button-row checkout-actions">
        {state==='READY'&&!showResult&&<a className="button" href="/checkout/result">View your supply check</a>}
        <button className="button button-ghost" type="button" disabled={busy} onClick={()=>setRound(v=>v+1)}>{busy?'Checking securely…':'Check status'}</button>
        <a className="text-link" href="mailto:support@seekapi.ai?subject=China%20Supply%20Check%20payment%20or%20access">Contact support</a>
      </div>
      {expires&&Number.isFinite(Date.parse(expires))&&<p className="checkout-small">Secure browser access until {new Date(expires).toLocaleString('en-US',{timeZone:'UTC'})} UTC. Keep using this browser and tab to return to your purchase.</p>}
      <div className="checkout-help"><h2>Need a hand?</h2><p>Email support@seekapi.ai with the approximate purchase time and what happened. Do not send card details, passwords or verification codes.</p><a href="/china-supply-check" className="text-link">About your supply check</a></div>
    </div>
    {report&&state==='READY'&&<ReportView report={report}/>}
  </div>;
}
