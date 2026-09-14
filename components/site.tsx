import Link from 'next/link';
import type { ReactNode } from 'react';
import { MobileNav } from './mobile-nav';
import { LanguageSwitch } from './language-switch';
import { DocumentLanguage } from './document-language';
import { localeInfo, localizedCopy, pagePath, russianCopy, type SiteLocale } from '@/lib/localized-content';
import { isPublicProduction } from '@/lib/site';

export const navItems = [
  { href: '/china-supply-chain', label: 'For Companies' },
  { href: '/china-compliance-logistics', label: 'Compliance' },
  { href: '/for-agents', label: 'For Agents' },
  { href: '/apis', label: 'APIs' },
  { href: '/proof', label: 'Proof' },
  { href: '/trust', label: 'Trust' },
];

function localeUi(locale:SiteLocale){
  if(locale==='en')return {preview:'Internal preview · payments are not enabled; service requests require human confirmation',skip:'Skip to main content',menu:'Menu',close:'Close',start:'Start with one issue',items:navItems,home:'/',footer:'Machine capability when software is enough. Accountable human execution in China when reality still needs people.',evidence:'Evidence-gated claims'};
  if(locale==='ru'){const c=russianCopy;return {preview:c.preview,skip:c.skip,menu:c.menu,close:c.close,start:c.start,items:Object.entries(c.nav).map(([slug,label])=>({href:`/ru/${slug}`,label})),home:'/ru',footer:c.footer,evidence:c.evidence};}
  const c=localizedCopy[locale];return {preview:c.preview,skip:c.skip,menu:c.menu,close:c.close,start:c.start,items:Object.entries(c.nav).map(([slug,label])=>({href:pagePath(locale,slug as 'china-supply-chain'|'china-compliance-logistics'|'how-it-works'|'trust'),label})),home:pagePath(locale,'home'),footer:c.footer,evidence:c.evidence};
}
export function Header({ locale = 'en' }: { locale?: SiteLocale }) {
  const ui=localeUi(locale); const startHref=locale==='ru'?'/ru/start':pagePath(locale,'start');
  const productionNotices:Record<SiteLocale,string>={en:'Service requests require human scope confirmation · Website payments are not enabled',ja:'サービス依頼は人が範囲を確認してから受諾 · ウェブサイト決済は未対応',es:'Las solicitudes requieren confirmación humana del alcance · Los pagos web no están habilitados',ar:'تتطلب الطلبات مراجعة بشرية للنطاق · الدفع عبر الموقع غير مفعّل',de:'Serviceanfragen erfordern eine menschliche Umfangsprüfung · Website-Zahlungen sind nicht aktiviert','pt-br':'Solicitações exigem revisão humana do escopo · Pagamentos no site não estão habilitados',ru:'Запросы принимаются после ручной проверки объёма · Оплата на сайте не включена'};
  const notice=isPublicProduction?productionNotices[locale]:ui.preview;
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">{ui.skip}</a>
      <div className="preview-bar">{notice}</div>
      <div className="container nav-wrap">
        <Link href={ui.home} className="brand" aria-label="SeekAPI home">
          <span className="brand-mark" aria-hidden="true">S</span><span>SeekAPI</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {ui.items.map((item) => <Link key={item.href} href={item.href} className="nav-link">{item.label}</Link>)}
        </nav>
        <LanguageSwitch locale={locale}/>
        <Link href={startHref} className="button button-small">{ui.start}</Link>
        <MobileNav items={ui.items} menuLabel={ui.menu} closeLabel={ui.close} startHref={startHref} startLabel={ui.start}/>
      </div>
    </header>
  );
}

export function Footer({ locale = 'en' }: { locale?: SiteLocale }) {
  const ui=localeUi(locale); const startHref=locale==='ru'?'/ru/start':pagePath(locale,'start');
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><div className="brand footer-brand"><span className="brand-mark" aria-hidden="true">S</span><span>SeekAPI</span></div><p className="muted footer-copy">{ui.footer}</p></div>
        <div className="footer-links">{ui.items.map(item=><Link href={item.href} key={item.href}>{item.label}</Link>)}<Link href={startHref}>{ui.start}</Link></div>
        <address className="footer-legal"><strong>SeekAPI Technology Limited</strong><span>Room P11, Flat 2C, 2/F, Hung To Ctr.<br/>94–96 How Ming St., Kwun Tong<br/>Kowloon, Hong Kong</span><a href="mailto:support@seekapi.ai">support@seekapi.ai</a></address>
      </div>
      <div className="container footer-bottom"><span>© 2026 SeekAPI</span><span>{ui.evidence}</span></div>
    </footer>
  );
}

export function PageShell({ children, locale = 'en' }: { children: ReactNode; locale?: SiteLocale }) { const info=localeInfo[locale];return <><DocumentLanguage locale={locale}/><div lang={info.htmlLang} dir={info.dir}><Header locale={locale}/><main id="main-content">{children}</main><Footer locale={locale}/></div></>; }
export function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow">{children}</div>; }
export function SectionTitle({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) { return <div className="section-heading">{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}<h2>{title}</h2>{body ? <p>{body}</p> : null}</div>; }
export function Pill({ children }: { children: ReactNode }) { return <span className="pill">{children}</span>; }
export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong><p>{detail}</p></div>; }
export function FeatureCard({ index, title, body, items }: { index?: string; title: string; body: string; items?: string[] }) { return <article className="feature-card">{index ? <span className="feature-index">{index}</span> : null}<h3>{title}</h3><p>{body}</p>{items ? <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul> : null}</article>; }
export function CTA({ eyebrow, title, body, primaryLabel = 'Start with one issue', primaryHref = '/start', secondaryLabel, secondaryHref }: { eyebrow?: string; title: string; body: string; primaryLabel?: string; primaryHref?: string; secondaryLabel?: string; secondaryHref?: string }) { return <section className="cta-band"><div className="container cta-inner"><div>{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}<h2>{title}</h2><p>{body}</p></div><div className="button-row"><Link href={primaryHref} className="button">{primaryLabel}</Link>{secondaryLabel && secondaryHref ? <Link href={secondaryHref} className="button button-ghost">{secondaryLabel}</Link> : null}</div></div></section>; }
export function ProcessSteps({ steps }: { steps: Array<{ title: string; body: string }> }) { return <div className="process-grid">{steps.map((step, i) => <div className="process-step" key={step.title}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></div>)}</div>; }
export function SplitPanel({ left, right }: { left: ReactNode; right: ReactNode }) { return <div className="split-panel"><div>{left}</div><div>{right}</div></div>; }
export type FaqItem = { question: string; answer: string };
export function FAQList({ title, eyebrow, faqs }: { title: string; eyebrow: string; faqs: FaqItem[] }) { return <section className="section"><div className="container"><SectionTitle eyebrow={eyebrow} title={title}/><div className="definition-grid">{faqs.map(f=><article className="definition" key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></article>)}</div></div></section>; }
export function ServiceFaqSchema({ name, description, path, faqs, locale = 'en' }: { name:string; description:string; path:string; faqs:FaqItem[]; locale?:SiteLocale }) { const lang=locale==='en'?'en':locale==='pt-br'?'pt-BR':locale; const data={ '@context':'https://schema.org','@graph':[{ '@type':'Service',name,description,url:`https://seekapi.ai${path}`,provider:{'@id':'https://seekapi.ai/#organization'},areaServed:'China',serviceType:name,inLanguage:lang},{'@type':'FAQPage',inLanguage:lang,mainEntity:faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}]}; return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}}/>; }
