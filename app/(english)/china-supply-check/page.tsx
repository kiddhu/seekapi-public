import Link from 'next/link';
import {readPublicSamplePublication} from '@/lib/public-agent-sample';
import {PageShell, Eyebrow, SectionTitle} from '@/components/site';
import {ImageSupplyCheckEntry, imageCardEntry} from '@/components/image-supply-check-entry';
import {ProductFirstMethod} from '@/components/product-first-method';
import {ServiceComparison} from '@/components/service-comparison';
import {cscPaymentCopy, cscPaymentModesCopy} from '@/lib/csc-commercial-truth';
import {pageMetadata} from '@/lib/site';
export const metadata=pageMetadata('China Supply Check — $2.99 Supplier Screening','Compare Chinese supplier candidates, source links, specifications, MOQ and dated listing-price evidence. Free brief review before the separate $2.99 photo check, subject to current purchase availability.','/china-supply-check');

export default function ProductPage() {
  const sampleAvailable=readPublicSamplePublication()!==null;
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>China Supply Check · $2.99 USD, one time</Eyebrow>
      <h1>Find matching Chinese supplier candidates.</h1>
      <p>Start with a product photo. Compare source links, dated listing prices, MOQ and specification gaps. Review your editable brief for free before paying.</p>
      <div className="button-row"><a className="button" href={imageCardEntry}>Start with a photo — $2.99</a>{sampleAvailable?<Link className="text-link" href="/china-supply-check/sample">View a screening sample</Link>:null}</div>
      <p className="availability-note">Opening the photo entry checks current availability. New purchases may be paused; opening the page does not charge you.</p>
      <p>Text or model brief? <Link className="text-link" href="/for-agents#china-supply-check-mcp">Use an Agent — 2.99 USDC.</Link></p>
    </div></section>
    <section className="section section-tight"><div className="container">
      <SectionTitle eyebrow="A useful shortlist" title="Compare the evidence behind each candidate."/>
      <div className="grid-3">
        <article className="feature-card"><h3>Product and specifications</h3><p>Review the matched product, selected variant, must-match specifications and explicit gaps. A photo helps identify shape; it does not establish material, dimensions or compatibility.</p></article>
        <article className="feature-card"><h3>MOQ and price basis</h3><p>Keep quantity, unit, price tier, currency and observation date together. Listing evidence supports screening; a current confirmed quote comes from the separate RFQ service.</p></article>
        <article className="feature-card"><h3>Sources and next questions</h3><p>A successful check targets three distinct actionable suppliers with source links, an English report and Agent JSON. If fewer qualify, the report states the shortage.</p></article>
      </div>
    </div></section>
    <ImageSupplyCheckEntry/>
    <section className="section section-tight"><div className="container">
      <h2>Exact model and specifications</h2>
      <p>State the part number, material or standard, dimensions, units, tolerances and permitted substitutions. Unknown details stay explicit. Similar appearance does not prove an exact match.</p>
      <div className="link-list"><Link className="text-link" href="/sourcing/image-based-supplier-search">What a product photo can establish</Link><Link className="text-link" href="/sourcing/rfq-templates/china-supplier-brief">Prepare a precise written brief</Link><Link className="text-link" href="/for-agents#free-quickstart">Run the free Python or Node example</Link></div>
    </div></section>
    <ServiceComparison/>
    <section className="section section-tight"><div className="container faq-list">
      <h2>Screening questions</h2>
      <details><summary>Will you contact suppliers?</summary><p>Supplier contact is part of standalone Verified RFQ Basic. China Supply Check compares candidate suppliers and dated listing evidence.</p><Link className="text-link" href="/china-supply-check/live-rfq-compare">Choose current supplier quotations — $19.90 USD</Link></details>
      <details><summary>Which payment modes are supported?</summary><p>{cscPaymentModesCopy}</p></details>
      <details><summary>What happens when fewer candidates qualify?</summary><p>The report states the shortage and the evidence gaps. It does not pad the shortlist.</p></details>
      <details><summary>Do I pay again to reopen my report?</summary><p>No. Use the private result link or recovery controls for your existing purchase. <a className="text-link" href="/support#existing-results">Find the recovery method for your purchase.</a></p></details>
    </div></section>
    <section className="section section-tight"><div className="container"><details><summary>Screening method and historical evidence</summary><ProductFirstMethod/>{sampleAvailable?<Link className="text-link" href="/china-supply-check/sample">Read the historical screening report</Link>:<p>The public example is currently unavailable.</p>}</details><p>{cscPaymentCopy}</p></div></section>
  </PageShell>;
}
