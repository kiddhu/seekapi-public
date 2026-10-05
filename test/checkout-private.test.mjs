import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import React from 'react';
import {create,act} from 'react-test-renderer';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url);
const {checkoutProxy}=require('../lib/checkout-proxy.ts');
const {PrivateCheckoutEntry}=require('../components/checkout-private-entry.tsx');
const {CheckoutEntry}=require('../components/checkout-entry.tsx');
const {privatePurchaseContext}=require('../lib/checkout-contract.ts');
const cookie='seekapi_card_claim='+'b'.repeat(43),invitation='a'.repeat(43);
const context={draft:{input:{text:'M6 washer'},product_name:'M6 washer',quantity:1000,unit:'pieces',must_match:[],model_or_reference:null,substitution_allowed:false},draft_digest:'a'.repeat(64),intent_id:'00000000-0000-4000-8000-000000000001',confirmed_at:'2026-10-05T08:00:00.000Z',payment_available:false};
const request=(body,headers={})=>new Request('https://seekapi.ai/checkout/stripe/acceptance-entry',{method:'POST',headers:{origin:'https://seekapi.ai','x-seekapi-card-claim':'1',...headers},body:JSON.stringify(body)});
test('invitation only relays to fixed entry and accepts exact secure existing card cookie',async()=>{
 let calls=0;
 const r=await checkoutProxy(request({invitation}),'acceptance-entry',async(url,init)=>{
  calls++;assert.equal(url,'https://api.seekapi.ai/checkout/stripe/acceptance-entry');assert.equal(init.headers.cookie,undefined);
  return Response.json({state:'ADMITTED',debug:'PRIVATE'},{headers:{'set-cookie':cookie+'; Path=/checkout/stripe; Secure; HttpOnly; SameSite=Strict'}});
 });
 assert.equal(calls,1);assert.equal(r.status,200);assert.deepEqual(await r.json(),{state:'ADMITTED'});assert.match(r.headers.get('set-cookie'),/HttpOnly/);
 for(const extra of ['; Domain=seekapi.ai','; Domain=other.example']){
  const bad=await checkoutProxy(request({invitation}),'acceptance-entry',async()=>Response.json({}, {headers:{'set-cookie':cookie+'; Path=/checkout/stripe; Secure; HttpOnly; SameSite=Strict'+extra}}));assert.equal(bad.status,503);
 }
});
test('no cookie cannot create; cookie never substitutes for backend fixed-packet permission',async()=>{
 let calls=0;
 for(const operation of ['card-session','card-prepare','card-order','session']){
  const r=await checkoutProxy(request({} ),operation,async()=>{calls++;return Response.json({})});assert.equal(r.status,503);
 }
 assert.equal(calls,0);
 const r=await checkoutProxy(request({draft:context.draft},{cookie}),'card-prepare',async()=>{calls++;return Response.json({state:'UNAVAILABLE'},{status:503})});
 assert.equal(calls,1);assert.equal(r.status,503);assert.equal((await r.json()).state,'UNKNOWN');
 for(const body of [{invitation,live:true},{invitation:'short'},{payment_authorized:true}]){
  const bad=await checkoutProxy(request(body),'acceptance-entry',async()=>{throw Error('must not fetch')});assert.equal(bad.status,400);
 }
});
test('context is cookie-only and renders exact brief with no internal identifiers or enabled payment before authorization',async()=>{
 const denied=await checkoutProxy(request({}),'acceptance-context',async()=>{throw Error('no fetch')});assert.equal(denied.status,401);
 const r=await checkoutProxy(request({},{cookie}),'acceptance-context',async()=>Response.json({...context,principal_id:'PRIVATE',order_id:'PRIVATE',invitation:'PRIVATE'}));
 assert.equal(r.status,200);const result=await r.json();assert.deepEqual(result,context);
 assert.equal(privatePurchaseContext({...context,payment_available:'true'}),null);
 const html=renderToStaticMarkup(React.createElement(CheckoutEntry,{enabled:false,privatePurchase:context}));
 assert.match(html,/M6 washer/);assert.match(html,/1000 pieces/);assert.doesNotMatch(html,/00000000|draft_digest|principal_id|PRIVATE|Confirm brief &amp; continue to Stripe/);
});
test('private page removes fragment before network, never stores invitation and never automatically creates Checkout',async t=>{
 const keys=['window','history','sessionStorage','fetch','IS_REACT_ACT_ENVIRONMENT'];const before=Object.fromEntries(keys.map(k=>[k,globalThis[k]]));
 const events=[];globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 globalThis.window={location:{hash:'#'+invitation}};globalThis.history={replaceState:(_a,_b,url)=>events.push(['replace',url])};
 globalThis.sessionStorage={getItem:()=>null,setItem:()=>{throw Error('no invitation persistence')}};
 globalThis.fetch=async(url,init)=>{events.push(['fetch',url]);assert.equal(events[0][0],'replace');return Response.json(url.endsWith('acceptance-entry')?{state:'ADMITTED'}:context)};
 let tree;await act(async()=>{tree=create(React.createElement(PrivateCheckoutEntry));await new Promise(r=>setTimeout(r,5));});
 t.after(async()=>{await act(async()=>tree.unmount());for(const k of keys)globalThis[k]=before[k]});
 assert.deepEqual(events,[['replace','/checkout/private'],['fetch','/checkout/stripe/acceptance-entry'],['fetch','/checkout/stripe/acceptance-context']]);
 assert.doesNotMatch(JSON.stringify(tree.toJSON()),new RegExp(invitation));assert.match(JSON.stringify(tree.toJSON()),/M6 washer/);
});
