import Link from 'next/link';
import { rfqBasicCopy, rfqBuyerEntry } from '@/lib/rfq-basic-copy';
import { CTA, Eyebrow, PageShell, ProcessSteps, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'How to Get a China Supplier Quote — $19.90 RFQ | SeekAPI',
  'Prepare a sourcing brief free, confirm requirements and pay $19.90 once. We contact up to 3 suppliers; a qualified quote in 3 China business days after payment and brief confirmation, or your RFQ fee back.',
  '/how-it-works',
);

const steps = [
  {title: 'Prepare your requirement for free', body: 'Start with a product link, photo or written requirement. Add the specifications, quantity, unit and destination that matter to your purchase.'},
  {title: 'Review, confirm and pay $19.90 once', body: 'Edit the brief until it matches your requirement. Confirm it, then approve the one-time Verified RFQ Basic service fee through Stripe Hosted Checkout. Buy Basic directly; supplier screening is optional.'},
  {title: 'We contact and follow up with suppliers', body: 'SeekAPI contacts up to three distinct matched Chinese suppliers, translates your requirements and follows up on their replies.'},
  {title: 'Compare the supplier-confirmed quotes', body: 'Read your Human report, Agent JSON and Evidence manifest. Compare price, quantity, MOQ, specification fit, validity and commercial terms on the same requirement.'},
];

export default function Page() {
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>SeekAPI Verified RFQ Basic · USD 19.90 once</Eyebrow>
      <h1>One brief. Supplier contact. A current quote.</h1>
      <p>Give us the product and the requirements you need quoted. We contact up to three matched Chinese suppliers, translate and follow up, then compare their replies. Preparation is free; you review the requirement before payment.</p>
      <div className="button-row"><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a><Link className="text-link" href="/china-supply-check/live-rfq-compare">Service details · $19.90</Link></div>
    </div></section>
    <section className="section"><div className="container">
      <SectionTitle eyebrow="Delivery and guarantee" title="A qualified quote in three China business days, or your RFQ service fee back." body={rfqBasicCopy}/>
      <p>The clock starts after payment and essential requirement confirmation. Every qualified response received is included in your comparison; the target is at least one current supplier-confirmed quote.</p>
    </div></section>
    <section className="section"><div className="container">
      <SectionTitle eyebrow="Your RFQ journey" title="Free preparation comes before payment."/>
      <ProcessSteps steps={steps}/>
      <div className="link-list"><Link href="/sourcing/rfq-templates/china-supplier-brief">Buyer brief worksheet</Link><Link href="/sourcing/rfq-templates/supplier-quote-comparison">Quote-comparison worksheet</Link><Link href="/for-agents#rfq-requirement-prepare">Agent REST instructions</Link></div>
    </div></section>
    <section className="section"><div className="container">
      <h2>Need a supplier shortlist before contacting anyone?</h2>
      <p>China Supply Check is the optional USD 2.99 image Stripe or 2.99 USDC text/model x402 service. It compares supplier candidates, dated listing evidence, MOQ and specification fit. Choose Basic directly when you need supplier contact and current quotations.</p>
      <Link className="text-link" href="/china-supply-check">Compare the optional screening service</Link>
    </div></section>
    <section className="section"><div className="container">
      <h2>Service scope and common questions</h2>
      <details><summary>What is included in the fee and refund?</summary><p>The USD 19.90 fee covers the agreed Basic RFQ service. If the qualified-quote target is missed, the full RFQ service fee is refunded to the original payment method. Goods, samples, inspection, freight and duties are separate. Basic does not authorize goods purchases or supplier payments.</p></details>
      <details><summary>Can I start with an Amazon product link?</summary><p>Yes. Use the link as your product reference, add a photo when helpful, and confirm the exact variant, specifications, quantity and destination. Amazon automatic import is currently off; you can continue with the reference and your confirmed details.</p></details>
      <details><summary>How does an AI Agent use Basic?</summary><p>Use the dedicated Basic HTTPS REST/OpenAPI for discovery, free preparation, confirmation and buyer-approved Stripe payment. The returned Human report, Agent JSON and Evidence manifest share the same facts. Existing authenticated results can be reopened without repayment.</p><Link href="/for-agents#rfq-requirement-prepare">Read the Agent workflow</Link></details>
      <details><summary>What if I need samples or broader procurement support?</summary><p>Ask for a separately agreed scope, fee, recipients and authorization before sample, production, quality or logistics work begins.</p><Link href="/china-supply-chain">Explore China Desk support</Link></details>
    </div></section>
    <CTA title="Start with the product you want quoted." body="Prepare and review your requirement for free. Confirm it before approving the one-time USD 19.90 service fee." primaryLabel="Prepare my RFQ for free" primaryHref={rfqBuyerEntry} secondaryLabel="Service scope and guarantee" secondaryHref="/china-supply-check/live-rfq-compare"/>
  </PageShell>;
}
