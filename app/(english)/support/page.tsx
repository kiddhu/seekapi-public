import { Eyebrow, PageShell, SectionTitle } from '@/components/site';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata('SeekAPI Support', 'Contact SeekAPI Technology Limited about product questions, a report, an access problem or an order concern.', '/support');

export default function Page() { return <PageShell>
  <section className="page-hero"><div className="container"><Eyebrow>SeekAPI support</Eyebrow><h1>Tell us what you need help with.</h1><p>Contact <a className="text-link" href="mailto:support@seekapi.ai">support@seekapi.ai</a> for a product question, an access problem or a concern about a report or order. SeekAPI Technology Limited operates this site from Hong Kong. A message is a request for review, not an accepted sourcing task or authorization to contact a supplier.</p></div></section>
  <section className="section"><div className="container"><SectionTitle eyebrow="Useful context" title="Include the reference, not a payment secret." body="If you have a report or order reference, include it and the observed problem. Do not email wallet private keys, payment proofs as bearer secrets, passwords, or sensitive drawings before the handling scope is agreed. For a listing discrepancy, include the source URL and observation time. We will review the issue; no response or resolution time is promised on this page."/><p>Company contact address: Room P11, Flat 2C, 2/F, Hung To Ctr., 94–96 How Ming St., Kwun Tong, Kowloon, Hong Kong.</p></div></section>
  <section className="section section-dark"><div className="container"><p>For personal-data handling and service-order terms, read <a className="text-link" href="/privacy">Privacy Notice</a> and <a className="text-link" href="/terms">Service Terms</a>.</p></div></section>
</PageShell>; }
