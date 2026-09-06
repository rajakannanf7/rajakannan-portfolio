'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { VioletButton, GhostButton } from '../ui/bits';

const ROLES = ['MOTION DESIGNER', '3D ARTIST', 'AI VISUAL CREATOR', 'PHOTOGRAPHER'];
const LENS_SIZE = 360;

export default function Hero({ site }) {
  const portraitRef = useRef(null);
  const lensRef = useRef(null);
  const cyberRef = useRef(null);
  const fringeRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0, active: 0 });
  const currentRef = useRef({ x: 0, y: 0, active: 0 });
  const rafRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const frame = () => {
      const portrait = portraitRef.current;
      const lens = lensRef.current;
      const cyber = cyberRef.current;
      const fringe = fringeRef.current;

      if (portrait && lens && cyber && fringe) {
        const rect = portrait.getBoundingClientRect();
        const target = targetRef.current;
        const current = currentRef.current;

        if (!current.x && !current.y) {
          current.x = rect.width * 0.62;
          current.y = rect.height * 0.42;
          target.x = current.x;
          target.y = current.y;
        }

        current.x += (target.x - current.x) * 0.12;
        current.y += (target.y - current.y) * 0.12;
        current.active += (target.active - current.active) * 0.14;

        const driftX = Math.sin(Date.now() * 0.00125) * 5;
        const driftY = Math.cos(Date.now() * 0.00105) * 4;
        const x = current.x + driftX * current.active;
        const y = current.y + driftY * current.active;
        const scale = 0.72 + current.active * 0.28;

        lens.style.left = `${x}px`;
        lens.style.top = `${y}px`;
        lens.style.opacity = `${current.active}`;
        lens.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${driftX * 0.18}deg)`;

        const imageLeft = -x + LENS_SIZE / 2;
        const imageTop = -y + LENS_SIZE / 2;

        [cyber, fringe].forEach((image) => {
          image.style.width = `${rect.width}px`;
          image.style.height = `${rect.height}px`;
          image.style.left = `${imageLeft}px`;
          image.style.top = `${imageTop}px`;
        });

        fringe.style.transform = `translate(${2 + driftX * 0.08}px, ${-1 + driftY * 0.05}px) scale(1.003)`;
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const moveReveal = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    targetRef.current.x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    targetRef.current.y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    targetRef.current.active = 1;
    setActive(true);
  };

  const hideReveal = () => {
    targetRef.current.active = 0;
    setActive(false);
  };

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

        <div
          ref={portraitRef}
          className="hero-liquid relative z-10 min-h-[650px] overflow-hidden rounded-[24px] bg-[#08090d] xl:-mr-[4.2vw] xl:min-h-[calc(100svh-120px)] xl:max-h-[930px] xl:rounded-none"
          onPointerEnter={moveReveal}
          onPointerMove={moveReveal}
          onPointerLeave={hideReveal}
          onPointerDown={moveReveal}
          data-cursor="hide"
        >
          <img
            src="/img/Normal.png"
            alt="Normal version of the portfolio character"
            draggable="false"
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
          />

          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-ink/68 via-transparent to-transparent xl:from-ink/78" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-ink/36 to-transparent" />

          <div ref={lensRef} className="liquid-lens pointer-events-none absolute z-20">
            <img
              ref={cyberRef}
              src="/img/Cyber.png"
              alt=""
              aria-hidden="true"
              draggable="false"
              className="absolute max-w-none select-none object-cover object-center"
            />
            <img
              ref={fringeRef}
              src="/img/Cyber.png"
              alt=""
              aria-hidden="true"
              draggable="false"
              className="absolute max-w-none select-none object-cover object-center opacity-30 mix-blend-screen"
            />
            <div className="liquid-sheen absolute inset-0" />
            <div className="liquid-core absolute inset-[9%]" />
          </div>

          <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
            <filter id="liquidRevealDistortion" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.009 0.015" numOctaves="2" seed="7" result="noise">
                <animate attributeName="baseFrequency" dur="7s" values="0.009 0.015;0.014 0.009;0.009 0.015" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="B" />
            </filter>
          </svg>

          <div className="pointer-events-none absolute left-6 top-6 z-30 flex items-center gap-3 rounded-full border border-bone/10 bg-ink/40 px-4 py-2.5 backdrop-blur-md">
            <span className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${active ? 'bg-orchid shadow-[0_0_14px_rgba(164,107,240,.9)]' : 'bg-bone/40'}`} />
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/65">SHIFT REALITY</span>
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 z-30 flex gap-4 font-mono text-[9px] tracking-[0.2em]">
            <span className="text-bone/55">NORMAL</span>
            <span className="text-bone/20">/</span>
            <span className="text-orchid">CYBER</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .liquid-lens {
          width: ${LENS_SIZE}px;
          height: ${LENS_SIZE}px;
          overflow: hidden;
          opacity: 0;
          border: 1px solid rgba(180, 126, 255, 0.34);
          border-radius: 43% 57% 61% 39% / 48% 38% 62% 52%;
          filter: url(#liquidRevealDistortion) drop-shadow(0 0 22px rgba(129, 82, 255, 0.28)) drop-shadow(0 0 58px rgba(83, 191, 255, 0.12));
          will-change: transform, left, top, opacity, border-radius;
          animation: liquidMorph 7s ease-in-out infinite alternate;
          background: rgba(92, 58, 164, 0.08);
        }

        .liquid-lens::before,
        .liquid-lens::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }

        .liquid-lens::before {
          border-radius: inherit;
          box-shadow:
            inset 16px 12px 30px rgba(255,255,255,0.08),
            inset -18px -14px 36px rgba(88, 44, 185, 0.16),
            inset 0 0 0 1px rgba(209, 187, 255, 0.15);
        }

        .liquid-lens::after {
          inset: 5%;
          border-radius: 58% 42% 48% 52% / 42% 58% 44% 56%;
          border: 1px solid rgba(144, 219, 255, 0.12);
          box-shadow: 0 0 28px rgba(127, 80, 255, 0.18);
          animation: innerMorph 5.5s ease-in-out infinite alternate-reverse;
        }

        .liquid-sheen {
          z-index: 4;
          border-radius: inherit;
          background:
            radial-gradient(circle at 28% 24%, rgba(255,255,255,0.17), transparent 20%),
            linear-gradient(130deg, rgba(255,255,255,0.06), transparent 34%, rgba(141,76,255,0.08) 58%, transparent 74%);
          mix-blend-mode: screen;
        }

        .liquid-core {
          z-index: 5;
          border-radius: 48% 52% 42% 58% / 54% 46% 58% 42%;
          box-shadow: inset 0 0 38px rgba(0,0,0,0.08);
          animation: innerMorph 6.2s ease-in-out infinite alternate;
        }

        @keyframes liquidMorph {
          0% { border-radius: 43% 57% 61% 39% / 48% 38% 62% 52%; }
          30% { border-radius: 58% 42% 45% 55% / 38% 61% 39% 62%; }
          62% { border-radius: 47% 53% 36% 64% / 61% 43% 57% 39%; }
          100% { border-radius: 61% 39% 54% 46% / 44% 57% 43% 56%; }
        }

        @keyframes innerMorph {
          from { border-radius: 42% 58% 51% 49% / 57% 43% 61% 39%; transform: rotate(-3deg) scale(0.98); }
          to { border-radius: 61% 39% 43% 57% / 38% 62% 46% 54%; transform: rotate(4deg) scale(1.02); }
        }

        @media (max-width: 1279px) {
          .liquid-lens {
            width: 280px;
            height: 280px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .liquid-lens,
          .liquid-lens::after,
          .liquid-core {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
