'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db, firebaseReady } from '../../lib/firebase';
import { DEMO, countDocs, listAll } from '../../lib/admin';
import * as seed from '../../lib/fallback';
import { Btn, Card } from '../../components/ui/admin-bits';

const COLS = [
  { key: 'projects', label: 'Projects', href: '/admin/projects', seed: seed.projects, id: (x) => x.slug },
  { key: 'shoots', label: 'Shoots', href: '/admin/shoots', seed: seed.shoots, id: (x) => x.slug },
  { key: 'skills', label: 'Skills', href: '/admin/skills', seed: seed.skills, id: (x) => x.slug },
  { key: 'labs', label: 'Lab tiles', href: '/admin/lab', seed: seed.labs, id: (x) => x.id },
];

export default function AdminHome() {
  const [counts, setCounts] = useState(null);
  const [state, setState] = useState('');

  async function load() {
    if (!DEMO && (!firebaseReady || !db)) return;
    const out = {};
    for (const c of [...COLS.map((c) => c.key), 'enquiries']) {
      try { out[c] = await countDocs(c); } catch { out[c] = 0; }
    }
    try {
      out.newEnquiries = DEMO ? (await listAll('enquiries')).filter((e) => e.status === 'new').length
        : (await getDocs(query(collection(db, 'enquiries'), where('status', '==', 'new')))).size;
    } catch { out.newEnquiries = 0; }
    setCounts(out);
  }
  useEffect(() => { load(); }, []);

  // Seeds only the collections that are empty, so it never overwrites real content.
  async function seedEmpty() {
    const empty = COLS.filter((c) => !counts?.[c.key]);
    if (!confirm(`Copy the starter content into: ${empty.map((c) => c.label).join(', ') || 'nothing'}${counts?.settings ? '' : ' + site settings'}? Collections that already have content are left alone.`)) return;
    setState('working');
    try {
      const batch = writeBatch(db);
      empty.forEach((c) => c.seed.forEach((x) => { const { id, ...data } = x; batch.set(doc(db, c.key, c.id(x)), data); }));
      batch.set(doc(db, 'settings', 'site'), seed.site, { merge: true });
      await batch.commit();
      setState('done');
      load();
    } catch (e) {
      console.error(e);
      setState(`error: ${e.message}`);
    }
  }

  const anyEmpty = counts && COLS.some((c) => !counts[c.key]);

  return (
    <div>
      <h1 className="mb-2 text-3xl font-light">Overview</h1>
      <p className="mb-10 max-w-[640px] text-[15px] font-light leading-relaxed text-mute">
        Everything on the public site is edited here. Changes go live within about a minute. Collections
        that are still empty show the starter content from the repo, so the site never looks broken.
      </p>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[...COLS, { key: 'enquiries', label: 'Enquiries', href: '/admin/enquiries' }].map((t) => (
          <Link key={t.key} href={t.href}>
            <Card className="transition-colors hover:border-red/50">
              <div className="mb-6 font-mono text-[10px] tracking-[0.18em] text-faint">{t.label.toUpperCase()}</div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-light">{counts ? counts[t.key] : '—'}</span>
                {t.key === 'enquiries' && counts?.newEnquiries > 0 && (
                  <span className="rounded-full bg-red/20 px-2.5 py-1 font-mono text-[10px] text-red">{counts.newEnquiries} NEW</span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 font-mono text-[10px] tracking-[0.18em] text-red">QUICK ACTIONS</div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/projects"><Btn>+ NEW PROJECT</Btn></Link>
            <Link href="/admin/shoots"><Btn>+ NEW SHOOT</Btn></Link>
            <Link href="/admin/site"><Btn>EDIT HERO & ABOUT</Btn></Link>
            <Link href="/" target="_blank"><Btn>VIEW SITE ↗</Btn></Link>
          </div>
        </Card>
        {anyEmpty && (
          <Card>
            <div className="mb-3 font-mono text-[10px] tracking-[0.18em] text-red">FIRST RUN</div>
            <p className="mb-5 text-[14px] font-light leading-relaxed text-mute">
              Some collections are empty, so the site shows the starter content for them. Copy it in to make it
              editable, then replace it piece by piece. Only empty collections are filled.
            </p>
            <Btn tone="solid" onClick={seedEmpty} disabled={state === 'working'}>
              {state === 'working' ? 'COPYING…' : 'SEED EMPTY COLLECTIONS'}
            </Btn>
            {state === 'done' && <p className="mt-4 text-[13px] text-red">Done.</p>}
            {state.startsWith('error') && <p className="mt-4 text-[13px] text-red">That failed ({state.slice(7)}). Usually the Firestore rules still block writes; see the README.</p>}
          </Card>
        )}
      </div>
    </div>
  );
}
