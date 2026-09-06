'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { VioletButton, GhostButton } from '../ui/bits';

const ROLES = ['MOTION DESIGNER', '3D ARTIST', 'AI VISUAL CREATOR', 'PHOTOGRAPHER'];

export default function Hero({ site }) {
  const timerRef = useRef([]);
  const [reveal, setReveal] = useState({ x: 52, y: 42, phase: 'idle' });

  useEffect(() => () => timerRef.current.forEach(clearTimeout), []);

  const triggerReveal = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(4, Math.min(96, ((event.clientY - rect.top) / rect.height) * 100));

    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    setReveal({ x, y, phase: 'armed' });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setReveal({ x, y, phase: 'open' }));
    });

    timerRef.current.push(
      setTimeout(() => setReveal({ x, y, phase: 'hold' }), 950),
      setTimeout(() => setReveal({ x, y, phase: 'close' }), 1850),
      setTimeout(() => setReveal({ x, y, phase: 'idle' }), 2850),
    );
  };

  const radius = reveal.phase === 'open' || reveal.phase === 'hold' ? 170 : 0;
  const cyberOpacity = reveal.phase === 'idle' ? 0 : 1;

  return (
    <section className="relative min-h-[820px] overflow-hidden border-b border-bone/[0.08] bg-ink px-6 pb-4 pt-24 md:px-[clamp(36px,4vw,80px)] md:pt-28 xl:min-h-[calc(100svh-48px)] xl:px-[clamp(48px,4.2vw,96px)] xl:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_90%_at_76%_38%,rgba(112,82,255,0.13),transparent_58%),radial-gradient(40%_70%_at_47%_46%,rgba(84,55,180,0.06),transparent_66%)]" />

      <div className="relative mx-auto grid w-full max-w-[2200px] grid-cols-1 items-stretch gap-8 xl:grid-cols-[0.86fr_1.14fr] xl:gap-0 2xl:grid-cols-[0.82fr_1.18fr]">
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

        <button
          type="button"
          onClick={triggerReveal}
          className="group relative z-10 min-h-[650px] cursor-pointer overflow-hidden rounded-[24px] bg-[#06070a] text-left outline-none ring-0 xl:-mr-[4.2vw] xl:min-h-[calc(100svh-120px)] xl:max-h-[930px] xl:rounded-none"
          aria-label="Reveal cyber version of the character"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(103,69,190,0.10),transparent_58%)]" />

          <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
            <img
              src="/img/Normal.png"
              alt="Normal version of the portfolio character"
              draggable="false"
              className="h-full w-full select-none object-contain object-top transition-transform duration-[1600ms] ease-out group-hover:scale-[1.008]"
              style={{ transformOrigin: '50% 28%' }}
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden transition-opacity duration-300"
            style={{
              clipPath: `circle(${radius}% at ${reveal.x}% ${reveal.y}%)`,
              WebkitClipPath: `circle(${radius}% at ${reveal.x}% ${reveal.y}%)`,
              opacity: cyberOpacity,
              transition: reveal.phase === 'close'
                ? 'clip-path 900ms cubic-bezier(.76,0,.24,1), -webkit-clip-path 900ms cubic-bezier(.76,0,.24,1), opacity 500ms ease 450ms'
                : 'clip-path 950ms cubic-bezier(.16,1,.3,1), -webkit-clip-path 950ms cubic-bezier(.16,1,.3,1), opacity 180ms ease',
            }}
          >
            <img
              src="/img/Cyber.png"
              alt="Cyber version of the portfolio character"
              draggable="false"
              className="h-full w-full select-none object-contain object-top"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
            style={{
              opacity: reveal.phase === 'open' || reveal.phase === 'hold' ? 1 : 0,
              background: 'radial-gradient(circle at 55% 40%, rgba(126,82,255,.10), transparent 48%)',
              mixBlendMode: 'screen',
            }}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-ink/34 to-transparent" />

          <div className="pointer-events-none absolute left-6 top-6 z-30 flex items-center gap-3 rounded-full border border-bone/10 bg-ink/42 px-4 py-2.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid/80 shadow-[0_0_12px_rgba(164,107,240,.55)]" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/65">CLICK TO SHIFT</span>
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 z-30 flex gap-4 font-mono text-[9px] tracking-[0.2em]">
            <span className={reveal.phase === 'open' || reveal.phase === 'hold' ? 'text-bone/30' : 'text-bone/65'}>NORMAL</span>
            <span className="text-bone/20">/</span>
            <span className={reveal.phase === 'open' || reveal.phase === 'hold' ? 'text-orchid' : 'text-orchid/45'}>CYBER</span>
          </div>
        </button>
      </div>
    </section>
  );
}
