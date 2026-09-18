import Link from 'next/link';
import { notFound } from 'next/navigation';
import Compare from '../../../../components/site/Compare';
import { ContactBlock, Media, SplitHeading } from '../../../../components/site/bits';
import { getProject, getProjects, getSite, getSkills, nextOf } from '../../../../lib/content';
import { paragraphs, videoEmbed } from '../../../../lib/text';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = await getProject(params.slug);
  if (!p) return { title: 'Not found' };
  return { title: p.title, description: p.summary, openGraph: { title: p.title, description: p.summary, images: p.cover ? [p.cover] : [] } };
}

export default async function ProjectPage({ params }) {
  const [p, all, skills, site] = await Promise.all([getProject(params.slug), getProjects(), getSkills(), getSite()]);
  if (!p) notFound();
  const next = nextOf(all, p);
  const tagged = skills.filter((s) => (p.skills || []).includes(s.slug));
  const heroVideo = p.heroVideo ? videoEmbed(p.heroVideo) : null;

  return (
    <article>
      <section className="detail-hero">
        {heroVideo?.kind === 'file' ? (
          <video src={heroVideo.src} autoPlay muted loop playsInline poster={p.hero || p.cover} />
        ) : (
          <img src={p.hero || p.cover} alt={p.title} />
        )}
        <div className="shade" />
        <div className="ui">
          <div className="eyebrow mono">{p.category} · {p.year}</div>
          <SplitHeading as="h1" lines={[p.title]} />
        </div>
      </section>

      <div className="facts">
        <div><span className="mono">Client</span><span>{p.client || 'Self-initiated'}</span></div>
        <div><span className="mono">Year</span><span>{p.year}</span></div>
        <div><span className="mono">Role</span><span>{p.role || '—'}</span></div>
        <div><span className="mono">Crafts</span><span>
          {tagged.length ? tagged.map((s, i) => <span key={s.slug}>{i ? ', ' : ''}<Link href={`/skills/${s.slug}`} className="red">{s.title}</Link></span>) : '—'}
        </span></div>
      </div>

      <section className="overview">
        <div className="eyebrow mono">Overview</div>
        <div>
          <p className="big rv">{p.overview || p.summary}</p>
          {(p.tools || []).length > 0 && <ul className="chips rv">{p.tools.map((t) => <li key={t}>{t}</li>)}</ul>}
        </div>
      </section>

      {heroVideo?.kind === 'iframe' && (
        <div className="compare-wrap rv"><Media item={{ type: 'video', src: p.heroVideo, caption: p.title }} /></div>
      )}

      {(p.sections || []).length > 0 && (
        <section className="sections">
          {p.sections.map((s, i) => (
            <div key={i} className="sec-row rv">
              <h3 className="display">{s.heading}</h3>
              <div className="prose">{paragraphs(s.body).map((t, j) => <p key={j}>{t}</p>)}</div>
            </div>
          ))}
        </section>
      )}

      {p.compare?.before && p.compare?.after && (
        <div className="compare-wrap rv">
          <div className="eyebrow mono" style={{ marginBottom: 20 }}>Before / after · drag</div>
          <Compare before={p.compare.before} after={p.compare.after} labels={[p.compare.beforeLabel || 'Before', p.compare.afterLabel || 'After']} />
        </div>
      )}

      {(p.gallery || []).length > 0 && (
        <section className="gallery">
          {p.gallery.map((g, i) => (
            <figure key={i} className={`rv ${g.size === 'half' ? 'half' : ''}`}>
              <div className="media"><Media item={g} alt={`${p.title} ${i + 1}`} /></div>
              {g.caption && <figcaption className="mono">{g.caption}</figcaption>}
            </figure>
          ))}
        </section>
      )}

      {(p.credits || []).length > 0 && (
        <div className="credits">
          {p.credits.map((c, i) => <div key={i}><span className="mono">{c.role}</span><span>{c.name}</span></div>)}
        </div>
      )}

      {next && (
        <Link href={`/work/${next.slug}`} className="next" data-cursor="Next">
          <span className="mono">Next project</span>
          <h2 className="display">{next.title}</h2>
          <img src={next.cover} alt="" />
        </Link>
      )}

      <ContactBlock site={site} />
    </article>
  );
}
