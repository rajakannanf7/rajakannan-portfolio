'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, firebaseReady } from '../../lib/firebase';

const TYPES = ['Brand film', 'Product / CGI', 'Photography shoot', 'Fashion film', 'AI production', 'Something else'];

export default function ContactForm({ email = 'hello@rajakannan.com' }) {
  const params = useSearchParams();
  const initial = params.get('type') === 'shoot' ? 'Photography shoot' : TYPES[0];
  const [type, setType] = useState(initial);
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

    // Without Firebase configured the form still works: it hands off to mail.
    if (!firebaseReady || !db) {
      const body = encodeURIComponent(`${payload.message}\n\n${payload.name}${payload.company ? `, ${payload.company}` : ''}\nType: ${payload.type}${payload.budget ? `\nBudget: ${payload.budget}` : ''}`);
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`New enquiry: ${payload.type}`)}&body=${body}`;
      setState('sent');
      return;
    }
    try {
      await addDoc(collection(db, 'enquiries'), payload);
      setState('sent');
    } catch (err) {
      setState('idle');
      setError(`That did not send. Try again, or email ${email}.`);
      console.error(err);
    }
  }

  if (state === 'sent') {
    return (
      <div className="form">
        <div className="eyebrow mono">Received</div>
        <p className="display" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', margin: 0 }}>Thanks. <span className="it">Talk soon.</span></p>
        <p className="note">I reply within two working days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="form">
      <div>
        <div className="mono" style={{ color: 'var(--mute)', marginBottom: 12 }}>What is it</div>
        <div className="filters" style={{ padding: 0, marginBottom: 8 }}>
          {TYPES.map((t) => (
            <button key={t} type="button" aria-pressed={t === type} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="two">
        <label><span className="mono">Name *</span><input name="name" autoComplete="name" required maxLength={190} /></label>
        <label><span className="mono">Email *</span><input name="email" type="email" autoComplete="email" required maxLength={190} /></label>
      </div>
      <div className="two">
        <label><span className="mono">Company</span><input name="company" autoComplete="organization" maxLength={190} /></label>
        <label><span className="mono">Budget</span>
          <select name="budget" defaultValue="">
            <option value="">Prefer not to say</option>
            <option>Under ₹1L</option><option>₹1L – ₹5L</option><option>₹5L – ₹15L</option><option>₹15L+</option>
          </select>
        </label>
      </div>
      <label><span className="mono">The project *</span><textarea name="message" required maxLength={4900} placeholder="What are we making, and when does it need to exist?" /></label>
      {error && <p className="note" style={{ color: 'var(--red)' }}>{error}</p>}
      <div><button className="mag" disabled={state === 'sending'} data-magnetic>{state === 'sending' ? 'Sending…' : 'Send enquiry'}</button></div>
    </form>
  );
}
