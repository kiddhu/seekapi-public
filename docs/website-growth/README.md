# Website Growth V1 implementation

Design authority: [governance #1090](https://github.com/kiddhu/aion-governance/pull/1090), exact design SHA `832b6ea8ce8a1bd2d40af514493eeb0efe61824a`; [freeze 5907749027](https://github.com/kiddhu/aion-governance/pull/1090#issuecomment-5907749027), GemAION design review 5363511599. Monarch authorized the independent implementation PR stage on 2026-09-30; admission is recorded in comment 5908731675.

Base: seekapi-public main `dc559f60e37fe9562fed2990dde05a0ae158821e`, including merged category PR #10. Pilot content is reused unchanged. This is an implementation candidate; homepage selection, merge and production acceptance remain gated.

## What changes

The English homepage leads with the specific sourcing task, source-linked historical proof and the next currently open action. It has two human CTAs, a quieter Agent link and secondary sourcing questions. Three native server-rendered candidates share the accepted lower-page sections.

| Candidate | Preview-only route | Mobile / desktop captures |
| --- | --- | --- |
| A: direct shortlist | /website-growth-preview/a | [mobile](screenshots/a-mobile.png), [desktop](screenshots/a-desktop.png) |
| B: brief to evidence | /website-growth-preview/b | [mobile](screenshots/b-mobile.png), [desktop](screenshots/b-desktop.png) |
| C: decision clarity | /website-growth-preview/c | [mobile](screenshots/c-mobile.png), [desktop](screenshots/c-desktop.png) |

Candidate A is provisionally wired to / for implementation preview; it is **not a selected production winner**. The owner canceled the ten-person study and will personally inspect and accept a concrete candidate before release; see [governance decision 5909261935](https://github.com/kiddhu/aion-governance/pull/1090#issuecomment-5909261935). Candidate routes are noindex, absent from the public sitemap and return 404 in production builds. No input illustration submits a brief. Free preparation requires an MCP-capable client. Paid CSC and Live RFQ Compare remain closed; historical V4 full-run TECHNICAL_BLOCKED is visible.

English routes move under Next.js's native (english) group with no public path changes. Separate English and locale root layouts share RootDocument. All 34 existing localized pages now have correct initial HTML lang/dir without a client-side language mutation. Crossing root layouts causes a full page navigation, which is deliberate so the document language is correct immediately.

The new English CSC homepage and how-it-works are not presented as translations of older broad Desk pages. Existing commercial translations reciprocate among their real equivalents; Russian sourcing/compliance/start use the complete equivalent set, while its narrower home remains self-only. No new translations were authored. The shared metadata helper prevents a repeated brand suffix. Existing Agent JSON meaning, ARD file, status page, pilot content and MCP schemas are unchanged.

## Executed implementation checks

- Preview and production-equivalent Next.js builds passed.
- [Preview route checks](preview-route-verification.json): 55/55 routes, including 34 locale pages; zero errors.
- [Production-equivalent route checks](production-route-verification.json): same 55 routes, sitemap parity, correct robots and all three candidate paths 404; zero errors.
- Checks include initial lang/dir, one H1, self-canonical, reciprocal real hreflang, internal links/fragments, JSON-LD parsing/no Offer, disabled paid copy, historical status and invalid-route 404.
- [Browser evidence](browser-verification.json): six 375px/1440px candidate captures, no overflow/framework overlay/page errors, availability and limits inside first viewport; mobile menu reaches CSC; Arabic lang=ar/dir=rtl.
- This is local implementation evidence, not public deployment, Cloudflare remediation, MCP execution, user comprehension or search visibility.

Reproduce with `npm ci --ignore-scripts`, `npm run build`, then `npm run start -- --hostname 127.0.0.1 --port 3219` and `python3 scripts/verify_website_growth.py http://127.0.0.1:3219`. For an isolated production-equivalent build use `NEXT_PUBLIC_PUBLIC_INDEXING=1 VERCEL_ENV=production` for build/start and pass `--production` to the verifier. Do not use a live paid endpoint.

## Remaining selection and release gates

1. **Owner homepage acceptance: PENDING.** Monarch canceled the ten-uncoached-target-buyer study and ≥8/10 threshold on 2026-09-30. Show the repaired A/B/C preview to the owner, record the chosen candidate and explicit acceptance before merge or production release. No buyer-study result or owner selection is claimed yet.
2. **Independent implementation exact-head review.** Design approval does not approve this code.
3. **Website human-search baseline: NOT_RUN.** Reuse governance's unchanged preregistered manifest and SHA-256 `9e75e7b1a541ada72c82f5d24ffc16f39d47eb28b3099f91344926912068db19`, Google/Bing × US/UK, D0/D1 and fixed queries. Keep the earlier 0/25 and 0/22 observations separate. Do not create a second benchmark or claim a lift.
4. **Public release and outside-in acceptance: NOT_RUN.** Apply P01–P12 after the selected implementation receives review and its owner releases it. #1034 supplies its own WAF/MCP evidence; this branch does not change that workstream. Paid activation, provider calls, supplier contact, Registry and platform submissions are outside this PR.

The new source files add no dependency, tracking system, task database, dispatcher, payment module or new control plane.

## Bounded repair of implementation review 5364732399

- B/C mobile hierarchy places the brief/evidence block between the heading and action links. All three B input fields and its result, and C source/date/unit/MOQ/UNKNOWN/status and relevant price qualifications, must appear in the fixed first screen for owner preview review. A remains provisional; no buyer results are inferred.
- C now states that applicability of the price tier at 500 pieces and exact pack conversion are UNKNOWN, directly beside the historical listing excerpt. The excerpt says it is not a confirmed price for 500 pieces.
- `scripts/verify_growth_browser.py` asserts the actual result and field bounds plus availability/limits, checks C's relevant uncertainty text, and re-records all six screenshots. It also tests B/C at 375×900 in addition to 375×812 and desktop 1440×900.
- Reproduce with `python3 scripts/verify_growth_browser.py http://127.0.0.1:3221 --browser <agent-browser-path> --executable-path <chromium-path>` after a fresh preview build/start. The eight viewport cases and route evidence are refreshed for this repair.

## C first-screen outcome regression repair

Re-review session `20260930_182337_73cdd259` independently confirmed both original repairs, then stopped without verdict because the owner gate commit moved the head. It also identified C’s hidden mobile lead as removing the only first-screen success/shortage explanation. C now includes a compact, always-visible future-success/shortage statement beside its illustrative brief; its shorter heading preserves the evidence and limitations within the fixed screen. The browser verifier checks actual visibility and bounds for that statement at both mobile heights and desktop. Source comments and evidence status follow owner decision 5909261935; no owner candidate acceptance is claimed.
