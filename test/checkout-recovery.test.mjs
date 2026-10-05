import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { create, act } from 'react-test-renderer';
const require=createRequire(import.meta.url);
const { CheckoutExperience, ReportView }=require('../components/checkout-experience.tsx');
const { customerReport, orderPointerKey }=require('../lib/checkout-contract.ts');
const { checkoutProxy }=require('../lib/checkout-proxy.ts');
const { boundedText }=require('../lib/checkout-body.ts');
const { checkoutJson }=require('../lib/checkout-reader.ts');
const fixture=name=>JSON.parse(readFileSync(new URL('./fixtures/csc-v2-'+name+'.json',import.meta.url),'utf8'));
test('actual canonical full and shortage projections retain customer decision evidence without identifiers',()=>{
 for(const name of ['full','shortage']){
  const raw=fixture(name),report=customerReport(raw);assert.ok(report);
  const html=renderToStaticMarkup(React.createElement(ReportView,{report}));
  assert.match(html,/Your must-have requirements/);assert.match(html,/material: 304/);
  assert.match(html,/Your draft request for quotation/);assert.match(html,/No message has been sent/);
  assert.match(html,/Subject: RFQ for/);assert.doesNotMatch(html,/b2b-[0-9]|source_answer_digest|rfq_digest|payment_binding|principal_id|counts_as_qualified/);
  if(name==='full'){
   assert.equal(report.suppliers.length,3);assert.match(html,/Requested quantity fit/);assert.match(html,/Product evidence assessment/);
   assert.match(html,/Listing describes washer production/);assert.match(html,/Lead time needs confirmation/);assert.match(html,/Can you supply 500 pieces in one batch/);
  }else{
   assert.equal(report.suppliers.length,0);assert.equal(report.promising.length,1);
   assert.match(html,/do not count as qualified candidates/);assert.match(html,/Material grade not established/);
   assert.match(html,/Required fact not established: 1/);assert.match(html,/Ask for a 304 variant/);
  }
 }
});
test('body reader deadline and request abort cancel stalled small streams',async()=>{
 let cancelled=0;const stream=()=>new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('{"order_id":'))},cancel(){cancelled++}});
 await assert.rejects(boundedText(stream(),16384,undefined,20),/UNAVAILABLE/);
 const controller=new AbortController(),pending=boundedText(stream(),16384,controller.signal,1000);
 controller.abort();await assert.rejects(pending,/UNAVAILABLE/);assert.equal(cancelled,2);
});
test('actual relay returns UNKNOWN for never-ending incoming body and caller abort; no upstream calls',async()=>{
 for(const shouldAbort of [false,true]){
  let calls=0,cancelled=false;const controller=new AbortController();
  const body=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('{"order_id":'))},cancel(){cancelled=true}});
  const req=new Request('https://seekapi.ai/checkout/stripe/customer-status',{method:'POST',duplex:'half',body,signal:controller.signal,
   headers:{origin:'https://seekapi.ai','x-seekapi-card-claim':'1',cookie:'seekapi_card_claim='+'a'.repeat(43)}});
  const pending=checkoutProxy(req,'customer-status',async()=>{calls++;throw Error()});
  if(shouldAbort)controller.abort();
  const r=await pending;assert.equal(r.status,503);assert.equal((await r.json()).state,'UNKNOWN');assert.equal(calls,0);assert.equal(cancelled,true);
 }
});
test('client deadline covers status and result JSON bodies even after headers arrive',async()=>{
 for(const operation of ['customer-status','result']){
  let signal;
  await assert.rejects(checkoutJson(operation,'fresh',new AbortController().signal,async(_url,init)=>{
   signal=init.signal;return {json:()=>new Promise(()=>{})};
  },20),/UNAVAILABLE/);
  assert.equal(signal.aborted,true);
 }
});
async function mounted(t,fetcher,showResult=false){
 const previous={fetch:globalThis.fetch,document:globalThis.document,sessionStorage:globalThis.sessionStorage,act:globalThis.IS_REACT_ACT_ENVIRONMENT};
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.document={visibilityState:'visible'};
 globalThis.sessionStorage={getItem:key=>key===orderPointerKey?'fresh-order':null};globalThis.fetch=fetcher;
 t.mock.timers.enable({apis:['setTimeout','Date']});
 let tree;await act(async()=>{tree=create(React.createElement(CheckoutExperience,{showResult}))});
 t.after(async()=>{await act(async()=>tree.unmount());t.mock.timers.reset();globalThis.fetch=previous.fetch;globalThis.document=previous.document;globalThis.sessionStorage=previous.sessionStorage;globalThis.IS_REACT_ACT_ENVIRONMENT=previous.act});
 return tree;
}
test('actual component stalled status body recovers UNKNOWN and re-enables manual status',async t=>{
 let signal;const tree=await mounted(t,async(_url,init)=>{signal=init.signal;return {ok:true,status:200,json:()=>new Promise(()=>{})}});
 assert.equal(tree.root.findByType('button').props.disabled,true);
 await act(async()=>{t.mock.timers.tick(10000)});
 assert.equal(signal.aborted,true);assert.equal(tree.root.findByType('button').props.disabled,false);
 assert.match(JSON.stringify(tree.toJSON()),/Do not pay again yet/);assert.match(JSON.stringify(tree.toJSON()),/We can’t confirm your payment yet/);
});
test('actual component stalled result body recovers and hides report',async t=>{
 let signal;
 const tree=await mounted(t,async(url,init)=>{
  if(url.endsWith('customer-status'))return {ok:true,status:200,json:async()=>({state:'READY'})};
  signal=init.signal;return {ok:true,status:200,json:()=>new Promise(()=>{})};
 },true);
 await act(async()=>{t.mock.timers.tick(10000)});
 assert.equal(signal.aborted,true);assert.equal(tree.root.findByType('button').props.disabled,false);
 assert.match(JSON.stringify(tree.toJSON()),/We can’t confirm your payment yet/);
 assert.equal(tree.root.findAllByProps({'aria-label':'Your China Supply Check result'}).length,0);
});
test('actual component polling is finite; hidden tabs pause within the same deadline',async t=>{
 let calls=0;
 const tree=await mounted(t,async()=>{calls++;return {ok:true,status:200,json:async()=>({state:'PROCESSING'})}});
 for(let i=0;i<15;i++)await act(async()=>{t.mock.timers.tick(5000)});
 assert.equal(calls,12);assert.equal(tree.root.findByType('button').props.disabled,false);
 await act(async()=>{tree.root.findByType('button').props.onClick()});assert.equal(calls,13);
 globalThis.document.visibilityState='hidden';
 for(let i=0;i<15;i++)await act(async()=>{t.mock.timers.tick(5000)});
 assert.equal(calls,13);
 globalThis.document.visibilityState='visible';
 await act(async()=>{t.mock.timers.tick(10000)});assert.equal(calls,13);
});
