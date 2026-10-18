import type { NextApiRequest, NextApiResponse } from 'next';
import { legacyResponse, retiredPaths } from '../../lib/legacy-route-recovery.mjs';
import { trustedOriginalTarget } from '../../lib/legacy-raw-target.mjs';
const exactPaths = new Set([...retiredPaths, '/favicon.ico']);
export const config = { api: { bodyParser: false } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('CDN-Cache-Control', 'no-store');
  // Preserve Next's existing bodyless OPTIONS rejection for these absent pages.
  if (req.method === 'OPTIONS') return res.status(400).end();
  const target = trustedOriginalTarget(req);
  // Temporary release diagnostic: fixed enums only, never URL/header values.
  if (req.method === 'GET') {
    const meta = (req as unknown as Record<symbol, { initURL?: unknown } | undefined>)[Symbol.for('NextInternalRequestMeta')];
    const original = (req as NextApiRequest & { originalUrl?: unknown }).originalUrl;
    const shape = (value: unknown) => typeof value !== 'string' ? 'absent'
      : /(?:\/|^)(?:\.|%2e){1,2}(?:\/|$|\?)/i.test(value) ? 'dot'
      : value.startsWith('/') ? 'origin' : /^https?:\/\//.test(value) ? 'absolute' : 'other';
    const routeClass = (value: unknown) => {
      if (typeof value !== 'string') return 'absent';
      const lexical = /^https?:\/\/[^/?#\s]+(\/[^#\r\n]*)$/.exec(value)?.[1] || value;
      const [pathname, ...query] = lexical.split('?');
      return exactPaths.has(pathname) ? query.join('?') ? 'owned-query' : 'owned'
        : pathname === '/api/legacy-route-response' ? 'handler' : 'other';
    };
    res.setHeader('X-SeekAPI-Legacy-Route', `init=${routeClass(meta?.initURL)};node=${routeClass(req.url)};original=${routeClass(original)}`);
    res.setHeader('X-SeekAPI-Legacy-Guard', `meta=${meta ? 'present' : 'absent'};init=${shape(meta?.initURL)};node=${shape(req.url)};original=${shape(original)};host=${req.headers.host === 'seekapi.ai' ? 'canonical' : 'other'};target=${target ? 'present' : 'absent'}`);
  }
  // Empty '?' retains the already documented empty-query behavior; no decoding.
  const path = target?.endsWith('?') ? target.slice(0, -1) : target;
  const headers = new Headers();
  if (typeof req.headers.host === 'string') headers.set('host', req.headers.host);
  if (typeof req.headers.accept === 'string') headers.set('accept', req.headers.accept);
  const result = target && path && exactPaths.has(path)
    ? legacyResponse({ url: `https://seekapi.ai${target}`, method: req.method || '', headers })
    : null;
  if (!result) {
    res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-store');
    return res.end(req.method === 'HEAD' ? undefined : '<!doctype html><html lang="en"><title>Not found</title><h1>Not found</h1></html>');
  }
  res.status(result.status);
  for (const [key, value] of result.headers) res.setHeader(key, value);
  // Every request must cross the raw-target guard, including after a cache warm.
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  return res.end(req.method === 'HEAD' ? undefined : Buffer.from(await result.arrayBuffer()));
}
