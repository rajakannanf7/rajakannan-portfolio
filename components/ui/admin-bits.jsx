'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '../../lib/admin';

export const inputCls =
  'w-full rounded-xl border border-bone/15 bg-bone/[0.02] px-4 py-3 text-[14px] outline-none transition-colors placeholder:text-faint focus:border-bone/40';

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-faint">{label}</div>
      {children}
      {hint && <div className="mt-2 text-[12px] font-light text-faint">{hint}</div>}
    </label>
  );
}

export function Btn({ children, tone = 'ghost', ...rest }) {
  const tones = {
    solid: 'bg-bone text-ink font-medium hover:scale-[1.02]',
    ghost: 'border border-bone/15 text-bone/70 hover:border-bone/40 hover:text-bone',
    danger: 'border border-orchid/40 text-orchid hover:bg-orchid/10',
  };
  return (
    <button
      {...rest}
      className={`rounded-full px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] transition-all duration-200 disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-bone/10 bg-bone/[0.015] p-6 ${className}`}>{children}</div>
  );
}

export function ImageInput({ value, onChange, folder = 'uploads', ratio = 'aspect-[3/2]' }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setErr('Keep uploads under 8 MB — export a web-sized version first.');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      const { url, path } = await uploadImage(file, folder);
      onChange(url, path);
    } catch (e2) {
      setErr('Upload failed. Check Storage rules in the console.');
      console.error(e2);
    }
    setBusy(false);
  }

  return (
    <div>
      <div className={`relative mb-3 overflow-hidden rounded-xl border border-bone/10 bg-ink2 ${ratio}`}>
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] tracking-[0.18em] text-faint">
            NO IMAGE
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/80 font-mono text-[10px] tracking-[0.18em]">
            UPLOADING…
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn type="button" onClick={() => fileRef.current?.click()} disabled={busy}>
          {value ? 'REPLACE' : 'UPLOAD'}
        </Btn>
        {value && (
          <Btn type="button" tone="danger" onClick={() => onChange('', '')}>
            CLEAR
          </Btn>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={pick}
        className="hidden"
      />
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value, '')}
        placeholder="…or paste an image path / URL"
        className={`${inputCls} mt-3`}
      />
      {err && <p className="mt-2 text-[12px] text-orchid">{err}</p>}
    </div>
  );
}

// Simple, dependency-free reorder. Portfolio lists are short enough that
// up/down beats a drag library nobody has to maintain.
export function OrderControls({ index, total, onMove }) {
  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => onMove(index, index - 1)}
        disabled={index === 0}
        aria-label="Move up"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-bone/15 text-bone/60 disabled:opacity-25"
      >
        ↑
      </button>
      <button
        onClick={() => onMove(index, index + 1)}
        disabled={index === total - 1}
        aria-label="Move down"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-bone/15 text-bone/60 disabled:opacity-25"
      >
        ↓
      </button>
    </div>
  );
}
