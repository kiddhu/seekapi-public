# SeekAPI — China procurement for AI agents and overseas buyers

SeekAPI acts as a **China-side procurement desk** for overseas buyers and AI agents. Its live entry product is **China Supply Check**: three evidence-backed China supplier candidates worth advancing to RFQ, with dated product/specification, published sales-price and quantity/MOQ evidence, contact paths and candidate-specific gaps.

- [China-side procurement desk and manually scoped work](https://seekapi.ai/china-desk)
- [Agent MCP connection and human handoff](https://seekapi.ai/for-agents)
- [China supplier sourcing guides](https://seekapi.ai/sourcing)
- [Current entity and operator](https://seekapi.ai/about)
- [Current product and purchase requirements](https://seekapi.ai/china-supply-check)
- [Real production paid acceptance summary — INTERNAL_ACCEPTANCE](https://seekapi.ai/china-supply-check/sample)
- [Directory and discovery status](https://seekapi.ai/discovery-status)
- [Support](https://seekapi.ai/support), [Terms](https://seekapi.ai/terms) and [Privacy](https://seekapi.ai/privacy)

Agent payment via x402 is live: **2.99 USDC on Base**. **Stripe Checkout USD2.99 is being enabled and is not currently available to purchase**. Signed-wallet authentication is required for current x402 order operations and free result reads; payment proof or an order ID alone does not grant access. Card access will use the same order/entitlement/result when enabled.

Certification, company identity, production/trade scope, published prices and contact facts are reported per candidate and within their source scope. Missing evidence is recorded on the relevant field. A screening result does not guarantee a supplier reply, a supplier-confirmed final quotation, stock or lead time. Existing company/judicial information capability is distinct from what has actually been checked in an individual report.

After the shortlist, an Agent or buyer can request manual scope review for selected-supplier contact, an authorized RFQ and quote comparison, sample or production follow-up, procurement and export/logistics coordination. SeekAPI accepts only a separately agreed scope, fee, recipient permission and authority. The browser prepares a user-reviewed email request; no human-task API or automatic acceptance is live. The proposed USD 19.90 Live RFQ Compare package is not open for purchase. The current screening purchase does not authorize supplier outreach. Synthetic API fixtures are separately labelled sandbox. Historical V4 evidence is archived and is not the successful paid acceptance order or current commercial availability.

## Develop locally

```bash
npm ci
npm run dev
npm run build
```

Open http://localhost:3000. This repository contains public website and intentionally public assets; no customer identifiers, payment proofs, credentials or internal commercial budgets belong here.

Preview deployments are non-indexable. Production indexing requires both `VERCEL_ENV=production` and `NEXT_PUBLIC_PUBLIC_INDEXING=1`. Intake routes remain separate from informational product and discovery pages.
