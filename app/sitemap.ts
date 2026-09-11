import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap{const base='https://seekapi.ai';return ['','/apis','/china-supply-chain','/china-desk','/for-agents','/how-it-works','/proof','/trust','/start'].map((path)=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:path===''?'weekly':'monthly',priority:path===''?1:0.8}));}
