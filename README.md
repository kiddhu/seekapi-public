# SeekAPI — product-first China procurement evidence

China Supply Check compares evidenced matching products from distinct suppliers. The product-first V2 policy scores comparable price45%, scoped sales35%, MOQ fit10% and freshness/activity10%; deduplicates connected legal/member/shop identities; protects at most20 suppliers within10 points of the best product; then selects source factory tiersF5→F0. Q1–Q6 is auxiliary trust, not an all-PASS admission gate. Ordinary partial results stay provisional.

Read the [human example](https://seekapi.ai/china-supply-check/sample), [exact Agent JSON](https://seekapi.ai/china-supply-check/sample.json), [MCP guide](https://seekapi.ai/for-agents), [public HTTP read documentation](https://seekapi.ai/openapi.json), [current public contract](https://seekapi.ai/.well-known/csc-commercial-truth.json) and [discovery status](https://seekapi.ai/discovery-status). Pointer availability is independently verified at release; local preparation is not a production publication receipt.

The public example reconstructs three DIRECT_MATCH historical products. Each commercial score is0/100 and factory tierF0: old or insufficient evidence earns no commercial credit and does not establish a current source factory role. These are not negative product ratings or proof that a supplier is not a factory. Deterministic tied display order does not establish commercial superiority. Original pool/weights are NOT_RECORDED; current V2 scores are RECOMPUTED, not the historical order's original ranking.

Current dated payment observation: image Stripe LIVE atUSD2.99, image x402 OFF, text/model Stripe OFF, text/model x402 LIVE at2.99USDC/Base. Call discover_china_supply_check_v0 at https://api.seekapi.ai/mcp before a new purchase. Runtime admission is authoritative; UNKNOWN never means LIVE. Existing authenticated results are free to reopen, without repayment. No new payment or supplier contact occurs by reading pages.

Source certification is not a SeekAPI independent onsite audit. Source marketplace protections apply only to eligible product transactions and do not compensate the CSC fee. Exact SKU, material, dimensions, quality, stock, lead time and formal quote need RFQ confirmation. Public contacts are availability-only/null when unknown; authenticated paid report business contacts remain readable.

SeekAPI Verified RFQ Basic is a standalone USD 19.90 Stripe service with no $2.99 prerequisite. We contact up to three distinct suppliers and target at least one current supplier-confirmed qualified quote for your confirmed product, specifications and quantity within three China business days after payment and essential requirement confirmation. Otherwise RFQ_INCOMPLETE means a full refund of this RFQ service fee to the original payment method. Three quotes, a particular price, original-factory identity and procurement success are not guaranteed. Check current runtime admission before a new purchase.

Start from an Amazon product URL, product link or photo as a reference, then confirm specifications, quantity and destination. A URL alone does not verify the original factory or complete an RFQ. [Basic scope and free preparation](https://seekapi.ai/china-supply-check/live-rfq-compare). Basic uses its [dedicated REST/OpenAPI](https://api.seekapi.ai/checkout/stripe/rfq?format=openapi), separately from $2.99 MCP tools. The generic human-task API remains unavailable. Other human assignments require separately accepted scope, fee and authority.

## Development

Use Node24. `npm ci`, `npm run build`, then `npm test`. Production-indexing simulation requires `VERCEL_ENV=production NEXT_PUBLIC_PUBLIC_INDEXING=1`; previews remain noindex. The pinned, cleared public artifact is `data/public-agent-sample-publication.json`; source images, identities and private proof packets do not belong here. Removing an artifact produces honest unavailable sample behavior; it must not retain JSON/MCP sample advertisements.

[Publication input and validation](docs/public-qualified-sample-publication.md). Historical engineering/approval notes under docs describe their recorded version; they do not override the current public contract above. They are not current deployment or purchase-availability receipts.

## Current anonymous public model

The current publication candidate consumes audited `csc.public-agent-sample.v4` from WS3 PR1254/review5536718051. Human/download/MCP all expose the same reviewed JSON. `recommended_candidate_id=null`; Supplier1 is first for display only. Private numeric product-ID tie inputs stay private. Fact coverage is NOT_RECORDED/UNKNOWN/null;3/3 references measure linkage, not fact completeness. Canonical sample URLs and MCP resource URI are unchanged. The complete six-step product-first method and direct JSON/MCP paths are available on the homepage, product page and Agent guide.

Native Next sitemap lastmod and page/structured metadata use the actual presentation revision, separately from preserved source/reconstruction timestamps. No search-engine submission or cache refresh is claimed; third-party search/Registry observations remain external stale until separately read. Registry0.1.10 is not republished or bumped here.
