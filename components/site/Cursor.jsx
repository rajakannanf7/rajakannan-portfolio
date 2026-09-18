'use client';

import { useEffect, useRef } from 'react';

// Dot + trailing ring. Any element with data-cursor="View" grows the ring and labels it.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.body.classList.add('has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf;

    const move = (e) => {
      x = e.clientX; y = e.clientY;
      dot.current.style.transform = `translate(${x - 3}px,${y - 3}px)`;
    };
    const over = (e) => {
      const t = e.target instanceof Element ? e.target : null;
      const c = t?.closest('[data-cursor]');
      const h = t?.closest('a,button,input,textarea,select,label');
      ring.current.classList.toggle('big', !!c);
      ring.current.classList.toggle('hover', !c && !!h);
      label.current.textContent = c ? c.getAttribute('data-cursor') : '';
    };
    const tick = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      const r = ring.current;
      r.style.transform = `translate(${rx - r.offsetWidth / 2}px,${ry - r.offsetHeight / 2}px)`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    raf = requestAnimationFrame(tick);
    return () => {
      removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cur" aria-hidden="true" />
      <div ref={ring} className="cur-ring" aria-hidden="true"><span ref={label} /></div>
    </>
  );
}
