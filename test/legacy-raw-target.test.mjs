import test from 'node:test';
import assert from 'node:assert/strict';
import { trustedOriginalTarget } from '../lib/legacy-raw-target.mjs';
const meta=Symbol.for('NextInternalRequestMeta');
const request=(target,initial='https://seekapi.ai'+target)=>({url:target,[meta]:{initURL:initial}});
test('missing server metadata never falls back to normalized URL or spoofed headers',()=>{
 assert.equal(trustedOriginalTarget({url:'/docs/introduction',headers:{'x-original-url':'/docs/introduction','x-seekapi-raw-path':'/docs/introduction'}}),null);
});
test('server metadata and native request preserve dot and encoded traversal bytes',()=>{
 for(const target of ['/docs/introduction','/docs/x/../introduction','/%2e%2e/docs/introduction','/foo/%2e%2e/docs/introduction','/docs/%2e/introduction','/favicon.ico/../docs/introduction'])assert.equal(trustedOriginalTarget(request(target)),target);
});
test('caller query boundary is retained for exact-response decision',()=>{
 for(const target of ['/docs/introduction?','/docs/introduction?x=1','/docs/introduction?x=%2e%2e'])assert.equal(trustedOriginalTarget(request(target)),target);
});
test('missing, network-path, fragment and control-bearing metadata fails closed',()=>{
 for(const initial of [undefined,null,42,'//seekapi.ai/docs/introduction','/docs/introduction#x','https://seekapi.ai','https://seekapi.ai?x=/docs/introduction','https://seekapi.ai/docs/introduction#x','https://seekapi.ai/docs/introduction\r\nx'])assert.equal(trustedOriginalTarget({url:'/docs/introduction',[meta]:{initURL:initial}}),null);
});
test('trusted origin-form metadata preserves bytes when native path agrees',()=>{
 for(const target of ['/docs/introduction','/docs/introduction?','/docs/introduction?x=1','/docs/x/../introduction','/%2e%2e/docs/introduction','/docs/introduction%00'])assert.equal(trustedOriginalTarget(request(target,target)),target);
});
test('runtime-added metadata query does not become a caller query; caller queries never disappear',()=>{
 for(const target of ['/docs/introduction','/docs/introduction?','/docs/introduction?x=1','/docs/introduction?__nextLocale=en','/docs/introduction?_rsc=ws2'])assert.equal(trustedOriginalTarget(request(target,'https://seekapi.ai/docs/introduction?runtime_added=synthetic')),target);
});
test('normalization disagreement or missing/malformed native request fails closed',()=>{
 for(const initial of ['https://seekapi.ai/docs/x/../introduction','https://seekapi.ai/%2e%2e/docs/introduction','https://seekapi.ai/docs/%2e/introduction','https://seekapi.ai/blog'])assert.equal(trustedOriginalTarget(request('/docs/introduction',initial)),null);
 for(const url of [undefined,null,42,'https://seekapi.ai/docs/introduction','//seekapi.ai/docs/introduction','/docs/introduction#x','/docs/introduction\r\nx'])assert.equal(trustedOriginalTarget({url,[meta]:{initURL:'https://seekapi.ai/docs/introduction'}}),null);
});
