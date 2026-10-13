import {readFile,writeFile,mkdir,readdir,unlink} from 'node:fs/promises';
import SampleModule from '../lib/public-agent-sample.ts';
const {readPublicSamplePublication,publicSampleMetadata}=SampleModule;
const publication=readPublicSamplePublication(),metadata=publicSampleMetadata(publication);
const ardFile='public/.well-known/ard.json',llmsFile='public/llms.txt';
const ard=JSON.parse(await readFile(ardFile,'utf8'));
const legacyDisclosure='INTERNAL_ACCEPTANCE: authorized aggregate paid outcome; candidate-level production example not publicly available';
const readyDisclosure='Privacy-safe existing internal acceptance result; historical source observations and current-policy reconstruction, not an independent customer testimonial';
for(const entry of ard.entries){entry.data.selectionTransparency=metadata;entry.data.sampleDisclosure=publication?readyDisclosure:legacyDisclosure;if(publication)entry.data.publicAgentSample=publication.discovery_pointer;else delete entry.data.publicAgentSample;}
await writeFile(ardFile,JSON.stringify(ard,null,2)+'\n');
const marker='\n## Qualified public sample publication\n';
let base=(await readFile(llmsFile,'utf8')).split(marker)[0].trimEnd();
const legacyDescription='The acceptance example is INTERNAL_ACCEPTANCE, not an independent customer testimonial. It contains the authorized aggregate outcome of a completed paid check, not candidate-level production supplier rows. Historical examples are separate and archived.';
const readyDescription='The qualified public example projects an existing internal acceptance result with source-scoped qualifications and current-policy reconstruction. It is not an independent customer testimonial; original selection data and weights remain NOT_RECORDED when unavailable.';
base=base.replace(/(?:Public paid acceptance example:|Current qualified public example:)/,publication?'Current qualified public example:':'Public paid acceptance example:').replace(legacyDescription,readyDescription).replace(readyDescription,publication?readyDescription:legacyDescription);
const text=publication?`Public China Supply Check qualified example: ${publication.discovery_pointer.human_url}\nAgent JSON: ${publication.discovery_pointer.agent_json_url}\nFree MCP resource: ${publication.discovery_pointer.mcp_resource_uri}\nHistorical existing acceptance result and current-policy reconstruction; not a customer testimonial. Original selection funnel and weights: NOT_RECORDED. Sample SHA256: ${publication.manifest.sample_sha256}.`:'Qualified sample publication: PENDING_SOURCE. The selection transparency contracts are prepared, not deployed. The current sample page remains the recorded source-observation and acceptance summary; no qualified Agent JSON or MCP sample resource is claimed live.';
await writeFile(llmsFile,base+marker+text+'\n');

const assetDirectory='public/china-supply-check/sample-assets';
const currentAssets=new Set(publication?.assets.map(asset=>asset.sha256+'.png')??[]);
if(publication){await mkdir(assetDirectory,{recursive:true});for(const asset of publication.assets)await writeFile('public'+asset.path,Buffer.from(asset.content_base64,'base64'));}
let previous=[];try{previous=await readdir(assetDirectory)}catch(error){if(error.code!=='ENOENT')throw error;}
for(const name of previous)if(/^[a-f0-9]{64}\.png$/.test(name)&&!currentAssets.has(name))await unlink(assetDirectory+'/'+name);
