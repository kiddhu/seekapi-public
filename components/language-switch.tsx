'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export function LanguageSwitch({locale}:{locale:'en'|'zh'}){
  const pathname=usePathname();
  const target=locale==='zh'?(pathname.replace(/^\/zh/,'')||'/'):(`/zh${pathname==='/'?'':pathname}`);
  return <Link className="language-switch" href={target} hrefLang={locale==='zh'?'en':'zh-Hans'}>{locale==='zh'?'EN':'中文'}</Link>;
}
