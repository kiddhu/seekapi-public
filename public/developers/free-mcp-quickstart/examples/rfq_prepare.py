#!/usr/bin/env python3
"""Prepare a sourcing requirement for free through the public SeekAPI MCP.

Requires mcp==1.30.0. Use --live to connect. Demo traffic is explicitly internal.
For a real buyer, add --intent with a private RFQ_AGENT_INTENT_V2 JSON file you
are allowed to share. This client stops before confirmation or payment.
"""
import argparse
import asyncio
import json
import os
from pathlib import Path

MCP_URL = 'https://api.seekapi.ai/mcp'
BUYER_URL = 'https://api.seekapi.ai/checkout/stripe/rfq'
FREE_TOOLS = {'discover_rfq_basic_v0', 'prepare_rfq_basic_v0'}


class ClientSetupError(ValueError):
    def __init__(self, code, message):
        super().__init__(message)
        self.code = code


INTENT_KEYS = {'schema_version', 'product', 'variant', 'description', 'quantity',
               'unit', 'destinationCountry', 'destinationPort', 'mustMatch',
               'matchPolicy', 'source_references', 'buyer_policy', 'asset_uploads',
               'default_retention_reference_ids', 'conflict_resolutions'}
DEMO = {
    'schema_version': 'RFQ_AGENT_INTENT_V2',
    'product': 'Industrial relay', 'variant': '24 V DC model',
    'description': 'Synthetic internal SDK acceptance; not a customer request.',
    'quantity': 100, 'unit': 'pieces',
    'destinationCountry': 'Netherlands', 'destinationPort': 'Rotterdam',
    'mustMatch': [{'attribute': 'coil voltage', 'expected': '24 V DC'}],
    'matchPolicy': 'EXACT_ONLY',
    'source_references': [{
        'reference_id': 'synthetic-spec',
        'reference_type': 'STRUCTURED_REQUIREMENT', 'role': 'SPEC_REFERENCE',
        'value': 'Industrial relay, 24 V DC coil, 100 pieces, exact requirement.',
        'provenance': 'BUYER_STATED',
    }],
    'buyer_policy': {'purpose': 'OTHER'},
}


def payload(result):
    value = getattr(result, 'structuredContent', None)
    if value is None:
        text = [c.text for c in result.content if getattr(c, 'type', None) == 'text']
        if len(text) != 1 or len(text[0].encode()) > 128 * 1024:
            raise ValueError('Unexpected or oversized MCP response')
        value = json.loads(text[0])
    if not isinstance(value, dict):
        raise ValueError('Expected one structured response')
    if len(json.dumps(value, ensure_ascii=False).encode()) > 128 * 1024:
        raise ValueError('Unexpected or oversized MCP response')
    return value


def read_intent(path):
    if path is None:
        return DEMO, True
    with Path(path).open('rb') as source:
        raw = source.read(48 * 1024 + 1)
    if len(raw) > 48 * 1024:
        raise ValueError('Intent exceeds the free MCP text input limit')
    value = json.loads(raw)
    if not isinstance(value, dict) or set(value) - INTENT_KEYS:
        raise ValueError('Use the canonical RFQ intent, without session or access fields')
    if value.get('schema_version') != 'RFQ_AGENT_INTENT_V2':
        raise ValueError('Expected RFQ_AGENT_INTENT_V2')
    if value.get('asset_uploads'):
        raise ValueError('Use the existing buyer form for images and files')
    # Reopening our saved example must not turn a demonstration into apparent
    # buyer traffic. This exact marker is part of the packaged demo, not an
    # identity classifier or telemetry added to a buyer's private requirement.
    return value, value.get('description') == DEMO['description']


def save_private_intent(path, value):
    if not isinstance(value, dict) or set(value) - INTENT_KEYS:
        raise ValueError('Refusing non-intent fields in the buyer handoff')
    if value.get('schema_version') != 'RFQ_AGENT_INTENT_V2' or value.get('asset_uploads'):
        raise ValueError('Expected a canonical text-only buyer intent')
    raw = (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()
    if len(raw) > 48 * 1024:
        raise ValueError('Handoff exceeds the text intent limit')
    # Never replace another private requirement or a symlink.
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'wb') as out:
        out.write(raw)


async def prepare(args):
    intent, demo = read_intent(args.intent)
    if args.output and Path(args.output).exists():
        raise ClientSetupError('OUTPUT_ALREADY_EXISTS',
                               'Choose a new output filename; your existing file is unchanged.')
    import httpx
    from mcp import ClientSession
    from mcp.client.streamable_http import streamable_http_client
    headers = {'x-seekapi-measurement-test': '1'} if demo else {}
    # Use the SDK's ordinary HTTPX client and TLS verification. No browser UA.
    async with httpx.AsyncClient(headers=headers, timeout=httpx.Timeout(20, read=30)) as client:
        async with streamable_http_client(MCP_URL, http_client=client) as (read, write, _):
            async with ClientSession(read, write) as session:
                await session.initialize()
                available = {t.name for t in (await session.list_tools()).tools}
                if not FREE_TOOLS <= available:
                    return {'status': 'MCP_RFQ_NOT_YET_AVAILABLE',
                            'buyer_free_entry': BUYER_URL, 'payment_actions': 0,
                            'prepare_calls': 0, 'automatic_retry': False,
                            'traffic': 'INTERNAL_DEMO' if demo else 'BUYER_SUPPLIED'}
                discovered = await session.call_tool('discover_rfq_basic_v0', {})
                current = payload(discovered)
                if discovered.isError or current.get('price') != {'currency': 'USD', 'cents': 1990}:
                    raise ValueError('Current Basic contract could not be verified')
                preparation = current.get('preparation', {})
                free_price = preparation.get('price')
                if (free_price != {'currency': 'USD', 'cents': 0}
                        or type(free_price.get('cents')) is not int
                        or current.get('price_applies_to') != 'RFQ_SERVICE_AFTER_BUYER_CONFIRMATION'
                        or current.get('requires_prior_screening_purchase') is not False):
                    raise ValueError('Free preparation and separate service price could not be verified')
                admission = current.get('admission_status')
                sales = current.get('public_sales')
                checkout = current.get('checkout_authorized')
                if (admission not in ('AVAILABLE', 'PAUSED') or type(sales) is not bool
                        or type(checkout) is not bool or sales != (admission == 'AVAILABLE')
                        or checkout != sales):
                    raise ValueError('Current sales admission could not be verified')
                # The canonical service keeps free previews available when new
                # purchases are paused. This client has no payment operation.
                if admission == 'PAUSED' and preparation.get('allowed_when_new_purchases_paused') is not True:
                    raise ValueError('Free preparation during paused purchases could not be verified')
                result = await session.call_tool('prepare_rfq_basic_v0', {'draft': intent})
                value = payload(result)
                if result.isError:
                    retry = value.get('retry_after_seconds')
                    hint = 'SERVER_RESPONSE'
                    if type(retry) is not int or not 1 <= retry <= 86400:
                        retry, hint = None, None
                    if retry is None and value.get('code') == 'RFQ_RATE_LIMITED':
                        retry, hint = 300, 'CONSERVATIVE_MANUAL_GUIDANCE'
                    return {'status': 'NOT_PREPARED', 'code': value.get('code', 'UNKNOWN'),
                            'retry_after_seconds': retry, 'retry_guidance_source': hint,
                            'admission_status': admission, 'payment_available': checkout,
                            'buyer_free_entry': BUYER_URL, 'automatic_retry': False,
                            'payment_actions': 0, 'prepare_calls': 1}
                if value.get('schema_version') != 'rfq.basic-mcp-prepare.v1':
                    raise ValueError('Unexpected free preparation contract')
                for key in ['order_effects', 'supplier_contact_effects', 'payment_effects', 'provider_effects']:
                    if type(value.get(key)) is not int or value[key] != 0:
                        raise ValueError('Unexpected effect declaration')
                if value.get('prepared_receipt_exposed') is not False:
                    raise ValueError('Unexpected signed-preparation exposure')
                state = value.get('status')
                if state not in ['READY', 'NEEDS_CLARIFICATION', 'ELIGIBILITY_REVIEW_REQUIRED']:
                    raise ValueError('Unexpected requirement state')
                report = {'status': state, 'payment_actions': 0, 'prepare_calls': 1,
                          'admission_status': admission, 'payment_available': checkout,
                          'automatic_retry': False,
                          'missing_fields': value.get('missing_fields', []),
                          'buyer_free_entry': BUYER_URL,
                          'traffic': 'INTERNAL_DEMO' if demo else 'BUYER_SUPPLIED'}
                if state == 'READY' and args.output:
                    handoff = value.get('handoff', {})
                    if handoff.get('continuation_url') != BUYER_URL:
                        raise ValueError('Unexpected buyer continuation destination')
                    save_private_intent(args.output, handoff.get('import_intent'))
                    report['private_intent_saved'] = True
                    report['next_action'] = (
                        'Import that private JSON into the buyer form; review, confirm and pay there.'
                        if checkout else
                        'Import that private JSON into the buyer form for free review. New purchases are currently paused.')
                return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--live', action='store_true', help='Connect for free discovery and preparation; never confirm or pay')
    parser.add_argument('--intent', help='Private buyer intent JSON; omit for the internal synthetic demo')
    parser.add_argument('--output', help='New private JSON handoff path; written only for READY')
    args = parser.parse_args()
    if not args.live:
        parser.print_help()
        return 0
    try:
        result = asyncio.run(asyncio.wait_for(prepare(args), timeout=70))
    except ClientSetupError as error:
        print(json.dumps({'status': 'SETUP_FAILED', 'code': error.code,
                          'message': str(error), 'automatic_retry': False,
                          'payment_actions': 0}))
        return 2
    except Exception:
        # SDK exceptions can include private arguments. Do not print them.
        print(json.dumps({'status': 'SETUP_OR_TRANSPORT_FAILED',
                          'buyer_free_entry': BUYER_URL,
                          'automatic_retry': False, 'payment_actions': 0}))
        return 2
    print(json.dumps(result, ensure_ascii=False))
    return 0 if result['status'] == 'READY' else 2


if __name__ == '__main__':
    raise SystemExit(main())
