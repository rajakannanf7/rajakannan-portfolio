'use client';

import { useRef, useState } from 'react';

// Before/after slider. A transparent range input on top keeps it keyboard-accessible.
export default function Compare({ before, after, labels = ['Captured', 'Unreal'] }) {
  const [pos, setPos] = useState(50);
  const box = useRef(null);
  const drag = useRef(false);
  const fromEvent = (e) => {
    const r = box.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      className="compare" ref={box} style={{ '--pos': pos + '%' }} data-cursor="Drag"
      onPointerDown={(e) => { drag.current = true; fromEvent(e); }}
      onPointerMove={(e) => (drag.current || e.pointerType === 'mouse') && fromEvent(e)}
      onPointerUp={() => (drag.current = false)} onPointerLeave={() => (drag.current = false)}
    >
      <img src={after} alt={labels[1]} />
      <img className="top" src={before} alt={labels[0]} />
      <div className="bar"><div className="knob">↔</div></div>
      <span className="tag l mono">{labels[0]}</span>
      <span className="tag r mono">{labels[1]}</span>
      <input type="range" min="0" max="100" value={Math.round(pos)} onChange={(e) => setPos(+e.target.value)} aria-label={`Compare ${labels[0]} and ${labels[1]}`} />
    </div>
  );
}
