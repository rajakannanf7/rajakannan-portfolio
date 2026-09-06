'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeroCanvas from '../three/HeroCanvas';
import { VioletButton, GhostButton, Arrow } from '../ui/bits';

const SPECS = [
  ['Engine', 'Redshift'],
  ['Samples', '512'],
  ['Tris', '1.24 M'],
  ['Frame', '04:18'],
];

export default function Hero({ site }) {
  const [variant, setVariant] = useState(0);

  return (
    <section className="relative px-6 pb-9 pt-28 md:px-[72px] md:pt-28">
      <div className="mx-auto flex max-w-shell flex-col gap-5 lg:flex-row">
        {/* ---- type panel ---- */}
        <div className="relative flex-shrink-0 overflow-hidden rounded-panel border border-bone/[0.07] bg-gradient-to-b from-panel to-ink2 lg:h-[clamp(664px,52vw,820px)] lg:w-[43%]">
          <div className="pointer-events-none absolute -left-[18%] -top-[12%] h-[480px] w-[480px] rounded-full bg-violet/20 blur-[60px]" />

          <span className="absolute bottom-[190px] left-6 hidden font-mono text-[10px] tracking-[0.32em] text-faint [writing-mode:vertical-rl] [transform:rotate(180deg)] lg:block">
            RAJA KANNAN
          </span>

          <div className="relative flex h-full flex-col p-8 md:p-11 lg:pl-[72px] 2xl:p-14 2xl:pl-[86px]">
            <div className="mb-8 font-mono text-[10px] tracking-label text-dim 2xl:text-[11px]">PORTFOLIO — 2026</div>

            <h1 className="text-[clamp(3.4rem,11vw,7.125rem)] font-bold leading-[0.84] tracking-[-0.035em] 2xl:text-[8.5rem]">
              RAJA
            </h1>
            <h1 className="text-[clamp(3.4rem,11vw,7.125rem)] font-extralight leading-[0.84] tracking-[-0.025em] text-bone/[0.58] 2xl:text-[8.5rem]">
              KANNAN
            </h1>

            <p className="mt-8 max-w-[440px] text-base font-light leading-relaxed text-bone/60 2xl:max-w-[560px] 2xl:text-lg">
              <span className="text-bone">{site.tagline}</span> {site.blurb}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <VioletButton href="/work">SELECTED WORK</VioletButton>
              <GhostButton href="/about">ABOUT ME</GhostButton>
            </div>

            <div className="flex-grow" />

            {/* availability — fills the panel with the thing a visitor wants first */}
            <div className="mb-7 flex items-center gap-3 border-t border-bone/[0.08] pt-7">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orchid opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orchid" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-mute">
                AVAILABLE — {site.availability?.split('—')[0]?.trim().toUpperCase() || 'Q4 2026'}
              </span>
            </div>

            {/* showreel */}
            <div className="flex items-end justify-between gap-6">
              <p className="hidden max-w-[200px] text-[13px] font-light leading-relaxed text-mute sm:block 2xl:max-w-[250px] 2xl:text-sm">
                Seven years of frames, cut down to ninety seconds.
              </p>
              <Link
                href={site.showreelUrl || '/work'}
                target={site.showreelUrl ? '_blank' : undefined}
                data-cursor="play"
                className="group relative h-[140px] w-full overflow-hidden rounded-2xl sm:w-[268px] 2xl:h-[160px] 2xl:w-[320px]"
              >
                <img src="/img/showreel-thumb.jpg" alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-swift group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/85" />
                <span className="absolute bottom-4 left-[18px]">
                  <span className="mb-1.5 block font-mono text-[9px] tracking-[0.22em] text-halo">2026</span>
                  <span className="block text-xl font-semibold tracking-[0.01em]">SHOWREEL</span>
                </span>
                <span className="absolute right-4 top-4 flex h-[38px] w-[38px] items-center justify-center rounded-full border border-bone/50">
                  <Arrow size={13} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ---- object panel ---- */}
        <div className="relative flex-grow overflow-hidden rounded-panel border border-bone/[0.07] bg-[radial-gradient(120%_100%_at_55%_30%,#241C56_0%,#140F30_42%,#0A0912_100%)]">
          <div className="relative h-[400px] sm:h-[500px] lg:h-[clamp(664px,52vw,820px)]" data-cursor="drag">
            <HeroCanvas variant={variant} />
          </div>

          <div className="pointer-events-none absolute bottom-24 left-1/2 h-10 w-[380px] max-w-[70%] -translate-x-1/2 rounded-[50%] bg-violet/50 blur-[24px] 2xl:w-[520px]" />

          {/* spec HUD */}
          <div className="absolute right-5 top-5 w-[242px] rounded-2xl border border-bone/10 bg-ink/70 p-5 pb-3.5 backdrop-blur-sm 2xl:right-7 2xl:top-7 2xl:w-[280px] 2xl:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] font-medium tracking-[0.22em]">SENTIENT · 0{variant + 1}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-orchid" />
            </div>
            {SPECS.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-t border-bone/[0.08] py-2.5">
                <span className="font-mono text-[10px] tracking-[0.1em] text-mute">{k}</span>
                <span className="font-mono text-[10px] text-bone/80">{v}</span>
              </div>
            ))}
          </div>

          {/* variant switch */}
          <div className="absolute bottom-7 right-6 flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setVariant(i)}
                aria-label={`Hero variant ${i + 1}`}
                className={`h-0.5 w-[26px] transition-colors ${i === variant ? 'bg-bone' : 'bg-bone/25 hover:bg-bone/50'}`}
              />
            ))}
          </div>

          {/* notched corner */}
          <div className="absolute bottom-0 left-0 flex h-[76px] w-[196px] items-center gap-3 rounded-tr-[20px] bg-ink pl-6 2xl:h-[88px] 2xl:w-[220px] 2xl:pl-7">
            <span className="font-mono text-[10px] tracking-[0.24em] text-dim">SCROLL</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6E6E78" strokeWidth="1.8">
              <path d="M12 5v13M6 13l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-7 flex max-w-shell flex-wrap items-center gap-4 px-1">
        {['MOTION DESIGNER', '3D ARTIST', 'AI VISUAL CREATOR', 'PHOTOGRAPHER'].map((r, i) => (
          <span key={r} className="flex items-center gap-4">
            {i > 0 && <span className="text-bone/20">·</span>}
            <span className="font-mono text-[11px] tracking-[0.2em] text-dim 2xl:text-[12px]">{r}</span>
          </span>
        ))}
        <span className="ml-auto hidden font-mono text-[11px] tracking-[0.2em] text-dim md:inline 2xl:text-[12px]">
          {site.city.toUpperCase()}
        </span>
      </div>
    </section>
  );
}
