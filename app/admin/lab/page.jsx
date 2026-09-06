'use client';

import { useEffect, useState } from 'react';
import { listAll, persistOrder, removeDoc, saveDoc } from '../../../lib/admin';
import { Btn, Card, Field, ImageInput, OrderControls, inputCls } from '../../../components/ui/admin-bits';

const HEIGHTS = [300, 330, 360, 420, 440];

export default function LabAdmin() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    try { setRows(await listAll('labs')); } catch (e) { console.error(e); }
  }
  useEffect(() => { load(); }, []);

  async function move(from, to) {
    const next = [...rows];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setRows(next);
    await persistOrder('labs', next);
  }

  async function save() {
    if (!editing.src) return alert('Upload an image first.');
    setSaving(true);
    try {
      await saveDoc('labs', editing.id, {
        src: editing.src,
        title: editing.title || '',
        tool: editing.tool || '',
        tag: (editing.tag || 'procedural').toLowerCase(),
        h: Number(editing.h) || 360,
        order: Number(editing.order) || rows.length + 1,
      });
      setEditing(null);
      load();
    } catch (e) {
      alert('Save failed — check your Firestore rules.');
      console.error(e);
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-light">Lab</h1>
          <p className="max-w-[560px] text-[14px] font-light leading-relaxed text-mute">
            Vary the tile heights — a Lab page where every tile is the same size reads as a second work
            grid rather than a workbench.
          </p>
        </div>
        <Btn tone="solid" onClick={() => setEditing({ src: '', title: '', tool: '', tag: 'procedural', h: 360, order: rows.length + 1 })}>
          ADD EXPERIMENT
        </Btn>
      </div>

      {editing && (
        <Card className="mb-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="IMAGE">
              <ImageInput
                value={editing.src}
                onChange={(url) => setEditing({ ...editing, src: url })}
                folder="lab"
                ratio="aspect-square"
              />
            </Field>
            <div className="space-y-5 md:col-span-2">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="TITLE">
                  <input className={inputCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </Field>
                <Field label="TOOL" hint="Houdini, C4D, GLSL, ComfyUI…">
                  <input className={inputCls} value={editing.tool} onChange={(e) => setEditing({ ...editing, tool: e.target.value })} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="FILTER TAG" hint="Lowercase. Becomes a filter chip on the Lab page.">
                  <input className={inputCls} value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} />
                </Field>
                <Field label="TILE HEIGHT">
                  <select className={inputCls} value={editing.h} onChange={(e) => setEditing({ ...editing, h: e.target.value })}>
                    {HEIGHTS.map((h) => <option key={h} value={h}>{h} px</option>)}
                  </select>
                </Field>
              </div>
              <div className="flex gap-2">
                <Btn tone="solid" onClick={save} disabled={saving}>{saving ? 'SAVING…' : 'SAVE'}</Btn>
                <Btn onClick={() => setEditing(null)}>CANCEL</Btn>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {rows.map((r, i) => (
          <Card key={r.id} className="p-4">
            <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-ink2">
              <img src={r.src} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="mb-1 truncate text-[15px]">{r.title || 'Untitled'}</div>
            <div className="mb-3 font-mono text-[10px] tracking-[0.14em] text-faint">
              {r.tool?.toUpperCase()} · {r.h}px · {r.tag}
            </div>
            <div className="flex items-center justify-between gap-2">
              <OrderControls index={i} total={rows.length} onMove={move} />
              <div className="flex gap-1.5">
                <Btn onClick={() => setEditing(r)}>EDIT</Btn>
                <Btn
                  tone="danger"
                  onClick={async () => {
                    if (!confirm('Delete this experiment?')) return;
                    await removeDoc('labs', r.id);
                    load();
                  }}
                >
                  ✕
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
