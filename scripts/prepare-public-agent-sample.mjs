import {readFile,writeFile,mkdir} from 'node:fs/promises';import {resolve} from 'node:path';
import SampleModule from '../lib/public-agent-sample.ts';
const args=process.argv.slice(2);if(args.length!==2||args[0]!=='--bundle')throw Error('Use --bundle with the exact cleared publication directory');
const base=resolve(args[1]),read=async f=>readFile(resolve(base,f),'utf8');
const prepared={publication_status:'PREPARED_NOT_PUBLISHED',sample_json:await read('sample.json'),sample_html:await read('sample.html'),manifest:JSON.parse(await read('publication-manifest.json')),discovery_pointer:JSON.parse(await read('mcp-discovery-pointer.json')),llms_fragment:await read('llms-fragment.txt'),assets:[]};
SampleModule.readPublicSamplePublication(prepared);
if(JSON.parse(await read('mcp-resource.json')).contents?.[0]?.text!==prepared.sample_json||await read('human-sample-model.json')!==prepared.sample_json)throw Error('PUBLIC_SAMPLE_SAME_SOURCE_MISMATCH');
await mkdir('data',{recursive:true});await writeFile('data/public-agent-sample-publication.json',JSON.stringify(prepared,null,2)+'\n');
console.log('Exact cleared public bytes prepared; no sourcing, payment, publication or private image access.');
