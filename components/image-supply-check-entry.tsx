import {cscPaymentModesCopy} from '@/lib/csc-commercial-truth';
export const imageCardEntry = 'https://api.seekapi.ai/checkout/stripe/image';

/** Links to the existing purchase flow; rendering never creates a draft or payment. */
export function ImageSupplyCheckEntry() {
  return <section className="section section-tight" id="image-supply-check" aria-labelledby="image-supply-check-title">
    <div className="container">
      <div className="eyebrow">Start with a photo · China Supply Check</div>
      <h2 id="image-supply-check-title">Take a product photo. Find suppliers worth comparing.</h2>
      <p>Upload or take one product photo and add optional notes, such as material, colour, size or quantity. Review and edit the free brief, then explicitly confirm before a $2.99 Stripe-hosted payment. The entry checks current availability; opening it does not charge you.</p>
      <div className="button-row"><a className="button" href={imageCardEntry}>Start with a product photo — $2.99</a><a className="button button-ghost" href="/for-agents#china-supply-check-mcp">Use an Agent instead</a></div>
      <p>On successful screening, receive three actionable matched supplier candidates with source links, product fit, MOQ and dated price evidence, in an English report and Agent JSON. Use the comparison to choose the next suppliers to approach.</p>
      <details><summary>Service guarantee and scope</summary><p>Screening compares supplier evidence for the main product. Review the report for candidate count, selected variant, quote questions and any accessory requirements. For supplier-confirmed quotations, choose the standalone USD 19.90 live RFQ.</p><p>{cscPaymentModesCopy}</p></details>
      <p>Already paid? Use your saved private result and recovery controls; do not pay again to reopen the same order. Agents should read live MCP discovery before preparing or purchasing through x402.</p>
    </div>
  </section>;
}
