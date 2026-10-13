import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import SampleModule from '../lib/public-agent-sample.ts';
const {readPublicSamplePublication}=SampleModule;
const args=process.argv.slice(2);
const argument=name=>{const i=args.indexOf(name);if(i<0||!args[i+1])throw Error('Required '+name);return resolve(args[i+1]);};
// The coordinator supplies the exact-reviewed existing governance validator.
// No runtime input, networking, sourcing, payment or fallback validator exists.
const source=argument('--source'),validator=argument('--validator');
const producer=await import(pathToFileURL(validator).href);
const input=JSON.parse(await readFile(source,'utf8'));
if(input.fixture_kind!==undefined||input.evidence_scope!==undefined)throw Error('SYNTHETIC_FIXTURE_NOT_FOR_RELEASE');
const sample=producer.parsePublicAgentSample(typeof input.sample_json==='string'?JSON.parse(input.sample_json):input);
const assetIndex=args.indexOf('--assets');
const assets=input.assets??(assetIndex>=0?JSON.parse(await readFile(resolve(args[assetIndex+1]),'utf8')).assets:undefined);
const bundle=await producer.preparePublicSamplePublication(sample,assets);
readPublicSamplePublication(bundle);
await mkdir('data',{recursive:true});
await writeFile('data/public-agent-sample-publication.json',JSON.stringify(bundle,null,2)+'\n');
console.log('Validated paired public sample artifacts prepared; no publication performed.');
