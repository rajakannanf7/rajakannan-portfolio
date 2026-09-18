'use client';

import { useRef, useState } from 'react';
import { UPLOAD_CONCURRENCY, uploadMedia } from '../../lib/admin';
import { videoEmbed } from '../../lib/text';

export const inputCls =
  'w-full rounded-xl border border-bone/15 bg-bone/[0.03] px-4 py-3 text-[14px] text-bone outline-none transition-colors placeholder:text-faint focus:border-red';

export function Field({ label, hint, children, className = '' }) {
  return (
    <div className={`block ${className}`}>
      {label && <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-faint">{label}</div>}
      {children}
      {hint && <div className="mt-2 text-[12px] font-light leading-relaxed text-faint">{hint}</div>}
    </div>
  );
}

export function Btn({ children, tone = 'ghost', className = '', ...rest }) {
  const tones = {
    solid: 'bg-red text-ink font-medium hover:bg-bone',
    ghost: 'border border-bone/15 text-bone/75 hover:border-bone/40 hover:text-bone',
    danger: 'border border-red/40 text-red hover:bg-red/10',
    quiet: 'text-bone/60 hover:text-bone',
  };
  return (
    <button
      type="button"
      {...rest}
      className={`rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.1em] transition-all duration-200 disabled:opacity-40 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-bone/10 bg-bone/[0.02] p-5 md:p-6 ${className}`}>{children}</div>;
}

export function OrderControls({ index, total, onMove }) {
  const b = 'flex h-8 w-8 items-center justify-center rounded-lg border border-bone/15 text-bone/60 hover:border-bone/40 disabled:opacity-25';
  return (
    <div className="flex gap-1.5">
      <button type="button" className={b} onClick={() => onMove(index, index - 1)} disabled={index === 0} aria-label="Move up">↑</button>
      <button type="button" className={b} onClick={() => onMove(index, index + 1)} disabled={index === total - 1} aria-label="Move down">↓</button>
    </div>
  );
}

const move = (arr, from, to) => {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
};

// Runs uploads a few at a time and reports per-file progress.
function useUploader(folder) {
  const [jobs, setJobs] = useState([]); // {id, name, p, err}
  async function run(files, onDone) {
    const list = [...files].filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
    const ids = list.map((f, i) => `${Date.now()}-${i}`);
    setJobs((j) => [...j, ...list.map((f, i) => ({ id: ids[i], name: f.name, p: 0 }))]);
    const results = new Array(list.length);
    let next = 0;
    const worker = async () => {
      while (next < list.length) {
        const i = next++;
        try {
          results[i] = await uploadMedia(list[i], folder, (p) => setJobs((j) => j.map((x) => (x.id === ids[i] ? { ...x, p } : x))));
          setJobs((j) => j.filter((x) => x.id !== ids[i]));
        } catch (e) {
          setJobs((j) => j.map((x) => (x.id === ids[i] ? { ...x, err: e.message || 'Upload failed' } : x)));
        }
      }
    };
    await Promise.all(Array.from({ length: UPLOAD_CONCURRENCY }, worker));
    onDone(results.filter(Boolean));
  }
  const clearErrors = () => setJobs((j) => j.filter((x) => !x.err));
  return { jobs, run, clearErrors };
}

function Jobs({ jobs, clearErrors }) {
  if (!jobs.length) return null;
  return (
    <div className="mt-3 space-y-1.5">
      {jobs.map((j) => (
        <div key={j.id} className="flex items-center gap-3 text-[12px]">
          <span className="w-48 truncate text-bone/70">{j.name}</span>
          {j.err ? (
            <span className="text-red">{j.err}</span>
          ) : (
            <span className="h-1 flex-1 overflow-hidden rounded bg-bone/10"><span className="block h-full bg-red transition-all" style={{ width: `${Math.round(j.p * 100)}%` }} /></span>
          )}
        </div>
      ))}
      {jobs.some((j) => j.err) && <Btn tone="quiet" onClick={clearErrors}>DISMISS ERRORS</Btn>}
    </div>
  );
}

function DropZone({ onFiles, multiple, accept, children, className = '' }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles(e.dataTransfer.files); }}
      onClick={() => input.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
      className={`cursor-pointer rounded-xl border border-dashed transition-colors ${over ? 'border-red bg-red/5' : 'border-bone/20 hover:border-bone/40'} ${className}`}
    >
      {children}
      <input ref={input} type="file" multiple={multiple} accept={accept} className="hidden"
        onChange={(e) => { onFiles(e.target.files); e.target.value = ''; }} />
    </div>
  );
}

export function Thumb({ item, className = '' }) {
  if (!item?.src) return <div className={`flex items-center justify-center bg-ink2 font-mono text-[10px] text-faint ${className}`}>EMPTY</div>;
  if (item.type === 'video') {
    const v = videoEmbed(item.src);
    return (
      <div className={`relative flex items-center justify-center bg-ink2 ${className}`}>
        {v?.kind === 'file' ? <video src={item.src} muted playsInline preload="metadata" className="h-full w-full object-cover" /> : null}
        <span className="absolute rounded-full bg-ink/80 px-2 py-1 font-mono text-[10px] text-bone">{v?.kind === 'iframe' ? '▶ EMBED' : '▶ VIDEO'}</span>
      </div>
    );
  }
  return <img src={item.src} alt="" className={`object-cover ${className}`} />;
}

// Single image with drag-drop upload, preview and URL fallback.
export function ImageField({ value, onChange, folder, ratio = 'aspect-[16/10]', accept = 'image/*' }) {
  const { jobs, run, clearErrors } = useUploader(folder);
  const busy = jobs.some((j) => !j.err);
  return (
    <div>
      <DropZone accept={accept} onFiles={(f) => run([f[0]], (r) => r[0] && onChange(r[0].url))} className={`relative overflow-hidden ${ratio}`}>
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : (
          <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
            <span className="font-mono text-[10px] tracking-[0.18em] text-bone/60">DROP IMAGE OR CLICK</span>
            <span className="text-[11px] text-faint">Compressed to WebP automatically</span>
          </div>
        )}
        {busy && <div className="absolute inset-0 flex items-center justify-center bg-ink/80 font-mono text-[10px] tracking-[0.18em]">UPLOADING…</div>}
      </DropZone>
      <Jobs jobs={jobs.filter((j) => j.err)} clearErrors={clearErrors} />
      <div className="mt-2 flex gap-2">
        <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL / path" className={`${inputCls} py-2 text-[12px]`} />
        {value && <Btn tone="danger" onClick={() => onChange('')}>CLEAR</Btn>}
      </div>
    </div>
  );
}

// Ordered list of images/videos: bulk upload, captions, sizes, cover picking, video links.
export function MediaListField({ value = [], onChange, folder, sizes = false, onCover, cover, captions = true, links = false }) {
  const { jobs, run, clearErrors } = useUploader(folder);
  const [url, setUrl] = useState('');
  const items = Array.isArray(value) ? value : [];
  const set = (i, patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const add = (res) => onChange([...items, ...res.map((r) => ({ type: r.type, src: r.url, path: r.path, caption: '', ...(sizes ? { size: 'full' } : {}) }))]);

  return (
    <div>
      <DropZone multiple accept="image/*,video/*" onFiles={(f) => run(f, add)} className="px-4 py-6 text-center">
        <div className="font-mono text-[10px] tracking-[0.18em] text-bone/70">DROP IMAGES / VIDEOS HERE, OR CLICK TO PICK</div>
        <div className="mt-1 text-[11px] text-faint">Select many at once. Images are compressed automatically; videos up to 4 MB (paste a YouTube/Vimeo link for longer films).</div>
      </DropZone>
      <Jobs jobs={jobs} clearErrors={clearErrors} />
      <div className="mt-3 flex gap-2">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste a YouTube / Vimeo / MP4 link or image URL" className={`${inputCls} py-2 text-[12px]`} />
        <Btn disabled={!url.trim()} onClick={() => {
          const u = url.trim();
          const isVid = /youtu|vimeo|\.(mp4|webm|mov)(\?|$)/i.test(u);
          onChange([...items, { type: isVid ? 'video' : 'image', src: u, caption: '', ...(sizes ? { size: 'full' } : {}) }]);
          setUrl('');
        }}>ADD LINK</Btn>
      </div>

      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="font-mono text-[10px] tracking-[0.14em] text-faint">{items.length} ITEM{items.length > 1 ? 'S' : ''}</div>
          {items.map((it, i) => (
            <div key={it.src + i} className={`flex flex-wrap items-center gap-3 rounded-xl border p-2 ${cover && cover === it.src ? 'border-red/60' : 'border-bone/10'}`}>
              <Thumb item={it} className="h-16 w-24 flex-shrink-0 rounded-lg" />
              <div className="min-w-[160px] flex-1 space-y-1.5">
                {captions && <input value={it.caption || ''} onChange={(e) => set(i, { caption: e.target.value })} placeholder="Caption (optional)" className={`${inputCls} py-1.5 text-[12px]`} />}
                {links && <input value={it.link || ''} onChange={(e) => set(i, { link: e.target.value })} placeholder="Link on click (optional, e.g. Instagram post)" className={`${inputCls} py-1.5 text-[12px]`} />}
                {it.type === 'video' && <div className="truncate text-[11px] text-faint">{it.src}</div>}
              </div>
              {sizes && (
                <select value={it.size || 'full'} onChange={(e) => set(i, { size: e.target.value })} className={`${inputCls} w-auto py-1.5 text-[12px]`}>
                  <option value="full">Full width</option>
                  <option value="half">Half width</option>
                </select>
              )}
              {onCover && it.type !== 'video' && (
                <Btn tone={cover === it.src ? 'solid' : 'ghost'} onClick={() => onCover(it.src)}>{cover === it.src ? 'COVER' : 'SET COVER'}</Btn>
              )}
              <OrderControls index={i} total={items.length} onMove={(a, b) => onChange(move(items, a, b))} />
              <Btn tone="danger" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove">✕</Btn>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Repeating rows of small objects, e.g. sections {heading, body} or credits {role, name}.
export function RowsField({ value = [], onChange, fields, addLabel = 'ADD ROW' }) {
  const rows = Array.isArray(value) ? value : [];
  const blank = Object.fromEntries(fields.map((f) => [f.key, f.type === 'checkbox' ? false : '']));
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i} className="rounded-xl border border-bone/10 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === 'textarea' || f.wide ? 'sm:col-span-2' : ''}>
                {f.type === 'textarea' ? (
                  <textarea rows={f.rows || 4} value={r[f.key] || ''} placeholder={f.label} className={`${inputCls} resize-y text-[13px]`}
                    onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />
                ) : f.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 py-2 text-[13px] text-bone/80">
                    <input type="checkbox" checked={!!r[f.key]} className="h-4 w-4 accent-red"
                      onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, [f.key]: e.target.checked } : x)))} />
                    {f.label}
                  </label>
                ) : (
                  <input value={r[f.key] || ''} placeholder={f.label} className={`${inputCls} py-2 text-[13px]`}
                    onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <OrderControls index={i} total={rows.length} onMove={(a, b) => onChange(move(rows, a, b))} />
            <Btn tone="danger" onClick={() => onChange(rows.filter((_, j) => j !== i))}>REMOVE</Btn>
          </div>
        </div>
      ))}
      <Btn onClick={() => onChange([...rows, { ...blank }])}>+ {addLabel}</Btn>
    </div>
  );
}

// String array edited as comma-separated text. Keeps its own draft so typing a comma doesn't fight you.
export function ListField({ value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState((value || []).join(', '));
  return (
    <input value={draft} placeholder={placeholder} className={inputCls}
      onChange={(e) => { setDraft(e.target.value); onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean)); }} />
  );
}

export function ChipsField({ value = [], onChange, options }) {
  const v = Array.isArray(value) ? value : [];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = v.includes(o.value);
        return (
          <button key={o.value} type="button" onClick={() => onChange(on ? v.filter((x) => x !== o.value) : [...v, o.value])}
            className={`rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.08em] transition-colors ${on ? 'bg-red text-ink' : 'border border-bone/15 text-bone/70 hover:border-bone/40'}`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
