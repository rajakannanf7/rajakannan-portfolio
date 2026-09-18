'use client';

import { CollectionAdmin } from '../../../components/ui/admin-editor';
import { projectBlank, projectSchema } from '../../../lib/schemas';

export default function ProjectsAdmin() {
  return (
    <CollectionAdmin
      collection="projects"
      title="Projects"
      intro="Case studies. Order here is the order on the site; tick “Show in the home page reel” for the ones that lead."
      schema={projectSchema}
      blank={projectBlank}
      folder="projects"
      publicPath="/work"
      sub={(r) => [r.client, r.year, r.category].filter(Boolean).join(' · ')}
    />
  );
}
