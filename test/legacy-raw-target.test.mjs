import test from 'node:test';
import assert from 'node:assert/strict';
import { trustedOriginalTarget } from '../lib/legacy-raw-target.mjs';
const meta=Symbol.for('NextInternalRequestMeta');
test('missing server metadata never falls back to normalized URL or spoofed headers',()=>{
 assert.equal(trustedOriginalTarget({url:'https://seekapi.ai/docs/introduction',headers:{'x-original-url':'/docs/introduction','x-seekapi-raw-path':'/docs/introduction'}}),null);
});
test('server metadata retains dot and encoded traversal without WHATWG normalization',()=>{
 for(const target of ['/docs/introduction','/docs/x/../introduction','/%2e%2e/docs/introduction','/foo/%2e%2e/docs/introduction','/docs/%2e/introduction','/favicon.ico/../docs/introduction']) {
  assert.equal(trustedOriginalTarget({[meta]:{initURL:'http://localhost:19342'+target}}),target);
 }
});
test('query boundary is preserved for the exact-response decision',()=>{
 for(const target of ['/docs/introduction?','/docs/introduction?x=1','/docs/introduction?x=%2e%2e'])assert.equal(trustedOriginalTarget({[meta]:{initURL:'https://seekapi.ai'+target}}),target);
});
test('missing, network-path, fragment and control-bearing metadata fails closed',()=>{
 for(const initURL of [undefined,null,42,'//seekapi.ai/docs/introduction','/docs/introduction#x','https://seekapi.ai','https://seekapi.ai?x=/docs/introduction','https://seekapi.ai/docs/introduction#x','https://seekapi.ai/docs/introduction\r\nx'])assert.equal(trustedOriginalTarget({[meta]:{initURL}}),null);
});

test('trusted origin-form server metadata preserves exact targets and traversal bytes',()=>{
 for(const target of ['/docs/introduction','/docs/introduction?','/docs/introduction?x=1','/docs/x/../introduction','/%2e%2e/docs/introduction','/docs/introduction%00'])assert.equal(trustedOriginalTarget({[meta]:{initURL:target}}),target);
});
