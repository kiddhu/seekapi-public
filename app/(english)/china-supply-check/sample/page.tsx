import Link from 'next/link';
import { Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'China Supply Check — production acceptance sample summary',
  'An internal production acceptance summary for China Supply Check: a real paid 2.99 USDC order completed with three delivered candidates. No customer identity or supplier details are disclosed.',
  '/china-supply-check/sample',
);

export default function SampleSummaryPage() {
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>Production acceptance summary · INTERNAL_ACCEPTANCE</Eyebrow>
      <h1>China Supply Check completed a real paid order.</h1>
      <p>This is a production acceptance summary, not a customer testimonial or an external case study. It records the authorized aggregate outcome of a real paid China Supply Check order without disclosing any customer identity, wallet, order reference, payment signature or candidate-level supplier detail.</p>
      <div className="button-row"><Link className="button" href="/china-supply-check">Read the current product contract</Link><Link className="button button-ghost" href="/china-supply-check/sample/archived-v4">View the archived historical sample</Link></div>
    </div></section>

    <section className="section"><div className="container">
      <SectionTitle eyebrow="Authorized aggregate outcome" title="Three candidates delivered on a completed 2.99 USDC check." />
      <div className="grid-3">
        <div className="definition"><h3>Delivered</h3><p>A real paid check completed and delivered three evidence-backed China supplier candidates worth advancing to RFQ.</p></div>
        <div className="definition"><h3>Payment accepted</h3><p>The order was settled for 2.99 USDC on Base via the official x402 path.</p></div>
        <div className="definition"><h3>Production completed</h3><p>Production fulfillment completed, and the restart/reconciliation path passed without replaying the order.</p></div>
      </div>
    </div></section>

    <section className="section section-dark"><div className="container">
      <SectionTitle eyebrow="Disclosure boundary" title="Candidate-level details are not disclosed here." body="This summary deliberately omits the customer's wallet address, order reference, payment signature and identity, and it does not infer supplier details from the archived historical sample. The archived sample is a separate evidence-format example and is not the real paid order." />
      <p>SeekAPI does not present this record as an independent external customer or as a testimonial. It is an internal acceptance summary of an authorized production run.</p>
    </div></section>

    <section className="section"><div className="container">
      <SectionTitle eyebrow="Provenance" title="Recorded from the completed internal acceptance." body="This summary records the previously completed internal production acceptance. The live discovery tool reports current service availability; the product page describes the current customer contract. It does not represent a new purchase or replay." />
      <div className="link-list">
        <a className="text-link" href="https://api.seekapi.ai/mcp">Live discovery tool (public MCP)</a>
        <Link className="text-link" href="/china-supply-check">China Supply Check product page</Link>
        <Link className="text-link" href="/china-supply-check/sample/archived-v4">Archived historical sample (separate example)</Link>
      </div>
    </div></section>
  </PageShell>;
}
