import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import '@/app/enhancements.css';
import '@/app/growth.css';
import { localeInfo, type SiteLocale } from '@/lib/localized-content';
import { isPublicProduction, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SeekAPI — China supplier sourcing and procurement for AI agents',
    template: '%s | SeekAPI',
  },
  description: 'SeekAPI helps overseas buyers and AI agents source China suppliers and coordinate China-side procurement. China Supply Check is live at 2.99 USDC via x402; separately scoped human RFQ, sample and execution work requires acceptance.',
  openGraph: {
    title: 'SeekAPI — China supplier sourcing and procurement for AI agents',
    description: 'Start with a live evidence-backed China supplier check via MCP and x402. Ask SeekAPI for separately scoped China-side RFQ, sample and procurement execution support.',
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
      { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'SeekAPI', legalName: 'SeekAPI Technology Limited', url: siteUrl, knowsAbout: ['China supplier sourcing', 'China supplier screening', 'China procurement execution', 'supplier RFQ', 'sample coordination', 'MCP', 'x402'], subjectOf: [{ '@type': 'WebPage', url: `${siteUrl}/sourcing` }, { '@type': 'WebPage', url: `${siteUrl}/china-supply-check/sample` }], email: 'support@seekapi.ai', address: { '@type': 'PostalAddress', streetAddress: 'Room P11, Flat 2C, 2/F, Hung To Ctr., 94-96 How Ming St.', addressLocality: 'Kwun Tong', addressRegion: 'Kowloon', addressCountry: 'HK' }, description: 'SeekAPI is a China-side procurement desk for overseas buyers and AI agents. Its live China Supply Check screens suppliers with evidence; separately scoped human work can cover RFQs, supplier communication, samples, procurement and export coordination after acceptance.' },
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'SeekAPI', url: siteUrl, publisher: { '@id': `${siteUrl}/#organization` }, inLanguage: ['en','ja','es','ar','de','pt-BR','ru'] },
    ],
  };
  return <html lang={info.htmlLang} dir={info.dir}><head><link rel="ard" href="/.well-known/ard.json" type="application/json" /></head><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />{children}</body></html>;
}
