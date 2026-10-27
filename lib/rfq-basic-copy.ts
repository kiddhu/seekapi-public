import truth from '@/public/.well-known/csc-commercial-truth.json';

export const rfqBasic = truth.live_rfq;
// One current statement shared by HTML and checked against downloadable worksheets.
// Availability here describes the product; admission for a new purchase is read live.
export const rfqBasicCopy = 'SeekAPI Verified RFQ Basic is a standalone USD 19.90 Stripe service with no $2.99 prerequisite. We contact up to three distinct suppliers and target at least one current supplier-confirmed qualified quote for your confirmed product, specifications and quantity within three China business days after payment and essential requirement confirmation. Otherwise RFQ_INCOMPLETE means a full refund of this RFQ service fee to the original payment method. Three quotes, a particular price, original-factory identity and procurement success are not guaranteed. Check current runtime admission before a new purchase.';
export const rfqReferenceCopy = 'An Amazon product URL or other product link is reference material, not verified specifications or automatic access to the original manufacturer. Confirm the product or model, specifications, quantity and unit, destination, must-have conditions and allowed substitutions. If the listing cannot be read, provide the details in text and an authorized product photo if useful.';
export const rfqServiceDiscovery = {
  buyer_question: 'Find Chinese suppliers from an Amazon product URL, product link or photo; request a current quote for confirmed requirements.',
  screening: {name: 'China Supply Check', purpose: 'Supplier-candidate screening with source evidence and MOQ/specification gaps; no supplier contact.', product_url: 'https://seekapi.ai/china-supply-check'},
  supplier_quote: {name: rfqBasic.name, price: rfqBasic.price, transport: 'HTTPS_JSON_REST', endpoint: rfqBasic.endpoint, openapi_url: rfqBasic.openapi_url, product_url: 'https://seekapi.ai/china-supply-check/live-rfq-compare', prerequisite_screening_purchase: false, admission: rfqBasic.admission},
  reference_policy: rfqReferenceCopy,
  protocol_boundary: 'Basic uses its dedicated REST workflow. The existing $2.99 MCP tools do not execute or charge for Basic. The generic human-task API remains unavailable.',
};
