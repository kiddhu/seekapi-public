import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const buildRoot = '.next/server/app/';
const html = route => readFileSync(new URL('../' + buildRoot + (route === '/' ? 'index' : route.slice(1)) + '.html', import.meta.url), 'utf8');
const hrefs = page => [...page.matchAll(/href="([^"]+)"/g)].map(match => match[1].replace(/&amp;/g, '&'));
const currentPath = '/china-supply-check/sample';
const archivedPath = '/china-supply-check/sample/archived-v4';
const currentUrl = 'https://seekapi.ai' + currentPath;

test('current public and Agent entry surfaces point to the authorized sample, never archived V4', () => {
  for (const route of ['/', '/for-agents', '/china-supply-check']) {
    const page = html(route);
    assert.ok(hrefs(page).includes(currentPath), route + ' must expose the current sample');
    assert.ok(!hrefs(page).includes(archivedPath), route + ' must not make archived V4 a current pointer');
  }

  const llms = read('public/llms.txt');
  assert.ok(llms.includes('Public paid acceptance example: ' + currentUrl));
  assert.ok(!llms.includes(archivedPath));

  const ard = JSON.parse(read('public/.well-known/ard.json'));
  assert.equal(ard.entries[0].data.sampleReport, currentUrl);
  assert.ok(!JSON.stringify(ard).includes(archivedPath));

  const agentManifest = read('app/(english)/for-agents/agent-services.json/route.ts');
  assert.ok(!agentManifest.includes(archivedPath));
  for (const path of [
    'app/(english)/for-agents/page.tsx',
    'app/(english)/china-supply-check/page.tsx',
  ]) {
    assert.ok(!read(path).includes(archivedPath), path + ' must not point Agents or customers to archived V4');
  }
});

test('current sample stays a truthful INTERNAL_ACCEPTANCE aggregate and labels the archive', () => {
  const sample = read('app/(english)/china-supply-check/sample/page.tsx');
  assert.match(sample, /REAL PRODUCTION PAID ACCEPTANCE EXAMPLE/);
  assert.match(sample, /INTERNAL_ACCEPTANCE/);
  assert.match(sample, /three evidence-backed China supplier candidates worth advancing to RFQ/i);
  assert.match(sample, /NOT_AVAILABLE_FROM_AUTHORIZED_PUBLIC_MATERIAL/);
  assert.ok(hrefs(sample).includes(archivedPath), 'current sample must identify the archive by its historical route');

  const archived = read('app/(english)/china-supply-check/sample/archived-v4/page.tsx');
  assert.match(archived, /ARCHIVED HISTORICAL EXAMPLE.*V4 prefix/i);
  assert.match(archived, /not a completed paid customer order/i);
  assert.ok(hrefs(archived).includes(currentPath), 'archive must point readers back to the current sample');
});
