import Nav from '../../components/ui/Nav';
import Footer from '../../components/ui/Footer';
import ProjectCard from '../../components/sections/ProjectCard';
import Reveal from '../../components/ui/Reveal';
import ContactCta from '../../components/sections/ContactCta';
import { SectionLabel, Shell } from '../../components/ui/bits';
import { getProjects, getSite } from '../../lib/content';

export const revalidate = 60;
export const metadata = { title: 'Work' };

export default async function WorkPage() {
  const [projects, site] = await Promise.all([getProjects(), getSite()]);
  const withCover = projects.filter((p) => p.cover);
  const withoutCover = projects.filter((p) => !p.cover);

  return (
    <>
      <Nav />
      <main>
        <Shell className="pb-16 pt-40 md:pt-56">
          <Reveal>
            <SectionLabel className="mb-7">SELECTED WORK — {projects.length} PROJECTS</SectionLabel>
            <h1 className="text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.86] tracking-[-0.035em]">
              WORK
            </h1>
          </Reveal>
        </Shell>

        <Shell className="pb-24">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-12">
            {withCover.map((p, i) => (
              <Reveal
                key={p.slug}
                delay={(i % 2) * 90}
                className={p.size === 'narrow' ? 'md:col-span-5' : 'md:col-span-7'}
              >
                <ProjectCard project={p} tall={i % 4 < 2} />
              </Reveal>
            ))}
          </div>

          {withoutCover.length > 0 && (
            <div className="mt-20 border-t border-bone/10">
              <SectionLabel className="py-8">ARCHIVE</SectionLabel>
              {withoutCover.map((p) => (
                <a
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  className="group flex items-center gap-4 border-t border-bone/[0.08] px-2 py-7 transition-colors hover:bg-bone/[0.02]"
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
                </a>
              ))}
            </div>
          )}
        </Shell>

        <ContactCta site={site} label="CONTACT" />
      </main>
      <Footer site={site} />
    </>
  );
}
