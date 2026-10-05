'use client';
import {useEffect,useRef,useState} from 'react';
import {CheckoutEntry} from './checkout-entry';
import {privatePurchaseContext,type PrivatePurchaseContext,orderPointerKey,isOrderPointer} from '@/lib/checkout-contract';
import {boundedText} from '@/lib/checkout-body';
/** This private page has no analytics/third-party shell. Invitation is not a card token. */
export function PrivateCheckoutEntry(){
  const started=useRef(false),[context,setContext]=useState<PrivatePurchaseContext|null>(null),[failed,setFailed]=useState(false);
  useEffect(()=>{
    if(started.current)return;started.current=true;
    const invitation=window.location.hash.slice(1);
    // Remove fragment before any network effect; never persist or put it in a query/body log.
    history.replaceState(null,'','/checkout/private');
    async function api(operation:string,payload:unknown){
      const r=await fetch('/checkout/stripe/'+operation,{method:'POST',credentials:'same-origin',cache:'no-store',
        headers:{'content-type':'application/json','x-seekapi-card-claim':'1'},body:JSON.stringify(payload),signal:AbortSignal.timeout(8000)});
      if(!r.ok)throw Error('UNAVAILABLE');return JSON.parse(await boundedText(r.body,16384,undefined,8000));
    }
    void (async()=>{
      if(isOrderPointer(sessionStorage.getItem(orderPointerKey))){location.assign('/checkout/return');return;}
      if(invitation){if(!/^[A-Za-z0-9_-]{43}$/.test(invitation))throw Error('UNAVAILABLE');await api('acceptance-entry',{invitation});}
      const next=privatePurchaseContext(await api('acceptance-context',{}));if(!next)throw Error('UNAVAILABLE');setContext(next);
    })().catch(()=>setFailed(true));
  },[]);
  if(context)return <CheckoutEntry enabled={context.payment_available} privatePurchase={context}/>;
  return <main className="checkout-wrap"><div className="checkout-card"><a href="/" className="checkout-kicker">SeekAPI</a>
    <h1>{failed?'We couldn’t open this purchase':'Opening your supply check'}</h1>
    <p className="checkout-lead">{failed?'This private purchase link is unavailable or its access window has ended. Nothing has been charged by opening this page.':'Please keep this tab open while we check your access.'}</p>
    {failed&&<><p>If you have already paid, do not pay again yet. Use the same browser and tab to check your purchase.</p><a href="/checkout/return" className="text-link">Check purchase status</a><p><a href="mailto:support@seekapi.ai" className="text-link">Contact support</a></p></>}
  </div></main>;
}
