import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots{const publicIndexing=process.env.NEXT_PUBLIC_PUBLIC_INDEXING==='1';if(!publicIndexing){return{rules:[{userAgent:'*',disallow:'/'}]};}return{rules:[{userAgent:'*',allow:'/'},{userAgent:'OAI-SearchBot',allow:'/'}],sitemap:'https://seekapi.ai/sitemap.xml'};}
