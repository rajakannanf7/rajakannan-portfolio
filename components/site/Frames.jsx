'use client';

import { useLightbox } from './Lightbox';

// Masonry of shoot frames; click opens the lightbox.
export default function Frames({ frames, title }) {
  const items = frames.map((f, i) => ({ src: f.src, caption: f.caption || `${title}, frame ${i + 1}` }));
  const { open, node } = useLightbox(items);
  return (
    <>
      <div className="frames" data-stagger>
        {frames.map((f, i) => (
          <button key={i} onClick={(e) => open(i, e.currentTarget)} data-cursor="Open" aria-label={`Open frame ${i + 1}`}>
            <img src={f.src} alt={f.caption || `${title}, frame ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
      {node}
    </>
  );
}
