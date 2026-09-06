'use client';

import { useEffect, useRef } from 'react';

// Reads data-cursor="view|play|drag|hide" off any hovered element.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.body.classList.add('has-custom-cursor');

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    let mode = '';
    let raf;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;
      const next = el ? el.getAttribute('data-cursor') : '';
      if (next !== mode) {
        mode = next;
        const r = ring.current;
        const l = label.current;
        if (!r || !l) return;
        l.textContent = mode && mode !== 'hide' ? mode.toUpperCase() : '';
        const big = Boolean(mode) && mode !== 'hide';
        r.style.width = big ? '76px' : '32px';
        r.style.height = big ? '76px' : '32px';
        r.style.background = big ? 'rgba(237,237,232,0.94)' : 'transparent';
        r.style.borderColor = big ? 'transparent' : 'rgba(237,237,232,0.45)';
        if (dot.current) dot.current.style.opacity = big ? '0' : '1';
      }
    };

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[70] h-[6px] w-[6px] rounded-full bg-bone mix-blend-difference"
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[70] flex h-8 w-8 items-center justify-center rounded-full border border-bone/45 transition-[width,height,background-color,border-color] duration-300 ease-swift"
      >
        <span ref={label} className="font-mono text-[10px] font-medium tracking-chip text-ink" />
      </div>
    </>
  );
}
