import Link from 'next/link';
import {Eyebrow, PageShell, SectionTitle} from '@/components/site';
import {ServiceComparison, rfqGuarantee} from '@/components/service-comparison';
import {pageMetadata} from '@/lib/site';
import {rfqBasicCopy, rfqReferenceCopy, rfqBuyerEntry, productLinkFaq} from '@/lib/rfq-basic-copy';

const serviceSchema={
  '@context':'https://schema.org','@type':'Service',name:'SeekAPI Verified RFQ Basic',serviceType:'China supplier sourcing and qualified quotation comparison',
  url:'https://seekapi.ai/china-supply-check/live-rfq-compare',provider:{'@type':'Organization',name:'SeekAPI',url:'https://seekapi.ai'},
  description:rfqBasicCopy+' '+rfqReferenceCopy,
  offers:{'@type':'Offer',price:'19.90',priceCurrency:'USD',url:'https://seekapi.ai/china-supply-check/live-rfq-compare',description:'One-time RFQ service fee, subject to current runtime admission; free preparation before buyer-confirmed payment.'},
};
export const metadata=pageMetadata('China Supplier Quotes — $19.90 Verified RFQ Basic | SeekAPI','Get a current supplier-confirmed quote for $19.90 once. Receive up to 3 matching Chinese suppliers. Qualified quote in 3 China business days after payment and brief confirmation, or your RFQ fee back. Prepare free.','/china-supply-check/live-rfq-compare');

export default function Page() { return <PageShell>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(serviceSchema).replace(/</g,'\\u003c')}}/>
  <section className="page-hero"><div className="container">
    <Eyebrow>SeekAPI Verified RFQ Basic · $19.90 USD, one time</Eyebrow><h1>Get a current Chinese supplier quote for $19.90.</h1>
    <p>We screen candidates, contact suppliers in Chinese, translate replies and follow up. Receive up to three matching Chinese suppliers with a comparison of received quotations.</p>
    <div className="button-row"><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a><Link className="text-link" href="/proof#rfq-delivery-format">See the RFQ delivery format</Link></div>
    <p className="availability-note">No $2.99 purchase required. Review and confirm your brief before payment. New purchases depend on current availability.</p>
    <p className="main-guarantee">{rfqGuarantee} <a className="text-link" href="#service-scope">RFQ terms</a></p>
  </div></section>
  <section className="section" id="product-link"><div className="container">
    <SectionTitle eyebrow="Prepare for free" title="One editable sourcing brief. Start with what you have." body={rfqReferenceCopy}/>
    <ol className="rfq-steps"><li>Paste a product link, add your product photo or describe the requirement.</li><li>Review the product, selected variant and must-match specifications.</li><li>Confirm quantity and destination, then review your RFQ before payment.</li></ol>
    <p>If an image needs attention, continue with text in the same brief. Keep exact models, units, tolerances and allowed substitutions explicit.</p>
    <a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a>
  </div></section>
  <section className="section" id="factory-first"><div className="container">
    <SectionTitle eyebrow="Supplier evidence" title="Compare confirmed replies against your requirement."/>
    <div className="grid-3"><article className="feature-card"><h3>Factory-first matching</h3><p>We prioritize production-capable manufacturers and show the source of factory, trading-company and supplier-capability evidence.</p></article><article className="feature-card"><h3>Qualified quotation</h3><p>A current supplier-confirmed response ties the product, specifications, quantity and stated commercial conditions to your confirmed brief.</p></article><article className="feature-card"><h3>Three consistent outputs</h3><p>Your Human report, Agent JSON and Evidence manifest share the same supplier replies, quote conditions, evidence and open questions.</p></article></div>
  </div></section>
  <section className="section" id="service-scope"><div className="container">
    <SectionTitle eyebrow="Service guarantee and scope" title="A qualified quote, or your RFQ service fee back." body={rfqBasicCopy}/>
    <p>The service window starts after payment and essential requirement confirmation, using China business days. Your existing order status records the applicable timing. The full fee for this RFQ service is refunded to the original payment method if the qualified-quote target is missed.</p>
    <p>Basic delivers up to three matching suppliers. It does not guarantee three quotations, a particular price or unlimited supplier contacts. Supplier contact stays within the existing authorization. Existing accepted orders keep their accepted terms.</p>
    <p>Goods, samples, engineering, freight, duties and separately scoped work are separate from this service and its service-fee refund. A marketplace listing price is dated evidence; a qualified RFQ quotation requires a current supplier-confirmed response.</p>
  </div></section>
  <ServiceComparison/>
  <section className="section" id="product-link-faq"><div className="container faq-list">
    <h2>Product link sourcing questions</h2>
    {productLinkFaq.map(item=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
    <details><summary>When do the three China business days start?</summary><p>After payment and essential requirement confirmation. Read the timing and outcome on the existing order; a browser timer does not determine a refund.</p></details>
    <details><summary>Already paid?</summary><p><a className="text-link" href="/support#existing-results">Access your existing result.</a> Use the original private link or recovery file; do not buy the same result again.</p></details>
  </div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:productLinkFaq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))}).replace(/</g,'\\u003c')}}/></section>
  <section className="section section-dark" id="current-status"><div className="container">
    <h2>Ready for a current supplier quote?</h2><p>Prepare for free, review your exact sourcing brief, then approve the one-time $19.90 USD service fee when new purchases are available.</p><a className="button" href={rfqBuyerEntry}>Prepare my RFQ for free</a>
    <div className="link-list"><Link className="text-link" href="/for-agents#rfq-free-mcp">Agent: prepare a free RFQ with MCP</Link><a className="text-link" href={rfqBuyerEntry+'?format=openapi'}>Agent RFQ instructions</a></div>
  </div></section>
</PageShell>; }
