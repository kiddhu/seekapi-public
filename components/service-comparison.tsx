import Link from 'next/link';
import {rfqBuyerEntry} from '@/lib/rfq-basic-copy';
import {imageCardEntry} from './image-supply-check-entry';

export const rfqGuarantee = 'At least one qualified supplier quote within three China business days after payment and essential brief confirmation, or your full RFQ service fee is refunded to the original payment method.';

/** Two alternatives, never a required sequence or a combined checkout. */
export function ServiceComparison() {
  return <section className="section service-comparison" id="choose-service" aria-labelledby="choose-service-title">
    <div className="container">
      <div className="section-heading"><div className="eyebrow">Two independent services</div><h2 id="choose-service-title">Choose the result you need.</h2><p>Choose by your next sourcing decision. RFQ is available directly; screening is optional.</p></div>
      <div className="offer-grid">
        <article className="offer-card offer-primary">
          <p className="offer-task">I need current supplier-confirmed quotes.</p>
          <h3>Verified RFQ Basic</h3>
          <p className="offer-price">$19.90 <span>USD · one time</span></p>
          <dl>
            <div><dt>Free start</dt><dd>Prepare and review one editable sourcing brief.</dd></div>
            <div><dt>What you receive</dt><dd>Up to three matching suppliers with a comparison of received quotations. Supplier contact in Chinese, translation and follow-up support the result.</dd></div>
            <div><dt>Evidence basis</dt><dd>Current supplier-confirmed replies tied to your product, specifications and quantity.</dd></div>
            <div><dt>Target and remedy</dt><dd>{rfqGuarantee} The refund covers this RFQ service fee.</dd></div>
            <div><dt>Purchase relationship</dt><dd>No $2.99 purchase required. Goods, samples, freight, duties and separately scoped work are separate.</dd></div>
          </dl>
          <a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a>
          <Link className="text-link" href="/china-supply-check/live-rfq-compare#service-scope">RFQ service scope and terms</Link>
        </article>
        <article className="offer-card">
          <p className="offer-task">I need supplier candidates to shortlist.</p>
          <h3>China Supply Check</h3>
          <p className="offer-price">$2.99 <span>USD · product photo by card</span></p>
          <dl>
            <div><dt>Free start</dt><dd>Prepare and review your editable brief before payment.</dd></div>
            <div><dt>What you receive</dt><dd>On a successful check: three distinct actionable supplier candidates, source links, dated listing-price evidence, MOQ, specifications and gaps. Shortages stay explicit.</dd></div>
            <div><dt>Evidence basis</dt><dd>Observed listing evidence. Supplier contact and confirmed quotations belong to the separate RFQ service.</dd></div>
            <div><dt>Payment choices</dt><dd>Photo: $2.99 USD via Stripe. Text/model: 2.99 USDC on Base via an Agent and x402. Image x402 and text/model Stripe are OFF.</dd></div>
            <div><dt>Service scope</dt><dd>Screening has its own terms. The RFQ quote target and service-fee refund promise apply to RFQ only.</dd></div>
          </dl>
          <a className="button button-ghost" href={imageCardEntry}>Start with a photo — $2.99</a>
          <Link className="text-link" href="/for-agents#china-supply-check-mcp">Text/model screening with an Agent</Link>
        </article>
      </div>
      <p className="availability-note">New purchases depend on current availability and may be paused. The existing buyer entry checks availability before payment. Opening an entry does not charge you. <a className="text-link" href="/support#existing-results">Already paid? Access your existing result.</a></p>
    </div>
  </section>;
}
