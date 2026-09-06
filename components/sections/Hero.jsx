'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const SECTORS = [
  { title: 'INTRO', label: 'RAJA KANNAN' },
  { title: '01', label: 'MOTION / CGI' },
  { title: '02', label: 'AI / GENERATIVE' },
  { title: '03', label: 'PHOTOGRAPHY' },
  { title: '04', label: 'LAB / REALTIME' },
];

const PORTALS = [
  { title: 'SENTIENT', subtitle: 'MOTION / CGI', image: '/img/cs-hero.jpg', href: '/work/sentient', x: -4.6, z: -31, accent: '#a66cff' },
  { title: 'MATERIAL WORLDS', subtitle: '3D / LOOKDEV', image: '/img/cs-fullbleed.jpg', href: '/work', x: 4.7, z: -50, accent: '#56d8ff' },
  { title: 'AI TEXTURE', subtitle: 'GENERATIVE / COMPOSITING', image: '/img/cs-ai-texture.jpg', href: '/work', x: -4.4, z: -69, accent: '#e46cff' },
  { title: 'LAB', subtitle: 'REALTIME / EXPERIMENTS', image: '/img/cs-frame-03.jpg', href: '/lab', x: 4.4, z: -88, accent: '#71b8ff' },
];

function useCanvasTexture(title, subtitle, accent = '#9d65ff', large = false) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = large ? 2048 : 1024;
    canvas.height = large ? 1024 : 512;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, 'rgba(7,8,13,0.94)');
    bg.addColorStop(0.55, 'rgba(13,11,24,0.86)');
    bg.addColorStop(1, 'rgba(5,8,15,0.94)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = `${accent}88`;
    ctx.lineWidth = large ? 4 : 2;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    ctx.fillStyle = accent;
    ctx.fillRect(48, large ? 92 : 58, large ? 170 : 90, large ? 7 : 4);

    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(243,241,255,0.96)';
    ctx.font = `${large ? 800 : 700} ${large ? 190 : 72}px Arial, sans-serif`;
    ctx.fillText(title, 48, large ? 150 : 92);

    ctx.fillStyle = 'rgba(222,218,242,0.54)';
    ctx.font = `${large ? 36 : 22}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.letterSpacing = `${large ? 7 : 4}px`;
    ctx.fillText(subtitle, 54, large ? 390 : 205);

    if (large) {
      ctx.fillStyle = 'rgba(226,222,245,0.33)';
      ctx.font = '26px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText('MOTION DESIGN · 3D / CGI · AI VISUALS · PHOTOGRAPHY · CREATIVE TECHNOLOGY', 54, 500);
      ctx.fillStyle = 'rgba(226,222,245,0.20)';
      ctx.font = '22px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText('CHENNAI / INDIA — 2026', 54, 580);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    setTexture(tex);

    return () => tex.dispose();
  }, [title, subtitle, accent, large]);

  return texture;
}

function AuroraVoid() {
  const mat = useRef(null);

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  return (
    <mesh scale={80} frustumCulled={false}>
      <sphereGeometry args={[1, 48, 32]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vPos;
          varying vec2 vUv;
          void main(){
            vUv = uv;
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec3 vPos;
          varying vec2 vUv;
          void main(){
            float bands = sin(vUv.y * 16.0 + sin(vUv.x * 9.0 + uTime * 0.08) * 2.0 + uTime * 0.05);
            float veil = smoothstep(0.15, 1.0, bands) * 0.13;
            float horizon = pow(1.0 - abs(vUv.y - 0.50) * 1.7, 3.0);
            vec3 base = vec3(0.008,0.009,0.018);
            vec3 purple = vec3(0.23,0.08,0.46);
            vec3 cyan = vec3(0.02,0.20,0.32);
            float mixv = 0.5 + 0.5 * sin(vUv.x * 8.0 + uTime * 0.04);
            vec3 glow = mix(purple, cyan, mixv) * (veil + horizon * 0.10);
            gl_FragColor = vec4(base + glow, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function TitleMonolith() {
  const texture = useCanvasTexture('RAJA KANNAN', 'CREATIVE TECHNOLOGIST / VISUAL ARTIST', '#9d65ff', true);
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = -0.06 + Math.sin(t * 0.32) * 0.015;
    group.current.position.y = 3.5 + Math.sin(t * 0.42) * 0.05;
  });

  return (
    <group ref={group} position={[0, 3.5, -12]} rotation={[0, -0.06, 0]}>
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[15.2, 7.2, 0.28]} />
        <meshStandardMaterial color="#070810" metalness={0.78} roughness={0.24} />
      </mesh>
      {texture && (
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[14.7, 7]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      )}
      <mesh position={[-7.63, 0, 0]} scale={[0.035, 3.5, 0.08]}>
        <boxGeometry />
        <meshBasicMaterial color="#9d65ff" toneMapped={false} />
      </mesh>
      <mesh position={[7.63, 0, 0]} scale={[0.035, 3.5, 0.08]}>
        <boxGeometry />
        <meshBasicMaterial color="#57d8ff" toneMapped={false} />
      </mesh>
      <pointLight position={[-6.7, 0.5, 2]} color="#8b5bff" intensity={8} distance={10} />
      <pointLight position={[6.7, 0.2, 2]} color="#57d8ff" intensity={6} distance={10} />
    </group>
  );
}

function SculpturalObject({ accent, index = 0 }) {
  const ref = useRef(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * (0.12 + index * 0.02);
    ref.current.rotation.y += delta * (0.18 + index * 0.025);
  });

  return (
    <Float speed={1.2 + index * 0.12} rotationIntensity={0.28} floatIntensity={0.35}>
      <group ref={ref}>
        {index % 3 === 0 ? (
          <mesh>
            <torusKnotGeometry args={[0.82, 0.22, 120, 18, 2, 5]} />
            <meshPhysicalMaterial color="#11131c" metalness={0.92} roughness={0.11} clearcoat={1} clearcoatRoughness={0.08} emissive={accent} emissiveIntensity={0.16} />
          </mesh>
        ) : index % 3 === 1 ? (
          <mesh>
            <icosahedronGeometry args={[1.05, 2]} />
            <meshPhysicalMaterial color="#11131b" metalness={0.92} roughness={0.08} clearcoat={1} emissive={accent} emissiveIntensity={0.18} wireframe={false} />
          </mesh>
        ) : (
          <mesh rotation={[0.6, 0.3, 0.2]}>
            <torusGeometry args={[0.95, 0.24, 22, 90]} />
            <meshPhysicalMaterial color="#12131d" metalness={0.95} roughness={0.09} clearcoat={1} emissive={accent} emissiveIntensity={0.14} />
          </mesh>
        )}
        <pointLight color={accent} intensity={4.5} distance={6} />
      </group>
    </Float>
  );
}

function ProjectPortal({ data, index }) {
  const group = useRef(null);
  const [hovered, setHovered] = useState(false);
  const image = useTexture(data.image);
  const label = useCanvasTexture(data.title, data.subtitle, data.accent, false);
  image.colorSpace = THREE.SRGBColorSpace;

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.055 : 1;
    const s = THREE.MathUtils.damp(group.current.scale.x, target, 6, delta);
    group.current.scale.setScalar(s);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, data.x < 0 ? 0.23 : -0.23, 5, delta);
    group.current.position.y = 2.9 + Math.sin(state.clock.elapsedTime * 0.65 + index) * 0.06;
  });

  return (
    <group
      ref={group}
      position={[data.x, 2.9, data.z]}
      rotation={[0, data.x < 0 ? 0.23 : -0.23, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
      onClick={(e) => { e.stopPropagation(); window.location.href = data.href; }}
    >
      <mesh position={[0, 0, -0.18]}>
        <boxGeometry args={[6.25, 4.05, 0.34]} />
        <meshStandardMaterial color="#070910" metalness={0.82} roughness={0.20} />
      </mesh>

      <mesh position={[0, 0.25, 0.02]}>
        <planeGeometry args={[5.8, 3.25]} />
        <meshBasicMaterial map={image} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.25, 0.04]}>
        <planeGeometry args={[5.8, 3.25]} />
        <meshBasicMaterial color={data.accent} transparent opacity={hovered ? 0.08 : 0.035} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <group position={[0, 0.35, 0.9]} scale={0.62}>
        <SculpturalObject accent={data.accent} index={index} />
      </group>

      {label && (
        <mesh position={[0, -2.47, 0.06]}>
          <planeGeometry args={[5.8, 2.15]} />
          <meshBasicMaterial map={label} transparent toneMapped={false} />
        </mesh>
      )}

      <mesh position={[-3.16, 0, 0]} scale={[0.035, 2.08, 0.08]}>
        <boxGeometry />
        <meshBasicMaterial color={data.accent} transparent opacity={hovered ? 1 : 0.72} toneMapped={false} />
      </mesh>
      <mesh position={[3.16, 0, 0]} scale={[0.035, 2.08, 0.08]}>
        <boxGeometry />
        <meshBasicMaterial color={index % 2 ? '#56d8ff' : '#c47aff'} transparent opacity={hovered ? 0.9 : 0.48} toneMapped={false} />
      </mesh>

      <pointLight position={[0, 0.4, 2]} color={data.accent} intensity={hovered ? 8 : 4.5} distance={10} />
    </group>
  );
}

function WorldArchitecture() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -56]} receiveShadow>
        <planeGeometry args={[26, 150]} />
        <meshStandardMaterial color="#07080d" metalness={0.52} roughness={0.56} />
      </mesh>

      {[-4.6, 0, 4.6].map((x, i) => (
        <mesh key={x} position={[x, 0.005, -57]} scale={[0.025, 0.012, 72]}>
          <boxGeometry />
          <meshBasicMaterial color={i === 1 ? '#9d65ff' : i === 0 ? '#6f5fff' : '#52d4ff'} transparent opacity={i === 1 ? 0.26 : 0.12} toneMapped={false} />
        </mesh>
      ))}

      {Array.from({ length: 13 }, (_, i) => {
        const z = -18 - i * 9;
        const hue = i % 2 === 0;
        return (
          <group key={i} position={[0, 0, z]}>
            <mesh position={[-8.4, 3.65, 0]} scale={[0.075, 3.65, 0.075]}>
              <boxGeometry />
              <meshBasicMaterial color={hue ? '#7144d8' : '#285985'} transparent opacity={0.42} toneMapped={false} />
            </mesh>
            <mesh position={[8.4, 3.65, 0]} scale={[0.075, 3.65, 0.075]}>
              <boxGeometry />
              <meshBasicMaterial color={hue ? '#236a88' : '#6741c8'} transparent opacity={0.42} toneMapped={false} />
            </mesh>
            <mesh position={[0, 7.28, 0]} scale={[8.45, 0.055, 0.075]}>
              <boxGeometry />
              <meshBasicMaterial color={hue ? '#643cba' : '#2c718f'} transparent opacity={0.26} toneMapped={false} />
            </mesh>
            <mesh position={[-7.2, 6.7, 0]} rotation={[0, 0, -0.52]} scale={[1.7, 0.025, 0.05]}>
              <boxGeometry />
              <meshBasicMaterial color="#9a6aff" transparent opacity={0.18} toneMapped={false} />
            </mesh>
            <mesh position={[7.2, 6.7, 0]} rotation={[0, 0, 0.52]} scale={[1.7, 0.025, 0.05]}>
              <boxGeometry />
              <meshBasicMaterial color="#60ddff" transparent opacity={0.16} toneMapped={false} />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: 22 }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const z = -24 - i * 5.2;
        const height = 1.8 + (i % 5) * 0.85;
        return (
          <group key={`tower-${i}`} position={[side * (10.2 + (i % 3) * 1.35), height * 0.5 - 0.05, z]}>
            <mesh scale={[1.2 + (i % 3) * 0.35, height, 1.3 + (i % 4) * 0.25]}>
              <boxGeometry />
              <meshStandardMaterial color="#080a11" metalness={0.76} roughness={0.34} />
            </mesh>
            <mesh position={[side > 0 ? -1.23 : 1.23, 0.1, 0]} scale={[0.025, height * 0.72, 0.8]}>
              <boxGeometry />
              <meshBasicMaterial color={side > 0 ? '#52d4ff' : '#8e5cff'} transparent opacity={0.16 + (i % 3) * 0.06} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function CameraJourney({ progressRef }) {
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const eased = p * p * (3 - 2 * p);
    const targetZ = THREE.MathUtils.lerp(10.5, -92, eased);
    const px = state.pointer.x;
    const py = state.pointer.y;
    const drift = Math.sin(eased * Math.PI * 4) * 0.7;
    const targetX = px * 1.15 + drift;
    const targetY = 3.1 + py * 0.5 + Math.sin(eased * Math.PI * 3) * 0.18;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 3.4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 3.4, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4.2, delta);

    target.set(targetX * 0.18, 2.25 + py * 0.10, targetZ - 13.5);
    state.camera.lookAt(target);
  });

  return null;
}

function CinematicWorld({ progressRef }) {
  return (
    <>
      <AuroraVoid />
      <fog attach="fog" args={['#05060c', 17, 58]} />
      <ambientLight intensity={0.34} />
      <directionalLight position={[1, 10, 7]} intensity={1.4} color="#d8d1ff" />
      <pointLight position={[-7, 3, 2]} intensity={8} distance={20} color="#8a55ff" />
      <pointLight position={[7, 3, -4]} intensity={6} distance={20} color="#52d8ff" />

      <Stars radius={65} depth={36} count={1100} factor={2.1} saturation={0.1} fade speed={0.45} />
      <Sparkles count={150} scale={[24, 10, 120]} size={1.1} speed={0.24} opacity={0.28} color="#b98cff" />

      <WorldArchitecture />
      <TitleMonolith />
      {PORTALS.map((portal, i) => <ProjectPortal key={portal.title} data={portal} index={i} />)}

      <Float position={[-7.8, 4.8, -43]} speed={0.7} rotationIntensity={0.3} floatIntensity={0.8}>
        <SculpturalObject accent="#8f5cff" index={0} />
      </Float>
      <Float position={[8.1, 5.2, -63]} speed={0.85} rotationIntensity={0.35} floatIntensity={0.7}>
        <SculpturalObject accent="#55d9ff" index={1} />
      </Float>
      <Float position={[-7.4, 4.3, -83]} speed={0.75} rotationIntensity={0.4} floatIntensity={0.65}>
        <SculpturalObject accent="#db6eff" index={2} />
      </Float>

      <CameraJourney progressRef={progressRef} />
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const sectorRef = useRef(0);
  const [sector, setSector] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = THREE.MathUtils.clamp(-rect.top / travel, 0, 1);
      progressRef.current = p;
      const next = Math.min(SECTORS.length - 1, Math.floor(p * SECTORS.length));
      if (next !== sectorRef.current) {
        sectorRef.current = next;
        setSector(next);
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[230svh] bg-ink">
      <div className="sticky top-0 h-svh min-h-[720px] overflow-hidden bg-[#04050a]">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 3.1, 10.5], fov: 52, near: 0.1, far: 180 }}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        >
          <Suspense fallback={null}>
            <CinematicWorld progressRef={progressRef} />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,4,9,.48),transparent_18%,transparent_74%,rgba(3,4,9,.74)),radial-gradient(circle_at_50%_48%,transparent_35%,rgba(3,4,9,.42)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/70 to-transparent" />

        <div className="pointer-events-none absolute left-[clamp(22px,3.6vw,72px)] top-[clamp(88px,9vw,132px)] z-20 max-w-[620px]">
          <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.25em] text-bone/44">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid shadow-[0_0_14px_rgba(164,107,240,.8)]" />
            WEBGL WORLD // 2026
          </div>
          <div className="mt-3 text-[clamp(1rem,1.3vw,1.45rem)] font-light tracking-[-0.02em] text-bone/72">
            {SECTORS[sector].title} — {SECTORS[sector].label}
          </div>
        </div>

        <div className="absolute right-[clamp(20px,3vw,56px)] top-[clamp(92px,9vw,134px)] z-30 hidden flex-col items-end gap-3 md:flex">
          {SECTORS.map((item, i) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className={`font-mono text-[8px] tracking-[0.18em] transition-colors ${i === sector ? 'text-bone/80' : 'text-bone/25'}`}>{item.label}</span>
              <span className={`h-px transition-all duration-500 ${i === sector ? 'w-8 bg-orchid' : 'w-3 bg-bone/18'}`} />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-[clamp(24px,3vw,46px)] z-30 flex flex-col gap-5 px-[clamp(22px,4vw,76px)] md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-3">
            <Link href="/work" className="rounded-full border border-orchid/45 bg-orchid/14 px-6 py-3.5 font-mono text-[10px] tracking-[0.16em] text-bone backdrop-blur-md transition-all hover:border-orchid/80 hover:bg-orchid/24">ENTER THE WORK →</Link>
            <Link href="/about" className="rounded-full border border-bone/12 bg-ink/32 px-6 py-3.5 font-mono text-[10px] tracking-[0.16em] text-bone/62 backdrop-blur-md transition-all hover:border-bone/30 hover:text-bone">ABOUT</Link>
          </div>

          <div className="pointer-events-none flex flex-col items-start gap-2 md:items-end">
            <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.18em] text-bone/44">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80" />
              SCROLL TO TRAVEL
            </div>
            <div className="font-mono text-[8px] tracking-[0.18em] text-bone/26">MOVE CURSOR TO LOOK · CLICK A WORLD TO ENTER</div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-orchid via-fuchsia-400 to-cyan-300 transition-[width] duration-150" style={{ width: `${Math.max(2, progressRef.current * 100)}%` }} />
      </div>
    </section>
  );
}
