import Link from 'next/link';
import { Eyebrow, FeatureCard, Footer, Header, SectionTitle } from '@/components/site';

export type HomepageVariant = 'a' | 'b' | 'c';
const variants = {
  a: {
    heading: 'Your China procurement desk, from supplier search to execution.',
    lead: 'SeekAPI helps overseas buyers and AI agents handle China-side procurement. Start with a live China Supply Check for evidence-backed supplier candidates; request separately scoped human help for RFQs, samples and execution.',
  },
  b: {
    heading: 'Turn a China sourcing brief into an evidence-screened shortlist.',
    lead: 'Start with a product or model, quantity and must-have specifications. On a successful check: three distinct B2B shop candidates, price basis, MOQ/spec fit, source links, exclusions and UNKNOWNs.',
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
    </dl> : <><p className="growth-example-request">M6 flat washer · 500 pieces · 304 stainless steel</p><p className="growth-outcome">On success: three distinct shop candidates. Fewer qualify? We report the shortage.</p></>}
    {variant === 'c' ? <div className="growth-result">
      <span className="growth-label">Archived historical example · V4 prefix</span>
      <dl className="growth-inputs">
        <div><dt>Source / observation</dt><dd>China B2B platform listing · 29 Sep 2026</dd></div>
        <div><dt>Observed price basis / MOQ</dt><dd>CNY 0.01 per 个 · MOQ 100 个</dd></div>
        <div><dt>UNKNOWN</dt><dd>Price-tier applicability at 500 pieces, exact pack conversion, certificate, dimensions, stock and quote</dd></div>
      </dl>
      <p className="growth-small">304/M6 appear in the listing title; not a confirmed price for 500 pieces.</p>
      <Link className="text-link" href="/china-supply-check/sample/archived-v4">Inspect the archived example</Link>
    </div> : <div className="growth-result">
      <span className="growth-label">On a successful check</span>
      <strong>Three distinct shop candidates</strong>
      <p>Source links · observed price basis · MOQ/spec fit · exclusions · UNKNOWNs</p>
      <p className="growth-small">Fewer qualify? The report states the shortage. It does not pad the shortlist.</p>
    </div>}
  </aside>;
}

export function GrowthHome({ variant = 'a' }: { variant?: HomepageVariant }) {
  const copy = variants[variant];
  return <><Header /><main id="main-content">
    <section className={'growth-hero growth-variant-' + variant}><div className="container growth-hero-grid">
      <div className="growth-copy">
        <Eyebrow>Source from China</Eyebrow>
        <h1>{copy.heading}</h1>
        <p className="growth-lead">{copy.lead}</p>
      </div>
      <BriefIllustration variant={variant} />
      <div className="growth-actions">
        <div className="button-row">
          <Link className="button" href="/china-supply-check" aria-label="See China Supply Check">{variant === 'a' ? 'See China Supply Check' : 'China Supply Check'}</Link>
          <Link className="button button-ghost" href="/china-supply-check/sample" aria-label="View a sample summary">{variant === 'a' ? 'View the sample summary' : 'Sample summary'}</Link>
          <Link className="button button-ghost" href="/china-desk">China-side procurement desk</Link>
        </div>
        <p className="growth-availability"><strong>China Supply Check: 2.99 USDC per accepted order.</strong> Free brief preparation is available through an MCP-capable client. Agent payment via x402 is live; Stripe card checkout is being enabled. SeekAPI confirms scope and a supported payment path before accepting an order.</p>
        <p className="growth-limits">Published listing prices are dated supplier commercial evidence with scope and quantity conditions; certification and company or production-versus-trade identity evidence is reported per candidate when available.</p>
        <Link className="growth-agent-link" href="/for-agents#china-supply-check-mcp">Using an AI Agent? Connect free MCP →</Link>
      </div>
    </div></section>
    <section className="section growth-proof"><div className="container">
      <SectionTitle eyebrow="Inspect the evidence" title="A production acceptance summary, with an archived example." body="The sample summary records an authorized completed paid check. The separately archived M6 304 washer example shows three primary documented platform shops and source-linked observations; it demonstrates the report format and is preserved for provenance." />
      <div className="growth-proof-row">
        <p><strong>Archived historical example · V4 prefix.</strong> This is not a completed paid customer check, a current quote or stock. See the current <Link className="text-link" href="/china-supply-check/sample">production acceptance summary</Link>.</p>
        <Link className="button" href="/china-supply-check/sample">Read the sample summary</Link>
      </div>
    </div></section>
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
        <FeatureCard index="01 · LIVE" title="Find and screen suppliers" body="A successful 2.99 USDC China Supply Check returns three distinct candidates worth advancing to RFQ, with source evidence, price basis, MOQ fit and field-specific gaps. MCP and x402 are live." />
        <FeatureCard index="02 · SCOPE REVIEW" title="Contact and compare" body="Request help contacting selected suppliers and obtaining current RFQ answers. SeekAPI reviews the brief, recipients, fee and authority before accepting human work. The proposed 19.90 USD Live RFQ Compare package is not open for purchase." />
        <FeatureCard index="03 · SCOPE REVIEW" title="Samples and procurement execution" body="Ask for a defined China-side assignment: sample or production follow-up, supplier communication, quality coordination and export or logistics handoffs. Delivery, price and responsibility are agreed per task; no automatic execution API is live." />
      </div>
      <div className="link-list"><Link className="text-link" href="/for-agents#agent-human-desk">Agent handoff and current interface status</Link><Link className="text-link" href="/china-supply-chain">Explore China-side procurement work</Link><Link className="text-link" href="/start?audience=agent">Prepare a human-reviewed request</Link></div>
    </div></section>
    <section className="section section-dark"><div className="container">
      <SectionTitle eyebrow="Before requesting a quote" title="Know what a listing can — and cannot — establish." body="An observed listing price is published supplier commercial evidence with its currency, unit, tier and MOQ conditions; a stated MOQ is not a stock promise. Certification, company-registration and production-versus-trade identity evidence is reported per candidate when available." />
      <p>Live RFQ Compare is a separate planned human outreach step after you edit and confirm an RFQ and select up to three suppliers. Its planned 72-hour window seeks current answers; replies are not guaranteed. It is not open for purchase or public supplier outreach.</p>
      <div className="link-list">
        <Link className="text-link" href="/china-supply-check/listing-price-vs-quote">Listing price or supplier quote?</Link>
        <Link className="text-link" href="/china-supply-check/moq-specification-screening">Does MOQ fit your quantity and unit?</Link>
        <Link className="text-link" href="/china-supply-check/live-rfq-compare">How would the separate RFQ step work?</Link>
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
    <section className="section growth-next"><div className="container">
      <SectionTitle eyebrow="Choose the next usable action" title="Start with the product; keep the China-side work together." body="Inspect the live screening product, prepare a free MCP brief, or request scope review for a separately authorized human assignment. A brief does not buy a check or contact a supplier." />
      <div className="button-row"><Link className="button" href="/china-supply-check">See China Supply Check</Link><Link className="button button-ghost" href="/china-supply-check/sample">View the sample summary</Link></div>
      <div className="link-list"><Link className="text-link" href="/for-agents">Agent connection guide</Link><Link className="text-link" href="/china-supply-chain">Need broader China Desk support?</Link><Link className="text-link" href="/trust">Evidence and role boundaries</Link><Link className="text-link" href="/support">Contact support</Link><Link className="text-link" href="/discovery-status">Dated discovery status</Link></div>
    </div></section>
  </main><Footer /></>;
}
