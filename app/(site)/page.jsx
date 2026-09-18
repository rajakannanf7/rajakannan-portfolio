import Link from 'next/link';
import Hero from '../../components/site/Hero';
import WorkReel from '../../components/site/WorkReel';
import Process from '../../components/site/Process';
import FilmStrip from '../../components/site/FilmStrip';
import { LabGrid } from '../../components/site/Filters';
import { Accent, ContactBlock, SplitHeading, Ticker, Words } from '../../components/site/bits';
import { getFeaturedProjects, getLabs, getProjects, getShoots, getSite, getSkills } from '../../lib/content';
import { paragraphs } from '../../lib/text';

export const revalidate = 60;

export default async function Home() {
  const [site, featured, all, skills, shoots, labs] = await Promise.all([
    getSite(), getFeaturedProjects(), getProjects(), getSkills(), getShoots(), getLabs(),
  ]);
  const archive = all.filter((p) => !featured.some((f) => f.slug === p.slug)).slice(0, 4);

  return (
    <>
      <Hero site={site} />

      <section className="manifesto">
        <div className="mf-grid">
          <div className="mf-text">
            <div className="eyebrow mono">Manifesto / 01</div>
            <Words text={site.manifesto} />
            <Link href="/about" className="link-arrow mono">The story so far →</Link>
          </div>
          <figure className="mf-fig" data-develop>
            <div className="mf-frame">
              <img src={site.heroCaptured} alt="The studio photograph" loading="lazy" />
              <img className="mf-unreal" src={site.heroUnreal} alt="The same frame as a CGI render" loading="lazy" />
              <span className="mf-scan" aria-hidden="true" />
              <span className="mf-tag mono l">Captured</span>
              <span className="mf-tag mono r">Unreal</span>
            </div>
            <figcaption className="mono"><span>Fig. 02 · Same frame, two crafts</span><span>Developed <b data-dev>0%</b></span></figcaption>
          </figure>
        </div>
        <div className="mf-stats">
          <div><b><span data-count="7">7</span><i>+</i></b><span className="mono">Years</span><p>On both sides of the lens, across studios, product teams and my own practice.</p></div>
          <div><b><span data-count={skills.length}>{skills.length}</span></b><span className="mono">Crafts</span><p>Photography, motion, 3D, AI and creative tech in one pipeline.</p></div>
          <div><b><span data-count={all.length}>{all.length}</span></b><span className="mono">Case studies</span><p>Brand films, product worlds, generative films and identities.</p></div>
          <div><b><span data-count={shoots.length}>{shoots.length}</span></b><span className="mono">Concept shoots</span><p>Editorials and fashion films, lit and directed at Magizh Studio.</p></div>
        </div>
      </section>

      <section className="work" id="work">
        <div className="shead">
          <SplitHeading lines={['Selected', '*work*']} />
          <div>
            <p>Launch films, product worlds, generative studies and identities. Keep scrolling to move through the reel.</p>
            <Link href="/work" className="more mono">All projects →</Link>
          </div>
        </div>
        <WorkReel projects={featured} archive={archive} />
      </section>

      <section className="process" id="process">
        <div className="shead">
          <SplitHeading lines={['One pipeline.', '*Five crafts.*']} />
          <p>Most studios pass a project between five people. I stay with it the whole way, so nothing gets lost in the handoffs.</p>
        </div>
        <Process skills={skills} />
      </section>

      {shoots.length > 0 && (
        <section className="photo" id="shoots">
          <div className="shead">
            <SplitHeading lines={['Shot on', '*real light.*']} />
            <div>
              <p>Concept shoots, editorials and fashion film from Magizh Studio, Chennai. Each one opens as a full series.</p>
              <Link href="/shoots" className="more mono">All shoots →</Link>
            </div>
          </div>
          <FilmStrip shoots={shoots} />
          <div className="photo-foot">
            <p>Starting behind the camera changed how I light a render. Shooting the plate myself means a campaign is never limited to what a stock library has.</p>
            <span className="mono">{shoots.length} series · Magizh Studio</span>
          </div>
        </section>
      )}

      <section className="lab" id="lab">
        <div className="shead">
          <SplitHeading lines={['The', '*lab.*']} />
          <div>
            <p>Simulations, shaders, splats and procedural studies, made off the clock. What I figure out here ends up in client work.</p>
            <Link href="/lab" className="more mono">Open the lab →</Link>
          </div>
        </div>
        <LabGrid labs={labs} />
      </section>

      <section className="about" id="about">
        <div className="about-grid">
          <div className="bts">
            <div className="ph"><img src={site.aboutImage} alt="Behind the scenes at the studio" loading="lazy" /></div>
            <div className="cap mono"><span>Magizh Studio, 02:14 AM</span><span>Behind the lens</span></div>
          </div>
          <div>
            <div className="eyebrow mono">About</div>
            <h2 className="rv"><Accent text={site.aboutHeadline} /></h2>
            <div className="prose rv">{paragraphs(site.aboutBody).map((p, i) => <p key={i}>{p}</p>)}</div>
            <Link href="/about" className="link-arrow mono rv">Experience & story →</Link>
          </div>
        </div>
        <Ticker items={site.marquee} />
      </section>

      <ContactBlock site={site} />
    </>
  );
}
