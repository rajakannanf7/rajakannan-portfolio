import Link from 'next/link';
import { ContactBlock, PageHead } from '../../../components/site/bits';
import { getShoots, getSite } from '../../../lib/content';

export const revalidate = 60;
export const metadata = { title: 'Shoots', description: 'Concept shoots, editorials and fashion films by Raja Kannan, shot at Magizh Studio, Chennai.' };

export default async function ShootsPage() {
  const [shoots, site] = await Promise.all([getShoots(), getSite()]);
  const frames = shoots.reduce((n, s) => n + (s.frames?.length || 0), 0);
  return (
    <>
      <PageHead
        eyebrow={`Shoots · ${shoots.length} series · ${frames} frames`}
        lines={['Concept', '*shoots.*']}
        intro="Editorials, portraits and fashion films I conceive, light, direct and grade. Most start as an idea on Instagram and end up as a full series here."
        aside="Magizh Studio, Chennai"
      />
      <div className="shoot-grid" data-stagger>
        {shoots.map((s) => (
          <Link key={s.slug} href={`/shoots/${s.slug}`} className="shoot-card" data-cursor="Open">
            <div className="frame">
              <img src={s.cover} alt={s.title} loading="lazy" />
              <span className="count mono">{s.frames?.length || 0} frames</span>
              {(s.tags || [])[0] && <span className="pill mono">{s.tags[0]}</span>}
            </div>
            <h3 className="display">{s.title}</h3>
            <p>{s.concept}</p>
          </Link>
        ))}
      </div>
      {!shoots.length && <p className="empty">Shoots are on their way.</p>}
      <ContactBlock site={site} />
    </>
  );
}
