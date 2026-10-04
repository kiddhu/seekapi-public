'use client';
import { useEffect, useState } from 'react';
import { checkoutJson } from '@/lib/checkout-reader';
import { copy, customerState, isOrderPointer, orderPointerKey, type CustomerReport, type CustomerState } from '@/lib/checkout-contract';

function EvidenceList({title,items}:{title:string;items:string[]}){
  return items.length>0?<div><h4>{title}</h4><ul>{items.map((v,i)=><li key={i}>{v}</li>)}</ul></div>:null;
}
function EvidenceGates({items}:{items:{attribute:string;expected:string;observed:string;verdict:string}[]}){
  return items.length>0?<ul>{items.map((v,i)=><li key={i}><strong>{v.attribute}</strong>: requested {v.expected}; observed {v.observed}. {v.verdict}.</li>)}</ul>:null;
}
export function ReportView({report}:{report:CustomerReport}){
  return <section className="checkout-report" aria-label="Your China Supply Check result">
    <div className="checkout-report-head"><p className="eyebrow">Your China Supply Check</p><h2>{report.product}</h2><p>{report.quantity} {report.unit}{report.model&&<> · Reference: {report.model}</>}</p>
      <EvidenceList title="Your must-have requirements" items={report.requirements}/><p>{report.substitutions?'Substitutions were allowed in your brief.':'Substitutions were not allowed in your brief.'}</p>
      <EvidenceList title="Questions about your brief" items={report.buyerUnknowns}/><p>{report.conclusion}</p>
    </div>
    {(report.unknowns.length>0||report.questions.length>0||report.contradictions.length>0)&&<div className="checkout-note">
      <EvidenceList title="Points to confirm" items={report.unknowns}/><EvidenceList title="Questions for your next step" items={report.questions}/><EvidenceList title="Requirements to resolve" items={report.contradictions}/>
    </div>}
    {report.suppliers.map((supplier,i)=><article className="checkout-supplier" key={i}><p className="eyebrow">Candidate {i+1}</p><h3>{supplier.name}</h3><p>{supplier.title}</p><p>{supplier.reason}</p>
      <dl><dt>Published price</dt><dd>{supplier.price||'Not captured in this report'}</dd><dt>Minimum order quantity</dt><dd>{supplier.moq||'Not captured in this report'}</dd><dt>Requested quantity fit</dt><dd>{supplier.quantityFit}</dd><dt>Observed</dt><dd>{supplier.observedAt||'Not recorded'}</dd></dl>
      <EvidenceList title="Matching evidence" items={supplier.matches}/><EvidenceList title="Differences to review" items={supplier.mismatches}/><EvidenceList title="Confirm with the supplier" items={supplier.unknowns}/>
      {supplier.qualification&&<div><h4>Product evidence assessment</h4><p>{supplier.qualification.verdict}</p><EvidenceGates items={supplier.qualification.gates}/><EvidenceList title="Risks to review" items={supplier.qualification.risks}/></div>}
      {supplier.assessment&&<div><h4>Why consider this supplier?</h4><p>{supplier.assessment.productFit}. {supplier.assessment.supplierFit}.</p><p>{supplier.assessment.why}</p><EvidenceGates items={supplier.assessment.gates}/>
        <EvidenceList title="Supplier capability evidence" items={supplier.assessment.capability}/><EvidenceList title="Customization evidence" items={supplier.assessment.customization}/><EvidenceList title="Uncertainties" items={supplier.assessment.uncertainties}/><EvidenceList title="Questions for an RFQ" items={supplier.assessment.questions}/><EvidenceList title="Requirements to resolve" items={supplier.assessment.contradictions}/>
      </div>}
      {supplier.certifications.length>0&&<div><h4>Recorded third-party evidence</h4><ul>{supplier.certifications.map((c,n)=><li key={n}>{c.issuer}: {c.scope} · Observed {c.observedAt}{c.url&&<> · <a href={c.url} target="_blank" rel="noopener noreferrer">Source</a></>}</li>)}</ul></div>}
      <div className="button-row">{supplier.url&&<a className="button button-ghost" href={supplier.url} target="_blank" rel="noopener noreferrer">View source listing</a>}{supplier.contact&&supplier.contact!==supplier.url&&<a className="text-link" href={supplier.contact} target="_blank" rel="noopener noreferrer">Supplier contact page</a>}</div>
    </article>)}
    {report.promising.length>0&&<div className="checkout-note"><h3>Other leads needing confirmation</h3><p>These leads have evidence gaps and do not count as qualified candidates.</p>
      {report.promising.map((p,i)=><article key={i}><h4>{p.title}</h4><p>Observed {p.observedAt||'not recorded'}</p><EvidenceList title="Observed matches" items={p.matches}/><EvidenceList title="Evidence gaps" items={p.gaps}/><EvidenceList title="Variants to discuss" items={p.variants}/>{p.url&&<a href={p.url} target="_blank" rel="noopener noreferrer">View source listing</a>}</article>)}
    </div>}
    {report.exclusions.length>0&&<div className="checkout-note"><h3>Why other candidates were excluded</h3><ul>{report.exclusions.map((e,i)=><li key={i}>{e.reason}{e.count!==null&&<>: {e.count}</>}</li>)}</ul></div>}
    {report.rfqDraft&&<div className="checkout-note"><h3>Your draft request for quotation</h3><p>Review and adapt this draft before contacting a supplier yourself. No message has been sent. Assisted supplier outreach is not available from this page.</p><pre className="checkout-rfq">{report.rfqDraft}</pre></div>}
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
    const check=async()=>{
      if(stopped||Date.now()-started>=60000)return;
      if(document.visibilityState==='hidden'){timer=setTimeout(check,5000);return;}
      setBusy(true);
      try{
        const {response,data}=await checkoutJson('customer-status',order!,controller.signal);
        if(stopped)return;
        const next=response.ok?customerState(data.state):[401,403].includes(response.status)?'NO_ACCESS':'UNKNOWN';
        setState(next);setTestMode(data.test_mode===true);setExpires(typeof data.access_expires_at==='string'?data.access_expires_at:null);
        if(next!=='READY')setReport(null);
        if(next==='READY'&&showResult){
          const {response:result,data:body}=await checkoutJson('result',order!,controller.signal);
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
