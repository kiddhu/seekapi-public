import { boundedText } from "./checkout-body";
import { customerReport, customerState, isOrderPointer, publicCardEntryEnabled, privatePurchaseContext } from "./checkout-contract";
const operations = new Set(["card-session","card-prepare","card-order","session","customer-status","result","acceptance-entry","acceptance-context"]);
const mutations = new Set(["card-session","card-order","session","card-prepare"]);
const origin = "https://seekapi.ai";
export const responseHeaders = {"cache-control":"private, no-store, max-age=0","x-content-type-options":"nosniff","x-robots-tag":"noindex, nofollow","referrer-policy":"no-referrer","vary":"Cookie"};
const reply=(body:unknown,status=200,extra:Record<string,string>={})=>Response.json(body,{status,headers:{...responseHeaders,...extra}});
function claimCookie(header:string|null){
  const found=(header||"").split(";").map(x=>x.trim()).filter(x=>x.split("=")[0]==="seekapi_card_claim");
  if(found.length>1)throw Error("COOKIE");
  if(!found.length)return null;
  if(!/^seekapi_card_claim=[A-Za-z0-9_-]{43}$/.test(found[0]))throw Error("COOKIE");
  return found[0];
}
/** Exact same-origin relay, no payment SDK, ledger, identity or result cache. */
export async function checkoutProxy(req:Request,operation:string,fetcher:typeof fetch=fetch){
  if(!operations.has(operation))return reply({state:"UNKNOWN"},404);
  if(req.method!=="POST")return reply({state:"UNKNOWN"},405,{allow:"POST"});
  if(req.headers.get("origin")!==origin||req.headers.get("x-seekapi-card-claim")!=="1"||req.headers.get("sec-fetch-site")==="cross-site")return reply({state:"NO_ACCESS"},403);
  // OFF blocks all creation, including direct calls; a client prop/query cannot enable it.
  if(operation==="card-session"&&!publicCardEntryEnabled)return reply({state:"UNAVAILABLE"},503);
  let cookie:string|null;
  try{cookie=claimCookie(req.headers.get("cookie"))}catch{return reply({state:"NO_ACCESS"},401)}
  if(mutations.has(operation)&&!publicCardEntryEnabled&&!cookie)return reply({state:"UNAVAILABLE"},503);
  if(!cookie&&operation!=="card-session"&&operation!=="acceptance-entry")return reply({state:"NO_ACCESS"},401);
  try{
    const text=await boundedText(req.body,16384,req.signal),payload=JSON.parse(text);
    if(["customer-status","result","session"].includes(operation)&&
      (!payload||!isOrderPointer(payload.order_id)||Object.keys(payload).length!==1))return reply({state:"NO_ACCESS"},400);
    if(operation==="acceptance-entry"&&(!payload||Object.keys(payload).length!==1||typeof payload.invitation!=="string"||!/^[A-Za-z0-9_-]{43}$/.test(payload.invitation)))return reply({state:"NO_ACCESS"},400);
    if(operation==="acceptance-context"&&(!payload||Object.keys(payload).length!==0))return reply({state:"NO_ACCESS"},400);
    const headers:Record<string,string>={"content-type":"application/json",origin,"x-seekapi-card-claim":"1"};
    if(cookie)headers.cookie=cookie;
    const upstream=await fetcher("https://api.seekapi.ai/checkout/stripe/"+operation,{method:"POST",headers,body:text,cache:"no-store",redirect:"error",signal:AbortSignal.timeout(8000)});
    if(!upstream.ok)return reply({state:[401,403].includes(upstream.status)?"NO_ACCESS":"UNKNOWN"},[401,403].includes(upstream.status)?upstream.status:503);
    const data=JSON.parse(await boundedText(upstream.body,524288,req.signal,8000));
    if(operation==="customer-status"){
      const state=customerState(data.state);
      return reply({state,result_available:state==="READY",access_expires_at:typeof data.access_expires_at==="string"?data.access_expires_at:null,test_mode:data.test_mode===true});
    }
    if(operation==="result"){
      const report=customerReport(data.result);
      return report?reply({report}):reply({state:"RESULT_UNAVAILABLE"},503);
    }
    if(operation==="acceptance-context"){
      const context=privatePurchaseContext(data);return context?reply(context):reply({state:"UNKNOWN"},503);
    }
    if(operation==="card-session"||operation==="acceptance-entry"){
      const setCookie=upstream.headers.get("set-cookie");
      if(!setCookie || !/^seekapi_card_claim=[A-Za-z0-9_-]{43};/.test(setCookie) || /domain=/i.test(setCookie)
        || !/;\s*Path=\/checkout\/stripe(?:;|$)/i.test(setCookie) || !/;\s*Secure(?:;|$)/i.test(setCookie)
        || !/;\s*HttpOnly(?:;|$)/i.test(setCookie) || !/;\s*SameSite=Strict(?:;|$)/i.test(setCookie)
        || setCookie.includes(",")) return reply({state:"UNKNOWN"},503);
      return reply(operation==="acceptance-entry"?{state:"ADMITTED"}:{access_expires_at:data.access_expires_at},200,{"set-cookie":setCookie});
    }
    if(operation==="card-prepare"&&typeof data.draft_digest==="string"&&/^[0-9a-f]{64}$/.test(data.draft_digest))return reply({draft_digest:data.draft_digest});
    if(operation==="card-order"&&isOrderPointer(data.order_id))return reply({order_id:data.order_id});
    if(operation==="session"){
      const url=new URL(data.checkout_url);
      if(url.origin==="https://checkout.stripe.com"&&!url.username&&!url.password)return reply({checkout_url:url.href});
    }
    return reply({state:"UNKNOWN"},503);
  }catch{return reply({state:"UNKNOWN"},503)}
}
