'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, firebaseReady } from '../../lib/firebase';

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/photos', label: 'Photography' },
  { href: '/admin/lab', label: 'Lab' },
  { href: '/admin/enquiries', label: 'Enquiries' },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setUser(null);
      return;
    }
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (!firebaseReady) {
    return (
      <Frame>
        <div className="mx-auto max-w-[520px] pt-40">
          <h1 className="mb-4 text-3xl font-light">Firebase isn&apos;t connected yet.</h1>
          <p className="text-[15px] font-light leading-relaxed text-mute">
            Add your keys to <code className="text-halo">.env.local</code> and restart the dev server.
            The public site keeps working without them — it renders from{' '}
            <code className="text-halo">lib/fallback.js</code> — but the admin needs a real project
            to write to. See the README for the six variables and the security rules.
          </p>
        </div>
      </Frame>
    );
  }

  if (user === undefined) {
    return (
      <Frame>
        <div className="pt-40 text-center font-mono text-xs tracking-[0.2em] text-dim">CHECKING SESSION…</div>
      </Frame>
    );
  }

  if (!user) {
    return (
      <Frame>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            try {
              await signInWithEmailAndPassword(auth, email, password);
            } catch {
              setError('That email and password combination did not work.');
            }
            setBusy(false);
          }}
          className="mx-auto max-w-[400px] pt-40"
        >
          <div className="mb-8 font-mono text-[10px] tracking-[0.28em] text-dim">RAJA KANNAN — ADMIN</div>
          <h1 className="mb-8 text-3xl font-light">Sign in</h1>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            autoComplete="username"
            className="mb-3 w-full rounded-xl border border-bone/15 bg-bone/[0.02] px-4 py-3.5 text-[15px] outline-none focus:border-bone/40"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="mb-5 w-full rounded-xl border border-bone/15 bg-bone/[0.02] px-4 py-3.5 text-[15px] outline-none focus:border-bone/40"
          />
          {error && <p className="mb-4 text-[13px] text-orchid">{error}</p>}
          <button
            disabled={busy}
            className="w-full rounded-full bg-bone py-3.5 font-mono text-xs font-medium tracking-chip text-ink disabled:opacity-50"
          >
            {busy ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
          <p className="mt-6 text-[13px] font-light leading-relaxed text-faint">
            Create this user once under Authentication → Users in the Firebase console. There is no
            public sign-up.
          </p>
        </form>
      </Frame>
    );
  }

  return (
    <Frame>
      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-bone/10 pb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-bold tracking-[0.14em]">RAJA</span>
            <span className="font-mono text-[10px] tracking-[0.18em] text-dim">/ ADMIN</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" target="_blank" className="font-mono text-[11px] tracking-[0.12em] text-mute hover:text-bone">
              VIEW SITE ↗
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="font-mono text-[11px] tracking-[0.12em] text-mute hover:text-bone"
            >
              SIGN OUT
            </button>
          </div>
        </header>

        <nav className="mb-10 flex flex-wrap gap-2">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] transition-colors ${
                  active ? 'bg-bone font-medium text-ink' : 'border border-bone/15 text-bone/60 hover:border-bone/40'
                }`}
              >
                {n.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </Frame>
  );
}

function Frame({ children }) {
  return <div className="min-h-screen bg-ink px-6 font-sans text-bone">{children}</div>;
}
