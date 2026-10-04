import Link from 'next/link';
import { CTA, Eyebrow, FeatureCard, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'China Supplier Candidates with Price, MOQ and Spec Evidence | SeekAPI',
  'Describe a product or model, quantity and must-have specs. A successful check returns three source-linked China B2B shop candidates with dated price evidence and certification fields when available. Free MCP preparation; 2.99 USDC per accepted check via x402, with Stripe card checkout being enabled and separate order and payment confirmation.',
  '/china-supply-check',
);

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'SeekAPI China Supply Check',
  serviceType: 'China supplier listing comparison',
  url: 'https://seekapi.ai/china-supply-check',
  provider: { '@id': 'https://seekapi.ai/#organization' },
  description: 'Screen China B2B shop listings for a specified product or model, requested quantity and must-have specifications. A successful completed check returns three distinct evidence-backed candidates worth advancing to RFQ with source-linked observed listing price, MOQ, specification fit, exclusions and unknowns. An order requires confirmed scope and a supported payment path before execution.',
};

export default function ChinaSupplyCheckPage() {
  return <PageShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <section className="page-hero"><div className="container">
      <Eyebrow>China Supply Check · Agent-ready sourcing research</Eyebrow>
      <h1>Find China supplier candidates with evidence you can inspect.</h1>
      <p>Give SeekAPI a written product description or model, requested quantity and must-have specifications. On a successful completed check, it screens China B2B shop listings and returns three distinct evidence-backed candidates worth advancing to RFQ with source-linked observed listing price, MOQ, specification fit, exclusion reasons and unknowns.</p>
      <div className="button-row"><Link className="button" href="/china-supply-check/sample">Inspect the sample summary</Link><Link className="button button-ghost" href="/for-agents#china-supply-check-mcp">Prepare via an MCP client</Link></div>
      <p><a className="text-link" href="mailto:support@seekapi.ai?subject=China%20Supply%20Check%20order%20question">Ask support about an order</a>. Sending a message does not accept an order or authorize payment.</p>
      <p><Link className="text-link" href="/checkout">Card checkout &amp; purchase help</Link></p>
      <p className="hero-note">China Supply Check costs 2.99 USDC on Base per accepted check. Free Product Brief preparation uses public MCP. SeekAPI confirms scope and a supported payment path before accepting an order; this page does not collect payment or contact suppliers. Current accepted CSC orders use the Agent MCP x402 path. Stripe Checkout USD 2.99 is being enabled; card checkout is not open for purchase.</p>
    </div></section>
    <section className="section"><div className="container"><p>Supplier RFQ-worthiness and exact product qualification are separate. The successful check delivers three evidence-backed supplier candidates worth advancing to RFQ; exact product specifications and requested-quantity fit are reported with their supporting evidence or remaining gaps.</p>
      <article className="definition"><h2>What is China Supply Check?</h2><p>China Supply Check screens China B2B platform-shop listings against a buyer’s product or model, quantity and hard specifications. On a successful paid check, it returns three distinct documented shop candidates with source links, observed listing-price basis, MOQ and quantity fit, specification matches, exclusions and unknowns. If three cannot be supported, it reports the shortage. Certification, company-registration and production-versus-trade identity evidence is reported per candidate when the listing or a bound source provides it; a published listing price is dated supplier commercial evidence with its currency, unit, tier and MOQ conditions, while a confirmed reply for your exact RFQ is a separate step. Free Product Brief preparation is available through an MCP-capable client. A paid order requires separate scope and payment confirmation; supplier outreach is not included in this check.</p></article><SectionTitle eyebrow="The sourcing decision" title="One product brief. Three shop candidates worth advancing to RFQ on success." body="The fee buys a bounded, source-linked comparison: search and duplicate screening, hard-specification and MOQ checks, observed price normalization, explicit exclusions and an editable RFQ starting point. If fewer than three qualify, SeekAPI reports the shortage rather than inventing suppliers."/>
      <div className="grid-3">
        <FeatureCard index="01" title="State what must match" body="Provide a text product specification or model/part number, positive quantity and unit, up to five hard attribute requirements and whether substitutions are permitted."/>
        <FeatureCard index="02" title="Screen listing evidence" body="Compare the named item, material or other required specifications, minimum order quantity and compatible units. Exclude hard mismatches and duplicate documented shop IDs."/>
        <FeatureCard index="03" title="Review the evidence" body="For each of three distinct shop candidates worth advancing to RFQ on a successful result, inspect source links and observation time, displayed price currency/unit/tier if shown, MOQ and quantity fit, matched or unknown facts, and exclusions."/>
      </div>
      <div className="link-list"><Link className="text-link" href="/sourcing">China supplier sourcing guides</Link><Link className="text-link" href="/china-supply-check/moq-specification-screening">How MOQ and specification screening works</Link><Link className="text-link" href="/china-supply-check/alternatives">Compare sourcing workflows</Link></div>
    </div></section>
    <section className="section section-dark"><div className="container">
      <SectionTitle eyebrow="Evidence limits" title="Read the supplier-published price with its commercial conditions." body="A display price is a dated platform observation, possibly a range or tier. Its currency, per-unit or pack basis and applicable quantity can differ from your requested order. A stated MOQ is not stock or a promise to make an exception. A current supplier quotation or EXW term needs a direct reply for your exact RFQ and terms."/>
      <p>The reported identity is a documented B2B platform shop. Certification, company-registration, production-versus-trade identity, the available shop or listing contact path, current availability and lead time are reported per candidate when the listing or a bound source provides them; fields without such evidence are marked for that candidate, and a confirmed direct reply is distinct from an available contact.</p>
      <div className="link-list"><Link className="text-link" href="/china-supply-check/listing-price-vs-quote">Read the price and quotation example</Link><Link className="text-link" href="/china-supply-check/sample">See the production acceptance summary</Link><Link className="text-link" href="/china-supply-check/fasteners">Fastener screening</Link><Link className="text-link" href="/china-supply-check/packaging">Packaging screening</Link><Link className="text-link" href="/china-supply-check/connectors">Connector screening</Link></div>
    </div></section>
    <section className="section"><div className="container">
      <SectionTitle eyebrow="Next action" title="Need a current answer? Live RFQ Compare is a separate future service." body="The planned USD 19.90 Live RFQ Compare would use one RFQ that you edit and confirm, with up to three selected recipients. After separate payment and authorization, one human outreach round over a 72-hour response window would request current price, availability, MOQ and lead time. Replies are not guaranteed, and this service is not open for purchase."/>
      <div className="link-list"><Link className="text-link" href="/china-supply-check/live-rfq-compare">How the RFQ handoff would work</Link></div>
    </div></section>
    <section className="section"><div className="container"><p>Before placing an order, read the <Link className="text-link" href="/terms">Service Terms</Link> and <Link className="text-link" href="/privacy">Privacy Notice</Link>. A free brief or support question does not accept an order.</p></div></section>
    <CTA title="Inspect the evidence before deciding." body="The sample summary records an authorized production acceptance; the separate archived V4 example is a historical evidence-format sample preserved for provenance." primaryLabel="View sample summary" primaryHref="/china-supply-check/sample" secondaryLabel="Connect free MCP" secondaryHref="/for-agents#china-supply-check-mcp"/>
  </PageShell>;
}
