import Link from 'next/link';
import { ContactBlock, PageHead } from '../../../components/site/bits';
import { getSite, getSkills } from '../../../lib/content';

export const revalidate = 60;
export const metadata = { title: 'Skills', description: 'Photography, motion design, 3D/CGI, AI production and creative technology.' };

export default async function SkillsPage() {
  const [skills, site] = await Promise.all([getSkills(), getSite()]);
  return (
    <>
      <PageHead
        eyebrow={`Skills · ${skills.length} crafts`}
        lines={['One pipeline.', '*Five crafts.*']}
        intro="Each craft has its own page with what I offer, the tools I use, work made specifically to show it, and every project where it led."
      />
      <div className="skills-index">
        {skills.map((s) => (
          <Link key={s.slug} href={`/skills/${s.slug}`} className="skill-row rv" data-cursor="Explore">
            <span className="n mono">{s.n}</span>
            <h3 className="display">{s.title} <span className="it" style={{ color: 'var(--mute)', fontSize: '.7em' }}>{s.sub}</span></h3>
            <p>{s.summary}</p>
            <span className="go">→</span>
          </Link>
        ))}
      </div>
      <ContactBlock site={site} />
    </>
  );
}
