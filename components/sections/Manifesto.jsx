import Link from 'next/link';
import Reveal from '../ui/Reveal';
import { Arrow } from '../ui/bits';

export default function Manifesto({ site }) {
  return (
    <section className="relative h-[760px] overflow-hidden">
      <img src="/img/manifesto-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#08080A_0%,rgba(8,8,10,0.25)_20%,rgba(8,8,10,0.4)_62%,#08080A_100%)]" />

      <Reveal className="absolute left-1/2 top-[42%] w-[90%] max-w-[940px] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="mb-7 font-mono text-[11px] tracking-[0.3em] text-halo/70">
          MADE IN CHENNAI · SHIPPED EVERYWHERE
        </div>
        <h2 className="text-[clamp(2.6rem,8vw,5.5rem)] font-bold leading-[0.9] tracking-[-0.035em]">
          <span className="line-mask"><span>BUILT FOR</span></span>
          <span className="line-mask"><span>THE FRAME</span></span>
        </h2>
        <p className="mx-auto mt-8 max-w-[620px] text-[15px] font-light leading-[1.85] text-bone/60">
          Every project starts the same way — a light, a lens, a first frame. What follows is whatever
          the idea needs: a camera, a render farm, a diffusion model, or all three at once. The tools
          keep changing. The frame is the point.
        </p>
      </Reveal>

      <div className="absolute bottom-16 left-6 hidden w-[250px] rounded-2xl border border-bone/10 bg-ink/60 p-6 backdrop-blur-sm md:left-[72px] md:block">
        <div className="mb-3 font-mono text-[9px] tracking-[0.24em] text-halo/70">NOW BOOKING</div>
        <p className="text-[15px] font-light leading-snug text-bone/75">{site.availability}</p>
      </div>

      <div className="absolute bottom-16 right-6 hidden w-[320px] rounded-[18px] border border-bone/10 bg-ink/65 p-6 backdrop-blur-sm md:right-[72px] md:block">
        <div className="flex items-center gap-5">
          <div className="relative h-[74px] w-[74px] flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 220deg, #7C5CFF 0deg, #C77BE8 150deg, rgba(237,237,232,0.08) 210deg, rgba(237,237,232,0.08) 360deg)',
                WebkitMaskImage: 'radial-gradient(closest-side, transparent 74%, black 76%)',
                maskImage: 'radial-gradient(closest-side, transparent 74%, black 76%)',
              }}
            />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-halo to-[#4B3F8F] shadow-[inset_-4px_-6px_12px_rgba(0,0,0,0.5)]" />
          </div>
          <div>
            <p className="mb-3 text-[15px] font-light leading-snug text-bone/75">
              Concept to final composite, handled by one person.
            </p>
            <Link href="/contact" className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.16em] hover:text-halo">
              START A PROJECT
              <Arrow size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
