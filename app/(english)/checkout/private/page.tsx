import { PrivateCheckoutEntry } from '@/components/checkout-private-entry';
import '../checkout.css';
export const dynamic='force-dynamic';
export const metadata={title:'Your China Supply Check | SeekAPI',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default function Page(){return <PrivateCheckoutEntry/>}
