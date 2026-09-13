import type { MetadataRoute } from 'next';
import { isPublicProduction } from '@/lib/site';
export default function robots():MetadataRoute.Robots{if(!isPublicProduction){return{rules:[{userAgent:'*',disallow:'/'}]};}return{rules:[{userAgent:'*',allow:'/'},{userAgent:'OAI-SearchBot',allow:'/'}],sitemap:'https://seekapi.ai/sitemap.xml'};}
