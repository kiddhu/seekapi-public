export type ProcurementIntent = { slug:string; title:string; description:string; question:string; lead:string; example:string; sections:{title:string;body:string}[]; evidence:string[][]; next:string[]; unknowns:string; links:string[][] };
export const procurementIntents: ProcurementIntent[] = [
  {
    "slug": "find-china-suppliers",
    "title": "Find China suppliers for a specific product",
    "description": "Turn a product, quantity and specification brief into three evidence-backed China supplier candidates worth advancing to RFQ.",
    "question": "How do you turn a product request into a useful supplier search?",
    "lead": "A broad product search can return hundreds of offers from the same shop or superficially similar items. Start with the purchasing decision: which distinct suppliers have enough relevant evidence to justify your next RFQ?",
    "example": "Illustrative brief: 500 pieces of M6 flat washers, 304 stainless steel; no material substitutions. State the standard and dimensions if they are mandatory. This is a sample input, not a claim about available stock or a completed order.",
    "sections": [
      {
        "title": "Define the requirement before comparing offers",
        "body": "Name the product or model, requested quantity and unit, and the requirements that would cause you to reject an offer. Separate mandatory dimensions or materials from preferences. A search for a washer is not equivalent to a search for a particular washer standard. If a pack size matters, make the piece-to-pack relationship explicit."
      },
      {
        "title": "Count suppliers, not search results",
        "body": "Several listings may belong to one documented platform shop. A successful China Supply Check returns three distinct supplier candidates worth advancing to RFQ. It compares source evidence and identifies gaps rather than treating the first three product hits as three suppliers. An unsupported shortage is reported instead of padding the shortlist."
      }
    ],
    "evidence": [
      [
        "Product/model",
        "Match the named item and variant to the brief; a similar title alone may not establish dimensions."
      ],
      [
        "Quantity and unit",
        "Compare requested pieces with stated MOQ and pack basis before comparing price."
      ],
      [
        "Distinct identity",
        "Use documented platform-shop identity to separate suppliers from multiple offers."
      ],
      [
        "Source and time",
        "Retain the observed source and timestamp so an RFQ can refer to the same offer."
      ]
    ],
    "next": [
      "Ask each candidate to confirm the exact specification and order quantity.",
      "Request current price, available quantity and lead time on comparable terms.",
      "Resolve a missing dimension or pack conversion before committing to a sample."
    ],
    "unknowns": "A missing stock figure means stock is unknown for that candidate; it does not erase the product evidence. A listing price is dated commercial evidence, while a current supplier reply is a separate confirmation.",
    "links": [
      [
        "/china-supply-check/fasteners",
        "Fastener requirements"
      ],
      [
        "/china-supply-check/moq-specification-screening",
        "MOQ and specification screening"
      ]
    ]
  },
  {
    "slug": "china-supplier-screening",
    "title": "Screen China suppliers before an RFQ",
    "description": "Screen China supplier candidates returned for a product brief by must-match evidence, MOQ, alternatives and explicit gaps.",
    "question": "Which candidates should advance, and which need a specific question first?",
    "lead": "Screening is a decision about evidence relevant to your brief. A supplier can be worth approaching even when one exact product dimension still needs confirmation; that gap must remain visible.",
    "example": "Illustrative brief: 1,000 printed corrugated boxes, a specified internal size and board grade. A plain stock box may be a useful supplier lead, but it is not proof of custom-print capability at your quantity.",
    "sections": [
      {
        "title": "Separate mismatch, missing evidence and acceptable alternatives",
        "body": "A source that explicitly contradicts a mandatory requirement supports a mismatch finding. A source that omits it supports an unknown, not a failure or a pass. Permit alternatives only when your brief permits substitution. Keeping these states distinct prevents both false rejection of capable suppliers and false certainty about exact product fit."
      },
      {
        "title": "Screen the candidates returned for your brief",
        "body": "China Supply Check finds and screens candidates for a specified product. This guide does not describe a buyer-uploaded arbitrary supplier list or a separate verification product. The successful output is three distinct RFQ-worthy supplier candidates, with evidence and open questions. Exact product qualification remains a separate, field-specific judgment."
      }
    ],
    "evidence": [
      [
        "Hard requirements",
        "Read material, model and dimensions against the buyer brief."
      ],
      [
        "MOQ fit",
        "Check minimum quantity and compatible units; do not assume a supplier will waive MOQ."
      ],
      [
        "Substitution",
        "Retain the original requirement and whether the proposed alternative was permitted."
      ],
      [
        "Decision gap",
        "State which missing fact could change the RFQ decision."
      ]
    ],
    "next": [
      "Confirm the unresolved mandatory attribute with the supplier.",
      "Ask whether customization changes MOQ, tooling or sample requirements.",
      "Keep rejected mismatches separate from candidates awaiting a factual answer."
    ],
    "unknowns": "Missing certification or price-tier applicability belongs to the corresponding field. It must not become a blanket claim that the entire supplier is unverified, unreachable or commercially unusable.",
    "links": [
      [
        "/china-supply-check/moq-specification-screening",
        "Screening states and MOQ"
      ],
      [
        "/china-supply-check/packaging",
        "Packaging-specific questions"
      ]
    ]
  },
  {
    "slug": "china-supplier-verification",
    "title": "Interpret China supplier verification evidence",
    "description": "Understand company identity, platform certification and production-versus-trade evidence without confusing missing data with a failed supplier.",
    "question": "What does a supplier identity or certification claim actually establish?",
    "lead": "Verification evidence is useful only with a named subject, scope, source and time. A platform badge, company registration and product certificate answer different questions.",
    "example": "Illustrative reading: a platform badge attached to a shop may support a platform identity claim. It does not by itself establish that a particular SKU holds a destination-market certificate or that the seller owns a factory.",
    "sections": [
      {
        "title": "Follow the subject of each claim",
        "body": "Check whether the evidence names a platform shop, a legal company, a manufacturing site or a product. Keep the relationship between them explicit. Company registration can identify a legal entity when available; it does not establish product conformity, manufacturing ownership or present production capacity. Certification evidence must retain its stated subject and scope."
      },
      {
        "title": "Use the check as a starting point for diligence",
        "body": "China Supply Check reports supplier identity, platform certification and production-versus-trade evidence where a listing or bound source provides it. It is a pre-RFQ sourcing check, not legal due diligence or a universal factory audit. Three RFQ-worthy candidates do not imply three fully certified factories."
      }
    ],
    "evidence": [
      [
        "Company identity",
        "Recorded company name and relationship to the shop, where supported."
      ],
      [
        "Platform certification",
        "What the platform says it checked and which subject it covers."
      ],
      [
        "Production/trade identity",
        "Evidence of the stated role; catalog language alone is not proof of ownership."
      ],
      [
        "Date and source",
        "Preserve observation time and the original evidence path."
      ]
    ],
    "next": [
      "Ask for the legal contracting entity and its relationship to the shop.",
      "Request the certificate relevant to the exact product and destination.",
      "Use qualified inspection or professional diligence when your decision requires it."
    ],
    "unknowns": "An unavailable registration or certificate field is not a finding that registration or certification does not exist. Conversely, a badge is not evidence for every product or commercial claim.",
    "links": [
      [
        "/trust",
        "Evidence and role boundaries"
      ],
      [
        "/china-compliance-logistics",
        "Separate compliance coordination"
      ]
    ]
  },
  {
    "slug": "chinese-manufacturer-sourcing",
    "title": "Find Chinese manufacturers with production evidence",
    "description": "Source Chinese manufacturer candidates while distinguishing substantiated production capability from trader and catalog claims.",
    "question": "Do you need a manufacturer, or a supplier who can meet the requirement?",
    "lead": "Factory-direct language is easy to find. The more useful question is what evidence connects a candidate to the production process, capacity and product you need.",
    "example": "Illustrative brief: a connector with a fixed manufacturer part number, pin count and pitch, with substitutions prohibited. A distributor may have the exact part; an unrelated factory may not. State whether manufacturer status is itself mandatory.",
    "sections": [
      {
        "title": "Make production requirements concrete",
        "body": "If tooling ownership, a particular process or manufacturing-site evidence matters, put that constraint in the brief rather than relying on the word factory. Product compatibility and seller role are separate dimensions. A candidate's own catalog can suggest product coverage, but the report should distinguish the claim from supporting evidence."
      },
      {
        "title": "Keep a trader's role visible",
        "body": "A trader or distributor can be a useful RFQ candidate, particularly for stocked standard parts or mixed quantities. It should not be relabeled as a factory. China Supply Check returns supplier candidates and reports production-versus-trade identity where available; it does not promise that every candidate owns a manufacturing facility."
      }
    ],
    "evidence": [
      [
        "Product match",
        "Exact MPN, dimensions, material and substitution conditions."
      ],
      [
        "Production role",
        "Manufacturer/trader evidence and the source making the claim."
      ],
      [
        "Process capability",
        "Relevant production evidence where available; do not infer capacity from a product image."
      ],
      [
        "Commercial fit",
        "MOQ, observed price basis and contact path for the requested order."
      ]
    ],
    "next": [
      "Ask which legal entity manufactures the item and which entity sells it.",
      "Request process, tooling or site evidence relevant to your requirement.",
      "Confirm whether a sample is from current production or bought-in inventory."
    ],
    "unknowns": "Absent site or capacity evidence remains a named gap. It does not justify saying all candidates are factories or that all trading companies are unsuitable.",
    "links": [
      [
        "/china-supply-check/connectors",
        "Exact part and mating-fit screening"
      ],
      [
        "/sourcing/china-supplier-verification",
        "Identity evidence"
      ]
    ]
  },
  {
    "slug": "china-supplier-shortlist",
    "title": "Build a China supplier shortlist you can compare",
    "description": "Compare three distinct RFQ-worthy China supplier candidates by specification, price basis, MOQ, identity, contact and dated evidence.",
    "question": "What makes a three-supplier shortlist decision-ready?",
    "lead": "A shortlist is useful when the differences are comparable. Three names and three headline prices are not enough to decide which RFQ to send.",
    "example": "Illustrative comparison rule: compare per-piece prices only after recording currency, pack size and applicable tier. A low price for a different unit or quantity is not automatically a better offer.",
    "sections": [
      {
        "title": "Normalize the decision, preserve the source",
        "body": "Keep the original price and unit beside any interpretation. Record MOQ, requested quantity and whether their units can be compared. Supplier-published pricing is meaningful commercial evidence within those conditions. A current quote for your exact specification, quantity and delivery term still requires supplier confirmation."
      },
      {
        "title": "Explain why each candidate advances",
        "body": "For every candidate, identify the strongest product evidence, the commercial fit and the most important unresolved question. Supplier RFQ-worthiness and exact product qualification are separate. A successful China Supply Check returns three distinct RFQ-worthy supplier candidates; it records a shortage honestly when that result cannot be supported."
      }
    ],
    "evidence": [
      [
        "Distinct supplier",
        "Documented platform-shop identity and company evidence when available."
      ],
      [
        "Product and specification",
        "Matched requirements, explicit mismatches and unknown attributes."
      ],
      [
        "Price/MOQ",
        "Observed currency, unit, tier, minimum and requested-quantity fit."
      ],
      [
        "Next action",
        "Available contact path, source/time and reason to advance to RFQ."
      ]
    ],
    "next": [
      "Send a consistent specification to the candidates you choose.",
      "Ask the same price, MOQ, lead-time and sample questions.",
      "Recompare supplier replies on identical units and terms before purchasing."
    ],
    "unknowns": "A contact path does not prove a reply. Missing lead time does not invalidate an observed price. Keep each limitation attached to its own field rather than collapsing the report into a global disclaimer.",
    "links": [
      [
        "/china-supply-check/listing-price-vs-quote",
        "Observed price versus quotation"
      ],
      [
        "/china-supply-check/sample",
        "Read the public acceptance example"
      ]
    ]
  },
  {
    "slug": "china-procurement-service",
    "title": "Choose a China procurement service for the next decision",
    "description": "Understand what a one-off 2.99 USDC China supplier screening check covers, and when separately scoped human sourcing support is needed.",
    "question": "Do you need a shortlist now, or ongoing procurement execution?",
    "lead": "A first sourcing decision and an ongoing supplier relationship are different jobs. Choose the scope that matches the decision in front of you.",
    "example": "Illustrative situation: before ordering samples, you want three plausible Chinese suppliers for a defined item. Later you may need negotiations, sample follow-up or shipment coordination. The initial screening fee does not purchase those later services.",
    "sections": [
      {
        "title": "Buy a bounded pre-RFQ comparison",
        "body": "China Supply Check screens a product brief and returns three evidence-backed supplier candidates worth advancing to RFQ on success. The current price is 2.99 USDC via x402. The USD 2.99 Stripe Checkout target is being enabled and is not available to buy. Free MCP preparation lets you inspect a normalized brief before authorizing a paid run."
      },
      {
        "title": "Scope execution separately",
        "body": "Supplier contact, sending RFQs, negotiation, samples, inspection and logistics are not included in the screening purchase. Broader China Desk work requires its own scope, permissions and acceptance. Live RFQ Compare is a separate planned service, not a purchase option bundled with this check. No supplier reply or shipment is promised by the shortlist."
      }
    ],
    "evidence": [
      [
        "Purchased output",
        "Three distinct RFQ-worthy supplier candidates on successful completion."
      ],
      [
        "Research basis",
        "Dated product, observed price, MOQ and supplier evidence with gaps."
      ],
      [
        "Payment route",
        "Existing x402 path: 2.99 USDC on Base; card checkout not live."
      ],
      [
        "Service boundary",
        "Human execution and supplier outreach require separate authority."
      ]
    ],
    "next": [
      "Inspect the public sample and decide whether the report fields answer your question.",
      "Prepare a brief with quantity, unit and mandatory specifications.",
      "Seek a separate scoped service if your next step needs a person or physical evidence."
    ],
    "unknowns": "The public paid example contains an authorized aggregate acceptance outcome, not three published supplier cards or an independent customer testimonial. Assess the stated scope before paying.",
    "links": [
      [
        "/china-supply-check/alternatives",
        "Compare sourcing workflows"
      ],
      [
        "/china-desk",
        "Separately scoped China Desk"
      ],
      [
        "/china-supply-check/live-rfq-compare",
        "Planned RFQ service"
      ]
    ]
  },
  {
    "slug": "china-procurement-mcp",
    "title": "MCP for China procurement and supplier sourcing",
    "description": "Connect an AI agent to China supplier discovery, prepare a free brief and use the existing confirmed x402 purchase path.",
    "question": "How can an AI agent source Chinese suppliers without guessing the buying steps?",
    "lead": "Connect through the public Streamable HTTP MCP endpoint, read current discovery and prepare a product brief. Payment and execution are separate confirmed steps.",
    "example": "Illustrative brief: 500 M6 flat washers, unit pieces, material 304 stainless steel, substitutions false. The preparation example in the connection guide shows the actual typed draft shape; this text is not a paid invocation.",
    "sections": [
      {
        "title": "Discover and prepare before spending",
        "body": "Use https://api.seekapi.ai/mcp with a standard MCP client. Initialize and list tools, then call discover_china_supply_check_v0 with empty arguments. prepare_china_supply_check_v0 normalizes the product brief. Review the exact draft and digest with the buyer or delegated agent before proceeding. Discovery and preparation are free. Before authorizing payment, check the published price, the current payment route and the prepared requirements. Confirm whether dimensions, material and quantity are mandatory; preserve any unknowns for the supplier RFQ."
      },
      {
        "title": "Preserve confirmation and access boundaries",
        "body": "The existing purchase_china_supply_check_v0 and run_china_supply_check_v0 flow requires separate scope and payment confirmation. The current x402 price is 2.99 USDC on Base; Public credit-card checkout is OFF and is not live. status_china_supply_check_v0 and result_china_supply_check_v0 require independent signed-wallet authentication bound to the settled order."
      }
    ],
    "evidence": [
      [
        "Discovery",
        "Current availability, tool names, price and accepted input."
      ],
      [
        "Prepared brief",
        "Product/model, quantity/unit, mandatory requirements and substitution choice."
      ],
      [
        "Confirmation",
        "Exact buyer-approved scope and supported payment path."
      ],
      [
        "Report",
        "Three RFQ-worthy candidates on success, source evidence and field-specific gaps."
      ]
    ],
    "next": [
      "Read the current live discovery contract rather than a cached directory snippet.",
      "Inspect the prepared brief before authorizing purchase and execution.",
      "Keep report access authentication separate from payment proof."
    ],
    "unknowns": "Adding an MCP server does not authorize payment or supplier outreach. A payment proof or arbitrary order ID alone does not grant report access. No alternate payment system or new SDK is needed.",
    "links": [
      [
        "/for-agents#china-supply-check-mcp",
        "Connection and typed preparation example"
      ],
      [
        "/apis",
        "Separate interface and capability states"
      ]
    ]
  },
  {
    "slug": "china-supplier-api",
    "title": "China supplier API access through MCP",
    "description": "Understand the current typed MCP interface for China supplier screening, including evidence, partial results and payment-state semantics.",
    "question": "What should a developer preserve when turning supplier evidence into an application?",
    "lead": "The documented public integration for China Supply Check is MCP. Treat the live tool schemas as the interface contract; do not infer an undocumented REST endpoint from a product page.",
    "example": "Illustrative rendering rule: show an observed price beside its source time, currency, original unit and tier. Display an unavailable certification as unknown for that field, not as supplier failure.",
    "sections": [
      {
        "title": "Use the published tools and their current schemas",
        "body": "Initialize the public Streamable HTTP endpoint at https://api.seekapi.ai/mcp, request tools/list and read discover_china_supply_check_v0. The agent guide supplies a typed preparation example. Confirm the normalized draft before the existing purchase/run flow. This guide does not introduce a REST route, scraping API or a second payment protocol."
      },
      {
        "title": "Keep evidence semantics through your UI",
        "body": "Do not flatten the report to a supplier name and number. Preserve product/SKU context, MOQ fit, observed price basis, source/time, identity evidence where available and explicit unknowns. A successful check returns three distinct candidates worth advancing to RFQ; exact product qualification is separate. A shortage or incomplete evidence must remain visible rather than being converted to a fabricated third candidate."
      }
    ],
    "evidence": [
      [
        "Identity",
        "Documented platform shop plus available company/certification evidence."
      ],
      [
        "Commercial observations",
        "Original price basis, currency, unit, tier and requested-quantity context."
      ],
      [
        "Provenance",
        "Source link and observation time; distinguish observation from supplier confirmation."
      ],
      [
        "State",
        "Current product availability, completion state, gaps and authorized report access."
      ]
    ],
    "next": [
      "Build from current tool schemas instead of a copied directory schema.",
      "Keep unknowns distinct from false, zero or an empty commercial claim.",
      "Use signed-wallet authentication for current order reads; never treat an ID as a credential."
    ],
    "unknowns": "Separate raw product-data capabilities can have different prices and access states. Their 0.022 USDC keyword-search terms do not describe China Supply Check. Read each capability's current discovery contract.",
    "links": [
      [
        "/for-agents",
        "Typed MCP examples"
      ],
      [
        "/apis#product-search",
        "Separate raw product-data capability"
      ],
      [
        "/china-supply-check/listing-price-vs-quote",
        "Price interpretation"
      ]
    ]
  }
];
