import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync} from 'node:child_process';
import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import SampleModule from '../lib/public-agent-sample.ts';
import ComponentModule from '../components/qualified-public-sample.tsx';
const {readPublicSamplePublication,publicSampleMetadata,publicSampleJsonResponse}=SampleModule;
const input=JSON.parse(readFileSync(new URL('../data/public-agent-sample-publication.json',import.meta.url),'utf8'));
const wire='3fe772bce6a24bc4ffce3355b04eee98129e662659d9e0f4704b1d7ec700e974';
const digest=x=>createHash('sha256').update(x).digest('hex');
test('cleared real product-first input renders three DIRECT_MATCH zero-score F0 candidates without private images',async()=>{
 const p=readPublicSamplePublication(structuredClone(input));const r=publicSampleJsonResponse(p);
 assert.equal(r.status,200);assert.equal(await r.text(),input.sample_json);assert.equal(digest(input.sample_json),wire);
 assert.match(r.headers.get('content-type'),/application\/json/);assert.equal(r.headers.get('etag'),'"'+wire+'"');
 const html=renderToStaticMarkup(React.createElement(ComponentModule.QualifiedPublicSample,{publication:p}));
 for(const text of ['DIRECT_MATCH','0/100','F0','Q1','Q6','NOT_RECORDED','RECOMPUTED','comparable_price','observed_sales','moq_fit','data_freshness_and_active_status','SOURCE_MARKETPLACE_MEMBER'])assert.ok(html.includes(text),text);
 assert.match(html,/not.*negative|no credit/i);assert.match(html,/not.*factory|not.*disqualif/i);assert.match(html,/deterministic/i);
 assert.match(html,/not.*commercial.*superior|does not.*superior/i);assert.match(html,/not.*contact.unlock/i);
 assert.doesNotMatch(html,/<img\b|<script\b|<form\b/);assert.equal(p.assets.length,0);
 assert.deepEqual(publicSampleMetadata(p).public_agent_sample,input.discovery_pointer);
});
test('missing input stays unavailable and cannot create a public sample pointer',async()=>{
 const r=publicSampleJsonResponse(null);assert.equal(r.status,404);const m=publicSampleMetadata(null);assert.equal('public_agent_sample'in m,false);
 assert.equal('publication_readiness'in m,false);assert.equal('publication_status'in m,false);
});
test('tampered or alternate sample bytes, old contracts, private fields/assets and unsafe HTML fail closed',()=>{
 const mutate=[b=>b.sample_json+=' ',b=>b.manifest.selection_contract='QUALIFIED_RFQ_CANDIDATE_V1',b=>b.assets=[{path:'/private.png'}],b=>b.discovery_pointer.canonical_digest='0'.repeat(64),b=>{const s=JSON.parse(b.sample_json);s.selection_proofs_v2={};b.sample_json=JSON.stringify(s);b.manifest.sample_sha256=digest(b.sample_json)},b=>{b.sample_html=b.sample_html.replace('</main>','<script>alert(1)</script></main>');b.manifest.sample_html_sha256=digest(b.sample_html)},b=>{b.sample_json=JSON.stringify(JSON.parse(b.sample_json));b.manifest.sample_sha256=digest(b.sample_json)},b=>b.fixture_kind='SYNTHETIC_ONLY'];
 for(const change of mutate){const b=structuredClone(input);change(b);assert.throws(()=>readPublicSamplePublication(b));}
});
test('public synchronization is replay-stable and removes stale sample pointers when the artifact disappears',()=>{
 const work=mkdtempSync(join(tmpdir(),'1152-real-v2-sync-'));
 try{mkdirSync(join(work,'public/.well-known'),{recursive:true});mkdirSync(join(work,'data'));
 for(const f of ['.well-known/ard.json','llms.txt'])writeFileSync(join(work,'public',f),readFileSync(new URL('../public/'+f,import.meta.url)));
 writeFileSync(join(work,'data/public-agent-sample-publication.json'),JSON.stringify(input));
 const script=new URL('../scripts/sync-public-agent-sample.mjs',import.meta.url).pathname,loader=new URL('../node_modules/tsx/dist/loader.mjs',import.meta.url).pathname;
 const run=()=>execFileSync(process.execPath,['--import',loader,script],{cwd:work,stdio:'pipe'});
 run();const first=readFileSync(join(work,'public/.well-known/ard.json'),'utf8');run();assert.equal(readFileSync(join(work,'public/.well-known/ard.json'),'utf8'),first);
 const ard=JSON.parse(first);assert.deepEqual(ard.entries[0].data.publicAgentSample,input.discovery_pointer);
 assert.match(readFileSync(join(work,'public/llms.txt'),'utf8'),/45.*35.*10.*10/);
 rmSync(join(work,'data/public-agent-sample-publication.json'));run();
 const gone=JSON.parse(readFileSync(join(work,'public/.well-known/ard.json')));assert.equal('publicAgentSample'in gone.entries[0].data,false);assert.doesNotMatch(JSON.stringify(gone),/\/sample\.json|seekapi:\/\//);
 assert.doesNotMatch(readFileSync(join(work,'public/llms.txt'),'utf8'),/\/sample\.json|seekapi:\/\//);
 }finally{rmSync(work,{recursive:true,force:true})}
});
