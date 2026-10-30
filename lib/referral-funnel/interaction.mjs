/** Exact first-party free-preparation links identify sales intent. All other
 * anchors remain navigation. No destination URL is included in a telemetry event.
 */
export function classifyLink(href){
 const navigation={type:'NAVIGATION_CLICK',entry:null,mode:'UNKNOWN',product:'UNKNOWN'};
 try{
  const url=new URL(href);
  if(url.origin!=='https://api.seekapi.ai'||url.username||url.password||url.search||url.hash&&!url.hash.startsWith('#sf='))return navigation;
  if(!['/checkout/stripe/image','/checkout/stripe/rfq'].includes(url.pathname))return navigation;
  const rfq=url.pathname.endsWith('/rfq');
  return {type:'SALES_CTA_CLICK',entry:url.origin+url.pathname,mode:rfq?'UNKNOWN':'IMAGE',product:rfq?'RFQ_19_90':'CSC_2_99'};
 }catch{return navigation;}
}
