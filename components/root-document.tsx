import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import '@/app/enhancements.css';
import '@/app/growth.css';
import { localeInfo, type SiteLocale } from '@/lib/localized-content';
import { isPublicProduction, siteUrl } from '@/lib/site';
import {ReferralMeasurement} from '@/components/referral-measurement';
import {rfqSalesSummary} from '@/lib/rfq-basic-copy';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SeekAPI — China supplier quotes for $19.90',
    template: '%s | SeekAPI',
  },
  description: rfqSalesSummary,
  openGraph: {
    title: 'SeekAPI — China supplier quotes for $19.90',
    description: rfqSalesSummary,
    url: 'https://seekapi.ai',
    siteName: 'SeekAPI',
    type: 'website',
  },
  alternates: { canonical: '/' },
  robots: isPublicProduction ? { index: true, follow: true } : { index: false, follow: false, noarchive: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, colorScheme: 'light' };

export function RootDocument({ children, locale }: Readonly<{ children: React.ReactNode; locale: SiteLocale }>) {
  const info = localeInfo[locale];
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'SeekAPI', legalName: 'SeekAPI Technology Limited', url: siteUrl, knowsAbout: ['China supplier sourcing', 'China supplier screening', 'China procurement execution', 'supplier RFQ', 'sample coordination', 'MCP', 'x402'], subjectOf: [{ '@type': 'WebPage', url: `${siteUrl}/china-supply-check/live-rfq-compare` }, { '@type': 'WebPage', url: `${siteUrl}/sourcing` }, { '@type': 'WebPage', url: `${siteUrl}/china-supply-check/sample` }], email: 'support@seekapi.ai', address: { '@type': 'PostalAddress', streetAddress: 'Room P11, Flat 2C, 2/F, Hung To Ctr., 94-96 How Ming St.', addressLocality: 'Kwun Tong', addressRegion: 'Kowloon', addressCountry: 'HK' }, description: rfqSalesSummary },
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'SeekAPI', url: siteUrl, publisher: { '@id': `${siteUrl}/#organization` }, inLanguage: ['en','ja','es','ar','de','pt-BR','ru'] },
    ],
  };
  return <html lang={info.htmlLang} dir={info.dir}><head><link rel="ard" href="/.well-known/ard.json" type="application/json" /></head><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />{children}<ReferralMeasurement enabled={isPublicProduction} /></body></html>;
}
