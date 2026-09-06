import Link from 'next/link';
import Reveal from '../ui/Reveal';
import { SectionLabel, Shell } from '../ui/bits';

export default function PhotoStrip({ photos }) {
  const five = photos.slice(0, 5);
  return (
    <section className="border-t border-bone/[0.08] py-24 md:py-32">
      <Shell>
        <Reveal className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel className="mb-5">02 — FASHION &amp; PHOTOGRAPHY</SectionLabel>
            <h2 className="text-[clamp(2.6rem,6vw,4.75rem)] font-light leading-[0.94] tracking-[-0.02em]">
              Shot, directed,
              <br />
              <span className="font-semibold">then made unreal.</span>
            </h2>
          </div>
          <p className="max-w-[330px] pb-2 text-[15px] font-light leading-relaxed text-mute">
            Editorial portraits, fashion campaigns and films — lit and shot in studio, then pushed
            further in grade, CGI and AI. The same eye that builds the render sets the light.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5">
          {five.map((p, i) => (
            <Reveal key={p.id || p.src} delay={i * 70} style={{ marginTop: i % 2 ? 48 : 0 }}>
              <Link href="/photography" data-cursor="view" className="group block overflow-hidden rounded-tile">
                <div className="relative aspect-[3/4]">
                  <img
                    src={p.src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-swift group-hover:scale-105"
                  />
                  {i === 2 && (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/85" />
                      <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.2em] text-halo">
                        EDITORIAL · {p.tag?.toUpperCase()}
                      </span>
                    </>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-bone/10 pt-7 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            {['FASHION EDITORIAL', 'PORTRAITURE', 'CAMPAIGN', 'FASHION FILMS'].map((t) => (
              <span key={t} className="font-mono text-[11px] tracking-[0.18em] text-mute">{t}</span>
            ))}
          </div>
          <Link href="/photography" className="font-mono text-xs tracking-[0.16em] hover:text-halo">
            VIEW PHOTOGRAPHY →
          </Link>
        </div>
      </Shell>
    </section>
  );
}
