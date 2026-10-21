'use client';

import { Component, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { technicalSkills, softSkills, skillCategories } from './skillsData';

const ThreeKeyboard = dynamic(() => import('./ThreeKeyboard'), {
  ssr: false,
  loading: () => <div className="skills-three-loading" role="status">Loading 3D keyboard…</div>,
});
const allSkills = [...technicalSkills, ...softSkills.map((skill) => ({ ...skill, cat: 'professional' }))];

class KeyboardBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="skills-three-message">The 3D keyboard could not load. Focus this area and use the arrow keys to explore the skills.</p>
      : this.props.children;
  }
}

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [focusedSkill, setFocusedSkill] = useState(null);
  const [showScene, setShowScene] = useState(false);
  const sceneRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShowScene(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    if (sceneRef.current) observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section color-bg" aria-labelledby="skills-title">
      <div className="container">
        <h2 className="section-title" id="skills-title"><span>Skills</span></h2>
        <div className="skills-three-stage" ref={sceneRef}
          tabIndex={0} role="group"
          aria-label="3D skills keyboard. Use Left and Right arrow keys to explore skills."
          onPointerDownCapture={() => setFocusedSkill(null)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusedSkill(null); }}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const current = allSkills.findIndex((skill) => skill.name === focusedSkill);
            const index = event.key === 'Home' ? 0 : event.key === 'End' ? allSkills.length - 1
              : current < 0 ? (event.key === 'ArrowRight' ? 0 : allSkills.length - 1)
                : (current + (event.key === 'ArrowRight' ? 1 : -1) + allSkills.length) % allSkills.length;
            setFocusedSkill(allSkills[index].name);
            setActiveSkill(allSkills[index]);
          }}>
          <KeyboardBoundary>
            {showScene
              ? <ThreeKeyboard focusedSkill={focusedSkill} onChoose={setActiveSkill} />
              : <div className="skills-three-loading" role="status">3D skills keyboard</div>}
          </KeyboardBoundary>
        </div>

        <div className="skills-keyboard-readout" role="status" aria-live="polite" aria-atomic="true">
          {activeSkill ? (
            <>
              <span className="skills-readout-category">{skillCategories[activeSkill.cat]}</span>
              <strong>{activeSkill.name}</strong>
              <span className="skills-readout-meter" aria-hidden="true"><span style={{ width: `${activeSkill.level}%` }} /></span>
              <span className="skills-readout-level">{activeSkill.level}% <span>proficiency</span></span>
            </>
          ) : <span className="skills-readout-empty">Select a key to explore the skills behind my work.</span>}
        </div>

      </div>
    </section>
  );
}
