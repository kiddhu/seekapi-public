import {readPublicSamplePublication,publicSampleMetadata} from '@/lib/public-agent-sample';
import {cscCommercialTruth as truth} from '@/lib/csc-commercial-truth';
import {rfqServiceDiscovery,rfqSalesSummary,rfqMcpPreparation} from '@/lib/rfq-basic-copy';
export const dynamic='force-static';
export async function GET(){const publication=readPublicSamplePublication();const {public_agent_sample:_pointer,...withoutSample}=truth;return Response.json({
 description:rfqSalesSummary,
 primary_service:'verified_rfq_basic',
 new_purchase_admission:{authority:'CURRENT_RUNTIME_DISCOVERY',static_status_scope:'IMPLEMENTED_CAPABILITIES_AND_DATED_OBSERVATIONS',pause_on:['PAUSED','UNKNOWN'],free_rfq_preparation_during_pause:true},
 customer_value:truth.customer_value,
 provider:'SeekAPI',manifest_schema_version:'seekapi.agent-services.v2',commercial_truth:publication?truth:withoutSample,versions:truth.versions,contract_updated_at:truth.contract_updated_at,observed_at:truth.availability_observed_at,
 selection_transparency:publicSampleMetadata(publication),...(publication?{public_agent_sample:publication.discovery_pointer,current_sample_url:'https://seekapi.ai/china-supply-check/sample'}:{}),
 product_data_mcp:{live:true,endpoint:'https://api.seekapi.ai/mcp',transport:'streamable-http',csc_public_paid_on:true,price_usdc:truth.price.amount,payments:truth.payments,free_tools:truth.tools.free,authenticated_order_read_tools:truth.tools.authenticated_reads,paid_effect_tools:truth.tools.paid,status_result_access:'Independent signed-wallet authentication bound to the settled order. Stripe uses the secure card recovery link; no repayment.',image_input:{no_value_prepare:true,accepted_mime:['image/png'],stripe_status:truth.payments.image_first.stripe.status,x402_status:truth.payments.image_first.x402.status,discovery_tool:'discover_china_supply_check_v0',card_entry:truth.image_intake.card_entry,card_usd:truth.price.card_usd,scope:'MAIN_PRODUCT_ONLY'}},
 verified_rfq_basic:truth.live_rfq,
 service_discovery:rfqServiceDiscovery,
 rfq_free_preparation_mcp:rfqMcpPreparation,
 rfq_requirement_preparation:{
  "status": "FREE_PREPARE_AVAILABLE",
  "scope": "REQUIREMENT_PREVIEW_ONLY",
  "preferred_interface": "rfq_free_preparation_mcp",
  "transport": "HTTPS_JSON_REST",
  "endpoint": "https://api.seekapi.ai/checkout/stripe/rfq",
  "openapi_url": "https://api.seekapi.ai/checkout/stripe/rfq?format=openapi",
  "method": "POST",
  "action": "prepare_runtime",
  "required_headers": {
    "Origin": "https://api.seekapi.ai",
    "x-seekapi-card-claim": "1",
    "Content-Type": "application/json"
  },
  "authentication": "NONE_FOR_FREE_PREPARE",
  "supported_entry": "EXPLICIT_TEXT_MODEL_SPECIFICATIONS_QUANTITY_DESTINATION",
  "image_required": false,
  "optional_reference_image": {"processing":"SAME_CHANNEL_A_AS_CHINA_SUPPLY_CHECK", "scope":"PROCESSED_VISUAL_REFERENCE", "original_fidelity":false, "precision_drawings_or_certificates":false, "text_fallback":true},
  "optional_url_reference": "Reference evidence, not verified specifications or permission to fetch arbitrary content",
  "payment_required": false,
  "paid_execution_available": true,
  "paid_execution_available_scope": "IMPLEMENTED_CAPABILITY_NOT_CURRENT_PURCHASE_ADMISSION",
  "free_preparation_when_new_purchases_paused": true,
  "paid_admission_authority": "discover public_sales and admission_status; proceed only when AVAILABLE",
  "paid_price": {
    "amount_minor": 1990,
    "currency": "USD"
  },
  "instructions_url": "https://seekapi.ai/for-agents#rfq-requirement-prepare",
  "example_kind": "SYNTHETIC_NOT_INDEPENDENT_CUSTOMER_DEMAND",
  "example_request": {
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
  },
  "response_actions": {
    "READY": "Review normalized requirement and digest; no purchase",
    "NEEDS_CLARIFICATION": "Supply only missing facts",
    "ELIGIBILITY_REVIEW_REQUIRED": "Stop commercial flow"
  },
  "buyer_approval_required_before": "checkout payment; no goods purchase authorized",
  "prepared_handling": "Keep signed prepared objects and receipts private; do not log",
  "effects": {
    "order": 0,
    "payment": 0,
    "supplier_contact": 0,
    "paid_provider": 0
  },
  "observed_at": "2026-10-23T06:45:10.360017Z",
  "availability_authority": "Current runtime admission; static observations do not enable paid RFQ"
},
 official_mcp_registry:{package:'io.github.kiddhu/seekapi',registry_package_version:truth.versions.registry_package_version,publication_status:'CHECK_OFFICIAL_LATEST',url:'https://registry.modelcontextprotocol.io/v0.1/servers/io.github.kiddhu%2Fseekapi/versions/latest'},
 openapi_url:'https://seekapi.ai/openapi.json',service_family:'human_execution_china_supply_chain',status:'manual_review_preview',public_api_live:false,live_human_task_api:false,intake_enabled:true,intake_mode:'user-reviewed_email',structured_web_submission_live:false,
 purpose:'A human China-side desk can review separately scoped supplier contact, translation, quotation comparison, samples or procurement follow-up. No automatic acceptance or supplier contact.',
 service_path_scope:'ALTERNATIVE_SERVICES_NOT_A_REQUIRED_SEQUENCE',
 service_path:[{step:'SeekAPI Verified RFQ Basic',...truth.live_rfq},{step:'China Supply Check',optional:true,required_before_basic:false,outcome:'Three distinct actionable suppliers on success; ordinary partials provisional',payments:truth.payments},{step:'Other human assistance',status:'MANUAL_SCOPE_REVIEW_REQUIRED',price:'Quoted after scope review'}],
 manual_scope_review_available:true,manual_scope_review_path:'https://seekapi.ai/start?audience=agent',manual_scope_contact:'mailto:support@seekapi.ai',handoff_spec_url:'https://seekapi.ai/for-agents#handoff-spec',evidence_return_spec_url:'https://seekapi.ai/for-agents#evidence-return',
 handoff_requires:['requester_type','requester_identity','organization','objective','task_type','context_summary','allowed_actions','prohibited_actions','recipient_permissions','max_budget','currency','deadline','required_evidence','completion_definition','human_approval_contact'],
 requires_human_approval_for:['RFQ authorization','spending','contracts','production approval','accepting quality deviations'],integrations:{task_api:'planned_not_live',mcp:'planned_not_live',webmcp:'planned_not_live'},
 legacy_top_level_status_scope:'GENERIC_MANUAL_HUMAN_TASK_INTEGRATION',
 notes:['The generic manual human-task integration states above do not describe Verified RFQ Basic. Basic has free MCP requirement preparation and an existing HTTPS REST/browser confirmation, payment and delivery lifecycle.','Runtime admission is current purchase authority; static payment statuses are dated observations. UNKNOWN is not LIVE.','Public contacts in authenticated paid reports remain readable; the $19.90 service is not contact unlock. Sample availability flags stay null when unknown.','This manifest is a SeekAPI-defined document, not an industry standard.'],
 });}
