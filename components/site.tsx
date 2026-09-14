import Link from 'next/link';
import type { ReactNode } from 'react';
import { MobileNav } from './mobile-nav';

export const navItems = [
  { href: '/china-supply-chain', label: 'For Companies' },
  { href: '/china-compliance-logistics', label: 'Compliance' },
  { href: '/for-agents', label: 'For Agents' },
  { href: '/apis', label: 'APIs' },
  { href: '/proof', label: 'Proof' },
  { href: '/trust', label: 'Trust' },
];

export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="preview-bar">Internal preview · task submission and payments are not enabled</div>
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label="SeekAPI home">
          <span className="brand-mark" aria-hidden="true">S</span><span>SeekAPI</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} className="nav-link">{item.label}</Link>)}
        </nav>
        <Link href="/start" className="button button-small">Start with one issue</Link>
        <MobileNav items={navItems} />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><div className="brand footer-brand"><span className="brand-mark" aria-hidden="true">S</span><span>SeekAPI</span></div><p className="muted footer-copy">Machine capability when software is enough. Accountable human execution in China when reality still needs people.</p></div>
        <div className="footer-links"><Link href="/china-supply-chain">For Companies</Link><Link href="/china-desk">China Desk</Link><Link href="/china-compliance-logistics">Compliance & logistics</Link><Link href="/for-agents">For Agents</Link><Link href="/apis">APIs</Link><Link href="/how-it-works">How it works</Link><Link href="/proof">Proof</Link><Link href="/trust">Trust</Link><Link href="/start">Start</Link></div>
        <address className="footer-legal"><strong>SeekAPI Technology Limited</strong><span>Room P11, Flat 2C, 2/F, Hung To Ctr.<br/>94–96 How Ming St., Kwun Tong<br/>Kowloon, Hong Kong</span><a href="mailto:support@seekapi.ai">support@seekapi.ai</a></address>
      </div>
      <div className="container footer-bottom"><span>© 2026 SeekAPI</span><span>Evidence-gated claims</span></div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) { return <><Header /><main id="main-content">{children}</main><Footer /></>; }
export function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow">{children}</div>; }
export function SectionTitle({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) { return <div className="section-heading">{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}<h2>{title}</h2>{body ? <p>{body}</p> : null}</div>; }
export function Pill({ children }: { children: ReactNode }) { return <span className="pill">{children}</span>; }
export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong><p>{detail}</p></div>; }
export function FeatureCard({ index, title, body, items }: { index?: string; title: string; body: string; items?: string[] }) { return <article className="feature-card">{index ? <span className="feature-index">{index}</span> : null}<h3>{title}</h3><p>{body}</p>{items ? <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul> : null}</article>; }
export function CTA({ eyebrow, title, body, primaryLabel = 'Start with one issue', primaryHref = '/start', secondaryLabel, secondaryHref }: { eyebrow?: string; title: string; body: string; primaryLabel?: string; primaryHref?: string; secondaryLabel?: string; secondaryHref?: string }) { return <section className="cta-band"><div className="container cta-inner"><div>{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}<h2>{title}</h2><p>{body}</p></div><div className="button-row"><Link href={primaryHref} className="button">{primaryLabel}</Link>{secondaryLabel && secondaryHref ? <Link href={secondaryHref} className="button button-ghost">{secondaryLabel}</Link> : null}</div></div></section>; }
export function ProcessSteps({ steps }: { steps: Array<{ title: string; body: string }> }) { return <div className="process-grid">{steps.map((step, i) => <div className="process-step" key={step.title}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></div>)}</div>; }
export function SplitPanel({ left, right }: { left: ReactNode; right: ReactNode }) { return <div className="split-panel"><div>{left}</div><div>{right}</div></div>; }
