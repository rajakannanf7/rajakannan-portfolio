'use client';

import { useEffect, useState } from 'react';
import { listAll, persistOrder, removeDoc, saveDoc } from '../../../lib/admin';
import { Btn, Card, Field, ImageInput, OrderControls, inputCls } from '../../../components/ui/admin-bits';

const TAGS = ['Editorial', 'Portrait', 'Campaign', 'Fashion Film'];

export default function PhotosAdmin() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    try { setRows(await listAll('photos')); } catch (e) { console.error(e); }
  }
  useEffect(() => { load(); }, []);

  async function move(from, to) {
    const next = [...rows];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setRows(next);
    await persistOrder('photos', next);
  }

  async function save() {
    if (!editing.src) return alert('Upload an image first.');
    setSaving(true);
    try {
      await saveDoc('photos', editing.id, {
        src: editing.src,
        title: editing.title || '',
        tag: editing.tag || 'Editorial',
        offset: Number(editing.offset) || 0,
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
          <h1 className="mb-1 text-3xl font-light">Photography</h1>
          <p className="max-w-[540px] text-[14px] font-light leading-relaxed text-mute">
            Export at 1200 × 1600 (3:4) before uploading. The stagger offset pushes a tile down so the
            grid does not sit in flat rows.
          </p>
        </div>
        <Btn tone="solid" onClick={() => setEditing({ src: '', title: '', tag: 'Editorial', offset: 0, order: rows.length + 1 })}>
          ADD PHOTO
        </Btn>
      </div>

      {editing && (
        <Card className="mb-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <Field label="IMAGE">
                <ImageInput
                  value={editing.src}
                  onChange={(url) => setEditing({ ...editing, src: url })}
                  folder="photos"
                  ratio="aspect-[3/4]"
                />
              </Field>
            </div>
            <div className="space-y-5 md:col-span-2">
              <Field label="TITLE">
                <input className={inputCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </Field>
              <Field label="TAG">
                <select className={inputCls} value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })}>
                  {TAGS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="STAGGER OFFSET" hint="Pixels down. 0, 20, 40 or 64 keeps the rhythm consistent.">
                <input type="number" className={inputCls} value={editing.offset} onChange={(e) => setEditing({ ...editing, offset: e.target.value })} />
              </Field>
              <div className="flex gap-2">
                <Btn tone="solid" onClick={save} disabled={saving}>{saving ? 'SAVING…' : 'SAVE'}</Btn>
                <Btn onClick={() => setEditing(null)}>CANCEL</Btn>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {rows.map((r, i) => (
          <Card key={r.id} className="p-4">
            <div className="mb-3 aspect-[3/4] overflow-hidden rounded-lg bg-ink2">
              <img src={r.src} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="mb-1 truncate text-[15px]">{r.title || 'Untitled'}</div>
            <div className="mb-3 font-mono text-[10px] tracking-[0.14em] text-faint">{r.tag?.toUpperCase()}</div>
            <div className="flex items-center justify-between gap-2">
              <OrderControls index={i} total={rows.length} onMove={move} />
              <div className="flex gap-1.5">
                <Btn onClick={() => setEditing(r)}>EDIT</Btn>
                <Btn
                  tone="danger"
                  onClick={async () => {
                    if (!confirm('Delete this photo?')) return;
                    await removeDoc('photos', r.id);
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
