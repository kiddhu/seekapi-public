import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = p => readFileSync(new URL('../'+p, import.meta.url),'utf8');
const root = '.next/server/app/';
const html = route => read(root+(route==='/'?'index':route.slice(1))+'.html');
const visible = value => value.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/\s+/g,' ');
const guides=JSON.parse(read('lib/procurement-intents.ts').split('export const procurementIntents: ProcurementIntent[] = ')[1].trim().replace(/;$/,''));
const hrefs = value => [...value.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replace(/&amp;/g,'&'));
const changedRoutes=['/','/about','/sourcing','/for-agents','/apis','/china-supply-check','/china-supply-check/sample','/discovery-status','/how-it-works','/china-desk','/china-supply-chain','/china-compliance-logistics',...guides.map(g=>'/sourcing/'+g.slug),...['ja','es','ar','de','pt-br','ru'].map(l=>'/'+l)];
test('production build renders exactly eight distinct substantive procurement guides',()=>{
 assert.equal(guides.length,8);assert.equal(new Set(guides.map(g=>g.slug)).size,8);
 assert.equal(new Set(guides.map(g=>g.question)).size,8);
 for(const guide of guides){
  const page=html('/sourcing/'+guide.slug),text=visible(page);
  for(const value of [guide.question,guide.example,guide.sections[0].body,guide.sections[1].body,guide.unknowns])assert.ok(text.includes(value.replaceAll('&','&amp;'))||text.includes(value),guide.slug+': missing unique content');
  assert.ok(guide.sections.map(s=>s.body).join(' ').split(/\s+/).length>=85,guide.slug+': thin decision body');
  assert.match(page,/<caption>Evidence fields for this sourcing decision<\/caption>/);
  assert.match(text,/three distinct evidence-backed China supplier candidates worth advancing to RFQ/);
  assert.match(text,/2\.99 USDC on Base/);assert.match(text,/Public credit-card checkout is OFF and is not available to buy/);
  assert.match(page,new RegExp('rel="canonical" href="https://seekapi.ai/sourcing/'+guide.slug+'"'));
  assert.match(page,new RegExp('property="og:url" content="https://seekapi.ai/sourcing/'+guide.slug+'"'));
  assert.match(page,/"@type":"Service","@id":"https:\/\/seekapi\.ai\/#china-supply-check-service","name":"China Supply Check"/);
  assert.match(page,/<title>[^<]+\| SeekAPI<\/title>/);
 }
});
test('legacy entry redirects are explicit 301 and history stays noindex outside sitemap',()=>{
 const routes=JSON.parse(read('.next/routes-manifest.json'));
 const destinations={'/pricing':'/china-supply-check','/compare':'/china-supply-check/alternatives','/integrations':'/for-agents','/docs':'/for-agents'};
 for(const [source,destination] of Object.entries(destinations)){const r=routes.redirects.find(r=>r.source===source);assert.equal(r?.destination,destination);assert.equal(r.statusCode,301);}
 assert.match(html('/china-supply-check/sample/archived-v4'),/name="robots" content="noindex, follow"/);
 const sitemap=read(root+'sitemap.xml.body');
 assert.doesNotMatch(sitemap,/archived-v4|<loc>[^<]*\/start<\/loc>|lastmod/);
 for(const route of ['/about','/sourcing',...guides.map(g=>'/sourcing/'+g.slug)])assert.ok(sitemap.includes('https://seekapi.ai'+route),route);
});
test('new and revised navigation has no dead internal destination',()=>{
 const redirects=new Set(JSON.parse(read('.next/routes-manifest.json')).redirects.map(x=>x.source));
 const compiledPages=new Set(Object.keys(JSON.parse(read('.next/server/app-paths-manifest.json'))).filter(x=>x.endsWith('/page')).map(x=>x.replace(/\/\([^/]+\)/g,'').replace(/\/page$/,'')));
 for(const route of changedRoutes)for(const href of hrefs(html(route))){
  if(!href.startsWith('/')||href.startsWith('//')||href.startsWith('/_next/'))continue;
  const path=href.split(/[?#]/)[0];
  const stem=root+(path==='/'?'index':path.slice(1));
  assert.ok(existsSync(new URL('../'+stem+'.html',import.meta.url))||existsSync(new URL('../'+stem+'.body',import.meta.url))||existsSync(new URL('../public'+path,import.meta.url))||redirects.has(path)||compiledPages.has(path),route+' -> '+href);
 }
});
test('localized home product CTA and metadata match current commercial identity',()=>{
 for(const locale of ['ja','es','ar','de','pt-br','ru']){
  const page=html('/'+locale),text=visible(page);
  assert.match(text,/China Supply Check/);assert.match(text,/2.99 USDC/);assert.match(text,/USD 2.99/);
  const main=page.slice(page.indexOf('<main'));
  const firstButton=[...main.matchAll(/<a\b[^>]+>/g)].map(m=>m[0]).find(tag=>/class="button"/.test(tag));
  assert.equal(firstButton?.match(/href="([^"]+)"/)?.[1],'/china-supply-check',locale);
  assert.match(page,new RegExp('rel="canonical" href="https://seekapi.ai/'+locale+'"'));
  assert.match(page,/<meta name="description" content="[^\"]*China Supply Check/);
 }
});
test('proof remains honest aggregate and discovery states do not imply ranking success',()=>{
 const sample=visible(html('/china-supply-check/sample'));
 assert.match(sample,/REAL PRODUCTION PAID ACCEPTANCE EXAMPLE/);assert.match(sample,/INTERNAL_ACCEPTANCE/);
 assert.match(sample,/NOT_AVAILABLE_FROM_AUTHORIZED_PUBLIC_MATERIAL/);assert.match(sample,/not a customer testimonial/);
 assert.doesNotMatch(sample,/restart\/reconciliation|0x[0-9a-f]{40}|b2b-[0-9]+/i);
 const discovery=visible(html('/discovery-status'));
 assert.match(discovery,/INDEXED_STALE/);assert.match(discovery,/SUBMITTED \/ PENDING_REVIEW/);assert.match(discovery,/no submission ID was exposed/i);
 for(const route of changedRoutes){const text=visible(html(route));assert.doesNotMatch(text,/aion-governance|DeepSeek|Save 90%|GLOBAL COMPUTE ARBITRAGE|OpenAI-compatible|inference gateway/i,route);}
});

test('machine discovery links resolve and tool effects are classified honestly',()=>{
 const page=html('/for-agents');
 assert.match(page,/id="handoff-spec"/);assert.match(page,/id="evidence-return"/);
 const manifest=JSON.parse(read(root+'for-agents/agent-services.json.body'));
 assert.deepEqual(manifest.product_data_mcp.free_tools,['discover_china_supply_check_v0','prepare_china_supply_check_v0']);
 assert.deepEqual(manifest.product_data_mcp.authenticated_order_read_tools,['status_china_supply_check_v0','result_china_supply_check_v0']);
 assert.deepEqual(manifest.product_data_mcp.paid_effect_tools,['purchase_china_supply_check_v0','run_china_supply_check_v0']);
 assert.deepEqual(manifest.product_data_mcp.image_input,{no_value_prepare:true,accepted_mime:['image/png'],public_paid_execution:false,purchase_state:'PUBLIC_OFF'});
 assert.equal(manifest.official_mcp_registry.registry_package_version,'0.1.8');
 assert.match(read('public/llms.txt'),/\.well-known\/ard\.json/);assert.match(read('public/llms.txt'),/registry\.modelcontextprotocol\.io/);
 assert.match(read('public/llms.txt'),/public image purchase is OFF/i);
});

test('localized metadata has one brand suffix and English x-default',()=>{
 for(const locale of ['ja','es','ar','de','pt-br','ru']){
  const page=html('/'+locale);
  assert.doesNotMatch(page,/<title>[^<]*\| SeekAPI \| SeekAPI<\/title>/);
  assert.match(page,/<link rel="alternate" hrefLang="x-default" href="https:\/\/seekapi\.ai\/?"/);
 }
});

test('China Supply Check schemas share one canonical service identity',()=>{
 const serviceId='https://seekapi.ai/#china-supply-check-service';
 for(const route of ['/china-supply-check','/for-agents',...guides.map(g=>'/sourcing/'+g.slug)])assert.ok(html(route).includes(serviceId),route);
});
