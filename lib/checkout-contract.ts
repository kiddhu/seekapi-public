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
export function customerReport(raw:unknown){
  const r=obj(raw),summary=obj(r.summary),request=obj(r.request);
  if(r.schema_version!=="seekapi.csc-public-report.v2"||!Array.isArray(r.suppliers)||!txt(request.product_name)||!txt(summary.conclusion))return null;
  return {
    product:txt(request.product_name,200),quantity:typeof request.quantity==="number"?request.quantity:null,unit:txt(request.unit,32),
    conclusion:txt(summary.conclusion),unknowns:lines(summary.critical_unknowns),
    suppliers:r.suppliers.slice(0,5).map(value=>{
      const p=obj(value),price=obj(p.published_sales_price),moq=obj(p.observed_moq);
      return {name:txt(p.supplier_name,200)||"Supplier candidate",title:txt(p.product_title,500),reason:txt(p.inclusion_reason),
        url:safeSourceLink(p.product_url),contact:safeSourceLink(obj(p.contact_path).url),observedAt:txt(p.observed_at,40),
        price:typeof price.amount==="string"||typeof price.amount==="number"?[String(price.amount),txt(price.currency,10),txt(price.unit,32)].filter(Boolean).join(" / "):null,
        moq:typeof moq.quantity==="number"?String(moq.quantity)+" "+txt(moq.unit,32):null,
        matches:Array.isArray(p.matches)?p.matches.slice(0,10).map(m=>{const a=obj(m);return [txt(a.attribute,100),txt(a.observed,200)].filter(Boolean).join(": ")}):[],
        unknowns:lines(p.unknowns),mismatches:lines(p.mismatches)};
    }),
  };
}
export type CustomerReport = NonNullable<ReturnType<typeof customerReport>>;
