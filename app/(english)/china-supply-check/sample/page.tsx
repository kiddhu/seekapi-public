import { PublicSourceObservations } from '@/components/public-source-observations';
import coverage from '@/public/china-supply-check-field-coverage.json';
import Link from 'next/link';
import { Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Public Source Observations and Evidence Limits',
  'Three public source observations from an internal provider-only benchmark, with UNKNOWN qualification and explicit evidence limits. Paid-order candidate details remain private.',
  '/china-supply-check/sample',
);

export default function SampleSummaryPage() {
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>PUBLIC SOURCE OBSERVATIONS · INTERNAL PROVIDER-ONLY BENCHMARK</Eyebrow>
      <h1>What public source evidence shows — and leaves unknown.</h1>
      <p>The public benchmark observations below are separate from the paid internal acceptance summary. They are not a customer testimonial or an external case study. Qualification remains UNKNOWN; paid-order candidate details remain private.</p>
      <div className="button-row"><Link className="button" href="/china-supply-check">Read the current product contract</Link><Link className="button button-ghost" href="/for-agents">Prepare a free sourcing brief</Link></div>
    </div></section>

    <PublicSourceObservations />

    <section className="section"><div className="container">
      <SectionTitle eyebrow="REAL PRODUCTION PAID ACCEPTANCE EXAMPLE · INTERNAL_ACCEPTANCE" title="Three candidates delivered on a completed 2.99 USDC check." />
      <div className="grid-3">
        <div className="definition"><h3>Delivered</h3><p>A real paid check completed and delivered three evidence-backed China supplier candidates worth advancing to RFQ.</p></div>
        <div className="definition"><h3>Payment accepted</h3><p>The order was settled for 2.99 USDC on Base via the official x402 path.</p></div>
        <div className="definition"><h3>Production completed</h3><p>The completed check delivered the accepted result. This page reports that aggregate outcome, not a new purchase or an independent customer review.</p></div>
      </div>
    </div></section>

    <section className="section"><div className="container">
      <SectionTitle eyebrow="Measured evidence coverage · PROVIDER_ONLY_BENCHMARK" title="What was actually captured for three distinct platform shops" body="This separate recorded provider-only benchmark contains three washer source observation rows, with final qualification UNKNOWN. It is not the paid acceptance order described above, and is not a customer testimonial. No new purchase or sourcing run was made to create this summary." />
      <p>Evidence observed: <time dateTime={coverage.evidence_observed_at}>{coverage.evidence_observed_at}</time>. Coverage distinguishes recorded observations from confirmed matches. The three recorded product/model/material verdicts remain UNKNOWN for all three candidates; quantity/MOQ matches do not count as specification matches. Variant and supplier-capability observations are shown separately, without promoting them to exact-match evidence. Coverage does not certify the supplier or guarantee the same coverage on every run.</p>
      <div style={{ overflowX: 'auto' }}><table><caption>Recorded field coverage for three public source observation rows</caption><thead><tr><th scope="col">Evidence field</th><th scope="col">Observed</th><th scope="col">Unknown</th></tr></thead><tbody>{coverage.coverage.map(row => <tr key={row.field}><th scope="row">{row.field === 'specification_evidence' ? 'Confirmed product/model/material match' : row.field.replaceAll('_', ' ')}</th><td>{row.observed_candidates} / {row.total_candidates}</td><td>{row.unknown_candidates} / {row.total_candidates}</td></tr>)}</tbody></table></div>
      <p>The full five-case benchmark recorded 3, 3, 2, 3 and 0 distinct shops at its original gate. These counts do not establish final qualification for the public observation rows. Two cases were shortages; the benchmark did not pass overall. A contact path means a listing or shop entry, not a supplier reply.</p>
      <p><strong>Observed listing price</strong> is dated platform evidence. <strong>Confirmed supplier quote</strong> requires a supplier response to the specific RFQ. Requested-quantity tier match is <strong>UNKNOWN</strong> when no applicable price tier is recorded.</p>
      <p>Public source observations are disclosed only within the stated evidence transparency scope. Paid-order candidate details remain private; no supplier recommendations are published in these benchmark rows. <a className="text-link" href="/china-supply-check-field-coverage.json">Download measured coverage and provenance</a>.</p>
    </div></section>

    <section className="section"><div className="container"><SectionTitle eyebrow="How to read your report" title="Decision fields, not invented supplier cards" body="The following table explains the report structure. It does not contain the three production candidates or recreate their values."/><div style={{overflowX:'auto'}}><table><caption>Evidence to inspect for each supplier candidate</caption><thead><tr><th scope="col">Decision field</th><th scope="col">How to interpret it</th></tr></thead><tbody>{[
 ['Supplier/company identity','Documented platform shop and linked company evidence where available; distinguish a shop from a legal entity.'],
 ['Platform/company certification','Read the subject, scope and source of certification evidence; do not infer product conformity from a shop badge.'],
 ['Manufacturer or trader','Preserve supported production-versus-trade evidence and identify claims that remain unconfirmed.'],
 ['Product, SKU and specification','Match the named variant and mandatory requirements; supplier RFQ-worthiness is separate from exact product qualification.'],
 ['MOQ and quantity','Read the minimum, original unit and requested-quantity fit together. A pack is not necessarily a piece.'],
 ['Observed price or tiers','Keep amount, currency, unit, applicable tier and time together. A listing observation and a supplier-confirmed quotation are different evidence.'],
 ['Contact path','An available listing/shop contact route does not imply that a supplier has been contacted or has replied.'],
 ['Evidence source/time','Keep source links and observation dates so the next inquiry refers to the same evidence.'],
 ['Known gaps','Mark unavailable or unresolved evidence at field level, without turning every gap into a global supplier failure.'],
 ['Why RFQ-worthy','Explain why the evidence supports the next inquiry and which questions remain before purchase.'],
 ].map(([field,meaning])=><tr key={field}><th scope="row">{field}</th><td>{meaning}</td></tr>)}</tbody></table></div><p>Paid-order candidate-level production example: <strong style={{ overflowWrap: 'anywhere' }}>NOT_AVAILABLE_FROM_AUTHORIZED_PUBLIC_MATERIAL</strong>. The public proof includes the separate benchmark observations above, an aggregate paid acceptance, measured field coverage, and this reading guide. No Candidate A/B/C values are invented.</p></div></section>
    <section className="section section-dark"><div className="container">
      <SectionTitle eyebrow="Disclosure boundary" title="Paid-order candidate details remain private." body="This summary deliberately omits the customer's wallet address, order reference, payment signature and identity, and it does not infer supplier details from the archived historical sample. The archived sample is a separate evidence-format example and is not the real paid order." />
      <p>The current purchase path is 2.99 USDC via live x402 on Base. Public credit-card checkout is OFF and is not available to buy. <Link className="text-link" href="/for-agents">Read the MCP preparation and purchase guide</Link>.</p><p>SeekAPI does not present this record as an independent external customer or as a testimonial. It is an internal acceptance summary of an authorized production run.</p>
    </div></section>

    <section className="section"><div className="container">
      <SectionTitle eyebrow="Paid acceptance provenance" title="Recorded from the completed internal acceptance." body="This summary records the previously completed internal production acceptance. The live discovery tool reports current service availability; the product page describes the current customer contract. It does not represent a new purchase or replay." />
      <div className="link-list">
        <a className="text-link" href="https://api.seekapi.ai/mcp">Live discovery tool (public MCP)</a>
        <Link className="text-link" href="/china-supply-check">China Supply Check product page</Link>
        <details><summary>Historical format reference</summary><Link href="/china-supply-check/sample/archived-v4">Archived historical sample (V4)</Link></details>
      </div>
    </div></section>
  </PageShell>;
}
