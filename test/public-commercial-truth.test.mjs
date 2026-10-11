import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const truth=JSON.parse(read('public/.well-known/csc-commercial-truth.json'));
const baseline=process.env.SEEKAPI_1144_BASELINE;
const surface=(route,index)=>baseline?readFileSync(`${baseline}/${index}.body`,'utf8'):read('.next/server/app/'+route+'.body');
const manifest=JSON.parse(surface('for-agents/agent-services.json',6));
const ard=JSON.parse(baseline?readFileSync(`${baseline}/7.body`,'utf8'):read('public/.well-known/ard.json')).entries[0].data;
const visible=s=>s.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
test('official manifest and ARD expose the same current commercial facts with clear namespaces',()=>{
 assert.deepEqual(manifest.commercial_truth,truth);
 assert.deepEqual(ard.commercialTruth,truth);
 assert.deepEqual(manifest.versions,truth.versions);
 assert.deepEqual(ard.versions,truth.versions);
 assert.equal(manifest.product_data_mcp.price_usdc,truth.price.amount);
 assert.equal(manifest.product_data_mcp.stripe_checkout,truth.price.card_state);
 assert.deepEqual(manifest.product_data_mcp.paid_effect_tools,truth.tools.paid);
 assert.ok(Number.isFinite(Date.parse(manifest.observed_at)));
 assert.ok(Number.isFinite(Date.parse(ard.observed_at)));
 assert.doesNotMatch(JSON.stringify({manifest,ard}),/AH0[1-8]|provider_effects|authorizationDigest|aion-governance|cost_ledger|runtime_governance/);
});
test('current rendered product paths preserve live x402, card off and current sample',()=>{
 for(const [route,i] of [['index',0],['china-supply-check',1],['china-supply-check/sample',2],['for-agents',3],['trust',4]]){
  const html=baseline?readFileSync(`${baseline}/${i}.body`,'utf8'):read('.next/server/app/'+route+'.html');
  const body=visible(html);
  assert.match(body,/2\.99/);assert.match(body,/x402/i);assert.match(body,/credit-card checkout is OFF/i,route);
  assert.ok(html.includes('/china-supply-check/sample'),route);
  assert.doesNotMatch(body,/CSC_PUBLIC_PAID_OFF|x402.{0,20}disabled|Agent x402 payment is currently disabled|AH0[1-8]|provider_effects/);
 }
});
test('sample presents measured real coverage and does not imply a full passing benchmark',()=>{
 const coverage=JSON.parse(read('public/china-supply-check-field-coverage.json'));
 const html=baseline?readFileSync(`${baseline}/2.body`,'utf8'):read('.next/server/app/china-supply-check/sample.html');
 const body=visible(html);
 assert.equal(coverage.candidate_count,coverage.distinct_supplier_count);
 assert.equal(coverage.benchmark_overall_pass,false);
 assert.equal(coverage.coverage.find(x=>x.field==='specification_evidence').observed_candidates,0);
 assert.equal(coverage.coverage.find(x=>x.field==='specification_evidence').unknown_candidates,3);
 assert.equal(coverage.coverage.find(x=>x.field==='recorded_specification_observations').observed_candidates,3);
 assert.match(coverage.field_definitions.specification_evidence,/Quantity\/MOQ\/unit does not count/);
 assert.match(body,/quantity\/MOQ matches do not count as specification matches/);
 assert.deepEqual(coverage.benchmark_summary.map(x=>x.qualified_distinct_suppliers),[3,3,2,3,0]);
 for(const row of coverage.coverage){assert.equal(row.observed_candidates+row.unknown_candidates,row.total_candidates);assert.ok(body.includes(row.field==='specification_evidence'?'Confirmed product/model/material match':row.field.replaceAll('_',' ')),row.field);}
 assert.match(body,/provider-only benchmark/i);assert.match(body,/not the paid acceptance order/i);
 assert.match(body,/publication rights remain unconfirmed/i);assert.match(body,/UNKNOWN/);
 assert.match(body,/Confirmed supplier quote/);assert.match(body,/Requested-quantity tier match/);
 assert.doesNotMatch(html,/<a[^>]*class="button[^\"]*"[^>]*href="[^\"]*archived-v4/);
 assert.doesNotMatch(JSON.stringify(coverage),/b2b-|detail\.1688|wallet|signature|api_key|provider_calls|reserved_millicny/);
});
