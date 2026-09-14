'use client';
import { useEffect } from 'react';
import { localeInfo, type SiteLocale } from '@/lib/localized-content';
export function DocumentLanguage({locale}:{locale:SiteLocale}){useEffect(()=>{document.documentElement.lang=localeInfo[locale].htmlLang;document.documentElement.dir=localeInfo[locale].dir;},[locale]);return null;}
