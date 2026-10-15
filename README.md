# SeekAPI — product-first China procurement evidence

China Supply Check compares evidenced matching products from distinct suppliers. The product-first V2 policy scores comparable price45%, scoped sales35%, MOQ fit10% and freshness/activity10%; deduplicates connected legal/member/shop identities; protects at most20 suppliers within10 points of the best product; then selects source factory tiersF5→F0. Q1–Q6 is auxiliary trust, not an all-PASS admission gate. Ordinary partial results stay provisional.

Read the [human example](https://seekapi.ai/china-supply-check/sample), [exact Agent JSON](https://seekapi.ai/china-supply-check/sample.json), [MCP guide](https://seekapi.ai/for-agents), [public HTTP read documentation](https://seekapi.ai/openapi.json), [current public contract](https://seekapi.ai/.well-known/csc-commercial-truth.json) and [discovery status](https://seekapi.ai/discovery-status). Pointer availability is independently verified at release; local preparation is not a production publication receipt.

The public example reconstructs three DIRECT_MATCH historical products. Each commercial score is0/100 and factory tierF0: old or insufficient evidence earns no commercial credit and does not establish a current source factory role. These are not negative product ratings or proof that a supplier is not a factory. Deterministic tied display order does not establish commercial superiority. Original pool/weights are NOT_RECORDED; current V2 scores are RECOMPUTED, not the historical order's original ranking.

Current dated payment observation: image Stripe LIVE atUSD2.99, image x402 OFF, text/model Stripe OFF, text/model x402 LIVE at2.99USDC/Base. Call discover_china_supply_check_v0 at https://api.seekapi.ai/mcp before a new purchase. Runtime admission is authoritative; UNKNOWN never means LIVE. Existing authenticated results are free to reopen, without repayment. No new payment or supplier contact occurs by reading pages.

Source certification is not a SeekAPI independent onsite audit. Source marketplace protections apply only to eligible product transactions and do not compensate the CSC fee. Exact SKU, material, dimensions, quality, stock, lead time and formal quote need RFQ confirmation. Public contacts are availability-only/null when unknown; authenticated paid report business contacts remain readable.

The proposed $19.90 Live RFQ Compare service is contact, translation, follow-up and formal quotation comparison, not contact unlock, and is not currently open for purchase. Other human assignments require separately accepted scope, fee and authority.

## Development

Use Node24. `npm ci`, `npm run build`, then `npm test`. Production-indexing simulation requires `VERCEL_ENV=production NEXT_PUBLIC_PUBLIC_INDEXING=1`; previews remain noindex. The pinned, cleared public artifact is `data/public-agent-sample-publication.json`; source images, identities and private proof packets do not belong here. Removing an artifact produces honest unavailable sample behavior; it must not retain JSON/MCP sample advertisements.

[Publication input and validation](docs/public-qualified-sample-publication.md). Historical engineering/approval notes under docs describe their recorded version; they do not override the current public contract above. They are not current deployment or purchase-availability receipts.
