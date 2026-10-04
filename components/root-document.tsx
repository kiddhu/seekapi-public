import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import '@/app/enhancements.css';
import '@/app/growth.css';
import { localeInfo, type SiteLocale } from '@/lib/localized-content';
import { isPublicProduction, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SeekAPI — China Supply Check: source-linked supplier candidates',
    template: '%s | SeekAPI',
  },
  description: 'China Supply Check from SeekAPI: three evidence-backed China supplier candidates worth advancing to RFQ. Free MCP brief preparation; 2.99 USDC per accepted order via x402, with Stripe card checkout being enabled.',
  openGraph: {
    title: 'SeekAPI — China Supply Check: source-linked supplier candidates',
    description: 'Inspect China supplier listing evidence and prepare a free brief through MCP. China Supply Check costs 2.99 USDC per accepted order via x402; Stripe card checkout is being enabled.',
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
      { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'SeekAPI', legalName: 'SeekAPI Technology Limited', url: siteUrl, knowsAbout: ['China supplier sourcing', 'China supplier screening', 'China procurement', 'MCP', 'x402'], subjectOf: [{ '@type': 'WebPage', url: `${siteUrl}/sourcing` }, { '@type': 'WebPage', url: `${siteUrl}/china-supply-check/sample` }], email: 'support@seekapi.ai', address: { '@type': 'PostalAddress', streetAddress: 'Room P11, Flat 2C, 2/F, Hung To Ctr., 94-96 How Ming St.', addressLocality: 'Kwun Tong', addressRegion: 'Kowloon', addressCountry: 'HK' }, description: 'SeekAPI provides China Supply Check, returning three evidence-backed China supplier candidates worth advancing to RFQ, plus scoped China-side supply-chain, compliance and fulfillment coordination for companies and AI teams.' },
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'SeekAPI', url: siteUrl, publisher: { '@id': `${siteUrl}/#organization` }, inLanguage: ['en','ja','es','ar','de','pt-BR','ru'] },
    ],
  };
  return <html lang={info.htmlLang} dir={info.dir}><head><link rel="ard" href="/.well-known/ard.json" type="application/json" /></head><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />{children}</body></html>;
}
