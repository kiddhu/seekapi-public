import truth from '@/public/.well-known/csc-commercial-truth.json';

export const rfqBasic = truth.live_rfq;
// One current statement shared by HTML and checked against downloadable worksheets.
// Availability here describes the product; admission for a new purchase is read live.
export const rfqBasicCopy = 'Choose a standalone USD 19.90 live RFQ with no $2.99 prerequisite. We contact up to three matched suppliers and include every qualified response received in your comparison. You are guaranteed at least one qualified supplier-confirmed quotation within three China business days after payment and brief confirmation—or the full RFQ service fee is refunded to your original payment method.';
export const rfqReferenceCopy = 'Start with an Amazon product link, photo or description. Review one editable sourcing brief, confirm the selected variant, quantity and destination, then choose supplier screening or a standalone live RFQ. Add a screenshot or edit a missing detail inline to keep moving with the same request.';
export const rfqServiceDiscovery = {
  buyer_question: 'Find Chinese suppliers from an Amazon product URL, product link or photo; request a current quote for confirmed requirements.',
  screening: {name: 'China Supply Check', purpose: 'Supplier-candidate screening with source evidence and MOQ/specification gaps; no supplier contact.', product_url: 'https://seekapi.ai/china-supply-check'},
  supplier_quote: {name: rfqBasic.name, price: rfqBasic.price, transport: 'HTTPS_JSON_REST', endpoint: rfqBasic.endpoint, openapi_url: rfqBasic.openapi_url, product_url: 'https://seekapi.ai/china-supply-check/live-rfq-compare', prerequisite_screening_purchase: false, admission: rfqBasic.admission},
  reference_policy: rfqReferenceCopy,
  protocol_boundary: 'Basic uses its dedicated REST workflow. The existing $2.99 MCP tools do not execute or charge for Basic. Use the Basic REST endpoint for supplier quotations.',
};

// Activated by the reviewed production capability projection, never by documentation alone.
export const amazonImportSalesCopy = {
 hero: 'Paste an Amazon link. Get matched Chinese suppliers and current quotes.',
 subheading: 'SeekAPI imports the product details, builds a supplier-ready sourcing brief, and helps you move from an Amazon listing to matched Chinese suppliers.',
 choice: 'Choose a USD 2.99 supplier screening or a standalone USD 19.90 live RFQ.',
 primary: 'Find suppliers from this Amazon link',
 secondary: 'View a sample supplier result',
 trust: 'Amazon link import · China supplier matching · Factory and trader evidence · MOQ and price comparison · Supplier-confirmed quotations',
};
export const amazonImportLive = truth.customer_value.amazon_direct_import === 'LIVE';

export const productLinkFaq = [
 {question:'Which service should I choose?',answer:'Choose USD 2.99 screening to compare matched supplier candidates and their product, MOQ and dated price evidence. Choose a standalone USD 19.90 live RFQ for supplier contact and current supplier-confirmed quotations.'},
 {question:'How do I continue when a product detail is missing?',answer:'Keep your product link and sourcing brief. Edit the missing detail inline or add a screenshot or product photo, then review the selected variant, quantity and destination before payment.'},
 {question:'How does factory-first supplier matching work?',answer:'We prioritize production-capable manufacturers and show the evidence behind factory, trading-company and supplier-capability status. Use the evidence and your selected variant to choose the next supplier questions.'},
];
