// Offline fixture generation against governance edf69fc926a4207318255bec61c8ec3dac87e81e.
// SEEKAPI_CANONICAL_DIST points to its built cdp-ts-no-value-candidate/dist.
// No actual provider, Stripe, database or historical order is used.
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
const root=process.env.SEEKAPI_CANONICAL_DIST;if(!root)throw Error('Set SEEKAPI_CANONICAL_DIST');
const from=name=>import(pathToFileURL(root+'/supply-check/'+name+'.js').href);
const {confirmSourcing,requestDigest,canonical,sha256}=await from('digest');
const {normalizeInput,AGENT_PRICE_VERSION}=await from('policy');
const {freezeProductBrief,buildStandardAnswer,assertStandardAnswer}=await from('standard-answer');
const {sourceCandidates}=await from('real-provider-kernel');
const {projectPublicResultV2}=await from('public-result-projection');
const observedAt='2026-10-01T18:55:00Z',productName='304 stainless M6 flat washer',mustMatch=[{attribute:'material',expected:'304'}];
const c=confirmSourcing(normalizeInput({text:productName}),'fixture-buyer','fixture-intent','confirmed',{query:productName,quantity:500,unit:'pcs',mustMatch},()=>new Date(observedAt),undefined,AGENT_PRICE_VERSION);
const brief=freezeProductBrief(c,{productName,modelOrReference:'M6',substitutionAllowed:false});
const no=async()=>{throw Error('EXTERNAL_EFFECT_FORBIDDEN')};
async function build(count){
 const title=productName+' supports OEM';
 const observation={endpoint:'1688.item_get',evidenceDigest:'a'.repeat(64),observedAt,charge:'UNKNOWN',costCny:null};
 const port={search:async()=>({value:Array.from({length:count},(_,i)=>({offerId:String(i+1),title,price:'0.01',url:null})),observation:{...observation,endpoint:'1688.item_search'}}),
 detail:async id=>({value:{title,properties:{material:'304'},unit:'pcs',minQuantity:100,offerId:id,sellerId:'b2b-'+id,price:'0.01',url:null},observation}),seller:no,upload:no,imageSearch:no};
 const result=await sourceCandidates({...c.sourcing,requestDigest:requestDigest(c)},port,undefined,undefined,3,{productName,model:'M6',quantity:500,unit:'pcs',mustMatch});
 return JSON.parse(JSON.stringify(buildStandardAnswer(brief,result)));
}
const full=await build(3);
full.summary.buyer_questions=['Confirm the packaging for 500 pieces.'];
full.suppliers[0].supplier_assessment={policy:'csc.supplier-discovery.v1',product_fit:'EXACT_EVIDENCED',supplier_fit:'STRONG_CANDIDATE',
 product_evidence:[{attribute:'material',expected:'304',observed:'304',verdict:'MATCH',source:'DETAIL_PROPERTIES'}],
 supplier_capability_evidence:['Listing describes washer production.'],customization_evidence:['OEM described in the listing.'],uncertainties:['Lead time needs confirmation.'],
 rfq_questions:['Can you supply 500 pieces in one batch?'],why_worth_contacting:'Recorded material and minimum quantity fit the request.',
 request_sanity:{must_have:mustMatch,preferred:[],unknown:[],contradictions:[],rfq_questions:['Please confirm packaging.']}};
const shortage=await build(0);
shortage.summary.promising_count=1;
shortage.summary.buyer_questions=['Can the required material be confirmed?'];
shortage.promising_candidates=[{status:'PROMISING_NEEDS_CONFIRMATION',supplier_id:'b2b-4',offer_id:'4',product_title:'M6 washer requiring material confirmation',product_url:'https://detail.1688.com/offer/4.html',matched_facts:['M6 size observed.'],evidence_gaps:['Material grade not established.'],variant_options:['Ask for a 304 variant.'],observed_at:observedAt,evidence_digest:'b'.repeat(64),counts_as_qualified:false}];
shortage.exclusion_summary=[{reason:'MANDATORY_FACT_UNKNOWN',count:1}];
for(const [name,answer] of [['full',full],['shortage',shortage]]){
 const {answer_digest,...bare}=answer;answer.answer_digest=sha256(canonical(bare));assertStandardAnswer(answer);
 writeFileSync(new URL('./fixtures/csc-v2-'+name+'.json',import.meta.url),JSON.stringify(projectPublicResultV2(answer,requestDigest(c)),null,2)+'\n');
}
console.log('two actual public-v2 fixture projections generated; zero external effects');
