import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import SampleModule from '../lib/public-agent-sample.ts';
const {readPublicSamplePublication,publicSampleMetadata,publicSampleJsonResponse}=SampleModule;
import RouteModule from '../app/(english)/china-supply-check/sample.json/route.ts';
const digest=value=>createHash('sha256').update(value).digest('hex');
test('missing approved publication serves truthful JSON 404 with no live pointer',async()=>{
 assert.equal(readPublicSamplePublication(),null);
 const response=await RouteModule.GET();assert.equal(response.status,404);
 const body=await response.json();assert.equal(body.code,'PUBLIC_SAMPLE_NOT_READY');
 const metadata=publicSampleMetadata(null);assert.equal(metadata.publication_readiness,'PENDING_SOURCE');
 assert.equal('public_agent_sample' in metadata,false);
});
test('a ready flag cannot make absent or mismatched bytes publishable',()=>{
 assert.throws(()=>readPublicSamplePublication({publication_status:'PREPARED_NOT_PUBLISHED',manifest:{publication_readiness:'VALIDATED_READY_FOR_RELEASE'}}));
 const json='{}\n',html='<main><h1>Example</h1></main>';
 assert.throws(()=>readPublicSamplePublication({sample_json:json,sample_html:html,publication_status:'PREPARED_NOT_PUBLISHED',manifest:{sample_sha256:digest(json),sample_html_sha256:digest(html),publication_readiness:'VALIDATED_READY_FOR_RELEASE'}}));
});

// Dependency data was produced by the existing strict governance validator.
// Keep its synthetic labels in the test file; never stage it as a release file.
import {readFileSync} from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ComponentModule from '../components/qualified-public-sample.tsx';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/csc-public-agent-sample-v2-SYNTHETIC-ONLY.json',import.meta.url),'utf8'));
const {fixture_kind,evidence_scope,...producerBytes}=fixture;
const prepared=()=>readPublicSamplePublication(structuredClone(producerBytes));
test('strict producer synthetic dependency fixture cannot be staged as a release artifact',()=>{
 assert.equal(fixture_kind,'SYNTHETIC_ONLY');assert.equal(evidence_scope,'DEPENDENCY_PREVIEW_NOT_PRODUCTION');
 assert.throws(()=>readPublicSamplePublication(fixture),/TEST_FIXTURE_NOT_PUBLISHABLE/);
});
test('actual native component, JSON response and discovery expose the same validated paired bytes',async()=>{
 const publication=prepared(),response=publicSampleJsonResponse(publication);
 assert.equal(response.status,200);assert.equal(await response.text(),producerBytes.sample_json);
 assert.equal(response.headers.get('etag'),'"'+fixture.manifest.sample_sha256+'"');
 const html=renderToStaticMarkup(React.createElement(ComponentModule.QualifiedPublicSample,{publication}));
 assert.match(html,/public-qualified-sample/);assert.match(html,/Three distinct qualified supplier businesses/);
 assert.match(html,/<textarea[^>]*id="rfq-draft"/);assert.match(html,/Original selection funnel: not recorded/i);assert.match(producerBytes.sample_json,/NOT_RECORDED/);assert.match(html,/HISTORICAL_RECONSTRUCTION|historical reconstruction/i);
 assert.equal((html.match(/<article\b/g)||[]).length,3);assert.equal((html.match(/<img\b/g)||[]).length,3);
 assert.match(html,/planned|unavailable|not currently available/i);assert.doesNotMatch(html,/<form|<script/);
 const metadata=publicSampleMetadata(publication);assert.deepEqual(metadata.public_agent_sample,producerBytes.discovery_pointer);
 assert.equal(metadata.sample_sha256,fixture.manifest.sample_sha256);
 assert.doesNotMatch(response.headers.get('etag')??'',/1688|alicdn/);
 assert.doesNotMatch(producerBytes.sample_json+html,/https?:\/\/[^\s"<>]*(?:1688|alicdn)\.com|member_id|source_url/);
});
test('altered source bytes, version drift, private payload and active markup fail publication',()=>{
 const cases=[
  [bundle=>bundle.sample_json+=' ',/DIGEST_MISMATCH/],
  [bundle=>bundle.manifest.ranking_contract='old',/VERSION_MISMATCH/],
  [bundle=>{const sample=JSON.parse(bundle.sample_json);sample.schema_version='csc.public-agent-sample.v1';bundle.sample_json=JSON.stringify(sample);bundle.manifest.sample_sha256=digest(bundle.sample_json);bundle.manifest.schema_version=sample.schema_version},/IDENTITY_INVALID/],
  [bundle=>bundle.assets[0].content_base64+='AA==',/ASSET_INVALID/],
  [bundle=>bundle.assets[0].path='/other/'+bundle.assets[0].sha256+'.png',/ASSET_INVALID/],
  [bundle=>{const sample=JSON.parse(bundle.sample_json);sample.order_id='synthetic-private';bundle.sample_json=JSON.stringify(sample);bundle.manifest.sample_sha256=digest(bundle.sample_json)},/PRIVATE_FIELD/],
  [bundle=>{bundle.sample_html=bundle.sample_html.replace('</main>','<script>alert(1)</script></main>');bundle.manifest.sample_html_sha256=digest(bundle.sample_html)},/ACTIVE_CONTENT/],
  [bundle=>bundle.discovery_pointer.agent_json_url='https://other.example/sample.json',/POINTER_MISMATCH/],
 ];
 for(const [change,error] of cases){const bundle=structuredClone(producerBytes);change(bundle);assert.throws(()=>readPublicSamplePublication(bundle),error);}
});

import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
test('build synchronization publishes one pointer and removing artifact restores pending without stale ready claims',()=>{
 const work=mkdtempSync(join(tmpdir(),'1152-SYNTHETIC-ONLY-sync-'));
 try{
  mkdirSync(join(work,'public/.well-known'),{recursive:true});mkdirSync(join(work,'data'));
  writeFileSync(join(work,'public/.well-known/ard.json'),readFileSync(new URL('../public/.well-known/ard.json',import.meta.url)));
  writeFileSync(join(work,'public/llms.txt'),readFileSync(new URL('../public/llms.txt',import.meta.url)));
  writeFileSync(join(work,'data/public-agent-sample-publication.json'),JSON.stringify(producerBytes));
  const script=new URL('../scripts/sync-public-agent-sample.mjs',import.meta.url).pathname,loader=new URL('../node_modules/tsx/dist/loader.mjs',import.meta.url).pathname;
  const sync=()=>execFileSync(process.execPath,['--import',loader,script],{cwd:work,stdio:'pipe'});
  sync();let ard=JSON.parse(readFileSync(join(work,'public/.well-known/ard.json'))),llms=readFileSync(join(work,'public/llms.txt'),'utf8');
  assert.deepEqual(ard.entries[0].data.publicAgentSample,producerBytes.discovery_pointer);
  assert.equal(ard.entries[0].data.selectionTransparency.sample_sha256,fixture.manifest.sample_sha256);
  for(const asset of producerBytes.assets)assert.equal(digest(readFileSync(join(work,'public'+asset.path))),asset.sha256);
  assert.match(llms,/Current qualified public example/);assert.ok(llms.includes(producerBytes.discovery_pointer.agent_json_url));
  rmSync(join(work,'data/public-agent-sample-publication.json'));sync();
  ard=JSON.parse(readFileSync(join(work,'public/.well-known/ard.json')));llms=readFileSync(join(work,'public/llms.txt'),'utf8');
  assert.equal('publicAgentSample' in ard.entries[0].data,false);assert.equal(ard.entries[0].data.selectionTransparency.publication_readiness,'PENDING_SOURCE');
  assert.doesNotMatch(llms,/Current qualified public example|\/sample\.json|seekapi:\/\//);assert.match(llms,/Public paid acceptance example:/);
  assert.match(ard.entries[0].data.sampleDisclosure,/not publicly available/);
  for(const asset of producerBytes.assets)assert.throws(()=>readFileSync(join(work,'public'+asset.path)),/ENOENT/);
 }finally{rmSync(work,{recursive:true,force:true});}
});
