'use client';

import { Component, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import ecommerceImg from '../../assets/projects/ecommerce.png';
import taskAppImg from '../../assets/projects/taskapp.png';
import aiGenImg from '../../assets/projects/aigen.png';
import { assetSrc } from '../../lib/assetSrc';

const ThreeProjectsMonitor = dynamic(() => import('./ThreeProjectsMonitor'), {
  ssr: false,
  loading: () => <div className="projects-monitor-loading" role="status">Loading project monitor…</div>,
});

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured online store with product filtering, cart functionality, and secure checkout.',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: ecommerceImg,
    github: '#',
    demo: '#',
  },
  {
    title: 'Task Management App',
    description: 'A collaborative tool for teams to manage projects, track tasks, and communicate in real-time.',
    tech: ['React', 'Firebase', 'Socket.io', 'CSS'],
    image: taskAppImg,
    github: '#',
    demo: '#',
  },
  {
    title: 'AI Image Generator',
    description: 'An application that uses OpenAI’s DALL-E API to generate unique images based on user prompts.',
    tech: ['JavaScript', 'React', 'Tailwind', 'OpenAI'],
    image: aiGenImg,
    github: '#',
    demo: '#',
  },
];

const rotationLimit = { yaw: 0.18, pitch: 0.08 };
const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

function MonitorFallback({ project }) {
  return (
    <div className="projects-monitor-fallback" aria-hidden="true">
      <div className="projects-monitor-fallback-screen">
        <img src={assetSrc(project.image)} alt="" />
        <strong>{project.title}</strong>
      </div>
      <span className="projects-monitor-fallback-neck" />
      <span className="projects-monitor-fallback-base" />
    </div>
  );
}

class MonitorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScene, setShowScene] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [view, setView] = useState({ yaw: 0, pitch: 0 });
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef(null);
  const dragStart = useRef(null);
  const activeProject = projects[activeIndex];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(preference.matches);
    updateMotion();
    preference.addEventListener('change', updateMotion);
    return () => preference.removeEventListener('change', updateMotion);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShowScene(true);
        observer.disconnect();
      }
    }, { rootMargin: '250px' });
    if (stageRef.current) observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  const showProject = (index) => setActiveIndex((index + projects.length) % projects.length);
  const stepProject = (step) => setActiveIndex((current) => (current + step + projects.length) % projects.length);
  const resetView = () => setView({ yaw: 0, pitch: 0 });

  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      if (event.shiftKey) {
        setView((current) => ({ ...current, yaw: clamp(current.yaw + (event.key === 'ArrowRight' ? 0.04 : -0.04), rotationLimit.yaw) }));
      } else {
        stepProject(event.key === 'ArrowRight' ? 1 : -1);
      }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      setView((current) => ({ ...current, pitch: clamp(current.pitch + (event.key === 'ArrowUp' ? -0.025 : 0.025), rotationLimit.pitch) }));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      showProject(event.key === 'Home' ? 0 : projects.length - 1);
    } else if (event.key.toLowerCase() === 'r') {
      event.preventDefault();
      resetView();
    }
  };

  const handlePointerDown = (event) => {
    if (event.target.closest('button') || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: view.yaw, pitch: view.pitch };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    const start = dragStart.current;
    if (!start || start.id !== event.pointerId) return;
    setView({
      yaw: clamp(start.yaw + (event.clientX - start.x) * 0.0035, rotationLimit.yaw),
      pitch: clamp(start.pitch + (event.clientY - start.y) * 0.0018, rotationLimit.pitch),
    });
  };

  const endPointerDrag = (event) => {
    if (dragStart.current?.id !== event.pointerId) return;
    dragStart.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section id="projects" className="section color-bg-alt projects-section" aria-labelledby="projects-title">
      <div className="container">
        <h2 className="section-title reveal" id="projects-title">Featured <span>Projects</span></h2>
        <div
          ref={stageRef}
          className={`projects-monitor-stage${dragging ? ' is-dragging' : ''}`}
          tabIndex={0}
          role="group"
          aria-label="Curved project monitor. Drag to rotate. Left and Right arrow keys switch projects; Shift with Left or Right and Up or Down rotate the monitor. Press R to reset its angle."
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointerDrag}
          onPointerCancel={endPointerDrag}
          onLostPointerCapture={endPointerDrag}
        >
          <MonitorBoundary fallback={<MonitorFallback project={activeProject} />}>
            {showScene
              ? <ThreeProjectsMonitor projects={projects} activeIndex={activeIndex} reducedMotion={reducedMotion} viewYaw={view.yaw} viewPitch={view.pitch} />
              : <MonitorFallback project={activeProject} />}
          </MonitorBoundary>
          <div className="projects-controls" role="group" aria-label="Choose a project or reset the monitor angle">
            <button type="button" className="projects-arrow" onClick={() => stepProject(-1)} aria-label="Previous project">‹</button>
            <div className="projects-pagination">
              {projects.map((project, index) => (
                <button
                  key={project.title}
                  type="button"
                  className={`projects-page${index === activeIndex ? ' is-active' : ''}`}
                  onClick={() => showProject(index)}
                  aria-label={`Show ${project.title}`}
                  aria-pressed={index === activeIndex}
                >
                  {String(index + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
            <button type="button" className="projects-arrow" onClick={() => stepProject(1)} aria-label="Next project">›</button>
            <button type="button" className="projects-reset-view" onClick={resetView} aria-label="Reset monitor angle" title="Reset monitor angle">↺</button>
          </div>
        </div>
        <p className="projects-screen-reader-details" aria-live="polite">
          {activeProject.title}. {activeProject.description} Technologies: {activeProject.tech.join(', ')}.
        </p>
      </div>
    </section>
  );
}
