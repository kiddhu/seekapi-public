import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../.next/server/app/'+path+'.html',import.meta.url),'utf8');

test('the first home section offers two distinct priced services and no duplicate input',()=>{
  const html=read('index');
  const hero=html.match(/<main[^>]*>\s*(<section[\s\S]*?<\/section>)/)?.[1]??'';
  assert.match(hero,/Find Chinese suppliers/);
  const links=[...hero.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.equal(links[0]?.[1],'https://api.seekapi.ai/checkout/stripe/rfq');
  assert.match(links[0]?.[2]??'',/free/i);
  assert.equal(links[1]?.[1],'/china-supply-check');
  assert.match(links[1]?.[2]??'',/\$2\.99/);
  assert.match(hero,/19\.90/);
  assert.match(hero,/No \$2\.99 purchase required/);
  assert.doesNotMatch(hero,/<input|<textarea|<form|trade-supply/i);
});

test('main-site navigation provides existing-result recovery without a Trade destination',()=>{
  for(const route of ['index','china-supply-check','china-supply-check/live-rfq-compare','proof','trust','support','for-agents']){
    const html=read(route),header=html.match(/<header[\s\S]*?<\/header>/)?.[0]??'';
    assert.match(header,/href="\/support#existing-results"/,route);
    assert.doesNotMatch(html,/href="[^"]*trade-supply|href="https:\/\/trade\./i,route);
    assert.equal((html.match(/<h1[ >]/g)??[]).length,1,route);
  }
});
