// Candidate only: promote through the sole website writer after fresh review.
export const retiredPaths = Object.freeze([
  '/docs/introduction', '/blog', '/status', '/refund', '/legal',
  '/blog/deepseek-v3-latency-and-batching', '/blog/seekapi-openai-sdk-migration',
  '/integrations/vercel-ai', '/integrations/pydantic-ai', '/integrations/litellm',
  '/integrations/haystack', '/integrations/langchain', '/integrations/autogpt',
  '/docs/api-status-codes', '/docs/endpoints', '/docs/reliability-playbook',
  '/docs/authentication', '/docs/token-saving-strategy',
  '/docs/pricing-calculator-logic', '/docs/latency-benchmarks',
]);
const retired = new Set(retiredPaths);
// Code-native vector mark; no retired gateway/product claims or external fetch.
const icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#020617"/><path fill="#fff" d="M45 17H26c-8 0-12 5-12 11 0 7 5 10 12 11l10 1c3 0 4 1 4 3s-1 3-4 3H16v7h21c8 0 12-4 12-11 0-6-4-10-12-11l-10-1c-3 0-4-1-4-3s1-3 4-3h18z"/></svg>';
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Retired SeekAPI model-gateway page</title></head><body><main><h1>This model-gateway page has been retired.</h1><p>This historical page described SeekAPI’s former AI model/API gateway. It has no equivalent in the current China procurement service.</p><p>Existing purchases retain the terms accepted at purchase. For help with an earlier purchase, contact <a href="mailto:support@seekapi.ai">support@seekapi.ai</a>. Do not send passwords or payment secrets.</p><p><a href="/about">About the current SeekAPI service</a> · <a href="/support">Support</a></p></main></body></html>';
const plain = '# Retired SeekAPI model-gateway page\n\nThis historical page described the former AI model/API gateway. It has no equivalent in the current China procurement service.\n\nExisting purchases retain the terms accepted at purchase. Earlier purchase help: support@seekapi.ai. Do not send passwords or payment secrets.\n\nCurrent service: https://seekapi.ai/about\nSupport: https://seekapi.ai/support\n';

/** Return null for every request outside the exact owned public read scope. */
export function legacyResponse(request) {
  const url = new URL(request.url);
  // Next's internal URL can name the local origin; Host is the request authority.
  const host = request.headers.get('host') || url.host;
  if (host !== 'seekapi.ai' || !['GET', 'HEAD'].includes(request.method)
      || url.search !== '' || request.url.includes('#')) return null;
  const pathname = url.pathname;
  const favicon = pathname === '/favicon.ico';
  if (!favicon && !retired.has(pathname)) return null;
  // No decoding, slash normalization, UA check, query forwarding, or redirect.
  const markdown = (request.headers.get('accept') || '').split(',').some(v => /^text\/markdown(?:\s*;|$)/i.test(v.trim()) && !/;\s*q=0(?:\.0*)?(?:;|$)/i.test(v));
  const content = favicon ? icon : markdown ? plain : html;
  const headers = {
    'Content-Type': favicon ? 'image/svg+xml; charset=utf-8' : markdown ? 'text/markdown; charset=utf-8' : 'text/html; charset=utf-8',
    'Cache-Control': favicon ? 'public, max-age=3600' : 'public, max-age=300',
    'X-Content-Type-Options': 'nosniff',
    ...(favicon ? {} : {'X-Robots-Tag': 'noindex, follow', 'Vary': 'Accept'}),
  };
  return new Response(request.method === 'HEAD' ? null : content, {status: favicon ? 200 : 410, headers});
}
