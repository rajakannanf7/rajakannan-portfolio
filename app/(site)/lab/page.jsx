import { LabGrid } from '../../../components/site/Filters';
import { ContactBlock, PageHead } from '../../../components/site/bits';
import { getLabs, getSite } from '../../../lib/content';

export const revalidate = 60;
export const metadata = { title: 'Lab', description: 'Simulations, shaders, splats and procedural studies.' };

export default async function LabPage() {
  const [labs, site] = await Promise.all([getLabs(), getSite()]);
  return (
    <>
      <PageHead
        eyebrow={`Lab · ${labs.length} experiments`}
        lines={['The', '*lab.*']}
        intro="Simulations, shaders, splats and procedural studies, made off the clock. What I figure out here ends up in client work."
      />
      <div style={{ paddingBottom: 'clamp(100px,12vw,180px)' }}><LabGrid labs={labs} /></div>
      <ContactBlock site={site} />
    </>
  );
}
