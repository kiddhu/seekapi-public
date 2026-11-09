import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const visible = html => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const labels={
  es:['Stripe para imágenes','x402 para imágenes','Stripe para texto/modelo','x402 para texto/modelo'],
  de:['Bild-Stripe','Bild-x402','Text/Modell-Stripe','Text/Modell-x402'],
  ja:['画像 Stripe','画像 x402','テキスト／型番 Stripe','テキスト／型番 x402'],
  ar:['Stripe للصور','x402 للصور','Stripe للنص أو الطراز','x402 للنص أو الطراز'],
  'pt-br':['Stripe para imagens','x402 para imagens','Stripe para texto/modelo','x402 para texto/modelo'],
  ru:['Stripe для изображений','x402 для изображений','Stripe для текста/модели','x402 для текста/модели'],
};

for (const locale of ['es', 'de', 'ja', 'ar', 'pt-br', 'ru']) {
  test(`${locale}: rendered payment copy names all four rails and current admission`, () => {
    const html = read(`.next/server/app/${locale}.html`);
    const text = visible(html);
    assert.ok(text.includes('OFF'), 'closed rails must be explicit in visible copy');
    assert.ok((text.match(/OFF/g) ?? []).length >= 2, 'image x402 and text/model Stripe are both closed');
    assert.match(text, /2\.99/);
    assert.match(text, /19\.90/, 'RFQ remains independently identifiable');
    // Metadata must not preserve the former image-x402 purchase claim.
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
    assert.match(description, /OFF/);
    const subpages=locale==='ru'?['china-sourcing','compliance-logistics','start']:['china-supply-chain','china-compliance-logistics','how-it-works','trust','start'];
    for(const path of [locale,...subpages.map(p=>locale+'/'+p)]){
      const page=read('.next/server/app/'+path+'.html'),body=visible(page),names=labels[locale];
      assert.ok(body.includes(names[0]+': LIVE · USD 2.99'),path);
      assert.ok(body.includes(names[1]+': OFF'),path);
      assert.ok(body.includes(names[2]+': OFF'),path);
      assert.ok(body.includes(names[3]+': LIVE · 2.99 USDC'),path);
      assert.ok(!body.includes(names[1]+': LIVE'),path);
      for(const match of page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
        const schema=JSON.parse(match[1]);
        for(const node of schema['@graph']??[schema]){
          if(node['@type']==='FAQPage'){
            const answers=node.mainEntity.map(q=>q.acceptedAnswer.text).join(' ');
            assert.ok(answers.includes(names[1]+': OFF'),path+' FAQ');
            assert.match(answers,/19\.90/);
          }
        }
      }
    }
  });
}

test('ARD identifies screening first and preserves the independent RFQ handoff', () => {
  const entry = JSON.parse(read('public/.well-known/ard.json')).entries[0];
  assert.equal(entry.identifier, 'urn:air:seekapi.ai:api:china-supply-check-v0');
  assert.equal(entry.data.productId, 'china_supply_check_v0');
  const first = entry.description.split('. ')[0];
  assert.match(first, /China Supply Check/);
  assert.match(first, /2\.99/);
  assert.doesNotMatch(first, /19\.90/);
  assert.match(entry.description, /listing|screening/i);
  assert.match(entry.description, /19\.90/);
  assert.equal(entry.data.verifiedRfqBasicPreparation.buyer_continuation, 'https://api.seekapi.ai/checkout/stripe/rfq');
});

test('the generated machine guide retains the authorized product-specific recovery methods',()=>{
  const guide=read('public/llms.txt');
  assert.match(guide,/https:\/\/seekapi.ai\/support#existing-results/);
  assert.match(guide,/rfq\?recover=1/);
  assert.match(guide,/order ID or payment proof alone is not authentication/);
  assert.ok(guide.indexOf('## Existing purchases and recovery')<guide.indexOf('## Qualified public sample publication'));
});
