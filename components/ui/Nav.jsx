'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Magnetic from './Magnetic';

const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/photography', label: 'Photo' },
  { href: '/about', label: 'About' },
  { href: '/lab', label: 'Lab' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav({ cta = 'Start a project', ctaHref = '/contact' }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? 'bg-ink/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-6 md:px-[72px] md:py-9">
        <Link href="/" className="flex items-baseline gap-2.5" data-cursor="hide">
          <span className="text-[19px] font-bold tracking-[0.14em]">RAJA</span>
          <span className="hidden font-mono text-[10px] tracking-[0.18em] text-dim sm:inline">/ KANNAN</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`font-mono text-xs tracking-[0.1em] transition-colors hover:text-bone ${
                  active ? 'text-bone' : 'text-mute'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Magnetic strength={0.22}>
            <Link
              href={ctaHref}
              className="flex items-center gap-2.5 rounded-full border border-bone/20 px-5 py-3 font-mono text-[11px] tracking-chip transition-colors hover:border-bone/50"
            >
              {cta.toUpperCase()}
              <span className="h-1.5 w-1.5 rounded-full bg-orchid" />
            </Link>
          </Magnetic>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-bone/20 md:hidden"
        >
          <span className={`block h-px w-4 bg-bone transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
          <span className={`block h-px w-4 bg-bone transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-bone/10 bg-ink/95 px-6 pb-8 pt-4 backdrop-blur-md md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="block border-b border-bone/10 py-4 text-2xl font-light">
              {l.label}
            </Link>
          ))}
          <Link
            href={ctaHref}
            className="mt-6 flex h-13 items-center justify-center rounded-full bg-bone py-4 font-mono text-[11px] font-medium tracking-chip text-ink"
          >
            {cta.toUpperCase()}
          </Link>
        </div>
      )}
    </header>
  );
}
