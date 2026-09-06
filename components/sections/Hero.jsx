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

  const headX = gaze.x * -10;
  const headY = gaze.y * -6;
  const eyeX = gaze.x * 5;
  const eyeY = gaze.y * 3;

  return (
    <section
      ref={heroRef}
      className="relative min-h-[900px] overflow-hidden border-b border-bone/[0.08] bg-ink px-6 pb-10 pt-28 md:px-[clamp(48px,5vw,96px)] md:pt-32 xl:min-h-[980px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_95%_at_72%_40%,rgba(102,75,255,0.14),transparent_58%),radial-gradient(46%_70%_at_46%_42%,rgba(84,55,180,0.08),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[41%] hidden w-px bg-gradient-to-b from-transparent via-bone/[0.06] to-transparent xl:block" />

      <div className="relative mx-auto grid w-full max-w-[1920px] grid-cols-1 items-center gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:gap-0">
        <div className="relative z-20 flex min-h-[710px] flex-col justify-center pb-12 pt-8 xl:min-h-[790px] xl:pr-10">
          <div className="mb-8 flex items-center gap-5 font-mono text-[10px] tracking-[0.28em] text-dim">
            <span className="h-2 w-2 rounded-full bg-orchid shadow-[0_0_18px_rgba(164,107,240,0.8)]" />
            <span>CREATIVE TECHNOLOGIST</span>
            <span className="ml-auto hidden xl:inline">{site.city.toUpperCase()}</span>
          </div>

          <div className="max-w-[900px]">
            <h1 className="text-[clamp(5rem,9.2vw,11.5rem)] font-bold leading-[0.78] tracking-[-0.055em] text-bone">
              RAJA
            </h1>
            <h1 className="mt-2 text-[clamp(4.5rem,8.4vw,10rem)] font-extralight leading-[0.82] tracking-[-0.045em] text-bone/[0.58]">
              KANNAN
            </h1>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
            {ROLES.map((role, i) => (
              <span key={role} className="flex items-center gap-4">
                {i > 0 && <span className="text-bone/20">·</span>}
                <span className="font-mono text-[10px] tracking-[0.15em] text-bone/70 md:text-[11px]">{role}</span>
              </span>
            ))}
          </div>

          <div className="mt-8 h-px w-12 bg-gradient-to-r from-orchid to-halo" />

          <p className="mt-6 max-w-[700px] text-[clamp(2rem,2.4vw,3.4rem)] font-light leading-[1.02] tracking-[-0.025em] text-bone">
            I shoot it — then make it unreal.
          </p>
          <p className="mt-4 max-w-[660px] text-[15px] font-light leading-relaxed text-bone/58 md:text-base xl:text-lg">
            {site.blurb || 'Blending real and virtual to create striking visual experiences for brands, artists and ideas that push boundaries.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <VioletButton href="/work">SELECTED WORK</VioletButton>
            <GhostButton href="/about">ABOUT ME</GhostButton>
          </div>

          <div className="mt-8 flex max-w-[780px] flex-col gap-5 border-t border-bone/[0.08] pt-7 sm:flex-row sm:items-end">
            <Link
              href={site.showreelUrl || '/work'}
              target={site.showreelUrl ? '_blank' : undefined}
              data-cursor="play"
              className="group relative h-[150px] w-full overflow-hidden rounded-[18px] border border-bone/10 bg-bone/[0.02] sm:w-[320px]"
            >
              <img
                src="/img/showreel-thumb.jpg"
                alt="Showreel preview"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-swift group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/35 to-transparent" />
              <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-bone/65 bg-ink/20 backdrop-blur-sm">
                <span className="ml-0.5 block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-bone" />
              </span>
              <span className="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.16em] text-bone/70">SHOWREEL 2026</span>
            </Link>

            <div className="grid flex-1 grid-cols-3 gap-5 pb-1 sm:pl-2">
              {[
                ['7+', 'YEARS EXPERIENCE'],
                ['50+', 'PROJECTS WORLDWIDE'],
                ['∞', 'STORIES TO CREATE'],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="text-3xl font-light text-bone md:text-4xl">{value}</div>
                  <div className="mt-2 max-w-[100px] font-mono text-[9px] leading-relaxed tracking-[0.18em] text-dim">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex items-center gap-3 font-mono text-[9px] tracking-[0.2em] text-dim">
            <span>{site.city.toUpperCase()}</span>
            <span className="h-px w-8 bg-bone/20" />
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orchid" />
              AVAILABLE — {site.availability?.split('—')[0]?.trim().toUpperCase() || 'Q4 2026'}
            </span>
          </div>
        </div>

        <div className="relative z-10 min-h-[680px] overflow-hidden rounded-[28px] xl:-mr-[3vw] xl:min-h-[820px] xl:rounded-none">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-ink via-ink/20 to-transparent xl:from-ink/95 xl:via-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
          <div className="pointer-events-none absolute left-[4%] top-[32%] z-30 hidden xl:block">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-bone/10 bg-bone/[0.015] backdrop-blur-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-bone shadow-[0_0_20px_rgba(201,191,255,0.75)]" />
            </div>
            <p className="ml-24 mt-2 w-20 font-mono text-[9px] leading-[1.8] tracking-[0.18em] text-dim">SHE FOLLOWS YOUR CURSOR</p>
          </div>

          <div
            className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: `translate3d(${headX}px, ${headY}px, 0) scale(1.025)` }}
          >
            <img
              src="/img/hero-character.webp"
              alt="Futuristic digital character"
              className="h-full w-full object-cover object-[56%_22%] saturate-[0.92]"
            />

            <span
              className="pointer-events-none absolute left-[29.2%] top-[21.6%] h-[9px] w-[9px] rounded-full bg-orchid/90 shadow-[0_0_18px_rgba(164,107,240,0.95)] mix-blend-screen"
              style={{ transform: `translate3d(${eyeX}px, ${eyeY}px, 0)` }}
            />
            <span
              className="pointer-events-none absolute left-[40.8%] top-[21.2%] h-[9px] w-[9px] rounded-full bg-orchid/90 shadow-[0_0_18px_rgba(164,107,240,0.95)] mix-blend-screen"
              style={{ transform: `translate3d(${eyeX}px, ${eyeY}px, 0)` }}
            />
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
