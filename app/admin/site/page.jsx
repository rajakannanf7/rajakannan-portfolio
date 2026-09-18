'use client';

import { useEffect, useState } from 'react';
import { getOne, saveDoc } from '../../../lib/admin';
import * as seed from '../../../lib/fallback';
import { siteSchema } from '../../../lib/schemas';
import { SchemaForm } from '../../../components/ui/admin-editor';
import { Btn } from '../../../components/ui/admin-bits';

export default function SiteAdmin() {
  const [value, setValue] = useState(null);
  const [original, setOriginal] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getOne('settings', 'site')
      .then((d) => { const { id, ...data } = d || {}; const v = { ...seed.site, ...data }; setValue(v); setOriginal(JSON.stringify(v)); })
      .catch((e) => setMsg(`Could not load: ${e.message}`));
  }, []);

  const dirty = value && JSON.stringify(value) !== original;
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => { e.preventDefault(); e.returnValue = ''; };
    addEventListener('beforeunload', h);
    return () => removeEventListener('beforeunload', h);
  }, [dirty]);

  async function save() {
    setSaving(true);
    try {
      await saveDoc('settings', 'site', value);
      setOriginal(JSON.stringify(value));
      setMsg('Saved. Live within a minute.');
    } catch (e) {
      setMsg(`Save failed: ${e.message}`);
    }
    setSaving(false);
  }

  if (!value) return <p className="font-mono text-[11px] tracking-[0.18em] text-dim">{msg || 'LOADING…'}</p>;
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-bone/10 bg-ink/90 px-6 py-4 backdrop-blur md:-mx-10 md:px-10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-light">Site settings</h1>
          {dirty && <span className="font-mono text-[10px] text-bone/50">UNSAVED</span>}
          {msg && !dirty && <span className="text-[12px] text-bone/60">{msg}</span>}
        </div>
        <Btn tone="solid" onClick={save} disabled={saving || !dirty}>{saving ? 'SAVING…' : 'SAVE'}</Btn>
      </div>
      <SchemaForm schema={siteSchema} value={value} onChange={setValue} folder="site" />
    </div>
  );
}
