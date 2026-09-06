'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { patchDoc, removeDoc } from '../../../lib/admin';
import { Btn, Card } from '../../../components/ui/admin-bits';

const FILTERS = ['new', 'replied', 'archived', 'all'];

export default function EnquiriesAdmin() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('new');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'enquiries'), orderBy('createdAt', 'desc')));
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const shown = filter === 'all' ? rows : rows.filter((r) => (r.status || 'new') === filter);

  async function setStatus(row, status) {
    await patchDoc('enquiries', row.id, { status });
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r)));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-light">Enquiries</h1>
        <p className="text-[14px] font-light text-mute">
          Everything sent through the contact form. Nothing here is deleted automatically.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] transition-colors ${
              filter === f ? 'bg-bone font-medium text-ink' : 'border border-bone/15 text-bone/60 hover:border-bone/40'
            }`}
          >
            {f.toUpperCase()}
            {f !== 'all' && ` (${rows.filter((r) => (r.status || 'new') === f).length})`}
          </button>
        ))}
      </div>

      {loading && <p className="font-mono text-[11px] tracking-[0.18em] text-dim">LOADING…</p>}
      {!loading && shown.length === 0 && (
        <Card>
          <p className="text-[15px] font-light text-mute">Nothing here yet.</p>
        </Card>
      )}

      <div className="space-y-4">
        {shown.map((r) => (
          <Card key={r.id}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-1.5 flex flex-wrap items-center gap-3">
                  <span className="text-xl">{r.name}</span>
                  <span className="rounded-full border border-bone/15 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-bone/60">
                    {r.type}
                  </span>
                  {(r.status || 'new') === 'new' && (
                    <span className="rounded-full bg-orchid/20 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-halo">
                      NEW
                    </span>
                  )}
                </div>
                <div className="font-mono text-[12px] text-faint">
                  <a href={`mailto:${r.email}`} className="hover:text-bone">{r.email}</a>
                  {r.company && ` · ${r.company}`}
                  {r.budget && ` · ${r.budget}`}
                </div>
              </div>
              <div className="font-mono text-[11px] text-faint">
                {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                }) : '—'}
              </div>
            </div>

            <p className="mb-5 whitespace-pre-wrap text-[15px] font-light leading-relaxed text-bone/75">
              {r.message}
            </p>

            <div className="flex flex-wrap gap-2">
              <Btn tone="solid" onClick={() => { window.location.href = `mailto:${r.email}?subject=Re: your enquiry`; setStatus(r, 'replied'); }}>
                REPLY
              </Btn>
              {(r.status || 'new') !== 'archived' && (
                <Btn onClick={() => setStatus(r, 'archived')}>ARCHIVE</Btn>
              )}
              {(r.status || 'new') !== 'new' && (
                <Btn onClick={() => setStatus(r, 'new')}>MARK NEW</Btn>
              )}
              <Btn
                tone="danger"
                onClick={async () => {
                  if (!confirm('Delete this enquiry permanently?')) return;
                  await removeDoc('enquiries', r.id);
                  load();
                }}
              >
                DELETE
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
