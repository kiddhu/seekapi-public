import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(read('public/china-supply-check-source-observations.json'));
const notice='These rows are public source observations from an internal provider-only benchmark. They are not supplier recommendations, verified quotations, confirmed manufacturers, or completed RFQ candidates.';
const visible=s=>s.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
const forbiddenKeys=new Set(['buyer','intent','intent_id','order','order_id','entitlement','payment','wallet','email','session','cookie','credentials','raw_response','raw_responses','request_id','request_ids','attempt','checkpoint','recovery','provider_cost','budget','reserve','billing','github_issue','pr','review','sha','runtime','source_receipt_sha256','evidence_digest','source_relationships']);
function assertSafe(x){if(Array.isArray(x))x.forEach(assertSafe);else if(x&&typeof x==='object')for(const[k,v]of Object.entries(x)){assert.ok(!forbiddenKeys.has(k),k);assertSafe(v);}else if(typeof x==='string'){assert.doesNotMatch(x,/[a-f0-9]{64}|PRIVATE_CANARY|api[_-]?key|github\.com\/kiddhu\/aion-governance|0x[a-f0-9]{40}/i);if(x.startsWith('http')){const u=new URL(x);assert.equal(u.protocol,'https:');assert.equal(u.username,'');assert.equal(u.password,'');assert.equal(u.search,'');assert.equal(u.hash,'');}}}
test('public source JSON contains exactly three UNKNOWN observations and frozen evidence limits',()=>{
 assert.equal(data.disclaimer,notice);assert.equal(data.publication_scope,'PUBLIC_SOURCE_OBSERVATIONS_ONLY');assert.equal(data.rows.length,3);
 assert.deepEqual(data.qualification_summary,{strict_product_model_material_confirmation:{confirmed:0,total:3},observed_specification_signals:{observed:3,total:3},final_qualification:{status:'UNKNOWN',unknown:3,total:3},five_case_benchmark_overall:'NOT_PASS'});
 for(const r of data.rows){assert.equal(r.qualification_status,'UNKNOWN');assert.equal(r.evidence_status,'INSUFFICIENT_EVIDENCE');assert.equal(r.shop.display_name,'UNKNOWN');assert.equal(r.shop.source_url,'UNKNOWN');assert.match(r.product.source_url,/^https:\/\/detail\.1688\.com\/offer\/\d+\.html$/);assert.equal(r.product.public_id,r.product.source_url.split('/').at(-1).slice(0,-5));}
 assertSafe(data);assertSafe(JSON.parse(read('public/china-supply-check-field-coverage.json')));
});
test('rendered source rows and dataset display disclaimer and UNKNOWN without private metadata',()=>{
 const html=read('.next/server/app/china-supply-check/sample.html');const body=visible(html);assert.ok(body.includes(notice));assert.match(body,/strict product\/model\/material confirmation: 0 \/ 3/i);assert.match(body,/observed specification signals: 3 \/ 3/i);assert.match(body,/final qualification: 3 \/ 3 UNKNOWN/i);assert.match(body,/five-case benchmark overall: NOT_PASS/i);
 for(const r of data.rows){assert.ok(body.includes(r.product.public_id));assert.ok(body.includes(r.shop.public_id));assert.ok(html.includes(r.product.source_url));}
 const script=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).find(x=>x['@type']==='Dataset');assert.ok(script);assert.equal(script.description,notice);assert.equal(script.distribution.contentUrl,'https://seekapi.ai/china-supply-check-source-observations.json');assertSafe(script);
 assert.doesNotMatch(html,/source_receipt_sha256|0d4e3da40faa|github\.com\/kiddhu\/aion-governance|PRIVATE_CANARY/);
});
