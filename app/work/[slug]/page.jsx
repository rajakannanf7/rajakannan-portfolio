import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '../../../components/ui/Nav';
import Footer from '../../../components/ui/Footer';
import Reveal from '../../../components/ui/Reveal';
import { Chip, SectionLabel, Shell } from '../../../components/ui/bits';
import { getProject, getProjects, getSite } from '../../../lib/content';

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Not found' };
  return {
    title: project.title,
    description: project.lead || `${project.category} for ${project.client}`,
    openGraph: { images: project.hero ? [project.hero] : [] },
  };
}

export default async function ProjectPage({ params }) {
  const [project, all, site] = await Promise.all([
    getProject(params.slug), getProjects(), getSite(),
  ]);
  if (!project) notFound();

  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = all[(idx + 1) % all.length];

  return (
    <>
      <Nav cta="Close" ctaHref="/work" />
      <main>
        {/* hero */}
        <section className="relative h-[70vh] min-h-[520px] overflow-hidden md:h-[820px]">
          {project.hero && (
            <img src={project.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.55)_0%,rgba(8,8,10,0)_30%,rgba(8,8,10,0.4)_70%,#08080A_100%)]" />
          <div className="absolute inset-x-6 bottom-14 md:inset-x-[72px] md:bottom-[74px]">
            <div className="mb-6 font-mono text-[11px] tracking-label text-halo/80">
              PROJECT {String(idx + 1).padStart(2, '0')} — {project.category?.toUpperCase()}
            </div>
            <h1 className="text-[clamp(2.8rem,10vw,7.25rem)] font-semibold leading-[0.88] tracking-[-0.03em]">
              {project.title.toUpperCase()}
            </h1>
          </div>
        </section>

        {/* meta */}
        <div className="grid grid-cols-2 gap-px border-y border-bone/10 bg-bone/10 lg:grid-cols-4">
          {[
            ['CLIENT', project.client],
            ['YEAR', project.year],
            ['ROLE', project.role],
            ['SERVICES', project.services],
          ].map(([k, v]) => (
            <div key={k} className="bg-ink px-6 py-8 md:px-10">
              <div className="mb-3.5 font-mono text-[10px] tracking-[0.22em] text-faint">{k}</div>
              <div className="text-[17px]">{v || '—'}</div>
            </div>
          ))}
        </div>

        {/* overview */}
        <Shell className="grid grid-cols-1 gap-7 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-4">
            <SectionLabel>OVERVIEW</SectionLabel>
          </div>
          <Reveal className="md:col-span-8">
            {project.lead && (
              <p className="mb-11 text-[clamp(1.25rem,2.6vw,1.875rem)] font-light leading-[1.42] tracking-[-0.01em]">
                {project.lead}
              </p>
            )}
            <div className="grid gap-10 text-[15px] font-light leading-[1.75] text-mute md:grid-cols-2">
              {(project.body || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </Shell>

        {project.fullBleed && (
          <section className="relative h-[420px] overflow-hidden md:h-[720px]">
            <img src={project.fullBleed} alt="" className="h-full w-full object-cover" />
          </section>
        )}

        {/* visual development */}
        {(project.process?.length > 0 || project.wide?.length > 0) && (
          <Shell className="pb-10 pt-24 md:pt-32">
            <Reveal>
              <SectionLabel className="mb-5">VISUAL DEVELOPMENT</SectionLabel>
              <h2 className="mb-16 max-w-[780px] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em]">
                From styleframes to <span className="font-semibold">final render.</span>
              </h2>
            </Reveal>

            {project.process?.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {project.process.map((f, i) => (
                  <Reveal key={f.src} delay={i * 80}>
                    <div className="h-[300px] overflow-hidden rounded-tile">
                      <img src={f.src} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-4 font-mono text-[10px] tracking-[0.2em] text-dim">
                      {f.caption?.toUpperCase()}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {project.wide?.length > 0 && (
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                {project.wide.map((f, i) => (
                  <Reveal key={f.src} delay={i * 80}>
                    <div className="h-[380px] overflow-hidden rounded-tile">
                      <img src={f.src} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-4 font-mono text-[10px] tracking-[0.2em] text-dim">
                      {f.caption?.toUpperCase()}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </Shell>
        )}

        {/* tools */}
        {project.tools?.length > 0 && (
          <Shell className="py-24">
            <SectionLabel className="mb-9">TOOLS</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {project.tools.map((t) => (
                <Chip key={t}>{t.toUpperCase()}</Chip>
              ))}
            </div>
          </Shell>
        )}

        {/* next */}
        <Link
          href={`/work/${next.slug}`}
          className="group relative block h-[320px] overflow-hidden border-t border-bone/[0.08] md:h-[400px]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#121018_0%,#08080A_100%)]" />
          <div className="pointer-events-none absolute right-[120px] top-1/2 h-[240px] w-[320px] -translate-y-1/2 rounded-[50%] bg-violet/35 blur-[26px]" />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 md:left-[72px]">
            <SectionLabel className="mb-6">NEXT PROJECT</SectionLabel>
            <span className="block text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[0.94] tracking-[-0.02em] transition-transform duration-500 ease-swift group-hover:translate-x-3">
              {next.title} →
            </span>
          </div>
        </Link>
      </main>
      <Footer site={site} />
    </>
  );
}
