import type { Metadata, Viewport } from 'next';
import './globals.css';
import './enhancements.css';
import { isPublicProduction, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SeekAPI — Machine capability. Human execution in China.',
    template: '%s | SeekAPI',
  },
  description: 'APIs for machines, a China Supply Chain Desk for companies, and accountable human execution for AI agents when real-world work cannot stop at software.',
  openGraph: {
    title: 'SeekAPI — Machine capability. Human execution in China.',
    description: 'For companies, agents and developers that need China-side sourcing, supplier communication, verification and execution.',
    url: 'https://seekapi.ai',
    siteName: 'SeekAPI',
    type: 'website',
  },
  alternates: { canonical: '/' },
  robots: isPublicProduction ? { index: true, follow: true } : { index: false, follow: false, noarchive: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'SeekAPI', legalName: 'SeekAPI Technology Limited', url: siteUrl, email: 'support@seekapi.ai', address: { '@type': 'PostalAddress', streetAddress: 'Room P11, Flat 2C, 2/F, Hung To Ctr., 94-96 How Ming St.', addressLocality: 'Kwun Tong', addressRegion: 'Kowloon', addressCountry: 'HK' }, description: 'Machine capabilities and scoped China-side supply-chain, compliance and fulfillment coordination for companies and AI teams.' },
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'SeekAPI', url: siteUrl, publisher: { '@id': `${siteUrl}/#organization` }, inLanguage: 'en' },
    ],
  };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />{children}</body></html>;
}
