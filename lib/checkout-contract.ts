export const customerStates = ["CONFIRMING","READY","PROCESSING","UNPAID","FAILED","EXPIRED","UNKNOWN","PAYMENT_CHANGED","ACCESS_EXPIRED","NO_ACCESS","RESULT_UNAVAILABLE"] as const;
export type CustomerState = typeof customerStates[number];
export const copy: Record<CustomerState,{title:string;body:string}> = {
  CONFIRMING:{title:"Confirming your payment",body:"We’re checking your payment securely. Do not pay again yet."},
  READY:{title:"Payment confirmed. Your supply check is ready.",body:"Your report belongs to this purchase. You do not need to pay again to read it."},
  PROCESSING:{title:"Payment confirmed",body:"Your supply check is not ready yet. You do not need to pay again. Check back here or contact us for help."},
  UNPAID:{title:"Payment not completed",body:"No completed payment has been confirmed for this checkout. If you left Stripe, your purchase may still be unfinished. Contact us before starting another payment."},
  FAILED:{title:"Payment was not completed",body:"Stripe could not complete this payment. Contact us before starting a new payment, especially if your bank shows a charge."},
  EXPIRED:{title:"Checkout expired",body:"This checkout can no longer accept payment. Contact us if your bank shows a charge or you would like help continuing."},
  UNKNOWN:{title:"We can’t confirm your payment yet",body:"Do not pay again yet. Check again shortly, or contact us if this continues."},
  PAYMENT_CHANGED:{title:"Your payment status has changed",body:"A refund or payment review may affect access to this supply check. Contact us for help. Do not pay again to restore access."},
  ACCESS_EXPIRED:{title:"Your secure access has expired",body:"Contact us about your existing purchase. Do not buy it again to restore access."},
  NO_ACCESS:{title:"We couldn’t open this purchase",body:"Use the same browser and tab you used to pay, or contact us for help. Do not pay again yet."},
  RESULT_UNAVAILABLE:{title:"Your report couldn’t be loaded",body:"Do not pay again. Check your purchase status or contact us to recover access to your existing report."},
};
export const publicCardEntryEnabled = false; // Separate reviewed Live admission required.
export const orderPointerKey = "seekapi.checkout.order.v1";
export const intentKey = "seekapi.checkout.intent.v1";
export const isOrderPointer = (x: unknown): x is string => typeof x==="string" && /^[A-Za-z0-9._:-]{1,128}$/.test(x);
export function customerState(x:unknown):CustomerState {
  return typeof x==="string" && (customerStates as readonly string[]).includes(x)?x as CustomerState:"UNKNOWN";
}
export function safeSourceLink(x:unknown):string|null {
  if(typeof x!=="string" || x.length>2000)return null;
  try{const u=new URL(x);return ["https:","http:"].includes(u.protocol)&&!u.username&&!u.password&&!Array.from(u.searchParams.keys()).some(k=>/token|secret|auth|signature|credential|api.?key/i.test(k))?u.href:null;}catch{return null;}
}
const obj=(x:unknown):Record<string,unknown>=> x!==null&&typeof x==="object"&&!Array.isArray(x)?x as Record<string,unknown>:{};
const txt=(x:unknown,max=2000)=>typeof x==="string"?x.slice(0,max):"";
const lines=(x:unknown)=>Array.isArray(x)?x.slice(0,20).map(v=>txt(v)).filter(Boolean):[];
const labels:Record<string,string> = {
 MATCH:"Matches the recorded evidence", MISMATCH:"Does not match", UNKNOWN:"Not established",
 EXACT_EVIDENCED:"Exact product supported by evidence", PARTIAL_EVIDENCED:"Some product requirements supported", 
 STRONG_CANDIDATE:"Strong candidate to contact", PLAUSIBLE_CANDIDATE:"Plausible candidate to contact",
 INSUFFICIENT_EVIDENCE:"More evidence is needed", EXCLUDED:"Excluded from the shortlist", QUALIFIED:"Recorded product requirements supported",
 DUPLICATE_SUPPLIER:"Repeated supplier", SPEC_MISMATCH:"Specification mismatch", MOQ_MISMATCH:"Minimum order mismatch",
 SELLER_IDENTITY_UNRESOLVED:"Supplier identity not established", MANDATORY_FACT_UNKNOWN:"Required fact not established",
 INVALID_EVIDENCE:"Insufficient usable evidence", PRODUCT_IDENTITY_MISMATCH:"Different product", PRODUCT_IDENTITY_UNKNOWN:"Product identity not established",
 LOWER_RANKED_CANDIDATE:"Other candidates ranked higher",
};
const label=(value:unknown)=>typeof value==="string"?labels[value]||"Not established":"Not established";
const requirements=(value:unknown)=>Array.isArray(value)?value.slice(0,20).map(v=>{const a=obj(v);return [txt(a.attribute,100),txt(a.expected,500)].filter(Boolean).join(": ")}).filter(Boolean):[];
const gates=(value:unknown)=>Array.isArray(value)?value.slice(0,20).map(v=>{const a=obj(v);return {attribute:txt(a.attribute,100),expected:txt(a.expected,500),observed:txt(a.observed,500)||"Not captured",verdict:label(a.verdict)}}):[];
const finite=(value:unknown)=>typeof value==="number"&&Number.isFinite(value)&&value>=0?value:null;
export function customerReport(raw:unknown){
  const r=obj(raw),summary=obj(r.summary),request=obj(r.request),sanity=obj(summary.request_sanity);
  if(r.schema_version!=="seekapi.csc-public-report.v2"||!Array.isArray(r.suppliers)||!txt(request.product_name)||!txt(summary.conclusion))return null;
  return {
    product:txt(request.product_name,200),quantity:finite(request.quantity),unit:txt(request.unit,32),model:txt(request.model_or_reference,200),
    requirements:requirements(request.must_match),substitutions:request.substitution_allowed===true,
    buyerUnknowns:lines(request.buyer_unknowns),conclusion:txt(summary.conclusion),unknowns:lines(summary.critical_unknowns),
    questions:[...lines(summary.buyer_questions),...lines(sanity.rfq_questions)],contradictions:lines(sanity.contradictions),
    exclusions:Array.isArray(r.exclusion_summary)?r.exclusion_summary.slice(0,20).map(v=>{const a=obj(v);return {reason:label(a.reason),count:finite(a.count)}}):[],
    rfqDraft:txt(obj(r.next_action).rfq_draft,10000),
    promising:Array.isArray(r.promising_candidates)?r.promising_candidates.slice(0,5).map(value=>{
      const p=obj(value);return {title:txt(p.product_title,500),url:safeSourceLink(p.product_url),observedAt:txt(p.observed_at,40),
        matches:lines(p.matched_facts),gaps:lines(p.evidence_gaps),variants:lines(p.variant_options)};
    }):[],
    suppliers:r.suppliers.slice(0,5).map(value=>{
      const p=obj(value),price=obj(p.published_sales_price),moq=obj(p.observed_moq),a=obj(p.supplier_assessment),q=obj(p.qualification),s=obj(a.request_sanity);
      return {name:txt(p.supplier_name,200)||"Supplier candidate",title:txt(p.product_title,500),reason:txt(p.inclusion_reason),
        url:safeSourceLink(p.product_url),contact:safeSourceLink(obj(p.contact_path).url),observedAt:txt(p.observed_at,40),
        price:typeof price.amount==="string"||typeof price.amount==="number"?[String(price.amount),txt(price.currency,10),txt(price.unit,32)].filter(Boolean).join(" / "):null,
        moq:finite(moq.quantity)!==null?String(moq.quantity)+" "+txt(moq.unit,32):null,quantityFit:label(p.quantity_fit),
        matches:Array.isArray(p.matches)?p.matches.slice(0,20).map(m=>{const v=obj(m);return [txt(v.attribute,100),"Requested: "+txt(v.expected,500),"Observed: "+txt(v.observed,500)].join(" · ")}):[],
        unknowns:lines(p.unknowns),mismatches:lines(p.mismatches),
        qualification:p.qualification?{verdict:label(q.verdict),gates:gates(q.gates),risks:lines(q.risks)}:null,
        assessment:p.supplier_assessment?{productFit:label(a.product_fit),supplierFit:label(a.supplier_fit),gates:gates(a.product_evidence),
          capability:lines(a.supplier_capability_evidence),customization:lines(a.customization_evidence),uncertainties:lines(a.uncertainties),
          questions:[...lines(a.rfq_questions),...lines(s.rfq_questions)],why:txt(a.why_worth_contacting),contradictions:lines(s.contradictions)}:null,
        certifications:Array.isArray(p.certifications)?p.certifications.slice(0,10).map(v=>{const c=obj(v);return {issuer:txt(c.issuer,200),scope:txt(c.scope,1000),url:safeSourceLink(c.source_url),observedAt:txt(c.observed_at,40)}}):[],
      };
    }),
  };
}
export type CustomerReport = NonNullable<ReturnType<typeof customerReport>>;
