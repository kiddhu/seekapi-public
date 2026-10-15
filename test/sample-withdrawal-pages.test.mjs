import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {renderToStaticMarkup} from 'react-dom/server';
import Agents from '../app/(english)/for-agents/page.tsx';
import Apis from '../app/(english)/apis/page.tsx';
import Discovery from '../app/(english)/discovery-status/page.tsx';
import Proof from '../app/(english)/proof/page.tsx';
import Product from '../app/(english)/china-supply-check/page.tsx';
const pages={Agents,Apis,Discovery,Proof,Product};
function render(module){const page=(typeof module==='function'?module:module.default)();return renderToStaticMarkup(page.props.children);}
test('artifact withdrawal removes rendered sample download/resource advertisements and explains unavailability',()=>{
 const old=process.cwd(),empty=mkdtempSync(join(tmpdir(),'ws4-withdrawn-pages-'));
 try{process.chdir(empty);
  for(const[name,page]of Object.entries(pages)){
   const html=render(page);
   assert.doesNotMatch(html,/href="[^"]*\/sample\.json|seekapi:\/\/china-supply-check\/sample\/current/,name);
   assert.match(html,/public example is currently unavailable/i,name);
   assert.doesNotMatch(html,/The current public example is a HISTORICAL_RECONSTRUCTION/,name);
  }
 }finally{process.chdir(old);rmSync(empty,{recursive:true,force:true});}
});
test('validated artifact retains the working sample links and three-candidate evidence',()=>{
 for(const[name,page]of Object.entries(pages)){
  const html=render(page);assert.match(html,/href="\/china-supply-check\/sample"/,name);
  if(['Agents','Apis','Discovery','Proof'].includes(name))assert.match(html,/href="\/china-supply-check\/sample\.json"/,name);
  if(['Agents','Discovery'].includes(name))assert.match(html,/seekapi:\/\/china-supply-check\/sample\/current/,name);
  assert.doesNotMatch(html,/public example is currently unavailable/i,name);
 }
});
