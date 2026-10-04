import { PageShell } from '@/components/site';
import { CheckoutExperience } from '@/components/checkout-experience';
import '../checkout.css';
export const dynamic = 'force-dynamic';
export const metadata = {title:'Your purchase | SeekAPI',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default function Page(){return <PageShell><CheckoutExperience showResult={false}/></PageShell>;}
