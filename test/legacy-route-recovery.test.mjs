import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legacyResponse, retiredPaths } from '../lib/legacy-route-recovery.mjs';

const request = (p, method='GET', host='seekapi.ai', accept='text/html') => new Request('https://'+host+p, {method, headers:{accept}});
for (const p of retiredPaths) {
  test(`owned retired exact ${p}`, async () => {
    const response=legacyResponse(request(p));assert.equal(response.status,410);
    assert.equal(response.headers.get('location'),null);
    const body=await response.text();assert.match(body,/former AI model\/API gateway/);
    assert.match(body,/Existing purchases retain the terms accepted/);
    assert.doesNotMatch(body,/7-Day|Ironclad|Operational|baseURL|deepseek-chat/);
    assert.equal(legacyResponse(request(p,'HEAD')).status,410);
    assert.equal(await legacyResponse(request(p,'HEAD')).text(),'');
    const md=legacyResponse(request(p,'GET','seekapi.ai','text/markdown'));assert.match(md.headers.get('content-type'),/text\/markdown/);assert.match(await md.text(),/former AI model\/API gateway/);
  });
  test(`negative boundaries ${p}`, () => {
    assert.equal(legacyResponse(request(p+'?')).status,410); // Framework treats a bare delimiter as empty query.
    for (const path of [p+'/',p+'/child',p+'?x=1',p.toUpperCase(),p.replace(/[a-z]/, c=>'%'+c.charCodeAt(0).toString(16)),'/'+p.slice(1).replaceAll('/','%2f')+'%2fchild'])
      assert.equal(legacyResponse(request(path)),null,path);
    for (const method of ['POST','PUT','PATCH','DELETE','OPTIONS'])assert.equal(legacyResponse(request(p,method)),null,method);
    for (const host of ['api.seekapi.ai','other.example','seekapi.ai.evil.example'])assert.equal(legacyResponse(request(p,'GET',host)),null,host);
  });
}
test('favicon vector is a usable public asset with bodyless HEAD', async()=>{
 const response=legacyResponse(request('/favicon.ico'));assert.equal(response.status,200);
 assert.match(response.headers.get('content-type'),/^image\/svg\+xml/);assert.match(await response.text(),/^<svg.*<\/svg>$/);
 assert.equal(await legacyResponse(request('/favicon.ico','HEAD')).text(),'');
 assert.equal(legacyResponse(request('/favicon.ico?')).status,200);
 for(const p of ['/favicon.ico/','/favicon.ico/child','/favicon.ico?x=1','/FAVICON.ICO','/%66avicon.ico'])assert.equal(legacyResponse(request(p)),null);
 for(const method of ['POST','OPTIONS'])assert.equal(legacyResponse(request('/favicon.ico',method)),null);
});
test('security, current public, API/MCP and commercial routes are untouched',()=>{
 for(const p of ['/.env','/.git/config','/wp-login.php','/wp-admin','/%252eenv','/unknown','/docs/new','/integrations/new','/','/sitemap.xml','/robots.txt','/mcp','/checkout','/checkout/stripe/image','/china-supply-check','/terms','/privacy','/for-agents','/.well-known/ard.json','/llms.txt'])
   for(const method of ['GET','HEAD','POST'])assert.equal(legacyResponse(request(p,method)),null,p);
});
test('no User-Agent identity dependency or reflected input', async()=>{
 const req=request('/blog');req.headers.set('user-agent','spoofed bingbot');const response=legacyResponse(req);
 assert.equal(response.status,410);assert.doesNotMatch(await response.text(),/spoofed/);
 assert.equal(response.headers.get('vary'),'Accept');
});
