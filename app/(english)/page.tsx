import { GrowthHome } from '@/components/growth-home';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'China Supplier Sourcing — $2.99 Screening or $19.90 RFQ | SeekAPI',
  'Start from a product link, photo or specification. Compare China supplier candidates for $2.99, or request a current qualified quote with standalone $19.90 RFQ Basic. Free preparation; confirm specifications before payment.',
  '/',
);

// Candidate A is provisional. Owner preview acceptance must select a variant
// before release (governance decision 5909261935 supersedes the buyer study).
export default function HomePage() {
  return <GrowthHome variant="a" />;
}
