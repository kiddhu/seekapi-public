import Link from 'next/link';
import {Eyebrow, PageShell, SectionTitle} from '@/components/site';
import {imageCardEntry} from '@/components/image-supply-check-entry';
import {rfqBuyerEntry} from '@/lib/rfq-basic-copy';
import {pageMetadata} from '@/lib/site';

export const metadata=pageMetadata('Existing Results and Support','Already paid? Use the original private link, recovery file or authenticated Agent method for your existing SeekAPI order. Do not buy the same result again.','/support');

export default function Page() { return <PageShell>
  <section className="page-hero"><div className="container"><Eyebrow>Existing purchases and support</Eyebrow><h1>Access your existing result.</h1><p>Already paid? Use your private result link or recovery file. You do not need to buy the same result again.</p><div className="button-row"><a className="button" href="#existing-results">Find my recovery method</a><a className="text-link" href="#contact-support">Missing access? Contact support safely</a></div></div></section>
  <section className="section section-tight" id="existing-results" tabIndex={-1} aria-labelledby="existing-results-title"><div className="container">
    <div className="section-heading"><h2 id="existing-results-title">Choose your original purchase.</h2><p>Keep private links and recovery files on your own device. This page does not ask for credentials or look up an order.</p></div>
    <div className="recovery-choices">
      <article className="feature-card"><h3>Verified RFQ Basic</h3><p>Open your saved private order link, or choose your original private recovery JSON file in the existing RFQ recovery page. Its recovery controls restore that same order.</p><a className="button" data-result-recovery="true" href={rfqBuyerEntry+'?recover=1'}>Open RFQ recovery</a></article>
      <article className="feature-card"><h3>Photo supplier check · Stripe</h3><p>Use your saved private result link or the photo entry’s “Choose Recovery File” control. Existing paid results remain separate from new-purchase availability.</p><a className="button button-ghost" data-result-recovery="true" href={imageCardEntry}>Open photo-check recovery controls</a></article>
      <article className="feature-card"><h3>Older supplier check</h3><p>Return to the original browser and tab, or open your original private link. If access is missing, contact support before starting another purchase.</p><a className="text-link" href="#contact-support">Get help with an older check</a></article>
      <article className="feature-card"><h3>Agent or wallet purchase</h3><p>Use the existing signed-wallet status and result tools for the settled order. A receipt, order ID or payment proof alone does not grant result access.</p><Link className="text-link" href="/for-agents#china-supply-check-mcp">Read Agent access instructions</Link></article>
    </div>
    <p className="availability-note">If a recovery entry cannot be opened or access cannot be verified, keep your original purchase details and use support below. Do not repay or start a replacement order to recover a report.</p>
  </div></section>
  <section className="section"><div className="container faq-list">
    <h2>When access or payment is uncertain</h2>
    <details><summary>My bank shows a payment, but the page is unsure.</summary><p>Check the same existing purchase status or contact support. Do not pay again while the payment outcome is unresolved.</p></details>
    <details><summary>My private link expired or I changed devices.</summary><p>Use the valid recovery file or authenticated method for that product. If verification fails, contact support with a non-secret order reference if available. An order number alone is not authentication.</p></details>
    <details><summary>Can I email my recovery file?</summary><p>Keep private recovery files, tokens, signatures, full private URLs, passwords, card details and wallet keys out of email. Support can advise on the authorized next step.</p></details>
  </div></section>
  <section className="section" id="contact-support" tabIndex={-1}><div className="container">
    <SectionTitle eyebrow="Useful context" title="Include the reference, not a payment secret." body="Email the product, approximate purchase time, the observed problem and a non-secret order reference if available. Keep confidential drawings and supplier secrets private. No response or resolution time is promised."/>
    <p><a className="text-link" href="mailto:support@seekapi.ai">support@seekapi.ai</a> · SeekAPI Technology Limited, Hong Kong.</p>
    <p>Room P11, Flat 2C, 2/F, Hung To Ctr., 94–96 How Ming St., Kwun Tong, Kowloon, Hong Kong.</p>
    <p><Link className="text-link" href="/privacy">Privacy Notice</Link> · <Link className="text-link" href="/terms">Service Terms</Link> · <Link className="text-link" href="/trust">Operator and service scope</Link></p>
  </div></section>
</PageShell>; }
