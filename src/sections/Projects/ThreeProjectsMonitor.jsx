'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { assetSrc } from '../../lib/assetSrc';

const monitorWidth = 9.1;
const monitorHeight = 3.85;
const screenWidth = 8.68;
const screenHeight = 3.43;
const curveDepth = 0.42;

function curvedSurface(width, height, depth, frontZ) {
  const columns = 64;
  const rows = 2;
  const vertices = [];
  const uvs = [];
  const indices = [];
  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows;
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns;
      const x = (u - 0.5) * width;
      vertices.push(x, (v - 0.5) * height, frontZ + depth * (x / (width / 2)) ** 2);
      uvs.push(u, v);
    }
  }
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const lowerLeft = row * (columns + 1) + column;
      const lowerRight = lowerLeft + 1;
      const upperLeft = lowerLeft + columns + 1;
      const upperRight = upperLeft + 1;
      indices.push(lowerLeft, lowerRight, upperLeft, lowerRight, upperRight, upperLeft);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function curvedRail(width, y, z, depth, radius) {
  const points = Array.from({ length: 49 }, (_, index) => {
    const x = (index / 48 - 0.5) * width;
    return new THREE.Vector3(x, y, z + depth * (x / (width / 2)) ** 2);
  });
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 64, radius, 6, false);
}

function sweptStandFoot(side) {
  const shape = new THREE.Shape();
  const x = (value) => value * side;
  shape.moveTo(x(0.15), -2.82);
  shape.lineTo(x(0.62), -2.82);
  shape.lineTo(x(1.05), -2.94);
  shape.lineTo(x(3.45), -3.19);
  shape.lineTo(x(3.55), -3.27);
  shape.lineTo(x(2.3), -3.27);
  shape.lineTo(x(0.65), -3.04);
  shape.lineTo(x(0.15), -3.04);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 1,
  });
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((value, index) => context.fillText(value, x, y + index * lineHeight));
  return Math.min(lines.length, maxLines);
}

function useProjectTextures(projects) {
  const urls = useMemo(() => projects.map((project) => assetSrc(project.image)), [projects]);
  const sources = useLoader(THREE.TextureLoader, urls);
  const textures = useMemo(() => sources.map((source, index) => {
    const project = projects[index];
    const image = source.image;
    const canvas = document.createElement('canvas');
    canvas.width = 1800;
    canvas.height = 760;
    const context = canvas.getContext('2d');
    const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    background.addColorStop(0, '#06111c');
    background.addColorStop(1, '#101d32');
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.filter = 'blur(54px) saturate(0.8)';
    context.globalAlpha = 0.55;
    context.drawImage(image, -40, -40, canvas.width + 80, canvas.height + 80);
    context.restore();
    context.fillStyle = 'rgba(3, 10, 20, 0.78)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const previewX = 66;
    const previewY = 53;
    const previewSize = 654;
    context.fillStyle = '#07111e';
    context.beginPath();
    context.roundRect(previewX - 8, previewY - 8, previewSize + 16, previewSize + 16, 25);
    context.fill();
    context.save();
    context.beginPath();
    context.roundRect(previewX, previewY, previewSize, previewSize, 18);
    context.clip();
    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const scale = Math.min(previewSize / imageWidth, previewSize / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    context.drawImage(image, previewX + (previewSize - drawWidth) / 2, previewY + (previewSize - drawHeight) / 2, drawWidth, drawHeight);
    context.restore();
    context.strokeStyle = 'rgba(36, 223, 240, 0.65)';
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(previewX - 8, previewY - 8, previewSize + 16, previewSize + 16, 25);
    context.stroke();

    context.fillStyle = 'rgba(22, 219, 239, 0.9)';
    context.fillRect(770, 74, 5, 612);
    context.font = '600 30px Inter, sans-serif';
    context.fillText(`FEATURED PROJECT  ${String(index + 1).padStart(2, '0')}`, 829, 136);
    context.fillStyle = '#f8fbff';
    context.font = '700 74px Outfit, Inter, sans-serif';
    const titleLines = drawWrappedText(context, project.title, 829, 260, 870, 88, 2);
    context.fillStyle = '#abb9c8';
    context.font = '400 37px Inter, sans-serif';
    const descriptionY = titleLines > 1 ? 414 : 370;
    drawWrappedText(context, project.description, 829, descriptionY, 835, 53, 4);
    context.font = '600 28px Inter, sans-serif';
    let chipX = 829;
    let chipY = 635;
    project.tech.forEach((technology) => {
      const chipWidth = context.measureText(technology).width + 38;
      if (chipX + chipWidth > 1715) {
        chipX = 829;
        chipY += 47;
      }
      context.fillStyle = 'rgba(0, 205, 230, 0.13)';
      context.beginPath();
      context.roundRect(chipX, chipY - 31, chipWidth, 42, 17);
      context.fill();
      context.fillStyle = '#57eaf5';
      context.fillText(technology, chipX + 19, chipY);
      chipX += chipWidth + 15;
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }), [projects, sources]);
  useEffect(() => () => textures.forEach((texture) => texture.dispose()), [textures]);
  return textures;
}

function MonitorModel({ projects, activeIndex, reducedMotion, viewYaw, viewPitch }) {
  const textures = useProjectTextures(projects);
  const invalidate = useThree((state) => state.invalidate);
  const assembly = useRef(null);
  const baseMaterial = useRef(null);
  const nextMaterial = useRef(null);
  const displayedIndex = useRef(activeIndex);
  const fade = useRef(1);
  const body = useMemo(() => curvedSurface(monitorWidth, monitorHeight, curveDepth, -0.08), []);
  const back = useMemo(() => curvedSurface(monitorWidth, monitorHeight, curveDepth, -0.29), []);
  const screen = useMemo(() => curvedSurface(screenWidth, screenHeight, curveDepth * 0.91, 0.012), []);
  const nextScreen = useMemo(() => curvedSurface(screenWidth, screenHeight, curveDepth * 0.91, 0.019), []);
  const topRail = useMemo(() => curvedRail(monitorWidth, monitorHeight / 2, -0.09, curveDepth, 0.045), []);
  const bottomRail = useMemo(() => curvedRail(monitorWidth, -monitorHeight / 2, -0.09, curveDepth, 0.055), []);
  const lightRail = useMemo(() => curvedRail(monitorWidth - 0.35, -monitorHeight / 2 - 0.025, -0.045, curveDepth * 0.94, 0.016), []);
  const leftFoot = useMemo(() => sweptStandFoot(-1), []);
  const rightFoot = useMemo(() => sweptStandFoot(1), []);

  useEffect(() => () => [body, back, screen, nextScreen, topRail, bottomRail, lightRail, leftFoot, rightFoot].forEach((geometry) => geometry.dispose()), [body, back, screen, nextScreen, topRail, bottomRail, lightRail, leftFoot, rightFoot]);

  useEffect(() => {
    if (!baseMaterial.current || !nextMaterial.current) return;
    if (reducedMotion) {
      baseMaterial.current.map = textures[activeIndex];
      baseMaterial.current.needsUpdate = true;
      nextMaterial.current.opacity = 0;
      displayedIndex.current = activeIndex;
      fade.current = 1;
    } else if (activeIndex !== displayedIndex.current) {
      nextMaterial.current.map = textures[activeIndex];
      nextMaterial.current.needsUpdate = true;
      nextMaterial.current.opacity = 0;
      fade.current = 0;
    }
    invalidate();
  }, [activeIndex, reducedMotion, textures, invalidate]);

  useEffect(() => { invalidate(); }, [viewYaw, viewPitch, invalidate]);

  useFrame((_, delta) => {
    const ease = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 13);
    assembly.current.rotation.y = THREE.MathUtils.lerp(assembly.current.rotation.y, viewYaw, ease);
    assembly.current.rotation.x = THREE.MathUtils.lerp(assembly.current.rotation.x, viewPitch, ease);
    if (Math.abs(assembly.current.rotation.y - viewYaw) < 0.0005) assembly.current.rotation.y = viewYaw;
    if (Math.abs(assembly.current.rotation.x - viewPitch) < 0.0005) assembly.current.rotation.x = viewPitch;
    const moving = assembly.current.rotation.y !== viewYaw || assembly.current.rotation.x !== viewPitch;

    if (fade.current < 1) {
      fade.current = Math.min(1, fade.current + Math.min(delta, 0.05) / 0.36);
      nextMaterial.current.opacity = THREE.MathUtils.smoothstep(fade.current, 0, 1);
      if (fade.current === 1) {
        baseMaterial.current.map = nextMaterial.current.map;
        baseMaterial.current.needsUpdate = true;
        nextMaterial.current.opacity = 0;
        displayedIndex.current = activeIndex;
      }
    }
    if (moving || fade.current < 1) {
      invalidate();
    }
  });

  return (
    <group ref={assembly}>
      <mesh geometry={back}><meshPhysicalMaterial color="#171c25" metalness={0.65} roughness={0.43} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={body}><meshPhysicalMaterial color="#272d38" metalness={0.72} roughness={0.3} clearcoat={0.45} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={screen} renderOrder={2}><meshBasicMaterial ref={baseMaterial} map={textures[displayedIndex.current]} toneMapped={false} /></mesh>
      <mesh geometry={nextScreen} renderOrder={3}><meshBasicMaterial ref={nextMaterial} map={textures[displayedIndex.current]} transparent opacity={0} depthWrite={false} toneMapped={false} /></mesh>
      <mesh geometry={topRail}><meshStandardMaterial color="#39424e" metalness={0.8} roughness={0.3} /></mesh>
      <mesh geometry={bottomRail}><meshStandardMaterial color="#111821" metalness={0.65} roughness={0.4} /></mesh>
      <mesh geometry={lightRail}><meshBasicMaterial color="#18d7e9" transparent opacity={0.58} /></mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * monitorWidth / 2, 0, curveDepth - 0.18]}>
          <boxGeometry args={[0.08, monitorHeight, 0.2]} />
          <meshStandardMaterial color="#222a34" metalness={0.7} roughness={0.34} />
        </mesh>
      ))}
      <mesh position={[0, -2.02, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.43, 28]} />
        <meshStandardMaterial color="#10151b" metalness={0.72} roughness={0.4} />
      </mesh>
      <mesh position={[0, -2.43, -0.38]}>
        <boxGeometry args={[0.31, 0.9, 0.26]} />
        <meshStandardMaterial color="#1b2129" metalness={0.72} roughness={0.34} />
      </mesh>
      <mesh position={[0, -2.43, -0.224]}>
        <boxGeometry args={[0.2, 0.86, 0.025]} />
        <meshStandardMaterial color="#303943" metalness={0.75} roughness={0.28} />
      </mesh>
      <mesh position={[0, -2.035, -0.19]}>
        <boxGeometry args={[0.075, 0.08, 0.025]} />
        <meshStandardMaterial color="#adb7bf" metalness={0.8} roughness={0.22} />
      </mesh>
      <mesh position={[0, -2.93, -0.25]}>
        <boxGeometry args={[0.48, 0.22, 0.29]} />
        <meshStandardMaterial color="#171c23" metalness={0.7} roughness={0.4} />
      </mesh>
      {[leftFoot, rightFoot].map((geometry, index) => (
        <mesh key={index} geometry={geometry} position={[0, 0, -0.24]}>
          <meshStandardMaterial color="#252c34" metalness={0.62} roughness={0.38} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function FrameCamera() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const aspect = size.width / Math.max(size.height, 1);
    const fitHeight = 2.78 / halfFov;
    const fitWidth = 4.7 / (halfFov * aspect);
    camera.position.set(0, 0.78, Math.max(fitHeight, fitWidth) + 0.45);
    camera.lookAt(0, -0.53, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);
  return null;
}

export default function ThreeProjectsMonitor({ projects, activeIndex, reducedMotion, viewYaw, viewPitch }) {
  return (
    <Canvas
      className="projects-monitor-canvas"
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.78, 11], fov: 35, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      fallback={<span className="projects-monitor-unavailable">3D monitor unavailable</span>}
      aria-hidden="true"
    >
      <ambientLight intensity={1.65} />
      <directionalLight position={[-5, 7, 9]} intensity={2.25} color="#e9f6ff" />
      <directionalLight position={[6, -1, 5]} intensity={1.1} color="#23dff0" />
      <MonitorModel projects={projects} activeIndex={activeIndex} reducedMotion={reducedMotion} viewYaw={viewYaw} viewPitch={viewPitch} />
      <FrameCamera />
    </Canvas>
  );
}
