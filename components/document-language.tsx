'use client';
import { useEffect } from 'react';
export function DocumentLanguage({locale}:{locale:'en'|'zh'}){useEffect(()=>{document.documentElement.lang=locale==='zh'?'zh-Hans':'en';},[locale]);return null;}
