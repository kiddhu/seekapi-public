import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {demo,Fixture} from '../public/developers/free-mcp-quickstart/examples/quickstart.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const guides=JSON.parse(read('data/sourcing-decisions.json'));
const visible=s=>s.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').replaceAll('&#x27;',"'").replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replace(/\s+/g,' ');
test('a buyer can read every differentiated worksheet, download equivalent fields and choose a free next action',()=>{
 const hub=read('.next/server/app/sourcing.html'),map=read('.next/server/app/sitemap.xml.body');
 for(const g of guides){
  const h=read(`.next/server/app${g.canonical_path}.html`),text=visible(h),md=read(`public${g.canonical_path}.md`);
  assert.ok(hub.includes(`href="${g.canonical_path}"`));
  assert.ok(map.includes(`<loc>https://seekapi.ai${g.canonical_path}</loc>`));
  assert.ok(h.includes(`rel="canonical" href="https://seekapi.ai${g.canonical_path}"`));
  assert.equal((text.match(new RegExp(g.h1.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length,1);
  for(const s of [g.direct_answer,g.minimum_brief,g.mismatch_rule,g.rfq_questions,...g.field_contracts.flatMap(f=>Object.values(f))]){
   assert.ok(text.includes(s),`${g.id}: missing readable field ${s}`);assert.ok(md.includes(s),`${g.id}: Markdown field diverged`);
  }
  assert.ok(h.includes(`href="${g.canonical_path}.md"`));
  for(const path of ['/sourcing',g.nearest_existing,g.human_action,g.machine_action,'/for-agents#free-quickstart'])assert.ok(h.includes(`href="${path}"`));
  assert.doesNotMatch(text,/PREPARE_ONLY|NOT_PUBLISHED|independently review sentence/);
 }
});
test('four customer entry pages expose the runnable SDK and preserve the approved sample bytes',()=>{
 for(const p of ['sourcing','for-agents','china-supply-check','china-supply-check/sample'])assert.ok(read(`.next/server/app/${p}.html`).includes('/for-agents#free-quickstart')||p==='for-agents');
 const a=read('.next/server/app/for-agents.html');
 for(const path of ['/developers/free-mcp-quickstart.zip','/developers/free-mcp-quickstart/README.md'])assert.ok(a.includes(`href="${path}"`));
 const text=visible(a);assert.match(text,/cd free-mcp-quickstart/);assert.match(text,/python3 examples\/quickstart.py/);assert.match(text,/node examples\/quickstart.mjs/);
 assert.match(text,/payment_effects: 0/);assert.match(text,/provider_effects: 0/);
 assert.equal(JSON.parse(read('data/public-agent-sample-publication.json')).sample_json,read('.next/server/app/china-supply-check/sample.json.body'));
});
test('a stranger can copy the complete displayed brief, follow its public fixture and pass it unchanged to the free client',async()=>{
 const page=read('.next/server/app/sourcing/rfq-templates/china-supplier-brief.html');
 const encoded=page.match(/<pre id="buyer-brief-example">([\s\S]*?)<\/pre>/)?.[1];assert.ok(encoded);
 const input=JSON.parse(encoded.replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
 const link=page.match(/href="(\/developers\/free-mcp-quickstart\/fixtures\/free-journey.json)"/)?.[1];assert.ok(link);
 const fixture=JSON.parse(read('public'+link));assert.deepEqual(input,{draft:fixture.draft});
 const md=read('public/sourcing/rfq-templates/china-supplier-brief.md');assert.deepEqual(JSON.parse(md.match(/```json\n([\s\S]*?)\n```/)[1]),input);
 const transport=new Fixture();const result=await demo(transport,input.draft);assert.deepEqual(transport.arguments[1],input);assert.deepEqual(transport.calls,['discover_china_supply_check_v0','prepare_china_supply_check_v0']);assert.equal(result.payment_effects,0);assert.equal(result.provider_effects,0);
 assert.doesNotMatch(visible(page),/data\/brief-copy-examples|Reuses approved topic|original find-guide/);
});
