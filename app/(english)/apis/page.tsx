import { CTA, Eyebrow, FeatureCard, PageShell, ProcessSteps, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'China supplier MCP/API interfaces — China Supply Check',
  'China Supply Check uses typed MCP tools: three RFQ-worthy China supplier candidates with evidence, 2.99 USDC via live x402. Separate raw product-data capabilities retain their own terms.',
  '/apis',
);

const registryUrl = 'https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.kiddhu%2Fseekapi';
const unpaidExample = JSON.stringify({
  name: 'discover_china_supply_check_v0',
  arguments: {},
}, null, 2);

export default function Page() {
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>For developers and machines</Eyebrow>
      <h1>China supplier screening through a typed MCP interface.</h1>
      <p>China Supply Check is the current sourcing product: three distinct evidence-backed China supplier candidates worth advancing to RFQ on success. Free discovery and preparation use public MCP; the existing confirmed x402 purchase path is live at 2.99 USDC on Base. Public credit-card checkout is OFF and is not available to buy.</p><p>Other raw product-data capabilities are not available for public purchase. Their test access does not describe China Supply Check. Human-task APIs are a separate, planned service.</p>
      <div className="button-row"><a className="button" href="/for-agents#china-supply-check-mcp">China Supply Check MCP guide</a><a className="button button-ghost" href="/sourcing/china-supplier-api">Evidence response semantics</a></div>
    </div></section>

    <section className="section"><div className="container"><SectionTitle title="Use the live CSC tool contract" body="Read discover_china_supply_check_v0 and prepare_china_supply_check_v0 before the confirmed purchase/run flow. status_china_supply_check_v0 and result_china_supply_check_v0 require signed-wallet authentication bound to the settled order. This site does not document a separate CSC REST endpoint."/><a className="text-link" href="/china-supply-check">Product and current purchase path</a></div></section>
    <section className="section" id="product-search"><div className="container">
      <SectionTitle eyebrow="Public MCP discovery" title="Connect without credentials or payment." body="Use a standard MCP client with Streamable HTTP. Discovery and preparation are free. Keep automatic payment disabled while reading the contract and preparing your sourcing brief."/>
      <div className="grid-3">
        <FeatureCard title="Public MCP endpoint" body="https://api.seekapi.ai/mcp — Streamable HTTP. No account or API key is needed to initialize, list tools or inspect discovery."/>
        <FeatureCard title="Current sourcing product" body="China Supply Check costs 2.99 USDC on Base through live x402. Public credit-card checkout is OFF. Successful delivery provides three distinct RFQ-worthy supplier candidates with evidence and explicit unknowns."/>
        <FeatureCard title="Other capability states" body="Raw product-data capabilities are not available for public purchase. Human-task execution remains planned. Inspect current discovery before using a capability."/>
      </div>
      <div className="link-list"><a className="text-link" href={registryUrl}>Find SeekAPI in the official MCP Registry</a><a className="text-link" href="https://api.seekapi.ai/mcp">Public MCP endpoint</a><a className="text-link" href="#unpaid-quickstart">Free discovery quickstart</a></div>
    </div></section>

    <section className="section section-dark" id="unpaid-quickstart"><div className="container">
      <SectionTitle eyebrow="Free discovery quickstart" title="Read the current contract, then prepare your brief." body="The Registry identifies the endpoint. Discovery explains the current product, payment state and tool schemas. Preparation lets you inspect the brief before authorizing a purchase."/>
      <ProcessSteps steps={[
        { title: 'Connect and list tools', body: 'Connect to the public MCP endpoint with Streamable HTTP, initialize the session and request tools/list. Use the client’s normal MCP transport and default headers.' },
        { title: 'Read the sourcing contract', body: 'Call discover_china_supply_check_v0 with empty arguments. Inspect the input contract, example brief, current availability, price and supported payment method.' },
        { title: 'Prepare without paying', body: 'Call prepare_china_supply_check_v0 using the current schema and your product requirements. Review the normalized brief, delivery promise and remaining unknowns. Preparation does not purchase or execute a supplier check.' },
      ]}/>
      <pre className="code-block" aria-label="Free discovery MCP tools/call parameters">{unpaidExample}</pre>
      <p>This is the parameters object for MCP <code>tools/call</code>, after initialization. Your MCP client handles the JSON-RPC envelope and session. See the <a href="/for-agents#china-supply-check-mcp">China Supply Check MCP guide</a> for preparation and the confirmed purchase/run flow.</p>
      <p>A connection error does not authorize payment. Contact <a href="mailto:support@seekapi.ai">support@seekapi.ai</a> with the time and client version if discovery fails. Do not send wallet secrets or payment credentials.</p>
    </div></section>

    <section className="section" id="human-task-status"><div className="container">
      <SectionTitle eyebrow="Separate human-task service" title="Human-task API, MCP and WebMCP execution remain planned." body="The human-service manifest describes proposed China-side work, required handoff fields, approval boundaries and possible outputs. It does not activate human-task execution or payments."/>
      <div className="grid-3">
        <FeatureCard title="Human-service discovery" body="agent-services.json describes the human execution service. Its planned MCP status applies to human tasks, not the product-data discovery endpoint above."/>
        <FeatureCard title="User-reviewed intake" body="The browser can prepare an email draft. The user reviews and sends it; the website does not submit or accept the task automatically."/>
        <FeatureCard title="Human-task interface status" body="Human Task API, human-task MCP and WebMCP remain planned_not_live. No human-task execution endpoint or payment capability is claimed."/>
      </div>
      <div className="link-list"><a className="text-link" href="/for-agents/agent-services.json">Machine-readable human-service manifest</a><a className="text-link" href="/china-desk">Human execution scope</a><a className="text-link" href="/trust">Trust and authorization boundaries</a></div>
    </div></section>
    <CTA title="Does the task require a real person in China?" body="Use the Human Execution page to define the task, authority and evidence required." primaryLabel="China Desk" primaryHref="/china-desk" secondaryLabel="Company services" secondaryHref="/china-supply-chain"/>
  </PageShell>;
}
