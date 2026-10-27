import Link from 'next/link';
import {rfqBasicCopy} from '@/lib/rfq-basic-copy';
import type {PublicSamplePublication} from '@/lib/public-agent-sample';
type Candidate={candidate_id:number;supplier_label:string;product_match_type:string;product_score:{total:number};factory_tier:{tier:number};contact_availability:Record<string,unknown>};
type PublicModel={supplier_candidates:Candidate[];decision_summary:{recommended_candidate_id:null;first_displayed_candidate_id:number}};
export function QualifiedPublicSample({publication}:{publication:PublicSamplePublication}){
 const sample=JSON.parse(publication.sample_json) as PublicModel;
 const first=sample.supplier_candidates.find(c=>c.candidate_id===sample.decision_summary.first_displayed_candidate_id);
 return <>
  <section className="page-hero sample-hero"><div className="container">
   <p className="eyebrow">Product-first V2 · historical example</p>
   <h1>Compare three product matches.</h1>
   <p className="sample-intro">Historical evidence; confirm current terms before buying.</p>
   <a className="button" href="/china-supply-check/sample.json" download="seekapi-public-sample.json">Download Agent JSON</a>
  </div></section>
  <section className="section sample-overview"><div className="container">
   <h2>Three candidates to compare</h2>
   <p className="sample-display-note"><strong>No commercial recommendation.</strong> All three tie on public comparison values. {first?.supplier_label} is first for display only, not better value.</p>
   <div className="sample-comparison">{sample.supplier_candidates.map(c=><article className="card" key={c.candidate_id} aria-label={c.supplier_label+' comparison'}>
    <h3><a href={'#candidate-'+c.candidate_id}>{c.supplier_label}</a></h3>
    <p className="sample-match">{c.product_match_type}</p>
    <div className="sample-pair"><span><strong>{c.product_score.total}/100</strong><small>Commercial score</small></span><span><strong>F{c.factory_tier.tier}</strong><small>Factory evidence unknown</small></span></div>
    <p className="sample-price">Comparable price: UNKNOWN</p>
   </article>)}</div>
   <p className="sample-score-note">0 means no scoreable commercial evidence, not a bad product. F0 means factory evidence is unknown, not proof of a non-factory.</p>
   <div className="sample-rfq-scope"><p>{rfqBasicCopy}</p><p>Basic is not a contact-unlock fee. Reading this historical sample does not buy a service or contact suppliers.</p><Link className="text-link" href="/china-supply-check/live-rfq-compare#service-scope">Review the $19.90 scope</Link></div>
   <h2>Read the full evidence and remaining questions</h2>
   <p>The deterministic tied display order does not establish commercial superiority, a lower price, higher sales or a better factory. The final private numeric product-ID tie rule is explained in the report; its inputs are not public and are not independently recomputable from this anonymous example.</p>
   <p>Exact SKU, material, dimensions, quality, stock, lead time and a formal quotation still require RFQ confirmation. Historical MOQ observations below retain their original units and do not establish current quantity fit.</p>
   <h3>Contact availability</h3><p>For all three candidates, business phone, business email, platform contact and transaction path availability are unknown (null). No complete contact details or real supplier identity are public. Authenticated paid report business contacts remain readable.</p>
  </div></section>
  <section className="section"><div className="container public-qualified-sample" dangerouslySetInnerHTML={{__html:publication.body_html}} /></section>
  <section className="section"><div className="container"><h2>Keep the next step clear</h2><p>SeekAPI Verified RFQ Basic is a separate USD 19.90 supplier-contact and quotation-comparison service, not a contact-unlock fee. This historical sample does not buy that service or contact a supplier. Basic targets at least one current qualified quote from up to three distinct suppliers within three China business days after payment and essential confirmation, or RFQ_INCOMPLETE and a full original-method refund of this service fee. Check current admission before a new purchase.</p><p>Contact availability is unknown (null) in this anonymous sample. Existing public business contacts in authenticated paid reports remain readable.</p><div className="button-row"><Link className="button" href="/china-supply-check/live-rfq-compare#current-status">Review the $19.90 service</Link><Link className="button button-ghost" href="/for-agents">Agent connection and current payment options</Link></div></div></section>
 </>;
}
