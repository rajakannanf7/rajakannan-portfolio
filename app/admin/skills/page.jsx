'use client';

import { CollectionAdmin } from '../../../components/ui/admin-editor';
import { skillSchema } from '../../../lib/schemas';

export default function SkillsAdmin() {
  return (
    <CollectionAdmin
      collection="skills"
      title="Skills"
      intro="Your five crafts. Each has a page with its own showcase; projects tagged with a craft appear on it automatically."
      schema={skillSchema}
      blank={{}}
      folder="skills"
      publicPath="/skills"
      canCreate={false}
      canDelete={false}
      sub={(r) => `${r.showcase?.length || 0} showcase items · /skills/${r.slug}`}
    />
  );
}
