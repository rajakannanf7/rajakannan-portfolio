'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getCountFromServer, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';
import { db, firebaseReady } from '../../lib/firebase';
import * as seed from '../../lib/fallback';
import { Btn, Card } from '../../components/ui/admin-bits';

export default function AdminHome() {
  const [counts, setCounts] = useState(null);
  const [seeding, setSeeding] = useState('');

  async function load() {
    if (!firebaseReady || !db) return;
    const names = ['projects', 'photos', 'labs', 'enquiries'];
    const out = {};
    for (const n of names) {
      try {
        const snap = await getCountFromServer(collection(db, n));
        out[n] = snap.data().count;
      } catch {
        out[n] = 0;
      }
    }
    try {
      const s = await getDocs(query(collection(db, 'enquiries'), where('status', '==', 'new')));
      out.newEnquiries = s.size;
    } catch {
      out.newEnquiries = 0;
    }
    setCounts(out);
  }

  useEffect(() => {
    load();
  }, []);

  async function seedAll() {
    if (!confirm('Copy the starter content into Firestore? Existing documents with the same ids are overwritten.')) return;
    setSeeding('working');
    try {
      const batch = writeBatch(db);
      seed.projects.forEach((p) => batch.set(doc(db, 'projects', p.slug), p));
      seed.photos.forEach((p) => batch.set(doc(db, 'photos', p.id), p));
      seed.labs.forEach((l) => batch.set(doc(db, 'labs', l.id), l));
      batch.set(doc(db, 'settings', 'site'), seed.site);
      await batch.commit();
      setSeeding('done');
      load();
    } catch (e) {
      console.error(e);
      setSeeding('error');
    }
  }

  const tiles = [
    { href: '/admin/projects', label: 'Projects', n: counts?.projects },
    { href: '/admin/photos', label: 'Photographs', n: counts?.photos },
    { href: '/admin/lab', label: 'Lab tiles', n: counts?.labs },
    { href: '/admin/enquiries', label: 'Enquiries', n: counts?.enquiries, badge: counts?.newEnquiries },
  ];

  const empty = counts && counts.projects === 0 && counts.photos === 0 && counts.labs === 0;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-light">Overview</h1>
      <p className="mb-10 max-w-[620px] text-[15px] font-light leading-relaxed text-mute">
        The public site reads Firestore first and falls back to the starter content in the repo, so it
        never renders empty. Anything you change here goes live within a minute.
      </p>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href}>
            <Card className="transition-colors hover:border-bone/25">
              <div className="mb-6 font-mono text-[10px] tracking-[0.18em] text-faint">
                {t.label.toUpperCase()}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-light">{t.n ?? '—'}</span>
                {t.badge > 0 && (
                  <span className="rounded-full bg-orchid/20 px-2.5 py-1 font-mono text-[10px] text-halo">
                    {t.badge} NEW
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {empty && (
        <Card>
          <div className="mb-3 font-mono text-[10px] tracking-[0.18em] text-halo">FIRST RUN</div>
          <h2 className="mb-3 text-xl font-light">Firestore is empty.</h2>
          <p className="mb-6 max-w-[560px] text-[14px] font-light leading-relaxed text-mute">
            Right now the site is showing the starter content bundled in the repo. Copy it into
            Firestore and it becomes editable here — the images stay as the local files in{' '}
            <code className="text-halo">/public/img</code> until you replace them with uploads.
          </p>
          <Btn tone="solid" onClick={seedAll} disabled={seeding === 'working'}>
            {seeding === 'working' ? 'COPYING…' : 'SEED FROM STARTER CONTENT'}
          </Btn>
          {seeding === 'done' && <p className="mt-4 text-[13px] text-halo">Done — reload to see the counts.</p>}
          {seeding === 'error' && (
            <p className="mt-4 text-[13px] text-orchid">
              That failed. Usually it means the Firestore rules still block writes — check the README.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
