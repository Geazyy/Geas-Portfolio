'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import portrait from '../../assets/profile.jpg';

const halfWidth = 2.4;
const phoneHeight = 4.24;
const openWidth = halfWidth * 2;
const screenWidth = openWidth - 0.2;
const screenHeight = 4;
const openingSeconds = 1.55;
const closingSeconds = 0.85;

function Shell({ size, position, radius = 0.07, color = '#292d35', metalness = 0.48, roughness = 0.52, materialRef, transparent = false, opacity = 1 }) {
  const geometry = useMemo(() => new RoundedBoxGeometry(...size, 3, radius), [size[0], size[1], size[2], radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={position}>
      <meshPhysicalMaterial ref={materialRef} color={color} metalness={metalness} roughness={roughness} clearcoat={0.32} clearcoatRoughness={0.35} transparent={transparent} opacity={opacity} depthWrite={!transparent} />
    </mesh>
  );
}

function RearCamera() {
  return (
    <group position={[1.76, 1.19, -0.148]}>
      <Shell size={[0.52, 1.32, 0.075]} position={[0, 0, 0]} radius={0.23} color="#3b3f47" metalness={0.65} roughness={0.38} />
      {[0.33, -0.21].map((y) => (
        <group key={y} position={[0, y, -0.059]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh><cylinderGeometry args={[0.205, 0.205, 0.045, 32]} /><meshStandardMaterial color="#555b65" metalness={0.72} roughness={0.27} /></mesh>
          <mesh position={[0, -0.028, 0]}><cylinderGeometry args={[0.159, 0.159, 0.012, 32]} /><meshPhysicalMaterial color="#060a13" metalness={0.3} roughness={0.13} clearcoat={1} /></mesh>
          <mesh position={[-0.037, -0.036, 0.03]}><sphereGeometry args={[0.043, 14, 10]} /><meshBasicMaterial color="#234a65" /></mesh>
        </group>
      ))}
      <mesh position={[0, -0.51, -0.061]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.064, 24]} />
        <meshStandardMaterial color="#e9e1cb" emissive="#cec5ae" emissiveIntensity={0.24} />
      </mesh>
    </group>
  );
}

function PhoneHalf({ side, texture, screenMaterialRef }) {
  const left = side === 'left';
  const centerX = left ? -halfWidth / 2 : halfWidth / 2;
  const displayCenterX = left ? -screenWidth / 4 : screenWidth / 4;
  return (
    <group>
      <Shell size={[halfWidth, phoneHeight, 0.16]} position={[centerX, 0, 0]} radius={0.085} color="#333740" />
      <Shell size={[halfWidth - 0.09, phoneHeight - 0.09, 0.016]} position={[centerX, 0, -0.088]} radius={0.055} color="#454952" metalness={0.55} roughness={0.5} />
      <mesh position={[displayCenterX, 0, 0.085]}>
        <planeGeometry args={[screenWidth / 2 + 0.016, screenHeight + 0.016]} />
        <meshBasicMaterial color="#080d13" toneMapped={false} />
      </mesh>
      <mesh position={[displayCenterX, 0, 0.098]}>
        <planeGeometry args={[screenWidth / 2, screenHeight]} />
        <meshBasicMaterial ref={screenMaterialRef} map={texture} toneMapped={false} transparent depthWrite={false} />
      </mesh>
      {!left && <RearCamera />}
      {!left && <Shell size={[0.035, 0.52, 0.075]} position={[halfWidth + 0.018, 0.52, 0]} radius={0.016} color="#4d525b" metalness={0.7} roughness={0.33} />}
    </group>
  );
}

function usePortraitTextures() {
  const source = useLoader(THREE.TextureLoader, portrait.src);
  const textures = useMemo(() => {
    const image = source.image;
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const targetAspect = screenWidth / screenHeight;
    const sourceAspect = sourceWidth / sourceHeight;
    let cropWidth = sourceWidth;
    let cropHeight = sourceHeight;
    let cropX = 0;
    let cropY = 0;
    if (sourceAspect > targetAspect) {
      cropWidth = sourceHeight * targetAspect;
      cropX = (sourceWidth - cropWidth) / 2;
    } else {
      cropHeight = sourceWidth / targetAspect;
      cropY = (sourceHeight - cropHeight) * 0.35;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(1000 * targetAspect);
    canvas.height = 1000;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.roundRect(0, 0, canvas.width, canvas.height, 20);
    context.clip();
    context.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
    const full = new THREE.CanvasTexture(canvas);
    full.colorSpace = THREE.SRGBColorSpace;
    full.anisotropy = 8;
    const left = full.clone();
    left.repeat.set(0.5, 1);
    left.offset.set(0, 0);
    left.needsUpdate = true;
    const right = full.clone();
    right.repeat.set(0.5, 1);
    right.offset.set(0.5, 0);
    right.needsUpdate = true;
    return { full, left, right };
  }, [source]);
  useEffect(() => () => Object.values(textures).forEach((texture) => texture.dispose()), [textures]);
  return textures;
}

function FoldableModel({ isOpen, reducedMotion, orientation, resetCycle }) {
  const textures = usePortraitTextures();
  const view = useRef(null);
  const root = useRef(null);
  const rightLeaf = useRef(null);
  const joinedScreen = useRef(null);
  const leftScreen = useRef(null);
  const rightScreen = useRef(null);
  const progress = useRef(reducedMotion ? 1 : 0);
  const replayPhase = useRef('idle');
  const previousResetCycle = useRef(resetCycle);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (reducedMotion) progress.current = 1;
    invalidate();
  }, [isOpen, reducedMotion, invalidate]);

  useEffect(() => invalidate(), [orientation.yaw, orientation.pitch, invalidate]);

  useEffect(() => {
    if (resetCycle === previousResetCycle.current) return;
    previousResetCycle.current = resetCycle;
    if (reducedMotion) {
      progress.current = 1;
      replayPhase.current = 'idle';
    } else {
      replayPhase.current = 'closing';
    }
    invalidate();
  }, [resetCycle, reducedMotion, invalidate]);

  useFrame((_, delta) => {
    if (reducedMotion) {
      progress.current = 1;
      replayPhase.current = 'idle';
    } else if (replayPhase.current === 'closing') {
      progress.current = Math.max(0, progress.current - Math.min(delta, 0.05) / closingSeconds);
      if (progress.current === 0) replayPhase.current = 'opening';
    } else if (isOpen && progress.current < 1) {
      progress.current = Math.min(1, progress.current + Math.min(delta, 0.05) / openingSeconds);
      if (progress.current === 1) replayPhase.current = 'idle';
    }
    const p = progress.current;
    const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    // Center the changing width while the left panel itself stays unrotated.
    root.current.position.x = halfWidth / 2 * (1 - eased);
    rightLeaf.current.rotation.y = -Math.PI * (1 - eased);
    rightLeaf.current.position.z = 0.18 * (1 - eased);

    const rotationStep = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 12);
    view.current.rotation.y = THREE.MathUtils.lerp(view.current.rotation.y, orientation.yaw, rotationStep);
    view.current.rotation.x = THREE.MathUtils.lerp(view.current.rotation.x, orientation.pitch, rotationStep);

    const merged = THREE.MathUtils.smoothstep(p, 0.9, 1);
    joinedScreen.current.opacity = merged;
    leftScreen.current.opacity = 1 - merged;
    rightScreen.current.opacity = 1 - merged;
    if (replayPhase.current === 'closing' || (isOpen && p < 1) || Math.abs(view.current.rotation.y - orientation.yaw) > 0.001 || Math.abs(view.current.rotation.x - orientation.pitch) > 0.001) invalidate();
  });

  return (
    <group ref={view}>
      <group ref={root}>
        <PhoneHalf side="left" texture={textures.left} screenMaterialRef={leftScreen} />
        <group ref={rightLeaf}>
          <PhoneHalf side="right" texture={textures.right} screenMaterialRef={rightScreen} />
        </group>
        <mesh position={[0, 0, -0.025]}>
          <cylinderGeometry args={[0.055, 0.055, phoneHeight - 0.04, 18]} />
          <meshStandardMaterial color="#171b21" metalness={0.65} roughness={0.39} />
        </mesh>
        <mesh position={[0, 0, 0.126]} renderOrder={10}>
          <planeGeometry args={[screenWidth, screenHeight]} />
          <meshBasicMaterial ref={joinedScreen} map={textures.full} toneMapped={false} transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

export default function ThreeAboutPhone({ isOpen, reducedMotion, orientation, resetCycle }) {
  return (
    <Canvas
      className="about-phone-canvas"
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8.15], fov: 35, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      fallback={<span className="about-phone-unavailable">3D phone unavailable</span>}
      aria-hidden="true"
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[-4, 6, 8]} intensity={2.2} color="#e4edff" />
      <directionalLight position={[5, -2, 4]} intensity={0.85} color="#15d9f2" />
      <FoldableModel isOpen={isOpen} reducedMotion={reducedMotion} orientation={orientation} resetCycle={resetCycle} />
    </Canvas>
  );
}
