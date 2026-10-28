import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import Copy from '../lib/rfq-basic-copy.ts';
import Agent from '../app/(english)/for-agents/agent-services.json/route.ts';
const {rfqBasicCopy,rfqBasic}=Copy;
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const visible=s=>s.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&amp;','&');
const obsolete=[
 /The worksheet does not obtain quotes or make the proposed RFQ service purchasable\./i,
 /(?:proposed|planned|future)\s+(?:USD\s*|\$)?19\.90.{0,160}(?:not\s+(?:currently\s+)?open|unavailable|would)/i,
 /(?:Live RFQ Compare|Verified RFQ Basic|RFQ service)\s+(?:is\s+|remains\s+)?(?:planned|not\s+(?:currently\s+)?open for purchase|not live|unavailable|closed)/i,
 /(?:future|planned)\s+(?:USD\s*19\.90\s+)?Live RFQ Compare/i,
];
function currentTruth(text,label){for(const pattern of obsolete)assert.doesNotMatch(text,pattern,label);}
function* files(dir){for(const entry of readdirSync(new URL(dir,root),{withFileTypes:true})){const p=path.posix.join(dir,entry.name);if(entry.isDirectory())yield*files(p);else yield p;}}

test('the real pre-fix contradiction is rejected while generic human API OFF stays valid',()=>{
 assert.throws(()=>currentTruth('The proposed $19.90 RFQ service is not open for purchase.','old worksheet'));
 assert.throws(()=>currentTruth('Live RFQ Compare remains planned.','old how-it-works'));
 assert.throws(()=>currentTruth('The future USD 19.90 Live RFQ Compare would use your RFQ.','old page'));
 assert.throws(()=>currentTruth('The worksheet does not obtain quotes or make the proposed RFQ service purchasable.','old quote worksheet'));
 currentTruth('Generic human-task API: planned_not_live. Basic uses dedicated REST. Image x402 OFF.','distinct contracts');
});
test('all current built HTML, public Markdown and machine projections reject retired Basic OFF claims',()=>{
 let html=0,md=0,json=0;
 for(const p of files('.next/server/app')){
  if(p.includes('/archived-'))continue; // Explicit historical routes retain their recorded facts.
  if(p.endsWith('.html')){currentTruth(visible(read(p)),p);html++;}
  else if(p.endsWith('.json.body')){currentTruth(read(p),p);json++;}
 }
 for(const p of files('public'))if(/\.(md|json|txt)$/.test(p)){currentTruth(read(p),p);if(p.endsWith('.md'))md++;}
 currentTruth(read('README.md'),'README');
 assert.ok(html>50);assert.ok(md>=10);assert.ok(json>=2);
});
test('downloaded worksheets and rendered HTML share the complete current Basic terms',()=>{
 assert.equal(rfqBasic.availability,'LIVE');assert.equal(rfqBasic.price.amount_minor,1990);
 assert.equal(rfqBasic.max_distinct_suppliers,3);assert.equal(rfqBasic.success_target.minimum_current_qualified_quotes,1);
 assert.equal(rfqBasic.service_window.china_business_days,3);
 const guides=JSON.parse(read('data/sourcing-decisions.json'));
 for(const g of guides){
  const md=read(`public${g.canonical_path}.md`),html=visible(read(`.next/server/app${g.canonical_path}.html`));
  assert.ok(md.includes(rfqBasicCopy),g.id+' Markdown');assert.ok(html.includes(rfqBasicCopy),g.id+' HTML');
 }
});
test('current quote worksheet HTML and download explain worksheet effects and standalone live Basic',async()=>{
 const worksheetPath='/sourcing/rfq-templates/supplier-quote-comparison';
 const guide=JSON.parse(read('data/sourcing-decisions.json')).find(g=>g.id==='quotes');
 const md=read(`public${worksheetPath}.md`),html=visible(read(`.next/server/app${worksheetPath}.html`));
 const boundary='Reading or saving this worksheet does not contact suppliers, obtain quotations, purchase a service, or authorize payment. SeekAPI Verified RFQ Basic is a separate current USD 19.90 service, subject to current runtime admission and buyer confirmation.';
 for(const [label,text] of [['canonical answer',guide.direct_answer],['downloaded Markdown',md],['rendered HTML',html]]){
  currentTruth(text,label);
  assert.ok(text.includes(boundary),`${label}: missing current Basic and worksheet effects boundary`);
 }
 for(const [label,text] of [['downloaded Markdown',md],['rendered HTML',html]])assert.ok(text.includes(rfqBasicCopy),`${label}: missing complete Basic terms`);
 assert.ok(md.includes(guide.direct_answer),'Markdown must project the canonical direct answer');
 assert.ok(html.includes(guide.direct_answer),'HTML must project the canonical direct answer');
 const manifest=await(await Agent.GET()).json();
 assert.equal(manifest.verified_rfq_basic.availability,'LIVE');
 assert.equal(manifest.service_discovery.supplier_quote.transport,'HTTPS_JSON_REST');
 assert.equal(manifest.live_human_task_api,false);
 assert.equal(manifest.integrations.mcp,'planned_not_live');
});
test('the existing canonical product answers product-link intent and offers two truthful actions',()=>{
 const html=read('.next/server/app/china-supply-check/live-rfq-compare.html'),text=visible(html);
 for(const p of [/Amazon product link/,/editable sourcing brief/,/selected variant/,/quantity/,/destination/,/2\.99/,/19\.90/,/three China business days/,/payment and brief confirmation/,/full RFQ service fee is refunded/])assert.match(text,p);
 assert.doesNotMatch(text,/does not promise|Three quotes.*not guaranteed|reference material/);
 assert.match(html,/rel="canonical" href="https:\/\/seekapi.ai\/china-supply-check\/live-rfq-compare"/);
 assert.match(html,/href="https:\/\/api.seekapi.ai\/checkout\/stripe\/rfq"/);
 assert.match(html,/href="\/china-supply-check"/);
 const schema=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).find(s=>s['@type']==='Service');
 assert.equal(schema['@type'],'Service');assert.equal(schema.offers.price,'19.90');assert.equal(schema.offers.priceCurrency,'USD');
 assert.ok(text.includes(rfqBasicCopy));assert.ok(schema.description.includes(rfqBasicCopy));
 assert.doesNotMatch(html,/"aggregateRating"|"reviewRating"/);
});
test('Agent/OpenAPI/ARD preserve Basic REST, $2.99 MCP and generic manual API boundaries',async()=>{
 const manifest=await(await Agent.GET()).json(),openapi=JSON.parse(read('.next/server/app/openapi.json.body'));
 const ard=JSON.parse(read('public/.well-known/ard.json')).entries[0].data;
 assert.deepEqual(manifest.verified_rfq_basic,ard.commercialTruth.live_rfq);
 assert.deepEqual(manifest.service_discovery,openapi['x-service-discovery']);
 const service=manifest.service_discovery.supplier_quote;
 assert.equal(service.transport,'HTTPS_JSON_REST');assert.equal(service.endpoint,rfqBasic.endpoint);
 assert.equal(service.openapi_url,rfqBasic.openapi_url);assert.equal(service.prerequisite_screening_purchase,false);
 assert.equal(manifest.live_human_task_api,false);assert.equal(manifest.integrations.mcp,'planned_not_live');
 assert.equal(manifest.product_data_mcp.payments.image_first.x402.status,'OFF');
 assert.deepEqual(Object.keys(openapi.paths).sort(),['/.well-known/csc-commercial-truth.json','/china-supply-check/sample.json','/for-agents/agent-services.json'].sort());
 for(const doc of ['README.md','public/llms.txt'])assert.match(read(doc),/Amazon product URL/);
});
