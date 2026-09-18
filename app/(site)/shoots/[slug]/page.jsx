import Link from 'next/link';
import { notFound } from 'next/navigation';
import Frames from '../../../../components/site/Frames';
import { ContactBlock, SplitHeading } from '../../../../components/site/bits';
import { getShoot, getShoots, getSite, nextOf } from '../../../../lib/content';
import { paragraphs } from '../../../../lib/text';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getShoots()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const s = await getShoot(params.slug);
  if (!s) return { title: 'Not found' };
  return { title: `${s.title} (shoot)`, description: s.concept, openGraph: { images: s.cover ? [s.cover] : [] } };
}

export default async function ShootPage({ params }) {
  const [s, all, site] = await Promise.all([getShoot(params.slug), getShoots(), getSite()]);
  if (!s) notFound();
  const next = nextOf(all, s);

  return (
    <article>
      <section className="detail-hero">
        <img src={s.cover} alt={s.title} />
        <div className="shade" />
        <div className="ui">
          <div className="eyebrow mono">Shoot · {(s.tags || []).join(' · ')} · {s.year}</div>
          <SplitHeading as="h1" lines={[s.title]} />
        </div>
      </section>

      <div className="facts">
        <div><span className="mono">Series</span><span>{s.frames?.length || 0} frames</span></div>
        <div><span className="mono">Year</span><span>{s.year}</span></div>
        <div><span className="mono">Studio</span><span>{s.location || 'Magizh Studio, Chennai'}</span></div>
        <div><span className="mono">Instagram</span><span>
          {s.instagram ? <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="red">View the post ↗</a> : '—'}
        </span></div>
      </div>

      <section className="overview">
        <div className="eyebrow mono">Concept</div>
        <div>
          <p className="big rv">{s.concept}</p>
          {s.notes && <div className="prose rv" style={{ marginTop: 28 }}>{paragraphs(s.notes).map((t, i) => <p key={i}>{t}</p>)}</div>}
        </div>
      </section>

      <Frames frames={s.frames || []} title={s.title} />

      {(s.credits || []).length > 0 && (
        <div className="credits">
          {s.credits.map((c, i) => <div key={i}><span className="mono">{c.role}</span><span>{c.name}</span></div>)}
        </div>
      )}

      {next && (
        <Link href={`/shoots/${next.slug}`} className="next" data-cursor="Next">
          <span className="mono">Next shoot</span>
          <h2 className="display">{next.title}</h2>
          <img src={next.cover} alt="" />
        </Link>
      )}
      <ContactBlock site={site} />
    </article>
  );
}
