'use client';

import { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const GATE_LABELS = ['MOTION', '3D / CGI', 'AI', 'PHOTO', 'REALTIME', 'LAB'];

function HoverCar({ carRef, boost }) {
  const thrusterRef = useRef(null);
  const glowRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (thrusterRef.current) {
      const pulse = 1 + Math.sin(t * 18) * 0.08;
      thrusterRef.current.scale.set(1, 1, pulse * (boost ? 1.8 : 1));
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.36 + Math.sin(t * 7) * 0.06 + (boost ? 0.18 : 0);
    }
  });

  return (
    <group ref={carRef} position={[0, 0.52, 3.15]}>
      <mesh castShadow position={[0, 0.06, 0]} scale={[1.22, 0.34, 2.25]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#11131b" metalness={0.95} roughness={0.16} />
      </mesh>

      <mesh position={[0, 0.34, -0.12]} scale={[0.68, 0.32, 1.18]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial color="#141220" metalness={0.9} roughness={0.08} emissive="#24134a" emissiveIntensity={0.48} />
      </mesh>

      <mesh position={[-1.04, 0.02, 0.18]} rotation={[0, -0.08, 0.05]} scale={[0.9, 0.08, 1.48]}>
        <boxGeometry />
        <meshStandardMaterial color="#090b12" metalness={0.92} roughness={0.22} />
      </mesh>
      <mesh position={[1.04, 0.02, 0.18]} rotation={[0, 0.08, -0.05]} scale={[0.9, 0.08, 1.48]}>
        <boxGeometry />
        <meshStandardMaterial color="#090b12" metalness={0.92} roughness={0.22} />
      </mesh>

      <mesh position={[-0.76, 0.22, -0.2]} scale={[0.08, 0.06, 1.48]}>
        <boxGeometry />
        <meshBasicMaterial color="#9d65ff" toneMapped={false} />
      </mesh>
      <mesh position={[0.76, 0.22, -0.2]} scale={[0.08, 0.06, 1.48]}>
        <boxGeometry />
        <meshBasicMaterial color="#63d8ff" toneMapped={false} />
      </mesh>

      <group ref={thrusterRef} position={[0, 0.06, 1.2]}>
        <mesh position={[-0.48, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.13, 0.85, 16]} />
          <meshBasicMaterial color="#a96fff" transparent opacity={0.82} toneMapped={false} />
        </mesh>
        <mesh position={[0.48, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.13, 0.85, 16]} />
          <meshBasicMaterial color="#62dcff" transparent opacity={0.82} toneMapped={false} />
        </mesh>
      </group>

      <mesh ref={glowRef} position={[0, -0.27, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 40]} />
        <meshBasicMaterial color="#7240df" transparent opacity={0.38} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </group>
  );
}

function MovingTrack({ speed }) {
  const segmentRefs = useRef([]);
  const postRefs = useRef([]);
  const count = 30;
  const spacing = 6.2;

  useFrame((_, delta) => {
    const dz = speed * delta;
    segmentRefs.current.forEach((group) => {
      if (!group) return;
      group.position.z += dz;
      if (group.position.z > 11) group.position.z -= count * spacing;
    });
    postRefs.current.forEach((group) => {
      if (!group) return;
      group.position.z += dz;
      if (group.position.z > 10) group.position.z -= 18 * 11;
    });
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} ref={(el) => { segmentRefs.current[i] = el; }} position={[0, 0, -i * spacing + 6]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
            <planeGeometry args={[10, spacing + 0.04]} />
            <meshStandardMaterial color={i % 2 ? '#090a10' : '#0b0c13'} metalness={0.38} roughness={0.7} />
          </mesh>

          <mesh position={[0, 0.015, 0]} scale={[0.055, 0.025, 1.15]}>
            <boxGeometry />
            <meshBasicMaterial color="#7c65ff" transparent opacity={0.56} toneMapped={false} />
          </mesh>
          <mesh position={[-2.15, 0.012, 0]} scale={[0.035, 0.02, 0.82]}>
            <boxGeometry />
            <meshBasicMaterial color="#6b80ff" transparent opacity={0.32} toneMapped={false} />
          </mesh>
          <mesh position={[2.15, 0.012, 0]} scale={[0.035, 0.02, 0.82]}>
            <boxGeometry />
            <meshBasicMaterial color="#a55fff" transparent opacity={0.32} toneMapped={false} />
          </mesh>

          <mesh position={[-5.05, 0.12, 0]} scale={[0.055, 0.12, spacing * 0.5]}>
            <boxGeometry />
            <meshBasicMaterial color="#8b52ff" transparent opacity={0.72} toneMapped={false} />
          </mesh>
          <mesh position={[5.05, 0.12, 0]} scale={[0.055, 0.12, spacing * 0.5]}>
            <boxGeometry />
            <meshBasicMaterial color="#50d9ff" transparent opacity={0.72} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 18 }, (_, i) => (
        <group key={`post-${i}`} ref={(el) => { postRefs.current[i] = el; }} position={[0, 0, -i * 11] }>
          <mesh position={[-6.2, 1.65, 0]} scale={[0.055, 1.65, 0.055]}>
            <boxGeometry />
            <meshBasicMaterial color="#6f46d8" toneMapped={false} />
          </mesh>
          <mesh position={[6.2, 1.65, 0]} scale={[0.055, 1.65, 0.055]}>
            <boxGeometry />
            <meshBasicMaterial color="#3daed1" toneMapped={false} />
          </mesh>
          <mesh position={[-6.2, 3.3, 0]}>
            <sphereGeometry args={[0.12, 12, 8]} />
            <meshBasicMaterial color="#ad7aff" toneMapped={false} />
          </mesh>
          <mesh position={[6.2, 3.3, 0]}>
            <sphereGeometry args={[0.12, 12, 8]} />
            <meshBasicMaterial color="#68ddff" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Gates({ speed, carXRef, onPass }) {
  const refs = useRef([]);
  const data = useMemo(() => [
    { x: -2.15, z: -26, label: GATE_LABELS[0] },
    { x: 1.85, z: -56, label: GATE_LABELS[1] },
    { x: -0.7, z: -86, label: GATE_LABELS[2] },
    { x: 2.2, z: -116, label: GATE_LABELS[3] },
    { x: -1.8, z: -146, label: GATE_LABELS[4] },
    { x: 0.85, z: -176, label: GATE_LABELS[5] },
  ], []);

  useFrame((_, delta) => {
    refs.current.forEach((group, i) => {
      if (!group) return;
      group.position.z += speed * delta;

      if (!group.userData.checked && group.position.z > 2.2) {
        group.userData.checked = true;
        if (Math.abs(carXRef.current - group.position.x) < 1.45) onPass(data[i].label);
      }

      if (group.position.z > 11) {
        group.position.z -= 180;
        group.userData.checked = false;
      }
    });
  });

  return data.map((gate, i) => (
    <group
      key={gate.label}
      ref={(el) => {
        refs.current[i] = el;
        if (el) el.userData.checked = false;
      }}
      position={[gate.x, 1.3, gate.z]}
    >
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.48, 0.055, 12, 64]} />
        <meshBasicMaterial color={i % 2 ? '#5ed9ff' : '#a565ff'} transparent opacity={0.92} toneMapped={false} />
      </mesh>
      <mesh scale={[1.18, 1.18, 1]}>
        <torusGeometry args={[1.48, 0.018, 8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.22} toneMapped={false} />
      </mesh>
      <pointLight color={i % 2 ? '#5ed9ff' : '#a565ff'} intensity={5} distance={8} decay={2} />
      <mesh position={[-1.48, -1.22, 0]} scale={[0.08, 1.2, 0.08]}>
        <boxGeometry />
        <meshBasicMaterial color="#7653ff" toneMapped={false} />
      </mesh>
      <mesh position={[1.48, -1.22, 0]} scale={[0.08, 1.2, 0.08]}>
        <boxGeometry />
        <meshBasicMaterial color="#57d5ff" toneMapped={false} />
      </mesh>
    </group>
  ));
}

function RaceRig({ boost, onPass }) {
  const carRef = useRef(null);
  const carXRef = useRef(0);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.65, -22), []);
  const speed = boost ? 34 : 21;

  useFrame((state, delta) => {
    const targetX = THREE.MathUtils.clamp(state.pointer.x * 4.45, -4.15, 4.15);
    carXRef.current = THREE.MathUtils.damp(carXRef.current, targetX, boost ? 7.5 : 5.2, delta);

    if (carRef.current) {
      carRef.current.position.x = carXRef.current;
      const steer = THREE.MathUtils.clamp(targetX - carXRef.current, -1, 1);
      carRef.current.rotation.z = THREE.MathUtils.damp(carRef.current.rotation.z, -steer * 0.18, 5, delta);
      carRef.current.rotation.y = THREE.MathUtils.damp(carRef.current.rotation.y, -steer * 0.08, 5, delta);
      carRef.current.position.y = 0.52 + Math.sin(state.clock.elapsedTime * 5.4) * 0.018;
    }

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, carXRef.current * 0.12, 3.5, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, boost ? 3.1 : 3.25, 3, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, boost ? 8.2 : 8.6, 3, delta);
    lookTarget.x = carXRef.current * 0.045;
    state.camera.lookAt(lookTarget);
  });

  return (
    <>
      <MovingTrack speed={speed} />
      <Gates speed={speed} carXRef={carXRef} onPass={onPass} />
      <HoverCar carRef={carRef} boost={boost} />
    </>
  );
}

function RacingScene({ boost, onPass }) {
  return (
    <>
      <color attach="background" args={['#04050a']} />
      <fog attach="fog" args={['#06050d', 20, 88]} />
      <ambientLight intensity={0.48} />
      <directionalLight position={[0, 8, 6]} intensity={1.25} color="#cfc6ff" />
      <pointLight position={[-5, 2.2, 2]} intensity={7} distance={18} color="#8d57ff" />
      <pointLight position={[5, 2.2, 2]} intensity={6} distance={18} color="#50d8ff" />
      <Stars radius={80} depth={48} count={900} factor={2.1} saturation={0.15} fade speed={0.8} />
      <RaceRig boost={boost} onPass={onPass} />
    </>
  );
}

export default function Hero({ site }) {
  const [boost, setBoost] = useState(false);
  const [checkpoints, setCheckpoints] = useState(0);
  const [lastGate, setLastGate] = useState('START');

  const onPass = useCallback((label) => {
    setCheckpoints((value) => value + 1);
    setLastGate(label);
  }, []);

  return (
    <section className="relative min-h-[820px] overflow-hidden border-b border-bone/[0.08] bg-ink pt-20 md:pt-24">
      <div
        className="relative h-[calc(100svh-80px)] min-h-[740px] w-full overflow-hidden bg-[#04050a]"
        onPointerDown={() => setBoost(true)}
        onPointerUp={() => setBoost(false)}
        onPointerCancel={() => setBoost(false)}
        onPointerLeave={() => setBoost(false)}
        style={{ touchAction: 'pan-y' }}
      >
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 3.25, 8.6], fov: 55, near: 0.1, far: 220 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <RacingScene boost={boost} onPass={onPass} />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,10,.32),transparent_20%,transparent_68%,rgba(4,5,10,.72)),radial-gradient(circle_at_50%_42%,transparent_0%,rgba(4,5,10,.08)_56%,rgba(4,5,10,.56)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/75 to-transparent" />

        <div className="pointer-events-none absolute left-[clamp(24px,4vw,78px)] top-[clamp(26px,4.5vw,68px)] z-20 max-w-[980px]">
          <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.28em] text-bone/42 md:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid shadow-[0_0_14px_rgba(164,107,240,.8)]" />
            RK // NIGHT RUN 2026
          </div>
          <h1 className="mt-4 text-[clamp(4.2rem,9.7vw,11.5rem)] font-semibold leading-[0.76] tracking-[-0.07em] text-bone/95 mix-blend-screen">
            RAJA KANNAN
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[9px] tracking-[0.16em] text-bone/46 md:text-[10px]">
            <span>MOTION DESIGN</span>
            <span>3D / CGI</span>
            <span>AI VISUALS</span>
            <span>PHOTOGRAPHY</span>
            <span>CREATIVE TECH</span>
          </div>
        </div>

        <div className="pointer-events-none absolute right-[clamp(20px,3vw,56px)] top-[clamp(26px,4vw,60px)] z-20 text-right font-mono">
          <div className="text-[8px] tracking-[0.24em] text-bone/34">CHECKPOINTS</div>
          <div className="mt-1 text-[clamp(1.8rem,2.4vw,3rem)] font-light tracking-[-0.04em] text-bone">
            {String(checkpoints).padStart(2, '0')}
          </div>
          <div className="mt-4 text-[8px] tracking-[0.24em] text-bone/34">SPEED</div>
          <div className={`mt-1 text-sm tracking-[0.16em] ${boost ? 'text-cyan-300' : 'text-orchid'}`}>
            {boost ? 'BOOST 340' : 'CRUISE 210'}
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[43%] z-10 -translate-x-1/2 text-center">
          <div className="font-mono text-[8px] tracking-[0.34em] text-bone/28">SECTOR</div>
          <div key={lastGate} className="mt-2 text-[clamp(1.1rem,1.8vw,2rem)] font-light tracking-[0.08em] text-bone/52 animate-pulse">
            {lastGate}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-5 px-[clamp(22px,4vw,76px)] pb-[clamp(24px,3vw,46px)] md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/work"
              className="rounded-full border border-orchid/45 bg-orchid/14 px-6 py-3.5 font-mono text-[10px] tracking-[0.16em] text-bone backdrop-blur-md transition-all hover:border-orchid/80 hover:bg-orchid/24"
            >
              ENTER THE WORK →
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-bone/12 bg-ink/28 px-6 py-3.5 font-mono text-[10px] tracking-[0.16em] text-bone/62 backdrop-blur-md transition-all hover:border-bone/30 hover:text-bone"
            >
              ABOUT
            </Link>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.18em] text-bone/38">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80" />
              MOVE / TOUCH TO STEER
            </div>
            <div className="font-mono text-[8px] tracking-[0.18em] text-bone/26">HOLD TO BOOST · PASS THROUGH THE GATES</div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-bone/[0.03] to-transparent" />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orchid/30 to-transparent" />
    </section>
  );
}
