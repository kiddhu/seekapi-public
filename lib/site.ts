import type { Metadata } from 'next';
export const siteUrl = 'https://seekapi.ai';
export const isPublicProduction = process.env.NEXT_PUBLIC_PUBLIC_INDEXING === '1' && process.env.VERCEL_ENV === 'production';
export const publicRoutes = ['', '/apis', '/china-supply-chain', '/china-desk', '/for-agents', '/how-it-works', '/proof', '/trust', '/start'];
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path || '/' }, openGraph: { title, description, url: `${siteUrl}${path}`, siteName: 'SeekAPI', type: 'website' } };
}
