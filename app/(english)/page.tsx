import { GrowthHome } from '@/components/growth-home';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'China supplier sourcing and procurement execution for AI agents | SeekAPI',
  'SeekAPI is a China-side procurement desk for overseas buyers and AI agents. Start with China Supply Check: three RFQ-worthy supplier candidates with evidence on success, 2.99 USDC via live x402. Request separately scoped human help for RFQs, samples and execution.',
  '/',
);

// Candidate A is provisional. Owner preview acceptance must select a variant
// before release (governance decision 5909261935 supersedes the buyer study).
export default function HomePage() {
  return <GrowthHome variant="a" />;
}
