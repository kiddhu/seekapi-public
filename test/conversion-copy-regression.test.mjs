import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import RFQ from '../lib/rfq-basic-copy.ts';
const {rfqBasicCopy,rfqReferenceCopy,productLinkFaq}=RFQ;
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const visible=s=>s.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<details[\s\S]*?<\/details>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
const forbidden=/does not promise|not guaranteed|reference only|reference material|\bUNKNOWN\b|\bunsupported\b|\bOneBound\b|anti-bot|provider entitlement|API cost/ig;
test('first two conversion sections lead with outcomes and omit internal defensive language',()=>{
 for(const route of ['index','china-supply-check','china-supply-check/live-rfq-compare','how-it-works','for-agents']){
  const html=read('.next/server/app/'+route+'.html');const sections=[...html.matchAll(/<section\b[\s\S]*?<\/section>/g)].slice(0,route==='index'?3:2).map(m=>m[0]).join(' ');
  assert.equal((visible(sections).match(forbidden)??[]).length,0,route);
 }
});
test('the canonical sourcing CTA explains both services and the guarantee',()=>{
 const html=read('.next/server/app/china-supply-check/live-rfq-compare.html'),text=visible(html);
 for(const pattern of [/Prepare my RFQ for free/,/2\.99/,/19\.90/,/three China business days/,/full RFQ service fee is refunded/,/editable sourcing brief/,/selected variant/,/add.*photo|photo.*add/i])assert.match(text,pattern);
 assert.ok(text.includes(rfqBasicCopy));assert.ok(text.includes(rfqReferenceCopy));
 const schema=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).find(s=>s['@type']==='Service');
 assert.ok(schema.description.includes(rfqBasicCopy));assert.ok(schema.description.includes(rfqReferenceCopy));
});
test('machine value projection matches prices, clock, remedy and actual pending import state',()=>{
 const truth=JSON.parse(read('public/.well-known/csc-commercial-truth.json')),ard=JSON.parse(read('public/.well-known/ard.json')).entries[0].data.commercialTruth;
 const manifest=JSON.parse(read('.next/server/app/for-agents/agent-services.json.body'));
 assert.deepEqual(manifest.customer_value,truth.customer_value);assert.deepEqual(ard,truth);
 assert.equal(truth.customer_value.rfq_china_business_days,truth.live_rfq.service_window.china_business_days);
 assert.equal(truth.customer_value.rfq_qualified_quotes_min,truth.live_rfq.success_target.minimum_current_qualified_quotes);
 assert.equal(truth.customer_value.amazon_direct_import,'PENDING_RUNTIME_ACCOUNT_AND_RELEASE_ACCEPTANCE');
 assert.doesNotMatch(rfqBasicCopy,forbidden);assert.doesNotMatch(rfqReferenceCopy,forbidden);
});

test('FAQ structured data uses the displayed sourcing answers',()=>{
 const html=read('.next/server/app/china-supply-check/live-rfq-compare.html');
 const faq=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).find(s=>s['@type']==='FAQPage');
 assert.deepEqual(faq.mainEntity.map(x=>({question:x.name,answer:x.acceptedAnswer.text})),productLinkFaq);
 for(const item of productLinkFaq){assert.ok(html.includes(item.question));assert.ok(html.includes(item.answer));}
});
