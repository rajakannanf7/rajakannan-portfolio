import { Suspense } from 'react';
import ContactForm from '../../../components/site/ContactForm';
import { Arrow, PageHead } from '../../../components/site/bits';
import { getSite } from '../../../lib/content';

export const revalidate = 60;
export const metadata = { title: 'Contact', description: 'Brand films, campaigns, CGI and shoots. Start a project with Raja Kannan.' };

export default async function ContactPage() {
  const site = await getSite();
  return (
    <>
      <PageHead eyebrow={`Now booking · ${site.availability}`} lines={['Start a', '*project.*']} intro="Tell me what you're making. I reply within two working days." />
      <section className="px" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 60, paddingBottom: 'clamp(100px,12vw,180px)' }}>
        <Suspense fallback={null}><ContactForm email={site.email} /></Suspense>
        <div className="cta-row" style={{ marginTop: 0 }}>
          <a className="ghost" href={`mailto:${site.email}`}>{site.email} <Arrow /></a>
          {site.instagram && <a className="ghost mono" href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}
          <span className="mono" style={{ color: 'var(--mute)' }}>{site.city}</span>
        </div>
      </section>
    </>
  );
}
