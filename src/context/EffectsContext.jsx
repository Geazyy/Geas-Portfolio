'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import useHoverSounds from '../hooks/useHoverSounds';

const EffectsContext = createContext(null);
const PARTICLES_KEY = 'portfolio-particles-enabled';
const SOUNDS_KEY = 'portfolio-sounds-enabled';
const CHANGE_EVENT = 'portfolio-effects-change';
const sessionPreferences = new Map();

function subscribe(onChange) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  motion.addEventListener('change', onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    motion.removeEventListener('change', onChange);
  };
}

function useSavedPreference(key, getDefault) {
  const enabled = useSyncExternalStore(subscribe, () => {
    if (sessionPreferences.has(key)) return sessionPreferences.get(key);
    try {
      const saved = localStorage.getItem(key);
      if (saved === 'true' || saved === 'false') return saved === 'true';
    } catch { /* Storage may be unavailable in private or restricted browsers. */ }
    return getDefault();
  }, () => null);

  const update = (value) => {
    try {
      localStorage.setItem(key, String(value));
      sessionPreferences.delete(key);
    } catch {
      sessionPreferences.set(key, value);
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };
  return [enabled, update];
}

export function EffectsProvider({ children }) {
  const [particlesEnabled, updateParticles] = useSavedPreference(PARTICLES_KEY, () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [soundsEnabled, saveSounds] = useSavedPreference(SOUNDS_KEY, () => false);
  const isReady = particlesEnabled !== null && soundsEnabled !== null;
  const confirmAudio = useHoverSounds(soundsEnabled === true);

  const updateSounds = (enabled) => {
    // Called directly from the visitor's click, satisfying browser audio policies.
    confirmAudio(enabled);
    saveSounds(enabled);
  };

  return (
    <EffectsContext.Provider value={{ particlesEnabled: particlesEnabled === true, soundsEnabled: soundsEnabled === true, isReady, updateParticles, updateSounds }}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const context = useContext(EffectsContext);
  if (!context) throw new Error('useEffects must be used within EffectsProvider');
  return context;
}
