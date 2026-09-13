import type { MetadataRoute } from 'next';
import { isPublicProduction, publicRoutes, siteUrl } from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{if(!isPublicProduction)return [];return publicRoutes.map((path)=>({url:`${siteUrl}${path}`,changeFrequency:path===''?'weekly':'monthly',priority:path===''?1:0.8}));}
