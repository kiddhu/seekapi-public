import Link from 'next/link';
import { CTA, Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { rfqBasicCopy, rfqBuyerEntry } from '@/lib/rfq-basic-copy';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata('SeekAPI Trust — RFQ Delivery, Refunds and Data', 'USD 19.90 Verified RFQ Basic: clear supplier contact scope, qualified-quote target, service-fee refund, named legal operator and buyer-controlled payment.', '/trust');

export default function Page() {
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>Clear scope. Clear delivery. Clear remedy.</Eyebrow><h1>Know what your $19.90 RFQ will deliver.</h1>
      <p>SeekAPI contacts up to three matched Chinese suppliers, translates and follows up, then compares their replies against your confirmed requirement. Prepare for free and review the exact brief before approving payment.</p>
      <div className="button-row"><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a><Link className="text-link" href="/china-supply-check/live-rfq-compare">Read the Basic service</Link></div>
    </div></section>
    <section className="section" id="payments"><div className="container">
      <SectionTitle eyebrow="Delivery and refund" title="A qualified supplier quote, or your RFQ service fee back." body={rfqBasicCopy}/>
      <p>Your Human report, Agent JSON and Evidence manifest share the same supplier replies, quote conditions and next steps. Keep your private status and recovery links to reopen existing results without paying again.</p>
    </div></section>
    <section className="section" id="who-we-are"><div className="container">
      <SectionTitle eyebrow="Who operates SeekAPI" title="A named legal operator and a public support address."/>
      <div className="definition-grid">
        <div className="definition"><h3>Legal entity</h3><p>SeekAPI Technology Limited, Hong Kong</p></div>
        <div className="definition"><h3>Registered / contact address</h3><p>Room P11, Flat 2C, 2/F, Hung To Ctr., 94–96 How Ming St., Kwun Tong, Kowloon, Hong Kong</p></div>
        <div className="definition"><h3>Customer support</h3><p><a href="mailto:support@seekapi.ai">support@seekapi.ai</a></p></div>
        <div className="definition"><h3>Before sharing sensitive files</h3><p>Confirm handling, recipients, revision and sharing rights with us first. Start with the non-sensitive product details needed for your brief.</p></div>
      </div>
    </div></section>
    <section className="section"><div className="container"><h2>Service scope, evidence and data</h2>
      <details id="commercial-role"><summary>What does the RFQ fee cover?</summary><p>Basic covers the agreed supplier-contact and quotation-comparison service. The refund applies to this RFQ service fee, to the original payment method. Goods, samples, third-party inspection, laboratories, freight and duties are separately scoped and pre-approved. Basic does not authorize goods purchases, supplier payments or agency transactions. Any different commercial role must be stated explicitly in that separate workstream.</p></details>
      <details id="data-ip"><summary>What can I share, and who may receive it?</summary><p>Share only what the next decision needs. A limited specification may be reviewed internally without permission to forward it. External RFQ material requires approved recipients, file revision, purpose and forwarding scope. Manufacturing-file storage, retention, deletion and external-model controls for broader assignments require separate verification; do not upload sensitive drawings or certificates as ordinary visual references.</p></details>
      <details id="quality"><summary>How should I interpret supplier and quality evidence?</summary><p>A listing price is dated platform evidence; a supplier-confirmed quote is a reply about your confirmed brief. Factory and trading-company evidence identifies its source. Platform certification is not an independent SeekAPI onsite audit. A sample does not guarantee a production batch; inspection coordination does not transfer design, safety or regulatory responsibility.</p></details>
      <details><summary>How is the optional $2.99 screening service different?</summary><p>China Supply Check compares supplier candidates and dated listing evidence. It is available through USD 2.99 image Stripe Hosted Checkout or 2.99 USDC text/model x402 on Base, subject to current runtime admission. Image x402 and text/model Stripe are off. Marketplace protections apply only to eligible goods transactions; they do not compensate the screening fee. Basic can be purchased directly without screening.</p><Link href="/china-supply-check">Review supplier screening</Link></details>
      <details id="regulated-work"><summary>Who is responsible for licensed or regulated work?</summary><p>Legal opinions, tax filings, audits, certifications, laboratory reports, customs declarations and regulated transport belong to the customer or a qualified provider. Coordination does not guarantee regulatory approval, customs release, tax treatment, transit time or legal outcome.</p><Link href="/china-compliance-logistics">Compliance and logistics scope</Link></details>
      <p><Link href="/privacy">Privacy Notice</Link> · <Link href="/terms">Service Terms</Link> · <Link href="/support">Support and existing-result recovery</Link></p>
    </div></section>
    <CTA title="Start with a clear requirement." body="Prepare for free. Review and confirm your brief, then approve USD 19.90 once for supplier contact and quotation comparison." primaryLabel="Prepare my RFQ for free" primaryHref={rfqBuyerEntry} secondaryLabel="How it works" secondaryHref="/how-it-works"/>
  </PageShell>;
}
