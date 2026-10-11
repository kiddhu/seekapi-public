import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const truth=JSON.parse(read('public/.well-known/csc-commercial-truth.json'));
const visible=s=>s.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
test('published model guide version namespaces agree with current canonical commercial truth',()=>{
 const llms=read('public/llms.txt');
 const versions=truth.versions;
 for(const [label,key] of [['Registry package','registry_package_version'],['MCP server','mcp_server_version'],['CSC contract','csc_contract_version'],['commercial state','commercial_state_version']]){
  assert.ok(llms.includes(label+' '+versions[key]),label+' drift');
 }
 assert.ok(llms.includes('Contract updated '+truth.contract_updated_at),'contract timestamp drift');
});
test('official generated Agent surfaces carry the same live image Stripe and scoped legacy OFF',()=>{
 const manifest=JSON.parse(read('.next/server/app/for-agents/agent-services.json.body'));
 const ard=JSON.parse(read('public/.well-known/ard.json')).entries[0].data;
 assert.equal(truth.payments?.image_first?.stripe?.status,'LIVE');
 assert.equal(truth.payments.image_first.stripe.amount_usd,'2.99');
 assert.equal(truth.payments.text_model_legacy.stripe.status,'OFF');
 for(const mode of ['image_first','text_model_legacy']) assert.equal(truth.payments[mode].x402.status,'LIVE');
 for(const published of [manifest.commercial_truth,ard.commercialTruth]) assert.deepEqual(published,truth);
 for(const text of [read('public/llms.txt'),read('README.md')]){
  assert.match(text,/Stripe/);assert.match(text,/USD 2\.99/);assert.ok(text.includes(truth.payments.image_first.stripe.entry));
  assert.doesNotMatch(text,/Public credit-card checkout is OFF|Stripe[^\n]*(?:being enabled|not yet live)/i);
 }
});
test('rendered customer entrances explain live payment, automatic delivery and free recovery',()=>{
 for(const route of ['index','china-supply-check','for-agents','trust','china-supply-check/sample','proof']){
  const body=visible(read('.next/server/app/'+route+'.html'));
  assert.match(body,/Stripe[^.]*USD 2\.99/,route);
  assert.match(body,/automatic sourcing/i,route);
  assert.match(body,/without (?:re)?paying|without repayment/i,route);
  assert.doesNotMatch(body,/Public credit-card checkout is OFF|Stripe[^.]*being enabled|not yet live/i,route);
 }
});
