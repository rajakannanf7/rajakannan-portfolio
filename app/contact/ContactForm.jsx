'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, firebaseReady } from '../../lib/firebase';

const TYPES = ['Brand film', 'Product / CGI', 'Photography shoot', 'Fashion film', 'Something else'];

const field =
  'w-full rounded-xl border border-bone/15 bg-bone/[0.02] px-4 py-4 text-[15px] outline-none transition-colors placeholder:text-faint focus:border-bone/40';

export default function ContactForm() {
  const params = useSearchParams();
  const [type, setType] = useState(params.get('type') === 'shoot' ? 'Photography shoot' : TYPES[0]);
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name')?.toString().trim(),
      email: form.get('email')?.toString().trim(),
      company: form.get('company')?.toString().trim() || '',
      budget: form.get('budget')?.toString().trim() || '',
      type,
      message: form.get('message')?.toString().trim(),
      status: 'new',
      createdAt: serverTimestamp(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setError('Name, email and a line about the project, please.');
      return;
    }

    setState('sending');
    setError('');

    // Without Firebase configured the form still works — it hands off to mail.
    if (!firebaseReady || !db) {
      const body = encodeURIComponent(
        `${payload.message}\n\n—\n${payload.name}${payload.company ? ` · ${payload.company}` : ''}\nType: ${payload.type}${payload.budget ? `\nBudget: ${payload.budget}` : ''}`
      );
      window.location.href = `mailto:hello@rajakannan.com?subject=${encodeURIComponent(`New enquiry — ${payload.type}`)}&body=${body}`;
      setState('sent');
      return;
    }

    try {
      await addDoc(collection(db, 'enquiries'), payload);
      setState('sent');
    } catch (err) {
      setState('idle');
      setError('That did not send. Try again, or email directly.');
      console.error(err);
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-2xl border border-bone/12 bg-bone/[0.02] p-10">
        <div className="mb-4 font-mono text-[10px] tracking-[0.24em] text-halo">RECEIVED</div>
        <p className="text-2xl font-light leading-snug">
          Thanks — I&apos;ll come back to you within two working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <div className="mb-3 font-mono text-[10px] tracking-[0.2em] text-faint">WHAT IS IT</div>
        <div className="flex flex-wrap gap-2.5">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-full px-4 py-2.5 font-mono text-[11px] tracking-[0.1em] transition-colors ${
                type === t
                  ? 'bg-bone font-medium text-ink'
                  : 'border border-bone/15 text-bone/60 hover:border-bone/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <input name="name" placeholder="Your name" className={field} autoComplete="name" />
        <input name="email" type="email" placeholder="Email" className={field} autoComplete="email" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <input name="company" placeholder="Company or studio (optional)" className={field} />
        <input name="budget" placeholder="Budget range (optional)" className={field} />
      </div>
      <textarea
        name="message"
        rows={6}
        placeholder="What are you making, and when does it need to land?"
        className={`${field} resize-none`}
      />

      {error && <p className="text-[13px] text-orchid">{error}</p>}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="mt-2 inline-flex w-fit items-center gap-4 rounded-full bg-bone px-8 py-4 font-mono text-xs font-medium tracking-chip text-ink transition-transform duration-300 ease-swift hover:scale-[1.03] disabled:opacity-50"
      >
        {state === 'sending' ? 'SENDING…' : 'SEND ENQUIRY'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0C" strokeWidth="1.6">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
