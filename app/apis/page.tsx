import { CTA, Eyebrow, FeatureCard, PageShell, ProcessSteps, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'SeekAPI Machine Interfaces',
  'Discover product search over public MCP, inspect its x402 price without paying, and review the separate human-task API status.',
  '/apis',
);

const registryUrl = 'https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.kiddhu%2Fseekapi';
const unpaidExample = JSON.stringify({
  name: 'invoke_product_keyword_search_v0',
  arguments: { request: { q: 'desk lamp', page: 1, page_size: 3 } },
}, null, 2);

export default function Page() {
  return <PageShell>
    <section className="page-hero"><div className="container">
      <Eyebrow>For developers and machines</Eyebrow>
      <h1>Discover product search. Inspect the price before paying.</h1>
      <p>The public product-data MCP endpoint supports free tool discovery and an unpaid search payment challenge. Paid search remains a limited test for one bound owner wallet. The other four product capabilities return sandbox fixtures. Human-task APIs are a separate, planned service.</p>
      <div className="button-row"><a className="button" href="#product-search">Start without a wallet</a><a className="button button-ghost" href="/for-agents/agent-services.json">Human-service manifest</a></div>
    </div></section>

    <section className="section" id="product-search"><div className="container">
      <SectionTitle eyebrow="Public product-data discovery" title="Connect without credentials or payment." body="Use a standard MCP client with Streamable HTTP. Leave automatic payment disabled and do not attach a wallet, signature or payment metadata. These free steps do not call OneBound or return live product results."/>
      <div className="grid-3">
        <FeatureCard title="Public MCP endpoint" body="https://api.seekapi.ai/mcp — Streamable HTTP. No account or API key is needed to initialize, list tools or inspect discovery."/>
        <FeatureCard title="Current search terms" body="0.022 USDC for a successful useful result, on Base mainnet (eip155:8453). That is 22,000 atomic units of six-decimal USDC. The official x402 challenge is authoritative."/>
        <FeatureCard title="Paid access is restricted" body="Only the bound owner test wallet can pay for live search. This is not open paid access for external buyers. Product detail, public offer snapshots, shop product pages and seller public profiles remain sandbox-only."/>
      </div>
      <div className="link-list"><a className="text-link" href={registryUrl}>Find SeekAPI in the official MCP Registry</a><a className="text-link" href="https://api.seekapi.ai/mcp">Public MCP endpoint</a><a className="text-link" href="#unpaid-quickstart">No-payment quickstart</a></div>
    </div></section>

    <section className="section section-dark" id="unpaid-quickstart"><div className="container">
      <SectionTitle eyebrow="No-payment quickstart" title="Find the tool, read its contract, stop at the payment request." body="The Registry identifies the endpoint. Read the live discovery response for the current capability mode, wallet restriction and terms; a listing does not authorize a purchase."/>
      <ProcessSteps steps={[
        { title: 'Connect and list tools', body: 'Connect to the public MCP endpoint with Streamable HTTP, initialize the session and request tools/list. Use the client’s normal MCP transport and default headers.' },
        { title: 'Read the search contract', body: 'Call discover_product_keyword_search_v0 with empty arguments. Inspect its input contract, example request, pricing, payment network, bound payer and invocation instructions.' },
        { title: 'Request an unpaid challenge', body: 'Call invoke_product_keyword_search_v0 with the request shown below and no payment metadata. Expect an x402 payment-required tool error, not product data. Confirm exact, eip155:8453, amount 22000 and the USDC asset match discovery. Stop here; do not approve or sign a payment.' },
      ]}/>
      <pre className="code-block" aria-label="Unpaid MCP tools/call parameters">{unpaidExample}</pre>
      <p>Verified no-payment clients: Python MCP 1.30.0 with x402 2.24.0 using <code>x402MCPSession</code> and <code>auto_payment=False</code>; JavaScript MCP SDK 1.30.1 without a payment client. A Python MCP 2.2.0 high-level client paired with the generic x402 wrapper has a known call-interface mismatch; use the verified session-based combination for this check.</p>
      <p>This is the parameters object for MCP <code>tools/call</code>, after initialization. The client handles the JSON-RPC envelope and session. An idempotency key is optional for this unpaid check; any later authorized paid call requires the stable key documented by discovery.</p>
      <p>MCP returns an isError=true tool result containing structured x402 requirements; its HTTP transport can still return 200. A REST payment challenge uses HTTP 402. A 403 HTML page is an ingress failure, not an x402 payment request. Record the time, client version and Cloudflare Ray ID, then contact <a href="mailto:support@seekapi.ai">support@seekapi.ai</a>. Do not send wallet material or attempt payment to resolve a connection error.</p>
    </div></section>

    <section className="section" id="human-task-status"><div className="container">
      <SectionTitle eyebrow="Separate human-task service" title="Human-task API, MCP and WebMCP execution remain planned." body="The human-service manifest describes proposed China-side work, required handoff fields, approval boundaries and possible outputs. It does not activate human-task execution or payments."/>
      <div className="grid-3">
        <FeatureCard title="Human-service discovery" body="agent-services.json describes the human execution service. Its planned MCP status applies to human tasks, not the product-data discovery endpoint above."/>
        <FeatureCard title="User-reviewed intake" body="The browser can prepare an email draft. The user reviews and sends it; the website does not submit or accept the task automatically."/>
        <FeatureCard title="Human-task interface status" body="Human Task API, human-task MCP and WebMCP remain planned_not_live. No human-task execution endpoint or payment capability is claimed."/>
      </div>
      <div className="link-list"><a className="text-link" href="/for-agents/agent-services.json">Machine-readable human-service manifest</a><a className="text-link" href="/for-agents">Human Execution Layer</a><a className="text-link" href="/trust">Trust and authorization boundaries</a></div>
    </div></section>
    <CTA title="Does the task require a real person in China?" body="Use the Human Execution page to define the task, authority and evidence required." primaryLabel="For Agents" primaryHref="/for-agents" secondaryLabel="Company services" secondaryHref="/china-supply-chain"/>
  </PageShell>;
}
