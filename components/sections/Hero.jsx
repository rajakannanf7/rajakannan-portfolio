'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { VioletButton, GhostButton } from '../ui/bits';

const ROLES = ['MOTION DESIGNER', '3D ARTIST', 'AI VISUAL CREATOR', 'PHOTOGRAPHER'];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Hero({ site }) {
  const overlayRef = useRef(null);
  const cursorRef = useRef(null);
  const animationRef = useRef(null);
  const timersRef = useRef([]);
  const currentRadiusRef = useRef(0);
  const originRef = useRef({ x: 52, y: 42 });
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const paintMask = (x, y, radius) => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (radius <= 1) {
      overlay.style.opacity = '0';
      overlay.style.webkitMaskImage = 'radial-gradient(circle at 50% 50%, transparent 0, transparent 1px)';
      overlay.style.maskImage = 'radial-gradient(circle at 50% 50%, transparent 0, transparent 1px)';
      return;
    }

    const feather = Math.min(120, Math.max(56, radius * 0.18));
    const solid = Math.max(0, radius - feather);
    const mid1 = Math.max(0, radius - feather * 0.72);
    const mid2 = Math.max(0, radius - feather * 0.38);
    const edge = radius + feather * 0.18;

    const gradient = `radial-gradient(circle at ${x}% ${y}%, #000 0px, #000 ${solid}px, rgba(0,0,0,.92) ${mid1}px, rgba(0,0,0,.58) ${mid2}px, rgba(0,0,0,.18) ${radius}px, transparent ${edge}px)`;

    overlay.style.opacity = '1';
    overlay.style.webkitMaskImage = gradient;
    overlay.style.maskImage = gradient;
  };

  const animateRadius = (from, to, duration, easing, onDone) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const started = performance.now();

    const frame = (now) => {
      const p = Math.min(1, (now - started) / duration);
      const eased = easing(p);
      const radius = from + (to - from) * eased;
      currentRadiusRef.current = radius;
      paintMask(originRef.current.x, originRef.current.y, radius);

      if (p < 1) {
        animationRef.current = requestAnimationFrame(frame);
      } else {
        animationRef.current = null;
        onDone?.();
      }
    };

    animationRef.current = requestAnimationFrame(frame);
  };

  const triggerReveal = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const localY = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    const x = (localX / rect.width) * 100;
    const y = (localY / rect.height) * 100;
    const farX = Math.max(localX, rect.width - localX);
    const farY = Math.max(localY, rect.height - localY);
    const maxRadius = Math.hypot(farX, farY) + 180;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    originRef.current = { x, y };
    setPhase('opening');

    const startRadius = Math.max(8, currentRadiusRef.current);
    animateRadius(startRadius, maxRadius, 1850, easeOutCubic, () => {
      setPhase('hold');
      timersRef.current.push(
        setTimeout(() => {
          setPhase('closing');
          animateRadius(currentRadiusRef.current, 0, 1550, easeInOutCubic, () => {
            currentRadiusRef.current = 0;
            paintMask(x, y, 0);
            setPhase('idle');
          });
        }, 1250),
      );
    });
  };

  const moveHoverCursor = (event) => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cursor.style.opacity = '1';
    cursor.style.transform = `translate3d(${x + 16}px, ${y + 16}px, 0)`;
  };

  const hideHoverCursor = () => {
    if (cursorRef.current) cursorRef.current.style.opacity = '0';
  };

  const cyberActive = phase === 'opening' || phase === 'hold';

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
          onPointerEnter={moveHoverCursor}
          onPointerMove={moveHoverCursor}
          onPointerLeave={hideHoverCursor}
          className="group relative z-10 min-h-[650px] overflow-hidden rounded-[24px] bg-[#06070a] text-left outline-none ring-0 xl:-mr-[4.2vw] xl:min-h-[calc(100svh-120px)] xl:max-h-[930px] xl:rounded-none"
          style={{ cursor: 'pointer' }}
          aria-label="Reveal cyber version of the character"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(103,69,190,0.10),transparent_58%)]" />

          <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
            <img
              src="/img/Normal.png"
              alt="Normal version of the portfolio character"
              draggable="false"
              className="h-full w-full select-none object-contain object-top transition-transform duration-[1800ms] ease-out group-hover:scale-[1.006]"
              style={{ transformOrigin: '50% 26%' }}
            />
          </div>

          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden opacity-0 will-change-[mask-image,opacity]"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 0, transparent 1px)',
              maskImage: 'radial-gradient(circle at 50% 50%, transparent 0, transparent 1px)',
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
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: cyberActive ? 1 : 0,
              background: 'radial-gradient(circle at 55% 40%, rgba(126,82,255,.09), transparent 52%)',
              mixBlendMode: 'screen',
            }}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-ink/34 to-transparent" />

          <div className="pointer-events-none absolute left-6 top-6 z-30 flex items-center gap-3 rounded-full border border-bone/10 bg-ink/42 px-4 py-2.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid/80 shadow-[0_0_12px_rgba(164,107,240,.55)]" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-bone/65">CLICK TO SHIFT</span>
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 z-30 flex gap-4 font-mono text-[9px] tracking-[0.2em]">
            <span className={cyberActive ? 'text-bone/30' : 'text-bone/65'}>NORMAL</span>
            <span className="text-bone/20">/</span>
            <span className={cyberActive ? 'text-orchid' : 'text-orchid/45'}>CYBER</span>
          </div>

          <div
            ref={cursorRef}
            className="pointer-events-none absolute left-0 top-0 z-40 flex items-center gap-2 opacity-0 transition-opacity duration-150"
            aria-hidden="true"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-bone/75" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-bone/75" />
            </span>
            <span className="rounded-full border border-bone/15 bg-ink/70 px-2.5 py-1.5 font-mono text-[8px] tracking-[0.18em] text-bone/75 backdrop-blur-md">
              {phase === 'idle' ? 'SHIFT' : phase === 'closing' ? 'RESETTING' : 'SHIFTING'}
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
