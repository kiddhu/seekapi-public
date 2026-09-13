'use client';
import Link from 'next/link';
import { useState } from 'react';
export function MobileNav({ items }: { items: Array<{ href: string; label: string }> }) {
  const [open, setOpen] = useState(false);
  return <div className="mobile-nav">
    <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
      <span aria-hidden="true">{open ? '×' : '☰'}</span><span>{open ? 'Close' : 'Menu'}</span>
    </button>
    {open ? <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
      {items.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
      <Link className="button" href="/start" onClick={() => setOpen(false)}>Start with one issue</Link>
    </nav> : null}
  </div>;
}
