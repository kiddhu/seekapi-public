import asyncio
import copy
import unittest
from quickstart import Fixture, demo, free_call, modes

class SafetyTests(unittest.TestCase):
    def test_free_journey(self):
        t = Fixture()
        result = asyncio.run(demo(t))
        self.assertEqual(result['payment_effects'], 0)
        self.assertEqual(result['provider_effects'], 0)
        self.assertEqual(len(result['draft_digest']), 64)
        self.assertEqual(t.calls, ['discover_china_supply_check_v0', 'prepare_china_supply_check_v0'])
        self.assertEqual(result['modes']['image_x402'], 'OFF')

    def test_paid_tool_never_reaches_transport(self):
        for name in ['purchase_china_supply_check_v0', 'run_china_supply_check_v0', 'invoke_product_keyword_search_v0', 'status_china_supply_check_v0']:
            t = Fixture()
            with self.assertRaises(ValueError): asyncio.run(free_call(t, name, {}))
            self.assertEqual(t.calls, [])

    def test_missing_free_tool_stops_before_calls(self):
        t = Fixture(); t.tools = []
        with self.assertRaises(ValueError): asyncio.run(demo(t))
        self.assertEqual(t.calls, [])

    def test_missing_free_effect_stops_before_prepare(self):
        t = Fixture(); t.discovery['tool_contracts'] = []
        with self.assertRaises(ValueError): asyncio.run(demo(t))
        self.assertEqual(t.calls, ['discover_china_supply_check_v0'])

    def test_conflicting_mode_stops(self):
        t = Fixture(); t.discovery['contract']['payment']['image_x402_live'] = True
        with self.assertRaises(ValueError): asyncio.run(demo(t))
        self.assertEqual(len(t.calls), 1)

    def test_unknown_mode_is_not_off_or_live(self):
        t = Fixture(); del t.discovery['contract']['payments']['image_first']['x402']['status']
        with self.assertRaises(ValueError): modes(t.discovery)

    def test_unexpected_effect_or_confirmation_stops(self):
        for key,value in [('payment_effects',1),('provider_effects',1),('requires_exact_customer_confirmation',False),('draft_digest','not-a-digest')]:
            t = Fixture(); t.prepared[key] = value
            with self.assertRaises(ValueError): asyncio.run(demo(t))
            self.assertEqual(len(t.calls), 2)

    def test_transport_failure_has_no_application_retry(self):
        class Failing(Fixture):
            async def call(self,name,args):
                self.calls.append(name)
                raise TimeoutError('fixture timeout')
        t = Failing()
        with self.assertRaises(TimeoutError): asyncio.run(demo(t))
        self.assertEqual(len(t.calls), 1)

    def test_changed_buyer_input_is_sent_to_new_prepare(self):
        t = Fixture(); draft = copy.deepcopy(t.draft); draft['quantity'] = 2000
        asyncio.run(demo(t,draft)); self.assertEqual(t.arguments[-1]['draft']['quantity'],2000)
        self.assertFalse(any('purchase' in x for x in t.calls))

if __name__ == '__main__': unittest.main()
