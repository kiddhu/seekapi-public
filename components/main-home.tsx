import Link from 'next/link';
import {PageShell, Eyebrow, SectionTitle, FeatureCard} from './site';
import {ServiceComparison, rfqGuarantee} from './service-comparison';
import {ProductFirstMethod} from './product-first-method';
import {readPublicSamplePublication} from '@/lib/public-agent-sample';
import {cscPaymentModesCopy} from '@/lib/csc-commercial-truth';
import {rfqBuyerEntry} from '@/lib/rfq-basic-copy';

export function MainHome() {
  const sampleAvailable = readPublicSamplePublication() !== null;
  return <PageShell>
    <section className="main-hero"><div className="container main-hero-grid">
      <div className="main-hero-copy">
        <Eyebrow>China supplier sourcing</Eyebrow>
        <h1>Find Chinese suppliers.<br/>Get quotes you can act on.</h1>
        <p className="main-lead">Start with a photo, link or specifications. Screen supplier candidates for $2.99, or request supplier-confirmed quotes for $19.90. Prepare your brief for free.</p>
        <div className="button-row main-actions"><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a><Link className="button button-ghost" href="/china-supply-check">Check suppliers — $2.99</Link></div>
        <p className="price-cue">USD · One-time service fees · No $2.99 purchase required for RFQ.</p>
        <p className="main-guarantee"><strong>RFQ service guarantee.</strong> {rfqGuarantee} <Link className="text-link" href="/china-supply-check/live-rfq-compare#service-scope">RFQ terms</Link></p>
      </div>
      <aside className="offer-summary" aria-label="Two different sourcing outcomes">
        <span className="eyebrow">Your next sourcing decision</span>
        <div><span className="summary-price">$19.90 <small>USD</small></span><h2>Supplier-confirmed quotations</h2><p>Contact, translation and comparison of current supplier replies.</p></div>
        <div><span className="summary-price">$2.99 <small>USD · photo by card</small></span><h2>Supplier-candidate screening</h2><p>Specifications, MOQ, source links and dated listing-price evidence.</p></div>
        <p className="summary-foot">Independent services. Choose either directly.</p>
      </aside>
    </div></section>
    <ServiceComparison/>
    <section className="section growth-proof"><div className="container">
      <SectionTitle eyebrow="See the evidence" title="Know what you will receive." body="Inspect the report format and the separate historical screening evidence before choosing."/>
      <div className="grid-2 evidence-previews">
        <article className="feature-card"><span className="evidence-label">Synthetic format demonstration</span><h3>RFQ quotation comparison</h3><p>One confirmed requirement, supplier replies, price basis, validity and open commercial questions. This demonstrates format; it is not a supplier reply, current price or customer case.</p><Link className="text-link" href="/proof#rfq-delivery-format">See the RFQ delivery format</Link></article>
        <article className="feature-card"><span className="evidence-label">Historical screening example</span><h3>Supplier-candidate evidence</h3>{sampleAvailable?<><p>Source links, MOQ, specifications and dated listing observations. Historical reconstruction; not a current quote or independent customer testimonial.</p><Link className="text-link" href="/china-supply-check/sample">Read the complete sample</Link><a className="text-link" href="/china-supply-check/sample.json">Download the same Agent JSON</a></>:<p>The public example is currently unavailable. Use live discovery for current product information.</p>}</article>
      </div>
    </div></section>
    <section className="section"><div className="container">
      <SectionTitle eyebrow="How Verified RFQ Basic works" title="One brief. A clear next step."/>
      <div className="grid-3">
        <FeatureCard index="01" title="Prepare for free" body="Start with a product link, photo or description. Review specifications, variant, quantity and destination in one editable brief."/>
        <FeatureCard index="02" title="Review and pay once" body="Confirm your exact requirement before approving the $19.90 USD RFQ service fee, when new purchases are available."/>
        <FeatureCard index="03" title="Compare the evidence" body="Receive a Human report, Agent JSON and Evidence manifest. They share the same supplier replies, quotation conditions and open questions."/>
      </div>
      <div className="link-list"><Link className="text-link" href="/how-it-works">RFQ steps and deliverables</Link><Link className="text-link" href="/for-agents#rfq-free-mcp">Using an AI Agent? Start with the two free RFQ calls</Link></div>
    </div></section>
    <section className="section section-tight"><div className="container faq-list">
      <SectionTitle eyebrow="Before you start" title="Choose with confidence."/>
      <details><summary>Do I need the $2.99 check first?</summary><p>No. SeekAPI Verified RFQ Basic is available directly for $19.90 USD. Supplier screening is optional.</p></details>
      <details><summary>Is a listing price a confirmed quote?</summary><p>Screening records dated listing evidence. RFQ requests current supplier-confirmed quotations for your confirmed requirement.</p></details>
      <details><summary>Can I use a product link?</summary><p>Keep the link in your brief, review and edit the product details, and add a photo if a detail is missing. Automatic extraction depends on currently supported sources.</p></details>
      <details><summary>Already paid?</summary><p><a className="text-link" href="/support#existing-results">Access your existing result.</a> Use your original private link or recovery method; you do not need to buy the same result again.</p></details>
    </div></section>
    <section className="section section-tight"><div className="container">
      <details className="method-details"><summary>How supplier screening evaluates evidence</summary><ProductFirstMethod/></details>
      <details><summary>Screening payment modes and current availability</summary><p>{cscPaymentModesCopy}</p></details>
    </div></section>
    <section className="section growth-next"><div className="container">
      <SectionTitle eyebrow="Start for free" title="Move your sourcing forward." body="Prepare your requirement, review it, then choose the service that answers your next question."/>
      <div className="button-row"><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a><Link className="text-link" href="/china-supply-check">Check suppliers — $2.99</Link></div>
      <div className="link-list"><Link className="text-link" href="/trust">Scope, operator and data</Link><a className="text-link" href="/support#existing-results">Existing results and support</a><Link className="text-link" href="/sourcing">Sourcing guides and worksheets</Link></div>
    </div></section>
  </PageShell>;
}
