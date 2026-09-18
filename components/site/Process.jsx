'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

// Sticky image on the left swaps as each skill step crosses the middle of the screen.
export default function Process({ skills }) {
  const [active, setActive] = useState(0);
  const wrap = useRef(null);

  useEffect(() => {
    const steps = wrap.current.querySelectorAll('.step');
    const triggers = [...steps].map((st, i) =>
      ScrollTrigger.create({ trigger: st, start: 'top 60%', end: 'bottom 60%', onToggle: (s) => s.isActive && setActive(i) })
    );
    return () => triggers.forEach((t) => t.kill());
  }, [skills.length]);

  return (
    <div className="proc" ref={wrap}>
      <div className="proc-media">
        {skills.map((s, i) => (
          <img key={s.slug} src={s.cover} alt={s.title} loading="lazy" className={i <= active ? 'on' : ''} />
        ))}
        <div className="ticks">{skills.map((s, i) => <i key={s.slug} className={i === active ? 'on' : ''} />)}</div>
        <div className="lbl mono"><b>{skills[active]?.n}</b><span>{skills[active]?.title}</span></div>
      </div>
      <div>
        {skills.map((s, i) => (
          <div key={s.slug} className={`step ${i === active ? 'on' : ''}`}>
            <span className="n mono">{s.n} / {String(skills.length).padStart(2, '0')}</span>
            <h3 className="display">{s.title} <span className="it">{s.sub}</span></h3>
            <p>{s.summary}</p>
            <ul className="chips">{(s.tools || []).map((t) => <li key={t}>{t}</li>)}</ul>
            <Link href={`/skills/${s.slug}`} className="link-arrow mono">Explore {s.title} →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
