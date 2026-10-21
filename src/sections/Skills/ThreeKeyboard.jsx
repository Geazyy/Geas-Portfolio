'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { assetSrc } from '../../lib/assetSrc';
import { technicalSkills, softSkills } from './skillsData';

const spectrum = ['#8470ff', '#b7a0ff', '#699aff', '#a6c4ff'];
const keyColors = ['#ff4e9b', '#ff9572', '#e8d466', '#66e6aa', '#4ce4e1', '#57b6ff', '#9c83ff', '#e37aff'];
// Centered front view with enough elevation to read the key tops and see their depth.
const initialCamera = [0, 11, 10];
const subscribeMotion = (callback) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function makeRow(items, z) {
  const gap = 0.12;
  const width = 10.5;
  const weight = items.reduce((sum, item) => sum + (item.units || 1), 0);
  const unit = (width - gap * (items.length - 1)) / weight;
  let x = -width / 2;
  return items.map((item, index) => {
    const keyWidth = unit * (item.units || 1);
    const key = { ...item, x: x + keyWidth / 2, z, width: keyWidth, color: keyColors[index % keyColors.length] };
    x += keyWidth + gap;
    return key;
  });
}

const layout = [0, 6, 12, 18].flatMap((start, row) => makeRow([
  { label: ['Esc', 'Tab', 'Caps', 'Shift'][row], units: 1.2 },
  ...technicalSkills.slice(start, start + 6).map((skill) => ({ label: skill.name, skill })),
  { label: ['Backspace', 'Enter', 'Home', 'Shift'][row], units: 1.5 },
], -1.9 + row * 0.93));
layout.push(...makeRow([
  { label: 'Ctrl', units: 0.8 },
  ...softSkills.map((skill) => ({ label: skill.name, skill: { ...skill, cat: 'professional' }, units: skill.name === 'Project Management' ? 3 : 1.15 })),
  { label: 'Fn', units: 0.8 },
], 1.82));

function useKeyTexture(item) {
  const invalidate = useThree((state) => state.invalidate);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(128, Math.round(256 * item.width * 0.88 / 0.67));
    canvas.height = 256;
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;
    return result;
  }, [item.width]);

  useEffect(() => {
    let disposed = false;
    const canvas = texture.image;
    const context = canvas.getContext('2d');
    const paint = (icon) => {
      if (disposed || !context) return;
      context.clearRect(0, 0, canvas.width, 256);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#ffffff';
      const hasIcon = Boolean(item.skill?.icon);
      const words = item.label.split(' ');
      context.font = '700 40px Arial, sans-serif';
      const lines = [];
      let line = '';
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && context.measureText(candidate).width > canvas.width - 20) {
          lines.push(line);
          line = word;
        } else line = candidate;
      }
      if (line) lines.push(line);
      const labelY = hasIcon ? (lines.length > 1 ? 184 : 207) : 128 - (lines.length - 1) * 22;
      lines.forEach((label, index) => context.fillText(label, canvas.width / 2, labelY + index * 44, canvas.width - 20));
      if (icon) {
        const size = 116;
        const ratio = Math.min(size / icon.naturalWidth, size / icon.naturalHeight);
        const width = icon.naturalWidth * ratio;
        const height = icon.naturalHeight * ratio;
        if (['Next.js', 'Express', 'GitHub'].includes(item.label)) context.filter = 'brightness(0) invert(1)';
        context.drawImage(icon, (canvas.width - width) / 2, 76 - height / 2, width, height);
        context.filter = 'none';
      }
      texture.needsUpdate = true;
      invalidate();
    };
    paint();
    const image = new window.Image();
    if (item.skill?.icon) {
      image.onload = () => paint(image);
      image.src = assetSrc(item.skill.icon);
    }
    return () => { disposed = true; image.onload = null; texture.dispose(); };
  }, [item, texture, invalidate]);
  return texture;
}

function Keycap({ item, focusedSkill, onChoose, reducedMotion }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const cap = useRef(null);
  const invalidate = useThree((state) => state.invalidate);
  const texture = useKeyTexture(item);
  const geometry = useMemo(() => new RoundedBoxGeometry(item.width, 0.4, 0.76, 3, 0.07), [item.width]);
  const down = Boolean(item.skill) && (hovered || pressed || focusedSkill === item.label);
  useEffect(() => { invalidate(); }, [down, invalidate]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, delta) => {
    if (!cap.current) return;
    const target = down ? 0.43 : 0.55;
    cap.current.position.y = reducedMotion ? target : THREE.MathUtils.damp(cap.current.position.y, target, 20, delta);
    if (Math.abs(cap.current.position.y - target) > 0.001) invalidate();
  });

  return (
    <group position={[item.x, 0, item.z]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[item.width + 0.025, 0.075, 0.81]} />
        <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* Keep the pointer target stationary while the visible cap moves down. */}
        <mesh
          geometry={geometry}
          position={[0, 0.55, 0]}
          onPointerOver={(event) => {
            event.stopPropagation();
            if (!item.skill) return;
            setHovered(event.pointerType !== 'touch');
            onChoose(item.skill);
          }}
          onPointerOut={() => { setHovered(false); setPressed(false); }}
          onPointerDown={(event) => { event.stopPropagation(); if (item.skill) setPressed(true); }}
          onPointerUp={(event) => { setPressed(false); if (event.pointerType === 'touch') setHovered(false); }}
          onPointerCancel={() => { setHovered(false); setPressed(false); }}
          onClick={(event) => { event.stopPropagation(); if (item.skill) onChoose(item.skill); }}
        >
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
      <group ref={cap} position={[0, 0.55, 0]}>
        <mesh geometry={geometry} castShadow receiveShadow raycast={() => null}>
          <meshStandardMaterial color={down ? '#35425c' : '#202a40'} metalness={0.38} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.203, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
          <planeGeometry args={[item.width * 0.88, 0.67]} />
          <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function FrameTube({ points, radius = 0.1 }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))), 48, radius, 8, false,
  ), [points, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} castShadow receiveShadow>
    <meshPhysicalMaterial color="#292c30" metalness={0.8} roughness={0.25} clearcoat={1} />
  </mesh>;
}

// Rounded triangular light wells leave open-looking spaces between structural ribs.
function FrameVent({ x = 0, color, flip, position, rotation }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.62, -0.09);
    shape.quadraticCurveTo(-0.77, -0.08, -0.62, 0.04);
    shape.lineTo(0.35, 0.29);
    shape.quadraticCurveTo(0.58, 0.34, 0.66, 0.04);
    shape.quadraticCurveTo(0.72, -0.09, 0.53, -0.09);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3, steps: 1 });
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group position={position || [x, -0.12, 2.98]} rotation={rotation} scale={[flip ? -1 : 1, 1, 1]}>
    <mesh geometry={geometry} scale={[1.14, 1.35, 1]} castShadow>
      <meshStandardMaterial color="#17191b" metalness={0.8} roughness={0.3} />
    </mesh>
    <mesh geometry={geometry} position={[0, 0, 0.06]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} toneMapped={false} />
    </mesh>
    {[-0.035, 0.025, 0.085].map((y) => (
      <mesh key={y} position={[0.04, y, 0.13]} rotation={[0, 0, 0.17]}>
        <boxGeometry args={[0.95, 0.013, 0.012]} />
        <meshStandardMaterial color="#4a4169" metalness={0.65} roughness={0.32} />
      </mesh>
    ))}
  </group>;
}

const frontFrame = [[-5.9, 0.05, 2.4], [-5.95, -0.2, 2.95], [-4.6, -0.38, 3.1], [0, -0.38, 3.12], [4.6, -0.38, 3.1], [5.95, -0.2, 2.95], [5.9, 0.05, 2.4]];
const upperFrame = [[-5.9, 0.1, 2.4], [-5.25, 0.32, 2.8], [-3, 0.27, 2.95], [0, 0.22, 3], [3, 0.27, 2.95], [5.25, 0.32, 2.8], [5.9, 0.1, 2.4]];
const sideFrames = [-1, 1].map((side) => [
  [side * 5.8, -0.26, 2.9], [side * 5.98, -0.32, 1.8], [side * 5.98, -0.32, -1.8],
  [side * 5.8, -0.17, -2.8], [side * 5.6, 0.22, -2.8],
  [side * 5.72, 0.28, -1.6], [side * 5.78, 0.28, 1.6], [side * 5.8, 0.12, 2.9],
]);
const frontRibs = [-4.7, -2.8, 2.8, 4.7].map((x) => [[x - 0.32, -0.34, 3.1], [x, 0.12, 3.04], [x + 0.35, 0.26, 2.94]]);
const sideRibs = [-1, 1].flatMap((side) => [-1.85, 0, 1.85].map((z) => [
  [side * 5.97, -0.3, z - 0.35], [side * 5.94, -0.08, z], [side * 5.75, 0.27, z + 0.35],
]));

function Chassis() {
  const base = useMemo(() => new RoundedBoxGeometry(11.1, 0.16, 5.4, 3, 0.07), []);
  const deck = useMemo(() => new RoundedBoxGeometry(11.05, 0.16, 5.4, 2, 0.1), []);
  useEffect(() => () => { base.dispose(); deck.dispose(); }, [base, deck]);
  return (
    <group>
      <mesh geometry={base} position={[0, -0.13, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#141618" metalness={0.8} roughness={0.28} />
      </mesh>
      <mesh geometry={deck} position={[0, 0.15, 0]} receiveShadow>
        <meshStandardMaterial color="#111214" metalness={0.65} roughness={0.3} />
      </mesh>
      <FrameTube points={frontFrame} radius={0.12} />
      <FrameTube points={upperFrame} radius={0.14} />
      {sideFrames.map((points, index) => <FrameTube key={`side-${index}`} points={points} radius={0.15} />)}
      {sideRibs.map((points, index) => <FrameTube key={`side-rib-${index}`} points={points} radius={0.1} />)}
      {frontRibs.map((points, index) => <FrameTube key={`rib-${index}`} points={points} radius={0.085} />)}
      {[-4.1, -2.4, 2.4, 4.1].map((x, index) => <FrameVent key={x} x={x} color={spectrum[index]} flip={x > 0} />)}
      {[-1, 1].flatMap((side) => [-1, 1].map((z, index) => (
        <FrameVent key={`side-vent-${side}-${z}`} position={[side * 5.86, -0.13, z]}
          rotation={[0, side * Math.PI / 2, 0]} color={spectrum[index]} flip={z > 0} />
      )))}
      <mesh position={[0, -0.04, 3.04]}>
        <boxGeometry args={[2.7, 0.09, 0.055]} />
        <meshStandardMaterial color="#8f98ff" emissive="#8f98ff" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      {[-5.38, 5.38].flatMap((x) => [-2.55, 2.55].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.19, z]}>
          <cylinderGeometry args={[0.065, 0.065, 0.035, 12]} /><meshStandardMaterial color="#a0b2c4" metalness={0.9} roughness={0.22} />
        </mesh>
      )))}
    </group>
  );
}

function fitKeyboardInView(camera, size) {
  const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
  const aspect = size.width / Math.max(size.height, 1);
  const inverseView = camera.quaternion.clone().invert();
  const direction = camera.position.clone().normalize();
  let distance = 0;
  // Recompute the near and far corners for the current viewing angle.
  for (const x of [-6.15, 6.15]) {
    for (const y of [-0.55, 1.15]) {
      for (const z of [-3.3, 3.3]) {
        const corner = new THREE.Vector3(x, y, z).applyQuaternion(inverseView);
        distance = Math.max(distance,
          corner.z + Math.abs(corner.x) / (Math.tan(halfFov) * aspect * 0.94),
          corner.z + Math.abs(corner.y) / (Math.tan(halfFov) * 0.94));
      }
    }
  }
  camera.position.copy(direction.multiplyScalar(distance));
  camera.updateMatrixWorld();
}

function CameraControls({ resetToken }) {
  const { camera, gl, invalidate, size } = useThree();
  const controlsRef = useRef(null);
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enabled = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.minPolarAngle = Math.PI / 7;
    controls.maxPolarAngle = Math.PI / 3;
    controls.minAzimuthAngle = -Math.PI / 3;
    controls.maxAzimuthAngle = Math.PI / 3;
    controls.target.set(0, 0, 0);
    const handleChange = () => {
      fitKeyboardInView(camera, size);
      invalidate();
    };
    controls.addEventListener('change', handleChange);
    controlsRef.current = controls;
    return () => { controls.removeEventListener('change', handleChange); controls.dispose(); };
  }, [camera, gl, invalidate, size.width, size.height]);
  useEffect(() => {
    const direction = new THREE.Vector3(...initialCamera).normalize();
    camera.position.copy(direction);
    camera.lookAt(0, 0, 0);
    fitKeyboardInView(camera, size);
    camera.updateProjectionMatrix();
    controlsRef.current?.update();
    invalidate();
  }, [resetToken, camera, invalidate, size.width, size.height]);
  return null;
}

export default function ThreeKeyboard({ focusedSkill, onChoose }) {
  const [resetToken, setResetToken] = useState(0);
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotion, () => false);
  return (
    <>
      <div className="skills-three-canvas" aria-label="Interactive 3D skills keyboard">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          frameloop="demand"
          camera={{ position: initialCamera, fov: 36, near: 0.1, far: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          fallback={<p className="skills-three-message">3D is unavailable on this device. Focus this area and use the arrow keys to explore the skills.</p>}
        >
          <ambientLight intensity={0.65} />
          <hemisphereLight args={['#fff0d9', '#27212a', 1.5]} />
          <directionalLight position={[-4, 9, 5]} intensity={3.5} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-0.001} />
          <directionalLight position={[5, 5, -4]} color="#d9e5ff" intensity={2.5} />
          <pointLight position={[-5, 1.5, 3]} color="#ffb52e" intensity={12} distance={12} />
          <pointLight position={[5, 2, 2]} color="#ff762e" intensity={15} distance={12} />
          <Chassis />
          {layout.map((item, index) => <Keycap key={`${item.label}-${index}`} item={item} focusedSkill={focusedSkill} onChoose={onChoose} reducedMotion={reducedMotion} />)}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.44, 0]} receiveShadow>
            <planeGeometry args={[30, 25]} /><shadowMaterial transparent opacity={0.3} />
          </mesh>
          <CameraControls resetToken={resetToken} />
        </Canvas>
      </div>
      <div className="skills-three-controls">
        <button type="button" onClick={() => setResetToken((value) => value + 1)}>Reset view</button>
      </div>
    </>
  );
}
