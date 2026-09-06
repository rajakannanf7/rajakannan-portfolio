'use client';

import { useMemo, useState } from 'react';
import Reveal from '../../components/ui/Reveal';
import { Shell } from '../../components/ui/bits';

export default function LabGrid({ labs }) {
  const [active, setActive] = useState('all');

  const tags = useMemo(() => {
    const set = new Set(labs.map((l) => l.tag).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [labs]);

  const shown = active === 'all' ? labs : labs.filter((l) => l.tag === active);

  return (
    <>
      <Shell className="pb-12 pt-4">
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

      <Shell className="grid grid-cols-1 items-start gap-5 pb-28 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((l, i) => (
          <Reveal key={l.id || l.src} delay={(i % 3) * 70}>
            <div
              className="group overflow-hidden rounded-tile"
              style={{ height: l.h || 360 }}
              data-cursor="view"
            >
              <img
                src={l.src}
                alt={l.title || ''}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-swift group-hover:scale-105"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-[17px]">{l.title}</span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-faint">
                {l.tool?.toUpperCase()}
              </span>
            </div>
          </Reveal>
        ))}
      </Shell>
    </>
  );
}
