import { GrowthHome } from '@/components/growth-home';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'China Suppliers — $2.99 Screening & $19.90 Supplier Quotes | SeekAPI',
  'Screen Chinese supplier candidates for $2.99 or request current supplier-confirmed quotes for $19.90. Independent services, free brief preparation, and a clear RFQ service-fee guarantee.',
  '/',
);

// Existing A/B/C preview URLs remain separate; the main journey follows the
// frozen two-service design, subject to normal review and release.
export default function HomePage() {
  return <GrowthHome variant="a" />;
}
