import truth from '@/public/.well-known/csc-commercial-truth.json';

export const rfqBasic = truth.live_rfq;
export const rfqBuyerEntry = rfqBasic.endpoint;
export const rfqMcpPreparation = {
  live: true,
  scope: 'FREE_REQUIREMENT_PREPARATION',
  transport: 'STREAMABLE_HTTP_MCP',
  endpoint: 'https://api.seekapi.ai/mcp',
  discover_tool: 'discover_rfq_basic_v0',
  prepare_tool: 'prepare_rfq_basic_v0',
  prepare_price: {amount_minor: 0, currency: 'USD'},
  service_price: rfqBasic.price,
  service_price_applies_to: 'RFQ_SERVICE_AFTER_BUYER_CONFIRMATION',
  free_preparation_when_new_purchases_paused: true,
  prerequisite_screening_purchase: false,
  input_schema: 'RFQ_AGENT_INTENT_V2',
  input_schema_authority: 'discover_rfq_basic_v0.input_schema',
  input_scope: 'TEXT_AND_URL_REFERENCES_ONLY_NO_ASSETS',
  source_url_resolution: 'REFERENCE_ONLY_NO_FETCH',
  buyer_continuation: {url: rfqBuyerEntry, action: 'IMPORT_PRIVATE_INTENT_REVIEW_CONFIRM_PAY_WHEN_ADMITTED'},
  confirmation_and_payment: 'BUYER_CONTINUES_IN_EXISTING_BROWSER_FLOW',
  order_effects: 0,
  payment_effects: 0,
  supplier_contact_effects: 0,
  provider_effects: 0,
  availability_authority: 'Fresh MCP discovery; current admission is rechecked before payment.',
};
export const rfqSalesSummary = 'Get a current supplier-confirmed quote for a one-time USD 19.90. We contact up to three matched Chinese suppliers, translate and follow up, then compare their replies. Prepare your requirement for free; Basic is available directly without a $2.99 screening purchase. At least one qualified quote within three China business days after payment and essential requirement confirmation, or a full RFQ service-fee refund to the original payment method.';
// One current statement shared by HTML and checked against downloadable worksheets.
// Availability here describes the product; admission for a new purchase is read live.
export const rfqBasicCopy = 'Choose a standalone USD 19.90 live RFQ with no $2.99 prerequisite. We contact up to three matched suppliers and include every qualified response received in your comparison. You are guaranteed at least one qualified supplier-confirmed quotation within three China business days after payment and brief confirmation—or the full RFQ service fee is refunded to your original payment method.';
export const rfqReferenceCopy = 'Start with an Amazon product link, photo or description. Review one editable sourcing brief, confirm the selected variant, quantity and destination, then choose supplier screening or a standalone live RFQ. Add a screenshot or edit a missing detail inline to keep moving with the same request.';
export const rfqServiceDiscovery = {
  buyer_question: 'Get a current Chinese supplier quote from a product link, photo or sourcing requirement for a one-time USD 19.90.',
  description: rfqSalesSummary,
  recommended_next_action: {action: 'FREE_RFQ_PREPARATION', human_url: rfqBuyerEntry, agent_instructions_url: 'https://seekapi.ai/for-agents#rfq-free-mcp'},
  screening: {name: 'China Supply Check', purpose: 'Supplier-candidate screening with source evidence and MOQ/specification gaps; no supplier contact.', product_url: 'https://seekapi.ai/china-supply-check'},
  supplier_quote: {name: rfqBasic.name, price: rfqBasic.price, transport: 'HTTPS_JSON_REST', endpoint: rfqBasic.endpoint, openapi_url: rfqBasic.openapi_url, product_url: 'https://seekapi.ai/china-supply-check/live-rfq-compare', prerequisite_screening_purchase: false, admission: rfqBasic.admission, free_preparation_mcp: rfqMcpPreparation},
  reference_policy: rfqReferenceCopy,
  protocol_boundary: 'Free RFQ MCP tools prepare a private requirement. The buyer imports it into the existing Basic form to review, confirm and pay USD 19.90 once. Confirmation, payment and authenticated delivery use the dedicated HTTPS REST/browser lifecycle. The optional $2.99 screening tools do not execute or charge for Basic.',
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
