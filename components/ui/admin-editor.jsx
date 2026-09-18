'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listAll, persistOrder, removeDoc, saveDoc, slugify } from '../../lib/admin';
import {
  Btn, Card, ChipsField, Field, ImageField, ListField, MediaListField, OrderControls, RowsField, Thumb, inputCls,
} from './admin-bits';

// ---------------------------------------------------------------------------
// Schema-driven form. Each field: { key, label, type, hint, side, span, ... }
// types: text | textarea | number | select | checkbox | slug | image | media |
//        rows | list | chips | compare | heading
// ---------------------------------------------------------------------------
export function SchemaForm({ schema, value, onChange, folder }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const render = (f) => {
    const v = value[f.key];
    switch (f.type) {
      case 'heading':
        return <div key={f.label} className="pt-2 font-mono text-[11px] tracking-[0.2em] text-red">{f.label}</div>;
      case 'textarea':
        return <Field key={f.key} label={f.label} hint={f.hint}><textarea rows={f.rows || 5} value={v || ''} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} className={`${inputCls} resize-y`} /></Field>;
      case 'number':
        return <Field key={f.key} label={f.label} hint={f.hint}><input type="number" value={v ?? ''} onChange={(e) => set(f.key, e.target.value === '' ? '' : Number(e.target.value))} className={inputCls} /></Field>;
      case 'select':
        return (
          <Field key={f.key} label={f.label} hint={f.hint}>
            <select value={v ?? f.options[0].value} onChange={(e) => set(f.key, e.target.value)} className={inputCls}>
              {f.options.map((o) => <option key={o.value} value={o.value} className="bg-ink">{o.label}</option>)}
            </select>
          </Field>
        );
      case 'checkbox':
        return (
          <label key={f.key} className="flex cursor-pointer items-start gap-3 py-1">
            <input type="checkbox" checked={v !== undefined ? !!v : !!f.default} onChange={(e) => set(f.key, e.target.checked)} className="mt-0.5 h-4 w-4 accent-red" />
            <span><span className="text-[14px]">{f.label}</span>{f.hint && <span className="block text-[12px] font-light text-faint">{f.hint}</span>}</span>
          </label>
        );
      case 'slug':
        return (
          <Field key={f.key} label={f.label} hint={f.hint || 'The web address. Leave blank to build it from the title.'}>
            <input value={v || ''} placeholder={slugify(value[f.from || 'title'] || '')} onChange={(e) => set(f.key, slugify(e.target.value))} className={inputCls} />
          </Field>
        );
      case 'image':
        return <Field key={f.key} label={f.label} hint={f.hint}><ImageField value={v} onChange={(u) => set(f.key, u)} folder={folder} ratio={f.ratio} /></Field>;
      case 'media':
        return (
          <Field key={f.key} label={f.label} hint={f.hint}>
            <MediaListField value={v} onChange={(x) => set(f.key, x)} folder={folder} sizes={f.sizes} captions={f.captions !== false} links={f.links}
              cover={f.coverKey ? value[f.coverKey] : undefined}
              onCover={f.coverKey ? (src) => set(f.coverKey, src) : undefined} />
          </Field>
        );
      case 'rows':
        return <Field key={f.key} label={f.label} hint={f.hint}><RowsField value={v} onChange={(x) => set(f.key, x)} fields={f.fields} addLabel={f.addLabel} /></Field>;
      case 'list':
        return <Field key={f.key} label={f.label} hint={f.hint || 'Comma separated.'}><ListField value={v} onChange={(x) => set(f.key, x)} placeholder={f.placeholder} /></Field>;
      case 'chips':
        return <Field key={f.key} label={f.label} hint={f.hint}><ChipsField value={v} onChange={(x) => set(f.key, x)} options={f.options} /></Field>;
      case 'compare': {
        const c = v || {};
        const setC = (k, x) => set(f.key, { ...c, [k]: x });
        return (
          <Field key={f.key} label={f.label} hint={f.hint}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2"><ImageField value={c.before} onChange={(u) => setC('before', u)} folder={folder} ratio="aspect-video" />
                <input value={c.beforeLabel || ''} placeholder="Label, e.g. Captured" onChange={(e) => setC('beforeLabel', e.target.value)} className={`${inputCls} py-2 text-[12px]`} /></div>
              <div className="space-y-2"><ImageField value={c.after} onChange={(u) => setC('after', u)} folder={folder} ratio="aspect-video" />
                <input value={c.afterLabel || ''} placeholder="Label, e.g. Unreal" onChange={(e) => setC('afterLabel', e.target.value)} className={`${inputCls} py-2 text-[12px]`} /></div>
            </div>
          </Field>
        );
      }
      default:
        return <Field key={f.key} label={f.label} hint={f.hint}><input value={v ?? ''} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} className={inputCls} /></Field>;
    }
  };

  const groups = (side) => {
    const out = [];
    let buf = [];
    schema.filter((f) => !!f.side === side).forEach((f) => {
      if (f.type === 'heading' && buf.length) { out.push(buf); buf = []; }
      buf.push(f);
    });
    if (buf.length) out.push(buf);
    return out;
  };

  const renderGroup = (g, i) => {
    // consecutive "span" fields share a row
    const rows = [];
    g.forEach((f) => {
      const last = rows[rows.length - 1];
      if (f.span && last && last.span === f.span && last.items.length < f.span) last.items.push(f);
      else rows.push({ span: f.span, items: [f] });
    });
    return (
      <Card key={i} className="space-y-5">
        {rows.map((r, j) => (r.span ? (
          <div key={j} className={`grid gap-5 ${r.span === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>{r.items.map(render)}</div>
        ) : <div key={j}>{r.items.map(render)}</div>))}
      </Card>
    );
  };

  const hasSide = schema.some((f) => f.side);
  return (
    <div className={`grid grid-cols-1 gap-6 ${hasSide ? 'lg:grid-cols-3' : ''}`}>
      <div className={`space-y-6 ${hasSide ? 'lg:col-span-2' : ''}`}>{groups(false).map(renderGroup)}</div>
      {hasSide && <div className="space-y-6">{groups(true).map(renderGroup)}</div>}
    </div>
  );
}

// Warn before leaving with unsaved edits.
function useDirtyGuard(dirty) {
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => { e.preventDefault(); e.returnValue = ''; };
    addEventListener('beforeunload', h);
    return () => removeEventListener('beforeunload', h);
  }, [dirty]);
}

// ---------------------------------------------------------------------------
// List + editor for one Firestore collection.
// ---------------------------------------------------------------------------
export function CollectionAdmin({
  collection: col, title, intro, schema, blank, folder, publicPath, sub, useSlug = true, canCreate = true, canDelete = true, prepare,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editing, setEditing] = useState(null);
  const [original, setOriginal] = useState('');
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState('');
  const dirty = editing && JSON.stringify(editing) !== original;
  useDirtyGuard(dirty);

  async function load() {
    setLoading(true);
    try { setRows(await listAll(col)); setErr(''); } catch (e) { setErr(e.message); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (r) => { setEditing(r); setOriginal(JSON.stringify(r)); scrollTo(0, 0); };
  const close = () => { if (dirty && !confirm('Discard unsaved changes?')) return; setEditing(null); };

  async function save(publishTo) {
    let d = { ...editing };
    if (publishTo !== undefined) d.published = publishTo;
    if (!d.title?.trim()) return alert('Give it a title first.');
    if (useSlug) {
      d.slug = d.slug || slugify(d.title);
      const clash = rows.find((r) => r.slug === d.slug && r.id !== d.id);
      if (clash) return alert(`Another item already uses the address “${d.slug}”. Change the slug.`);
    }
    if (d.order === undefined || d.order === '') d.order = rows.length + 1;
    if (prepare) d = prepare(d);
    setSaving(true);
    try {
      const id = await saveDoc(col, d.id || (useSlug ? d.slug : null), d);
      d = { ...d, id };
      setEditing(d);
      setOriginal(JSON.stringify(d));
      await load();
    } catch (e) {
      alert(`Save failed: ${e.message}\n\nIf this says "permission", check the Firestore rules in the README.`);
    }
    setSaving(false);
  }

  async function destroy(r) {
    if (!confirm(`Delete “${r.title}”? This cannot be undone.`)) return;
    await removeDoc(col, r.id);
    if (editing?.id === r.id) setEditing(null);
    load();
  }

  async function reorder(from, to) {
    const next = [...rows];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setRows(next);
    await persistOrder(col, next);
    load();
  }

  const shown = useMemo(() => rows.filter((r) => !q || JSON.stringify([r.title, r.client, r.category, r.tags]).toLowerCase().includes(q.toLowerCase())), [rows, q]);

  if (editing) {
    const url = publicPath && (editing.slug || editing.id) ? `${publicPath}/${editing.slug || editing.id}` : null;
    return (
      <div>
        <div className="sticky top-0 z-20 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-bone/10 bg-ink/90 px-6 py-4 backdrop-blur md:-mx-10 md:px-10">
          <div className="flex items-center gap-3">
            <Btn tone="quiet" onClick={close}>← {title.toUpperCase()}</Btn>
            <h1 className="text-xl font-light">{editing.title || 'Untitled'}</h1>
            {'published' in (blank || {}) && (
              <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${editing.published === false ? 'bg-bone/10 text-bone/60' : 'bg-red/20 text-red'}`}>
                {editing.published === false ? 'DRAFT' : 'LIVE'}
              </span>
            )}
            {dirty && <span className="font-mono text-[10px] text-bone/50">UNSAVED</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {url && editing.id && <Link href={url} target="_blank" className="rounded-full border border-bone/15 px-4 py-2 font-mono text-[11px] tracking-[0.1em] text-bone/75 hover:border-bone/40">VIEW ↗</Link>}
            {'published' in (blank || {}) && (
              editing.published === false
                ? <Btn onClick={() => save(true)} disabled={saving}>SAVE & PUBLISH</Btn>
                : <Btn onClick={() => save(false)} disabled={saving}>UNPUBLISH</Btn>
            )}
            <Btn tone="solid" onClick={() => save()} disabled={saving || !dirty}>{saving ? 'SAVING…' : 'SAVE'}</Btn>
          </div>
        </div>
        <SchemaForm schema={schema} value={editing} onChange={setEditing} folder={folder} />
        <p className="mt-6 text-[12px] font-light text-faint">Changes appear on the public site within about a minute of saving.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-light">{title}</h1>
          {intro && <p className="max-w-[640px] text-[14px] font-light text-mute">{intro}</p>}
        </div>
        <div className="flex gap-2">
          {rows.length > 6 && <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className={`${inputCls} w-48 py-2`} />}
          {canCreate && <Btn tone="solid" onClick={() => open({ ...blank, order: rows.length + 1 })}>+ NEW</Btn>}
        </div>
      </div>
      {loading && <p className="font-mono text-[11px] tracking-[0.18em] text-dim">LOADING…</p>}
      {err && <p className="text-[13px] text-red">Could not load: {err}</p>}
      {!loading && !rows.length && !err && (
        <Card><p className="text-[14px] font-light text-mute">Nothing here yet. {canCreate ? 'Press + NEW, or seed the starter content from the Overview.' : 'Seed the starter content from the Overview.'}</p></Card>
      )}
      <div className="space-y-2.5">
        {shown.map((r, i) => (
          <Card key={r.id} className="flex flex-wrap items-center gap-4 !p-3 md:!p-4">
            <Thumb item={{ type: 'image', src: r.cover || r.src }} className="h-14 w-20 flex-shrink-0 rounded-lg" />
            <button type="button" onClick={() => open(r)} className="min-w-[180px] flex-1 text-left">
              <div className="flex items-center gap-2 text-[16px]">
                {r.title}
                {r.published === false && <span className="rounded-full bg-bone/10 px-2 py-0.5 font-mono text-[9px] text-bone/60">DRAFT</span>}
                {r.featured && <span className="rounded-full bg-red/20 px-2 py-0.5 font-mono text-[9px] text-red">HOME</span>}
              </div>
              <div className="font-mono text-[11px] text-faint">{sub ? sub(r) : r.slug}</div>
            </button>
            {!q && <OrderControls index={i} total={shown.length} onMove={reorder} />}
            <div className="flex gap-2">
              <Btn onClick={() => open(r)}>EDIT</Btn>
              {canDelete && <Btn tone="danger" onClick={() => destroy(r)}>DELETE</Btn>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
