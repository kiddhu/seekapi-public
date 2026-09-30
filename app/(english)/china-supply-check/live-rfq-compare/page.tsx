import Link from 'next/link';
import { Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Live RFQ Compare — Current Supplier Response | SeekAPI',
  'A USD 19.90 service that requests current supplier price, availability, MOQ and lead time using one buyer-confirmed RFQ and up to three selected recipients.',
  '/china-supply-check/live-rfq-compare',
);

export default function Page() { return <PageShell>
  <section className="page-hero"><div className="container"><Eyebrow>USD 19.90 · buyer-confirmed supplier outreach</Eyebrow><h1>Move from listing evidence to a current supplier response.</h1><p>China Supply Check screens observed B2B listing evidence. The separate USD 19.90 Live RFQ Compare is for the questions a listing cannot answer: a current price for your quantity and terms, availability, current MOQ and lead time.</p></div></section>
  <section className="section"><div className="container"><SectionTitle eyebrow="Bounded handoff" title="You approve the exact request and recipients first." body="Start from the editable RFQ draft in Next Action. Choose up to three shortlisted shops, revise the exact product/quantity/specification questions, and confirm one RFQ and the recipients. Separate payment and authorized human outreach start one contact round and a 72-hour response window. A response, three quotes or a specific price is not guaranteed."/><div className="definition-grid"><div className="definition"><h3>Ask for</h3><p>Current item price with currency, unit and terms; available quantity; current MOQ; production or dispatch lead time; relevant specification evidence.</p></div><div className="definition"><h3>Return honestly</h3><p>Attribute each direct response to its supplier, date and terms. Record no response, ambiguity and unresolved questions rather than inventing a quote.</p></div></div></div></section>
  <section className="section section-dark"><div className="container"><SectionTitle eyebrow="Order path" title="Confirm the RFQ before outreach." body="Start the order with SeekAPI, review the exact RFQ and recipients, then authorize payment and one outreach round. Accepted orders may be completed through human-assisted operations while automation is being hardened."/><div className="link-list"><Link className="text-link" href="/start?intent=sourcing">Start Live RFQ Compare</Link><Link className="text-link" href="/china-supply-check/sample">Inspect the sample RFQ</Link><Link className="text-link" href="/china-supply-check">Back to China Supply Check</Link></div></div></section>
</PageShell>; }
