import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ProductPage from '../app/(english)/china-supply-check/page.tsx';
import AgentPage from '../app/(english)/for-agents/page.tsx';
import RouteModule from '../app/(english)/for-agents/agent-services.json/route.ts';
const {GET}=RouteModule;
const entry='https://api.seekapi.ai/checkout/stripe/image';
test('human and Agent product pages expose a simple image entry without structured-attribute friction',()=>{
 for(const PageModule of [ProductPage,AgentPage]){
  const Page=PageModule.default??PageModule;
  const html=renderToStaticMarkup(React.createElement(React.Fragment,null,Page().props.children));
  assert.doesNotMatch(html,/public image purchase is OFF/i);
  const start=html.indexOf('id="image-supply-check"');assert(start>=0);
  const section=html.slice(html.lastIndexOf('<section',start),html.indexOf('</section>',start));
  assert.ok(section.includes('href="'+entry+'"'));
  const text=section.replace(/<[^>]*>/g,' ');
  for(const required of [/product photo/i,/optional notes/i,/free/i,/confirm/i,/\$2\.99/,/three actionable/,/English report/,/Agent JSON/,/main product/i,/accessories/i,/not.*quotations/i,/do not pay again/i])assert.match(text,required);
  assert.doesNotMatch(text,/Attribute 1|Required value 1|upload (?:it |the image )?again/i);
 }
});
test('machine image entrance points to each rail actual availability without widening the legacy text card',async()=>{
 const manifest=await (await GET()).json();
 assert.equal(manifest.product_data_mcp.payments.image_first.stripe.status,'LIVE');
 assert.equal(manifest.product_data_mcp.payments.text_model_legacy.stripe.status,'OFF');
 assert.equal(manifest.product_data_mcp.image_input.card_entry,entry);
 assert.equal(manifest.product_data_mcp.image_input.stripe_status,'LIVE');
 assert.equal(manifest.product_data_mcp.image_input.x402_status,'OFF');
 assert.equal('completed_candidate_count'in manifest.product_data_mcp.image_input,false);
 assert.doesNotMatch(manifest.notes.join(' '),/public image purchase is OFF/i);
});
