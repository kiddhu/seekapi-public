import Link from 'next/link';
import type { ReactNode } from 'react';
import { MobileNav } from './mobile-nav';
import { LanguageSwitch } from './language-switch';
import { DocumentLanguage } from './document-language';

export const navItems = [
  { href: '/china-supply-chain', label: 'For Companies' },
  { href: '/china-compliance-logistics', label: 'Compliance' },
  { href: '/for-agents', label: 'For Agents' },
  { href: '/apis', label: 'APIs' },
  { href: '/proof', label: 'Proof' },
  { href: '/trust', label: 'Trust' },
];

export const zhNavItems = [
  { href: '/zh/china-supply-chain', label: '企业服务' },
  { href: '/zh/china-compliance-logistics', label: '合规与履约' },
  { href: '/zh/for-agents', label: 'Agent 服务' },
  { href: '/zh/apis', label: 'API' },
  { href: '/zh/proof', label: '证据' },
  { href: '/zh/trust', label: '信任与边界' },
];

export function Header({ locale = 'en' }: { locale?: 'en'|'zh' }) {
  const zh = locale === 'zh';
  const items = zh ? zhNavItems : navItems;
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">{zh ? '跳到主要内容' : 'Skip to main content'}</a>
      <div className="preview-bar">{zh ? '内部预览 · 网站不接收付款，服务请求需人工确认' : 'Internal preview · payments are not enabled; service requests require human confirmation'}</div>
      <div className="container nav-wrap">
        <Link href={zh ? '/zh' : '/'} className="brand" aria-label={zh ? 'SeekAPI 中文首页' : 'SeekAPI home'}>
          <span className="brand-mark" aria-hidden="true">S</span><span>SeekAPI</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {items.map((item) => <Link key={item.href} href={item.href} className="nav-link">{item.label}</Link>)}
        </nav>
        <LanguageSwitch locale={locale}/>
        <Link href={zh ? '/zh/start' : '/start'} className="button button-small">{zh ? '提交一个问题' : 'Start with one issue'}</Link>
        <MobileNav items={items} />
      </div>
    </header>
  );
}

export function Footer({ locale = 'en' }: { locale?: 'en'|'zh' }) {
  const zh = locale === 'zh';
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><div className="brand footer-brand"><span className="brand-mark" aria-hidden="true">S</span><span>SeekAPI</span></div><p className="muted footer-copy">{zh ? '软件能完成的交给机器；必须落到中国现场的工作，由有明确边界的人来执行。' : 'Machine capability when software is enough. Accountable human execution in China when reality still needs people.'}</p></div>
        <div className="footer-links">{(zh ? zhNavItems : navItems).map(item=><Link href={item.href} key={item.href}>{item.label}</Link>)}<Link href={zh ? '/zh/china-desk' : '/china-desk'}>{zh ? '常驻中国事务台' : 'China Desk'}</Link><Link href={zh ? '/zh/how-it-works' : '/how-it-works'}>{zh ? '如何运作' : 'How it works'}</Link><Link href={zh ? '/zh/start' : '/start'}>{zh ? '开始' : 'Start'}</Link></div>
        <address className="footer-legal"><strong>SeekAPI Technology Limited</strong><span>Room P11, Flat 2C, 2/F, Hung To Ctr.<br/>94–96 How Ming St., Kwun Tong<br/>Kowloon, Hong Kong</span><a href="mailto:support@seekapi.ai">support@seekapi.ai</a></address>
      </div>
      <div className="container footer-bottom"><span>© 2026 SeekAPI</span><span>{zh ? '所有能力声明以证据为准' : 'Evidence-gated claims'}</span></div>
    </footer>
  );
}

export function PageShell({ children, locale = 'en' }: { children: ReactNode; locale?: 'en'|'zh' }) { return <><DocumentLanguage locale={locale}/><Header locale={locale}/><main id="main-content">{children}</main><Footer locale={locale}/></>; }
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
export function ServiceFaqSchema({ name, description, path, faqs, locale = 'en' }: { name:string; description:string; path:string; faqs:FaqItem[]; locale?:'en'|'zh' }) { const data={ '@context':'https://schema.org','@graph':[{ '@type':'Service',name,description,url:`https://seekapi.ai${path}`,provider:{'@id':'https://seekapi.ai/#organization'},areaServed:'China',serviceType:name,inLanguage:locale==='zh'?'zh-Hans':'en'},{'@type':'FAQPage',inLanguage:locale==='zh'?'zh-Hans':'en',mainEntity:faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}]}; return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}}/>; }
