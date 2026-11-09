'use client';
import Link from 'next/link';
import {useEffect, useId, useRef, useState, type ReactNode} from 'react';
import {usePathname} from 'next/navigation';

/** In-flow disclosure: it never covers the buyer's input or traps focus. */
export function MobileNav({items, menuLabel='Menu', closeLabel='Close', startHref='/start', startLabel='Start with one issue', languageControl}: {
  items: Array<{href:string;label:string}>; menuLabel?:string; closeLabel?:string;
  startHref?:string; startLabel?:string; languageControl?:ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);
  return <div className="mobile-nav" ref={root} onKeyDown={event=>{if(event.key==='Escape'){setOpen(false);trigger.current?.focus();}}}>
    <button ref={trigger} className="menu-button" type="button" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(value=>!value)}>
      <span aria-hidden="true">{open?'×':'☰'}</span><span>{open?closeLabel:menuLabel}</span>
    </button>
    {open?<nav id={menuId} className="mobile-menu" aria-label="Mobile navigation">
      {items.map(item=><Link key={item.href} href={item.href} aria-current={pathname===item.href?'page':undefined} onClick={()=>setOpen(false)}>{item.label}</Link>)}
      {languageControl}
      <Link className="button" href={startHref} onClick={()=>setOpen(false)}>{startLabel}</Link>
    </nav>:null}
  </div>;
}
