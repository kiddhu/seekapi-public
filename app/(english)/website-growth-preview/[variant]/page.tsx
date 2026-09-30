import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GrowthHome, type HomepageVariant } from '@/components/growth-home';

export const metadata: Metadata = {
  title: 'Homepage candidate study',
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: '/' },
};
export const dynamicParams = false;
export function generateStaticParams() {
  return ['a', 'b', 'c'].map(variant => ({ variant }));
}
export default async function CandidatePage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  if (process.env.VERCEL_ENV === 'production' || !['a', 'b', 'c'].includes(variant)) notFound();
  return <GrowthHome variant={variant as HomepageVariant} />;
}
