'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Declarative scroll motion for every page. Markup opts in with classes/attributes:
//   .split        heading whose .ln>span lines rise in
//   .rv           fade + lift on enter
//   [data-words]  paragraph whose .w words light up as you scroll
//   [data-count]  number that counts up
//   .bts          clip-path image reveal (adds .in)
//   .ch           per-letter rise (contact headline)
//   [data-magnetic], .tilt   pointer effects (fine pointers only)
// Components with bespoke timelines (hero, reel, process, strip) own their own triggers.
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cleanups = [];
    let ctx;

    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        if (reduce) {
          gsap.set('.rv', { opacity: 1, y: 0 });
          document.querySelectorAll('.bts').forEach((el) => el.classList.add('in'));
          return;
        }
        gsap.utils.toArray('.split').forEach((h) =>
          gsap.from(h.querySelectorAll('.ln>span'), { yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 90%' } })
        );
        gsap.utils.toArray('.rv').forEach((el) =>
          gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
        );
        gsap.utils.toArray('[data-words]').forEach((p) =>
          gsap.to(p.querySelectorAll('.w'), { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: p, start: 'top 78%', end: 'bottom 42%', scrub: true } })
        );
        gsap.utils.toArray('[data-count]').forEach((el) => {
          const o = { v: 0 }, to = +el.dataset.count;
          el.textContent = '0';
          gsap.to(o, { v: to, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: () => (el.textContent = Math.round(o.v)) });
        });
        gsap.utils.toArray('.bts').forEach((el) =>
          ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => el.classList.add('in') })
        );
        gsap.utils.toArray('[data-letters]').forEach((h) =>
          gsap.from(h.querySelectorAll('.ch, .it'), { yPercent: 100, opacity: 0, duration: 1, stagger: 0.02, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } })
        );
        gsap.utils.toArray('[data-stagger]').forEach((g) =>
          gsap.from(g.children, { y: 80, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: g, start: 'top 88%' } })
        );
      });

      if (fine && !reduce) {
        document.querySelectorAll('[data-magnetic]').forEach((m) => {
          const move = (e) => {
            const r = m.getBoundingClientRect();
            m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
          };
          const leave = () => {
            m.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1),background .3s';
            m.style.transform = '';
            setTimeout(() => (m.style.transition = ''), 600);
          };
          m.addEventListener('pointermove', move);
          m.addEventListener('pointerleave', leave);
          cleanups.push(() => { m.removeEventListener('pointermove', move); m.removeEventListener('pointerleave', leave); });
        });
        document.querySelectorAll('.tilt').forEach((c) => {
          const move = (e) => {
            const r = c.getBoundingClientRect();
            const a = (e.clientX - r.left) / r.width - 0.5, b = (e.clientY - r.top) / r.height - 0.5;
            c.style.transform = `perspective(900px) rotateY(${a * 8}deg) rotateX(${-b * 8}deg)`;
          };
          const leave = () => (c.style.transform = '');
          c.addEventListener('pointermove', move);
          c.addEventListener('pointerleave', leave);
          cleanups.push(() => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); });
        });
      }
      // Pins created by page components change layout; recompute every trigger once.
      ScrollTrigger.refresh();
    });

    const onLoad = () => ScrollTrigger.refresh();
    addEventListener('load', onLoad);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('load', onLoad);
      cleanups.forEach((f) => f());
      ctx && ctx.revert();
    };
  }, [pathname]);

  return null;
}
