'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { VioletButton, GhostButton } from '../ui/bits';

const ROLES = ['MOTION DESIGNER', '3D ARTIST', 'AI VISUAL CREATOR', 'PHOTOGRAPHER'];
const SIGNALS = ['MOTION', '3D', 'AI', 'PHOTO', 'REALTIME', 'DESIGN', 'TECH'];

function HeroGame() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const frameRef = useRef(null);
  const stateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);

  const resetGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    const pad = Math.min(90, w * 0.12);
    const nodes = SIGNALS.map((label, i) => {
      const angle = (Math.PI * 2 * i) / SIGNALS.length + 0.35;
      const rx = w * (0.26 + (i % 3) * 0.035);
      const ry = h * (0.25 + ((i + 1) % 3) * 0.035);
      return {
        label,
        x: w / 2 + Math.cos(angle) * rx,
        y: h / 2 + Math.sin(angle) * ry,
        baseX: w / 2 + Math.cos(angle) * rx,
        baseY: h / 2 + Math.sin(angle) * ry,
        phase: i * 0.9,
        collected: false,
      };
    });
    stateRef.current = {
      w,
      h,
      time: 0,
      pointer: { x: w * 0.5, y: h * 0.54 },
      player: { x: w * 0.5, y: h * 0.54, vx: 0, vy: 0 },
      nodes,
      bursts: [],
      trail: [],
      stars: Array.from({ length: 88 }, (_, i) => ({
        x: (i * 97.13) % w,
        y: (i * 53.71) % h,
        r: 0.45 + ((i * 11) % 17) / 17,
        a: 0.12 + ((i * 7) % 19) / 40,
      })),
    };
    setScore(0);
    setWon(false);
    setStarted(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetGame();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    const draw = () => {
      const s = stateRef.current;
      const ctx = canvas.getContext('2d');
      if (!s || !ctx) {
        frameRef.current = requestAnimationFrame(draw);
        return;
      }

      s.time += 0.016;
      const { w, h } = s;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(w * 0.52, h * 0.46, 20, w * 0.52, h * 0.46, Math.max(w, h) * 0.72);
      bg.addColorStop(0, 'rgba(91,61,170,0.16)');
      bg.addColorStop(0.42, 'rgba(25,19,52,0.13)');
      bg.addColorStop(1, 'rgba(3,4,8,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (const star of s.stars) {
        const twinkle = 0.55 + Math.sin(s.time * 1.7 + star.x * 0.01) * 0.25;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,194,255,${star.a * twinkle})`;
        ctx.fill();
      }

      const p = s.player;
      const ease = 0.075;
      p.vx = (s.pointer.x - p.x) * ease;
      p.vy = (s.pointer.y - p.y) * ease;
      p.x += p.vx;
      p.y += p.vy;

      s.trail.push({ x: p.x, y: p.y, life: 1 });
      if (s.trail.length > 32) s.trail.shift();
      for (const t of s.trail) t.life *= 0.92;
      if (s.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(s.trail[0].x, s.trail[0].y);
        for (let i = 1; i < s.trail.length; i += 1) ctx.lineTo(s.trail[i].x, s.trail[i].y);
        const trailGradient = ctx.createLinearGradient(s.trail[0].x, s.trail[0].y, p.x, p.y);
        trailGradient.addColorStop(0, 'rgba(90,76,255,0)');
        trailGradient.addColorStop(0.55, 'rgba(103,122,255,0.18)');
        trailGradient.addColorStop(1, 'rgba(188,94,255,0.62)');
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      let liveCount = 0;
      s.nodes.forEach((node, i) => {
        if (node.collected) return;
        liveCount += 1;
        node.x = node.baseX + Math.sin(s.time * 0.72 + node.phase) * 18;
        node.y = node.baseY + Math.cos(s.time * 0.58 + node.phase * 1.3) * 15;

        const dx = p.x - node.x;
        const dy = p.y - node.y;
        const dist = Math.hypot(dx, dy);
        if (!won && dist < 31) {
          node.collected = true;
          const nextScore = SIGNALS.length - (liveCount - 1);
          setScore(nextScore);
          for (let b = 0; b < 18; b += 1) {
            const a = (Math.PI * 2 * b) / 18;
            const speed = 1.4 + (b % 5) * 0.42;
            s.bursts.push({ x: node.x, y: node.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 1 });
          }
          if (nextScore >= SIGNALS.length) setWon(true);
          return;
        }

        const pulse = 1 + Math.sin(s.time * 2.2 + i) * 0.09;
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.scale(pulse, pulse);
        ctx.beginPath();
        ctx.arc(0, 0, 19, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(161,113,255,0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(175,112,255,0.92)';
        ctx.shadowColor = 'rgba(150,92,255,0.9)';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.letterSpacing = '1px';
        ctx.fillStyle = 'rgba(226,220,255,0.62)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, 0, 36);
        ctx.restore();
      });

      s.bursts = s.bursts.filter((b) => b.life > 0.03);
      s.bursts.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.life *= 0.955;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,120,255,${b.life})`;
        ctx.fill();
      });

      if (won) {
        const pulse = 0.5 + 0.5 * Math.sin(s.time * 2.4);
        const cx = w * 0.5;
        const cy = h * 0.5;
        for (let r = 0; r < 3; r += 1) {
          ctx.beginPath();
          ctx.arc(cx, cy, 54 + r * 21 + pulse * 7, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r === 1 ? '112,205,255' : '176,104,255'},${0.28 - r * 0.055})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        const portal = ctx.createRadialGradient(cx, cy, 0, cx, cy, 54);
        portal.addColorStop(0, 'rgba(235,222,255,0.95)');
        portal.addColorStop(0.16, 'rgba(178,111,255,0.72)');
        portal.addColorStop(0.55, 'rgba(89,71,235,0.24)');
        portal.addColorStop(1, 'rgba(89,71,235,0)');
        ctx.fillStyle = portal;
        ctx.beginPath();
        ctx.arc(cx, cy, 58, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      const rot = Math.atan2(p.vy, p.vx || 0.001) + Math.PI / 2;
      ctx.rotate(rot);
      ctx.shadowColor = 'rgba(165,104,255,0.95)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.lineTo(9, 10);
      ctx.lineTo(0, 6);
      ctx.lineTo(-9, 10);
      ctx.closePath();
      const ship = ctx.createLinearGradient(-9, -10, 9, 10);
      ship.addColorStop(0, '#d9c7ff');
      ship.addColorStop(0.55, '#9d68ff');
      ship.addColorStop(1, '#65d7ff');
      ctx.fillStyle = ship;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [won]);

  const updatePointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!stateRef.current) return;
    stateRef.current.pointer.x = Math.max(18, Math.min(rect.width - 18, event.clientX - rect.left));
    stateRef.current.pointer.y = Math.max(18, Math.min(rect.height - 18, event.clientY - rect.top));
    if (!started) setStarted(true);
  };

  const clickGame = (event) => {
    if (!won) {
      updatePointer(event);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cx = rect.width * 0.5;
    const cy = rect.height * 0.5;
    if (Math.hypot(x - cx, y - cy) < 105) window.location.href = '/work';
  };

  return (
    <div
      ref={wrapRef}
      className="group relative z-10 min-h-[650px] overflow-hidden rounded-[24px] border border-bone/[0.07] bg-[#05060a] xl:-mr-[4.2vw] xl:min-h-[calc(100svh-120px)] xl:max-h-[930px] xl:rounded-none"
      onPointerMove={updatePointer}
      onPointerDown={clickGame}
      style={{ touchAction: 'none', cursor: won ? 'pointer' : 'crosshair' }}
      role="application"
      aria-label="Signal Runner mini game. Move the cursor to collect seven creative signals."
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,10,.48),transparent_23%,transparent_80%,rgba(5,6,10,.22))]" />

      <div className="pointer-events-none absolute left-6 top-6 z-20">
        <div className="font-mono text-[9px] tracking-[0.24em] text-bone/42">INTERACTIVE // 01</div>
        <div className="mt-2 text-[clamp(1.1rem,1.4vw,1.65rem)] font-light tracking-[-0.02em] text-bone">SIGNAL RUNNER</div>
        <p className="mt-2 max-w-[250px] font-mono text-[9px] leading-[1.8] tracking-[0.14em] text-bone/42">
          {won ? 'PORTAL OPEN — ENTER THE WORK' : started ? 'COLLECT ALL CREATIVE SIGNALS' : 'MOVE TO PILOT · COLLECT 07 SIGNALS'}
        </p>
      </div>

      <div className="pointer-events-none absolute right-6 top-6 z-20 text-right font-mono">
        <div className="text-[9px] tracking-[0.2em] text-bone/34">SIGNALS</div>
        <div className="mt-1 text-3xl font-light text-bone">{String(score).padStart(2, '0')}<span className="text-bone/20"> / 07</span></div>
      </div>

      <div className={`pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 translate-y-[88px] text-center transition-all duration-500 ${won ? 'opacity-100' : 'opacity-0'}`}>
        <div className="font-mono text-[10px] tracking-[0.28em] text-orchid">PORTAL OPEN</div>
        <div className="mt-2 font-mono text-[9px] tracking-[0.18em] text-bone/50">CLICK THE CORE → WORK</div>
      </div>

      <button
        type="button"
        onClick={(event) => { event.stopPropagation(); resetGame(); }}
        className="absolute bottom-6 right-6 z-30 rounded-full border border-bone/10 bg-ink/50 px-4 py-2.5 font-mono text-[9px] tracking-[0.18em] text-bone/48 backdrop-blur-md transition-colors hover:border-orchid/35 hover:text-bone"
      >
        RESET
      </button>

      <div className="pointer-events-none absolute bottom-6 left-6 z-20 flex items-center gap-3 font-mono text-[8px] tracking-[0.18em] text-bone/32">
        <span className="h-1.5 w-1.5 rounded-full bg-orchid shadow-[0_0_12px_rgba(164,107,240,.75)]" />
        MOUSE / TOUCH CONTROL
      </div>
    </div>
  );
}

export default function Hero({ site }) {
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

        <HeroGame />
      </div>
    </section>
  );
}
