'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { VioletButton, GhostButton } from '../ui/bits';

const ROLES = ['MOTION DESIGNER', '3D ARTIST', 'AI VISUAL CREATOR', 'PHOTOGRAPHER'];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function Hero({ site }) {
  const heroRef = useRef(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    const onPointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
      const y = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
      setGaze({ x, y });
    };

    const onPointerLeave = () => setGaze({ x: 0, y: 0 });
    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', onPointerLeave, { passive: true });

    return () => {
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  const headX = gaze.x * -12;
  const headY = gaze.y * -7;
  const eyeX = gaze.x * 7;
  const eyeY = gaze.y * 4;

  return (
    <section
      ref={heroRef}
      className="relative min-h-[820px] overflow-hidden border-b border-bone/[0.08] bg-ink px-6 pb-4 pt-24 md:px-[clamp(36px,4vw,80px)] md:pt-28 xl:min-h-[calc(100svh-48px)] xl:px-[clamp(48px,4.2vw,96px)] xl:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_90%_at_76%_38%,rgba(112,82,255,0.16),transparent_58%),radial-gradient(40%_70%_at_47%_46%,rgba(84,55,180,0.07),transparent_66%)]" />

      <div className="relative mx-auto grid w-full max-w-[2200px] grid-cols-1 items-stretch gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:gap-0 2xl:grid-cols-[0.84fr_1.16fr]">
        <div className="relative z-20 flex min-h-[700px] flex-col justify-start pb-8 pt-8 xl:min-h-[calc(100svh-155px)] xl:max-h-[900px] xl:pr-[clamp(28px,3vw,64px)] xl:pt-[clamp(42px,6vh,72px)]">
          <div className="mb-7 flex items-center gap-5 font-mono text-[10px] tracking-[0.28em] text-dim">
            <span className="h-2 w-2 rounded-full bg-orchid shadow-[0_0_18px_rgba(164,107,240,0.8)]" />
            <span>CREATIVE TECHNOLOGIST</span>
            <span className="ml-auto hidden xl:inline">{site.city.toUpperCase()}</span>
          </div>

          <div className="max-w-[940px]">
            <h1 className="text-[clamp(4.9rem,8vw,10.4rem)] font-bold leading-[0.8] tracking-[-0.055em] text-bone">RAJA</h1>
            <h1 className="mt-1 text-[clamp(4.25rem,7.2vw,9.2rem)] font-extralight leading-[0.84] tracking-[-0.045em] text-bone/[0.58]">KANNAN</h1>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            {ROLES.map((role, i) => (
              <span key={role} className="flex items-center gap-4">
                {i > 0 && <span className="text-bone/20">·</span>}
                <span className="font-mono text-[10px] tracking-[0.15em] text-bone/70 md:text-[11px]">{role}</span>
              </span>
            ))}
          </div>

          <div className="mt-7 h-px w-12 bg-gradient-to-r from-orchid to-halo" />

          <p className="mt-5 max-w-[760px] text-[clamp(2rem,2.25vw,3.25rem)] font-light leading-[1.02] tracking-[-0.025em] text-bone">I shoot it — then make it unreal.</p>
          <p className="mt-3 max-w-[700px] text-[15px] font-light leading-relaxed text-bone/58 md:text-base xl:text-[17px]">
            {site.blurb || 'Blending real and virtual to create striking visual experiences for brands, artists and ideas that push boundaries.'}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <VioletButton href="/work">SELECTED WORK</VioletButton>
            <GhostButton href="/about">ABOUT ME</GhostButton>
          </div>

          <div className="mt-auto flex max-w-[830px] flex-col gap-5 border-t border-bone/[0.08] pt-6 sm:flex-row sm:items-end">
            <Link
              href={site.showreelUrl || '/work'}
              target={site.showreelUrl ? '_blank' : undefined}
              data-cursor="play"
              className="group relative h-[132px] w-full overflow-hidden rounded-[18px] border border-bone/10 bg-bone/[0.02] sm:w-[300px] xl:h-[145px] xl:w-[330px]"
            >
              <img src="/img/showreel-thumb.jpg" alt="Showreel preview" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-swift group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" />
              <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-bone/65 bg-ink/20 backdrop-blur-sm">
                <span className="ml-0.5 block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-bone" />
              </span>
              <span className="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.16em] text-bone/70">SHOWREEL 2026</span>
            </Link>

            <div className="grid flex-1 grid-cols-3 gap-5 pb-1 sm:pl-3">
              {[
                ['7+', 'YEARS EXPERIENCE'],
                ['50+', 'PROJECTS WORLDWIDE'],
                ['∞', 'STORIES TO CREATE'],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="text-3xl font-light text-bone xl:text-[2.35rem]">{value}</div>
                  <div className="mt-2 max-w-[100px] font-mono text-[9px] leading-relaxed tracking-[0.18em] text-dim">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 font-mono text-[9px] tracking-[0.2em] text-dim">
            <span>{site.city.toUpperCase()}</span>
            <span className="h-px w-8 bg-bone/20" />
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orchid" />
              AVAILABLE — {site.availability?.split('—')[0]?.trim().toUpperCase() || 'Q4 2026'}
            </span>
          </div>
        </div>

        <div className="relative z-10 min-h-[650px] overflow-hidden rounded-[24px] bg-[#090810] xl:-mr-[4.2vw] xl:min-h-[calc(100svh-120px)] xl:max-h-[930px] xl:rounded-none">
          <img src="/img/hero-character.webp" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover object-[45%_30%] opacity-35 blur-[22px] saturate-[1.1]" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-ink via-ink/18 to-transparent xl:from-ink/90 xl:via-ink/5" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

          <div
            className="absolute bottom-0 right-[2%] z-20 h-[97%] aspect-[520/770] transition-transform duration-300 ease-out will-change-transform md:right-[8%] xl:right-[5%] 2xl:right-[7%]"
            style={{ transform: `translate3d(${headX}px, ${headY}px, 0) scale(1.01)` }}
          >
            <img src="/img/hero-character.webp" alt="Futuristic digital character" className="h-full w-full object-cover" />
            <span
              className="pointer-events-none absolute left-[18.5%] top-[25.7%] h-[7px] w-[7px] rounded-full bg-orchid/90 shadow-[0_0_16px_rgba(164,107,240,0.95)] mix-blend-screen"
              style={{ transform: `translate3d(${eyeX}px, ${eyeY}px, 0)` }}
            />
            <span
              className="pointer-events-none absolute left-[38.7%] top-[25.2%] h-[7px] w-[7px] rounded-full bg-orchid/90 shadow-[0_0_16px_rgba(164,107,240,0.95)] mix-blend-screen"
              style={{ transform: `translate3d(${eyeX}px, ${eyeY}px, 0)` }}
            />
          </div>

          <div className="pointer-events-none absolute left-[7%] top-[34%] z-30 hidden xl:block">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-bone/10 bg-bone/[0.015] backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-bone shadow-[0_0_18px_rgba(201,191,255,0.7)]" />
            </div>
            <p className="ml-20 mt-1 w-20 font-mono text-[8px] leading-[1.8] tracking-[0.18em] text-dim">SHE FOLLOWS YOUR CURSOR</p>
          </div>

          <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-6 xl:flex">
            {['HOME', 'WORK', 'PHOTO', 'LAB', 'CONTACT'].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-orchid shadow-[0_0_14px_rgba(164,107,240,0.8)]' : 'bg-bone/25'}`} />
                <span className={`font-mono text-[9px] tracking-[0.18em] ${i === 0 ? 'text-bone' : 'text-dim'}`}>{String(i + 1).padStart(2, '0')} {label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
