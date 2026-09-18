'use client';

import { CollectionAdmin } from '../../../components/ui/admin-editor';
import { labBlank, labSchema } from '../../../lib/schemas';

export default function LabAdmin() {
  return (
    <CollectionAdmin
      collection="labs"
      title="Lab"
      intro="Experiments and R&D tiles. The filter buttons on the site are built from the tags you use here."
      schema={labSchema}
      blank={labBlank}
      folder="lab"
      useSlug={false}
      sub={(r) => `${r.tool || ''} · ${r.tag || ''}`}
    />
  );
}
