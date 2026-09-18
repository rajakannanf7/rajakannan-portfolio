'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pad } from '../../lib/text';

gsap.registerPlugin(ScrollTrigger);

// Pinned horizontal reel on desktop; a plain vertical stack under 900px.
export default function WorkReel({ projects, archive }) {
  const reel = useRef(null);
  const track = useRef(null);
  const prog = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const dist = () => track.current.scrollWidth - innerWidth;
      const tw = gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: reel.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1,
          invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (s) => gsap.set(prog.current, { scaleX: s.progress }),
        },
      });
      track.current.querySelectorAll('.frame img').forEach((img) =>
        gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.panel'), containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } })
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div className="reel" ref={reel}>
      <div className="hwrap">
        <div className="htrack" ref={track}>
          {projects.map((p, i) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className={`panel ${p.layout === 'tall' ? 'tall' : ''}`} data-cursor="View">
              <div className="frame">
                <div className="zoom"><img src={p.cover} alt={`${p.title}: ${p.category}`} /></div>
                <span className="num mono">{pad(i + 1)} / {pad(projects.length)}</span>
                <span className="pill mono">{p.category}</span>
              </div>
              <div className="info">
                <h3>{p.title}</h3>
                <p className="lead">{p.summary}</p>
                <span className="tools mono">{[p.client, p.year, (p.tools || []).slice(0, 4).join(' · ')].filter(Boolean).join(' · ')}</span>
              </div>
            </Link>
          ))}
          {archive.length > 0 && (
            <div className="panel end">
              <h4 className="display">More in<br /><span className="it red">the archive</span></h4>
              {archive.map((a, i) => (
                <Link key={a.slug} href={`/work/${a.slug}`} className="arch-row">
                  <span className="mono" style={{ color: 'var(--faint)' }}>{pad(projects.length + i + 1)}</span>
                  <span className="t">{a.title}</span>
                  <span className="c mono">{a.category} · {a.year}</span>
                </Link>
              ))}
              <Link href="/work" className="link-arrow mono">All work →</Link>
            </div>
          )}
        </div>
      </div>
      <div className="hprog"><i ref={prog} /></div>
    </div>
  );
}
