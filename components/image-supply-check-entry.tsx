export const imageCardEntry = 'https://api.seekapi.ai/checkout/stripe/image';

/** Links to the existing purchase flow; rendering never creates a draft or payment. */
export function ImageSupplyCheckEntry() {
  return <section className="section section-tight" id="image-supply-check" aria-labelledby="image-supply-check-title">
    <div className="container">
      <div className="eyebrow">Start with a photo · China Supply Check</div>
      <h2 id="image-supply-check-title">Take a product photo. Find suppliers worth comparing.</h2>
      <p>Upload or take one product photo and add optional notes, such as material, colour, size or quantity. Review and edit the free brief, then explicitly confirm before a $2.99 Stripe-hosted payment. The entry checks current availability; opening it does not charge you.</p>
      <div className="button-row"><a className="button" href={imageCardEntry}>Start with a product photo — $2.99</a><a className="button button-ghost" href="/for-agents#china-supply-check-mcp">Use an Agent instead</a></div>
      <p>On a completed image check, receive 1–3 distinct source-backed supplier candidates, an English report and Agent JSON. Fewer qualifying suppliers means an explicit shortage, never invented alternatives. We compare the main product; photographed accessories are not promised.</p>
      <p>Original CNY prices and approximate USD conversions retain their units and tiers. Listed prices are not supplier-confirmed quotations; taxes, freight, customs and destination charges are excluded unless confirmed. Source factory signals are not a SeekAPI independent factory audit. No supplier contact or paid RFQ is included.</p>
      <p>Already paid? Use your saved private result and recovery controls; do not pay again to reopen the same order. Agents should read live MCP discovery before preparing or purchasing through x402.</p>
    </div>
  </section>;
}
