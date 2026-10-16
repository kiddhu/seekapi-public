import test from 'node:test';
import assert from 'node:assert/strict';
import { Fixture, demo, freeCall, modes } from './quickstart.mjs';
test('free discovery/prepare completes and stops before payment', async () => {
  const t = new Fixture(); const r = await demo(t);
  assert.equal(r.payment_effects, 0); assert.equal(r.provider_effects, 0);
  assert.equal(r.modes.image_x402, 'OFF'); assert.equal(r.draft_digest.length, 64);
  assert.deepEqual(t.calls, ['discover_china_supply_check_v0', 'prepare_china_supply_check_v0']);
});
test('purchase/run/pilot/private reads never reach transport', async () => {
  for (const name of ['purchase_china_supply_check_v0', 'run_china_supply_check_v0', 'invoke_product_keyword_search_v0', 'status_china_supply_check_v0']) {
    const t = new Fixture(); await assert.rejects(freeCall(t, name, {}), /EFFECT_BLOCKED/); assert.equal(t.calls.length, 0);
  }
});
test('missing free tool stops before calls', async () => {
  const t = new Fixture(); t.tools = []; await assert.rejects(demo(t), /MISSING_FREE_TOOL/); assert.equal(t.calls.length, 0);
});
test('unknown effect stops before prepare', async () => {
  const t = new Fixture(); t.discovery.tool_contracts = []; await assert.rejects(demo(t), /FREE_EFFECT_NOT_PROVEN/); assert.equal(t.calls.length, 1);
});
test('mode conflict stops before prepare', async () => {
  const t = new Fixture(); t.discovery.contract.payment.image_x402_live = true;
  await assert.rejects(demo(t), /CONFLICTING_MODE/); assert.equal(t.calls.length, 1);
});
test('missing mode remains unknown', () => {
  const t = new Fixture(); delete t.discovery.contract.payments.image_first.x402.status;
  assert.throws(() => modes(t.discovery), /UNKNOWN_MODE/);
});
test('side effects, missing confirmation and bad digest stop', async () => {
  for (const [key, value] of [['payment_effects', 1], ['provider_effects', 1], ['requires_exact_customer_confirmation', false], ['draft_digest', 'wrong']]) {
    const t = new Fixture(); t.prepared[key] = value; await assert.rejects(demo(t), /UNSAFE_PREPARE/); assert.equal(t.calls.length, 2);
  }
});
test('transport timeout is surfaced once without application retry', async () => {
  const t = new Fixture(); t.call = async name => { t.calls.push(name); throw Error('timeout'); };
  await assert.rejects(demo(t), /timeout/); assert.equal(t.calls.length, 1);
});
test('changed requirements go through new prepare, never purchase', async () => {
  const t = new Fixture(); const draft = structuredClone(t.draft); draft.quantity = 2000;
  await demo(t, draft); assert.equal(t.arguments[1].draft.quantity, 2000); assert.equal(t.calls.length, 2);
});
