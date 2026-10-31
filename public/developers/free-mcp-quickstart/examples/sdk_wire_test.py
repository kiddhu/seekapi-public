"""Exercise both real pinned SDKs against a loopback MCP fixture; no public calls.

Install the example requirements and npm lock first, then run this file directly.
The ordinary dependency-free test_*.py suite remains separate.
"""
import asyncio
import json
import os
import shutil
import subprocess
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

import quickstart

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
            result = {'tools': [{'name': name, 'description': 'Free fixture tool',
                                'inputSchema': {'type': 'object'}}
                               for name in sorted(quickstart.FREE)]}
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
        rows = self.server.observed
        self.assertIn('initialize', [r['method'] for r in rows])
        self.assertIn('notifications/initialized', [r['method'] for r in rows])
        self.assertEqual([r['tool'] for r in rows if r['method'] == 'tools/call'],
                         ['discover_china_supply_check_v0', 'prepare_china_supply_check_v0'])
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


if __name__ == '__main__':
    unittest.main()

