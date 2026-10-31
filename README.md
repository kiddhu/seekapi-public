# SeekAPI — current Chinese supplier quotes for $19.90

**SeekAPI Verified RFQ Basic** turns a product link, photo or written requirement into supplier contact and current quotation comparison for a **one-time USD 19.90**.

- We contact up to **three matched Chinese suppliers**, translate and follow up.
- Target: **at least one current qualified supplier-confirmed quote within three China business days** after payment and essential requirement confirmation.
- If that target is missed, the **full RFQ service fee is refunded to the original payment method**.
- Receive a **Human report, Agent JSON and Evidence manifest**.
- Prepare and review your requirement **for free**. Buy Basic directly; the $2.99 screening service is optional.

[Prepare my RFQ for free](https://api.seekapi.ai/checkout/stripe/rfq) · [Service details and guarantee](https://seekapi.ai/china-supply-check/live-rfq-compare) · [How it works](https://seekapi.ai/how-it-works)

## For AI Agents and developers

Use the dedicated [Basic REST/OpenAPI](https://api.seekapi.ai/checkout/stripe/rfq?format=openapi) and [complete Agent workflow](https://seekapi.ai/for-agents#rfq-requirement-prepare). Discover current admission, prepare a free requirement, review the normalized brief, then obtain buyer approval before confirmation and Stripe payment. Keep private order and recovery credentials out of logs. Reopen existing authenticated results without repayment.

Basic supplier quotations use the dedicated REST service. The existing [MCP endpoint](https://api.seekapi.ai/mcp) provides optional $2.99 supplier screening. Try the [free Python/Node MCP quickstart](https://seekapi.ai/for-agents#free-quickstart), [download the examples](https://seekapi.ai/developers/free-mcp-quickstart.zip), or inspect [llms.txt](https://seekapi.ai/llms.txt) and the [Agent manifest](https://seekapi.ai/for-agents/agent-services.json).

## Choose the result you need

| Your next decision | Service | Start |
| --- | --- | --- |
| I need suppliers contacted and current replies compared | Verified RFQ Basic · USD 19.90 once | [Prepare a free RFQ](https://api.seekapi.ai/checkout/stripe/rfq) |
| I need a supplier shortlist and listing evidence first | China Supply Check · USD 2.99 image Stripe or 2.99 USDC text/model x402 | [Review screening](https://seekapi.ai/china-supply-check) |
| I need to write or compare a precise request | Free product, specification and quote worksheets | [Sourcing library](https://seekapi.ai/sourcing) |

## Scope and service questions

An Amazon product URL or other product link can be used as a reference alongside confirmed specifications. Amazon automatic import is currently off; add a photo or the missing detail and continue with your requirement. Supplier replies determine the quotation terms. The RFQ guarantee covers the service fee; goods, samples, freight, duties and broader procurement work are separately scoped. See [service terms](https://seekapi.ai/terms) and [trust](https://seekapi.ai/trust).

The [public supplier screening example](https://seekapi.ai/china-supply-check/sample) is a historical reconstruction, not a current RFQ quote or customer testimonial. [Exact Agent JSON](https://seekapi.ai/china-supply-check/sample.json), [current public contract](https://seekapi.ai/.well-known/csc-commercial-truth.json) and [discovery status](https://seekapi.ai/discovery-status) provide its evidence context.

## Optional screening: method and payment modes

China Supply Check compares evidenced matching products from distinct suppliers. Product-first V2 scores comparable price45%, scoped sales35%, MOQ fit10% and freshness/activity10%; deduplicates connected legal/member/shop identities; protects at most20 suppliers within10 points of the best product; then selects source factory tiersF5→F0. Q1–Q6 explains trust rather than requiring six all-PASS gates. Ordinary partial results stay provisional.

Image Stripe is LIVE at USD2.99; text/model x402 is LIVE at 2.99USDC on Base. Image x402 and text/model Stripe remain OFF. Call discover_china_supply_check_v0 at https://api.seekapi.ai/mcp for current admission before purchasing screening. Platform evidence is not an independent SeekAPI onsite audit; platform protections apply only to eligible goods transactions, not the screening service fee.

## Development

Use Node24. `npm ci`, `npm run build`, then `npm test`. Production-indexing simulation requires `VERCEL_ENV=production NEXT_PUBLIC_PUBLIC_INDEXING=1`; previews remain noindex. The pinned, cleared public artifact is `data/public-agent-sample-publication.json`; source images, identities and private proof packets do not belong here. Removing an artifact produces honest unavailable sample behavior; it must not retain JSON/MCP sample advertisements.

[Publication input and validation](docs/public-qualified-sample-publication.md). Historical engineering/approval notes under docs describe their recorded version; they do not override the current public contract above. They are not current deployment or purchase-availability receipts.

## Current anonymous public model

The public screening sample uses `csc.public-agent-sample.v4`. Human/download/MCP all expose the same reviewed JSON. `recommended_candidate_id=null`; Supplier1 is first for display only. Private numeric product-ID tie inputs stay private. Fact coverage is NOT_RECORDED/UNKNOWN/null;3/3 references measure linkage, not fact completeness. Canonical sample URLs and MCP resource URI are unchanged. The complete six-step product-first method and direct JSON/MCP paths are available on the homepage, product page and Agent guide.

Native Next sitemap lastmod and page/structured metadata use the actual presentation revision, separately from preserved source/reconstruction timestamps. No search-engine submission or cache refresh is claimed; third-party search/Registry observations remain external stale until separately read. Registry0.1.10 is not republished or bumped here.
