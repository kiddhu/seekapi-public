import Link from 'next/link';
import { Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Live RFQ Compare — Planned Current Quote Follow-on | SeekAPI',
  'A separate future USD 19.90 service would request current supplier price, availability, MOQ and lead time using one buyer-confirmed RFQ and up to three selected recipients.',
  '/china-supply-check/live-rfq-compare',
);

export default function Page() { return <PageShell>
  <section className="page-hero"><div className="container"><Eyebrow>Planned service · not open for purchase</Eyebrow><h1>Move from listing evidence to a current supplier response.</h1><p>China Supply Check screens observed B2B listing evidence. The separate planned USD 19.90 Live RFQ Compare is for the questions a listing cannot answer: a current price for your quantity and terms, availability, current MOQ and lead time.</p></div></section>
  <section className="section"><div className="container"><SectionTitle eyebrow="Proposed bounded handoff" title="You approve the exact request and recipients first." body="Start from the editable RFQ draft in Next Action. Choose up to three shortlisted shops, revise the exact product/quantity/specification questions, and confirm one RFQ and the recipients. Only separate payment and authorized human outreach would start one contact round and a 72-hour response window. A response, three quotes or a specific price is not guaranteed."/><div className="definition-grid"><div className="definition"><h3>Ask for</h3><p>Current item price with currency, unit and terms; available quantity; current MOQ; production or dispatch lead time; relevant specification evidence.</p></div><div className="definition"><h3>Return honestly</h3><p>Attribute each direct response to its supplier, date and terms. Record no response, ambiguity and unresolved questions rather than inventing a quote.</p></div></div></div></section>
  <section className="section section-dark"><div className="container"><SectionTitle eyebrow="Current status" title="There is no live RFQ checkout or supplier outreach." body="This page describes the planned follow-on, not a current order form. Do not send sensitive files or treat an editable sample as submitted."/><div className="link-list"><Link className="text-link" href="/china-supply-check/sample">Edit the local sample draft</Link><Link className="text-link" href="/china-supply-check">Back to China Supply Check</Link></div></div></section>
</PageShell>; }
