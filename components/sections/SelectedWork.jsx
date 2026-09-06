import Link from 'next/link';
import ProjectCard from './ProjectCard';
import Reveal from '../ui/Reveal';
import { SectionLabel, Shell } from '../ui/bits';

export default function SelectedWork({ featured, index }) {
  return (
    <section id="work" className="py-24 md:py-32">
      <Shell>
        <Reveal className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel className="mb-5">01 — SELECTED WORK</SectionLabel>
            <h2 className="text-[clamp(2.6rem,6vw,4.75rem)] font-light leading-[0.94] tracking-[-0.02em]">
              Work that
              <br />
              <span className="font-semibold">moves.</span>
            </h2>
          </div>
          <p className="max-w-[320px] pb-2 text-[15px] font-light leading-relaxed text-mute">
            A selection of brand films, product visualisation, real-time and AI-driven work from the last few years.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-12">
          {featured.map((p, i) => (
            <Reveal
              key={p.slug}
              delay={(i % 2) * 90}
              className={p.size === 'narrow' ? 'md:col-span-5' : 'md:col-span-7'}
            >
              <ProjectCard project={p} tall={i < 2} />
            </Reveal>
          ))}
        </div>

        {index.length > 0 && (
          <div className="mt-24 border-t border-bone/10">
            {index.map((p) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="group flex items-center gap-4 border-b border-bone/[0.08] px-2 py-7 transition-colors hover:bg-bone/[0.02]"
              >
                <span className="w-14 font-mono text-[11px] text-faint">
                  {String(p.order).padStart(2, '0')}
                </span>
                <span className="flex-grow text-lg transition-transform duration-500 ease-swift group-hover:translate-x-2 md:text-2xl">
                  {p.title}
                </span>
                <span className="hidden w-[280px] font-mono text-[11px] tracking-[0.18em] text-mute lg:block">
                  {p.category?.toUpperCase()}
                </span>
                <span className="font-mono text-[11px] text-faint">{p.year}</span>
              </Link>
            ))}
            <div className="flex justify-center py-10">
              <Link href="/work" className="font-mono text-xs tracking-[0.2em] text-bone/70 hover:text-bone">
                VIEW ALL PROJECTS →
              </Link>
            </div>
          </div>
        )}
      </Shell>
    </section>
  );
}
