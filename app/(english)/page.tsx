import { GrowthHome } from '@/components/growth-home';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Find China Supplier Candidates with Listing Evidence',
  'Describe a product or model, quantity and must-have specifications. Inspect China Supply Check and its historical sample. Free preparation requires an MCP-capable client; paid checks are closed.',
  '/',
);

// Candidate A is provisional. Owner preview acceptance must select a variant
// before release (governance decision 5909261935 supersedes the buyer study).
export default function HomePage() {
  return <GrowthHome variant="a" />;
}
