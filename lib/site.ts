import type { Metadata } from 'next';
import { commercialLocales, localeInfo, localizedPublicRoutes, pagePath, type CommercialLocale, type CommercialPage } from './localized-content';
export const siteUrl = 'https://seekapi.ai';
export const isPublicProduction = process.env.NEXT_PUBLIC_PUBLIC_INDEXING === '1' && process.env.VERCEL_ENV === 'production';
export const englishRoutes = ['', '/apis', '/china-supply-chain', '/china-supply-check', '/china-supply-check/sample', '/china-supply-check/listing-price-vs-quote', '/china-supply-check/moq-specification-screening', '/china-supply-check/live-rfq-compare', '/china-supply-check/alternatives', '/china-supply-check/fasteners', '/china-supply-check/packaging', '/china-supply-check/connectors', '/discovery-status', '/china-desk', '/china-compliance-logistics', '/for-agents', '/how-it-works', '/proof', '/trust', '/support', '/privacy', '/terms', '/start'];
export const publicRoutes = [...englishRoutes, ...localizedPublicRoutes];
const commercialEnglish:Record<string,CommercialPage>={'/':'home','/china-supply-chain':'china-supply-chain','/china-compliance-logistics':'china-compliance-logistics','/how-it-works':'how-it-works','/trust':'trust','/start':'start'};
export function languageAlternates(page:CommercialPage){const en=pagePath('en',page);const languages:Record<string,string>=(page==='home'||page==='how-it-works')?{'x-default':pagePath('ja',page)}:{en,'x-default':en};for(const locale of commercialLocales)languages[localeInfo[locale].htmlLang]=pagePath(locale,page);if(page==='china-supply-chain')languages.ru='/ru/china-sourcing';if(page==='china-compliance-logistics')languages.ru='/ru/compliance-logistics';if(page==='start')languages.ru='/ru/start';return languages;}
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical=path||'/'; const page=commercialEnglish[canonical];
  return { title: title.replace(/\s*\|\s*SeekAPI$/, ''), description, alternates: { canonical, languages:page && page!=='home' && page!=='how-it-works'?languageAlternates(page):{en:canonical,'x-default':canonical} }, openGraph: { title, description, url: `${siteUrl}${path}`, siteName: 'SeekAPI', type: 'website', locale:'en_US' } };
}
export function localizedMetadata(title:string,description:string,path:string,locale:CommercialLocale,page:CommercialPage):Metadata{return{title,description,alternates:{canonical:path,languages:languageAlternates(page)},openGraph:{title,description,url:`${siteUrl}${path}`,siteName:'SeekAPI',type:'website',locale:localeInfo[locale].ogLocale}};}
