# What should a China supplier brief contain before a free preparation?

Write the product or model, quantity, unit and the requirements that would make an offer unacceptable. Say whether alternatives are allowed, and leave uncertain information explicit rather than guessing it. Review the prepared brief before a separate purchase. This checklist helps organize a requirement and later supplier questions; copying it neither sends an RFQ nor authorizes payment or supplier contact.

Materially updated: 2026-10-16

## When to use this checklist

Creates copyable strict-schema input plus cross-category question rows; original find-guide gives advice but no reusable complete field contract. Reuses approved topic.rfq_checklist.china_supplier_brief.

Editorial decision aid: this does not obtain quotations, contact suppliers or approve product conformity.

## Minimum buyer brief

Use existing data/brief-copy-examples.json; user context outside the strict text draft is not silently added as destination.

| Field | Buyer input | Evidence check | Reject or unknown |
|---|---|---|---|
| product or model | Meaningful product_name plus input.text or input.model. | Use an actual buyer reference, not an invented catalog part. | Missing product_name or input is invalid. |
| quantity/unit | Positive integer quantity and a named unit. | Record pack contents separately if comparing packs to pieces. | Fractional/null text quantity and unproved conversion fail. |
| up to five must-match fields | attribute/expected pairs from explicit buyer statements. | Retain exact values and units; prioritize if more than five. | Do not silently drop or add a hard constraint. |
| substitution policy | Boolean substitution_allowed for the strict text input. | Review permission before confirmation. | String false is not boolean false. |
| extra human context | Destination/artwork notes remain outside unsupported text properties. | Use another supported input mode or human context when necessary. | Do not add destination to the strict text object. |

## Exclude or resolve

Reject absent required text fields, noninteger quantity, more than five hard constraints without prioritization or unsupported strict-schema properties.

## Questions to copy into a supplier enquiry

Which requirement is mandatory? Is the unit pieces, sets or packs? Which substitution is expressly permitted?

## Evidence and price basis

BUYER_STATED is explicit buyer input; SOURCE_OBSERVED is a dated source; DERIVED is labeled interpretation. OBSERVED does not mean SUPPLIER_CONFIRMED. Missing facts remain UNKNOWN; TO_CONFIRM describes the next question. Preserve currency, unit, quantity tier, SKU and date; a listing is not a supplier-confirmed quote. Never infer stock, MOQ waivers or certification.

## References and limits

- [Current free discovery and v4 public resource](https://api.seekapi.ai/mcp): Runtime mode admission and same public sample only; no new purchase or supplier facts.

## Continue

[Parent sourcing library](/sourcing) · [Related category](/sourcing/find-china-suppliers) · [Human: review a free image brief](/china-supply-check#image-supply-check) · [Agent: free discovery and preparation](/for-agents#china-supply-check-mcp) · [Runnable free SDK examples](/for-agents#free-quickstart) · [Public sample](/china-supply-check/sample)

Preparation does not purchase or contact suppliers. Image Stripe USD 2.99 and text/model x402 2.99 USDC are separate paid routes; image x402 and text/model Stripe are OFF in the dated observation. Check live admission. The proposed $19.90 RFQ service is not open for purchase.
