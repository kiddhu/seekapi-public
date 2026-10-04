'use client';
import { useState } from 'react';
import { orderPointerKey, intentKey, isOrderPointer } from '@/lib/checkout-contract';
export function CheckoutEntry({enabled}:{enabled:boolean}){
  const [draft,setDraft]=useState<Record<string,unknown>|null>(null),[digest,setDigest]=useState('');
  const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const [review,setReview]=useState(false);
  async function api(path:string,body:unknown){
    const r=await fetch('/checkout/stripe/'+path,{method:'POST',credentials:'same-origin',cache:'no-store',
      headers:{'content-type':'application/json','x-seekapi-card-claim':'1'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
    if(!r.ok)throw Error('UNAVAILABLE');return r.json();
  }
  async function prepare(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setMessage('');setBusy(true);
    const form=new FormData(event.currentTarget);
    const product=String(form.get('product')).trim(),quantity=Number(form.get('quantity')),unit=String(form.get('unit')).trim(),specs=String(form.get('specs')).trim();
    const value={input:{text:product},product_name:product,quantity,unit,must_match:specs?[{attribute:'Specification',expected:specs}]:[],model_or_reference:null,substitution_allowed:false};
    try{
      const prior=sessionStorage.getItem(orderPointerKey);
      if(isOrderPointer(prior)){location.assign('/checkout/return');return;}
      // Check persistence BEFORE the first order/Checkout operation.
      if(!sessionStorage.getItem(intentKey))sessionStorage.setItem(intentKey,crypto.randomUUID());
      if(!sessionStorage.getItem(intentKey))throw Error('STORAGE');
      setDraft(value);
      if(enabled){await api('card-session',{});const p=await api('card-prepare',{draft:value});if(!/^[0-9a-f]{64}$/.test(p.draft_digest))throw Error('PREPARE');setDigest(p.draft_digest);}
      setReview(true);
    }catch{setMessage('We couldn’t prepare your purchase safely. Keep this tab open and contact support before paying.')}finally{setBusy(false)}
  }
  async function pay(){
    if(!enabled||!draft||!digest||busy)return;
    setBusy(true);setMessage('');
    try{
      const intent=sessionStorage.getItem(intentKey);if(!intent)throw Error('STORAGE');
      const saved=sessionStorage.getItem('seekapi.checkout.confirmation.v1');
      const payload=saved?JSON.parse(saved):{intent_id:intent,draft,draft_digest:digest,customer_confirmed_digest:digest,confirmed_at:new Date().toISOString()};
      if(payload.draft_digest!==digest)throw Error('PREVIOUS_CONFIRMATION');
      if(!saved)sessionStorage.setItem('seekapi.checkout.confirmation.v1',JSON.stringify(payload));
      const order=await api('card-order',payload);if(!isOrderPointer(order.order_id))throw Error('ORDER');
      sessionStorage.setItem(orderPointerKey,order.order_id);
      if(sessionStorage.getItem(orderPointerKey)!==order.order_id)throw Error('STORAGE');
      const session=await api('session',{order_id:order.order_id}),url=new URL(session.checkout_url);
      if(url.origin!=='https://checkout.stripe.com'||url.username||url.password)throw Error('URL');
      location.assign(url.href);
    }catch{setMessage('We couldn’t safely finish opening checkout. Do not pay again yet. Check your purchase status or contact support.')}finally{setBusy(false)}
  }
  return <div className="checkout-wrap"><div className="checkout-card">
    <div className="checkout-kicker"><span>CHINA SUPPLY CHECK</span><span>USD $2.99 · One time</span></div>
    <h1 style={{marginTop:32}}>One product brief.<br/>A clearer supplier shortlist.</h1>
    <p className="checkout-lead">Find three evidence-backed supplier candidates worth advancing to RFQ on a successful check. Compare source listings, specifications, minimum quantities and observed prices. If the evidence falls short, your report explains the gaps.</p>
    {!enabled&&<div className="checkout-note"><h2>Card checkout is being prepared</h2><p>You can review a brief here, but card purchases are not open yet. Nothing will be charged or sent for sourcing.</p><a href="/for-agents#china-supply-check-mcp" className="text-link">Use the available Agent purchase path</a></div>}
    {!review?<form className="checkout-form" onSubmit={prepare}>
      <label>What product do you need?<input name="product" required maxLength={200} placeholder="For example, M6 stainless steel washers"/></label>
      <label>Quantity<input name="quantity" type="number" min={1} max={1000000000} step={1} required/></label>
      <label>Unit<input name="unit" required maxLength={32} defaultValue="pieces"/></label>
      <label>Must-have specification <span>(optional)</span><textarea name="specs" maxLength={100} placeholder="For example, 304 stainless steel"/></label>
      <button className="button" disabled={busy} type="submit">{busy?'Preparing…':'Review your brief'}</button>
    </form>:<div className="checkout-review"><h2>Review your supply check</h2><p><strong>{String(draft?.product_name)}</strong> · {String(draft?.quantity)} {String(draft?.unit)}</p><p>Must-have specification: {String((draft?.must_match as {expected:string}[]|undefined)?.[0]?.expected||"None added")}</p><p>Exact product requested; substitutions are not permitted.</p><p className="checkout-price">USD $2.99</p><p>One supply check. No subscription. Supplier outreach and a confirmed supplier quotation are separate steps.</p>
      {enabled?<button className="button" disabled={busy} onClick={pay}>{busy?'Opening securely…':'Confirm brief & continue to Stripe'}</button>:<p>Card checkout is not open yet. Contact us for help with this brief.</p>}
      <p><a className="text-link" href="mailto:support@seekapi.ai?subject=China%20Supply%20Check%20purchase">Contact support</a></p>
    </div>}
    <p role="status" aria-live="polite">{message}</p>
    <p className="checkout-small">Already paid? <a href="/checkout/return" className="text-link">Check your existing purchase</a>. Keep the browser and tab used for checkout. Do not start a second payment to recover access.</p>
    <p className="checkout-small">Read our <a href="/terms">Service Terms</a> and <a href="/privacy">Privacy Notice</a>. Do not include payment details or confidential drawings in your brief.</p>
  </div></div>;
}
