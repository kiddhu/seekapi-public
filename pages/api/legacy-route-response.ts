import type { NextApiRequest, NextApiResponse } from 'next';
import { legacyResponse, retiredPaths } from '../../lib/legacy-route-recovery.mjs';
import { trustedOriginalTarget } from '../../lib/legacy-raw-target.mjs';
const exactPaths = new Set([...retiredPaths, '/favicon.ico']);
export const config = { api: { bodyParser: false } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Preserve Next's existing bodyless OPTIONS rejection for these absent pages.
  if (req.method === 'OPTIONS') return res.status(400).end();
  const target = trustedOriginalTarget(req);
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
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('CDN-Cache-Control', 'no-store');
  return res.end(req.method === 'HEAD' ? undefined : Buffer.from(await result.arrayBuffer()));
}
