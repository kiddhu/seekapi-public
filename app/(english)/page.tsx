import { GrowthHome } from '@/components/growth-home';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Find China Supplier Candidates with Listing Evidence',
  'Describe a product or model, quantity and must-have specifications. Inspect China Supply Check and its historical sample. Free preparation requires an MCP-capable client; paid checks are closed.',
  '/',
);

// Candidate A is provisional in this implementation PR. The frozen ten-buyer
// study must select a variant before this branch is released to production.
export default function HomePage() {
  return <GrowthHome variant="a" />;
}
