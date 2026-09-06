'use client';

import { useEffect, useState } from 'react';
import { listAll, persistOrder, removeDoc, saveDoc, slugify } from '../../../lib/admin';
import { Btn, Card, Field, ImageInput, OrderControls, inputCls } from '../../../components/ui/admin-bits';

const BLANK = {
  slug: '', title: '', client: '', year: String(new Date().getFullYear()),
  category: '', role: '', services: '', cover: '', hero: '', fullBleed: '',
  size: 'wide', featured: true, lead: '', body: [], process: [], wide: [], tools: [], order: 99,
};

export default function ProjectsAdmin() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setRows(await listAll('projects'));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function move(from, to) {
    const next = [...rows];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setRows(next);
    await persistOrder('projects', next);
  }

  async function save() {
    const p = { ...editing };
    if (!p.title) return alert('A title, at least.');
    p.slug = p.slug || slugify(p.title);
    p.order = Number(p.order) || rows.length + 1;
    p.body = typeof p.body === 'string' ? p.body.split('\n\n').map((s) => s.trim()).filter(Boolean) : p.body;
    p.tools = typeof p.tools === 'string' ? p.tools.split(',').map((s) => s.trim()).filter(Boolean) : p.tools;
    setSaving(true);
    try {
      await saveDoc('projects', p.id || p.slug, p);
      setEditing(null);
      await load();
    } catch (e) {
      alert('Save failed — check the console and your Firestore rules.');
      console.error(e);
    }
    setSaving(false);
  }

  async function destroy(row) {
    if (!confirm(`Delete “${row.title}”? This cannot be undone.`)) return;
    await removeDoc('projects', row.id);
    load();
  }

  if (editing) {
    const set = (k) => (e) => setEditing({ ...editing, [k]: e.target?.value ?? e });
    return (
      <div>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-light">{editing.id ? 'Edit project' : 'New project'}</h1>
          <div className="flex gap-2">
            <Btn onClick={() => setEditing(null)}>CANCEL</Btn>
            <Btn tone="solid" onClick={save} disabled={saving}>{saving ? 'SAVING…' : 'SAVE'}</Btn>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="TITLE"><input className={inputCls} value={editing.title} onChange={set('title')} /></Field>
                <Field label="SLUG" hint="Leave blank to build it from the title.">
                  <input className={inputCls} value={editing.slug} onChange={set('slug')} placeholder={slugify(editing.title || '')} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="CLIENT"><input className={inputCls} value={editing.client} onChange={set('client')} /></Field>
                <Field label="YEAR"><input className={inputCls} value={editing.year} onChange={set('year')} /></Field>
                <Field label="CATEGORY"><input className={inputCls} value={editing.category} onChange={set('category')} placeholder="3D / CGI · Brand Film" /></Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="ROLE"><input className={inputCls} value={editing.role} onChange={set('role')} /></Field>
                <Field label="SERVICES"><input className={inputCls} value={editing.services} onChange={set('services')} /></Field>
              </div>
              <Field label="LEAD" hint="The one big sentence at the top of the case study.">
                <textarea rows={3} className={`${inputCls} resize-none`} value={editing.lead} onChange={set('lead')} />
              </Field>
              <Field label="BODY" hint="Blank line between paragraphs.">
                <textarea
                  rows={8}
                  className={`${inputCls} resize-none`}
                  value={Array.isArray(editing.body) ? editing.body.join('\n\n') : editing.body}
                  onChange={set('body')}
                />
              </Field>
              <Field label="TOOLS" hint="Comma separated.">
                <input
                  className={inputCls}
                  value={Array.isArray(editing.tools) ? editing.tools.join(', ') : editing.tools}
                  onChange={set('tools')}
                />
              </Field>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <Field label="COVER" hint="The card image on the work grid.">
                <ImageInput
                  value={editing.cover}
                  onChange={(url) => setEditing({ ...editing, cover: url })}
                  folder="projects"
                />
              </Field>
            </Card>
            <Card>
              <Field label="CASE STUDY HERO" hint="Keep the bottom third dark — the title sits there.">
                <ImageInput
                  value={editing.hero}
                  onChange={(url) => setEditing({ ...editing, hero: url })}
                  folder="projects"
                />
              </Field>
            </Card>
            <Card>
              <Field label="FULL BLEED" hint="Optional mid-page break.">
                <ImageInput
                  value={editing.fullBleed}
                  onChange={(url) => setEditing({ ...editing, fullBleed: url })}
                  folder="projects"
                />
              </Field>
            </Card>
            <Card className="space-y-4">
              <Field label="CARD WIDTH">
                <select className={inputCls} value={editing.size} onChange={set('size')}>
                  <option value="wide">Wide (7 columns)</option>
                  <option value="narrow">Narrow (5 columns)</option>
                </select>
              </Field>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="h-4 w-4 accent-violet"
                />
                <span className="text-[14px] font-light">Show as a card (otherwise it lists in the archive)</span>
              </label>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-light">Projects</h1>
          <p className="text-[14px] font-light text-mute">Order here is the order on the site.</p>
        </div>
        <Btn tone="solid" onClick={() => setEditing({ ...BLANK, order: rows.length + 1 })}>
          NEW PROJECT
        </Btn>
      </div>

      {loading && <p className="font-mono text-[11px] tracking-[0.18em] text-dim">LOADING…</p>}

      <div className="space-y-3">
        {rows.map((r, i) => (
          <Card key={r.id} className="flex flex-wrap items-center gap-5">
            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-ink2">
              {r.cover && <img src={r.cover} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-[180px] flex-grow">
              <div className="text-lg">{r.title}</div>
              <div className="font-mono text-[11px] text-faint">
                {r.category} · {r.year} {r.featured ? '' : '· archive'}
              </div>
            </div>
            <OrderControls index={i} total={rows.length} onMove={move} />
            <div className="flex gap-2">
              <Btn onClick={() => setEditing(r)}>EDIT</Btn>
              <Btn tone="danger" onClick={() => destroy(r)}>DELETE</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
