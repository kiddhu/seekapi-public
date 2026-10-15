import {readPublicSamplePublication,selectionContracts} from '@/lib/public-agent-sample';
import {cscCommercialTruth as truth} from '@/lib/csc-commercial-truth';
export const dynamic='force-static';
export async function GET(){const publication=readPublicSamplePublication();return Response.json({
 openapi:'3.1.0',info:{title:'SeekAPI public evidence reads',version:'2.0.0',description:'Documentation for existing public HTTP reads. Purchase uses the MCP contract; no HTTP payment or supplier-contact API is introduced.'},servers:[{url:'https://seekapi.ai'}],
 'x-selection-contract':truth.selection,'x-payments':truth.payments,'x-availability-observed-at':truth.availability_observed_at,
 paths:{...(publication?{'/china-supply-check/sample.json':{get:{operationId:'readPublicSupplierExample',summary:'Read the exact historical product-first supplier example',description:'Three DIRECT_MATCH candidates, scores0 and tiersF0; unknown facts stay unknown. Current reconstruction is not the original historical ranking.',responses:{'200':{description:'Pinned same-source public JSON; MCP resource has identical bytes',headers:{ETag:{schema:{type:'string'}}},content:{'application/json':{schema:{type:'object',properties:{schema_version:{const:selectionContracts.schema_version}},required:['schema_version','supplier_candidates','candidate_scorecards','selection_funnel'],additionalProperties:true}}}},'404':{description:'No validated public example available'}}}}}:{}),
 '/.well-known/csc-commercial-truth.json':{get:{operationId:'readCurrentPublicContract',responses:{'200':{description:'Product-first selection facts and dated mode-specific payment observation; use runtime admission before purchase'}}}},
 '/for-agents/agent-services.json':{get:{operationId:'readAgentManifest',responses:{'200':{description:'Product-data MCP and separately scoped human-task status'}}}}},
 ...(publication?{'x-public-agent-sample':publication.discovery_pointer}:{}),
 });}
