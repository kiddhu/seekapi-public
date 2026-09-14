'use client';
import Link from 'next/link';
import { useState } from 'react';
export function MobileNav({ items, menuLabel='Menu', closeLabel='Close', startHref='/start', startLabel='Start with one issue' }: { items: Array<{ href: string; label: string }>; menuLabel?:string; closeLabel?:string; startHref?:string; startLabel?:string }) {
  const [open, setOpen] = useState(false);
  return <div className="mobile-nav">
    <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
      <span aria-hidden="true">{open ? '×' : '☰'}</span><span>{open ? closeLabel : menuLabel}</span>
    </button>
    {open ? <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
      {items.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
      <Link className="button" href={startHref} onClick={() => setOpen(false)}>{startLabel}</Link>
    </nav> : null}
  </div>;
}
