'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Tilted contact-sheet strip of shoot covers that drifts sideways with scroll.
export default function FilmStrip({ shoots }) {
  const strip = useRef(null);
  const film = shoots.length < 5 ? [...shoots, ...shoots, ...shoots] : [...shoots, ...shoots];

  useEffect(() => {
    const el = strip.current;
    const tw = gsap.fromTo(el, { x: () => -innerWidth * 0.1 }, {
      x: () => -(el.scrollWidth - innerWidth) * 0.55, ease: 'none',
      scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, []);

  return (
    <div className="strip-wrap">
      <div className="strip" ref={strip}>
        {film.map((s, i) => (
          <Link key={i} href={`/shoots/${s.slug}`} className="shot" data-cursor="Open" tabIndex={i >= shoots.length ? -1 : 0} aria-label={`${s.title} shoot`}>
            <div className="ph"><img src={s.cover} alt={s.title} loading="lazy" /></div>
            <div className="cap mono"><span>▸ {12 + i}A &nbsp;{s.title}</span><span>{(s.tags || [])[0] || s.year}</span></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
