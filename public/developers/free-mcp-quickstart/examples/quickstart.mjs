/** Offline by default. --live uses the official MCP SDK and two free tools only. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const ENDPOINT = 'https://api.seekapi.ai/mcp';
const FREE = Object.freeze(['discover_china_supply_check_v0', 'prepare_china_supply_check_v0']);
export function modes(d) {
  const p = d.contract.payments;
  const m = { image_stripe: p.image_first.stripe.status, image_x402: p.image_first.x402.status,
    text_stripe: p.text_model_legacy.stripe.status, text_x402: p.text_model_legacy.x402.status };
  if (Object.values(m).some(x => !['LIVE', 'OFF'].includes(x))) throw Error('UNKNOWN_MODE: no purchase');
  if (d.contract.payment.image_x402_live !== (m.image_x402 === 'LIVE') ||
      d.contract.payment.x402_live !== (m.text_x402 === 'LIVE')) throw Error('CONFLICTING_MODE: no purchase');
  return m;
}
export async function freeCall(t, name, args) {
  if (!FREE.includes(name)) throw Error('EFFECT_BLOCKED: discovery and prepare only');
  return t.call(name, args);
}
export async function demo(t, draft = t.draft) {
  const tools = await t.listTools();
  if (FREE.some(n => !tools.includes(n))) throw Error('MISSING_FREE_TOOL');
  const d = await freeCall(t, FREE[0], {}); const matrix = modes(d);
  if (FREE.some(n => !d.tool_contracts?.some(x => x.name === n && x.effect === 'FREE_NO_EFFECT')))
    throw Error('FREE_EFFECT_NOT_PROVEN');
  const p = await freeCall(t, FREE[1], { draft: structuredClone(draft) });
  if (p.payment_effects !== 0 || p.provider_effects !== 0 || p.requires_exact_customer_confirmation !== true ||
      typeof p.draft_digest !== 'string' || !/^[a-f0-9]{64}$/.test(p.draft_digest)) throw Error('UNSAFE_PREPARE');
  return { modes: matrix, draft_digest: p.draft_digest, payment_effects: 0, provider_effects: 0,
    next_action: 'Review the exact server-prepared draft privately. STOP before purchase.',
    sample_url: 'https://seekapi.ai/china-supply-check/sample.json' };
}
export class Fixture {
  constructor() {
    const d = JSON.parse(readFileSync(new URL('../fixtures/free-journey.json', import.meta.url), 'utf8'));
    Object.assign(this, d); this.tools = [...FREE]; this.calls = []; this.arguments = [];
  }
  async listTools() { return this.tools; }
  async call(name, args) {
    this.calls.push(name); this.arguments.push(structuredClone(args));
    return structuredClone(name === FREE[0] ? this.discovery : this.prepared);
  }
}
async function live() {
  const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
  const { StreamableHTTPClientTransport } = await import('@modelcontextprotocol/sdk/client/streamableHttp.js');
  const client = new Client({ name: 'seekapi-free-developer-example', version: '1.0.0' }, { capabilities: {} });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  const transport = new StreamableHTTPClientTransport(new URL(ENDPOINT), {
    // The brief is synthetic: exclude this connectivity check from buyer demand.
    requestInit: { headers: {
      'User-Agent': 'SeekAPI-Developer-Readback/1.0 (+https://github.com/kiddhu/seekapi-public)',
      'x-seekapi-measurement-test': '1',
    } },
    fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.any([controller.signal, ...(init?.signal ? [init.signal] : [])]) }),
  });
  try {
    await client.connect(transport); // Official SDK initialize -> initialized.
    return await demo({ draft: new Fixture().draft,
      listTools: async () => (await client.listTools()).tools.map(t => t.name),
      call: async (name, args) => {
        const r = await client.callTool({ name, arguments: args });
        if (r.isError) throw Error('TOOL_ERROR');
        return r.structuredContent ?? JSON.parse(r.content.find(c => c.type === 'text').text);
      },
    });
  } finally { clearTimeout(timer); await client.close(); }
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.slice(2).some(a => a !== '--live')) { console.error('Only --live is supported.'); process.exitCode = 1; }
  else try { console.log(JSON.stringify(await (process.argv.includes('--live') ? live() : demo(new Fixture())), null, 2)); }
  catch { console.error('Free setup failed. Check connectivity/tool schema privately; do not pay or automatically retry.'); process.exitCode = 1; }
}
