import {createHash} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';

// Exact public input cleared by #1152 comment6184414641. No private evidence,
// qualification or ranking is reconstructed in the website.
export const approvedSampleDigests={
 wire:'3fe772bce6a24bc4ffce3355b04eee98129e662659d9e0f4704b1d7ec700e974',
 canonical:'5d3e076a06c6b4eb5c9ce343d9a3c1fc966c30adfb4721f8f7ebb103f4514dd2',
 html:'74c746f70dcb3a7291c30f4240db6a9e7a53a01545eda1f0a3cd845de6e6fcc3',
 pointer:'e7bee01c9bb3805d1b86601daf22d1cc81df2b65fb6f7552cdbbf192b6cd68c3',
 manifest:'febb6d2b412bcbc9a0cb26908136c02ebf049a7da11dfb0d0e1609a453a5dd4d',
 llms:'7b958445c9b3d0a08aab16e616830dd4f2f9aa42bf548e71c578cdc79620d839',
} as const;
export const selectionContracts={schema_version:'csc.public-agent-sample.v3',candidate_contract:'ACTIONABLE_RFQ_CANDIDATE_V2',selection_contract:'CSC_PRODUCT_FIRST_FACTORY_TIER_SELECTION_V2',product_scoring_contract:'PRODUCT_COMMERCIAL_SCORE_V1',factory_tier_contract:'SOURCE_FACTORY_TIER_V1',trust_profile_contract:'SUPPLIER_TRUST_PROFILE_Q1_Q6_V2',selection_trace_contract:'CSC_SELECTION_TRACE_V2'} as const;
const pointer={human_url:'https://seekapi.ai/china-supply-check/sample',agent_json_url:'https://seekapi.ai/china-supply-check/sample.json',mcp_resource_uri:'seekapi://china-supply-check/sample/current'};
type RecordValue=Record<string,unknown>;
const object=(v:unknown):RecordValue=>{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('PUBLIC_SAMPLE_BUNDLE_INVALID');return v as RecordValue;};
const sha=(v:string)=>createHash('sha256').update(v).digest('hex');
function canonical(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';return JSON.stringify(value);}
const privateKeys=new Set(['selection_proofs_v2','wallet_address','order_id','intent_id','payment_signature','request_digest','source_digest','raw_response','access_token','authorization','cookie','customer_email','buyer_image','buyer_reference_image','source_intent','source_url','shop_url','transaction_url','seller_id','shop_id','member_id','subject_id','offer_id']);
function privacyBoundary(value:unknown):void{
 if(typeof value==='string'){for(const match of value.matchAll(/https?:\/\/[^\s<>"']+/gi)){let host;try{host=new URL(match[0]).hostname}catch{throw Error('PUBLIC_SAMPLE_URL_INVALID')}if(host!=='seekapi.ai')throw Error('PUBLIC_SAMPLE_PRIVATE_SOURCE_URL');}return;}
 if(Array.isArray(value)){value.forEach(privacyBoundary);return;}
 if(value&&typeof value==='object')for(const[key,child]of Object.entries(value)){if(privateKeys.has(key.toLowerCase()))throw Error('PUBLIC_SAMPLE_PRIVATE_FIELD');privacyBoundary(child);}
}
export type PublicSamplePublication={sample_json:string;sample_html:string;body_html:string;discovery_pointer:RecordValue;manifest:RecordValue;llms_fragment:string;assets:never[]};
export function readPublicSamplePublication(raw?:unknown):PublicSamplePublication|null{
 if(raw===undefined){const path=resolve(process.cwd(),'data/public-agent-sample-publication.json');if(!existsSync(path))return null;const bytes=readFileSync(path);if(bytes.length>1000000)throw Error('PUBLIC_SAMPLE_BUNDLE_TOO_LARGE');raw=JSON.parse(bytes.toString('utf8'));}
 const bundle=object(raw),manifest=object(bundle.manifest),discovery=object(bundle.discovery_pointer);
 if(bundle.fixture_kind!==undefined||bundle.evidence_scope!==undefined)throw Error('PUBLIC_SAMPLE_TEST_FIXTURE_NOT_PUBLISHABLE');
 if(bundle.publication_status!=='PREPARED_NOT_PUBLISHED'||manifest.publication_readiness!=='VALIDATED_READY_FOR_RELEASE'||manifest.validated_by!=='CSC_STRICT_PUBLIC_SAMPLE_PRODUCT_FIRST_V2')throw Error('PUBLIC_SAMPLE_NOT_VALIDATED');
 if(typeof bundle.sample_json!=='string'||typeof bundle.sample_html!=='string'||typeof bundle.llms_fragment!=='string')throw Error('PUBLIC_SAMPLE_BUNDLE_INVALID');
 if(sha(bundle.sample_json)!==approvedSampleDigests.wire||manifest.sample_sha256!==approvedSampleDigests.wire||discovery.wire_digest!==approvedSampleDigests.wire)throw Error('PUBLIC_SAMPLE_DIGEST_MISMATCH');
 const sample=object(JSON.parse(bundle.sample_json));
 if(sha(canonical(sample))!==approvedSampleDigests.canonical||manifest.canonical_digest!==approvedSampleDigests.canonical||discovery.canonical_digest!==approvedSampleDigests.canonical)throw Error('PUBLIC_SAMPLE_CANONICAL_DIGEST_MISMATCH');
 for(const[key,value]of Object.entries(selectionContracts))if(sample[key]!==value||manifest[key]!==value||discovery[key]!==value)throw Error('PUBLIC_SAMPLE_VERSION_MISMATCH');
 for(const[key,value]of Object.entries(pointer))if(discovery[key]!==value)throw Error('PUBLIC_SAMPLE_POINTER_MISMATCH');
 if(!Array.isArray(bundle.assets)||bundle.assets.length||!Array.isArray(manifest.asset_sha256)||manifest.asset_sha256.length)throw Error('PUBLIC_SAMPLE_UNREFERENCED_ASSETS');
 if(sha(bundle.sample_html)!==approvedSampleDigests.html||manifest.sample_html_sha256!==approvedSampleDigests.html)throw Error('PUBLIC_SAMPLE_HTML_DIGEST_MISMATCH');
 if(sha(JSON.stringify(discovery,null,2)+'\n')!==approvedSampleDigests.pointer||sha(JSON.stringify(manifest,null,2)+'\n')!==approvedSampleDigests.manifest||sha(bundle.llms_fragment)!==approvedSampleDigests.llms)throw Error('PUBLIC_SAMPLE_AUXILIARY_INPUT_MISMATCH');
 privacyBoundary(bundle);privacyBoundary(sample);
 const match=bundle.sample_html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
 if(!match||/<(?:script|iframe|object|embed|base|form|img)\b|\bon[a-z]+\s*=|(?:href|src)\s*=\s*["']\s*(?:javascript|data|vbscript):/i.test(bundle.sample_html))throw Error('PUBLIC_SAMPLE_ACTIVE_CONTENT');
 return{sample_json:bundle.sample_json,sample_html:bundle.sample_html,body_html:match[1],discovery_pointer:discovery,manifest,llms_fragment:bundle.llms_fragment,assets:[]};
}
export function publicSampleMetadata(publication:PublicSamplePublication|null){return {...selectionContracts,...(publication?{public_agent_sample:publication.discovery_pointer}:{})};}
export function publicSampleJsonResponse(publication:PublicSamplePublication|null):Response{
 if(!publication)return Response.json({code:'PUBLIC_SAMPLE_NOT_AVAILABLE',message:'A public example is currently unavailable. Read the product and current service availability.',human_url:pointer.human_url},{status:404,headers:{'Cache-Control':'no-store'}});
 return new Response(publication.sample_json,{headers:{'Content-Type':'application/json; charset=utf-8','ETag':'"'+approvedSampleDigests.wire+'"','X-Content-Type-Options':'nosniff'}});
}
