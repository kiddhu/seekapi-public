import guides from '@/data/sourcing-decisions.json';
import Link from 'next/link';
import { Eyebrow, PageShell } from '@/components/site';
import { pageMetadata } from '@/lib/site';
import { rfqBuyerEntry } from '@/lib/rfq-basic-copy';
import { procurementIntents } from '@/lib/procurement-intents';

export const metadata = pageMetadata('China Sourcing Guides — Briefs, MOQ and Supplier Quotes', 'Practical worksheets for product specifications, MOQ, supplier evidence and quote comparison. Get a current supplier quote with $19.90 Verified RFQ Basic; prepare free.', '/sourcing');

export default function Page() {
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>Free sourcing worksheets</Eyebrow><h1>Turn your sourcing question into a supplier-ready requirement.</h1>
      <p>Use a product link, photo or description to define what you need. Prepare a free brief, then choose standalone USD 19.90 Verified RFQ Basic for supplier contact, translation, follow-up and current quote comparison.</p>
      <div className="button-row"><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a><Link className="text-link" href="/china-supply-check/live-rfq-compare">Delivery and service-fee guarantee</Link></div>
    </div></section>
    <section className="section"><div className="container">
      <h2>Choose the question that matters now</h2>
      <div className="grid-2">
        <article className="feature-card"><h3><Link href="/sourcing/image-based-supplier-search">I have a product photo or link</Link></h3><p>Turn a visual reference into exact specifications and permitted substitutions.</p></article>
        <article className="feature-card"><h3><Link href="/sourcing/rfq-templates/china-supplier-brief">I need a supplier-ready brief</Link></h3><p>Keep quantity, units, destination and must-match requirements together.</p></article>
        <article className="feature-card"><h3><Link href="/sourcing/rfq-templates/supplier-quote-comparison">I need to compare supplier quotes</Link></h3><p>Put MOQ, price basis, delivery terms and specification differences on the same basis.</p></article>
        <article className="feature-card"><h3><Link href="/china-supply-check">I need a shortlist first</Link></h3><p>Use optional $2.99 supplier screening. Start Basic directly when you need suppliers contacted.</p></article>
      </div>
      <p><Link href="/for-agents#rfq-requirement-prepare">Agent: prepare a free RFQ through REST</Link> · <Link href="/for-agents#free-quickstart">Developer: run the free MCP screening example</Link> · <Link href="/china-supply-check/sample">Inspect a supplier screening sample</Link></p>
    </div></section>
    <section className="section"><div className="container"><h2>Specification and evidence worksheets</h2><div className="grid-2">{guides.map(g => <article className="feature-card" key={g.id}><h3><Link href={g.canonical_path}>{g.h1}</Link></h3><p>{g.direct_answer}</p></article>)}</div>
      <h2>Category requirements</h2><p><Link href="/china-supply-check/fasteners">Fasteners</Link> · <Link href="/china-supply-check/connectors">Connectors</Link> · <Link href="/china-supply-check/packaging">Packaging</Link></p>
    </div></section>
    <section className="section"><div className="container grid-2">{procurementIntents.map(g => <article className="feature-card" key={g.slug}><h2><Link href={'/sourcing/'+g.slug}>{g.title}</Link></h2><p>{g.question}</p></article>)}</div></section>
    <section className="section"><div className="container"><h2>Ready for a current supplier quote?</h2><p>We contact up to three matched suppliers. At least one current qualified quote within three China business days after payment and essential requirement confirmation, or your full RFQ service fee back.</p><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a><div className="link-list"><Link href="/china-supply-check/live-rfq-compare">Verified RFQ Basic · USD 19.90</Link><Link href="/for-agents">Agent instructions</Link><Link href="/china-desk">China-side procurement desk</Link></div></div></section>
  </PageShell>;
}
