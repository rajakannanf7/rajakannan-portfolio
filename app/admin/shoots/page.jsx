'use client';

import { CollectionAdmin } from '../../../components/ui/admin-editor';
import { shootBlank, shootSchema } from '../../../lib/schemas';

export default function ShootsAdmin() {
  return (
    <CollectionAdmin
      collection="shoots"
      title="Shoots"
      intro="Concept shoots and editorials. Each one is a series with its own page. Drop the whole set of photos in at once."
      schema={shootSchema}
      blank={shootBlank}
      folder="shoots"
      publicPath="/shoots"
      sub={(r) => `${r.frames?.length || 0} frames · ${r.year || ''} · ${(r.tags || []).join(', ')}`}
      prepare={(d) => ({ ...d, cover: d.cover || d.frames?.find((f) => f.type !== 'video')?.src || '' })}
    />
  );
}
