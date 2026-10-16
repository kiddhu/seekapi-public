/** Pure boundary/projection helpers for #1241. No IO, storage, SDK or business mutations.
 * Canonical input is SERVER-ONLY: callers must map an existing trusted store read.
 * Never expose canonicalEvents() or feed a browser body to canonical_orders.
 */
export const VERSION='seekapi.referral-funnel.v1';
export const SESSION_TTL_MS=30*60*1000;
export const BROWSER_TYPES=Object.freeze(['PAGE_VIEW','CTA_CLICK','PREPARE_STARTED','PREPARE_CONFIRMED','CHECKOUT_STARTED']);
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REFERRERS=['DIRECT','GOOGLE','BING','CHATGPT','CLAUDE','PERPLEXITY','COPILOT','OTHER_SEARCH','OTHER_EXTERNAL','INTERNAL','UNKNOWN'];
const MODES=['IMAGE','PRODUCT_LINK','DESCRIPTION','MCP','UNKNOWN'];
const PRODUCTS=['CSC_2_99','RFQ_19_90','UNKNOWN'];
const CONFIDENCES=['REFERRER_OBSERVED_UNVERIFIED','UTM_CLAIMED','NO_REFERRER_OBSERVED','UNKNOWN'];
const PUBLIC_PATHS=Object.freeze({'/':'HOME','/china-supply-check':'CSC','/china-supply-check/sample':'SAMPLE','/china-supply-check/alternatives':'CSC','/for-agents':'AGENT','/apis':'AGENT','/sourcing':'SOURCING','/how-it-works':'INFORMATION','/about':'INFORMATION','/trust':'INFORMATION','/support':'INFORMATION','/privacy':'INFORMATION','/terms':'INFORMATION'});
// Current main's eight public English leaf routes, read at ebecac3f; no wildcard.
const SOURCING_PATHS=new Set(['find-china-suppliers','china-supplier-screening','china-supplier-verification','chinese-manufacturer-sourcing','china-supplier-shortlist','china-procurement-service','china-procurement-mcp','china-supplier-api'].map(s=>'/sourcing/'+s));
const ENTRY_PATH='/checkout/stripe/image';
const ENTRY_ACTIONS=['PREPARE_STARTED','PREPARE_CONFIRMED','CHECKOUT_STARTED'];
const CAMPAIGNS=Object.freeze({'chatgpt.com':'CHATGPT','chatgpt':'CHATGPT','claude.ai':'CLAUDE','claude':'CLAUDE','perplexity.ai':'PERPLEXITY','perplexity':'PERPLEXITY','copilot':'COPILOT','google':'GOOGLE','bing':'BING','earned-1256-dev':'OTHER_EXTERNAL'});
const own=(o,k)=>Object.hasOwn(o,k);
const object=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const enumOr=(v,values)=>values.includes(v)?v:'UNKNOWN';
const uuid=v=>typeof v==='string'&&UUID.test(v)?v.toLowerCase():null;
const stamp=v=>typeof v==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v?v:null;
const identifier=v=>typeof v==='string'&&v.length>0&&v.length<=256&&!/[\x00-\x20\x7f]/.test(v)?v:null;
const stable=o=>JSON.stringify(o);

export function pathClass(path){
  if(typeof path!=='string'||path.length>2048)return null;
  // Only exact public routes; unknown slugs/private URLs never enter telemetry.
  const clean=path.split(/[?#]/,1)[0];
  return own(PUBLIC_PATHS,clean)?PUBLIC_PATHS[clean]:SOURCING_PATHS.has(clean)?'SOURCING':null;
}

export function classifyAcquisition(referrer,search){
  let campaign=null;
  if(typeof search==='string'&&search.length<=2048){
    const params=new URLSearchParams(search),sources=[...params].filter(([k])=>k.toLowerCase()==='utm_source');
    if(sources.length===1&&sources[0][0]==='utm_source'){
      const v=sources[0][1].toLowerCase();if(own(CAMPAIGNS,v))campaign=v;
    }
  }
  let category='UNKNOWN';
  if(referrer==='')category='DIRECT';
  else if(typeof referrer==='string'&&referrer.length<=8192){
    try{
      const url=new URL(referrer);
      if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.port)throw Error();
      const host=url.hostname.toLowerCase();
      if(host==='seekapi.ai'||host==='api.seekapi.ai')category='INTERNAL';
      else if(['google.com','www.google.com'].includes(host))category='GOOGLE';
      else if(['bing.com','www.bing.com'].includes(host))category='BING';
      else if(['chatgpt.com','www.chatgpt.com','chat.openai.com'].includes(host))category='CHATGPT';
      else if(['claude.ai','www.claude.ai'].includes(host))category='CLAUDE';
      else if(['perplexity.ai','www.perplexity.ai'].includes(host))category='PERPLEXITY';
      else if(['copilot.microsoft.com','copilot.com'].includes(host))category='COPILOT';
      else if(['duckduckgo.com','www.duckduckgo.com','search.yahoo.com','search.brave.com'].includes(host))category='OTHER_SEARCH';
      else category='OTHER_EXTERNAL';
    }catch{/* Unknown is not an external identity. */}
  }
  let confidence=category==='UNKNOWN'?'UNKNOWN':category==='DIRECT'?'NO_REFERRER_OBSERVED':'REFERRER_OBSERVED_UNVERIFIED';
  // A campaign is only a claim, and does not override an observed external host.
  if(campaign&&category==='DIRECT'){category=CAMPAIGNS[campaign];confidence='UTM_CLAIMED';}
  return {referrer_class:category,utm_source:campaign,source_confidence:confidence};
}

export function sanitizeBrowserEvent(raw,{now=Date.now()}={}){
  if(!object(raw)||!BROWSER_TYPES.includes(raw.event_type)||!uuid(raw.event_id)||!Number.isFinite(now))return null;
  const entry=raw.path===ENTRY_PATH&&ENTRY_ACTIONS.includes(raw.event_type);
  const cls=entry?'CSC_PREPARE':pathClass(raw.path);if(!cls)return null;
  return {event_version:VERSION,event_id:uuid(raw.event_id),event_type:raw.event_type,
    occurred_at:new Date(now).toISOString(),surface:entry?'PREPARE_UI':'PUBLIC_WEB',path_class:cls,
    ...classifyAcquisition(raw.referrer,raw.search),mode:enumOr(raw.mode,MODES),product:enumOr(raw.product,PRODUCTS),
    privacy_safe_session_id:uuid(raw.privacy_safe_session_id),request_or_prepare_correlation_id:uuid(raw.request_or_prepare_correlation_id)};
}

const EVENT_KEYS=['event_version','event_id','event_type','occurred_at','surface','path_class','referrer_class','utm_source','source_confidence','mode','product','privacy_safe_session_id','request_or_prepare_correlation_id'];
export function validateBrowser(e){
  if(!object(e)||Object.keys(e).length!==EVENT_KEYS.length||!EVENT_KEYS.every(k=>own(e,k))||e.event_version!==VERSION||!uuid(e.event_id)||!stamp(e.occurred_at)||
    !BROWSER_TYPES.includes(e.event_type)||!(['PUBLIC_WEB','PREPARE_UI','MCP'].includes(e.surface))||
    !(e.surface==='PUBLIC_WEB'?Object.values(PUBLIC_PATHS).includes(e.path_class):e.path_class==='CSC_PREPARE'&&ENTRY_ACTIONS.includes(e.event_type))||
    !REFERRERS.includes(e.referrer_class)||!(e.utm_source===null||own(CAMPAIGNS,e.utm_source))||!CONFIDENCES.includes(e.source_confidence)||
    !MODES.includes(e.mode)||!PRODUCTS.includes(e.product)||
    !(e.privacy_safe_session_id===null||uuid(e.privacy_safe_session_id))||!(e.request_or_prepare_correlation_id===null||uuid(e.request_or_prepare_correlation_id)))throw Error('INVALID_BROWSER_EVENT');
  return Object.fromEntries(EVENT_KEYS.map(k=>[k,e[k]]));
}

function canonicalRow(row){
  if(!object(row)||!identifier(row.order_id_internal_only))throw Error('INVALID_CANONICAL_ROW');
  for(const k of ['payment_accepted_at','delivered_at','correlation_bound_at'])if(row[k]!=null&&!stamp(row[k]))throw Error('INVALID_CANONICAL_TIMESTAMP');
  if(row.canonical_payment_id!=null&&!identifier(row.canonical_payment_id))throw Error('INVALID_CANONICAL_PAYMENT');
  return {order_id_internal_only:row.order_id_internal_only,canonical_payment_id:row.canonical_payment_id??null,
    payment_processor_scope:identifier(row.payment_processor_scope)??'UNKNOWN',payment_accepted_at:row.payment_accepted_at??null,
    delivered_at:row.delivered_at??null,delivery_state:row.delivery_state==='DELIVERED'?'DELIVERED':'UNKNOWN',
    product:enumOr(row.product,PRODUCTS),mode:enumOr(row.mode,MODES),
    request_or_prepare_correlation_id:uuid(row.request_or_prepare_correlation_id),correlation_bound_at:row.correlation_bound_at??null};
}

/** Private transient mapping only; never log/serialize this return to GitHub. */
export function canonicalEvents(record){
  const o=canonicalRow(record);
  if(!o.canonical_payment_id||!o.payment_accepted_at)return [];
  const base={event_version:VERSION,surface:'CANONICAL_RUNTIME',source_confidence:'CANONICAL_STORE',
    order_id_internal_only:o.order_id_internal_only,product:o.product,mode:o.mode};
  const events=[{...base,event_type:'PAYMENT_CONFIRMED',occurred_at:o.payment_accepted_at}];
  if(o.delivered_at&&o.delivered_at>=o.payment_accepted_at)events.push({...base,event_type:'DELIVERED',occurred_at:o.delivered_at});
  return events;
}

/** Recomputed from the same explicit snapshot => identical output after retry/restart.
 * Coverage is supplied by the existing collector's verified source receipt, never a browser.
 * No raw/correlation/order IDs or URLs can pass this public-output constructor.
 */
export function aggregateDay({day,browser_events=[],canonical_orders=[],browser_coverage='NOT_OBSERVABLE',canonical_coverage='UNKNOWN'}={}){
  if(typeof day!=='string'||!/^\d{4}-\d\d-\d\d$/.test(day)||!stamp(day+'T00:00:00.000Z'))throw Error('INVALID_DAY');
  if(!Array.isArray(browser_events)||!Array.isArray(canonical_orders)||browser_events.length>100000||canonical_orders.length>100000)throw Error('INPUT_LIMIT');
  if(!['COMPLETE','PARTIAL','NOT_OBSERVABLE','UNKNOWN'].includes(browser_coverage)||!['COMPLETE','PARTIAL','NOT_OBSERVABLE','UNKNOWN'].includes(canonical_coverage))throw Error('INVALID_COVERAGE');
  const browsers=new Map(),orders=new Map(),payments=new Map(),correlationOwners=new Map(),preparedTimes=new Map();
  for(const raw of browser_events){
    const e=validateBrowser(raw),old=browsers.get(e.event_id);
    if(old&&stable(old)!==stable(e))throw Error('EVENT_ID_CONFLICT');
    browsers.set(e.event_id,e);
  }
  for(const raw of canonical_orders){
    const o=canonicalRow(raw),old=orders.get(o.order_id_internal_only);
    if(old&&stable(old)!==stable(o))throw Error('ORDER_SNAPSHOT_CONFLICT');
    orders.set(o.order_id_internal_only,o);
    if(o.canonical_payment_id&&o.payment_accepted_at){
      const key=stable([o.payment_processor_scope,o.canonical_payment_id]),owner=payments.get(key);
      if(owner&&owner!==o.order_id_internal_only)throw Error('PAYMENT_ORDER_CONFLICT');
      payments.set(key,o.order_id_internal_only);
    }
    if(o.request_or_prepare_correlation_id){
      const owners=correlationOwners.get(o.request_or_prepare_correlation_id)??new Set();
      owners.add(o.order_id_internal_only);correlationOwners.set(o.request_or_prepare_correlation_id,owners);
    }
  }
  const observedBrowser=['COMPLETE','PARTIAL'].includes(browser_coverage),observedCanonical=['COMPLETE','PARTIAL'].includes(canonical_coverage);
  const counts=Object.fromEntries(BROWSER_TYPES.map(t=>[t,0]));
  const referrals=Object.fromEntries(REFERRERS.map(t=>[t,0]));
  const campaigns=Object.fromEntries(Object.keys(CAMPAIGNS).map(t=>[t,0]));
  for(const e of browsers.values()){
    if(e.event_type==='PREPARE_CONFIRMED'&&e.request_or_prepare_correlation_id){
      const times=preparedTimes.get(e.request_or_prepare_correlation_id)??[];
      times.push(Date.parse(e.occurred_at));preparedTimes.set(e.request_or_prepare_correlation_id,times);
    }
    if(e.occurred_at.startsWith(day)){
      counts[e.event_type]++;
      if(e.event_type==='PAGE_VIEW'){
        referrals[e.source_confidence==='UTM_CLAIMED'?'DIRECT':e.referrer_class]++;
        if(e.utm_source)campaigns[e.utm_source]++;
      }
    }
  }
  let paid=0,delivered=0,gaps=0,joined=0;
  for(const o of orders.values()){
    const events=canonicalEvents(o),paidToday=events.some(e=>e.event_type==='PAYMENT_CONFIRMED'&&e.occurred_at.startsWith(day));
    if(paidToday)paid++;
    if(events.some(e=>e.event_type==='DELIVERED'&&e.occurred_at.startsWith(day)))delivered++;
    if(events.length&&o.delivery_state==='DELIVERED'&&!events.some(e=>e.event_type==='DELIVERED'))gaps++;
    if(!paidToday||!o.request_or_prepare_correlation_id||!o.correlation_bound_at||correlationOwners.get(o.request_or_prepare_correlation_id)?.size!==1)continue;
    const bound=Date.parse(o.correlation_bound_at);
    if(bound>Date.parse(o.payment_accepted_at))continue;
    if((preparedTimes.get(o.request_or_prepare_correlation_id)??[]).some(time=>bound>=time-5000&&bound-time<SESSION_TTL_MS))joined++;
  }
  const joinObservable=observedBrowser&&observedCanonical;
  return {event_version:VERSION,day,time_zone:'UTC',
    browser:{coverage:browser_coverage,counts:observedBrowser?counts:null,page_views_by_observed_referrer:observedBrowser?referrals:null,
      page_views_by_campaign_claim:observedBrowser?campaigns:null,
      identity:'UNVERIFIED_BROWSER_EVENTS_NOT_HUMANS',referrer_provenance:'REFERRER_OBSERVED_OR_UTM_CLAIMED_NOT_AUTHENTICATED'},
    commercial:{coverage:canonical_coverage,paid_orders:observedCanonical?paid:null,delivered_orders:observedCanonical&&gaps===0?delivered:null,
      delivery_timestamp_gaps:observedCanonical?gaps:null},
    join:{coverage:joinObservable?'PARTIAL':'NOT_OBSERVABLE',explicit_prepare_to_paid_orders:joinObservable?joined:null,
      unattributed_paid_orders:joinObservable?paid-joined:null},
    crawler_to_order_attribution:'NOT_PROVEN',commercial_causality:'NOT_PROVEN'};
}
