import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContactBlock, Media, SplitHeading } from '../../../../components/site/bits';
import { getProjects, getShoots, getSite, getSkill, getSkills, nextOf } from '../../../../lib/content';
import { pad, paragraphs } from '../../../../lib/text';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getSkills()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const s = await getSkill(params.slug);
  return s ? { title: `${s.title} ${s.sub}`, description: s.summary } : { title: 'Not found' };
}

export default async function SkillPage({ params }) {
  const [s, skills, projects, shoots, site] = await Promise.all([getSkill(params.slug), getSkills(), getProjects(), getShoots(), getSite()]);
  if (!s) notFound();
  const related = projects.filter((p) => (p.skills || []).includes(s.slug));
  const next = nextOf(skills, s);

  return (
    <article>
      <section className="detail-hero">
        <img src={s.cover} alt={s.title} />
        <div className="shade" />
        <div className="ui">
          <div className="eyebrow mono">Skill {s.n} / {pad(skills.length)}</div>
          <SplitHeading as="h1" lines={[s.title, `*${s.sub}*`]} />
        </div>
      </section>

      <section className="overview">
        <div className="eyebrow mono">The craft</div>
        <div>
          <p className="big rv">{s.summary}</p>
          <div className="prose rv" style={{ marginTop: 28 }}>{paragraphs(s.body).map((t, i) => <p key={i}>{t}</p>)}</div>
          <ul className="chips rv">{(s.tools || []).map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </section>

      {(s.offers || []).length > 0 && (
        <section className="sections">
          <div className="sec-row">
            <h3 className="display">What I <span className="it red">offer</span></h3>
            <div className="offer-list rv">{s.offers.map((o) => <div key={o}>{o}</div>)}</div>
          </div>
        </section>
      )}

      {(s.showcase || []).length > 0 && (
        <>
          <div className="shead"><SplitHeading lines={['The', '*showcase*']} /><p>Pieces made to show this craft on its own.</p></div>
          <section className="gallery">
            {s.showcase.map((g, i) => (
              <figure key={i} className={`rv ${g.size === 'full' ? '' : 'half'}`}>
                <div className="media">
                  {g.link ? <a href={g.link} target="_blank" rel="noopener noreferrer"><Media item={g} /></a> : <Media item={g} />}
                </div>
                {g.caption && <figcaption className="mono">{g.caption}</figcaption>}
              </figure>
            ))}
          </section>
        </>
      )}

      {related.length > 0 && (
        <>
          <div className="shead"><SplitHeading lines={['Projects', `*led by ${s.title.toLowerCase()}*`]} /><Link href={`/work?skill=${s.slug}`} className="more mono">Filter all work →</Link></div>
          <div className="grid-work">
            {related.map((p, i) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className={`card ${i % 4 === 0 || i % 4 === 3 ? 'wide' : 'tall'} rv`} data-cursor="View">
                <div className="frame"><img src={p.cover} alt={p.title} loading="lazy" /><span className="pill mono">{p.category}</span></div>
                <div className="meta"><h3>{p.title}</h3><span className="mono">{p.client} · {p.year}</span></div>
              </Link>
            ))}
          </div>
        </>
      )}

      {s.slug === 'capture' && shoots.length > 0 && (
        <div className="px" style={{ paddingBottom: 60 }}><Link href="/shoots" className="link-arrow mono">See all {shoots.length} concept shoots →</Link></div>
      )}

      {next && (
        <Link href={`/skills/${next.slug}`} className="next" data-cursor="Next">
          <span className="mono">Next craft</span>
          <h2 className="display">{next.title} <span className="it">{next.sub}</span></h2>
          <img src={next.cover} alt="" />
        </Link>
      )}
      <ContactBlock site={site} />
    </article>
  );
}
