import Reveal from '../ui/Reveal';
import { SectionLabel, Shell } from '../ui/bits';

const PIPELINE = ['Capture', 'Concept', 'Design', '3D', 'Animation', 'AI', 'Final composite'];

export default function Expertise({ items }) {
  return (
    <section className="border-t border-bone/[0.08] py-24 md:py-32">
      <Shell>
        <Reveal>
          <SectionLabel className="mb-5">03 — EXPERTISE</SectionLabel>
          <h2 className="mb-16 max-w-[1150px] text-[clamp(2rem,4.6vw,3.375rem)] font-light leading-[1.06] tracking-[-0.02em]">
            {PIPELINE.map((step, i) => (
              <span key={step}>
                {step}
                {i < PIPELINE.length - 1 && <span className="text-faint"> → </span>}
              </span>
            ))}
            .
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((e, i) => (
            <Reveal key={e.n} delay={i * 60} className="bg-ink px-6 pb-11 pt-9">
              <div className="mb-10 font-mono text-[11px] text-faint">({e.n})</div>
              <h3 className="mb-4 text-xl font-medium leading-tight">{e.title}</h3>
              <p className="text-sm font-light leading-relaxed text-mute">{e.body}</p>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}
