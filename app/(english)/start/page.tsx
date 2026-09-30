import { Suspense } from 'react';
import { Eyebrow, PageShell } from '@/components/site';
import { StartForm } from '@/components/start-form';
import { pageMetadata } from '@/lib/site';
export const metadata=pageMetadata('Start with One Issue','Prepare a non-sensitive company issue or AI Agent handoff for SeekAPI.','/start');
export default function Page(){return <PageShell>
  <section className="page-hero"><div className="container"><Eyebrow>Start narrow</Eyebrow><h1>Start with one China-side issue.</h1><p>Choose a company request or Agent handoff. The form prepares an order or service request inside your browser. You decide whether to send the prepared email; SeekAPI then confirms the exact scope and payment before execution.</p></div></section>
  <section className="section section-tight"><div className="container"><Suspense fallback={<p>Loading the request draft…</p>}><StartForm/></Suspense></div></section>
</PageShell>}
