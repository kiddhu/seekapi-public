# China supplier quotes for your Agent

Turn a buying requirement into a free, editable brief, then let the buyer review it and choose a one-time **USD19.90 Verified RFQ Basic** service. No prior USD2.99 screening purchase is needed.

SeekAPI contacts up to three matched Chinese suppliers and targets at least one current qualified supplier-confirmed quote within three China business days after payment and essential requirement confirmation, or refunds the RFQ service fee to the original payment method. Results include a human report, Agent JSON and an evidence list.

[Prepare for free in the buyer form](https://api.seekapi.ai/checkout/stripe/rfq) · [MCP and official-SDK guide](https://seekapi.ai/for-agents#rfq-free-mcp)

## Install the skill

The directory follows the [Agent Skills format](https://agentskills.io/specification). For an Agent Skills client that supports GitHub sources:

```sh
DISABLE_TELEMETRY=1 npx skills add kiddhu/seekapi-public --skill china-supplier-quotes
```

Review the selected files and choose the intended local agent when the installer prompts. The command installs this guide; it does not configure an MCP server, install the Python SDK, prepare a requirement or start payment. Manual installation is also possible by copying this directory into the skill location documented by your client.

The third-party CLI is optional. Its documented telemetry opt-out is set above; this project does not use internal installs to create popularity or customer claims. Compatibility depends on the client's implementation of Agent Skills.

## Use it for a real buyer

Example task:

> I need current quotes from Chinese manufacturers for a 24 V DC industrial relay, 100 pieces, shipped to Rotterdam. Help me prepare a sourcing brief and review the required specifications before I choose payment.

The skill asks for missing facts, discovers the current free MCP tools, prepares one buyer-authorized draft and hands the private result to the buyer. When an MCP connection is unavailable, the free buyer form is an immediate continuation path.

Free MCP endpoint: `https://api.seekapi.ai/mcp`.

Free tools: `discover_rfq_basic_v0` and `prepare_rfq_basic_v0`.

The optional [existing Python SDK example](https://seekapi.ai/developers/free-mcp-quickstart/README.md) writes a new private import file for a ready requirement. Its packaged demo is synthetic and marked internal; it is not a customer request.

## Buyer control

The skill stops before requirement confirmation, Checkout, payment, supplier contact and goods purchase. The buyer reviews and chooses payment in the official form. It does not request a wallet, service API key or production credentials. For status on an existing paid request, use that request's original private recovery link.

Automatic Amazon import is not enabled by this skill. A product link can be preserved alongside buyer-confirmed specifications; the form can accept the buyer's image.

## Contents

- [SKILL.md](SKILL.md): task triggers and free-brief-to-buyer-handoff instructions.
- [Brief checklist](references/buyer-brief.md): specification prompts and quote comparison fields.

Publishing or installing this skill is a distribution step, not evidence of independent demand, payment, delivery or profit.
