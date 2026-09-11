import type { Metadata, Viewport } from 'next';
import './globals.css';

const publicIndexing = process.env.NEXT_PUBLIC_PUBLIC_INDEXING === '1';

export const metadata: Metadata = {
  metadataBase: new URL('https://seekapi.ai'),
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
  robots: publicIndexing ? { index: true, follow: true } : { index: false, follow: false, noarchive: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SeekAPI',
    url: 'https://seekapi.ai',
    description: 'Machine capability and accountable China-side human execution for companies, agents and developers.',
  };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />{children}</body></html>;
}
