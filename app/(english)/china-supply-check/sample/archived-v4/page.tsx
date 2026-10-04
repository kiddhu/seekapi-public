import Link from 'next/link';
import { Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Archived historical China Supply Check sample (V4) — 304 stainless M6 washers',
  'An archived historical V4-prefix evidence-format example. Its full run ended TECHNICAL_BLOCKED and is not a completed customer paid check. Preserved for provenance only.',
  '/china-supply-check/sample/archived-v4',
);

const candidates = [
  { sid: 'b2b-2213157682282259ee', offer: '671663794075', title: '304不锈钢垫片加厚平垫金属超薄平垫圈螺丝圆形华司五金介子M6M8', unit: '个', moq: 100, observedAt: '2026-09-29T06:07:02.202Z', digest: '98d5e2cf296f94a7f8aa30245283f1f196478d7bcf68d17caf9b0e16091bbaca', role: 'Primary · best overall' },
  { sid: 'b2b-221499740032518591', offer: '692902810039', title: '304不锈钢平垫圈加大厚平垫M3M4M5M6M8M10M12M14M16M18M20平垫片', unit: '个', moq: 1, observedAt: '2026-09-29T06:06:58.331Z', digest: '329d62b716c90de93a328085a0e2ba7905bd7825a688d621c6d2bab6d8481cf1', role: 'Primary · best MOQ fit' },
  { sid: 'b2b-220691320759005447', offer: '876803043112', title: '304不锈钢平垫金属垫圈加大介子螺丝加厚圆形不锈钢垫片M4m5m6m8', unit: '件', moq: 1, observedAt: '2026-09-29T06:06:29.606Z', digest: 'fbd7a2f4629df95ab665336313abd37f1da3cc7bfcd7788cf1a64fdaad6044bc', role: 'Primary · qualified' },
] as const;
const additional = { sid: 'b2b-2623471430b32b0', offer: '615843331321', title: '304不锈钢垫片金属加厚垫圈超薄圆形平垫介子螺丝M2M3M4M5M6M8', unit: '件', moq: 500, observedAt: '2026-09-29T06:06:25.965Z', digest: 'd7214d8f7ac5cd458456efe5067d0fd5c67b0257fb20b5456d809aa2d61ab9ad' } as const;
const rfqDraft = [
  'Subject: RFQ — 304 stainless M6 flat washers, 500 pieces',
  'Please confirm the exact M6 variant and 304 material grade.',
  'Quote your current price and currency for 500 pieces, price unit/pack and EXW term only if offered.',
  'Confirm current MOQ, available quantity, production or dispatch lead time, sample availability, packaging and payment terms.',
  'Please provide any available material or grade evidence and identify your legal company/contact.',
  'This is a draft for buyer review. No supplier has been contacted.',
].join('\n');

function Candidate({ c }: { c: typeof candidates[number] }) {
  return <article className="feature-card">
    <span className="feature-index">{c.role}</span><h3>{c.sid}</h3><p>{c.title}</p>
    <p>Observed display price: CNY 0.01 per original listing unit ({c.unit}); applicable quantity tier: UNKNOWN. This is not a current quote for 500 pieces or an EXW price.</p>
    <p>Listing MOQ: {c.moq} {c.unit}. Requested 500 pieces passes the historical count-unit screen; exact pack conversion and availability are UNKNOWN. Listed material: 304 stainless steel; M6 appears in title. Grade certificate and other dimensions: UNKNOWN.</p>
    <p>Profile name and shop URL: UNKNOWN. Legal company, manufacturer, contactability, stock, lead time and supplier quotation: unverified.</p>
    <p>Observed {c.observedAt}; evidence digest <code>{c.digest.slice(0, 16)}…</code>.</p>
    <a className="text-link" href={'https://detail.1688.com/offer/' + c.offer + '.html'}>Original source listing</a>
  </article>;
}

export default function SampleReportPage() {
  return <PageShell>
    <section className="page-hero"><div className="container"><Eyebrow>ARCHIVED HISTORICAL EXAMPLE · V4 prefix</Eyebrow><h1>304 stainless M6 flat washers · 500 pieces</h1><p>This page is preserved for provenance only. It is an archived historical V4-prefix evidence-format example, not a completed paid customer order, a current supplier quotation, or a source of current supplier details. See the <Link className="text-link" href="/china-supply-check/sample">current sample summary</Link> for the authorized production acceptance record.</p><div className="button-row"><Link className="button" href="/china-supply-check/sample">Read the current sample summary</Link><Link className="button button-ghost" href="/china-supply-check">Read the current product contract</Link></div></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="1 · Your Request" title="304 不锈钢 M6 平垫圈" body="Requested quantity: 500 个 (count units). Must-have: explicit 材质=304不锈钢. Substitutions forbidden. No source link supplied; M6 was the model reference."/></div></section>
    <section className="section section-dark"><div className="container"><SectionTitle eyebrow="2 · Executive Answer" title="Three primary documented platform shops in the accepted prefix" body="The historical screen found four distinct product-qualified shop IDs; three are shown as the primary candidates. The fourth is retained below as additional source provenance. Each displayed CNY 0.01 per raw listing unit at its observation time. The price tier for a 500-piece transaction is UNKNOWN; no supplier quote was obtained."/><p>UNKNOWN: grade certificate, other dimensions, stock, lead time, legal company, manufacturer status, contactability and actual supplier quotation. No supplier was contacted. The full run did not reach completed paid fulfillment.</p></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="3 · Candidate evidence" title="Distinct shop IDs, source links and quantity basis" body="The source listings name products, not verified companies. The historical screen treated 件 and 个 as count units for this request; commercial pack equivalence was not confirmed."/><div className="grid-2">{candidates.map(c => <Candidate c={c} key={c.sid}/>)}</div></div></section>
    <section className="section section-dark"><div className="container"><SectionTitle eyebrow="4 · Exclusions and additional evidence" title="The hard screen was not relaxed" body="Two item details lacked a valid direct shop SID; one mandatory material fact was unknown; one duplicated a shop; two showed specification mismatch. None was counted toward the primary three."/><p>Additional observed qualified shop ID: {additional.sid}. Its source listing displayed CNY 0.01/{additional.unit}, MOQ {additional.moq} {additional.unit}, observed {additional.observedAt}. Tier, company identity, actual quotation and availability remain UNKNOWN. <a className="text-link" href={'https://detail.1688.com/offer/' + additional.offer + '.html'}>Original source listing</a>. Evidence digest <code>{additional.digest.slice(0, 16)}…</code>.</p></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="5 · Next Action" title="Edit an RFQ draft before any separate outreach" body="The following example is editable locally in your browser. Editing it does not save, submit, charge or contact anyone. The future USD 19.90 Live RFQ Compare would require an exact confirmed RFQ, up to three selected recipients, separate payment and authorization for one human outreach round with a 72-hour response window; supplier replies are not guaranteed."/><textarea className="code-block" aria-label="Editable sample RFQ draft" defaultValue={rfqDraft} style={{width:'100%',minHeight:'16rem'}}/><p>For a current quote, ask the supplier to confirm price/currency/unit and terms, availability, MOQ and lead time. The observed listing price above cannot answer those questions.</p><p>Source: independently approved V4-prefix acceptance artifact <code>954f06a382a095342b46020ff5135c1fbcef981fc84b6ba9e51c1b611ad1d102</code>; answer digest <code>b9eb4131108439867a549842bed1b58b87a95317522b7522e7a4ae14d0b90017</code>. Historical acceptance provenance is retained in the authorized internal audit record.</p></div></section>
  </PageShell>;
}
