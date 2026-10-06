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
    assert.doesNotMatch(page, new RegExp('href="' + archivedPath.replaceAll('/', '\\/')), route);
  }

  const llms = read('public/llms.txt');
  assert.match(llms, new RegExp('Public paid acceptance example: ' + currentUrl.replaceAll('/', '\\/')));
  assert.doesNotMatch(llms, /china-supply-check\/sample\/archived-v4/i);

  const ard = JSON.parse(read('public/.well-known/ard.json'));
  assert.equal(ard.entries[0].data.sampleReport, currentUrl);
  assert.doesNotMatch(JSON.stringify(ard), /china-supply-check\/sample\/archived-v4/i);

  for (const path of [
    'app/(english)/for-agents/page.tsx',
    'app/(english)/china-supply-check/page.tsx',
    'app/(english)/for-agents/agent-services.json/route.ts',
  ]) {
    assert.doesNotMatch(read(path), /china-supply-check\/sample\/archived-v4/i, path);
  }
});

test('current sample stays a truthful INTERNAL_ACCEPTANCE aggregate and labels the archive', () => {
  const sample = read('app/(english)/china-supply-check/sample/page.tsx');
  assert.match(sample, /REAL PRODUCTION PAID ACCEPTANCE EXAMPLE/);
  assert.match(sample, /INTERNAL_ACCEPTANCE/);
  assert.match(sample, /three evidence-backed China supplier candidates worth advancing to RFQ/i);
  assert.match(sample, /NOT_AVAILABLE_FROM_AUTHORIZED_PUBLIC_MATERIAL/);
  assert.match(sample, new RegExp('href="' + archivedPath.replaceAll('/', '\\/') + '"[^>]*>View the archived historical sample', 'i'));

  const archived = read('app/(english)/china-supply-check/sample/archived-v4/page.tsx');
  assert.match(archived, /ARCHIVED HISTORICAL EXAMPLE.*V4 prefix/i);
  assert.match(archived, /not a completed paid customer order/i);
});
