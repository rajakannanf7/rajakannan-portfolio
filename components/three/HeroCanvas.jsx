'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroObject from './HeroObject';

export default function HeroCanvas({ variant = 0 }) {
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);

    // Only mount WebGL once the hero is actually on screen and the device can
    // take it. A mid-range phone gets the still, not a dropped-frame canvas.
    const smallScreen = window.innerWidth < 640;
    const lowCores = (navigator.hardwareConcurrency || 4) < 4;
    if (!smallScreen && !lowCores) setEnabled(true);

    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (!enabled) {
    return (
      <img
        src="/img/hero-object.png"
        alt=""
        className="absolute left-1/2 top-[45%] w-[78%] max-w-[500px] -translate-x-1/2 -translate-y-1/2"
      />
    );
  }

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
    >
      <Suspense fallback={null}>
        <HeroObject variant={variant} reducedMotion={reduced} />
      </Suspense>
    </Canvas>
  );
}
