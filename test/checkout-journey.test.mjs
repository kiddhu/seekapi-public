import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
import { renderToStaticMarkup } from 'react-dom/server';
const { checkoutProxy } = require('../lib/checkout-proxy.ts');
const { customerStates, customerState, copy, customerReport, safeSourceLink, publicCardEntryEnabled } = require('../lib/checkout-contract.ts');
const { StatusView, ReportView } = require('../components/checkout-experience.tsx');
const { CheckoutEntry } = require('../components/checkout-entry.tsx');
const cookie='seekapi_card_claim='+'a'.repeat(43);
const request=(body={order_id:'fresh-test-order'},headers={},method='POST')=>new Request('https://seekapi.ai/checkout/stripe/customer-status',{method,headers:{origin:'https://seekapi.ai','x-seekapi-card-claim':'1',cookie,...headers},...(method==='POST'?{body:JSON.stringify(body)}:{})});
const report={schema_version:'seekapi.csc-public-report.v2',request:{product_name:'M6 washer',quantity:1000,unit:'pieces'},summary:{conclusion:'Three candidates to review.',critical_unknowns:['Confirm freight.']},suppliers:[{supplier_name:'Example manufacturer',product_title:'M6 washer',product_url:'https://example.com/listing',inclusion_reason:'Matching material',observed_at:'2026-10-04T00:00:00Z',published_sales_price:{amount:'0.01',currency:'CNY',unit:'piece'},observed_moq:{quantity:100,unit:'pieces'},matches:[{attribute:'Material',observed:'304 steel'}],unknowns:['Confirm tolerance.'],mismatches:[],supplier_id:'PRIVATE_SUPPLIER_ID',evidence_digest:'PRIVATE_DIGEST'}],payment_intent:'PRIVATE_PI',principal_id:'PRIVATE_PRINCIPAL',source_answer_digest:'PRIVATE_ANSWER'};
test('every state has distinct honest customer copy; unknown asks not to pay again',()=>{
 assert.equal(customerState('success=true'),'UNKNOWN');
 for(const state of customerStates){const html=renderToStaticMarkup(React.createElement(StatusView,{state}));assert.ok(html.includes(copy[state].title.replaceAll('&','&amp;')));assert.ok(html.includes('role="status"'));assert.doesNotMatch(html,/PaymentIntent|order_id|entitlement_id|PRIVATE_/);}
 assert.match(copy.UNKNOWN.body,/Do not pay again yet/);
 assert.doesNotMatch(copy.PROCESSING.body,/worker|queue|minutes|guaranteed/i);
 assert.match(copy.PAYMENT_CHANGED.body,/refund or payment review/);
});
test('public entry is frozen OFF in both page and server',async()=>{
 assert.equal(publicCardEntryEnabled,false);
 const html=renderToStaticMarkup(React.createElement(CheckoutEntry,{enabled:publicCardEntryEnabled}));
 assert.match(html,/card purchases are not open yet/);assert.doesNotMatch(html,/Confirm brief &amp; continue to Stripe/);
 for(const op of ['card-session','card-prepare','card-order','session']){
  let calls=0;const r=await checkoutProxy(request({enabled:true,live:true}),op,async()=>{calls++;throw Error();});
  assert.equal(r.status,503);assert.equal(calls,0);
 }
});
test('missing, malformed, duplicate, foreign-origin or unclaimed requests never reach upstream',async()=>{
 const variants=[{cookie:''},{cookie:cookie+'; '+cookie},{cookie:'seekapi_card_claim=bad'},{origin:'https://attacker.example'},{'x-seekapi-card-claim':''},{'sec-fetch-site':'cross-site'}];
 for(const headers of variants){let calls=0;const r=await checkoutProxy(request(undefined,headers),'customer-status',async()=>{calls++;throw Error();});assert.ok([401,403].includes(r.status));assert.equal(calls,0);}
 let calls=0;
 assert.equal((await checkoutProxy(request({}, {},'GET'),'customer-status',async()=>{calls++;throw Error();})).status,405);
 assert.equal((await checkoutProxy(request(),'anything',async()=>{calls++;throw Error();})).status,404);
 assert.equal((await checkoutProxy(request({order_id:'x',success:true}),'customer-status',async()=>{calls++;throw Error();})).status,400);
 assert.equal(calls,0);
});
test('read uses only fixed upstream, exact claim cookie, no cache and redacted state',async()=>{
 let calls=0;
 const response=await checkoutProxy(request(undefined,{cookie:'other=SECRET; '+cookie,authorization:'SECRET'}),'customer-status',async(url,init)=>{
  calls++;assert.equal(url,'https://api.seekapi.ai/checkout/stripe/customer-status');
  assert.equal(init.headers.cookie,cookie);assert.equal(init.headers.authorization,undefined);assert.equal(init.method,'POST');assert.equal(init.cache,'no-store');assert.equal(init.redirect,'error');
  return Response.json({state:'READY',result_available:true,access_expires_at:'2026-10-11T00:00:00Z',test_mode:true,payment_intent:'PRIVATE_PI',principal_id:'PRIVATE_ID'});
 });
 assert.equal(calls,1);assert.equal(response.status,200);
 assert.match(response.headers.get('cache-control'),/no-store/);assert.equal(response.headers.get('referrer-policy'),'no-referrer');
 assert.deepEqual(await response.json(),{state:'READY',result_available:true,access_expires_at:'2026-10-11T00:00:00Z',test_mode:true});
});
test('outage, malformed, oversized and unexpected truth fail unknown without leaking errors',async()=>{
 for(const upstream of [async()=>{throw Error('PRIVATE_DETAIL')},async()=>Response.json({error:'PRIVATE_SQL'},{status:500}),async()=>new Response('PRIVATE_INVALID_JSON'),async()=>new Response('x'.repeat(524289)),async()=>Response.json({state:'SUCCESS_FROM_REDIRECT'})]){
  const r=await checkoutProxy(request(),'customer-status',upstream);const body=await r.json();assert.equal(body.state,'UNKNOWN');assert.doesNotMatch(JSON.stringify(body),/PRIVATE_|SQL/);
 }
 const r=await checkoutProxy(request({order_id:'x'.repeat(17000)}),'customer-status',async()=>{throw Error('should not run')});assert.equal((await r.json()).state,'UNKNOWN');
});
test('result relay and renderer expose only customer evidence from same authenticated order',async()=>{
 const r=await checkoutProxy(request(),'result',async()=>Response.json({result:report,debug:'PRIVATE_DEBUG'}));
 const body=await r.json();assert.equal(r.status,200);assert.equal(body.report.suppliers[0].price,'0.01 / CNY / piece');
 const html=renderToStaticMarkup(React.createElement(ReportView,{report:body.report}));
 assert.match(html,/Example manufacturer/);assert.match(html,/View source listing/);assert.match(html,/noopener noreferrer/);
 assert.doesNotMatch(JSON.stringify(body)+html,/PRIVATE_|payment_intent|source_answer_digest|supplier_id/);
 assert.equal(customerReport({schema_version:'wrong'}),null);
 for(const url of ['javascript:alert(1)','data:text/html,bad','https://user:pass@example.com','https://example.com?api_key=SECRET'])assert.equal(safeSourceLink(url),null);
});
