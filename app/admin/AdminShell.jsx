'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseReady } from '../../lib/firebase';
import { adminEmails } from '../../lib/config';
import { DEMO } from '../../lib/admin';
import { demo } from '../../lib/admin-demo';

// Plain-language versions of Firebase's sign-in error codes.
function signInMessage(code = '') {
  if (/invalid-credential|wrong-password|user-not-found|invalid-email|invalid-login/.test(code))
    return 'Wrong email or password. Use the user you added under Firebase → Authentication → Users.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Wait a few minutes, or reset the password in Firebase → Authentication → Users.';
  if (code.includes('operation-not-allowed')) return 'Email/Password sign-in is switched off. Turn it on in Firebase → Authentication → Sign-in method.';
  if (code.includes('user-disabled')) return 'This user is disabled in Firebase → Authentication → Users.';
  if (code.includes('network')) return 'Network error. Check your connection and try again.';
  return `Sign-in failed (${code || 'unknown error'}).`;
}

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/shoots', label: 'Shoots' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/lab', label: 'Lab' },
  { href: '/admin/site', label: 'Site' },
  { href: '/admin/enquiries', label: 'Enquiries' },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState(null); // null = checking; {notAdmin, rules}

  useEffect(() => {
    if (DEMO) { setUser({ email: 'demo' }); return; }
    if (!firebaseReady || !auth) {
      setUser(null);
      return;
    }
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // After sign-in, check the two things that silently break the admin:
  // the account isn't on the admin list, or the Firestore rules aren't published.
  useEffect(() => {
    if (DEMO || !user || !db) return;
    let alive = true;
    const notAdmin = !adminEmails.includes(String(user.email || '').toLowerCase());
    getDoc(doc(db, 'settings', 'site'))
      .then(() => alive && setHealth({ notAdmin, rules: 'ok' }))
      .catch((e) => alive && setHealth({ notAdmin, rules: e.code === 'permission-denied' ? 'locked' : `error: ${e.code || e.message}` }));
    return () => { alive = false; };
  }, [user]);

  if (!firebaseReady && !DEMO) {
    return (
      <Frame>
        <div className="mx-auto max-w-[520px] pt-40">
          <h1 className="mb-4 text-3xl font-light">Firebase isn&apos;t connected yet.</h1>
          <p className="text-[15px] font-light leading-relaxed text-mute">
            Add your keys to <code className="text-red">.env.local</code> and restart the dev server.
            The public site keeps working without them — it renders from{' '}
            <code className="text-red">lib/fallback.js</code> — but the admin needs a real project
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
            } catch (err) {
              setError(signInMessage(err?.code));
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
            className="mb-3 w-full rounded-xl border border-bone/15 bg-bone/[0.02] px-4 py-3.5 text-[15px] outline-none focus:border-red"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="mb-5 w-full rounded-xl border border-bone/15 bg-bone/[0.02] px-4 py-3.5 text-[15px] outline-none focus:border-red"
          />
          {error && <p className="mb-4 text-[13px] text-red">{error}</p>}
          <button
            disabled={busy}
            className="w-full rounded-full bg-red py-3.5 font-mono text-xs font-medium tracking-chip text-ink disabled:opacity-50"
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
            <span className="text-lg font-bold tracking-[0.14em]"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-red align-middle" />RAJA KANNAN</span>
            <span className="font-mono text-[10px] tracking-[0.18em] text-dim">/ ADMIN</span>
          </div>
          <div className="flex items-center gap-5">
            {!DEMO && user?.email && <span className="font-mono text-[11px] tracking-[0.08em] text-faint">{user.email}</span>}
            <Link href="/" target="_blank" className="font-mono text-[11px] tracking-[0.12em] text-mute hover:text-bone">
              VIEW SITE ↗
            </Link>
            <button
              onClick={() => (DEMO ? (confirm('Reset the demo data?') && (demo.reset(), location.reload())) : signOut(auth))}
              className="font-mono text-[11px] tracking-[0.12em] text-mute hover:text-bone"
            >
              {DEMO ? 'RESET DEMO' : 'SIGN OUT'}
            </button>
          </div>
        </header>

        {!DEMO && health?.notAdmin && (
          <div className="mb-6 rounded-xl border border-red/60 bg-red/10 px-5 py-4 text-[14px] leading-relaxed text-bone/90">
            <b className="text-red">This account is not the admin.</b> You are signed in as <b>{user.email}</b>, but only{' '}
            <b>{adminEmails.join(', ')}</b> can edit the site. Sign out and sign in with that email, or ask for it to be changed in{' '}
            <code>lib/config.js</code> and <code>firestore.rules</code>.
          </div>
        )}
        {!DEMO && health?.rules === 'locked' && (
          <div className="mb-6 rounded-xl border border-red/60 bg-red/10 px-5 py-4 text-[14px] leading-relaxed text-bone/90">
            <b className="text-red">The database rules are not published yet, so nothing can load or save.</b>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Open <a className="underline" href="https://console.firebase.google.com/project/rajakannan-portfolio/firestore/rules" target="_blank" rel="noopener noreferrer">Firebase → Firestore Database → Rules ↗</a>.</li>
              <li>Select everything in the editor and delete it.</li>
              <li>Paste the contents of <code>firestore.rules</code> from the GitHub repo, then press <b>Publish</b>.</li>
              <li>Wait about 30 seconds, then reload this page.</li>
            </ol>
          </div>
        )}
        {!DEMO && health?.rules?.startsWith('error') && (
          <div className="mb-6 rounded-xl border border-red/60 bg-red/10 px-5 py-4 text-[14px] text-bone/90">
            <b className="text-red">Could not reach the database</b> ({health.rules.slice(7)}). Check that Firestore Database is created in the Firebase console.
          </div>
        )}
        {DEMO && (
          <div className="mb-6 rounded-xl border border-red/40 bg-red/10 px-4 py-3 text-[13px] text-bone/80">
            Demo mode: edits are saved in this browser only and do not change the live site. Uploaded files last until the tab closes.
          </div>
        )}
        <nav className="mb-10 flex flex-wrap gap-2">
          {NAV.map((n) => {
            const active = n.href === '/admin' ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] transition-colors ${
                  active ? 'bg-red font-medium text-ink' : 'border border-bone/15 text-bone/60 hover:border-bone/40'
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
