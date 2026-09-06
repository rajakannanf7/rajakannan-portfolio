import Reveal from '../ui/Reveal';
import { SectionLabel, Shell } from '../ui/bits';

export default function Clients({ names }) {
  return (
    <section className="border-t border-bone/[0.08] py-20">
      <Shell>
        <SectionLabel className="mb-11">05 — SELECTED CLIENTS &amp; COLLABORATIONS</SectionLabel>
        <div className="grid grid-cols-2 gap-x-10 gap-y-6 text-lg font-light text-bone/40 sm:grid-cols-3 md:grid-cols-6">
          {names.map((c, i) => (
            <Reveal key={`${c}-${i}`} delay={i * 30} className="transition-colors hover:text-bone/80">
              {c}
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}
