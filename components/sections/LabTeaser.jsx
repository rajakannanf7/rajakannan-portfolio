import Link from 'next/link';
import Reveal from '../ui/Reveal';
import { SectionLabel, Shell } from '../ui/bits';

export default function LabTeaser({ labs }) {
  return (
    <section className="border-t border-bone/[0.08] py-24 md:py-32">
      <Shell>
        <Reveal className="mb-13 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel className="mb-5">04 — THE LAB</SectionLabel>
            <h2 className="text-[clamp(3rem,8vw,5.25rem)] font-bold leading-[0.9] tracking-[-0.02em]">
              PLAYGROUND
            </h2>
          </div>
          <p className="max-w-[300px] pb-2.5 text-[15px] font-light leading-relaxed text-mute">
            Experiments that never made it to a client. Procedural motion, ComfyUI workflows, real-time tests.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {labs.slice(0, 4).map((l, i) => (
            <Reveal key={l.id || l.src} delay={i * 70}>
              <Link href="/lab" data-cursor="view" className="group block overflow-hidden rounded-tile">
                <div className="relative h-[230px]">
                  <img
                    src={l.src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-swift group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/70" />
                  <span className="absolute bottom-4 left-[18px] font-mono text-[10px] tracking-[0.18em] text-bone/70">
                    {l.title?.toUpperCase()}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}
