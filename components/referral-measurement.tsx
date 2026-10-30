'use client';
import {useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
import {createBrowserObserver} from '@/lib/referral-funnel/browser.mjs';
import {classifyLink} from '@/lib/referral-funnel/interaction.mjs';
import type {BrowserEvent} from '@/lib/referral-funnel/funnel.mjs';

const ENDPOINT='https://api.seekapi.ai/checkout/stripe/metrics';
/** Optional categories/random IDs only; no cookies, storage, input reads or customer wait. */
export function ReferralMeasurement({enabled=false}:{enabled?:boolean}){
 const path=usePathname();
 const observer=useRef<ReturnType<typeof createBrowserObserver>|null>(null);
 const last=useRef<BrowserEvent|null>(null);
 useEffect(()=>{
  if(!enabled)return;
  const nav=navigator as Navigator&{globalPrivacyControl?:boolean};
  observer.current=createBrowserObserver({globalPrivacyControl:nav.globalPrivacyControl===true,doNotTrack:nav.doNotTrack,
   send:event=>{if(nav.globalPrivacyControl||nav.doNotTrack==='1')return;last.current=event;void fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(event),credentials:'omit',referrerPolicy:'no-referrer',keepalive:true}).catch(()=>{});}});
  const click=(event:MouseEvent)=>{
   try{
    const anchor=event.target instanceof Element?event.target.closest('a'):null;if(!anchor)return;
    const intent=classifyLink(anchor.href);
    if(intent.entry)anchor.href=intent.entry;last.current=null;
    observer.current?.observe(intent.type,{path:location.pathname,referrer:document.referrer,search:location.search,
     mode:intent.mode,product:intent.product,...(intent.entry?{request_or_prepare_correlation_id:crypto.randomUUID()}:{})});
    const captured=last.current as BrowserEvent|null;
    if(intent.entry&&captured?.event_type==='SALES_CTA_CLICK'){
     const encoded=btoa(JSON.stringify(captured)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
     anchor.href=intent.entry+'#sf='+encoded;
    }
   }catch{/* Original anchor remains usable when measurement fails. */}
  };
  document.addEventListener('click',click,true);
  return()=>{document.removeEventListener('click',click,true);observer.current?.reset();observer.current=null;last.current=null;};
 },[enabled]);
 useEffect(()=>{observer.current?.observe('PAGE_VIEW',{path,referrer:document.referrer,search:location.search});},[path]);
 return null;
}
