import Link from 'next/link';
import { Eyebrow, PageShell } from '@/components/site';
import { cscPaymentModesCopy } from '@/lib/csc-commercial-truth';
import { readPublicSamplePublication } from '@/lib/public-agent-sample';
import { rfqBasicCopy, rfqBuyerEntry } from '@/lib/rfq-basic-copy';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'RFQ Delivery Format and Supplier Evidence',
  'See how a Verified RFQ Basic report compares the same requirement, quotation terms and unknowns. A synthetic format demonstration, with a separate historical screening sample.',
  '/proof',
);

export default function Proof() {
  const sampleAvailable = readPublicSamplePublication() !== null;
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>RFQ delivery and evidence</Eyebrow>
      <h1>See what your $19.90 RFQ report will compare.</h1>
      <p>Compare supplier replies against one confirmed requirement. Your Human report, Agent JSON and Evidence manifest keep the same product matches, quotation terms, source evidence and open questions.</p>
      <div className="button-row"><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a><Link className="text-link" href="/china-supply-check/live-rfq-compare">Service scope and guarantee</Link></div>
    </div></section>

    <section className="section" id="rfq-delivery-format"><div className="container">
      <h2>One requirement, one comparison basis.</h2>
      <p><strong>Synthetic format demonstration — no supplier reply, current price or customer case.</strong></p>
      <p>Illustrative requirement: M12 inductive proximity sensor, 24 V DC, NPN normally open, 2 m cable; 120 pieces to the Netherlands; no substitutions.</p>
      <div className="rfq-format-scroll" role="region" aria-label="RFQ delivery field guide" tabIndex={0}>
        <table className="rfq-format-table">
          <caption>Fields to compare for each supplier reply</caption>
          <thead><tr><th scope="col">Field</th><th scope="col">Comparison format</th></tr></thead>
          <tbody>
            <tr><th scope="row">Product and specifications</th><td>Compare the reply with the same M12, 24 V DC, NPN normally-open, 2 m cable requirement. Supplier-confirmed specification match: UNKNOWN.</td></tr>
            <tr><th scope="row">Quantity and unit</th><td>Requested: 120 pieces. Supplier-quoted quantity and unit: UNKNOWN.</td></tr>
            <tr><th scope="row">MOQ</th><td>UNKNOWN. Preserve the minimum quantity, its unit and any supplier-confirmed exception.</td></tr>
            <tr><th scope="row">Price basis</th><td>UNKNOWN. Keep currency, unit price and the applicable quantity tier together.</td></tr>
            <tr><th scope="row">Quote date and validity</th><td>Quote date: UNKNOWN. Validity: UNKNOWN. Record the actual response date and the supplier's stated validity.</td></tr>
            <tr><th scope="row">Delivery conditions</th><td>UNKNOWN. Preserve the quoted delivery term, named place and lead time.</td></tr>
            <tr><th scope="row">Other costs</th><td>Freight, duties, taxes, tooling and other charges: UNKNOWN until evidenced. Keep exclusions separate from the unit price.</td></tr>
            <tr><th scope="row">Supporting evidence</th><td>Supplier response and supporting document references: UNKNOWN. In a delivered report, these connect the comparison to its source evidence.</td></tr>
          </tbody>
        </table>
      </div>
      <h3>What makes a reply useful?</h3>
      <div className="grid-3">
        <article className="feature-card"><h4>Supports qualification</h4><p>A current supplier-confirmed quote matches the confirmed product, specifications and quantity, with its commercial conditions and evidence attached.</p></article>
        <article className="feature-card"><h4>Needs clarification</h4><p>An unclear variant, price unit or quantity basis remains an open question. Missing freight or tax stays explicit; it is not assumed included.</p></article>
        <article className="feature-card"><h4>Does not match</h4><p>A PNP sensor does not meet this NPN-only requirement. An MOQ above 120 pieces without a confirmed exception does not satisfy the requested quantity.</p></article>
      </div>
      <p>A marketplace listing price alone is not a supplier-confirmed quotation. Your report keeps the reasons for qualification, remaining questions and mismatches beside the evidence.</p>
      <p>{rfqBasicCopy}</p>
      <div className="button-row"><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a><Link className="text-link" href="/for-agents#rfq-free-mcp">Agent: prepare a free RFQ with MCP</Link></div>
    </div></section>

    <section className="section" id="historical-screening-sample"><div className="container">
      <Eyebrow>Optional supplier screening</Eyebrow>
      <h2>Inspect the separate historical screening sample.</h2>
      {sampleAvailable ? <>
        <p>The China Supply Check example is a HISTORICAL_RECONSTRUCTION from preserved, directly matching products. It illustrates supplier screening. It is not an independent customer testimonial or a current RFQ quote.</p>
        <p>All three commercial scores are 0/100 and source factory tiers F0. Original pool count and weights are NOT_RECORDED; current V2 scores are RECOMPUTED. Source marketplace observations are not an independent SeekAPI onsite audit.</p>
        <div className="button-row"><Link className="button button-ghost" href="/china-supply-check/sample">Read the historical supplier screening sample</Link><a className="text-link" href="/china-supply-check/sample.json">Download the same screening evidence</a></div>
      </> : <p>The public example is currently unavailable. Use live discovery for current product and purchase information.</p>}
      <details><summary>Screening payment options</summary><p>{cscPaymentModesCopy}</p></details>
    </div></section>
    <section className="section"><div className="container"><h2>Keep evidence classes separate</h2><p>An internal acceptance record is not independent external customer use. Illustrative procurement workflows are not executed supplier work. A public source observation does not prove current availability or a supplier's reply. Previously published benchmark counts are not the current three-candidate report.</p></div></section>
  </PageShell>;
}
