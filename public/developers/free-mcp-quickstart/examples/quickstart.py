"""Free-only MCP example. Offline fixtures by default; --live uses official SDK."""
import argparse
import asyncio
import copy
import json
import re
from pathlib import Path

ENDPOINT = 'https://api.seekapi.ai/mcp'
FREE = frozenset({'discover_china_supply_check_v0', 'prepare_china_supply_check_v0'})
FIXTURES = Path(__file__).resolve().parent.parent / 'fixtures'

def modes(discovery):
    """Mode-specific observations, never an authorization to purchase."""
    c = discovery['contract']; p = c['payments']
    out = {'image_stripe': p['image_first']['stripe'].get('status'),
           'image_x402': p['image_first']['x402'].get('status'),
           'text_stripe': p['text_model_legacy']['stripe'].get('status'),
           'text_x402': p['text_model_legacy']['x402'].get('status')}
    if any(x not in ('LIVE', 'OFF') for x in out.values()):
        raise ValueError('UNKNOWN_MODE: re-read official discovery; no purchase')
    if c['payment'].get('image_x402_live') is not (out['image_x402'] == 'LIVE'):
        raise ValueError('CONFLICTING_MODE: no purchase')
    if c['payment'].get('x402_live') is not (out['text_x402'] == 'LIVE'):
        raise ValueError('CONFLICTING_MODE: no purchase')
    return out

async def free_call(transport, name, arguments):
    if name not in FREE:
        raise ValueError('EFFECT_BLOCKED: example supports discovery and prepare only')
    return await transport.call(name, arguments)

async def demo(transport, draft=None):
    available = await transport.list_tools()
    if not FREE.issubset(available):
        raise ValueError('MISSING_FREE_TOOL: inspect current tools/list')
    discovery = await free_call(transport, 'discover_china_supply_check_v0', {})
    matrix = modes(discovery)
    contracts = {t['name']: t.get('effect') for t in discovery.get('tool_contracts', [])}
    if any(contracts.get(n) != 'FREE_NO_EFFECT' for n in FREE):
        raise ValueError('FREE_EFFECT_NOT_PROVEN: stop before prepare')
    prepared = await free_call(transport, 'prepare_china_supply_check_v0',
                               {'draft': copy.deepcopy(draft if draft is not None else transport.draft)})
    if (type(prepared.get('payment_effects')) is not int or prepared['payment_effects'] != 0
        or type(prepared.get('provider_effects')) is not int or prepared['provider_effects'] != 0
        or prepared.get('requires_exact_customer_confirmation') is not True
        or not re.fullmatch(r'[a-f0-9]{64}', prepared.get('draft_digest', ''))):
        raise ValueError('UNSAFE_PREPARE: stop and reconcile; do not retry payment')
    return {'modes': matrix, 'draft_digest': prepared['draft_digest'],
            'payment_effects': 0, 'provider_effects': 0,
            'next_action': 'Review the exact server-prepared draft privately. STOP before purchase.',
            'sample_url': 'https://seekapi.ai/china-supply-check/sample.json'}

class Fixture:
    def __init__(self):
        data = json.loads((FIXTURES / 'free-journey.json').read_text())
        self.discovery = data['discovery']; self.prepared = data['prepared']; self.draft = data['draft']
        self.tools = list(FREE); self.calls = []; self.arguments = []
    async def list_tools(self): return self.tools
    async def call(self, name, arguments):
        self.calls.append(name); self.arguments.append(copy.deepcopy(arguments))
        return copy.deepcopy(self.discovery if name == 'discover_china_supply_check_v0' else self.prepared)

async def live():
    # No wallet/payment SDK, auth headers, arbitrary endpoint or paid fallback.
    from mcp import ClientSession
    from mcp.client.streamable_http import streamablehttp_client
    class SDK:
        draft = Fixture().draft
        def __init__(self, session): self.session = session
        async def list_tools(self):
            response = await self.session.list_tools()
            return [t.name for t in response.tools]
        async def call(self, name, arguments):
            response = await self.session.call_tool(name, arguments)
            if response.isError: raise ValueError('TOOL_ERROR: stop; inspect privately')
            if response.structuredContent is not None: return response.structuredContent
            return json.loads(next(c.text for c in response.content if c.type == 'text'))
    # This fixed synthetic connectivity check must not be counted as buyer demand.
    async with streamablehttp_client(ENDPOINT, headers={
        'User-Agent': 'SeekAPI-Developer-Readback/1.0 (+https://github.com/kiddhu/seekapi-public)',
        'x-seekapi-measurement-test': '1',
    }) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()  # SDK sends initialized notification.
            return await demo(SDK(session))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--live', action='store_true', help='Explicit free synthetic discover/prepare via official SDK')
    args = parser.parse_args()
    try:
        result = asyncio.run(asyncio.wait_for(live() if args.live else demo(Fixture()), timeout=30))
        print(json.dumps(result, indent=2))
    except Exception:
        # SDK exceptions can contain request details; do not print them to public logs.
        parser.exit(1, 'Free setup failed. Check connectivity/tool schema privately; do not pay or automatically retry.\n')
