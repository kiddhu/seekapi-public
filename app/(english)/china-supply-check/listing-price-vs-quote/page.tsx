import Link from 'next/link';
import { Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Observed Listing Price vs Supplier Quote | SeekAPI',
  'A displayed China B2B listing price can have a different unit, tier and date from your order. Learn what a current supplier quotation and EXW term require.',
  '/china-supply-check/listing-price-vs-quote',
);

export default function Page() { return <PageShell>
  <section className="page-hero"><div className="container"><Eyebrow>China Supply Check · price evidence</Eyebrow><h1>A displayed price is an observation, not your quotation.</h1><p>China Supply Check records what a source listing showed, including its original currency, unit or pack basis, tier and observation time when available. It does not treat that text as a supplier's current offer for your exact quantity.</p></div></section>
  <section className="section"><div className="container"><SectionTitle eyebrow="A worked distinction" title="Check the unit, tier and date before comparing prices." body="Suppose a listing shows CNY 0.08–0.12 per piece at a stated tier and MOQ 1,000 pieces. A buyer requesting 500 pieces cannot assume the lower price applies, or that the shop will waive MOQ. If the tier, pack or currency is missing, the report should say UNKNOWN rather than calculate a false unit price. These numbers are illustrative, not a live listing."/><div className="definition-grid"><div className="definition"><h3>Observed listing price</h3><p>A dated platform display with a source link and the original price basis. Taxes, freight, terms, quantity applicability and stock may be unknown.</p></div><div className="definition"><h3>Current supplier quotation</h3><p>A direct reply to the exact item, quantity and RFQ, with price, currency, unit, date and commercial terms. The source listing alone is not this reply.</p></div><div className="definition"><h3>EXW / ex-factory</h3><p>A commercial term to record only when the supplier explicitly quotes it and its scope is clear. A low displayed wholesale price does not establish EXW.</p></div></div></div></section>
  <section className="section section-dark"><div className="container"><SectionTitle eyebrow="When to ask" title="Live RFQ Compare is the current-answer step." body="The separate USD 19.90 service uses your confirmed RFQ and selected recipients to request current price, availability, MOQ and lead time. One human outreach round has a 72-hour response window; supplier replies are not guaranteed."/><div className="link-list"><Link className="text-link" href="/china-supply-check/live-rfq-compare">Read the RFQ handoff</Link><Link className="text-link" href="/china-supply-check/sample">Inspect historical listing evidence</Link></div></div></section>
</PageShell>; }
