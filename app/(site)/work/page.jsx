import { WorkIndex } from '../../../components/site/Filters';
import { ContactBlock, PageHead } from '../../../components/site/bits';
import { getProjects, getSite, getSkills } from '../../../lib/content';

export const revalidate = 60;
export const metadata = { title: 'Work', description: 'Brand films, CGI, product visualisation, AI production and photography by Raja Kannan.' };

export default async function WorkPage({ searchParams }) {
  const [projects, skills, site] = await Promise.all([getProjects(), getSkills(), getSite()]);
  const initial = skills.some((s) => s.slug === searchParams?.skill) ? searchParams.skill : 'all';
  return (
    <>
      <PageHead
        eyebrow={`Work · ${projects.length} projects`}
        lines={['All the', '*work.*']}
        intro="Brand films, product worlds, generative studies, identities and shoots. Filter by the craft that led each one."
        aside="2018 — Now"
      />
      <WorkIndex projects={projects} skills={skills} initial={initial} />
      <ContactBlock site={site} />
    </>
  );
}
