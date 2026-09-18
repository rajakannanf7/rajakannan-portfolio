import Link from 'next/link';
import { Accent, ContactBlock, PageHead, Ticker } from '../../../components/site/bits';
import { getProjects, getShoots, getSite, getSkills } from '../../../lib/content';
import { paragraphs } from '../../../lib/text';

export const revalidate = 60;
export const metadata = { title: 'About', description: 'Designer by craft, technologist by curiosity. Seven-plus years across photography, motion, 3D, AI and creative technology.' };

export default async function AboutPage() {
  const [site, skills, projects, shoots] = await Promise.all([getSite(), getSkills(), getProjects(), getShoots()]);
  return (
    <>
      <PageHead eyebrow="About" lines={['Designer by craft.', '*Technologist by curiosity.*']} />
      <section className="about" style={{ borderTop: 0, paddingTop: 0 }}>
        <div className="about-grid">
          <div className="bts">
            <div className="ph"><img src={site.aboutImage} alt="Behind the scenes at the studio" /></div>
            <div className="cap mono"><span>{site.name}</span><span>{site.city}</span></div>
          </div>
          <div>
            <h2 className="rv" style={{ marginTop: 0 }}><Accent text={site.aboutHeadline} /></h2>
            <div className="prose rv">{paragraphs(site.aboutBody).map((p, i) => <p key={i}>{p}</p>)}</div>
            <div className="stats rv">
              <div><b data-count="7">7</b><span className="mono">Years</span></div>
              <div><b data-count={projects.length}>{projects.length}</b><span className="mono">Projects</span></div>
              <div><b data-count={shoots.length}>{shoots.length}</b><span className="mono">Concept shoots</span></div>
            </div>
            <div className="eyebrow mono" style={{ marginBottom: 22 }}>Experience</div>
            <div>
              {(site.experience || []).map((e, i) => (
                <div key={i} className={`tl ${e.now ? 'now' : ''}`}>
                  <span className="y mono">{e.years}</span>
                  <div><h4>{e.role}</h4><p>{e.note}</p></div>
                  <span className="pl mono">{e.place}</span>
                </div>
              ))}
            </div>
            <div className="eyebrow mono" style={{ margin: '60px 0 22px' }}>Crafts</div>
            <ul className="chips">{skills.map((s) => <li key={s.slug}><Link href={`/skills/${s.slug}`}>{s.title} {s.sub}</Link></li>)}</ul>
          </div>
        </div>
        <Ticker items={site.marquee} />
      </section>
      <ContactBlock site={site} />
    </>
  );
}
