import revision from '@/data/public-page-revision.json';
import type { MetadataRoute } from 'next';
import { isPublicProduction, publicRoutes, siteUrl } from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{if(!isPublicProduction)return [];const intake=new Set(['/start','/ja/start','/es/start','/ar/start','/de/start','/pt-br/start','/ru/start']);return publicRoutes.filter(path=>!intake.has(path) && !path.includes('/archived-')).map((path)=>({url:`${siteUrl}${path}`,...(revision.routes.includes(path||'/')?{lastModified:revision.page_revised_at}:{}),changeFrequency:path===''?'weekly':'monthly',priority:path===''?1:0.8}));}
