import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../app/(english)/trade-supply/page.tsx', import.meta.url), 'utf8');

test('trade-supply draft remains noindex until controlled launch', () => {
  assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.match(page, /Feasibility programme/);
  assert.match(page, /No manufacturing order, fixed delivery price or technical compliance approval/);
});

test('trade-supply draft preserves canonical paid-product distinctions', () => {
  assert.match(page, /China Supply Check · USD 2\.99/);
  assert.match(page, /Verified RFQ Basic · USD 19\.90/);
  assert.match(page, /href="\/china-supply-check"/);
  assert.match(page, /href="\/china-supply-check\/live-rfq-compare"/);
  assert.match(page, /does not include custom engineering or the purchase of goods/);
});

test('trade-supply lead path does not falsely claim form submission or secure file upload', () => {
  assert.match(page, /href="\/start\?audience=company"/);
  assert.match(page, /creates an email draft for you to review and send/);
  assert.match(page, /private drawings are not accepted/);
  assert.match(page, /who is responsible|responsibilities|local team/i);
});
