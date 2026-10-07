import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const root = '.next/server/app/';
const origin = 'https://seekapi.ai';
const current = '/china-supply-check/sample';
const archive = current + '/archived-v4';
const html = route => read(root + (route === '/' ? 'index' : route.slice(1)) + '.html');
const decode = value => value.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
// Hydration data, comments and metadata cannot prove visible disclosures or anchors.
const content = value => value.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
const visible = value => decode(content(value).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const anchors = page => [...content(page).matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi)]
  .map(m => ({ href: decode(m[1] ?? m[2]), text: visible(m[3]) }));
const destination = href => {
  const url = new URL(href, origin);
  return { origin: url.origin, path: decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/' };
};
const isSample = href => destination(href).path === current || destination(href).path.startsWith(current + '/');
const isCurrent = href => destination(href).origin === origin && destination(href).path === current;
const isArchive = href => destination(href).path === archive;
function assertSurface(route, page, required = false) {
  const links = anchors(page);
  for (const link of links.filter(link => isSample(link.href))) {
    // The current report's explicitly historical provenance links are the sole exception.
    if (route === current && isArchive(link.href)) {
      assert.equal(destination(link.href).origin, origin);
      assert.match(link.text, /archived historical sample/i, route + ': archive link must be visibly historical');
    } else assert.ok(isCurrent(link.href), route + ': obsolete/noncanonical sample pointer ' + link.href);
  }
  if (required || links.some(link => isSample(link.href))) assert.ok(links.some(link => isCurrent(link.href)), route + ': missing current anchor');
}
function assertCurrentReport(page) {
  for (const pattern of [/REAL PRODUCTION PAID ACCEPTANCE EXAMPLE/, /INTERNAL_ACCEPTANCE/,
    /three evidence-backed China supplier candidates worth advancing to RFQ/i,
    /NOT_AVAILABLE_FROM_AUTHORIZED_PUBLIC_MATERIAL/, /not a customer testimonial/i]) assert.match(visible(page), pattern);
  assertSurface(current, page, true);
  assert.ok(anchors(page).some(link => isArchive(link.href)), 'missing historical provenance anchor');
}
function assertArchiveReport(page) {
  for (const pattern of [/ARCHIVED HISTORICAL EXAMPLE.*V4 prefix/i, /not a completed paid customer order/i,
    /preserved for provenance only/i]) assert.match(visible(page), pattern);
  assert.match(page, /<meta\b[^>]*name="robots"[^>]*content="noindex, follow"/);
  assertSurface(archive, page, true);
}
function assertMachine(value, label) {
  if (typeof value === 'string') {
    for (const m of value.matchAll(/(?:https?:\/\/[^\s"<>]+)?\/china-supply-check\/sample[^\s"<>]*/g))
      assert.ok(isCurrent(m[0]), label + ': obsolete/noncanonical sample pointer ' + m[0]);
  } else if (value && typeof value === 'object') for (const child of Object.values(value)) assertMachine(child, label);
}
function assertManifest(value) {
  assert.equal(value.provider, 'SeekAPI');
  assert.equal(value.product_data_mcp.endpoint, 'https://api.seekapi.ai/mcp');
  assert.equal(value.product_data_mcp.csc_public_paid_on, true);
  assert.equal(value.live_human_task_api, false);
  // No sample field exists today; guard any current/future nested sample pointers.
  assertMachine(value, 'agent-services.json');
}
function pages(directory = root) {
  return readdirSync(new URL('../' + directory, import.meta.url), { withFileTypes: true }).flatMap(entry => {
    const path = directory + entry.name;
    return entry.isDirectory() ? pages(path + '/') : entry.name.endsWith('.html') ? [path] : [];
  });
}
const routeOf = path => path.slice(root.length, -5) === 'index' ? '/' : '/' + path.slice(root.length, -5);
const manifest = () => JSON.parse(read(root + 'for-agents/agent-services.json.body'));

test('all generated discovery/product surfaces reject obsolete sample pointers', () => {
  const required = new Set(['/', '/for-agents', '/china-supply-check',
    ...['fasteners', 'packaging', 'connectors'].map(category => '/china-supply-check/' + category)]);
  let sourcingCount = 0;
  for (const path of pages()) {
    const route = routeOf(path), page = read(path);
    if (route === archive) { assertArchiveReport(page); continue; }
    const sourcing = route.startsWith('/sourcing/');
    assertSurface(route, page, required.has(route) || sourcing);
    if (sourcing) sourcingCount++;
    required.delete(route);
  }
  assert.deepEqual([...required], [], 'required routes must exist in generated output');
  assert.equal(sourcingCount, 8, 'all eight frozen procurement-intent routes must be checked');
});
test('rendered current/archive reports expose truthful disclosures and actual destinations', () => {
  assertCurrentReport(html(current));
  assertArchiveReport(html(archive));
  assert.doesNotMatch(read(root + 'sitemap.xml.body'), /archived-v4/);
});
test('built Agent manifest and served machine responses preserve current sample authority', async () => {
  assertManifest(manifest());
  // Read public assets through the built production server, not source scans.
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)],
    { cwd: new URL('../', import.meta.url), env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }, stdio: 'ignore' });
  const exited = once(server, 'exit');
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      assert.equal(server.exitCode, null, 'built server exited before response checks');
      try { ready = (await fetch('http://127.0.0.1:' + port + '/robots.txt', { signal: AbortSignal.timeout(500) })).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, 'built production server must start');
    const get = async path => {
      const response = await fetch('http://127.0.0.1:' + port + path, { signal: AbortSignal.timeout(5000) });
      assert.equal(response.status, 200, path);
      return response.text();
    };
    const servedManifest = JSON.parse(await get('/for-agents/agent-services.json'));
    assertManifest(servedManifest);
    assert.deepEqual(servedManifest, manifest());
    const llms = await get('/llms.txt');
    assert.ok(llms.includes('Public paid acceptance example: ' + origin + current));
    assertMachine(llms, 'llms.txt');
    const ard = JSON.parse(await get('/.well-known/ard.json'));
    assert.equal(ard.entries[0].data.sampleReport, origin + current);
    assertMachine(ard, 'ard.json');
  } finally {
    server.kill('SIGTERM');
    await exited;
  }
});
test('negative cases reject all archive URL forms on every current sample-bearing generated surface', () => {
  const obsolete = [archive, origin + archive, archive + '?view=current', archive + '#report', origin + archive + '?view=current#report'];
  let surfaces = 0;
  for (const path of pages()) {
    const route = routeOf(path), page = read(path);
    if (route === current || route === archive || !anchors(page).some(link => isCurrent(link.href))) continue;
    surfaces++;
    for (const href of obsolete) assert.throws(() => assertSurface(route,
      page + '<a href="' + href + '">View current sample</a>', true), /obsolete\/noncanonical sample pointer/);
  }
  assert.ok(surfaces >= 14, 'negative tests must exercise entry/category/intent surfaces');
  for (const href of obsolete) {
    assert.throws(() => assertSurface(current, html(current) + '<a href="' + href + '">View current sample</a>', true), /visibly historical/);
    assert.throws(() => assertManifest({ ...manifest(), sampleReport: href }), /obsolete\/noncanonical/);
    assert.throws(() => assertMachine({ nested: { sample: href } }, 'ARD fixture'), /obsolete\/noncanonical/);
    assert.throws(() => assertMachine('Public paid acceptance example: ' + href, 'llms fixture'), /obsolete\/noncanonical/);
  }
});
test('negative cases fail for missing rendered disclosures and anchors despite hydration text', () => {
  const sample = html(current), historical = html(archive);
  for (const phrase of ['INTERNAL_ACCEPTANCE', 'REAL PRODUCTION PAID ACCEPTANCE EXAMPLE', 'NOT_AVAILABLE_FROM_AUTHORIZED_PUBLIC_MATERIAL'])
    assert.throws(() => assertCurrentReport(content(sample).replaceAll(phrase, '') + '<script>' + phrase + '</script>'));
  assert.throws(() => assertArchiveReport(content(historical).replace(/ARCHIVED HISTORICAL EXAMPLE/gi, 'Current example')));
  assert.throws(() => assertArchiveReport(content(historical).replace(/not a completed paid customer order/gi, 'completed order')));
  assert.throws(() => assertArchiveReport(content(historical).replaceAll('href="' + current + '"', 'href="/china-supply-check"')));
  assert.throws(() => assertCurrentReport(content(sample).replaceAll('href="' + archive + '"', 'href="/china-supply-check"')));
  assert.throws(() => assertManifest({ ...manifest(), product_data_mcp: { ...manifest().product_data_mcp, csc_public_paid_on: false } }));
});
