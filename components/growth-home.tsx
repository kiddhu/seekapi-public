import {amazonImportSalesCopy,amazonImportLive} from '@/lib/rfq-basic-copy';
import {readPublicSamplePublication} from '@/lib/public-agent-sample';
import { ProductFirstMethod } from '@/components/product-first-method';
import { cscPaymentCopy, cscPaymentModesCopy } from '@/lib/csc-commercial-truth';
import Link from 'next/link';
import { Eyebrow, FeatureCard, Footer, Header, SectionTitle } from '@/components/site';

export type HomepageVariant = 'a' | 'b' | 'c';
const variants = {
  a: {
    heading: 'Find matched Chinese suppliers and current quotes.',
    lead: 'Start with an Amazon product link, photo or description. Build an editable sourcing brief, then choose USD 2.99 supplier screening or a standalone USD 19.90 live RFQ. Review once and move toward your next supplier decision.',
  },
  b: {
    heading: 'Turn a China sourcing brief into an evidence-screened shortlist.',
    lead: 'Start with a product or model, quantity and must-have specifications. On a successful check: three distinct B2B shop candidates, price basis, MOQ/spec fit, source links, differences and next steps.',
  },
  c: {
    heading: 'Compare China listings before a quote.',
    lead: 'Screen a product or model, quantity and hard specifications. A successful check documents three qualifying shop candidates; it honestly reports a shortage if fewer qualify.',
  },
} satisfies Record<HomepageVariant, { heading: string; lead: string }>;

function BriefIllustration({ variant }: { variant: HomepageVariant }) {
  return <aside className="growth-brief" aria-label="Static product brief illustration; no submission">
    <span className="growth-label">Illustrative brief · no submission</span>
    {variant !== 'c' ? <dl className="growth-inputs">
      <div><dt>Product / model</dt><dd>M6 flat washer</dd></div>
      <div><dt>Quantity + unit</dt><dd>500 pieces</dd></div>
      <div><dt>Must-have specification</dt><dd>304 stainless steel</dd></div>
    </dl> : <><p className="growth-example-request">M6 flat washer · 500 pieces · 304 stainless steel</p><p className="growth-outcome">On success: three distinct actionable supplier candidates. Fewer qualify? We report the shortage.</p></>}
    {variant === 'c' ? <div className="growth-result">
      <span className="growth-label">Archived historical example · V4 prefix</span>
      <dl className="growth-inputs">
        <div><dt>Source / observation</dt><dd>China B2B platform listing · 29 Sep 2026</dd></div>
        <div><dt>Observed price basis / MOQ</dt><dd>CNY 0.01 per 个 · MOQ 100 个</dd></div>
        <div><dt>Details to confirm</dt><dd>Price-tier applicability at 500 pieces, exact pack conversion, certificate, dimensions, stock and quote</dd></div>
      </dl>
      <p className="growth-small">304/M6 appear in the listing title; not a confirmed price for 500 pieces.</p>
      <Link className="text-link" href="/china-supply-check/sample">Inspect the current acceptance summary</Link>
    </div> : <div className="growth-result">
      <span className="growth-label">On a successful check</span>
      <strong>Three actionable supplier candidates</strong>
      <p>Source links · observed price basis · MOQ/spec fit · differences · next steps</p>
      <p className="growth-small">Fewer qualify? The report states the shortage. It does not pad the shortlist.</p>
    </div>}
  </aside>;
}

export function GrowthHome({ variant = 'a' }: { variant?: HomepageVariant }) {
  const sampleAvailable=readPublicSamplePublication()!==null;
  const copy = variants[variant];
  return <><Header /><main id="main-content">
    <section className={'growth-hero growth-variant-' + variant}><div className="container growth-hero-grid">
      <div className="growth-copy">
        <Eyebrow>Source from China</Eyebrow>
        <h1>{variant==='a'&&amazonImportLive?amazonImportSalesCopy.hero:copy.heading}</h1>
        <p className="growth-lead">{variant==='a'&&amazonImportLive?amazonImportSalesCopy.subheading+' '+amazonImportSalesCopy.choice:copy.lead}</p><p>China supplier matching · Factory and trader evidence · MOQ and price comparison · Supplier-confirmed quotations with live RFQ</p>
      </div>
      <BriefIllustration variant={variant} />
      <div className="growth-actions">
        <div className="button-row">
          <Link className="button" href="/china-supply-check/live-rfq-compare#product-link">Find suppliers from this Amazon link</Link>
          {sampleAvailable?<Link className="text-link" href="/china-supply-check/sample">View a sample supplier result</Link>:null}
        </div>
        <p className="growth-availability">$2.99: evidence-backed supplier screening. $19.90: up to three matched suppliers contacted; at least one qualified quote in three China business days after payment and brief confirmation, or the full RFQ service fee is refunded.</p>
        <Link className="growth-agent-link" href="/for-agents#china-supply-check-mcp">Using an AI Agent? Connect free MCP →</Link>
      </div>
    </div></section>
    {sampleAvailable?<>    <section className="section growth-proof"><div className="container">
      <SectionTitle eyebrow="Inspect the evidence" title="Read the complete three-candidate comparison." body="The current anonymous historical reconstruction includes three DIRECT_MATCH candidates, score components, source factory tiers, trust explanations and RFQ unknowns. It is a report you can inspect, not a current quote or an independent customer testimonial." />
      <div className="growth-proof-row">
        <p><strong>Product-first V2.</strong> All three public candidates have 0/100 commercial scores and F0 source tiers because the preserved evidence does not support those credits. Read the complete <Link className="text-link" href="/china-supply-check/sample">current three-candidate report</Link> or <a className="text-link" href="/china-supply-check/sample.json">download its exact Agent JSON</a>.</p>
        <Link className="button" href="/china-supply-check/sample">Read the complete sample</Link>
      </div>
    </div></section>
</>:<section className="section growth-proof"><div className="container"><h2>Preview your sourcing journey.</h2><p>Review supplier evidence, compare services and prepare your sourcing brief for free.</p><Link className="text-link" href="/for-agents">Connect and read live discovery</Link></div></section>}
    <section className="section"><div className="container">
      <SectionTitle eyebrow="How screening works" title="A specific product in. Evidence for your next decision out." />
      <div className="grid-3">
        <FeatureCard index="01" title="Describe the exact requirement" body="Product or model, positive quantity and unit, must-have specifications and permitted substitutions. Free preparation now requires an MCP-capable client." />
        <FeatureCard index="02" title="Screen the listing evidence" body="A paid check compares hard requirements and MOQ, excludes mismatches and duplicate shops, and preserves missing facts as UNKNOWN." />
        <FeatureCard index="03" title="Review the candidates and gaps" body="Three distinct documented shop candidates on success, with dated source evidence, observed price basis, exclusions and an RFQ starting point. A shortage is reported honestly." />
      </div>
      <div className="link-list"><Link className="text-link" href="/how-it-works">See the screening and next-action path</Link><Link className="text-link" href="/sourcing">Find, screen and compare China suppliers: eight guides</Link></div>
    </div></section>
    <section className="section"><div className="container">
      <SectionTitle eyebrow="One China-side partner" title="Keep moving after the supplier shortlist." body="China Supply Check is the live, low-cost entry. For the next China-side task, ask SeekAPI to review a separate human-service scope. No supplier outreach or spending is authorized by the screening purchase." />
      <div className="grid-3">
        <FeatureCard index="01 · LIVE" title="Find and screen suppliers" body="A successful 2.99 USDC China Supply Check returns three distinct candidates worth advancing to RFQ, with source evidence, price basis, MOQ fit and field-specific gaps. MCP discovery is available; check current admission for each payment mode." />
        <FeatureCard index="02 · BASIC RFQ" title="Contact and compare" body="SeekAPI Verified RFQ Basic is USD 19.90 through standalone Stripe Hosted Checkout, with no $2.99 prerequisite. Contact up to three distinct suppliers for a current quote bound to your confirmed requirement." />
        <FeatureCard index="03 · SCOPE REVIEW" title="Samples and procurement execution" body="Ask for a defined China-side assignment: sample or production follow-up, supplier communication, quality coordination and export or logistics handoffs. Delivery, price and responsibility are agreed per task; no automatic execution API is live." />
      </div>
      <div className="link-list"><Link className="text-link" href="/for-agents#agent-human-desk">Agent handoff and current interface status</Link><Link className="text-link" href="/china-supply-chain">Explore China-side procurement work</Link><Link className="text-link" href="/start?audience=agent">Prepare a human-reviewed request</Link></div>
    </div></section>
    <section className="section section-dark"><div className="container">
      <SectionTitle eyebrow="Before requesting a quote" title="Know what a listing can — and cannot — establish." body="An observed listing price is published supplier commercial evidence with its currency, unit, tier and MOQ conditions; a stated MOQ is not a stock promise. Certification, company-registration and production-versus-trade identity evidence is reported per candidate when available." />
      <p>SeekAPI Verified RFQ Basic targets at least one current supplier-confirmed qualified quote within three China business days after payment and essential requirement confirmation. Otherwise RFQ_INCOMPLETE means a full refund of this RFQ service fee to the original payment method. Human, Agent and Evidence outputs share the same facts and unknowns. Goods purchases are not authorized; check current admission before paying.</p>
      <div className="link-list">
        <Link className="text-link" href="/china-supply-check/listing-price-vs-quote">Listing price or supplier quote?</Link>
        <Link className="text-link" href="/china-supply-check/moq-specification-screening">Does MOQ fit your quantity and unit?</Link>
        <Link className="text-link" href="/china-supply-check/live-rfq-compare">Review Basic RFQ and prepare for free</Link>
      </div>
    </div></section>
    <section className="section"><div className="container">
      <SectionTitle eyebrow="Sourcing knowledge" title="Different products. Different screening questions." body="Worked decision examples explain category-specific errors. Synthetic examples are labeled; they do not claim current suppliers, prices or stock." />
      <div className="growth-question-grid">
        <Link href="/china-supply-check/fasteners"><span>Fasteners</span><h3>Does the grade, size and piece count match?</h3><p>Material, standard, dimensions and pack units.</p></Link>
        <Link href="/china-supply-check/packaging"><span>Packaging</span><h3>Does custom print change MOQ and setup?</h3><p>Box dimensions, artwork, tooling and cartons versus pieces.</p></Link>
        <Link href="/china-supply-check/connectors"><span>Connectors</span><h3>Is this the exact part and mating fit?</h3><p>MPN, pin count, pitch and unapproved substitutions.</p></Link>
      </div>
    </div></section>
    <ProductFirstMethod/><section className="section growth-next"><div className="container">
      <SectionTitle eyebrow="Choose the next usable action" title="Start with the product; keep the China-side work together." body="Inspect the live screening product, prepare a free MCP brief, or request scope review for a separately authorized human assignment. A brief does not buy a check or contact a supplier." />
      <div className="button-row"><Link className="button" href="/china-supply-check">See China Supply Check</Link>{sampleAvailable?<Link className="button button-ghost" href="/china-supply-check/sample">Read the complete sample</Link>:null}</div>
      <div className="link-list"><Link className="text-link" href="/for-agents">Agent connection guide</Link><Link className="text-link" href="/china-supply-chain">Need broader China Desk support?</Link><Link className="text-link" href="/trust">Evidence and role boundaries</Link><Link className="text-link" href="/support">Contact support</Link><Link className="text-link" href="/discovery-status">Dated discovery status</Link></div>
    </div></section>
  <section className="section"><div className="container"><details><summary>Service scope and payment options</summary><p>{cscPaymentModesCopy}</p></details></div></section></main><Footer /></>;
}
