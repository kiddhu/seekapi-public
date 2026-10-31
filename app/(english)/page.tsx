import { GrowthHome } from '@/components/growth-home';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'China Supplier Quotes — $19.90 Verified RFQ | SeekAPI',
  'Get a current Chinese supplier quote for $19.90 once. Up to 3 suppliers contacted; a qualified quote within 3 China business days after payment and brief confirmation, or your RFQ fee back. Prepare free.',
  '/',
);

// Candidate A is provisional. Owner preview acceptance must select a variant
// before release (governance decision 5909261935 supersedes the buyer study).
export default function HomePage() {
  return <GrowthHome variant="a" />;
}
