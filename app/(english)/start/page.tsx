import {Eyebrow, PageShell} from '@/components/site';
import {StartForm} from '@/components/start-form';
import {pageMetadata} from '@/lib/site';
export const metadata=pageMetadata('Prepare a Request for Scope Review','Create a non-sensitive email draft for SeekAPI. This page does not send or store your request.','/start');

export default async function Page({searchParams}:{searchParams:Promise<{audience?:string;intent?:string}>}) {
  const params=await searchParams;
  const audience=params.audience==='agent'?'agent':'company';
  // Keep the complete form in the first response instead of replacing a
  // short Suspense fallback after hydration.
  return <PageShell>
    <section className="page-hero"><div className="container"><Eyebrow>Scope review</Eyebrow><h1>Prepare a request for scope review.</h1><p>Create a non-sensitive email draft for our team. This page does not send or store your request. Review the draft and choose whether to send it in your email application.</p></div></section>
    <section className="section section-tight"><div className="container"><StartForm initialAudience={audience} initialIntent={typeof params.intent==='string'?params.intent:''}/></div></section>
  </PageShell>;
}
