import coverage from '@/public/china-supply-check-field-coverage.json';
import Link from 'next/link';
import { Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'What a $2.99 China Supply Check Looks Like',
  'An internal production acceptance summary for China Supply Check: a real paid 2.99 USDC order completed with three delivered candidates. No customer identity or supplier details are disclosed.',
  '/china-supply-check/sample',
);

export default function SampleSummaryPage() {
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>REAL PRODUCTION PAID ACCEPTANCE EXAMPLE · INTERNAL_ACCEPTANCE</Eyebrow>
      <h1>What a $2.99 China Supply Check Looks Like</h1>
      <p>This is a production acceptance summary, not a customer testimonial or an external case study. It records the authorized aggregate outcome of a real paid China Supply Check order without disclosing any customer identity, wallet, order reference, payment signature or candidate-level supplier detail.</p>
      <div className="button-row"><Link className="button" href="/china-supply-check">Read the current product contract</Link><Link className="button button-ghost" href="/for-agents">Prepare a free sourcing brief</Link></div>
    </div></section>

    <section className="section"><div className="container">
      <SectionTitle eyebrow="Authorized aggregate outcome" title="Three candidates delivered on a completed 2.99 USDC check." />
      <div className="grid-3">
        <div className="definition"><h3>Delivered</h3><p>A real paid check completed and delivered three evidence-backed China supplier candidates worth advancing to RFQ.</p></div>
        <div className="definition"><h3>Payment accepted</h3><p>The order was settled for 2.99 USDC on Base via the official x402 path.</p></div>
        <div className="definition"><h3>Production completed</h3><p>The completed check delivered the accepted result. This page reports that aggregate outcome, not a new purchase or an independent customer review.</p></div>
      </div>
    </div></section>

    <section className="section"><div className="container">
      <SectionTitle eyebrow="Measured evidence coverage · INTERNAL_ACCEPTANCE" title="What was actually captured for three distinct suppliers" body="This separate recorded provider-only benchmark contains three selected washer suppliers. It is not the paid acceptance order described above, and is not a customer testimonial. No new purchase or sourcing run was made to create this summary." />
      <p>Evidence observed: <time dateTime={coverage.evidence_observed_at}>{coverage.evidence_observed_at}</time>. Coverage distinguishes recorded observations from confirmed matches. The three recorded product/model/material verdicts remain UNKNOWN for all three candidates; quantity/MOQ matches do not count as specification matches. Variant and supplier-capability observations are shown separately, without promoting them to exact-match evidence. Coverage does not certify the supplier or guarantee the same coverage on every run.</p>
      <div style={{ overflowX: 'auto' }}><table><caption>Recorded field coverage for three distinct selected suppliers</caption><thead><tr><th scope="col">Evidence field</th><th scope="col">Observed</th><th scope="col">Unknown</th></tr></thead><tbody>{coverage.coverage.map(row => <tr key={row.field}><th scope="row">{row.field === 'specification_evidence' ? 'Confirmed product/model/material match' : row.field.replaceAll('_', ' ')}</th><td>{row.observed_candidates} / {row.total_candidates}</td><td>{row.unknown_candidates} / {row.total_candidates}</td></tr>)}</tbody></table></div>
      <p>The full five-case benchmark returned 3, 3, 2, 3 and 0 qualified distinct suppliers. Two cases were shortages; the benchmark did not pass overall. A contact path means a listing or shop entry, not a supplier reply.</p>
      <p><strong>Observed listing price</strong> is dated platform evidence. <strong>Confirmed supplier quote</strong> requires a supplier response to the specific RFQ. Requested-quantity tier match is <strong>UNKNOWN</strong> when no applicable price tier is recorded.</p>
      <p>Candidate row publication rights remain unconfirmed. This public summary therefore contains measured counts, not invented or republished supplier cards. <a className="text-link" href="/china-supply-check-field-coverage.json">Download measured coverage and provenance</a>.</p>
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
 ].map(([field,meaning])=><tr key={field}><th scope="row">{field}</th><td>{meaning}</td></tr>)}</tbody></table></div><p>Candidate-level production example: <strong style={{ overflowWrap: 'anywhere' }}>NOT_AVAILABLE_FROM_AUTHORIZED_PUBLIC_MATERIAL</strong>. The public proof includes an aggregate paid acceptance, measured field coverage from a separate recorded benchmark, and this reading guide. No Candidate A/B/C values are invented.</p></div></section>
    <section className="section section-dark"><div className="container">
      <SectionTitle eyebrow="Disclosure boundary" title="Candidate-level details are not disclosed here." body="This summary deliberately omits the customer's wallet address, order reference, payment signature and identity, and it does not infer supplier details from the archived historical sample. The archived sample is a separate evidence-format example and is not the real paid order." />
      <p>The current purchase path is 2.99 USDC via live x402 on Base. Public credit-card checkout is OFF and is not available to buy. <Link className="text-link" href="/for-agents">Read the MCP preparation and purchase guide</Link>.</p><p>SeekAPI does not present this record as an independent external customer or as a testimonial. It is an internal acceptance summary of an authorized production run.</p>
    </div></section>

    <section className="section"><div className="container">
      <SectionTitle eyebrow="Provenance" title="Recorded from the completed internal acceptance." body="This summary records the previously completed internal production acceptance. The live discovery tool reports current service availability; the product page describes the current customer contract. It does not represent a new purchase or replay." />
      <div className="link-list">
        <a className="text-link" href="https://api.seekapi.ai/mcp">Live discovery tool (public MCP)</a>
        <Link className="text-link" href="/china-supply-check">China Supply Check product page</Link>
        <details><summary>Historical format reference</summary><Link href="/china-supply-check/sample/archived-v4">Archived historical sample (V4)</Link></details>
      </div>
    </div></section>
  </PageShell>;
}
