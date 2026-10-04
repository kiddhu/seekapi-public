import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = path => readFileSync(new URL('../'+path, import.meta.url), 'utf8');
const current = ['app/(english)/china-supply-check/page.tsx', 'app/(english)/china-supply-check/fasteners/page.tsx', 'app/(english)/china-supply-check/connectors/page.tsx', 'app/(english)/china-supply-check/moq-specification-screening/page.tsx', 'app/(english)/for-agents/page.tsx', 'public/.well-known/ard.json'];
test('current linked CSC routes preserve paid-on and card-not-live truth', () => {
 for (const path of current) {
  const body = source(path);
  assert.doesNotMatch(body, /no paid run(?: or supplier contact)? is public|no paid run or supplier contact is public|verified_company.*false|verified_manufacturer.*false|claimCeiling|aion-governance/i, path);
 }
 for (const path of current.slice(1,3)) {
  assert.match(source(path), /live via x402 at 2.99 USDC/, path);
  assert.match(source(path), /Stripe Checkout USD 2.99 is being enabled/, path);
 }
});
test('supplier RFQ-worthiness never implies three exact product-qualified offers', () => {
 for (const path of [current[0],current[1],current[3]]) {
  assert.match(source(path), /Supplier RFQ-worthiness and exact product qualification are separate/, path);
  assert.doesNotMatch(source(path), /Screen for three distinct platform shops only when hard specs and quantity are supported|completed report has three qualified candidates|missing mandatory evidence and near misses/, path);
 }
});
test('default acceptance summary is aggregate and historical candidate rows stay separate', () => {
 const summary = source('app/(english)/china-supply-check/sample/page.tsx');
 assert.match(summary, /INTERNAL_ACCEPTANCE/);
 assert.match(summary, /2.99 USDC/);
 assert.match(summary, /sample\/archived-v4/);
 assert.doesNotMatch(summary, /0x[0-9a-fA-F]{40}|b2b-[0-9]+|offer:|aion-governance/);
 assert.match(source('app/(english)/china-supply-check/sample/archived-v4/page.tsx'), /ARCHIVED/);
});
