'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  ['/work', 'Work'],
  ['/shoots', 'Shoots'],
  ['/skills', 'Skills'],
  ['/lab', 'Lab'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const on = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header className="nav">
        <Link href="/" className="brand">Raja Kannan <sup>®</sup></Link>
        <ul>
          {LINKS.map(([href, label]) => (
            <li key={href}><Link href={href} className={on(href) ? 'on' : ''}>{label}</Link></li>
          ))}
        </ul>
        <button className="menu-btn" aria-expanded={open} aria-controls="overlay" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
      <nav id="overlay" className={`overlay ${open ? 'open' : ''}`} aria-label="Mobile" aria-hidden={!open}>
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} tabIndex={open ? 0 : -1}>{label}</Link>
        ))}
        <span className="mono">hello@rajakannan.com</span>
      </nav>
    </>
  );
}
