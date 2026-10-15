import {readFile,writeFile,readdir,unlink} from 'node:fs/promises';
import SampleModule from '../lib/public-agent-sample.ts';
const {readPublicSamplePublication,publicSampleMetadata}=SampleModule;
const publication=readPublicSamplePublication(),metadata=publicSampleMetadata(publication);
const ardFile='public/.well-known/ard.json',llmsFile='public/llms.txt';
const ard=JSON.parse(await readFile(ardFile,'utf8'));
let truth;try{truth=JSON.parse(await readFile('public/.well-known/csc-commercial-truth.json','utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
function withdraw(value){if(!value||typeof value!=='object')return;for(const key of Object.keys(value)){if(['public_agent_sample','publicAgentSample'].includes(key))delete value[key];else withdraw(value[key]);}}
if(truth){if(publication)truth.public_agent_sample=publication.discovery_pointer;else withdraw(truth);await writeFile('public/.well-known/csc-commercial-truth.json',JSON.stringify(truth,null,2)+'\n');}

for(const entry of ard.entries){
 if(truth)entry.data.commercialTruth=truth;
 entry.data.selectionTransparency=metadata;
 entry.data.sampleDisclosure=publication?'Historical reconstruction using product-first V2; original pool and weights NOT_RECORDED; scores RECOMPUTED; not an independent customer testimonial.':'A public candidate example is unavailable; no machine example is advertised.';
 if(publication)entry.data.publicAgentSample=publication.discovery_pointer;else delete entry.data.publicAgentSample;
}
if(!publication)withdraw(ard);
await writeFile(ardFile,JSON.stringify(ard,null,2)+'\n');
const marker='\n## Qualified public sample publication\n';
const base=(await readFile(llmsFile,'utf8')).split(marker)[0].split('\n').filter(line=>!line.includes('/sample.json')&&!line.includes('seekapi://')).join('\n').trimEnd();
const text=publication?publication.llms_fragment+'Product-first V2: comparable price 45%, scoped sales 35%, MOQ fit 10%, freshness and activity 10%. Deduplicate supplier identities, protect at most 20 within 10 points of the best product, then select F5 to F0; Q1–Q6 is auxiliary trust, not six admission gates. Scores 0 and tiers F0 in this historical example do not establish commercial inferiority. Deterministic ties do not establish superiority.':'A public candidate example is currently unavailable. No JSON or MCP sample resource is advertised.';
await writeFile(llmsFile,base+marker+text+'\n');
// Remove only old generated public sample images. Cleared V2 has no public assets.
const directory='public/china-supply-check/sample-assets';let names=[];try{names=await readdir(directory)}catch(e){if(e.code!=='ENOENT')throw e}
for(const name of names)if(/^[a-f0-9]{64}\.png$/.test(name))await unlink(directory+'/'+name);
