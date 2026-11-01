"""Exercise both real pinned SDKs against a loopback MCP fixture; no public calls.

Install the example requirements and npm lock first, then run this file directly.
The ordinary dependency-free test_*.py suite remains separate.
"""
import argparse
import asyncio
import contextlib
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
import stat
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

import quickstart
import rfq_prepare

HERE = Path(__file__).resolve().parent


class MCPFixture(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, *_args):
        pass

    def reply(self, status, payload=None):
        body = b'' if payload is None else json.dumps(payload).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        self.reply(405)

    def do_DELETE(self):
        self.reply(204)

    def do_POST(self):
        length = int(self.headers.get('Content-Length', '0'))
        if self.path != '/mcp' or not 0 < length <= 100_000:
            self.reply(400)
            return
        request = json.loads(self.rfile.read(length))
        method = request.get('method')
        params = request.get('params', {})
        self.server.observed.append({
            'method': method, 'tool': params.get('name'),
            'internal_marker': self.headers.get('x-seekapi-measurement-test'),
            'user_agent': self.headers.get('User-Agent'),
            'sensitive_header_present': any(self.headers.get(k) for k in
                ['Authorization', 'Cookie', 'Payment-Signature', 'X-Payment']),
        })
        if 'id' not in request:
            self.reply(202)
            return
        if method == 'initialize':
            result = {'protocolVersion': params['protocolVersion'],
                      'capabilities': {'tools': {'listChanged': False}},
                      'serverInfo': {'name': 'loopback-free-fixture', 'version': '1'}}
        elif method == 'tools/list':
            names = (rfq_prepare.FREE_TOOLS if self.server.rfq_case not in (None, 'MISSING')
                     else quickstart.FREE)
            result = {'tools': [{'name': name, 'description': 'Free fixture tool',
                                'inputSchema': {'type': 'object'}} for name in sorted(names)]}
        elif (method == 'tools/call' and self.server.rfq_case is not None
              and params.get('name') in rfq_prepare.FREE_TOOLS):
            if params['name'] == 'discover_rfq_basic_v0':
                paused = self.server.rfq_case in ('PAUSED', 'PAUSED_FREE_DISABLED')
                value = {'schema_version': 'rfq.basic-mcp-discovery.v1',
                         'price': {'currency': 'USD', 'cents': 1990},
                         'price_applies_to': 'RFQ_SERVICE_AFTER_BUYER_CONFIRMATION',
                         'preparation': {'price': {'currency': 'USD', 'cents': 0},
                                         'allowed_when_new_purchases_paused': True},
                         'requires_prior_screening_purchase': False,
                         'public_sales': not paused,
                         'checkout_authorized': not paused,
                         'admission_status': 'PAUSED' if paused else 'AVAILABLE'}
                if self.server.rfq_case == 'PAID_PREPARATION':
                    value['preparation']['price']['cents'] = 1990
                if self.server.rfq_case == 'BOOLEAN_PREPARATION_PRICE':
                    value['preparation']['price']['cents'] = False
                if self.server.rfq_case == 'SCREENING_REQUIRED':
                    value['requires_prior_screening_purchase'] = True
                if self.server.rfq_case == 'WRONG_PRICE_SCOPE':
                    value['price_applies_to'] = 'PREPARATION'
                if self.server.rfq_case == 'PAUSED_FREE_DISABLED':
                    value['preparation']['allowed_when_new_purchases_paused'] = False
            elif self.server.rfq_case in ('RATE_LIMITED', 'RATE_LIMITED_NO_HINT'):
                value = {'schema_version': 'rfq.basic-mcp-error.v1', 'status': 'UNKNOWN',
                         'code': 'RFQ_RATE_LIMITED'}
                if self.server.rfq_case == 'RATE_LIMITED':
                    value['retry_after_seconds'] = 300
            else:
                value = {'schema_version': 'rfq.basic-mcp-prepare.v1', 'status': 'READY',
                         'order_effects': 0, 'payment_effects': 0,
                         'supplier_contact_effects': 0, 'provider_effects': 0,
                         'prepared_receipt_exposed': False,
                         'handoff': {'continuation_url': rfq_prepare.BUYER_URL,
                                     'import_intent': params['arguments']['draft'], 'private': True}}
                if self.server.rfq_case == 'INVALID_EFFECT':
                    value['payment_effects'] = False
            result = {'content': [{'type': 'text', 'text': json.dumps(value)}],
                      'structuredContent': value,
                      'isError': self.server.rfq_case in ('RATE_LIMITED', 'RATE_LIMITED_NO_HINT')
                                 and params['name'] == 'prepare_rfq_basic_v0'}
        elif method == 'tools/call' and params.get('name') in quickstart.FREE:
            f = quickstart.Fixture()
            value = f.discovery if params['name'] == 'discover_china_supply_check_v0' else f.prepared
            result = {'content': [{'type': 'text', 'text': json.dumps(value)}],
                      'structuredContent': value, 'isError': False}
        else:
            self.reply(400)
            return
        self.reply(200, {'jsonrpc': '2.0', 'id': request['id'], 'result': result})


class SDKWireTests(unittest.TestCase):
    def setUp(self):
        self.server = ThreadingHTTPServer(('127.0.0.1', 0), MCPFixture)
        self.server.daemon_threads = True
        self.server.observed = []
        self.server.rfq_case = None
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.origin = f'http://127.0.0.1:{self.server.server_port}'

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=2)

    def assert_wire_boundary(self, result):
        self.assertEqual(result['payment_effects'], 0)
        self.assertEqual(result['provider_effects'], 0)
        self.assert_marked_requests(['discover_china_supply_check_v0', 'prepare_china_supply_check_v0'])

    def assert_marked_requests(self, expected_tools):
        rows = self.server.observed
        self.assertIn('initialize', [r['method'] for r in rows])
        self.assertIn('notifications/initialized', [r['method'] for r in rows])
        self.assertEqual([r['tool'] for r in rows if r['method'] == 'tools/call'],
                         expected_tools)
        self.assertTrue(rows)
        for row in rows:
            self.assertEqual(row['internal_marker'], '1',
                             f"synthetic {row['method']} reached HTTP without its exclusion marker")
            self.assertFalse(row['sensitive_header_present'])

    def test_python_sdk_marks_initialize_and_free_prepare_on_actual_http(self):
        # Only the test substitutes loopback. The shipped endpoint stays fixed.
        with patch.object(quickstart, 'ENDPOINT', self.origin + '/mcp'), \
             patch.dict(os.environ, {'NO_PROXY': '*', 'no_proxy': '*'}):
            result = asyncio.run(asyncio.wait_for(quickstart.live(), timeout=15))
        self.assert_wire_boundary(result)
        self.assertTrue(all(row['user_agent'].startswith('python-httpx/')
                            for row in self.server.observed))

    def test_node_cli_sdk_marks_initialize_and_free_prepare_on_actual_http(self):
        node = shutil.which('node')
        self.assertIsNotNone(node, 'Node 22+ is required for this integration test')
        # A test-only import redirects the fixed public URL to this fixture.
        # No production URL can reach the network, and no user environment is copied.
        run = subprocess.run([node, '--import', str(HERE / 'sdk_wire_redirect.mjs'),
                              str(HERE / 'quickstart.mjs'), '--live'],
                             env={'PATH': os.defpath, 'LANG': 'C.UTF-8',
                                  'TASK_MCP_WIRE_ORIGIN': self.origin},
                             capture_output=True, text=True, timeout=20)
        self.assertEqual(run.returncode, 0, run.stderr[-1200:])
        self.assert_wire_boundary(json.loads(run.stdout))


    def rfq_call(self, case, output, intent=None):
        self.server.rfq_case = case
        with patch.object(rfq_prepare, 'MCP_URL', self.origin + '/mcp'), \
             patch.dict(os.environ, {'NO_PROXY': '*', 'no_proxy': '*'}):
            return asyncio.run(asyncio.wait_for(rfq_prepare.prepare(
                argparse.Namespace(intent=intent, output=output)), timeout=15))

    def assert_contract_error(self, error, message):
        # AnyIO may wrap the client's ValueError in nested task-group errors.
        # Check the cause rather than accepting an unrelated transport failure.
        pending, leaves = [error], []
        while pending:
            item = pending.pop()
            children = getattr(item, 'exceptions', None)
            if isinstance(children, (list, tuple)):
                pending.extend(children)
            else:
                leaves.append(item)
        self.assertTrue(leaves)
        self.assertTrue(all(isinstance(item, ValueError) for item in leaves))
        self.assertTrue(all(str(item) == message for item in leaves))

    def test_rfq_reopened_demo_file_remains_excluded_without_telemetry_in_the_handoff(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'saved-example.json'
            output = Path(directory) / 'review.json'
            source.write_text(json.dumps(rfq_prepare.DEMO))
            result = self.rfq_call('READY', str(output), str(source))
            self.assertEqual(result['status'], 'READY')
            self.assertEqual(result['traffic'], 'INTERNAL_DEMO')
            self.assertEqual(json.loads(output.read_text()), rfq_prepare.DEMO)
        self.assert_marked_requests(['discover_rfq_basic_v0', 'prepare_rfq_basic_v0'])

    def test_rfq_buyer_supplied_intent_is_not_classified_as_the_packaged_demo(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'private-buyer.json'
            draft = {**rfq_prepare.DEMO, 'description': 'Fictional buyer-input fixture; loopback only.'}
            source.write_text(json.dumps(draft))
            result = self.rfq_call('READY', None, str(source))
            self.assertEqual(result['status'], 'READY')
            self.assertEqual(result['traffic'], 'BUYER_SUPPLIED')
        self.assertEqual([r['tool'] for r in self.server.observed if r['method'] == 'tools/call'],
                         ['discover_rfq_basic_v0', 'prepare_rfq_basic_v0'])
        self.assertTrue(all(r['internal_marker'] is None and not r['sensitive_header_present']
                            for r in self.server.observed))

    def test_rfq_sdk_exports_the_same_private_buyer_intent_and_only_calls_free_tools(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'buyer-requirement.json'
            result = self.rfq_call('READY', str(output))
            self.assertEqual(result['status'], 'READY')
            self.assertEqual(result['payment_actions'], 0)
            self.assertEqual(result['prepare_calls'], 1)
            self.assertEqual(stat.S_IMODE(output.stat().st_mode), 0o600)
            value = json.loads(output.read_text())
            self.assertEqual(value['source_references'], rfq_prepare.DEMO['source_references'])
            self.assertFalse({'access', 'receipt', 'session', 'prepared'} & value.keys())
        self.assert_marked_requests(['discover_rfq_basic_v0', 'prepare_rfq_basic_v0'])
        self.assertTrue(all(row['user_agent'].startswith('python-httpx/')
                            for row in self.server.observed))

    def test_rfq_checks_free_price_and_no_screening_prerequisite_before_prepare(self):
        for case in ['PAID_PREPARATION', 'BOOLEAN_PREPARATION_PRICE', 'SCREENING_REQUIRED', 'WRONG_PRICE_SCOPE']:
            with self.subTest(case=case):
                self.server.observed.clear()
                with tempfile.TemporaryDirectory() as directory:
                    output = Path(directory) / 'buyer-requirement.json'
                    with self.assertRaises(Exception) as caught:
                        self.rfq_call(case, str(output))
                    self.assert_contract_error(caught.exception,
                                               'Free preparation and separate service price could not be verified')
                    self.assertFalse(output.exists())
                self.assert_marked_requests(['discover_rfq_basic_v0'])

    def test_rfq_paused_preparation_needs_the_explicit_free_permission(self):
        with self.assertRaises(Exception) as caught:
            self.rfq_call('PAUSED_FREE_DISABLED', None)
        self.assert_contract_error(caught.exception,
                                   'Free preparation during paused purchases could not be verified')
        self.assert_marked_requests(['discover_rfq_basic_v0'])

    def test_rfq_paused_sales_keeps_free_preparation_and_private_brief_without_payment(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'buyer-requirement.json'
            result = self.rfq_call('PAUSED', str(output))
            self.assertEqual(result['status'], 'READY')
            self.assertEqual(result['prepare_calls'], 1)
            self.assertEqual(result['admission_status'], 'PAUSED')
            self.assertIs(result['payment_available'], False)
            self.assertEqual(result['payment_actions'], 0)
            self.assertIn('currently paused', result['next_action'])
            self.assertEqual(stat.S_IMODE(output.stat().st_mode), 0o600)
        self.assert_marked_requests(['discover_rfq_basic_v0', 'prepare_rfq_basic_v0'])

    def test_rfq_rate_limit_returns_retry_time_without_retry_or_output(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'buyer-requirement.json'
            result = self.rfq_call('RATE_LIMITED', str(output))
            self.assertEqual(result['status'], 'NOT_PREPARED')
            self.assertEqual(result['retry_after_seconds'], 300)
            self.assertEqual(result['retry_guidance_source'], 'SERVER_RESPONSE')
            self.assertFalse(result['automatic_retry'])
            self.assertFalse(output.exists())
        self.assert_marked_requests(['discover_rfq_basic_v0', 'prepare_rfq_basic_v0'])

    def test_rfq_shared_rate_limit_without_hint_preserves_input_and_suggests_manual_wait(self):
        original = json.loads(json.dumps(rfq_prepare.DEMO))
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'buyer-requirement.json'
            result = self.rfq_call('RATE_LIMITED_NO_HINT', str(output))
            self.assertEqual(result['code'], 'RFQ_RATE_LIMITED')
            self.assertEqual(result['retry_after_seconds'], 300)
            self.assertEqual(result['retry_guidance_source'], 'CONSERVATIVE_MANUAL_GUIDANCE')
            self.assertFalse(result['automatic_retry'])
            self.assertFalse(output.exists())
            self.assertEqual(rfq_prepare.DEMO, original)
        self.assert_marked_requests(['discover_rfq_basic_v0', 'prepare_rfq_basic_v0'])

    def test_rfq_boolean_effect_is_rejected_before_private_export(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'buyer-requirement.json'
            with self.assertRaises(Exception):
                self.rfq_call('INVALID_EFFECT', str(output))
            self.assertFalse(output.exists())
        self.assert_marked_requests(['discover_rfq_basic_v0', 'prepare_rfq_basic_v0'])

    def test_rfq_missing_tools_gives_the_original_buyer_form_without_prepare(self):
        result = self.rfq_call('MISSING', None)
        self.assertEqual(result['status'], 'MCP_RFQ_NOT_YET_AVAILABLE')
        self.assertEqual(result['buyer_free_entry'], rfq_prepare.BUYER_URL)
        self.assertEqual(result['prepare_calls'], 0)
        self.assert_marked_requests([])

    def test_rfq_cli_requires_explicit_live_and_sends_no_request_by_default(self):
        process = subprocess.run([sys.executable, str(HERE / 'rfq_prepare.py')],
                                 capture_output=True, text=True, timeout=5)
        self.assertEqual(process.returncode, 0)
        self.assertIn('--live', process.stdout)
        self.assertEqual(self.server.observed, [])

    def test_rfq_existing_private_file_reports_recovery_before_any_network_request(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'buyer-requirement.json'
            private_bytes = b'Private existing requirement; preserve this file.'
            output.write_bytes(private_bytes)
            stdout = io.StringIO()
            with patch.object(rfq_prepare, 'MCP_URL', self.origin + '/mcp'), \
                 patch.object(sys, 'argv', ['rfq_prepare.py', '--live', '--output', str(output)]), \
                 contextlib.redirect_stdout(stdout):
                exit_code = rfq_prepare.main()
            self.assertEqual(exit_code, 2)
            self.assertEqual(json.loads(stdout.getvalue())['code'], 'OUTPUT_ALREADY_EXISTS')
            self.assertNotIn(str(output), stdout.getvalue())
            self.assertNotIn(private_bytes.decode(), stdout.getvalue())
            self.assertEqual(output.read_bytes(), private_bytes)
            self.assertEqual(self.server.observed, [])


if __name__ == '__main__':
    unittest.main()
