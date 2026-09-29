import Link from 'next/link';
import { Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'How China Supply Check Screens MOQ and Specifications | SeekAPI',
  'See how a product/model, quantity and must-have requirements are compared with China B2B listing evidence, duplicates, mismatches and unknowns.',
  '/china-supply-check/moq-specification-screening',
);

export default function Page() { return <PageShell>
  <section className="page-hero"><div className="container"><Eyebrow>China Supply Check · screening method</Eyebrow><h1>A shortlist should explain why each candidate fits.</h1><p>Give a written product or model, quantity and unit, and the specifications that cannot change. SeekAPI's bounded check screens item evidence, minimum order quantity and distinct documented platform shops. A successful completed report has three qualified candidates; a shortage remains a shortage.</p></div></section>
  <section className="section"><div className="container"><SectionTitle eyebrow="Decision rules" title="Match, mismatch or UNKNOWN."/><div className="definition-grid"><div className="definition"><h3>Product and hard specs</h3><p>Evidence for the stated material, model, variant or dimension must support the requirement. A similar photo or broad title does not prove an exact grade or certification.</p></div><div className="definition"><h3>MOQ and unit</h3><p>Compare the listing's minimum with the buyer quantity only when the units are compatible. A quoted pack and a requested piece count need a known conversion; an unsupported conversion stays UNKNOWN.</p></div><div className="definition"><h3>Distinct shops</h3><p>Multiple product offers from one documented B2B shop are one shop candidate. A source listing does not independently verify the shop's legal company, manufacturer status or contactability.</p></div><div className="definition"><h3>Exclusions</h3><p>Show duplicates, hard mismatches, missing mandatory evidence and near misses with reasons. Do not relax must-haves or pad the three-candidate success count.</p></div></div></div></section>
  <section className="section section-dark"><div className="container"><SectionTitle eyebrow="Evidence in practice" title="Read the historical sample with its limits." body="The independently accepted V4 prefix contains three primary documented shops and a fourth observed shop. The full historical run ended TECHNICAL_BLOCKED; it does not demonstrate a completed customer paid check."/><div className="link-list"><Link className="text-link" href="/china-supply-check/sample">Inspect source-linked sample</Link><Link className="text-link" href="/china-supply-check/listing-price-vs-quote">Understand observed price</Link></div></div></section>
</PageShell>; }
