# How do you keep drawings and model revisions aligned across supplier evidence?

Need current supplier quotes? Prepare free, then choose a USD 19.90 live RFQ.

[Prepare my RFQ for free](https://api.seekapi.ai/checkout/stripe/rfq) · [Agent: prepare a free RFQ with MCP](/for-agents#rfq-free-mcp)

Keep the model reference and drawing revision visible beside each listing, sample or supplier reply. Record units and the dimensions the buyer requires; do not silently translate an approximate image into a measurement. When versions differ, identify the changed field and request clarification before treating them as equivalent. The checklist maintains evidence consistency and change history; it does not perform engineering approval or authorize production.

Materially updated: 2026-10-16

## When to use this checklist

Use this when a drawing, listing, sample or quotation refers to different revisions. Log discrepancies and get the buyer’s decision on the exact revision before accepting a proposed match.

Editorial decision aid: this does not obtain quotations, contact suppliers or approve product conformity.

## Minimum buyer brief

Reference/version; units; buyer-stated dimensions; source evidence version; discrepancy and acceptance owner.

| Field | Buyer input | Evidence check | Reject or unknown |
|---|---|---|---|
| model/part reference | Use the full buyer reference and exact offered variant. | Keep listing, drawing and reply identifiers together. | A family label does not establish a particular variant. |
| drawing revision/date | Retain drawing number, revision and date. | Check which revision each evidence item supports. | Do not overwrite the old version when recording a change. |
| unit system | State dimensional units explicitly. | Keep any supported conversion beside the original value. | Missing units cannot be guessed from the image. |
| critical dimension and tolerance | Record buyer-stated dimensions and tolerances with their source. | Only mark a match where the offered evidence supports it. | No default tolerance may fill an unstated requirement. |
| variant exceptions | List substitutions or departures in a separate column. | Ask whether each exception was permitted. | A lower price cannot hide a hard-specification change. |
| change approval | Identify the required decision owner and accepted revision. | Keep the actual acceptance decision and supporting source. | A supplier proposal is not buyer approval. |

## Exclude or resolve

Reject obsolete or unit-mismatched drawing as current; do not calculate unstated tolerances or approve substitution from a photograph.

## Questions to copy into a supplier enquiry

Which drawing revision supports this variant? Are units and tolerances explicit? Who approves the difference before the next step?

## Evidence and price basis

BUYER_STATED is explicit buyer input; SOURCE_OBSERVED is a dated source; DERIVED is labeled interpretation. OBSERVED does not mean SUPPLIER_CONFIRMED. Missing facts remain UNKNOWN; TO_CONFIRM describes the next question. Preserve currency, unit, quantity tier, SKU and date; a listing is not a supplier-confirmed quote. Never infer stock, MOQ waivers or certification.

## References and limits

- [Phoenix Contact PCB terminal manufacturer data](https://www.phoenixcontact.com/en-ca/products/printed-circuit-board-terminal-pts-508-bk-1931819): Drawing, pitch, pin layout, mounting and condition-scoped electrical fields for the named reference only; no interchangeable China substitute.
- [Current free discovery and v4 public resource](https://api.seekapi.ai/mcp): Runtime mode admission and same public sample only; no new purchase or supplier facts.

## Continue

Need a current supplier quote for this requirement? Prepare and review your RFQ for free; supplier screening is optional.

Choose a standalone USD 19.90 live RFQ with no $2.99 prerequisite. We deliver up to three matching suppliers with a comparison of received quotations. We screen candidates, handle inquiries in Chinese, translate replies and follow up. You are guaranteed at least one qualified supplier-confirmed quotation within three China business days after payment and brief confirmation—or the full RFQ service fee is refunded to your original payment method.

[Prepare my RFQ for free](https://api.seekapi.ai/checkout/stripe/rfq) · [Agent: prepare a free RFQ with MCP](/for-agents#rfq-free-mcp) · [Free RFQ Python example](/for-agents#rfq-free-mcp) · [See the RFQ report format](/proof) · [Delivery and service-fee guarantee](/china-supply-check/live-rfq-compare)

Prefer a shortlist first? [Review optional USD 2.99 supplier screening](/china-supply-check#image-supply-check) or [prepare a screening brief with MCP](/for-agents#china-supply-check-mcp). [Optional screening SDK examples](/for-agents#free-quickstart) · [Inspect the supplier screening sample](/china-supply-check/sample)

[Parent sourcing library](/sourcing) · [Related category and existing guidance](/china-supply-check/moq-specification-screening)
