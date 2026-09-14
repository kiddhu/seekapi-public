import type { Metadata } from 'next';
export const siteUrl = 'https://seekapi.ai';
export const isPublicProduction = process.env.NEXT_PUBLIC_PUBLIC_INDEXING === '1' && process.env.VERCEL_ENV === 'production';
export const englishRoutes = ['', '/apis', '/china-supply-chain', '/china-desk', '/china-compliance-logistics', '/for-agents', '/how-it-works', '/proof', '/trust', '/start'];
export const publicRoutes = [...englishRoutes, ...englishRoutes.map(path=>`/zh${path}`)];
export function pageMetadata(title: string, description: string, path: string, locale: 'en'|'zh'='en'): Metadata {
  const basePath=path.replace(/^\/zh/,'');
  const enPath=basePath||'/';
  const zhPath=`/zh${basePath}`;
  return { title, description, alternates: { canonical: path || '/', languages:{en:enPath,'zh-Hans':zhPath,'x-default':enPath} }, openGraph: { title, description, url: `${siteUrl}${path}`, siteName: 'SeekAPI', type: 'website', locale:locale==='zh'?'zh_CN':'en_US' } };
}
