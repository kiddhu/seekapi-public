import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const guides = JSON.parse(read('data/sourcing-decisions.json'));
const buyerEntry = JSON.parse(read('public/.well-known/csc-commercial-truth.json')).live_rfq.endpoint;
const agentEntry = '/for-agents#rfq-free-mcp';
const contract = read('lib/rfq-basic-copy.ts').match(/export const rfqBasicCopy = '([^']+)';/)[1];
const stripHidden = value => value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, ' ');
const visible = value => stripHidden(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

test('existing decision worksheets route current-quote intent to free RFQ and keep screening optional', () => {
  assert.equal(guides.length, 10);
  for (const guide of guides) {
    assert.equal(guide.human_action, buyerEntry, guide.canonical_path);
    assert.equal(guide.machine_action, agentEntry, guide.canonical_path);
    const html = stripHidden(read('.next/server/app' + guide.canonical_path + '.html'));
    const start = html.indexOf('<h2>Need a current supplier quote for this requirement?</h2>');
    assert.ok(start >= 0, guide.canonical_path);
    const tail = html.slice(start);
    const end = tail.indexOf('</section>');
    assert.ok(end >= 0, guide.canonical_path + ': CTA section must close');
    const section = tail.slice(0, end);
    const buttons = [...section.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
      .filter(([, attributes]) => (attributes.match(/\bclass="([^"]*)"/)?.[1] ?? '').split(/\s+/).includes('button'))
      .map(([, attributes, label]) => ({href: attributes.match(/\bhref="([^"]*)"/)?.[1], text: visible(label)}));
    assert.deepEqual(buttons.map(button => button.href), [buyerEntry, agentEntry], guide.canonical_path);
    assert.ok(buttons.every(button => /RFQ/.test(button.text) && /free/.test(button.text)), guide.canonical_path);
    assert.match(visible(section), /Prefer a shortlist first\?.*optional USD 2\.99 supplier screening/);
    assert.ok(section.includes('href="/china-supply-check#image-supply-check"'), guide.canonical_path);
    assert.ok(section.includes('href="/for-agents#china-supply-check-mcp"'), guide.canonical_path);
    const markdown = read('public' + guide.canonical_path + '.md');
    assert.ok(markdown.includes('[Prepare my RFQ for free](' + buyerEntry + ')'), guide.canonical_path);
    assert.ok(markdown.includes('[Agent: prepare a free RFQ with MCP](' + agentEntry + ')'), guide.canonical_path);
    assert.ok(markdown.includes(contract), guide.canonical_path);
    assert.ok(markdown.includes('[Review optional USD 2.99 supplier screening](/china-supply-check#image-supply-check)'), guide.canonical_path);
  }
});

test('the strict screening example stays separate from the current RFQ schema and buyer destination', () => {
  const brief = guides.find(guide => guide.id === 'brief');
  const html = stripHidden(read('.next/server/app' + brief.canonical_path + '.html'));
  const text = visible(html);
  assert.match(text, /strict fields and example.*optional China Supply Check screening/);
  assert.match(text, /RFQ uses RFQ_AGENT_INTENT_V2 and needs a destination confirmed by the buyer/);
  assert.match(text, /Minimum buyer brief for optional screening/);
  assert.match(text, /Optional screening text input/);
  assert.match(text, /For this screening draft only, destination/);
  assert.match(text, /Optional screening: exclude or resolve/);
  const match = html.match(/<pre\b[^>]*id="buyer-brief-example"[^>]*>([\s\S]*?)<\/pre>/);
  assert.ok(match, 'The visible screening payload example must remain.');
  const decoded = match[1].replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
  assert.deepEqual(JSON.parse(decoded), brief.example);
  const markdown = read('public' + brief.canonical_path + '.md');
  assert.match(markdown, /### Optional screening text fields/);
  assert.match(markdown, /RFQ uses RFQ_AGENT_INTENT_V2 and needs a destination confirmed by the buyer/);
  assert.ok(markdown.includes('[prepare a free RFQ using its current MCP schema and Python SDK](' + agentEntry + ')'));
});
