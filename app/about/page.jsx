import Nav from '../../components/ui/Nav';
import Footer from '../../components/ui/Footer';
import Reveal from '../../components/ui/Reveal';
import ContactCta from '../../components/sections/ContactCta';
import { SectionLabel, Shell } from '../../components/ui/bits';
import { getSite, experience } from '../../lib/content';

export const revalidate = 60;
export const metadata = {
  title: 'About',
  description: 'Designer by craft. Technologist by curiosity. Seven-plus years across photography, motion, 3D, AI and creative technology.',
};

const TOOLBOX = [
  { k: 'CAPTURE', v: ['Studio lighting', 'Fashion direction', 'Capture One', 'Lightroom'] },
  { k: '3D', v: ['Cinema 4D', 'Redshift', 'Blender', 'Unreal Engine 5'] },
  { k: 'MOTION', v: ['After Effects', 'Premiere Pro', 'DaVinci Resolve'] },
  { k: 'AI', v: ['ComfyUI', 'Video models', 'Custom workflows'] },
  { k: 'DESIGN', v: ['Photoshop', 'Illustrator', 'Figma'] },
];

export default async function AboutPage() {
  const site = await getSite();

  return (
    <>
      <Nav />
      <main>
        <section className="relative px-6 pb-24 pt-40 md:px-[72px] md:pt-56">
          <div className="pointer-events-none absolute -right-20 top-32 h-[560px] w-[560px] rounded-full bg-[conic-gradient(from_210deg_at_44%_46%,#4E43D8,#8A62F0,#C67CE4,#66A6EE,#4E43D8)] opacity-40 blur-[2px]" />
          <Reveal className="relative mx-auto max-w-shell">
            <SectionLabel className="mb-8">ABOUT</SectionLabel>
            <h1 className="max-w-[900px] text-[clamp(2.4rem,6.5vw,4.875rem)] font-light leading-none tracking-[-0.03em]">
              Designer by craft.
              <br />
              <span className="font-semibold">Technologist by curiosity.</span>
            </h1>
          </Reveal>
        </section>

        <Shell className="grid grid-cols-1 gap-7 pb-24 md:grid-cols-12 md:pb-32">
          <Reveal className="md:col-span-5">
            <div className="relative h-[560px] overflow-hidden rounded-tile bg-gradient-to-b from-[#1A1622] to-[#0B0A11]">
              <img src="/img/about-portrait.jpg" alt="Raja Kannan" className="h-full w-full object-cover" />
              <span className="absolute bottom-5 left-6 font-mono text-[10px] tracking-[0.2em] text-faint">
                [PORTRAIT]
              </span>
            </div>
          </Reveal>
          <Reveal className="md:col-span-7 md:pl-10" delay={100}>
            <p className="mb-10 text-[clamp(1.15rem,2.2vw,1.625rem)] font-light leading-[1.5] tracking-[-0.01em]">
              I shoot it, then make it unreal. Seven-plus years working at the intersection of
              photography, motion, 3D, AI and creative technology.
            </p>
            {[
              'My work spans motion graphics, CGI, real-time 3D and AI-assisted creative workflows. I’ve built brand films and product visualisation in Cinema 4D and Redshift, virtual production setups in Unreal Engine, and generative pipelines in ComfyUI — often on the same project.',
              'I also shoot: fashion editorial, portraiture and fashion films, lit and directed in studio. Starting behind the camera changed how I light a render — and being able to shoot the plate myself means a campaign doesn’t have to stop at what a stock library can give me.',
              'What I enjoy most is owning a piece end to end: capture, concept, design, 3D, animation, AI and final composite. Alongside client work I run Magizh, a rental studio and content practice in Chennai, and build tools for my own pipeline.',
            ].map((p, i) => (
              <p key={i} className="mb-6 text-base font-light leading-[1.8] text-mute">{p}</p>
            ))}

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-bone/10 pt-10">
              {[['7+', 'YEARS EXPERIENCE'], ['[N]', 'PROJECTS DELIVERED'], ['[N]', 'BRANDS & STUDIOS']].map(([n, l]) => (
                <div key={l}>
                  <div className="text-[clamp(1.8rem,4vw,2.875rem)] font-light tracking-[-0.02em]">{n}</div>
                  <div className="mt-2.5 font-mono text-[10px] tracking-[0.2em] text-dim">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </Shell>

        <Shell className="border-t border-bone/[0.08] py-24 md:py-28">
          <SectionLabel className="mb-14">EXPERIENCE</SectionLabel>
          {experience.map((e, i) => (
            <Reveal
              key={e.role}
              delay={i * 50}
              className={`flex flex-col gap-3 border-t border-bone/[0.08] py-7 md:flex-row md:items-baseline md:gap-10 ${
                i === experience.length - 1 ? 'border-b' : ''
              }`}
            >
              <span className="w-[165px] flex-shrink-0 font-mono text-xs tracking-[0.08em] text-mute">
                {e.years}
              </span>
              <div className="flex-grow">
                <div className="mb-2 text-xl font-medium md:text-[26px]">{e.role}</div>
                <div className="max-w-[600px] text-[15px] font-light leading-relaxed text-mute">{e.note}</div>
              </div>
              <span className="flex-shrink-0 font-mono text-[11px] text-faint">{e.place.toUpperCase()}</span>
            </Reveal>
          ))}
        </Shell>

        <Shell className="pb-24">
          <SectionLabel className="mb-10">TOOLBOX</SectionLabel>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {TOOLBOX.map((t) => (
              <div key={t.k}>
                <div className="mb-5 font-mono text-[10px] tracking-[0.2em] text-faint">{t.k}</div>
                <div className="text-base font-light leading-loose text-bone/60">
                  {t.v.map((x) => (
                    <div key={x}>{x}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Shell>

        <ContactCta site={site} label="CONTACT" />
      </main>
      <Footer site={site} />
    </>
  );
}
