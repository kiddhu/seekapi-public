import {readPublicSamplePublication,selectionContracts} from '@/lib/public-agent-sample';
import {cscCommercialTruth as truth} from '@/lib/csc-commercial-truth';
import {rfqServiceDiscovery,rfqMcpPreparation} from '@/lib/rfq-basic-copy';
export const dynamic='force-static';
export async function GET(){const publication=readPublicSamplePublication();return Response.json({
 openapi:'3.1.0',info:{title:'SeekAPI public evidence reads',version:'2.0.0',description:'Get current Chinese supplier quotes with standalone USD19.90 Verified RFQ Basic: supplier contact, translation, follow-up and comparison. Prepare free through MCP, then review and pay in the existing buyer form. The dedicated Basic HTTPS REST/OpenAPI remains available for direct integrations. This document describes public read endpoints; the Basic contract describes its transaction workflow. Optional USD2.99 supplier screening uses the existing MCP/image Stripe contract.'},servers:[{url:'https://seekapi.ai'}],
 'x-customer-value':truth.customer_value,
 'x-service-discovery':rfqServiceDiscovery,
 'x-rfq-free-preparation-mcp':rfqMcpPreparation,
 'x-selection-contract':truth.selection,'x-payments':truth.payments,'x-availability-observed-at':truth.availability_observed_at,
 paths:{...(publication?{'/china-supply-check/sample.json':{get:{operationId:'readPublicSupplierExample',summary:'Read the exact historical product-first supplier example',description:'Three DIRECT_MATCH candidates, scores0 and tiersF0; unknown facts stay unknown. Current reconstruction is not the original historical ranking.',responses:{'200':{description:'Pinned same-source public JSON; MCP resource has identical bytes',headers:{ETag:{schema:{type:'string'}}},content:{'application/json':{schema:{type:'object',properties:{schema_version:{const:selectionContracts.schema_version}},required:['schema_version','supplier_candidates','candidate_scorecards','selection_funnel'],additionalProperties:true}}}},'404':{description:'No validated public example available'}}}}}:{}),
 '/.well-known/csc-commercial-truth.json':{get:{operationId:'readCurrentPublicContract',responses:{'200':{description:'Product-first selection facts and dated mode-specific payment observation; use runtime admission before purchase'}}}},
 '/for-agents/agent-services.json':{get:{operationId:'readAgentManifest',responses:{'200':{description:'Product-data MCP and separately scoped human-task status'}}}}},
 ...(publication?{'x-public-agent-sample':publication.discovery_pointer}:{}),
 });}
