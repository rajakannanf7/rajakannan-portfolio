import Reveal from '../ui/Reveal';
import { FillButton, SectionLabel, Shell } from '../ui/bits';

export default function ContactCta({ site, label = '06 — CONTACT' }) {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-bone/[0.08] pb-16 pt-32 md:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-[60%] h-[460px] w-[900px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-violet/20 blur-[80px]" />
      <Shell className="relative">
        <Reveal>
          <SectionLabel className="mb-8">{label}</SectionLabel>
          <h2 className="max-w-[1120px] text-[clamp(2.4rem,7vw,5.75rem)] font-light leading-[0.98] tracking-[-0.03em]">
            Have a project in mind?
            <br />
            <span className="font-semibold">Let&apos;s create something memorable.</span>
          </h2>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <FillButton href="/contact">START A PROJECT</FillButton>
            <a href={`mailto:${site.email}`} className="text-[17px] font-light text-bone/60 hover:text-bone">
              {site.email}
            </a>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
