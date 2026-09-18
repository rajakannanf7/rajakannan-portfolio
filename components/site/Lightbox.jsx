'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { pad } from '../../lib/text';

// Shared full-screen viewer. items: [{src, caption}]; open(i) shows item i.
export function useLightbox(items) {
  const [idx, setIdx] = useState(-1);
  const lastFocus = useRef(null);
  const open = useCallback((i, el) => { lastFocus.current = el || null; setIdx(i); }, []);
  const close = useCallback(() => { setIdx(-1); lastFocus.current?.focus?.(); }, []);
  const go = useCallback((d) => setIdx((i) => (i + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (idx < 0) return;
    window.__lenis?.stop();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    addEventListener('keydown', onKey);
    return () => { removeEventListener('keydown', onKey); window.__lenis?.start(); };
  }, [idx, close, go]);

  const item = idx >= 0 ? items[idx] : null;
  const node = (
    <div className={`lb ${item ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Image viewer" aria-hidden={!item}
      onClick={(e) => e.target === e.currentTarget && close()}>
      {item && (
        <>
          <button className="x" onClick={close} autoFocus>Close ✕</button>
          {items.length > 1 && <button className="nv pv" onClick={() => go(-1)} aria-label="Previous">←</button>}
          <img src={item.src} alt={item.caption || ''} />
          {items.length > 1 && <button className="nv nx" onClick={() => go(1)} aria-label="Next">→</button>}
          <div className="cap mono">{pad(idx + 1)} / {pad(items.length)}{item.caption ? ` · ${item.caption}` : ''}</div>
        </>
      )}
    </div>
  );
  return { open, node };
}
