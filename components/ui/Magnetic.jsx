'use client';

import { useEffect, useRef } from 'react';

export default function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf;
    const state = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      state.tx = (e.clientX - (r.left + r.width / 2)) * strength;
      state.ty = (e.clientY - (r.top + r.height / 2)) * strength;
    };
    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
    };
    const tick = () => {
      state.x += (state.tx - state.x) * 0.16;
      state.y += (state.ty - state.y) * 0.16;
      el.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
