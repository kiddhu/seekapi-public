'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { commercialLocales, localeInfo, pagePath, type CommercialPage, type SiteLocale } from '@/lib/localized-content';
const localeOrder:SiteLocale[]=['en',...commercialLocales,'ru'];
function currentPage(pathname:string):CommercialPage{
  const part=pathname.split('/').filter(Boolean).at(-1)||'home';
  if(part==='china-supply-chain'||part==='china-compliance-logistics'||part==='how-it-works'||part==='trust'||part==='start')return part;
  if(part==='china-sourcing')return 'china-supply-chain';
  if(part==='compliance-logistics')return 'china-compliance-logistics';
  return 'home';
}
function targetPath(locale:SiteLocale,page:CommercialPage){
  if(locale==='ru'){
    if(page==='china-supply-chain')return '/ru/china-sourcing';
    if(page==='china-compliance-logistics')return '/ru/compliance-logistics';
    if(page==='start')return '/ru/start';
    return '/ru';
  }
  return pagePath(locale,page);
}
export function LanguageSwitch({locale}:{locale:SiteLocale}){
  const pathname=usePathname(); const page=currentPage(pathname);
  return <details className="language-menu"><summary aria-label="Choose language">{localeInfo[locale].label}</summary><div className="language-options">{localeOrder.map(code=><Link key={code} href={targetPath(code,page)} hrefLang={localeInfo[code].htmlLang} aria-current={code===locale?'page':undefined}>{localeInfo[code].label}</Link>)}</div></details>;
}
