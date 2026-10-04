import { GrowthHome } from '@/components/growth-home';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'SeekAPI — China Supply Check: Supplier Candidates with Evidence',
  'Describe a product or model, quantity and must-have specifications. Inspect China Supply Check and its sample summary. Free preparation requires an MCP-capable client. China Supply Check costs 2.99 USDC per accepted order via x402, with Stripe card checkout being enabled; order and payment are confirmed separately.',
  '/',
);

// Candidate A is provisional. Owner preview acceptance must select a variant
// before release (governance decision 5909261935 supersedes the buyer study).
export default function HomePage() {
  return <GrowthHome variant="a" />;
}
