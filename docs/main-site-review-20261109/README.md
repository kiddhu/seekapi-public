# Main website review evidence — 2026-11-09 UTC

This is engineering evidence for Draft PR #61, not an independent red-team approval or a production release. The tested website source is `85afed8bf9c09d9d3db3e200728c82a57f162e61`, tree `78814c140e554fc7c9abb268a4d6aa41e2c8181f`. The base is `7c1d45a0c5e4a6bb56ff8954fcac52817b785d29`. The subsequent evidence commit changes only this directory. [Source hashes](source-manifest.json) bind every changed implementation/test/download file to the tested tree. The final PR head, rather than any older approval, is the version for independent review.

## What changed for customers

- Keep the original free RFQ buyer entry primary. Put the separate, priced $2.99 screening action in the first viewport at all seven tested widths, in English and all six localized homes. The locale actions identify the current English buyer destination. Explain screening evidence versus supplier-confirmed RFQ quotations before purchase.
- Correct six translated payment descriptions, shared notices, FAQs and metadata from the existing four-rail truth. Make the China Supply Check ARD entry describe screening first. No tool, protocol, identifier, schema version or payment capability is expanded.
- Improve both product pages, Proof, Trust, Support and For Agents. Preserve canonicals and original deep links. Trade remains a separate website; `/trade-supply` remains absent.
- Expose mode-specific recovery through original private links/files and authenticated methods. No order-ID-only lookup, new credential collection, fabricated recovered state, or repeat-purchase instruction is introduced. Recovery links and private result routes stay out of acquisition attribution.
- Stabilize server-rendered email-draft forms, preserve drafts across mode changes, discard stale prepared email links after edits, and disable native no-JavaScript submission that previously leaked entered values into a GET URL. These forms still prepare email only; no message is sent by the website.
- Improve contrast, focus, disclosure navigation, 48px action targets, reduced motion, keyboard access to scrollable tables/code, and embedded sample heading depth. Reviewed sample artifacts and their digests remain unchanged.
- Repair 95 inaccessible HTTP mirror URLs in the Agent example lock using official HTTPS npm URLs. All versions and integrity hashes remain unchanged. Rebuild the existing 12-member ZIP and verify exact source/archive parity.

## Evidence and results

The final browser results and screenshots are in [browser/](browser/). [Manifest](evidence-manifest.json) contains file hashes. Full logs, including failed attempts, are retained here without customer data or signed prepare receipts.

| Check | Result and evidence scope |
| --- | --- |
| Original main baseline | Production build and 134/134 existing Node tests passed before edits. Original contrast and company-form layout failures reproduced in [baseline observations](regressions/baseline-observations.json). Only the observation log is retained as original baseline evidence; no original baseline screenshots are claimed. |
| Final source | Production build and explicit TypeScript check succeeded; 153/153 Node tests, no skips. See [build](logs/production-build.log), [TypeScript](logs/typescript.log), [tests](logs/node-153.log). |
| Browser | 1318/1318 checks pass, zero errors. Read [raw results](browser/results.json) for timings and source head. Eight core routes at 360/375/390/430/768/1024/1440px, six localized homes at all seven widths, and a sanitized synthetic private report at seven widths. 58 other public routes checked at 360/1440px (116 layouts). |
| Accessibility | WCAG 2 A/AA, 2.1 A/AA and 2.2 AA axe tags; keyboard/skip-link/Escape/fragment focus, 320px reflow equivalent, touch emulation, and reduced motion. Automated checks do not certify complete screen-reader or real-device accessibility. |
| axe incomplete nodes | Supplementary computed solid-color checks cover the decorative menu glyph, free-tool arrow, textarea text and placeholder. The placeholder was 4.4856:1 before the last correction; final measurements are in `contrast_review` in the browser report. This is separate from axe's pass/fail results. |
| Stability/performance | All core and localized-home cold-load CLS observations are 0 in the final browser report. Additional 1Mbps / 150ms / 4x CPU lab checks cover home and company form. LCP is a local observation; field p75, INP and real mobile performance remain unknown. |
| Purchased states | Local READY, PROCESSING, UNKNOWN, NO_ACCESS and ACCESS_EXPIRED fixtures; no new payment action. Public recovery entries lead to existing authorized controls. Synthetic result screenshots are explicitly named and show “Test checkout · No real payment”. |
| Attribution/privacy | With privacy controls off, recovery does not receive `#sf=` or a SALES_CTA_CLICK; normal new-sale attribution remains. External requests are intercepted in the browser suite. Private status/result headers remain no-store, noindex and no-referrer. |
| Agent downloads | [SDK validation](sdk-validation.json): Python 9 + Node 9 + real SDK loopback HTTP 14 = 32 passing tests. Python MCP 1.30.0 and Node SDK 1.32.1 installed successfully from the pinned examples. Node installation failure before the mirror fix and success afterward are both retained. |
| Routes and search contracts | [Redirect/private headers](routes-readback.json), [host-specific legacy 410 responses](legacy-host-readback.json), existing 50 legacy Node tests, full sitemap/canonical sweep. Search-engine indexing is not proved by these checks. |

### Screenshots

All 105 final captures are retained with hashes in `browser/results.json`. They are viewport captures, not a customer study. Useful starting points:

- Home: [360](browser/home-360.png), [375](browser/home-375.png), [390](browser/home-390.png), [430](browser/home-430.png), [768](browser/home-768.png), [1024](browser/home-1024.png), [1440](browser/home-1440.png).
- Product entries: [screening mobile](browser/china-supply-check-390.png), [RFQ mobile](browser/china-supply-check-live-rfq-compare-390.png), [screening desktop](browser/china-supply-check-1440.png), [RFQ desktop](browser/china-supply-check-live-rfq-compare-1440.png).
- [Support/recovery](browser/support-390.png), [Proof](browser/proof-390.png), [Trust](browser/trust-390.png), [Agent guidance](browser/for-agents-390.png), [company form](browser/start-390.png), [Arabic RTL](browser/ar-390.png).
- [Synthetic private result](browser/private-synthetic-result-390.png): a local fixture, not an authorized production paid-order read.

### Failure → correction → retest

| Finding | Correction and retained evidence |
| --- | --- |
| Six translations advertise image x402; ARD leads with the wrong product | New payment/identity checks first RED, then GREEN; all 34 translated route bodies plus relevant home metadata/FAQ projections checked. [RED](logs/payment-truth-red.log), [GREEN](logs/payment-truth-green.log). |
| Baseline footer/proof/form text contrast, 42px actions, company form CLS 0.3045/0.3188 | Scoped public presentation tokens/48px actions, full initial server-rendered form. Original observations remain above; final browser report records no relevant axe violation and CLS 0. |
| Preliminary browser round 2: seven failures | Fix Agent code-region focusability, RU dark-section contrast, skip link, language Escape and recovery-fragment focus. [Raw failed run](regressions/acceptance-r2.json). |
| Round 3: twelve failures | Fix ten keyboard-inaccessible guide table regions and one duplicated embedded sample H1 at two widths without mutating reviewed artifacts. [Raw failed run](regressions/acceptance-r3.json). |
| Round 4 automated checks pass, but a supplementary check finds placeholder contrast 4.4856:1 | Set explicit opaque accessible placeholder color and add four computed contrast checks to the final suite. [Before](regressions/placeholder-contrast-before.json), [earlier automated run](regressions/acceptance-r4.json). |
| No-JavaScript form GET exposes synthetic entered values; audience switch loses drafts; prepared email gets stale | Disable pre-hydration/no-JS controls, defensive POST method and useful fallback; retain independent mode drafts and invalidate mail links on edits. Local final browser cases cover each behavior. No message was sent. |
| Content-revision entry incorrectly includes noindex `/start` | Existing sitemap regression caught it; remove only that unsupported entry. [Failed test](logs/sitemap-date-regression.log); final 153 pass. No legacy URL rewrite added. |
| Agent kit `npm ci` fails 403 on an HTTP mirror | Replace resolved hosts only, preserve integrity/versions and refresh ZIP. [Before installation](logs/sdk-install-before.log), [after](logs/sdk-install-after.log), [integrity RED](logs/sdk-integrity-red.log), [GREEN](logs/sdk-integrity-green.log). |

The final pre-handoff screenshot review found that the six localized homes still lacked the two priced choices above the fold. Six new route tests first failed, then passed after adding localized outcome/price copy and two direct actions, RFQ first. The browser suite now inspects all 42 locale/width combinations; every pair is in its reference first viewport. Existing language URLs, canonicals, alternate links and metadata identity remain.

One older assertion required a CSC-only first action. Updating that obsolete product-selection assertion is the **only** change in the shared `test/discovery-convergence.test.mjs`; every confidentiality assertion stays intact. PR22 at `2445be1818d74700d949cdb2677615a0beebd4a2` changes a different proof/discovery regex hunk. [Original patch fingerprint](pr22-observed-patch.json), [isolated compatibility result](pr22-test-compatibility.json), [new RED tests](logs/localized-actions-red.log), [old assertion failure](logs/localized-old-assertion.log). The isolated three-way merge exited 0 and preserved both intents; it does not claim that all of the historical PR22 can merge with current main. No PR22 branch, publisher file or confidentiality workflow is modified.

The earlier 1060-check / 75-capture run remains at [its immutable evidence commit](https://github.com/kiddhu/seekapi-public/tree/a85c096b2e3d4d4d912488fcc7803419d419996a/docs/main-site-review-20261109); its [raw result](regressions/acceptance-r5.json) is also retained here. It binds source `8d5f4e25d2298f50b5deb6e84c8032eb22c113d7`, before the locale extension. Current browser evidence binds the later source named at the top.

A preliminary browser harness also timed out after the menu's accessible name changed from Menu to Close; selecting its stable trigger fixed the harness. An existing SSR test helper was updated to render the actual returned root component; its withdrawal assertions remain. Neither harness issue is reported as a product defect or an independent approval.

The [content-boundary delta check](content-boundary-delta.json) uses the original PR22 guard patterns and finds no new prohibited text in this PR. It does not claim the inherited whole repository is already cleaned by PR22. The shared test keeps its pre-existing confidentiality assertion for that independent PR to update.

## Existing API checks, without purchases

The runtime observations are dated 2026-11-09 UTC and are not a new availability promise:

- [Ordinary verified-TLS HTTPX GETs](runtime/httpx-public.json) returned 200 for the RFQ recovery page and the image entry. The latter explicitly said new image purchases were unavailable. Published image Stripe LIVE does not override that runtime pause. No switch was changed.
- [Default urllib GETs](runtime/public-get.json) returned 403 for those entries and the public truth file; Ray IDs and response hashes are preserved. The cause of these new responses is unknown. No UA substitution, TLS bypass or WAF adjustment was used to hide them.
- Actual pinned [Node CSC](runtime/csc-node-sdk-live.json) and [Python RFQ](runtime/rfq-pinned-sdk-live.json) clients completed discovery/free preparation with synthetic internally marked input and stopped. No session, confirm, Checkout, paid call or contact was executed. RFQ reports payment_actions 0; CSC reports payment/provider effects 0.
- [Free REST prepares](runtime/free-rest-summary.json) returned image draft-ready and RFQ READY. Image REST has no explicit effect counters in its response, so these are not invented. Signed prepared objects remain private and are not committed.
- [Invalid-access result reads](runtime/unauthorized-result-read.json) returned 400 without report/result/suppliers. This negative case does not prove successful recovery, cross-buyer authorization or ledger invariants.

Direct Chromium access to the existing public HTTPS services encountered the managed environment's proxy/CA trust error. We kept TLS verification intact and did not treat local browser acceptance or HTTPX success as proof of real-browser production reachability. Default-client 403 remains for the original infrastructure owner to diagnose by the new Ray IDs.

## Reproduce

Use Node 24 (project supports >=22), Python Playwright 1.62.0, Chromium 154.0.8037.57, and axe-core 4.10.3. The axe file SHA256 is `880970c081707360e64f34cea25ff91892f5bc95675b0776925b9709dd8a68bb`. It was obtained with verified TLS from cdnjs. Run in a clean checkout at the reviewed PR head:

```sh
npm ci --ignore-scripts --no-audit --no-fund --cache /tmp/seekapi-review-npm-cache
VERCEL_ENV=production NEXT_PUBLIC_PUBLIC_INDEXING=1 npm run build
npx --no-install tsc --noEmit
npm test
VERCEL_ENV=production NEXT_PUBLIC_PUBLIC_INDEXING=1 npm start -- --hostname 127.0.0.1
```

In a second terminal with Playwright installed and the pinned axe file available:

```sh
python scripts/verify_main_site.py --evidence-dir /tmp/seekapi-review-new-run --axe /tmp/axe-4.10.3.min.js --chromium /usr/bin/chromium --sitemap-sweep
python scripts/verify_main_site_touch.py --output /tmp/seekapi-review-new-touch.json
```

The scripts refuse non-loopback base URLs and refuse to overwrite earlier evidence. The full report records the source head and dirty status. Next may generate a `next-env.d.ts` type-reference change during build; the recorded source run discarded only that generated addition before starting the browser check.

For the 32 SDK checks, copy `public/developers/free-mcp-quickstart` to a scratch directory, install `examples/requirements.txt` in an isolated venv and run `npm --prefix examples ci --ignore-scripts` with a scratch npm cache. Then run:

```sh
.venv/bin/python -m unittest discover -s examples -p 'test_*.py'
node --test examples/test_quickstart.mjs
.venv/bin/python examples/sdk_wire_test.py -v
```

These tests use offline/loopback fixtures. The `--live` examples are separate, optional free calls and were explicitly run only with the packaged synthetic input. Node 24 in a proxy-managed environment used its documented `NODE_USE_ENV_PROXY=1` setting and inherited CA trust; no proxy credentials are part of this artifact.

## External evidence still required

1. Independent red-team rerun and formal exact-head code review. This author cannot substitute its own checks for either review.
2. Runtime owner: explain current image admission/qualification/expiry/health and give the actual installed version. Keep OFF rails and paused purchase gates intact.
3. Runtime owner: supply an explicitly authorized isolated paid-result fixture or approved existing-order read, covering cold recovery, revocation/expiry, cross-buyer rejection, callback replay and read-only before/after payment/Provider aggregates. The website will keep using original private methods; no universal lookup API is presumed or requested by this patch.
4. Infrastructure owner: trace the newly recorded 403 Ray IDs without weakening global defenses. Production operator: provide the approved deployment/rollback mapping and post-release readback through the normal gate.
5. Real assistive technology/physical device coverage, field performance, search indexing, qualified independent traffic, net revenue and conversion improvement remain UNKNOWN/INSUFFICIENT_EVIDENCE. Internal QA, reopened results and synthetic traffic do not count as new sales.

A final verified-TLS [production ARD readback](runtime/production-ard-readback.json) at 19:49:59 UTC still matches the recorded main bytes and differs from this candidate. This is a public-source observation, not a deployment control-plane or rollback verification.

## Release and rollback boundary

NOT_DEPLOYED. Draft and unmerged. No production configuration, order, payment, refund, entitlement, Provider ledger, goods purchase, supplier contact or customer message was changed or triggered. Existing accepted orders retain their terms; no new paid path or commercial promise is introduced.

After independent review and a separately authorized release, prefer a reviewed rollback of the specific regressing presentation hunks in MainHome, the localized hero, navigation or main-conversion.css. Retain the corrected payment rails and product identity, current-admission notices, both independent service destinations, no-JavaScript form privacy, recovery protections and accepted-order terms. Use the recorded base only as a visual/source reference: restoring it wholesale would reintroduce known payment-copy and privacy defects. Rebuild and run the relevant truth, form, route and browser regressions before any separately authorized rollback deployment. No data migration or backend rollback is required. A known source base is not a verified executable production rollback target; deployment mapping and an exercised operational rollback remain outside this evidence.
