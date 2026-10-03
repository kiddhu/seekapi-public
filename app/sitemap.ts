import type { MetadataRoute } from 'next';
import { isPublicProduction, publicRoutes, siteUrl } from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{if(!isPublicProduction)return [];const intake=new Set(['/start','/ja/start','/es/start','/ar/start','/de/start','/pt-br/start','/ru/start']);return publicRoutes.filter(path=>!intake.has(path)).map((path)=>({url:`${siteUrl}${path}`,changeFrequency:path===''?'weekly':'monthly',priority:path===''?1:0.8}));}
