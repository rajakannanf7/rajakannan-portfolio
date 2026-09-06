'use client';

import { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const GATE_LABELS = ['MOTION', '3D / CGI', 'AI', 'PHOTO', 'REALTIME', 'LAB'];
const LANES = [-3.4, -1.7, 0, 1.7, 3.4];

function RacerShell({ enemy = false, accent = '#9d65ff', accent2 = '#63d8ff' }) {
  return (
    <group scale={enemy ? 0.82 : 1}>
      <mesh position={[0, 0.08, 0.12]} scale={[1.04, 0.24, 1.88]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color={enemy ? '#171018' : '#0e1119'} metalness={0.96} roughness={0.14} />
      </mesh>

      <mesh position={[0, 0.26, -0.18]} scale={[0.72, 0.30, 1.02]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial
          color={enemy ? '#24121d' : '#12131e'}
          metalness={0.9}
          roughness={0.08}
          emissive={enemy ? '#4a1026' : '#211044'}
          emissiveIntensity={enemy ? 0.62 : 0.42}
        />
      </mesh>

      <mesh position={[0, 0.08, -1.38]} rotation={[Math.PI / 2, 0, Math.PI / 4]} scale={[0.66, 0.66, 1]}>
        <coneGeometry args={[0.78, 1.45, 4]} />
        <meshStandardMaterial color={enemy ? '#21131b' : '#11141c'} metalness={0.95} roughness={0.16} />
      </mesh>

      <mesh position={[-1.05, 0.02, 0.15]} rotation={[0, -0.06, 0.06]} scale={[0.92, 0.08, 1.44]}>
        <boxGeometry />
        <meshStandardMaterial color="#080a10" metalness={0.94} roughness={0.18} />
      </mesh>
      <mesh position={[1.05, 0.02, 0.15]} rotation={[0, 0.06, -0.06]} scale={[0.92, 0.08, 1.44]}>
        <boxGeometry />
        <meshStandardMaterial color="#080a10" metalness={0.94} roughness={0.18} />
      </mesh>

      <mesh position={[-0.96, 0.17, -0.76]} rotation={[0, -0.24, 0.02]} scale={[0.56, 0.08, 0.92]}>
        <boxGeometry />
        <meshStandardMaterial color="#10121a" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0.96, 0.17, -0.76]} rotation={[0, 0.24, -0.02]} scale={[0.56, 0.08, 0.92]}>
        <boxGeometry />
        <meshStandardMaterial color="#10121a" metalness={0.92} roughness={0.18} />
      </mesh>

      <mesh position={[-0.72, 0.22, -0.23]} scale={[0.065, 0.055, 1.46]}>
        <boxGeometry />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      <mesh position={[0.72, 0.22, -0.23]} scale={[0.065, 0.055, 1.46]}>
        <boxGeometry />
        <meshBasicMaterial color={accent2} toneMapped={false} />
      </mesh>

      <mesh position={[-0.58, 0.16, -1.58]} scale={[0.34, 0.06, 0.12]}>
        <boxGeometry />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      <mesh position={[0.58, 0.16, -1.58]} scale={[0.34, 0.06, 0.12]}>
        <boxGeometry />
        <meshBasicMaterial color={accent2} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0.38, 1.22]} scale={[0.75, 0.06, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="#08090e" metalness={0.98} roughness={0.12} />
      </mesh>
      <mesh position={[-0.64, 0.43, 1.22]} scale={[0.05, 0.34, 0.05]}>
        <boxGeometry />
        <meshStandardMaterial color="#0b0c12" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0.64, 0.43, 1.22]} scale={[0.05, 0.34, 0.05]}>
        <boxGeometry />
        <meshStandardMaterial color="#0b0c12" metalness={0.95} roughness={0.15} />
      </mesh>
    </group>
  );
}

function HoverCar({ carRef, boost }) {
  const thrusterRef = useRef(null);
  const glowRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (thrusterRef.current) {
      const pulse = 1 + Math.sin(t * 20) * 0.10;
      thrusterRef.current.scale.set(1, 1, pulse * (boost ? 1.95 : 1));
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.34 + Math.sin(t * 7) * 0.05 + (boost ? 0.22 : 0);
    }
  });

  return (
    <group ref={carRef} position={[0, 0.54, 3.15]}>
      <RacerShell />
      <group ref={thrusterRef} position={[0, 0.08, 1.52]}>
        <mesh position={[-0.47, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.14, 1.02, 18]} />
          <meshBasicMaterial color="#a96fff" transparent opacity={0.90} toneMapped={false} />
        </mesh>
        <mesh position={[0.47, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.14, 1.02, 18]} />
          <meshBasicMaterial color="#62dcff" transparent opacity={0.90} toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={glowRef} position={[0, -0.25, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.55, 42]} />
        <meshBasicMaterial color="#7640e7" transparent opacity={0.38} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.15, 1.25]} intensity={5} distance={5} color="#8758ff" />
    </group>
  );
}

function EnemyCar({ accent, accent2 }) {
  return (
    <group>
      <RacerShell enemy accent={accent} accent2={accent2} />
      <mesh position={[0, -0.19, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 28]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.1, 1.2]} intensity={3.5} distance={4.5} color={accent} />
    </group>
  );
}

function MovingTrack({ speed }) {
  const segmentRefs = useRef([]);
  const postRefs = useRef([]);
  const count = 34;
  const spacing = 5.8;

  useFrame((_, delta) => {
    const dz = speed * delta;
    segmentRefs.current.forEach((group) => {
      if (!group) return;
      group.position.z += dz;
      if (group.position.z > 12) group.position.z -= count * spacing;
    });
    postRefs.current.forEach((group) => {
      if (!group) return;
      group.position.z += dz;
      if (group.position.z > 11) group.position.z -= 20 * 10.5;
    });
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} ref={(el) => { segmentRefs.current[i] = el; }} position={[0, 0, -i * spacing + 8]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
            <planeGeometry args={[12, spacing + 0.05]} />
            <meshStandardMaterial color={i % 2 ? '#080910' : '#0b0c14'} metalness={0.52} roughness={0.62} />
          </mesh>

          <mesh position={[0, 0.012, 0]} scale={[0.035, 0.018, 1.22]}>
            <boxGeometry />
            <meshBasicMaterial color="#8c68ff" transparent opacity={i % 2 ? 0.15 : 0.52} toneMapped={false} />
          </mesh>
          {[-3.4, -1.7, 1.7, 3.4].map((x, laneIndex) => (
            <mesh key={x} position={[x, 0.013, 0]} scale={[0.026, 0.014, laneIndex % 2 ? 0.72 : 0.94]}>
              <boxGeometry />
              <meshBasicMaterial color={laneIndex < 2 ? '#695aff' : '#4dc7e9'} transparent opacity={0.24} toneMapped={false} />
            </mesh>
          ))}

          <mesh position={[-6.02, 0.12, 0]} scale={[0.07, 0.13, spacing * 0.5]}>
            <boxGeometry />
            <meshBasicMaterial color="#8d55ff" transparent opacity={0.85} toneMapped={false} />
          </mesh>
          <mesh position={[6.02, 0.12, 0]} scale={[0.07, 0.13, spacing * 0.5]}>
            <boxGeometry />
            <meshBasicMaterial color="#4bd8ff" transparent opacity={0.85} toneMapped={false} />
          </mesh>
          <mesh position={[-5.7, -0.015, 0]} scale={[0.22, 0.01, spacing * 0.49]}>
            <boxGeometry />
            <meshBasicMaterial color="#401e82" transparent opacity={0.24} toneMapped={false} />
          </mesh>
          <mesh position={[5.7, -0.015, 0]} scale={[0.22, 0.01, spacing * 0.49]}>
            <boxGeometry />
            <meshBasicMaterial color="#13536b" transparent opacity={0.24} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 20 }, (_, i) => (
        <group key={`post-${i}`} ref={(el) => { postRefs.current[i] = el; }} position={[0, 0, -i * 10.5]}>
          <mesh position={[-7.2, 1.7, 0]} scale={[0.06, 1.7, 0.06]}>
            <boxGeometry />
            <meshBasicMaterial color="#6736cf" toneMapped={false} />
          </mesh>
          <mesh position={[7.2, 1.7, 0]} scale={[0.06, 1.7, 0.06]}>
            <boxGeometry />
            <meshBasicMaterial color="#2586a8" toneMapped={false} />
          </mesh>
          <mesh position={[-7.2, 3.38, 0]} scale={[0.28, 0.05, 0.28]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#b985ff" toneMapped={false} />
          </mesh>
          <mesh position={[7.2, 3.38, 0]} scale={[0.28, 0.05, 0.28]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#6fe9ff" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function TrackArchitecture({ speed }) {
  const archRefs = useRef([]);
  const blockRefs = useRef([]);
  const streakRefs = useRef([]);

  useFrame((state, delta) => {
    const dz = speed * delta;
    archRefs.current.forEach((group) => {
      if (!group) return;
      group.position.z += dz;
      if (group.position.z > 9) group.position.z -= 15 * 18;
    });
    blockRefs.current.forEach((group) => {
      if (!group) return;
      group.position.z += dz * 0.82;
      if (group.position.z > 14) group.position.z -= 24 * 14;
    });
    streakRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.position.z += dz * (1.35 + (i % 5) * 0.06);
      if (mesh.position.z > 10) mesh.position.z -= 190;
      mesh.material.opacity = 0.14 + Math.sin(state.clock.elapsedTime * 5 + i) * 0.06;
    });
  });

  return (
    <>
      {Array.from({ length: 15 }, (_, i) => (
        <group key={`arch-${i}`} ref={(el) => { archRefs.current[i] = el; }} position={[0, 0, -i * 18 - 14]}>
          <mesh position={[-7.4, 2.45, 0]} scale={[0.11, 2.45, 0.11]}>
            <boxGeometry />
            <meshBasicMaterial color={i % 2 ? '#4f2c9b' : '#233e86'} transparent opacity={0.76} toneMapped={false} />
          </mesh>
          <mesh position={[7.4, 2.45, 0]} scale={[0.11, 2.45, 0.11]}>
            <boxGeometry />
            <meshBasicMaterial color={i % 2 ? '#1d6681' : '#4430a4'} transparent opacity={0.76} toneMapped={false} />
          </mesh>
          <mesh position={[0, 4.9, 0]} scale={[7.5, 0.08, 0.12]}>
            <boxGeometry />
            <meshBasicMaterial color={i % 2 ? '#6843dd' : '#2e91b5'} transparent opacity={0.35} toneMapped={false} />
          </mesh>
          <mesh position={[-5.9, 4.4, 0]} rotation={[0, 0, -0.55]} scale={[2.0, 0.045, 0.08]}>
            <boxGeometry />
            <meshBasicMaterial color="#8b5cff" transparent opacity={0.26} toneMapped={false} />
          </mesh>
          <mesh position={[5.9, 4.4, 0]} rotation={[0, 0, 0.55]} scale={[2.0, 0.045, 0.08]}>
            <boxGeometry />
            <meshBasicMaterial color="#4fceec" transparent opacity={0.26} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 24 }, (_, i) => {
        const side = i % 2 ? -1 : 1;
        const height = 1.6 + (i % 5) * 0.7;
        return (
          <group key={`city-${i}`} ref={(el) => { blockRefs.current[i] = el; }} position={[side * (9.2 + (i % 3) * 2.4), 0, -i * 14 - 8]}>
            <mesh position={[0, height / 2, 0]} scale={[1.4 + (i % 4) * 0.35, height, 1.7]}>
              <boxGeometry />
              <meshStandardMaterial color="#080911" metalness={0.72} roughness={0.34} emissive={side > 0 ? '#08273b' : '#24103c'} emissiveIntensity={0.28} />
            </mesh>
            <mesh position={[-0.48, height * 0.75, side > 0 ? 0.86 : -0.86]} scale={[0.035, 0.18, 0.02]}>
              <boxGeometry />
              <meshBasicMaterial color={side > 0 ? '#56dcff' : '#ad6dff'} transparent opacity={0.72} toneMapped={false} />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: 34 }, (_, i) => {
        const side = i % 2 ? -1 : 1;
        const x = side * (6.7 + ((i * 1.37) % 6));
        const y = 0.4 + ((i * 0.71) % 4.5);
        return (
          <mesh key={`streak-${i}`} ref={(el) => { streakRefs.current[i] = el; }} position={[x, y, -i * 5.5 - 10]} scale={[0.018, 0.018, 1.3 + (i % 4) * 0.55]}>
            <boxGeometry />
            <meshBasicMaterial color={side > 0 ? '#56dcff' : '#aa67ff'} transparent opacity={0.18} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
}

function Gates({ speed, carXRef, onPass }) {
  const refs = useRef([]);
  const data = useMemo(() => [
    { x: -2.6, z: -38, label: GATE_LABELS[0] },
    { x: 2.1, z: -78, label: GATE_LABELS[1] },
    { x: -0.8, z: -118, label: GATE_LABELS[2] },
    { x: 2.6, z: -158, label: GATE_LABELS[3] },
    { x: -2.2, z: -198, label: GATE_LABELS[4] },
    { x: 0.9, z: -238, label: GATE_LABELS[5] },
  ], []);

  useFrame((_, delta) => {
    refs.current.forEach((group, i) => {
      if (!group) return;
      group.position.z += speed * delta;

      if (!group.userData.checked && group.position.z > 2.25) {
        group.userData.checked = true;
        if (Math.abs(carXRef.current - group.position.x) < 1.55) onPass(data[i].label);
      }

      if (group.position.z > 12) {
        group.position.z -= 240;
        group.userData.checked = false;
      }
    });
  });

  return data.map((gate, i) => {
    const leftColor = i % 2 ? '#59d9ff' : '#a665ff';
    const rightColor = i % 2 ? '#a665ff' : '#59d9ff';
    return (
      <group
        key={gate.label}
        ref={(el) => {
          refs.current[i] = el;
          if (el) el.userData.checked = false;
        }}
        position={[gate.x, 1.42, gate.z]}
      >
        <mesh position={[-1.55, 0, 0]} scale={[0.075, 1.45, 0.075]}>
          <boxGeometry />
          <meshBasicMaterial color={leftColor} toneMapped={false} />
        </mesh>
        <mesh position={[1.55, 0, 0]} scale={[0.075, 1.45, 0.075]}>
          <boxGeometry />
          <meshBasicMaterial color={rightColor} toneMapped={false} />
        </mesh>
        <mesh position={[0, 1.45, 0]} scale={[1.62, 0.075, 0.075]}>
          <boxGeometry />
          <meshBasicMaterial color="#d7cbff" transparent opacity={0.74} toneMapped={false} />
        </mesh>
        <mesh position={[-1.1, 1.08, 0]} rotation={[0, 0, -0.62]} scale={[0.62, 0.035, 0.045]}>
          <boxGeometry />
          <meshBasicMaterial color={leftColor} transparent opacity={0.62} toneMapped={false} />
        </mesh>
        <mesh position={[1.1, 1.08, 0]} rotation={[0, 0, 0.62]} scale={[0.62, 0.035, 0.045]}>
          <boxGeometry />
          <meshBasicMaterial color={rightColor} transparent opacity={0.62} toneMapped={false} />
        </mesh>
        <mesh position={[0, 1.45, -0.05]} scale={[0.42, 0.18, 0.035]}>
          <boxGeometry />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.14} toneMapped={false} />
        </mesh>
        <pointLight color={leftColor} intensity={4.4} distance={8} decay={2} />
      </group>
    );
  });
}

function EnemyFleet({ speed, carXRef, onHit, onNearMiss }) {
  const refs = useRef([]);
  const data = useMemo(() => [
    { x: -2.6, z: -22, phase: 0.4, mul: 0.83, c1: '#ff4d8d', c2: '#ff9d4d' },
    { x: 2.2, z: -49, phase: 1.7, mul: 0.91, c1: '#ff5f5f', c2: '#ffcc55' },
    { x: -0.6, z: -73, phase: 2.4, mul: 0.77, c1: '#ff3dbe', c2: '#ff744f' },
    { x: 3.1, z: -101, phase: 3.6, mul: 0.88, c1: '#ff566f', c2: '#ffa45b' },
    { x: -3.0, z: -132, phase: 4.8, mul: 0.81, c1: '#ff4fcf', c2: '#ff7852' },
    { x: 0.9, z: -164, phase: 5.9, mul: 0.94, c1: '#ff5c78', c2: '#ffbd4a' },
  ], []);

  useFrame((state, delta) => {
    refs.current.forEach((group, i) => {
      if (!group) return;
      const item = data[i];
      group.position.z += speed * item.mul * delta;
      const baseX = group.userData.baseX ?? item.x;
      group.position.x = THREE.MathUtils.lerp(group.position.x, baseX + Math.sin(state.clock.elapsedTime * (0.62 + i * 0.07) + item.phase) * 0.42, 0.035);
      group.rotation.z = Math.sin(state.clock.elapsedTime * 1.4 + item.phase) * 0.035;
      group.position.y = 0.50 + Math.sin(state.clock.elapsedTime * 4.2 + item.phase) * 0.025;

      if (!group.userData.checked && group.position.z > 2.4) {
        group.userData.checked = true;
        const dx = Math.abs(carXRef.current - group.position.x);
        if (dx < 1.18) onHit();
        else if (dx < 1.95) onNearMiss();
      }

      if (group.position.z > 11) {
        group.position.z -= 186;
        group.userData.checked = false;
        group.userData.cycle = (group.userData.cycle || 0) + 1;
        group.userData.baseX = LANES[(i + group.userData.cycle * 2) % LANES.length];
      }
    });
  });

  return data.map((enemy, i) => (
    <group
      key={`enemy-${i}`}
      ref={(el) => {
        refs.current[i] = el;
        if (el && el.userData.baseX === undefined) {
          el.userData.baseX = enemy.x;
          el.userData.checked = false;
          el.userData.cycle = 0;
        }
      }}
      position={[enemy.x, 0.50, enemy.z]}
    >
      <EnemyCar accent={enemy.c1} accent2={enemy.c2} />
    </group>
  ));
}

function RaceRig({ boost, onPass, onHit, onNearMiss }) {
  const carRef = useRef(null);
  const carXRef = useRef(0);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.72, -24), []);
  const speed = boost ? 39 : 24;

  useFrame((state, delta) => {
    const targetX = THREE.MathUtils.clamp(state.pointer.x * 5.15, -4.85, 4.85);
    carXRef.current = THREE.MathUtils.damp(carXRef.current, targetX, boost ? 8.4 : 6.2, delta);

    if (carRef.current) {
      carRef.current.position.x = carXRef.current;
      const steer = THREE.MathUtils.clamp(targetX - carXRef.current, -1, 1);
      carRef.current.rotation.z = THREE.MathUtils.damp(carRef.current.rotation.z, -steer * 0.22, 6, delta);
      carRef.current.rotation.y = THREE.MathUtils.damp(carRef.current.rotation.y, -steer * 0.10, 6, delta);
      carRef.current.position.y = 0.54 + Math.sin(state.clock.elapsedTime * 5.8) * 0.020;
    }

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, carXRef.current * 0.15, 4.2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, boost ? 3.02 : 3.22, 3.4, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, boost ? 8.0 : 8.55, 3.5, delta);
    lookTarget.x = carXRef.current * 0.055;
    lookTarget.y = boost ? 0.64 : 0.72;
    state.camera.lookAt(lookTarget);
  });

  return (
    <>
      <MovingTrack speed={speed} />
      <TrackArchitecture speed={speed} />
      <Gates speed={speed} carXRef={carXRef} onPass={onPass} />
      <EnemyFleet speed={speed} carXRef={carXRef} onHit={onHit} onNearMiss={onNearMiss} />
      <HoverCar carRef={carRef} boost={boost} />
    </>
  );
}

function RacingScene({ boost, onPass, onHit, onNearMiss }) {
  return (
    <>
      <color attach="background" args={['#030409']} />
      <fog attach="fog" args={['#05040d', 18, 92]} />
      <ambientLight intensity={0.34} />
      <hemisphereLight intensity={0.36} color="#aea0ff" groundColor="#020308" />
      <directionalLight position={[0, 9, 7]} intensity={1.4} color="#d8d1ff" />
      <pointLight position={[-5.5, 2.3, 2]} intensity={7.5} distance={19} color="#8d57ff" />
      <pointLight position={[5.5, 2.3, 2]} intensity={6.5} distance={19} color="#50d8ff" />
      <Stars radius={90} depth={55} count={1250} factor={2.15} saturation={0.14} fade speed={0.95} />
      <RaceRig boost={boost} onPass={onPass} onHit={onHit} onNearMiss={onNearMiss} />
    </>
  );
}

export default function Hero({ site }) {
  const [boost, setBoost] = useState(false);
  const [checkpoints, setCheckpoints] = useState(0);
  const [lastGate, setLastGate] = useState('START GRID');
  const [shield, setShield] = useState(100);
  const [styleScore, setStyleScore] = useState(0);
  const [impactTick, setImpactTick] = useState(0);
  const [eventLabel, setEventLabel] = useState('RIVALS ONLINE');

  const onPass = useCallback((label) => {
    setCheckpoints((value) => value + 1);
    setLastGate(label);
    setStyleScore((value) => value + 500);
    setEventLabel('CHECKPOINT CLEARED');
  }, []);

  const onHit = useCallback(() => {
    setShield((value) => (value <= 20 ? 100 : value - 20));
    setStyleScore((value) => Math.max(0, value - 250));
    setImpactTick((value) => value + 1);
    setEventLabel('IMPACT // SHIELD -20');
  }, []);

  const onNearMiss = useCallback(() => {
    setStyleScore((value) => value + 250);
    setEventLabel('NEAR MISS +250');
  }, []);

  return (
    <section className="relative min-h-[820px] overflow-hidden border-b border-bone/[0.08] bg-ink pt-20 md:pt-24">
      <div
        className="relative h-[calc(100svh-80px)] min-h-[740px] w-full overflow-hidden bg-[#030409]"
        onPointerDown={() => setBoost(true)}
        onPointerUp={() => setBoost(false)}
        onPointerCancel={() => setBoost(false)}
        onPointerLeave={() => setBoost(false)}
        style={{ touchAction: 'pan-y' }}
      >
        <Canvas
          dpr={[1, 1.55]}
          camera={{ position: [0, 3.22, 8.55], fov: 56, near: 0.1, far: 240 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <RacingScene boost={boost} onPass={onPass} onHit={onHit} onNearMiss={onNearMiss} />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,4,9,.24),transparent_18%,transparent_68%,rgba(3,4,9,.78)),radial-gradient(circle_at_50%_40%,transparent_0%,rgba(3,4,9,.05)_48%,rgba(3,4,9,.58)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink/78 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-ink/40 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-ink/32 to-transparent" />

        {impactTick > 0 && <div key={impactTick} className="impact-flash pointer-events-none absolute inset-0 z-40" />}

        <div className="pointer-events-none absolute left-[clamp(24px,4vw,78px)] top-[clamp(24px,4vw,60px)] z-20 max-w-[980px]">
          <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.28em] text-bone/42 md:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid shadow-[0_0_14px_rgba(164,107,240,.8)]" />
            RK // NEON CIRCUIT 2026
          </div>
          <h1 className="mt-3 text-[clamp(3.7rem,8.7vw,10.3rem)] font-semibold leading-[0.76] tracking-[-0.07em] text-bone/95 mix-blend-screen">
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

        <div className="pointer-events-none absolute right-[clamp(20px,3vw,56px)] top-[clamp(24px,3.6vw,54px)] z-20 grid grid-cols-2 gap-x-8 gap-y-4 text-right font-mono md:gap-x-10">
          <div>
            <div className="text-[8px] tracking-[0.24em] text-bone/34">CHECKPOINTS</div>
            <div className="mt-1 text-[clamp(1.55rem,2.1vw,2.65rem)] font-light tracking-[-0.04em] text-bone">{String(checkpoints).padStart(2, '0')}</div>
          </div>
          <div>
            <div className="text-[8px] tracking-[0.24em] text-bone/34">SHIELD</div>
            <div className={`mt-1 text-[clamp(1.55rem,2.1vw,2.65rem)] font-light tracking-[-0.04em] ${shield <= 40 ? 'text-rose-400' : 'text-cyan-200'}`}>{shield}</div>
          </div>
          <div>
            <div className="text-[8px] tracking-[0.24em] text-bone/34">SPEED</div>
            <div className={`mt-1 text-[11px] tracking-[0.16em] ${boost ? 'text-cyan-300' : 'text-orchid'}`}>{boost ? 'BOOST 390' : 'CRUISE 240'}</div>
          </div>
          <div>
            <div className="text-[8px] tracking-[0.24em] text-bone/34">STYLE</div>
            <div className="mt-1 text-[11px] tracking-[0.16em] text-bone/70">{String(styleScore).padStart(5, '0')}</div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[42%] z-10 -translate-x-1/2 text-center">
          <div className="font-mono text-[8px] tracking-[0.34em] text-bone/28">SECTOR</div>
          <div key={`${lastGate}-${checkpoints}`} className="mt-2 text-[clamp(1rem,1.65vw,1.8rem)] font-light tracking-[0.08em] text-bone/52 animate-pulse">{lastGate}</div>
          <div className="mt-3 font-mono text-[8px] tracking-[0.24em] text-rose-300/55">{eventLabel}</div>
        </div>

        <div className="pointer-events-none absolute left-[clamp(24px,4vw,78px)] top-1/2 z-20 hidden -translate-y-1/2 xl:block">
          <div className="font-mono text-[8px] tracking-[0.28em] text-bone/26">RIVAL TELEMETRY</div>
          <div className="mt-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] text-rose-300/55">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,.65)]" />
            06 HOSTILES ACTIVE
          </div>
          <div className="mt-2 font-mono text-[8px] tracking-[0.16em] text-bone/24">DODGE · OVERTAKE · NEAR MISS</div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-5 px-[clamp(22px,4vw,76px)] pb-[clamp(24px,3vw,46px)] md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/work" className="rounded-full border border-orchid/45 bg-orchid/14 px-6 py-3.5 font-mono text-[10px] tracking-[0.16em] text-bone backdrop-blur-md transition-all hover:border-orchid/80 hover:bg-orchid/24">
              ENTER THE WORK →
            </Link>
            <Link href="/about" className="rounded-full border border-bone/12 bg-ink/28 px-6 py-3.5 font-mono text-[10px] tracking-[0.16em] text-bone/62 backdrop-blur-md transition-all hover:border-bone/30 hover:text-bone">
              ABOUT
            </Link>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.18em] text-bone/38">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80" />
              MOVE / TOUCH TO STEER
            </div>
            <div className="font-mono text-[8px] tracking-[0.18em] text-bone/26">HOLD TO BOOST · AVOID RED RIVALS · PASS THE GATES</div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-bone/[0.03] to-transparent" />
        <div className="pointer-events-none absolute left-5 top-5 z-20 h-8 w-8 border-l border-t border-bone/15" />
        <div className="pointer-events-none absolute right-5 top-5 z-20 h-8 w-8 border-r border-t border-bone/15" />
        <div className="pointer-events-none absolute bottom-5 left-5 z-20 h-8 w-8 border-b border-l border-bone/15" />
        <div className="pointer-events-none absolute bottom-5 right-5 z-20 h-8 w-8 border-b border-r border-bone/15" />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orchid/30 to-transparent" />

      <style jsx>{`
        .impact-flash {
          background:
            radial-gradient(circle at 50% 58%, rgba(255, 74, 112, 0.28), transparent 32%),
            linear-gradient(90deg, rgba(255, 42, 103, 0.08), transparent 28%, transparent 72%, rgba(255, 126, 62, 0.08));
          animation: impactFlash 620ms cubic-bezier(.16,1,.3,1) both;
          mix-blend-mode: screen;
        }
        @keyframes impactFlash {
          0% { opacity: 0; transform: scale(1); }
          14% { opacity: 1; transform: scale(1.015); }
          48% { opacity: .42; }
          100% { opacity: 0; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
