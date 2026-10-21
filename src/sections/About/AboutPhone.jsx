'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ThreeAboutPhone = dynamic(() => import('./ThreeAboutPhone'), { ssr: false });
const maxYaw = 0.27;
const maxPitch = 0.13;
const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

export default function AboutPhone() {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [orientation, setOrientation] = useState({ yaw: 0, pitch: 0 });
  const [resetCycle, setResetCycle] = useState(0);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) {
      setReducedMotion(true);
      setIsOpen(true);
      return undefined;
    }

    const stage = stageRef.current;
    if (!stage) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsOpen(true);
      observer.disconnect();
    }, { threshold: 0.45 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const finishDrag = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handlePointerDown = (event) => {
    if (!isOpen || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const active = event.pointerType !== 'touch';
    dragRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      yaw: orientation.yaw,
      pitch: orientation.pitch,
      active,
    };
    if (active) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.active) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
        dragRef.current = null;
        return;
      }
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      drag.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }
    setOrientation({ yaw: clamp(drag.yaw + dx * 0.003, maxYaw), pitch: clamp(drag.pitch - dy * 0.002, maxPitch) });
  };

  const resetView = () => {
    setOrientation({ yaw: 0, pitch: 0 });
    setResetCycle((cycle) => cycle + 1);
  };

  const handleKeyDown = (event) => {
    if (!isOpen || event.target !== stageRef.current) return;
    const steps = { ArrowLeft: [-0.06, 0], ArrowRight: [0.06, 0], ArrowUp: [0, -0.05], ArrowDown: [0, 0.05] };
    if (event.key === 'Home') {
      event.preventDefault();
      resetView();
    } else if (steps[event.key]) {
      event.preventDefault();
      const [yaw, pitch] = steps[event.key];
      setOrientation((current) => ({ yaw: clamp(current.yaw + yaw, maxYaw), pitch: clamp(current.pitch + pitch, maxPitch) }));
    }
  };

  return (
    <div
      ref={stageRef}
      className={`about-phone-stage${isOpen ? ' is-interactive' : ''}${isDragging ? ' is-dragging' : ''}`}
      role="group"
      tabIndex={isOpen ? 0 : -1}
      aria-label="Graphite foldable phone displaying a portrait of Geaser Jan. Drag to rotate, use arrow keys to adjust the view, or press Home to reset."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onKeyDown={handleKeyDown}
    >
      <ThreeAboutPhone isOpen={isOpen} reducedMotion={reducedMotion} orientation={orientation} resetCycle={resetCycle} />
      {isOpen && (
        <button
          type="button"
          className="about-phone-reset"
          aria-label="Reset view: close and reopen the phone"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={resetView}
        >
          Reset view
        </button>
      )}
    </div>
  );
}
