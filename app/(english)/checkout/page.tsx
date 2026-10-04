import { PageShell } from '@/components/site';
import { CheckoutEntry } from '@/components/checkout-entry';
import { publicCardEntryEnabled } from '@/lib/checkout-contract';
import './checkout.css';
export const dynamic='force-dynamic';
export const metadata={title:'China Supply Check purchase | SeekAPI',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default function Page(){return <PageShell><CheckoutEntry enabled={publicCardEntryEnabled}/></PageShell>}
