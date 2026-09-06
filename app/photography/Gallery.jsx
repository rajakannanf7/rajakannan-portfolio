'use client';

import { useMemo, useState } from 'react';
import Reveal from '../../components/ui/Reveal';
import { Shell } from '../../components/ui/bits';

export default function Gallery({ photos }) {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const tags = useMemo(() => {
    const set = new Set(photos.map((p) => p.tag).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [photos]);

  const shown = active === 'All' ? photos : photos.filter((p) => p.tag === active);

  return (
    <>
      <Shell className="pb-4">
        <div className="flex flex-wrap gap-2.5">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`rounded-full px-5 py-3 font-mono text-[11px] tracking-[0.14em] transition-colors ${
                active === t
                  ? 'bg-bone font-medium text-ink'
                  : 'border border-bone/15 text-bone/60 hover:border-bone/40 hover:text-bone'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </Shell>

      <Shell className="grid grid-cols-2 items-start gap-4 pb-16 pt-10 md:grid-cols-3 md:gap-5">
        {shown.map((p, i) => (
          <Reveal key={p.id || p.src} delay={(i % 3) * 70} style={{ marginTop: p.offset || 0 }}>
            <button
              onClick={() => setLightbox(p)}
              data-cursor="view"
              className="group block w-full overflow-hidden rounded-tile text-left"
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={p.src}
                  alt={p.title || ''}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-swift group-hover:scale-105"
                />
              </div>
            </button>
            <div className="mt-3.5 flex items-baseline justify-between">
              <span className="text-base">{p.title}</span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-faint">
                {p.tag?.toUpperCase()}
              </span>
            </div>
          </Reveal>
        ))}
      </Shell>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[65] flex items-center justify-center bg-ink/95 p-6 backdrop-blur-sm"
          data-cursor="hide"
        >
          <img
            src={lightbox.src}
            alt={lightbox.title || ''}
            className="max-h-[88vh] max-w-full rounded-tile object-contain"
          />
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-bone/25"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
