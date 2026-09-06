'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './iridescent.glsl';

const PALETTES = [
  ['#5B4BE8', '#C77BE8', '#6FA8F0'],
  ['#7C5CFF', '#E4A5FF', '#4FD8FF'],
  ['#3F3AC7', '#A46BF0', '#8FD8FF'],
];

export default function HeroObject({ variant = 0, reducedMotion = false }) {
  const mesh = useRef();
  const mat = useRef();
  const { size } = useThree();

  const pointer = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));
  const scrollRef = useRef(0);

  const uniforms = useMemo(() => {
    const p = PALETTES[variant % PALETTES.length];
    return {
      uTime: { value: 0 },
      uAmp: { value: 0.3 },
      uFreq: { value: 0.88 },
      uSwirl: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color(p[0]) },
      uColorB: { value: new THREE.Color(p[1]) },
      uColorC: { value: new THREE.Color(p[2]) },
      uLightDir: { value: new THREE.Vector3(-0.6, 0.8, 0.7) },
      uShift: { value: 0 },
    };
  }, [variant]);

  // Retarget colours when the variant changes without rebuilding the material
  const applied = useRef(variant);
  if (applied.current !== variant && mat.current) {
    const p = PALETTES[variant % PALETTES.length];
    mat.current.uniforms.uColorA.value.set(p[0]);
    mat.current.uniforms.uColorB.value.set(p[1]);
    mat.current.uniforms.uColorC.value.set(p[2]);
    applied.current = variant;
  }

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const u = mat.current?.uniforms;
    if (!u) return;

    u.uTime.value = reducedMotion ? 0.4 : t;

    // pointer in NDC, eased — the object leans toward the cursor rather than snapping
    target.current.set(state.pointer.x, state.pointer.y);
    pointer.current.lerp(target.current, Math.min(1, delta * 3.2));
    u.uPointer.value.copy(pointer.current);

    // light direction follows the cursor, which is what actually sells the material
    u.uLightDir.value.set(
      -0.6 + pointer.current.x * 0.9,
      0.8 + pointer.current.y * 0.5,
      0.75
    );

    if (mesh.current) {
      // idle breathing + parallax lean
      const breathe = reducedMotion ? 1 : 1 + Math.sin(t * 0.65) * 0.022;
      mesh.current.scale.setScalar(breathe * (size.width < 720 ? 0.74 : 0.92));
      mesh.current.rotation.y += delta * (reducedMotion ? 0 : 0.075);
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        pointer.current.y * -0.28,
        Math.min(1, delta * 2.4)
      );
      mesh.current.rotation.z = THREE.MathUtils.lerp(
        mesh.current.rotation.z,
        pointer.current.x * 0.18,
        Math.min(1, delta * 2.4)
      );
    }

    // scroll shifts the hue ramp and calms the displacement as you leave the hero
    const scroll = typeof window !== 'undefined' ? window.scrollY / (window.innerHeight || 1) : 0;
    scrollRef.current = THREE.MathUtils.lerp(scrollRef.current, scroll, Math.min(1, delta * 3));
    u.uShift.value = scrollRef.current * 0.28;
    u.uAmp.value = 0.3 - Math.min(scrollRef.current, 1) * 0.12;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 48]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
