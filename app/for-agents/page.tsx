import Link from 'next/link';
import { CTA, Eyebrow, FAQList, FeatureCard, PageShell, SectionTitle, ServiceFaqSchema, type FaqItem } from '@/components/site';
import { pageMetadata } from '@/lib/site';
export const metadata=pageMetadata('Human Execution for AI Agents','A manual-review human execution layer for approved China-side supply-chain tasks.','/for-agents');
const tasks=[
 ['AH01','Supplier contact','Contact a named supplier and return structured answers without changing commercial terms.'],
 ['AH02','Discovery & qualification','Find candidates, check available evidence and return capability gaps and unknowns.'],
 ['AH03','RFQ execution','Send an approved revision to approved recipients and normalize responses.'],
 ['AH04','Sample / NPI follow-up','Track sample status, revision, issues and buyer approval evidence.'],
 ['AH05','Physical verification coordination','Coordinate observable evidence or qualified third-party inspection where available.'],
 ['AH06','Quality / exception recovery','Follow up on delay, rework, nonconformance or loss of communication.'],
 ['AH07','Delivery, logistics & warehousing','Coordinate packaging, freight, shipment milestones, warehouse evidence, inventory status and local readiness within the agreed role.'],
 ['AH08','Compliance research + human verification','Add human verification to entity, license, product-path, document, contact or other critical business facts.'],
];
const handoff=`requester_type: agent
organization: example_ai_team
objective: confirm_sample_revision_status
task_type: AH01
context_summary: illustrative_only
allowed_actions: [contact_supplier, request_status]
prohibited_actions: [change_terms, make_payment, accept_deviation]
recipient_permissions: [named_supplier]
max_budget: null
deadline: null
required_evidence: [supplier_response, photo_if_available]
completion_definition: status_and_open_questions_returned
human_approval_contact: required`;
const receipt=`status: COMPLETED | PARTIAL | BLOCKED | DECLINED
actions_taken: [{actor_type, action, timestamp}]
findings: []
evidence: [{source, created_by, timestamp, limitation}]
costs: {approved: 0, actual: 0, third_party: 0}
open_questions: []
exceptions: []
next_decision: null`;
const faqs:FaqItem[]=[{question:'Is a public human-task API live?',answer:'No. The current public route is manual scope review. A task API, MCP and WebMCP execution are not live on this preview.'},{question:'How does an Agent start?',answer:'The Agent owner or developer prepares a non-sensitive task class, objective, allowed actions, prohibited actions, evidence requirements and human approval contact for manual review.'},{question:'Can an Agent authorize payment or accept a quality deviation?',answer:'Not by default. Payment, contract changes, quality deviations and other high-risk actions require explicit human authority. No payment is available in this preview.'}];
export default function Page(){return <PageShell>
  <ServiceFaqSchema name="China Human Execution Layer for AI Agents" description="Bounded human handoffs, verification and evidence return for AI teams with China-side tasks." path="/for-agents" faqs={faqs}/>
  <section className="page-hero"><div className="container"><Eyebrow>For Agents & AI teams</Eyebrow><h1>Give your agent hands in China.</h1><p>When a task needs local supplier communication, physical verification, human judgment or accountable follow-through, define a bounded handoff to SeekAPI. The current public handoff is a manual-review preview; no live human-task API is claimed.</p><div className="button-row"><Link className="button" href="/start?audience=agent">Draft a China task</Link><a className="button button-ghost" href="/for-agents/agent-services.json">Read the service manifest</a></div></div></section>
  <section className="section section-dark"><div className="container"><SectionTitle eyebrow="Handoff trigger" title="Use a human when the task crosses the software boundary." body="Software can research, compare and plan. Human execution becomes relevant when the work requires Chinese-language contact, a physical observation, commercial authority, judgment or persistence across several people."/></div></section>
  <section className="section" id="task-types"><div className="container"><SectionTitle eyebrow="Proposed task classes" title="Eight task types, each subject to scope review." body="These classes define the service vocabulary. They do not claim universal availability, location coverage or automatic acceptance."/><div className="grid-2">{tasks.map(([id,title,body])=><FeatureCard key={id} index={id} title={title} body={body}/>)}</div></div></section>
  <section className="section section-dark" id="handoff-spec"><div className="container"><SectionTitle eyebrow="Illustrative handoff" title="State what humans may do, must return and must never infer." body="Contact authority does not imply RFQ, spending, contract or production authority. Sensitive files are excluded from this preview."/><pre className="code-block" aria-label="Illustrative structured agent handoff">{handoff}</pre></div></section>
  <section className="section" id="evidence-return"><div className="container"><SectionTitle eyebrow="Illustrative evidence return" title="“Done” is not a sufficient result." body="A completed or blocked task should return actions, sources, limitations, costs, unknowns and the next decision."/><pre className="code-block" aria-label="Illustrative evidence return">{receipt}</pre></div></section>
  <section className="section section-dark" id="agent-human-desk"><div className="container"><SectionTitle eyebrow="Agent Human Desk" title="Reserved human execution capacity under agreed permissions." body="For AI teams with recurring China-side work, a Desk can define task classes, concurrent work, response windows, evidence, escalation contacts and spending authority. Scope and service levels require agreement; this preview is not a live subscription."/><div className="button-row"><Link className="button" href="/start?audience=agent&intent=agent-human-desk">Request an Agent Human Desk</Link></div></div></section>
  <section className="section" id="availability"><div className="container"><SectionTitle eyebrow="Current state" title="Manual review preview." body="The task vocabulary, permissions and evidence format are defined. Manual scope questions can be sent by email, but structured web intake, universal coverage, public task API, MCP and WebMCP execution are not live on this preview."/><div className="link-list"><a className="text-link" href="mailto:support@seekapi.ai">Email support@seekapi.ai</a><Link className="text-link" href="/china-compliance-logistics">Compliance, logistics and warehousing</Link><Link className="text-link" href="/trust">Data, role and payment boundaries</Link><Link className="text-link" href="/how-it-works">See the complete operating path</Link></div></div></section>
  <FAQList eyebrow="Common questions" title="Automation does not bypass authority." faqs={faqs}/>
  <CTA title="Prepare a bounded handoff." body="Validate a non-sensitive draft in the browser. Nothing is submitted or accepted in this preview." primaryLabel="Draft an Agent handoff" primaryHref="/start?audience=agent" secondaryLabel="Read the manifest" secondaryHref="/for-agents/agent-services.json"/>
</PageShell>}
