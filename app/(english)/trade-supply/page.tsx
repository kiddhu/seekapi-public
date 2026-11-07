import Link from 'next/link';
import { CTA, Eyebrow, FAQList, FeatureCard, PageShell, SectionTitle, type FaqItem } from '@/components/site';
import { pageMetadata } from '@/lib/site';

// PROTOTYPE ONLY: Keep noindex and out of primary navigation/sitemap until
// private project intake, commercial authority, source evidence and review pass.
export const metadata = {
  ...pageMetadata(
    'Custom Cabinetry Manufacturing for Designers & Installers | SeekAPI',
    'China-side sourcing and custom cabinetry manufacturing coordination for overseas kitchen studios, designers and installation contractors. Discuss a scoped feasibility review.',
    '/trade-supply',
  ),
  robots: { index: false, follow: false },
};

const faq: FaqItem[] = [
  {
    question: 'Does SeekAPI own or certify a furniture factory?',
    answer: 'SeekAPI does not claim factory ownership or independent factory certification. Factory capability, production role and any verification evidence are assessed and stated for each agreed project.',
  },
  {
    question: 'Can I send confidential CAD or client drawings here?',
    answer: 'Not through this page. Start with a non-sensitive project description. File access, confidentiality, recipients, storage and deletion need to be agreed before sharing protected drawings.',
  },
  {
    question: 'Who is responsible for measurements, installation and local compliance?',
    answer: 'The local project team retains responsibility for site measurement, final drawing approval, installation and local permits and engineering unless a different lawful responsibility split is agreed in writing. China-side manufacturing, inspection and export coordination are independently scoped.',
  },
];

export default function TradeSupplyPage() {
  return <PageShell>
    <section className="page-hero">
      <div className="container">
        <Eyebrow>SeekAPI Trade Supply · Feasibility programme</Eyebrow>
        <h1>Custom cabinetry from China. Ready for your local installation team.</h1>
        <p>For kitchen studios, interior designers, joinery contractors and installers who design and fit projects locally. Explore China-side factory sourcing, cut-list and hardware coordination, quality checks and export handoffs under one clearly defined project scope.</p>
        <div className="button-row">
          <Link className="button" href="/start?audience=company">Prepare a non-sensitive project enquiry</Link>
          <Link className="button button-ghost" href="/china-supply-chain">Explore China Desk support</Link>
        </div>
        <p className="hero-note">Project intake currently prepares an email for your review; it does not upload drawings or automatically submit a request. No manufacturing order, fixed delivery price or technical compliance approval is offered through this page.</p>
      </div>
    </section>

    <section className="section section-tight" id="partners">
      <div className="container">
        <SectionTitle eyebrow="For trade professionals" title="Keep the client relationship. Explore a China-side manufacturing route." body="You remain the local design and installation partner. We focus on the supplier and project coordination questions that must be answered before any manufacturing commitment."/>
        <div className="grid-3">
          <FeatureCard title="Kitchen & cabinet studios" body="Scope cabinetry bodies, doors, finishes, fittings and quantities so like-for-like supplier quotations can be assessed."/>
          <FeatureCard title="Interior designers & fit-out teams" body="Translate approved design intent into a reviewable materials, revision, packaging and project-handoff brief."/>
          <FeatureCard title="Local installers & builders" body="Clarify panel identification, delivery milestones, replacement parts and the handoff required by your installation team."/>
        </div>
      </div>
    </section>

    <section className="section" id="capabilities">
      <div className="container">
        <SectionTitle eyebrow="Initial focus" title="Start with interior joinery. Expand only where engineering and delivery evidence support it."/>
        <div className="grid-3">
          <FeatureCard index="01" title="Custom cabinetry & wardrobes" body="Primary feasibility focus: non-structural cabinet panels, kitchens, wardrobes, doors, finishes and specified hardware."/>
          <FeatureCard index="02" title="Pergolas & outdoor systems" body="Technical research only. Wind and snow actions, anchoring, electric components, trade remedies and local approvals must be assessed before a product offer."/>
          <FeatureCard index="03" title="Glazed enclosures" body="Exploratory only. Local structural engineering, glazing standards, building permits, breakage and liability are case-specific prerequisites."/>
        </div>
      </div>
    </section>

    <section className="section section-dark" id="process">
      <div className="container">
        <SectionTitle eyebrow="Proposed project journey" title="One approved drawing revision. One traceable supply scope." body="The following workflow is a proposed operating model, not a promise of currently available production capacity."/>
        <div className="grid-3">
          <FeatureCard index="01" title="Qualify the project" body="Begin with product family, country, rough dimensions, quantity, timing and the role of your local team. No protected files at this stage."/>
          <FeatureCard index="02" title="Confirm drawings & terms" body="Agree file-sharing rights, materials, BOM, hardware, revisions, Incoterm, importer, checks and clear acceptance responsibilities."/>
          <FeatureCard index="03" title="Coordinate after acceptance" body="Only under a separately accepted order: approved manufacturing drawings, labelled panels, inspection evidence, shipping handoff and correction process."/>
        </div>
      </div>
    </section>

    <section className="section" id="responsibilities">
      <div className="container">
        <SectionTitle eyebrow="A clearer division of work" title="Your customer and installation remain yours."/>
        <div className="grid-2">
          <article className="callout">
            <h3>Your local team</h3>
            <p>Owns the homeowner relationship, local survey, final approved measurements and shop drawings, any required engineering or permits, local installation and site acceptance, unless otherwise contracted.</p>
          </article>
          <article className="callout">
            <h3>Potential SeekAPI China-side scope</h3>
            <p>Identify eligible manufacturing candidates, coordinate specified material and hardware questions, compare supplier responses, and scope production inspection, labelled packaging and export/logistics handoffs.</p>
          </article>
        </div>
      </div>
    </section>

    <section className="section" id="existing-services">
      <div className="container">
        <SectionTitle eyebrow="Already know the product?" title="Use the right existing SeekAPI service." body="A custom manufacturing project does not have to buy a screening report first. Standard supplier checks and live RFQ remain separate, clearly priced services."/>
        <div className="grid-2">
          <article className="callout">
            <h3>China Supply Check · USD 2.99</h3>
            <p>Screen matching supplier candidates using listing evidence, product fit, quantities and MOQ. This is not a formal supplier quotation or manufacturing order.</p>
            <p><Link className="text-link" href="/china-supply-check">Explore supplier screening</Link></p>
          </article>
          <article className="callout">
            <h3>Verified RFQ Basic · USD 19.90</h3>
            <p>Prepare a standard supplier enquiry for current supplier-confirmed quotations. The Basic service does not include custom engineering or the purchase of goods.</p>
            <p><Link className="text-link" href="/china-supply-check/live-rfq-compare">Explore live supplier quotations</Link></p>
          </article>
        </div>
        <div className="link-list">
          <Link href="/for-agents">Integrating an AI Agent? Explore MCP and API tools</Link>
          <Link href="/trust">Review privacy, evidence and commercial roles</Link>
        </div>
      </div>
    </section>

    <FAQList eyebrow="Before you share drawings" title="Scope and responsibilities come first." faqs={faq}/>

    <CTA eyebrow="Trade-partner feasibility" title="Tell us what your team needs manufactured." body="Begin with a non-sensitive project summary. The current request flow creates an email draft for you to review and send; private drawings are not accepted through this page. Any paid work requires a separate agreed scope and terms." primaryLabel="Prepare a project enquiry" primaryHref="/start?audience=company" secondaryLabel="Current RFQ products" secondaryHref="/china-supply-check/live-rfq-compare"/>
  </PageShell>;
}
