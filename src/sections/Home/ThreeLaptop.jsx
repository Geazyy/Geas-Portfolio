'use client';

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import portrait from '../../assets/image/homeimage.jpg';
import LaptopFallback from './LaptopFallback';

const target = new THREE.Vector3(0, 2, 0);
const initialView = { yaw: 0, pitch: 0 };
const lidWidth = 7.42;
const displayWidth = 7.1;
const displayHeight = 3.92;
const openLidAngle = -0.045;
const closedLidAngle = 1.52;
const openingDelay = 180;
const openingDuration = 1500;

function Shell({ size, position, color = '#121a25', radius = 0.06, ...props }) {
  const [width, height, depth] = size;
  const geometry = useMemo(() => new RoundedBoxGeometry(width, height, depth, 3, radius), [width, height, depth, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} position={position} castShadow receiveShadow {...props}>
    <meshStandardMaterial color={color} metalness={0.22} roughness={0.58} />
  </mesh>;
}

function PortraitScreen() {
  const source = useLoader(THREE.TextureLoader, portrait.src);
  const texture = useMemo(() => {
    const screenTexture = source.clone();
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.anisotropy = 4;
    // Crop the tall portrait inside the wide screen, keeping the cap, face and diploma visible.
    const visibleHeight = (portrait.width / portrait.height) / (displayWidth / displayHeight);
    screenTexture.repeat.set(1, visibleHeight);
    screenTexture.offset.set(0, 1 - 0.29 - visibleHeight);
    screenTexture.needsUpdate = true;
    return screenTexture;
  }, [source]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <group position={[0, 2.26, 0.112]}>
    <mesh>
      <planeGeometry args={[displayWidth, displayHeight]} />
      <meshBasicMaterial color="#070d17" toneMapped={false} />
    </mesh>
    <mesh position={[0, 0, 0.003]}>
      <planeGeometry args={[displayWidth, displayHeight]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
    <mesh position={[0, 0, 0.009]}>
      <planeGeometry args={[displayWidth, displayHeight]} />
      <meshPhysicalMaterial color="#c7eafa" transparent opacity={0.045} roughness={0.16} metalness={0.1} clearcoat={1} depthWrite={false} />
    </mesh>
  </group>;
}

const keyboardRows = [
  Array(14).fill(1),
  [1.25, ...Array(12).fill(1), 1.25],
  [1.5, ...Array(11).fill(1), 1.5],
  [1.8, ...Array(10).fill(1), 1.8],
  [1.2, 1.2, 1.2, 5.2, 1.2, 1.2, 1.2],
];
const keyboardLegends = [
  ['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Back'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Fn', 'Alt', '', 'Alt', 'Fn', 'Ctrl'],
];

function Keyboard() {
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 0.055, 0.25, 2, 0.018), []);
  const keys = useMemo(() => keyboardRows.flatMap((row, rowIndex) => {
    const gap = 0.055;
    const unit = (6.1 - gap * (row.length - 1)) / row.reduce((sum, width) => sum + width, 0);
    let x = -3.05;
    return row.map((weight, column) => {
      const width = weight * unit;
      const key = { width, x: x + width / 2, z: -1.03 + rowIndex * 0.29, label: keyboardLegends[rowIndex][column] };
      x += width + gap;
      return key;
    });
  }), []);
  const legends = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ccd5e1';
    context.font = '500 12px Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    keys.forEach((key) => context.fillText(key.label, (key.x / 6.1 + 0.5) * 1024, ((key.z + 0.45) / 1.55 + 0.5) * 256, key.width / 6.1 * 900));
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, [keys]);
  useEffect(() => () => { geometry.dispose(); legends.dispose(); }, [geometry, legends]);
  return <group>
    {keys.map((key, index) => <group key={index} position={[key.x, 0.23, key.z]}>
      <mesh scale={[key.width, 1, 1]}>
        <boxGeometry args={[1.08, 0.025, 0.29]} />
        <meshStandardMaterial color={`hsl(${185 + (key.x + 3.05) * 14}, 70%, 65%)`} emissive={`hsl(${185 + (key.x + 3.05) * 14}, 70%, 65%)`} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      <mesh geometry={geometry} scale={[key.width, 1, 1]} position={[0, 0.035, 0]} castShadow>
        <meshStandardMaterial color="#1b2027" roughness={0.65} metalness={0.08} />
      </mesh>
    </group>)}
    <mesh position={[0, 0.296, -0.45]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6.1, 1.55]} />
      <meshBasicMaterial map={legends} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  </group>;
}

function LaptopModel({ view, openingCycle }) {
  const { invalidate } = useThree();
  const lid = useRef(null);
  const reducedMotion = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const initialLidRotation = useRef([reducedMotion.current ? openLidAngle : closedLidAngle, 0, 0]);
  const finishedOpening = useRef(reducedMotion.current);
  const openingStartedAt = useRef(null);
  const lastOpeningCycle = useRef(openingCycle);

  useLayoutEffect(() => {
    if (lastOpeningCycle.current === openingCycle) return;
    lastOpeningCycle.current = openingCycle;
    const skipAnimation = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    finishedOpening.current = skipAnimation;
    openingStartedAt.current = null;
    if (lid.current) lid.current.rotation.x = skipAnimation ? openLidAngle : closedLidAngle;
    invalidate();
  }, [openingCycle, invalidate]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreferenceChange = () => {
      if (!preference.matches) return;
      finishedOpening.current = true;
      if (lid.current) lid.current.rotation.x = openLidAngle;
      invalidate();
    };
    preference.addEventListener('change', onPreferenceChange);
    invalidate();
    return () => preference.removeEventListener('change', onPreferenceChange);
  }, [invalidate]);

  useFrame(() => {
    if (finishedOpening.current || !lid.current) return;
    const now = performance.now();
    if (openingStartedAt.current === null) openingStartedAt.current = now;
    const progress = THREE.MathUtils.clamp((now - openingStartedAt.current - openingDelay) / openingDuration, 0, 1);
    const eased = 0.5 - Math.cos(Math.PI * progress) / 2;
    lid.current.rotation.x = THREE.MathUtils.lerp(closedLidAngle, openLidAngle, eased);
    finishedOpening.current = progress === 1;
    if (!finishedOpening.current) invalidate();
  });

  return <group position={[0, 2, 0]} rotation={[view.pitch, view.yaw, 0]}>
    <group position={[0, -2, 0]}>
      <Shell size={[7.5, 0.28, 4.1]} position={[0, 0, 0.2]} radius={0.055} color="#111c29" />
      <group position={[0, -0.04, 0]}>
        <Shell size={[6.4, 0.025, 1.65]} position={[0, 0.192, -0.45]} color="#0c1118" radius={0.012} />
        <Keyboard />
      </group>
      <Shell size={[2.3, 0.009, 0.85]} position={[0, 0.144, 1.22]} color="#527b8d" radius={0.025} />
      <Shell size={[2.27, 0.006, 0.82]} position={[0, 0.151, 1.22]} color="#172837" radius={0.022} />
      {Array.from({ length: 20 }, (_, index) => <mesh key={`front-${index}`} position={[-3.4 + index * 0.357, -0.025, 2.255]}>
        <boxGeometry args={[0.36, 0.038, 0.018]} />
        <meshBasicMaterial color={`hsl(${185 + index * 5}, 75%, 55%)`} toneMapped={false} />
      </mesh>)}
      {[-3.22, 3.22].flatMap((x) => [-1.38, 1.78].map((z) =>
        <Shell key={`${x}-${z}`} size={[0.56, 0.1, 0.35]} position={[x, -0.18, z]} color="#080b10" radius={0.035} />
      ))}
      {/* Recessed cooling slots and side ports give the base visible depth. */}
      {[-1, 1].flatMap((side) => Array.from({ length: 9 }, (_, index) =>
        <mesh key={`${side}-${index}`} position={[side * 3.754, 0, -1.35 + index * 0.13]}>
          <boxGeometry args={[0.009, 0.09, 0.055]} /><meshBasicMaterial color="#05080d" />
        </mesh>
      ))}
      {[-0.1, 0.5].map((z) => <mesh key={z} position={[-3.755, 0, z]}>
        <boxGeometry args={[0.012, 0.095, 0.25]} /><meshBasicMaterial color="#05080d" />
      </mesh>)}
      <Shell size={[7.2, 0.12, 0.31]} position={[0, 0.16, -1.68]} color="#0b131d" radius={0.04} />
      <mesh position={[0, 0.2, -1.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 6.5, 20]} />
        <meshStandardMaterial color="#101c29" metalness={0.45} roughness={0.55} />
      </mesh>
      {[-3.4, 3.4].map((x) => <Shell key={`hinge-${x}`} size={[0.35, 0.22, 0.32]} position={[x, 0.2, -1.7]} radius={0.035} color="#152231" />)}
      <group ref={lid} position={[0, 0.17, -1.7]} rotation={initialLidRotation.current}>
        <Shell size={[lidWidth, 4.35, 0.2]} position={[0, 2.2, 0]} radius={0.035} color="#111b27" />
        <Shell size={[1.3, 0.07, 0.17]} position={[0, 4.4, 0]} radius={0.02} color="#111b27" />
        <Suspense fallback={null}><PortraitScreen /></Suspense>
        <mesh position={[0, 4.31, 0.112]}>
          <circleGeometry args={[0.027, 16]} /><meshBasicMaterial color="#080e18" />
        </mesh>
        <mesh position={[0.065, 4.31, 0.112]}>
          <circleGeometry args={[0.01, 12]} /><meshBasicMaterial color="#6dc4ca" />
        </mesh>
      </group>
    </group>
  </group>;
}

function Framing({ view }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const direction = new THREE.Vector3(0, 0.18, 1).normalize();
    camera.position.copy(target).add(direction);
    camera.lookAt(target);
    const inverseView = camera.quaternion.clone().invert();
    const rotation = new THREE.Euler(view.pitch, view.yaw, 0);
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const aspect = size.width / Math.max(size.height, 1);
    let distance = 0;
    for (const x of [-3.8, 3.8]) for (const y of [-0.26, 4.72]) for (const z of [-2.05, 2.3]) {
      const corner = new THREE.Vector3(x, y, z).sub(target).applyEuler(rotation).applyQuaternion(inverseView);
      distance = Math.max(distance, corner.z + Math.abs(corner.x) / (tangent * aspect * 0.98), corner.z + Math.abs(corner.y) / (tangent * 0.98));
    }
    camera.position.copy(target).addScaledVector(direction, distance * (size.width >= 500 ? 0.93 : 1));
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, view, invalidate]);
  return null;
}

export default function ThreeLaptop() {
  const [view, setView] = useState(initialView);
  const [openingCycle, setOpeningCycle] = useState(0);
  const drag = useRef(null);
  const resetView = () => {
    setView(initialView);
    setOpeningCycle((cycle) => cycle + 1);
  };
  const changeView = (yaw, pitch) => setView({ yaw: THREE.MathUtils.clamp(yaw, -0.48, 0.48), pitch: THREE.MathUtils.clamp(pitch, -0.12, 0.12) });
  const release = (event) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className="hero-three-laptop">
    <div className="hero-three-stage" tabIndex={0} role="group"
      aria-label="3D gaming laptop displaying Geaser's portrait. Drag or use arrow keys to rotate. Press Home to reset."
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;
        drag.current = { x: event.clientX, y: event.clientY, ...view, touch: event.pointerType === 'touch' };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        changeView(drag.current.yaw + (event.clientX - drag.current.x) * 0.006,
          drag.current.touch ? drag.current.pitch : drag.current.pitch + (event.clientY - drag.current.y) * 0.003);
      }}
      onPointerUp={release} onPointerCancel={release} onLostPointerCapture={() => { drag.current = null; }}
      onKeyDown={(event) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home') resetView();
        else changeView(view.yaw + (event.key === 'ArrowRight' ? 0.08 : event.key === 'ArrowLeft' ? -0.08 : 0), view.pitch + (event.key === 'ArrowDown' ? 0.04 : event.key === 'ArrowUp' ? -0.04 : 0));
      }}>
      <Canvas shadows={{ type: THREE.PCFShadowMap }} frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 5, 30], fov: 14, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={<LaptopFallback />}>
        <ambientLight intensity={0.65} />
        <hemisphereLight args={['#b9d8e9', '#09111d', 1.25]} />
        <directionalLight position={[-5, 8, 7]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.001} />
        <directionalLight position={[5, 4, -4]} color="#65c7e8" intensity={1.1} />
        <LaptopModel view={view} openingCycle={openingCycle} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
          <planeGeometry args={[18, 14]} /><shadowMaterial transparent opacity={0.08} />
        </mesh>
        <Framing view={view} />
      </Canvas>
    </div>
    <button type="button" className="hero-three-reset" onClick={resetView}>Reset view</button>
  </div>;
}
