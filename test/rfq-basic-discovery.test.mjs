import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import AgentRoute from '../app/(english)/for-agents/agent-services.json/route.ts';
const {GET}=AgentRoute;
import BasicModule from '../app/(english)/china-supply-check/live-rfq-compare/page.tsx';
const BasicPage=BasicModule.default??BasicModule;
import HomeModule from '../components/growth-home.tsx';
import AgentsModule from '../app/(english)/for-agents/page.tsx';
const AgentsPage=AgentsModule.default??AgentsModule;
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const visible=s=>s.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');

test('real Agent GET offers standalone Basic while preserving other product rails',async()=>{
 const response=await GET();assert.equal(response.status,200);
 const m=await response.json(),rfq=m.verified_rfq_basic;
 assert.ok(rfq,'Basic needs its own purchasable contract, separate from manual human tasks');
 assert.equal(rfq.name,'SeekAPI Verified RFQ Basic');assert.equal(rfq.availability,'LIVE');
 assert.deepEqual(rfq.price,{amount_minor:1990,currency:'USD'});
 assert.equal(rfq.payment,'STRIPE_HOSTED_CHECKOUT');assert.equal(rfq.requires_china_supply_check_purchase,false);
 assert.equal(rfq.max_distinct_suppliers,3);assert.equal(rfq.service_window.china_business_days,3);
 assert.equal(rfq.success_target.minimum_current_qualified_quotes,1);
 assert.equal(rfq.incomplete.outcome,'RFQ_INCOMPLETE');assert.equal(rfq.incomplete.refund,'FULL_SERVICE_FEE_ORIGINAL_PAYMENT_METHOD');
 assert.deepEqual(rfq.deliverables,['HUMAN_REPORT','AGENT_JSON','EVIDENCE_MANIFEST']);assert.equal(rfq.goods_purchase_authorized,false);
 assert.equal(m.public_api_live,false);assert.equal(m.live_human_task_api,false);
 assert.equal(m.product_data_mcp.price_usdc,'2.99');
 assert.equal(m.product_data_mcp.payments.image_first.x402.status,'OFF');
 assert.equal(m.product_data_mcp.payments.text_model_legacy.x402.status,'LIVE');
});
test('real Agent GET explains admission, exact confirmation and free private result recovery',async()=>{
 const m=await(await GET()).json(),p=m.rfq_requirement_preparation,s=m.verified_rfq_basic;
 assert.equal(p.image_required,false);assert.equal(p.payment_required,false);
 assert.deepEqual(p.effects,{order:0,payment:0,supplier_contact:0,paid_provider:0});
 assert.equal(p.example_request.action,'prepare_runtime');assert.equal(p.example_request.draft.quantity,120);
 assert.equal(s.endpoint,'https://api.seekapi.ai/checkout/stripe/rfq');
 assert.equal(s.admission.action,'discover');assert.deepEqual(s.admission.accept_only,['AVAILABLE']);
 assert.deepEqual(s.lifecycle.map(x=>x.action),['discover','prepare_runtime','session','confirm','checkout','result','checkout_return','renew']);
 const confirm=s.lifecycle.find(x=>x.action==='confirm');assert.match(confirm.instructions,/receipt/);assert.match(confirm.instructions,/requirement_digest/);assert.match(confirm.instructions,/CONFIRM_RFQ_REQUIREMENT/);
 assert.equal(s.lifecycle.find(x=>x.action==='result').method,'POST');
 assert.match(s.recovery,/do not create another order|no repayment/i);
 assert.match(p.optional_reference_image.scope,/VISUAL_REFERENCE/);assert.equal(p.optional_reference_image.original_fidelity,false);
 assert.equal(p.optional_reference_image.text_fallback,true);
});
test('actual Human and Agent rendered pages agree with the machine Basic contract',()=>{
 for(const Page of [BasicPage,AgentsPage]){
  const html=renderToStaticMarkup(createElement(Page)),text=visible(html);
  for(const pattern of [/SeekAPI Verified RFQ Basic/,/19\.90/,/three distinct suppliers|3 distinct suppliers/i,/three China business days|3 China business days/i,/RFQ_INCOMPLETE/,/full.*service.fee.*refund|refund.*full.*service.fee/i,/Human.*Agent.*Evidence/i,/no.*\$2\.99.*purchase|without.*\$2\.99/i,/text.*continue|continue.*text/i])assert.match(text,pattern);
  assert.doesNotMatch(text,/paid RFQ not open|RFQ service remains closed|no live RFQ checkout|planned USD ?19\.90|service is not open for purchase/i);
  assert.match(html,/https:\/\/api\.seekapi\.ai\/checkout\/stripe\/rfq/);
 }
});
test('llms discovery shares Basic terms and cannot advertise the retired invitation-only state',()=>{
 const text=read('public/llms.txt');
 for(const pattern of [/SeekAPI Verified RFQ Basic/,/19\.90/,/RFQ_INCOMPLETE/,/original payment method/i,/three China business days/i,/Channel A/,/precision drawings/i,/action=result/,/no repayment/i])assert.match(text,pattern);
 assert.doesNotMatch(text,/RFQ.*closed for purchase|not currently open for purchase|do not call session, confirm or checkout/i);
});

test('actual home points buyers to Basic without a contradictory private/future sales claim',()=>{
 const Home=HomeModule.GrowthHome;const html=renderToStaticMarkup(createElement(Home,{variant:'a'}));const text=visible(html);
 assert.match(text,/Get a supplier quote · USD 19.90/);assert.match(text,/SeekAPI Verified RFQ Basic/);assert.match(text,/three China business days/);assert.match(text,/RFQ_INCOMPLETE/);
 assert.doesNotMatch(text,/19\.90[^.]*not open|RFQ Compare[^.]*planned|planned 72.hour/i);
 assert.match(html,/href="\/china-supply-check\/live-rfq-compare"/);
});

test('an Agent following the deprecated ARD RFQ field reaches the same dedicated Basic contract',async()=>{
 const manifest=await(await GET()).json();
 const ard=JSON.parse(read('public/.well-known/ard.json'));
 const entry=ard.entries[0].data,manual=entry.humanTasks,legacy=manual.live_rfq;
 assert.equal(manual.status,'MANUAL_SCOPE_REVIEW_REQUIRED');assert.equal(manual.public_api_live,false);
 // Resolve the public migration pointer as an Agent would; the old field must
 // not make a second, contradictory product-availability or price statement.
 assert.equal(legacy.deprecated,true);
 assert.equal(legacy.status,'MOVED_TO_DEDICATED_BASIC_CONTRACT');
 assert.equal(legacy.replacement.document,'https://seekapi.ai/for-agents/agent-services.json');
 const target=legacy.replacement.json_pointer.split('/').slice(1).reduce((o,k)=>o?.[k.replaceAll('~1','/').replaceAll('~0','~')],manifest);
 assert.ok(target,'The deprecated RFQ discovery field must resolve to an actual contract in the real Agent response');
 assert.deepEqual(target,manifest.verified_rfq_basic);assert.deepEqual(target,entry.commercialTruth.live_rfq);
 assert.equal(target.availability,'LIVE');assert.equal(target.admission.action,'discover');
 assert.equal('availability'in legacy,false);assert.equal('price_usd'in legacy,false);
 assert.doesNotMatch(JSON.stringify(legacy),/FUTURE_NOT_ENABLED|not open for purchase/);
});
