import {sanitizeBrowserEvent,pathClass,SESSION_TTL_MS} from './funnel.mjs';

/** Explicit opt-in at integration time, after disclosure and exact review.
 * No cookies, local/session storage, URL decoration, global handlers, or retry queue.
 * `send` must be an existing bounded first-party sink; this module installs none.
 * Short-lived random ID lives in this closure only; a new document gets a new ID.
 */
export function createBrowserObserver({send,randomUUID=()=>globalThis.crypto.randomUUID(),now=()=>Date.now(),enabled=true,globalPrivacyControl=false,doNotTrack=null}={}){
  let session=null,expires=0;
  const reset=()=>{session=null;expires=0;};
  return Object.freeze({reset,observe(type,context={}){
    try{
      if(!enabled||globalPrivacyControl||doNotTrack==='1'||typeof send!=='function'){reset();return;}
      const entryAction=['/checkout/stripe/image','/checkout/stripe/rfq'].includes(context.path)&&['PREPARE_STARTED','PREPARE_CONFIRMED','CHECKOUT_STARTED'].includes(type);
      if(!pathClass(context.path)&&!entryAction){reset();return;}
      const time=now();
      if(!session||time>=expires){session=randomUUID();expires=time+SESSION_TTL_MS;}
      const event=sanitizeBrowserEvent({...context,event_type:type,event_id:randomUUID(),privacy_safe_session_id:session},{now:time});
      if(!event)return;
      // Never await metrics. Both synchronous and async blockers are isolated.
      Promise.resolve(send(event)).catch(()=>{});
    }catch{reset();}
  }});
}
