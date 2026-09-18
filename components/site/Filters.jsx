'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pad } from '../../lib/text';

const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());

export function LabGrid({ labs }) {
  const tags = ['All', ...new Set(labs.map((l) => l.tag).filter(Boolean))];
  const [tag, setTag] = useState('All');
  return (
    <>
      <div className="filters">
        {tags.map((t) => (
          <button key={t} aria-pressed={t === tag} onClick={() => { setTag(t); refresh(); }}>{t}</button>
        ))}
      </div>
      <div className="masonry" data-stagger>
        {labs.map((l) => (
          <figure key={l.id} className={`cell tilt ${tag !== 'All' && l.tag !== tag ? 'hide' : ''}`} tabIndex={0}>
            <img src={l.src} alt={l.title} loading="lazy" />
            <figcaption><b>{l.title}</b><span className="mono">{l.tool}</span></figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

export function WorkIndex({ projects, skills, initial = 'all' }) {
  const [skill, setSkill] = useState(initial);
  const shown = projects.filter((p) => skill === 'all' || (p.skills || []).includes(skill));
  return (
    <>
      <div className="filters">
        <button aria-pressed={skill === 'all'} onClick={() => { setSkill('all'); refresh(); }}>All · {projects.length}</button>
        {skills.map((s) => {
          const n = projects.filter((p) => (p.skills || []).includes(s.slug)).length;
          return n ? (
            <button key={s.slug} aria-pressed={skill === s.slug} onClick={() => { setSkill(s.slug); refresh(); }}>{s.title} · {n}</button>
          ) : null;
        })}
      </div>
      <div className="grid-work" style={{ marginTop: 30 }}>
        {shown.map((p, i) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className={`card ${i % 4 === 0 || i % 4 === 3 ? 'wide' : 'tall'}`} data-cursor="View">
            <div className="frame">
              <img src={p.cover} alt={p.title} loading={i < 2 ? 'eager' : 'lazy'} />
              <span className="num mono">{pad(i + 1)}</span>
              <span className="pill mono">{p.category}</span>
            </div>
            <div className="meta"><h3>{p.title}</h3><span className="mono">{p.client} · {p.year}</span></div>
            <p className="lead">{p.summary}</p>
          </Link>
        ))}
      </div>
      {!shown.length && <p className="empty">Nothing here yet.</p>}
    </>
  );
}
