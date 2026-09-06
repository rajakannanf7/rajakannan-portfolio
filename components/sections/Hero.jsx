'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

const LANES = [-3.6, -1.8, 0, 1.8, 3.6];
const POWERS = [
  { type: 'NITRO', color: '#67e8ff', accent: '#1c7cff' },
  { type: 'SHOCK', color: '#b66dff', accent: '#6a29ff' },
  { type: 'SHIELD', color: '#69a8ff', accent: '#2e5dff' },
];

function CarBody({ enemy = false, accent = '#9d65ff', accent2 = '#67dcff' }) {
  return (
    <group scale={enemy ? 0.9 : 1}>
      <mesh castShadow position={[0, 0.18, 0]} scale={[1.02, 0.28, 1.95]}>
        <boxGeometry args={[1.8, 1, 1]} />
        <meshPhysicalMaterial color={enemy ? '#171017' : '#0c1017'} metalness={0.96} roughness={0.16} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>

      <mesh castShadow position={[0, 0.42, -0.22]} scale={[0.72, 0.31, 1.12]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshPhysicalMaterial
          color={enemy ? '#281219' : '#121521'}
          metalness={0.9}
          roughness={0.08}
          transmission={enemy ? 0.03 : 0.08}
          emissive={enemy ? '#4e1027' : '#23154f'}
          emissiveIntensity={enemy ? 0.5 : 0.42}
        />
      </mesh>

      <mesh position={[0, 0.19, -1.58]} rotation={[Math.PI / 2, 0, Math.PI / 4]} scale={[0.74, 0.74, 1]}>
        <coneGeometry args={[0.86, 1.6, 4]} />
        <meshStandardMaterial color={enemy ? '#201218' : '#10141d'} metalness={0.96} roughness={0.14} />
      </mesh>

      {[-1.13, 1.13].map((x, i) => (
        <group key={x}>
          <mesh position={[x, 0.07, 0.18]} rotation={[0, i ? 0.08 : -0.08, i ? -0.05 : 0.05]} scale={[0.94, 0.08, 1.55]}>
            <boxGeometry />
            <meshStandardMaterial color="#070a10" metalness={0.95} roughness={0.17} />
          </mesh>
          <mesh position={[x * 0.78, 0.25, -0.16]} scale={[0.065, 0.045, 1.48]}>
            <boxGeometry />
            <meshBasicMaterial color={i ? accent2 : accent} toneMapped={false} />
          </mesh>
          <mesh position={[x * 0.97, 0.11, -1.18]} rotation={[0, i ? 0.27 : -0.27, 0]} scale={[0.42, 0.07, 0.68]}>
            <boxGeometry />
            <meshStandardMaterial color="#0d1018" metalness={0.92} roughness={0.19} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.47, 1.32]} scale={[0.84, 0.055, 0.19]}>
        <boxGeometry />
        <meshStandardMaterial color="#080a10" metalness={0.98} roughness={0.11} />
      </mesh>
      <mesh position={[-0.72, 0.53, 1.3]} scale={[0.045, 0.31, 0.045]}><boxGeometry /><meshStandardMaterial color="#0b0d14" metalness={0.95} roughness={0.12} /></mesh>
      <mesh position={[0.72, 0.53, 1.3]} scale={[0.045, 0.31, 0.045]}><boxGeometry /><meshStandardMaterial color="#0b0d14" metalness={0.95} roughness={0.12} /></mesh>

      <mesh position={[-0.56, 0.22, -1.72]} scale={[0.28, 0.055, 0.12]}><boxGeometry /><meshBasicMaterial color={accent} toneMapped={false} /></mesh>
      <mesh position={[0.56, 0.22, -1.72]} scale={[0.28, 0.055, 0.12]}><boxGeometry /><meshBasicMaterial color={accent2} toneMapped={false} /></mesh>
    </group>
  );
}

function PlayerCar({ carRef, boost, shield }) {
  const thrusters = useRef(null);
  const glow = useRef(null);
  const shieldRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (thrusters.current) {
      const pulse = 1 + Math.sin(t * 24) * 0.08;
      thrusters.current.scale.z = pulse * (boost ? 2.15 : 1);
    }
    if (glow.current) glow.current.material.opacity = 0.28 + Math.sin(t * 8) * 0.05 + (boost ? 0.18 : 0);
    if (shieldRef.current) {
      shieldRef.current.rotation.y += 0.012;
      shieldRef.current.rotation.z -= 0.006;
      shieldRef.current.material.opacity = shield ? 0.18 + Math.sin(t * 6) * 0.05 : 0;
    }
  });

  return (
    <group ref={carRef} position={[0, 0.55, 4.1]}>
      <CarBody />
      <group ref={thrusters} position={[0, 0.11, 1.7]}>
        {[-0.53, 0.53].map((x, i) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.16, 1.25, 18]} />
            <meshBasicMaterial color={i ? '#67e6ff' : '#ae68ff'} transparent opacity={0.92} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh ref={glow} position={[0, -0.24, 0.16]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 48]} />
        <meshBasicMaterial color="#7343ec" transparent opacity={0.34} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh ref={shieldRef} visible={shield} scale={[1.9, 1.15, 2.7]}>
        <sphereGeometry args={[1, 28, 18]} />
        <meshBasicMaterial color="#72a7ff" transparent opacity={0.16} wireframe depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.15, 1.35]} intensity={boost ? 8 : 4.5} distance={7} color="#8d5bff" />
    </group>
  );
}

function Road({ speed }) {
  const refs = useRef([]);
  const archRefs = useRef([]);
  const cityRefs = useRef([]);
  const count = 34;
  const spacing = 6;

  useFrame((state, delta) => {
    const dz = speed * delta;
    refs.current.forEach((g) => {
      if (!g) return;
      g.position.z += dz;
      if (g.position.z > 13) g.position.z -= count * spacing;
    });
    archRefs.current.forEach((g) => {
      if (!g) return;
      g.position.z += dz;
      if (g.position.z > 11) g.position.z -= 15 * 18;
    });
    cityRefs.current.forEach((g) => {
      if (!g) return;
      g.position.z += dz * 0.82;
      if (g.position.z > 15) g.position.z -= 26 * 14;
    });
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <group key={`road-${i}`} ref={(el) => { refs.current[i] = el; }} position={[0, 0, 8 - i * spacing]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]} receiveShadow>
            <planeGeometry args={[13.5, spacing + 0.08]} />
            <meshPhysicalMaterial color={i % 2 ? '#080a11' : '#0a0c13'} metalness={0.58} roughness={0.34} clearcoat={0.5} />
          </mesh>

          {[-4.5, -2.25, 0, 2.25, 4.5].map((x, n) => (
            <mesh key={x} position={[x, 0.01, 0]} scale={[0.025, 0.012, n === 2 ? 1.25 : 0.88]}>
              <boxGeometry />
              <meshBasicMaterial color={n < 2 ? '#6c5cff' : n > 2 ? '#45d7ff' : '#9b75ff'} transparent opacity={n === 2 ? 0.52 : 0.22} toneMapped={false} />
            </mesh>
          ))}

          <mesh position={[-6.58, 0.13, 0]} scale={[0.08, 0.14, spacing * 0.49]}><boxGeometry /><meshBasicMaterial color="#8d54ff" toneMapped={false} /></mesh>
          <mesh position={[6.58, 0.13, 0]} scale={[0.08, 0.14, spacing * 0.49]}><boxGeometry /><meshBasicMaterial color="#45d7ff" toneMapped={false} /></mesh>
          <mesh position={[-6.15, 0.01, 0]} scale={[0.34, 0.012, spacing * 0.47]}><boxGeometry /><meshBasicMaterial color="#3d1c7f" transparent opacity={0.28} toneMapped={false} /></mesh>
          <mesh position={[6.15, 0.01, 0]} scale={[0.34, 0.012, spacing * 0.47]}><boxGeometry /><meshBasicMaterial color="#174f69" transparent opacity={0.28} toneMapped={false} /></mesh>
        </group>
      ))}

      {Array.from({ length: 15 }, (_, i) => (
        <group key={`arch-${i}`} ref={(el) => { archRefs.current[i] = el; }} position={[0, 0, -14 - i * 18]}>
          <mesh position={[-7.35, 2.75, 0]} scale={[0.09, 2.75, 0.09]}><boxGeometry /><meshBasicMaterial color={i % 2 ? '#6a36d8' : '#254c9f'} transparent opacity={0.78} toneMapped={false} /></mesh>
          <mesh position={[7.35, 2.75, 0]} scale={[0.09, 2.75, 0.09]}><boxGeometry /><meshBasicMaterial color={i % 2 ? '#1c6e8d' : '#5133b5'} transparent opacity={0.78} toneMapped={false} /></mesh>
          <mesh position={[0, 5.5, 0]} scale={[7.42, 0.07, 0.1]}><boxGeometry /><meshBasicMaterial color={i % 2 ? '#7650ef' : '#3ca4ce'} transparent opacity={0.42} toneMapped={false} /></mesh>
          <mesh position={[-5.8, 4.65, 0]} rotation={[0, 0, -0.6]} scale={[2.15, 0.045, 0.075]}><boxGeometry /><meshBasicMaterial color="#a06cff" transparent opacity={0.35} toneMapped={false} /></mesh>
          <mesh position={[5.8, 4.65, 0]} rotation={[0, 0, 0.6]} scale={[2.15, 0.045, 0.075]}><boxGeometry /><meshBasicMaterial color="#62ddff" transparent opacity={0.35} toneMapped={false} /></mesh>
        </group>
      ))}

      {Array.from({ length: 26 }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const x = side * (9.5 + (i % 4) * 1.7);
        const h = 2.6 + ((i * 7) % 8) * 0.75;
        const w = 1.5 + (i % 3) * 0.7;
        return (
          <group key={`city-${i}`} ref={(el) => { cityRefs.current[i] = el; }} position={[x, h * 0.5 - 0.1, -20 - i * 14]}>
            <mesh scale={[w, h, 2.2]}>
              <boxGeometry />
              <meshStandardMaterial color="#070912" metalness={0.62} roughness={0.58} emissive={side > 0 ? '#07172a' : '#130922'} emissiveIntensity={0.36} />
            </mesh>
            {[-0.5, 0, 0.5].map((yy, k) => (
              <mesh key={k} position={[side > 0 ? -w * 0.51 : w * 0.51, yy * h, 0]} scale={[0.02, 0.06, 1.55]}>
                <boxGeometry />
                <meshBasicMaterial color={side > 0 ? '#54dfff' : '#a26cff'} transparent opacity={0.35 + k * 0.08} toneMapped={false} />
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
}

function EnemyFleet({ speed, gameRef, shockSeq, onHit, onNearMiss, onOvertake }) {
  const refs = useRef([]);
  const lastShock = useRef(shockSeq);
  const configs = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    lane: (i * 2 + 1) % LANES.length,
    z: -24 - i * 24,
    pace: 0.43 + (i % 4) * 0.055,
    accent: i % 2 ? '#ff3f6f' : '#ff7b45',
    accent2: i % 3 ? '#ffb044' : '#ff4b88',
  })), []);

  useFrame((state, delta) => {
    if (lastShock.current !== shockSeq) {
      lastShock.current = shockSeq;
      refs.current.forEach((g) => {
        if (!g) return;
        g.userData.stun = 1.55;
        g.userData.spin = (Math.random() > 0.5 ? 1 : -1) * 4.5;
      });
    }

    refs.current.forEach((g, i) => {
      if (!g) return;
      const cfg = configs[i];
      g.userData.stun = Math.max(0, (g.userData.stun || 0) - delta);
      const stunned = g.userData.stun > 0;
      const approach = speed * cfg.pace * (stunned ? 1.55 : 1);
      g.position.z += approach * delta;

      const laneBase = LANES[(cfg.lane + (g.userData.cycle || 0)) % LANES.length];
      const drift = Math.sin(state.clock.elapsedTime * (0.5 + i * 0.04) + i) * (i % 2 ? 0.42 : 0.24);
      g.position.x = THREE.MathUtils.damp(g.position.x, laneBase + drift, stunned ? 2 : 4, delta);
      g.position.y = 0.52 + Math.sin(state.clock.elapsedTime * 4.1 + i) * 0.025;
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, stunned ? g.userData.spin * 0.14 : -drift * 0.035, 4, delta);
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, drift * -0.018, 4, delta);

      const dx = Math.abs(gameRef.current.playerX - g.position.x);
      const inHitZone = g.position.z > 2.35 && g.position.z < 5.65;
      if (inHitZone && dx < 1.0 && !g.userData.hit) {
        g.userData.hit = true;
        onHit(i);
        g.userData.stun = 0.7;
      }

      if (g.position.z > 5.8 && !g.userData.scored && !g.userData.hit) {
        g.userData.scored = true;
        if (dx < 1.9) onNearMiss();
        else onOvertake();
      }

      if (g.position.z > 12) {
        g.position.z = -118 - i * 19 - Math.random() * 30;
        g.userData.cycle = (g.userData.cycle || 0) + 1;
        g.userData.hit = false;
        g.userData.scored = false;
        g.userData.stun = 0;
      }
    });
  });

  return configs.map((cfg, i) => (
    <group
      key={`enemy-${i}`}
      ref={(el) => {
        refs.current[i] = el;
        if (el && !el.userData.init) {
          el.position.set(LANES[cfg.lane], 0.52, cfg.z);
          el.userData.init = true;
          el.userData.hit = false;
          el.userData.scored = false;
          el.userData.cycle = 0;
          el.userData.stun = 0;
        }
      }}
    >
      <CarBody enemy accent={cfg.accent} accent2={cfg.accent2} />
      <mesh position={[0, -0.2, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.22, 32]} />
        <meshBasicMaterial color={cfg.accent} transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.2, 1.35]} intensity={3.6} distance={5} color={cfg.accent} />
    </group>
  ));
}

function PowerUps({ speed, gameRef, onPickup }) {
  const refs = useRef([]);
  const configs = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    ...POWERS[i % POWERS.length],
    lane: (i * 3 + 1) % LANES.length,
    z: -40 - i * 34,
  })), []);

  useFrame((state, delta) => {
    refs.current.forEach((g, i) => {
      if (!g) return;
      g.position.z += speed * delta * 0.62;
      g.rotation.y += delta * 1.5;
      g.rotation.x += delta * 0.45;
      g.position.y = 1.05 + Math.sin(state.clock.elapsedTime * 2.4 + i) * 0.15;

      const dx = Math.abs(gameRef.current.playerX - g.position.x);
      if (!g.userData.collected && g.position.z > 2.3 && g.position.z < 5.5 && dx < 1.15) {
        g.userData.collected = true;
        onPickup(configs[i].type);
      }
      if (g.position.z > 12) {
        g.position.z = -150 - i * 31 - Math.random() * 40;
        g.position.x = LANES[(configs[i].lane + Math.floor(Math.random() * 3)) % LANES.length];
        g.userData.collected = false;
      }
      g.visible = !g.userData.collected;
    });
  });

  return configs.map((p, i) => (
    <group
      key={`power-${i}`}
      ref={(el) => {
        refs.current[i] = el;
        if (el && !el.userData.init) {
          el.position.set(LANES[p.lane], 1.05, p.z);
          el.userData.init = true;
          el.userData.collected = false;
        }
      }}
    >
      <mesh>
        <octahedronGeometry args={[0.56, 1]} />
        <meshPhysicalMaterial color="#0c1020" metalness={0.8} roughness={0.12} emissive={p.accent} emissiveIntensity={1.6} />
      </mesh>
      <mesh scale={1.38}>
        <torusGeometry args={[0.62, 0.035, 10, 42]} />
        <meshBasicMaterial color={p.color} transparent opacity={0.82} toneMapped={false} />
      </mesh>
      <pointLight intensity={5} distance={6} color={p.color} />
    </group>
  ));
}

function ShockWave({ seq }) {
  const mesh = useRef(null);
  const seen = useRef(seq);
  const age = useRef(99);

  useFrame((_, delta) => {
    if (seen.current !== seq) {
      seen.current = seq;
      age.current = 0;
    }
    age.current += delta;
    if (!mesh.current) return;
    const t = Math.min(age.current / 0.85, 1);
    mesh.current.visible = t < 1;
    mesh.current.scale.setScalar(0.35 + t * 10.5);
    mesh.current.material.opacity = (1 - t) * 0.75;
  });

  return (
    <mesh ref={mesh} position={[0, 0.7, 2.8]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
      <torusGeometry args={[1, 0.04, 10, 64]} />
      <meshBasicMaterial color="#b176ff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </mesh>
  );
}

function BrandSigns({ speed }) {
  const refs = useRef([]);
  const textures = useMemo(() => ['RAJA', 'KANNAN', 'MOTION', 'CGI', 'AI', 'PHOTO'].map((word, idx) => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = idx % 2 ? '#67dfff' : '#b176ff';
    ctx.font = '700 132px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, 512, 134);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }), []);

  useFrame((_, delta) => {
    refs.current.forEach((g, i) => {
      if (!g) return;
      g.position.z += speed * delta * 0.9;
      if (g.position.z > 10) g.position.z -= 170;
    });
  });

  return textures.map((tex, i) => tex && (
    <group key={i} ref={(el) => { refs.current[i] = el; }} position={[i % 2 ? 9.8 : -9.8, 3.8 + (i % 3), -36 - i * 27]} rotation={[0, i % 2 ? -0.34 : 0.34, 0]}>
      <mesh>
        <planeGeometry args={[7.2, 1.8]} />
        <meshBasicMaterial map={tex} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.08]} scale={[1.08, 1.32, 1]}>
        <planeGeometry args={[7.2, 1.8]} />
        <meshBasicMaterial color="#060810" transparent opacity={0.75} />
      </mesh>
    </group>
  ));
}

function RaceRig({ boost, shield, shockSeq, gameRef, onHit, onNearMiss, onOvertake, onPickup }) {
  const carRef = useRef(null);
  const look = useMemo(() => new THREE.Vector3(0, 0.68, -24), []);
  const speed = boost ? 36 : 24;

  useFrame((state, delta) => {
    const keys = gameRef.current.keys;
    let keyboard = 0;
    if (keys.left) keyboard -= 1;
    if (keys.right) keyboard += 1;
    const pointerTarget = THREE.MathUtils.clamp(state.pointer.x * 5.2, -4.5, 4.5);
    const targetX = keyboard ? THREE.MathUtils.clamp(gameRef.current.playerX + keyboard * delta * 10, -4.5, 4.5) : pointerTarget;
    gameRef.current.playerX = THREE.MathUtils.damp(gameRef.current.playerX, targetX, boost ? 8 : 6, delta);

    if (carRef.current) {
      const steer = THREE.MathUtils.clamp(targetX - gameRef.current.playerX, -1, 1);
      carRef.current.position.x = gameRef.current.playerX;
      carRef.current.position.y = 0.55 + Math.sin(state.clock.elapsedTime * 5.5) * 0.018;
      carRef.current.rotation.z = THREE.MathUtils.damp(carRef.current.rotation.z, -steer * 0.22, 5, delta);
      carRef.current.rotation.y = THREE.MathUtils.damp(carRef.current.rotation.y, -steer * 0.09, 5, delta);
    }

    const shake = gameRef.current.shake || 0;
    gameRef.current.shake = Math.max(0, shake - delta * 1.8);
    const jitterX = shake ? (Math.random() - 0.5) * shake * 0.24 : 0;
    const jitterY = shake ? (Math.random() - 0.5) * shake * 0.16 : 0;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, gameRef.current.playerX * 0.14 + jitterX, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, (boost ? 3.12 : 3.3) + jitterY, 4, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, boost ? 8.4 : 9.0, 4, delta);
    state.camera.fov = THREE.MathUtils.damp(state.camera.fov, boost ? 61 : 56, 4.2, delta);
    state.camera.updateProjectionMatrix();
    look.x = gameRef.current.playerX * 0.055;
    state.camera.lookAt(look);
  });

  return (
    <>
      <Road speed={speed} />
      <BrandSigns speed={speed} />
      <EnemyFleet speed={speed} gameRef={gameRef} shockSeq={shockSeq} onHit={onHit} onNearMiss={onNearMiss} onOvertake={onOvertake} />
      <PowerUps speed={speed} gameRef={gameRef} onPickup={onPickup} />
      <ShockWave seq={shockSeq} />
      <PlayerCar carRef={carRef} boost={boost} shield={shield} />
    </>
  );
}

function Scene(props) {
  return (
    <>
      <color attach="background" args={['#03040a']} />
      <fog attach="fog" args={['#080611', 18, 92]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 9, 7]} intensity={1.65} color="#ddd7ff" />
      <pointLight position={[-6, 2.4, 4]} intensity={8} distance={22} color="#8655ff" />
      <pointLight position={[6, 2.4, 4]} intensity={7} distance={22} color="#4ad9ff" />
      <Stars radius={90} depth={55} count={1200} factor={2.2} saturation={0.15} fade speed={0.7} />
      <Sparkles count={150} scale={[18, 7, 90]} size={1.2} speed={1.25} opacity={0.24} color="#b5b8ff" />
      <RaceRig {...props} />
    </>
  );
}

export default function Hero() {
  const [pointerBoost, setPointerBoost] = useState(false);
  const [keyboardBoost, setKeyboardBoost] = useState(false);
  const [nitro, setNitro] = useState(false);
  const [shield, setShield] = useState(false);
  const [power, setPower] = useState(null);
  const [shockSeq, setShockSeq] = useState(0);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [rivals, setRivals] = useState(7);
  const [message, setMessage] = useState('MOVE TO STEER · HOLD TO BOOST');
  const [flash, setFlash] = useState(0);
  const gameRef = useRef({ playerX: 0, shake: 0, keys: { left: false, right: false } });
  const timers = useRef([]);

  const clearLater = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const boost = pointerBoost || keyboardBoost || nitro;

  const usePower = useCallback(() => {
    if (!power) return;
    if (power === 'NITRO') {
      setNitro(true);
      setMessage('NITRO OVERDRIVE');
      clearLater(() => setNitro(false), 2500);
      clearLater(() => setMessage('MOVE TO STEER · HOLD TO BOOST'), 2900);
    } else if (power === 'SHIELD') {
      setShield(true);
      setMessage('ION SHIELD ACTIVE');
      clearLater(() => setShield(false), 4200);
      clearLater(() => setMessage('MOVE TO STEER · HOLD TO BOOST'), 4550);
    } else if (power === 'SHOCK') {
      setShockSeq((v) => v + 1);
      setScore((v) => v + 450);
      setMessage('ELECTRO SHOCK RELEASED');
      setFlash(0.38);
      clearLater(() => setFlash(0), 220);
      clearLater(() => setMessage('MOVE TO STEER · HOLD TO BOOST'), 1200);
    }
    setPower(null);
  }, [power, clearLater]);

  useEffect(() => {
    const down = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || e.key === 'ArrowLeft') gameRef.current.keys.left = true;
      if (key === 'd' || e.key === 'ArrowRight') gameRef.current.keys.right = true;
      if (e.key === 'Shift') setKeyboardBoost(true);
      if (e.code === 'Space') {
        e.preventDefault();
        usePower();
      }
    };
    const up = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || e.key === 'ArrowLeft') gameRef.current.keys.left = false;
      if (key === 'd' || e.key === 'ArrowRight') gameRef.current.keys.right = false;
      if (e.key === 'Shift') setKeyboardBoost(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [usePower]);

  const onHit = useCallback(() => {
    gameRef.current.shake = shield ? 0.45 : 1;
    setFlash(shield ? 0.25 : 0.65);
    clearLater(() => setFlash(0), 180);
    if (shield) {
      setScore((v) => v + 180);
      setMessage('SHIELD IMPACT +180');
    } else {
      setHealth((v) => {
        const next = Math.max(0, v - 25);
        if (next === 0) {
          clearLater(() => setHealth(100), 900);
          setMessage('SYSTEM REBOOT');
        } else setMessage('IMPACT — RECOVER');
        return next;
      });
    }
    clearLater(() => setMessage('MOVE TO STEER · HOLD TO BOOST'), 1100);
  }, [shield, clearLater]);

  const onNearMiss = useCallback(() => {
    setScore((v) => v + 120);
    setMessage('NEAR MISS +120');
    clearLater(() => setMessage('MOVE TO STEER · HOLD TO BOOST'), 650);
  }, [clearLater]);

  const onOvertake = useCallback(() => {
    setScore((v) => v + 40);
  }, []);

  const onPickup = useCallback((type) => {
    setPower(type);
    setScore((v) => v + 90);
    setMessage(`${type} ACQUIRED · SPACE / TAP TO FIRE`);
  }, []);

  return (
    <section className="relative min-h-[820px] overflow-hidden border-b border-bone/[0.08] bg-ink pt-20 md:pt-24">
      <div
        className="relative h-[calc(100svh-80px)] min-h-[740px] w-full overflow-hidden bg-[#03040a]"
        onPointerDown={(e) => {
          if (e.target.closest?.('a,button')) return;
          setPointerBoost(true);
        }}
        onPointerUp={() => setPointerBoost(false)}
        onPointerCancel={() => setPointerBoost(false)}
        onPointerLeave={() => setPointerBoost(false)}
        style={{ touchAction: 'none' }}
      >
        <Canvas
          dpr={[1, 1.65]}
          camera={{ position: [0, 3.3, 9], fov: 56, near: 0.1, far: 230 }}
          shadows
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.18;
          }}
        >
          <Suspense fallback={null}>
            <Scene
              boost={boost}
              shield={shield}
              shockSeq={shockSeq}
              gameRef={gameRef}
              onHit={onHit}
              onNearMiss={onNearMiss}
              onOvertake={onOvertake}
              onPickup={onPickup}
            />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,4,10,.18),transparent_32%,transparent_70%,rgba(3,4,10,.62)),radial-gradient(circle_at_50%_52%,transparent_30%,rgba(3,4,10,.12)_65%,rgba(3,4,10,.48)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/65 to-transparent" />
        <div className="pointer-events-none absolute inset-0 transition-opacity duration-150" style={{ opacity: flash, background: 'radial-gradient(circle at 50% 58%, rgba(190,125,255,.85), rgba(83,177,255,.18) 34%, transparent 70%)', mixBlendMode: 'screen' }} />

        <div className="pointer-events-none absolute left-[clamp(20px,3.8vw,72px)] top-[clamp(24px,4vw,58px)] z-20">
          <div className="flex items-center gap-3 font-mono text-[8px] tracking-[0.3em] text-bone/40 md:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid shadow-[0_0_16px_rgba(164,107,240,.9)]" />
            RK // COMBAT RUN 2026
          </div>
          <h1 className="mt-3 text-[clamp(2.7rem,6vw,7.2rem)] font-semibold leading-[0.82] tracking-[-0.06em] text-bone/92 mix-blend-screen">
            RAJA KANNAN
          </h1>
          <div className="mt-3 font-mono text-[8px] tracking-[0.2em] text-bone/36 md:text-[9px]">MOTION · 3D · AI · PHOTO · CREATIVE TECHNOLOGY</div>
        </div>

        <div className="pointer-events-none absolute right-[clamp(18px,3vw,52px)] top-[clamp(24px,3.5vw,54px)] z-20 min-w-[180px] text-right font-mono">
          <div className="text-[8px] tracking-[0.24em] text-bone/32">SCORE</div>
          <div className="mt-1 text-[clamp(1.7rem,2.4vw,3rem)] font-light tracking-[-0.04em] text-bone">{String(score).padStart(6, '0')}</div>
          <div className="mt-4 flex justify-end gap-5 text-[8px] tracking-[0.2em] text-bone/32">
            <span>RIVALS {String(rivals).padStart(2, '0')}</span>
            <span>{boost ? 'BOOST' : 'CRUISE'} {boost ? '360' : '240'}</span>
          </div>
          <div className="mt-3 ml-auto h-[3px] w-[150px] overflow-hidden rounded-full bg-bone/10">
            <div className={`h-full transition-all duration-300 ${health > 50 ? 'bg-cyan-300/80' : health > 25 ? 'bg-amber-300/80' : 'bg-rose-400/90'}`} style={{ width: `${health}%` }} />
          </div>
          <div className="mt-1 text-[7px] tracking-[0.2em] text-bone/28">INTEGRITY {health}%</div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[18%] z-20 -translate-x-1/2 text-center">
          <div className="font-mono text-[8px] tracking-[0.3em] text-bone/25">ARCADE COMBAT RACING</div>
          <div key={message} className="mt-2 rounded-full border border-bone/8 bg-ink/25 px-4 py-2 font-mono text-[8px] tracking-[0.18em] text-bone/55 backdrop-blur-sm md:text-[9px]">{message}</div>
        </div>

        <div className="absolute bottom-[clamp(24px,3vw,46px)] left-[clamp(20px,3.8vw,72px)] z-30 flex flex-wrap items-end gap-3">
          <Link href="/work" className="rounded-full border border-orchid/45 bg-orchid/14 px-5 py-3 font-mono text-[9px] tracking-[0.17em] text-bone backdrop-blur-md transition-all hover:border-orchid/80 hover:bg-orchid/24 md:px-6 md:py-3.5 md:text-[10px]">
            ENTER THE WORK →
          </Link>
          <Link href="/about" className="rounded-full border border-bone/12 bg-ink/30 px-5 py-3 font-mono text-[9px] tracking-[0.17em] text-bone/62 backdrop-blur-md transition-all hover:border-bone/30 hover:text-bone md:px-6 md:py-3.5 md:text-[10px]">
            ABOUT
          </Link>
        </div>

        <div className="absolute bottom-[clamp(24px,3vw,46px)] right-[clamp(20px,3vw,52px)] z-30 flex items-end gap-4">
          <div className="pointer-events-none hidden text-right font-mono text-[8px] leading-[1.9] tracking-[0.18em] text-bone/30 md:block">
            A / D OR MOUSE — STEER<br />HOLD — BOOST · SPACE — POWER
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); usePower(); }}
            disabled={!power}
            className={`relative flex h-[68px] w-[68px] items-center justify-center rounded-full border font-mono text-[8px] tracking-[0.12em] backdrop-blur-md transition-all md:h-[78px] md:w-[78px] ${power ? 'border-orchid/70 bg-orchid/18 text-bone shadow-[0_0_36px_rgba(154,88,255,.22)] hover:scale-105 hover:bg-orchid/28' : 'cursor-default border-bone/10 bg-ink/35 text-bone/24'}`}
          >
            <span className="text-center leading-[1.35]">{power || 'POWER'}<br /><span className="text-[6px] opacity-55">{power ? 'FIRE' : 'EMPTY'}</span></span>
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-bone/[0.025] to-transparent" />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orchid/30 to-transparent" />
    </section>
  );
}
