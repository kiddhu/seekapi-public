import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

export const selectionContracts = {
  qualification_contract:'QUALIFIED_RFQ_CANDIDATE_V1',
  ranking_contract:'SEEKAPI_BALANCED_SUPPLIER_RANKING_V1',
  selection_trace_contract:'CSC_SELECTION_TRACE_V1',
} as const;
const pointer={human_url:'https://seekapi.ai/china-supply-check/sample',agent_json_url:'https://seekapi.ai/china-supply-check/sample.json',mcp_resource_uri:'seekapi://china-supply-check/sample/current'};
type RecordValue=Record<string,unknown>;
const object=(value:unknown):RecordValue=>{if(!value||typeof value!=='object'||Array.isArray(value))throw Error('PUBLIC_SAMPLE_BUNDLE_INVALID');return value as RecordValue;};
const sha256=(value:string)=>createHash('sha256').update(value).digest('hex');
const parseJson=(value:string):unknown=>{try{return JSON.parse(value)}catch{throw Error('PUBLIC_SAMPLE_JSON_INVALID')}};
const privateKeys=new Set(['wallet_address','order_id','intent_id','payment_signature','request_digest','source_digest','raw_response','access_token','authorization','cookie','customer_email','buyer_image','buyer_reference_image','source_intent','source_url','shop_url','transaction_url','seller_id','member_id','subject_id','offer_id']);
function privacyBoundary(value:unknown):void{
 if(typeof value==='string'){for(const match of value.matchAll(/https?:\/\/[^\s<>"']+/gi)){let host;try{host=new URL(match[0]).hostname}catch{continue}if(['1688.com','alibaba.com','alicdn.com'].some(domain=>host===domain||host.endsWith('.'+domain)))throw Error('PUBLIC_SAMPLE_PRIVATE_SOURCE_URL');}return;}
 if(Array.isArray(value)){value.forEach(privacyBoundary);return;}
 if(value&&typeof value==='object')for(const [key,child] of Object.entries(value)){if(privateKeys.has(key.toLowerCase()))throw Error('PUBLIC_SAMPLE_PRIVATE_FIELD');privacyBoundary(child);}
}
export type PublicSampleAsset={path:string;sha256:string;mime:'image/png';width:number;height:number;content_base64:string};
export type PublicSamplePublication={sample_json:string;sample_html:string;body_html:string;discovery_pointer:RecordValue;manifest:RecordValue;llms_fragment:string;assets:PublicSampleAsset[]};
/** The producer's strict qualification/schema validator remains in governance.
 * This consumer checks prepared-artifact identity, paired bytes and publication
 * privacy only; it cannot promote a ready flag or requalify a supplier. */
export function readPublicSamplePublication(raw?:unknown):PublicSamplePublication|null{
 if(raw===undefined){const path=resolve(process.cwd(),'data/public-agent-sample-publication.json');if(!existsSync(path))return null;
  const bytes=readFileSync(path);if(bytes.length>8000000)throw Error('PUBLIC_SAMPLE_BUNDLE_TOO_LARGE');raw=parseJson(bytes.toString('utf8'));}
 const bundle=object(raw),manifest=object(bundle.manifest);
 if(bundle.fixture_kind!==undefined||bundle.evidence_scope!==undefined)throw Error('PUBLIC_SAMPLE_TEST_FIXTURE_NOT_PUBLISHABLE');
 if(bundle.publication_status!=='PREPARED_NOT_PUBLISHED'||manifest.publication_readiness!=='VALIDATED_READY_FOR_RELEASE'||manifest.validated_by!=='CSC_STRICT_PUBLIC_SAMPLE_V2')throw Error('PUBLIC_SAMPLE_NOT_VALIDATED');
 if(typeof bundle.sample_json!=='string'||typeof bundle.sample_html!=='string'||typeof bundle.llms_fragment!=='string')throw Error('PUBLIC_SAMPLE_BUNDLE_INVALID');
 if(manifest.sample_sha256!==sha256(bundle.sample_json)||manifest.sample_html_sha256!==sha256(bundle.sample_html))throw Error('PUBLIC_SAMPLE_DIGEST_MISMATCH');
 const sample=object(parseJson(bundle.sample_json)),discovery=object(bundle.discovery_pointer);
 if(sample.schema_version!=='csc.public-agent-sample.v2'||manifest.schema_version!==sample.schema_version||sample.customer_testimonial!==false||sample.independent_external_customer_use!==false||sample.source_observations_are_historical!==true)throw Error('PUBLIC_SAMPLE_IDENTITY_INVALID');
 for(const [key,value] of Object.entries(selectionContracts))if(manifest[key]!==value)throw Error('PUBLIC_SAMPLE_VERSION_MISMATCH');
 for(const [key,value] of Object.entries(pointer))if(discovery[key]!==value)throw Error('PUBLIC_SAMPLE_POINTER_MISMATCH');
 privacyBoundary(bundle);privacyBoundary(sample);
 if(!Array.isArray(bundle.assets)||!bundle.assets.length||bundle.assets.length>3)throw Error('PUBLIC_SAMPLE_SOURCE_IMAGE_REQUIRED');
 const assets=bundle.assets.map(rawAsset=>{const asset=object(rawAsset);
  if(typeof asset.sha256!=='string'||!/^[a-f0-9]{64}$/.test(asset.sha256)||asset.path!==`/china-supply-check/sample-assets/${asset.sha256}.png`||asset.mime!=='image/png'||typeof asset.content_base64!=='string'||asset.content_base64.length>3000000)throw Error('PUBLIC_SAMPLE_ASSET_INVALID');
  const bytes=Buffer.from(asset.content_base64,'base64');
  if(bytes.toString('base64')!==asset.content_base64||createHash('sha256').update(bytes).digest('hex')!==asset.sha256||bytes.length<24||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||bytes.subarray(12,16).toString('ascii')!=='IHDR'||asset.width!==bytes.readUInt32BE(16)||asset.height!==bytes.readUInt32BE(20)||!Number.isSafeInteger(asset.width)||!Number.isSafeInteger(asset.height)||Number(asset.width)<1||Number(asset.height)<1||Number(asset.width)>4096||Number(asset.height)>4096)throw Error('PUBLIC_SAMPLE_ASSET_INVALID');
  return asset as PublicSampleAsset;
 });
 if(JSON.stringify(manifest.asset_sha256)!==JSON.stringify(assets.map(a=>a.sha256))||new Set(assets.map(a=>a.path)).size!==assets.length||!Array.isArray(sample.supplier_candidates))throw Error('PUBLIC_SAMPLE_ASSET_BINDING_INVALID');
 const used=new Set<string>();
 for(const candidate of sample.supplier_candidates){const image=object(object(candidate).main_product_image),asset=assets.find(a=>image.image_url==='https://seekapi.ai'+a.path&&image.sha256===a.sha256&&image.width===a.width&&image.height===a.height&&image.mime===a.mime);if(!asset)throw Error('PUBLIC_SAMPLE_ASSET_BINDING_INVALID');used.add(asset.path);}
 if(used.size!==assets.length)throw Error('PUBLIC_SAMPLE_ASSET_BINDING_INVALID');
 const match=bundle.sample_html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
 if(!match||/<(?:script|iframe|object|embed|base|form)\b|\bon[a-z]+\s*=|(?:href|src)\s*=\s*["']\s*(?:javascript|data|vbscript):/i.test(bundle.sample_html))throw Error('PUBLIC_SAMPLE_ACTIVE_CONTENT');
 return{sample_json:bundle.sample_json,sample_html:bundle.sample_html,body_html:match[1],discovery_pointer:discovery,manifest,llms_fragment:bundle.llms_fragment,assets};
}
export function publicSampleMetadata(publication:PublicSamplePublication|null){
 return publication?{...publication.manifest,publication_status:'PREPARED_NOT_PUBLISHED',public_agent_sample:publication.discovery_pointer}:
  {...selectionContracts,publication_readiness:'PENDING_SOURCE',publication_status:'PREPARED_NOT_DEPLOYED'};
}

export function publicSampleJsonResponse(publication:PublicSamplePublication|null):Response{
 if(!publication)return Response.json({code:'PUBLIC_SAMPLE_NOT_READY',message:'A qualified public example is not available yet. Read the current source observations and evidence limits.',human_url:'https://seekapi.ai/china-supply-check/sample'},{status:404,headers:{'Cache-Control':'no-store'}});
 return new Response(publication.sample_json,{headers:{'Content-Type':'application/json; charset=utf-8','ETag':'"'+publication.manifest.sample_sha256+'"','X-Content-Type-Options':'nosniff'}});
}
