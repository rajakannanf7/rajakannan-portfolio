import Nav from '../../components/ui/Nav';
import Footer from '../../components/ui/Footer';
import Reveal from '../../components/ui/Reveal';
import Gallery from './Gallery';
import { Chip, FillButton, SectionLabel, Shell } from '../../components/ui/bits';
import { getPhotos, getSite } from '../../lib/content';

export const revalidate = 60;
export const metadata = {
  title: 'Photography',
  description: 'Editorial portraits, fashion campaigns and fashion films — shot and directed in Chennai.',
};

export default async function PhotographyPage() {
  const [photos, site] = await Promise.all([getPhotos(), getSite()]);

  return (
    <>
      <Nav cta="Book a shoot" ctaHref="/contact?type=shoot" />
      <main>
        <Shell className="pb-14 pt-40 md:pt-56">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionLabel className="mb-7">EDITORIAL · PORTRAIT · CAMPAIGN · FASHION FILM</SectionLabel>
              <h1 className="text-[clamp(2.8rem,9vw,8rem)] font-semibold leading-[0.86] tracking-[-0.035em]">
                PHOTOGRAPHY
              </h1>
            </div>
            <p className="max-w-[340px] pb-4 text-base font-light leading-relaxed text-mute">
              Shot and directed in Chennai. Studio lighting, styling direction and grade handled
              in-house — with the option to take a frame all the way into CGI.
            </p>
          </Reveal>
        </Shell>

        <Gallery photos={photos} />

        {/* fashion film */}
        <section className="relative overflow-hidden border-t border-bone/[0.08] py-24 md:py-28">
          <div className="pointer-events-none absolute -right-16 top-[40%] h-[380px] w-[520px] rounded-[50%] bg-violet/20 blur-[60px]" />
          <Shell className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-tile" data-cursor="play">
                <img src={photos[0]?.src} alt="" className="h-full w-full object-cover saturate-90" />
                <span className="absolute inset-0 bg-[linear-gradient(160deg,rgba(90,74,230,0.22),rgba(8,8,10,0.15)_50%,rgba(8,8,10,0.5))]" />
                <span className="absolute left-1/2 top-1/2 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/75 font-mono text-[10px] tracking-[0.18em]">
                  PLAY
                </span>
              </div>
            </Reveal>
            <Reveal className="md:col-span-7 md:pl-12">
              <SectionLabel className="mb-6">FASHION FILM</SectionLabel>
              <h2 className="mb-8 text-[clamp(2rem,5vw,3.75rem)] font-light leading-none tracking-[-0.025em]">
                Where the shoot
                <br />
                <span className="font-semibold">becomes the render.</span>
              </h2>
              <p className="mb-10 max-w-[560px] text-base font-light leading-[1.8] text-mute">
                The plates are shot in studio, then extended in Cinema 4D and ComfyUI — sets that were
                never built, garments that could not exist, light that never fell that way. One person
                across the whole chain, so nothing is lost in the handover.
              </p>
              <div className="flex flex-wrap gap-3">
                {['DIRECTION', 'LIGHTING', 'GRADE', 'CGI EXTENSION'].map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </Reveal>
          </Shell>
        </section>

        {/* booking */}
        <Shell className="border-t border-bone/[0.08] py-24">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h2 className="text-[clamp(2rem,5vw,3.625rem)] font-light leading-[1.02] tracking-[-0.02em]">
              Shooting in Chennai.
              <br />
              <span className="font-semibold">Travelling on request.</span>
            </h2>
            <FillButton href="/contact?type=shoot">BOOK A SHOOT</FillButton>
          </Reveal>
          <div className="mt-16 flex flex-col gap-3 border-t border-bone/[0.08] pt-7 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[11px] tracking-[0.14em] text-faint">
              MAGIZH RENTAL STUDIO — NERKUNDRAM, CHENNAI
            </span>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="font-mono text-[11px] tracking-[0.14em] text-mute hover:text-bone">
              @RAJAKANNAN_RK
            </a>
          </div>
        </Shell>
      </main>
      <Footer site={site} />
    </>
  );
}
