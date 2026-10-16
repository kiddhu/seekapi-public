# China supplier research: free MCP developer quickstart

Describe a physical product in your own language, inspect an evidence-backed public example, and prepare a buying brief without a wallet or payment. China Supply Check returns up to three distinct supplier candidates, matching evidence, observed listing prices and explicit gaps. A shortlist is not a supplier-confirmed quote, factory audit, stock guarantee or certification.

The examples use fixed synthetic input and stop before purchase. Capability observations below were read on **2026-10-16**; use live discovery for availability before a new purchase.

## Try it in three minutes

From this directory, offline demonstrations need Python 3.10+ or Node 22+ and no dependencies:

```sh
python3 examples/quickstart.py
node examples/quickstart.mjs
```

Both print a confirmation digest, four separate payment-mode observations and `payment_effects: 0`, `provider_effects: 0`. Both stop before purchase. Fixtures contain only public discovery fields and an invented M6 washer brief; they never represent a customer or paid result.

For a real **free** connection, install the official SDK in a local environment and opt in explicitly:

```sh
python3 -m venv .venv
.venv/bin/pip install -r examples/requirements.txt
.venv/bin/python examples/quickstart.py --live
```

```sh
npm --prefix examples ci --ignore-scripts
node examples/quickstart.mjs --live
```

The examples connect only to `https://api.seekapi.ai/mcp` using the official Streamable HTTP transport: initialize → initialized → tools/list → discover → prepare. They allow only `discover_china_supply_check_v0` and `prepare_china_supply_check_v0`. Purchase, run, pilot tools and private order reads cannot be selected, even if a tool description suggests them. No wallet, signature, payment header or secret is needed or loaded. SDK dependencies are needed only for `--live`.

These fixed-brief demonstrations are internal integration probes. Both live SDK transports send `x-seekapi-measurement-test: 1` through initialization and free preparation so supported service measurement excludes the synthetic calls. The marker provides no payment or order authority. When building your own application around real buyer requirements, use your own client configuration rather than copying this synthetic-test marker into genuine customer traffic. No demonstration run is independent demand or a referral.

## Understand what can be bought

Fresh discovery is the authority for availability; a generic “payments live” flag is insufficient.

| Input | Payment route | Observed state, 2026-10-16 | Next action |
| --- | --- | --- | --- |
| Human product image | Hosted Stripe card, USD 2.99 | LIVE | [Open image brief](https://api.seekapi.ai/checkout/stripe/image); review before paying |
| Agent text/model | x402, 2.99 USDC on Base | LIVE | Free prepare, exact customer confirmation, then a separately authorized wallet client |
| Agent product image | x402 | OFF | Do not send a paid image request |
| Human text/model | Stripe | OFF | Do not assume text card checkout |
| Supplier-confirmed RFQ, USD 19.90 | Public sale | FUTURE_NOT_ENABLED | Treat as a future service; no supplier contact promised |

The examples inspect the machine-reported mode matrix and synthetic prepare response. Legacy broad intake flags can differ from the specific card/image projection; never expand a route from a broad boolean. The examples reject missing or contradictory mode payment flags. A transport test does not prove a paid purchase or delivery.

## Prepare exactly what the buyer asked for

[The fixture](fixtures/free-journey.json) includes the actual current text-tool argument shape:

```json
{
  "draft": {
    "input": {"text": "M6 flat washer, 304 stainless steel"},
    "quantity": 1000,
    "unit": "pcs",
    "must_match": [
      {"attribute": "size", "expected": "M6"},
      {"attribute": "material", "expected": "304 stainless steel"}
    ],
    "product_name": "M6 flat washer",
    "model_or_reference": null,
    "substitution_allowed": false
  }
}
```

This is synthetic buyer input, not inferred requirements from a photograph. Inspect current `tools/list` before adapting it. The free response includes the normalized requirement draft, product brief, `requires_exact_customer_confirmation: true` and `draft_digest`. Display the actual returned drafts privately to the buyer. Preserve the digest returned by the service; do not compute a replacement or silently edit the confirmed input. Any changed size, material, quantity, substitution policy or product requires a fresh prepare and new exact confirmation. A digest establishes what was prepared, not authority to spend.

Paid invocations require separate explicit authorization, current rail support, exact confirmation and independent signed-wallet authentication. Payment proof alone is not invocation authentication. This package deliberately provides no paid invocation path. Existing order recovery uses authenticated status/result and never another purchase; no private order is read by these examples.

## Inspect the actual public evidence

- [Human example](https://seekapi.ai/china-supply-check/sample)
- [Candidate JSON](https://seekapi.ai/china-supply-check/sample.json)
- MCP resource: `seekapi://china-supply-check/sample/current`
- [Current Agent guidance](https://seekapi.ai/for-agents) and [machine-readable guidance](https://seekapi.ai/llms.txt)
- [Official Registry metadata](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.kiddhu%2Fseekapi/versions/latest)

Links were checked on October 16, 2026. Registry metadata is not downstream discovery evidence. Sample v4 contains three anonymous candidate slots under a **historical reconstruction**, and its current first-displayed candidate is explicitly not a commercial recommendation. Supplier-confirmed quotes, independent factory audit, and buyer endorsement must not be inferred.

| Decision | Evidence to read | If absent |
| --- | --- | --- |
| Exact product match | Size, grade, material, standard, variant and source scope | UNKNOWN; ask buyer/supplier before relying |
| Distinct supplier | Entity/member/shop deduplication and source relationship | Do not count multiple products as multiple suppliers |
| Comparable cost | Currency, unit, quantity tier, observation date, shipping/tax exclusions | Listing price is not an RFQ quote |
| Manufacturer claim | Specific authority, scope and evidence date for factory tier | F0/unknown is not verified factory status |
| Candidate order | Product score, protected pool, factory tier and tie explanation | Display order is not a recommendation |
| Shortage | Actual distinct qualified candidates and missing evidence | Return shortage; never pad to three |

Keep BUYER_STATED, SOURCE_OBSERVED, DERIVED and UNKNOWN separate. Field evidence proves only its stated scope. A platform badge does not rescue a product mismatch or establish all claims about a supplier.

## Recover safely

| Observation | Meaning and recovery |
| --- | --- |
| 402 | On a paid tool it may be an intentional challenge; these examples never pay. On free discovery stop and inspect, do not retry with payment. |
| 406 / generic GET | Check MCP Accept and Streamable HTTP configuration. Use the SDK handshake; generic GET is not a tool health check. |
| 404 | Recheck the canonical endpoint/session with the official SDK. Do not redirect a purchase to an unrelated page or repay an existing order. |
| 403 / timeout | Check client headers and network privately. A default urllib User-Agent was rejected while the explicitly identified SDK clients succeeded; no security rule was relaxed. No payment fallback or application retry exists. |
| Tool error / unknown mode | Stop before prepare/purchase and inspect current schema and discovery. Do not invent a supported rail. |
| Missing wallet/signature | Free setup needs neither. Paid or private-order operations require a different explicitly authorized client. |
| Fewer than three candidates | Honest shortage is a valid evidence outcome; do not fabricate suppliers. |

No screenshot, private image, customer brief, wallet, token or private result belongs in public logs. CLI output uses only the synthetic brief digest and public capability observations. Source/raw SDK exceptions are intentionally not printed by the examples.

## Verify locally

```sh
python3 -m unittest discover -s examples -p 'test_*.py'
node --test examples/test_quickstart.mjs
```

After installing both pinned SDK dependencies above, verify the actual Python and Node SDK HTTP transports against a local fixture:

```sh
.venv/bin/python examples/sdk_wire_test.py -v
```

This additional test uses loopback HTTP only. It verifies the initialize/initialized handshake, the two free calls, the synthetic-test header on those MCP POST requests, and the absence of payment or authentication headers. The Node CLI runs unchanged; a test-only import redirects its fixed URL to loopback. No public service is called by this check.

The tests exercise the free journey, blocked paid/pilot/private tools, missing tools, unknown effects, mode contradiction, unknown availability, changed buyer input, invalid digest, unexpected effects and transport failure without application retry. Use the explicit `--live` commands for an on-service free connection; the SDK transport regression itself stays on loopback. These checks do not demonstrate independent customer use, a paid purchase or delivery.

Protocol reference: [MCP Streamable HTTP specification](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports). Current discovery and the public sample define their own dated scope. No certified integration, independent customer use, paid result or traffic gain is claimed by this package.
