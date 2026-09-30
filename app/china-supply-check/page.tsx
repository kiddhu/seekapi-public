import Link from 'next/link';
import { CTA, Eyebrow, FeatureCard, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'China Supplier Candidates with Price, MOQ and Spec Evidence | SeekAPI',
  'Describe a product or model, quantity and must-have specs. A successful check returns three source-linked China B2B shop candidates. Listing prices are observations, not quotes. Free preparation now; paid check closed.',
  '/china-supply-check',
);

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'SeekAPI China Supply Check',
  serviceType: 'China supplier listing comparison',
  url: 'https://seekapi.ai/china-supply-check',
  provider: { '@id': 'https://seekapi.ai/#organization' },
  description: 'Screen China B2B shop listings for a specified product or model, requested quantity and must-have specifications. A successful completed check returns three distinct qualified candidates with source-linked observed listing price, MOQ, specification fit, exclusions and unknowns. Public paid execution is currently closed.',
};

export default function ChinaSupplyCheckPage() {
  return <PageShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <section className="page-hero"><div className="container">
      <Eyebrow>China Supply Check · Agent-ready sourcing research</Eyebrow>
      <h1>Find China supplier candidates with evidence you can inspect.</h1>
      <p>Give SeekAPI a written product description or model, requested quantity and must-have specifications. On a successful completed check, it screens China B2B shop listings and returns three distinct qualified candidates with source-linked observed listing price, MOQ, specification fit, exclusion reasons and unknowns.</p>
      <div className="button-row"><Link className="button" href="/china-supply-check/sample">Inspect a historical evidence sample</Link><Link className="button button-ghost" href="/for-agents#china-supply-check-mcp">Prepare a free Agent brief</Link></div>
      <p className="hero-note">Planned price: 2.99 USDC on Base per check. Free Product Brief preparation is available through public MCP; the paid run is not open. This page does not collect payment or contact suppliers.</p>
    </div></section>
    <section className="section"><div className="container">
      <SectionTitle eyebrow="The sourcing decision" title="One product brief. Three qualified shop candidates on success." body="The fee buys a bounded, source-linked comparison: search and duplicate screening, hard-specification and MOQ checks, observed price normalization, explicit exclusions and an editable RFQ starting point. If fewer than three qualify, SeekAPI reports the shortage rather than inventing suppliers."/>
      <div className="grid-3">
        <FeatureCard index="01" title="State what must match" body="Provide a text product specification or model/part number, positive quantity and unit, up to five hard attribute requirements and whether substitutions are permitted."/>
        <FeatureCard index="02" title="Screen listing evidence" body="Compare the named item, material or other required specifications, minimum order quantity and compatible units. Exclude hard mismatches and duplicate documented shop IDs."/>
        <FeatureCard index="03" title="Review the evidence" body="For each of three qualified distinct shop candidates on a successful result, inspect source links and observation time, displayed price currency/unit/tier if shown, MOQ and quantity fit, matched or unknown facts, and exclusions."/>
      </div>
      <div className="link-list"><Link className="text-link" href="/china-supply-check/moq-specification-screening">How MOQ and specification screening works</Link><Link className="text-link" href="/china-supply-check/alternatives">Compare sourcing workflows</Link></div>
    </div></section>
    <section className="section section-dark"><div className="container">
      <SectionTitle eyebrow="Evidence limits" title="An observed listing price is not a supplier quote." body="A display price is a dated platform observation, possibly a range or tier. Its currency, per-unit or pack basis and applicable quantity can differ from your requested order. A stated MOQ is not stock or a promise to make an exception. A current supplier quotation or EXW term needs a direct reply for your exact RFQ and terms."/>
      <p>The reported identity is a documented B2B platform shop. Its legal company, actual manufacturer, contactability, certification, current availability and lead time are not independently verified by a listing screen.</p>
      <div className="link-list"><Link className="text-link" href="/china-supply-check/listing-price-vs-quote">Read the price and quotation example</Link><Link className="text-link" href="/china-supply-check/sample">See the source-linked historical sample</Link><Link className="text-link" href="/china-supply-check/fasteners">Fastener screening</Link><Link className="text-link" href="/china-supply-check/packaging">Packaging screening</Link><Link className="text-link" href="/china-supply-check/connectors">Connector screening</Link></div>
    </div></section>
    <section className="section"><div className="container">
      <SectionTitle eyebrow="Next action" title="Need a current answer? Live RFQ Compare is a separate future service." body="The planned USD 19.90 Live RFQ Compare would use one RFQ that you edit and confirm, with up to three selected recipients. After separate payment and authorization, one human outreach round over a 72-hour response window would request current price, availability, MOQ and lead time. Replies are not guaranteed, and this service is not open for purchase."/>
      <div className="link-list"><Link className="text-link" href="/china-supply-check/live-rfq-compare">How the RFQ handoff would work</Link></div>
    </div></section>
    <CTA title="Inspect the evidence before deciding." body="The sample is a historical V4-prefix projection. Its underlying full execution ended TECHNICAL_BLOCKED; it is not a completed customer paid check." primaryLabel="View sample report" primaryHref="/china-supply-check/sample" secondaryLabel="Connect free MCP" secondaryHref="/for-agents#china-supply-check-mcp"/>
  </PageShell>;
}
