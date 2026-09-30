import { notFound } from 'next/navigation';
import { RootDocument } from '@/components/root-document';
import { commercialLocales, type SiteLocale } from '@/lib/localized-content';
export { metadata, viewport } from '@/components/root-document';

const locales: readonly string[] = [...commercialLocales, 'ru'];
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}
export default async function LocaleLayout({ children, params }: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return <RootDocument locale={locale as SiteLocale}>{children}</RootDocument>;
}
