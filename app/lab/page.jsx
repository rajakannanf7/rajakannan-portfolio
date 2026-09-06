import Nav from '../../components/ui/Nav';
import Footer from '../../components/ui/Footer';
import LabGrid from './LabGrid';
import Reveal from '../../components/ui/Reveal';
import { SectionLabel, Shell } from '../../components/ui/bits';
import { getLabs, getSite } from '../../lib/content';

export const revalidate = 60;
export const metadata = {
  title: 'Lab',
  description: 'Experiments, procedural motion, generative workflows and real-time tests.',
};

export default async function LabPage() {
  const [labs, site] = await Promise.all([getLabs(), getSite()]);

  return (
    <>
      <Nav />
      <main>
        <Shell className="pb-10 pt-40 md:pt-56">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionLabel className="mb-7">EXPERIMENTS · NO CLIENTS · NO BRIEFS</SectionLabel>
              <h1 className="text-[clamp(4rem,15vw,10.5rem)] font-bold leading-[0.84] tracking-[-0.04em]">
                LAB
              </h1>
            </div>
            <p className="max-w-[380px] pb-4 text-base font-light leading-relaxed text-mute">
              Where the pipeline gets tested. Procedural motion, generative workflows, real-time
              captures and things that broke halfway through.
            </p>
          </Reveal>
        </Shell>

        <LabGrid labs={labs} />
      </main>
      <Footer site={site} />
    </>
  );
}
