# What should a China supplier brief contain before a free preparation?

Write the product or model, quantity, unit and the requirements that would make an offer unacceptable. Say whether alternatives are allowed, and leave uncertain information explicit rather than guessing it. Review the prepared brief before a separate purchase. This checklist helps organize a requirement and later supplier questions; copying it neither sends an RFQ nor authorizes payment or supplier contact.

Materially updated: 2026-10-16

## When to use this checklist

Use this when you can describe the product and want a free, editable requirement draft. The synthetic example below shows the complete text-input shape; replace it with your own buyer-stated requirements and inspect current tool discovery before preparing.

Editorial decision aid: this does not obtain quotations, contact suppliers or approve product conformity.

## Minimum buyer brief

Name the product or model, give a positive whole-number quantity and unit, list up to five explicit must-match attributes, and say whether substitution is allowed. Keep unsupported extra context outside the strict text draft; never infer it from a photograph.


## Copy a complete synthetic text brief

This invented M6 washer brief is a format example, not a real order or offer. Replace the buyer-stated values, then review the returned prepared draft. Destination and other unsupported properties must not be added to this strict text draft.

```json
{
  "draft": {
    "input": {
      "text": "M6 flat washer, 304 stainless steel"
    },
    "quantity": 1000,
    "unit": "pcs",
    "must_match": [
      {
        "attribute": "size",
        "expected": "M6"
      },
      {
        "attribute": "material",
        "expected": "304 stainless steel"
      }
    ],
    "product_name": "M6 flat washer",
    "model_or_reference": null,
    "substitution_allowed": false
  }
}
```

[Download the complete public fixture and capability observations](/developers/free-mcp-quickstart/fixtures/free-journey.json) · [Run and test this input with the official SDK examples](/for-agents#free-quickstart).

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

Preparation does not purchase or contact suppliers. Image Stripe USD 2.99 and text/model x402 2.99 USDC are separate paid routes; image x402 and text/model Stripe are OFF in the dated observation. Check live admission. SeekAPI Verified RFQ Basic is a standalone USD 19.90 Stripe service with no $2.99 prerequisite. We contact up to three distinct suppliers and target at least one current supplier-confirmed qualified quote for your confirmed product, specifications and quantity within three China business days after payment and essential requirement confirmation. Otherwise RFQ_INCOMPLETE means a full refund of this RFQ service fee to the original payment method. Three quotes, a particular price, original-factory identity and procurement success are not guaranteed. Check current runtime admission before a new purchase. [Review Basic and prepare for free](https://seekapi.ai/china-supply-check/live-rfq-compare).
