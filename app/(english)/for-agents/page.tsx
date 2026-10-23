import {FreeAgentQuickstart} from '@/components/free-agent-quickstart';
import {readPublicSamplePublication} from '@/lib/public-agent-sample';
import Link from 'next/link';import {ImageSupplyCheckEntry} from '@/components/image-supply-check-entry';import {PageShell} from '@/components/site';import {ProductFirstMethod} from '@/components/product-first-method';import {cscPaymentCopy} from '@/lib/csc-commercial-truth';import {pageMetadata} from '@/lib/site';
const rfqPreparationExample={
  "action": "prepare_runtime",
  "draft": {
    "schema_version": "RFQ_AGENT_INTENT_V2",
    "product": "Inductive proximity sensor",
    "variant": "M12 24V DC NPN normally-open 2m cable",
    "description": "Owner-authorized synthetic acceptance only. Industrial sensor requirement; no customer demand or purchase instruction.",
    "quantity": 120,
    "unit": "pieces",
    "destinationCountry": "Netherlands",
    "destinationPort": "Rotterdam",
    "mustMatch": [
      {
        "attribute": "housing thread",
        "expected": "M12"
      },
      {
        "attribute": "supply voltage",
        "expected": "24 V DC"
      },
      {
        "attribute": "output",
        "expected": "NPN normally open"
      },
      {
        "attribute": "cable length",
        "expected": "2 m"
      }
    ],
    "matchPolicy": "EXACT_ONLY",
    "source_references": [
      {
        "reference_id": "synthetic-industrial-spec",
        "reference_type": "STRUCTURED_REQUIREMENT",
        "role": "SPEC_REFERENCE",
        "value": "Synthetic lab requirement: M12 inductive proximity sensor, 24 V DC, NPN normally open, 2 m cable, 120 pieces to Rotterdam, Netherlands.",
        "provenance": "BUYER_STATED"
      }
    ],
    "buyer_policy": {
      "purpose": "OTHER"
    }
  }
};
export const metadata=pageMetadata('For Agents — supplier comparison, payment modes and public sample','Use free MCP discovery before purchase. Inspect product-first V2 sample JSON, commercial scoring, source factory tiers and RFQ questions.','/for-agents');
export default function Agents(){const sampleAvailable=readPublicSamplePublication()!==null;return <PageShell><section className="page-hero"><div className="container"><h1>Find matching products. Explain the supplier choice.</h1><p>{cscPaymentCopy}</p><div className="button-row">{sampleAvailable?<><Link className="button" href="/china-supply-check/sample">Read the human sample</Link><a className="button button-ghost" href="/china-supply-check/sample.json">Read Agent JSON</a></>:<p>The public example is currently unavailable. Use live discovery for current product and purchase information.</p>}</div></div></section><section className="section" id="china-supply-check-mcp"><div className="container"><h2>Connect and read before buying</h2><p>Connect a standard Streamable HTTP MCP client to <code>https://api.seekapi.ai/mcp</code>. Initialize, list tools and call <code>discover_china_supply_check_v0</code> with empty arguments. Runtime admission is the authority for each payment mode; static descriptions are dated observations.</p><pre>{JSON.stringify({name:'discover_china_supply_check_v0',arguments:{}},null,2)}</pre><p>Free <code>prepare_china_supply_check_v0</code> accepts a written brief or the supported bounded reference image plus optional notes. Review and edit the brief before exact signed confirmation. Discovery and preparation do not purchase a check or contact suppliers.</p><p>Agents use independent signed-wallet authentication bound to the settled order for purchase, run, status and result operations. Payment proof or an order ID alone does not grant access. Stripe customers use their secure recovery link. Existing results never require paying again.</p><h2>Public example availability</h2>{sampleAvailable?<><p>MCP resource: <code>seekapi://china-supply-check/sample/current</code>. List resources, then use resources/read. The reviewed release pairs its response with the exact <a href="/china-supply-check/sample.json">sample JSON</a> bytes. Read the resource and its wire/canonical digests; a pointer alone is not proof of availability.</p></>:<p>The public example is currently unavailable. Use live discovery for current product and purchase information.</p>}<p>Public contract: <code>csc.public-agent-sample.v4</code>; selection: <code>CSC_PRODUCT_FIRST_FACTORY_TIER_SELECTION_V2</code>; trust: <code>SUPPLIER_TRUST_PROFILE_Q1_Q6_V2</code>.</p><div className="link-list"><a href="/.well-known/ard.json">Agent resource discovery</a><a href="/for-agents/agent-services.json">Agent manifest</a><a href="/openapi.json">Public HTTP read documentation</a></div></div></section><FreeAgentQuickstart/><section className="section"><div className="container"><h2>Keep the buyer’s specification intact</h2><p><Link href="/sourcing/rfq-templates/china-supplier-brief">Use the brief worksheet</Link> to preserve quantity, units, exact model and permitted substitutions. <Link href="/sourcing/workflows/drawing-and-model-revision-checklist">Record drawing revisions</Link> rather than inferring them from a similar photograph.</p></div></section><ImageSupplyCheckEntry/><ProductFirstMethod/><section className="section" id="rfq-requirement-prepare"><div className="container"><h2>Prepare a procurement requirement for free</h2><p>Start with a written product, model, must-match specifications, quantity and destination. No image is required. This RFQ preparation API returns a reviewable requirement; it does not accept a paid assignment, create an order or contact suppliers. The USD19.90 RFQ service remains closed for purchase. Large-image upload reliability has not been established.</p><ol><li>Read the <a href="https://api.seekapi.ai/checkout/stripe/rfq?format=openapi">RFQ OpenAPI</a> and preserve the buyer’s exact specifications.</li><li>POST JSON to <code>https://api.seekapi.ai/checkout/stripe/rfq</code> with <code>action=prepare_runtime</code> and a <code>draft</code> as below. Send <code>Origin: https://api.seekapi.ai</code>, <code>x-seekapi-card-claim: 1</code> and <code>Content-Type: application/json</code>. Free preparation needs no Cookie, Bearer or capability token.</li></ol><h3>Complete no-image example</h3><p>This synthetic industrial example was checked through the public free preparation entry. It is an example requirement, not independent customer demand or an instruction to purchase.</p><pre>{JSON.stringify(rfqPreparationExample,null,2)}</pre><p>With <code>READY</code>, review the normalized requirement and digest. With <code>NEEDS_CLARIFICATION</code>, supply only the missing facts. With <code>ELIGIBILITY_REVIEW_REQUIRED</code>, stop the commercial flow. Keep signed prepared objects and receipts private and out of logs.</p><p>Stop after preparation: do not call session, confirm or checkout while paid RFQ is closed. This is an HTTPS REST entry, separate from China Supply Check MCP. See the <Link href="/china-supply-check/live-rfq-compare">RFQ service scope and current availability</Link>.</p></div></section><section className="section" id="agent-human-desk"><div className="container"><h2 id="handoff-spec">Prepare an RFQ without implying execution</h2><p id="evidence-return">A separately accepted assignment returns dated evidence, remaining unknowns and the next requested approval.</p><p>{sampleAvailable?"The sample shows RFQ unknowns and a draft. ":""}The proposed $19.90 contact, translation, follow-up and formal quotation comparison service is not open for purchase; it is not a contact-unlock fee. Business contacts already public in authenticated paid reports remain readable. Sample contact availability is null when unknown.</p><p>A buyer or Agent can request manual scope review for selected-supplier contact, sample follow-up or procurement coordination. A person must accept scope, fee, recipients and authority first. No autonomous human-task API or automatic acceptance is live.</p><Link className="button" href="/start?audience=agent">Prepare a reviewable scope request</Link></div></section></PageShell>}
