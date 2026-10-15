import { useCallback, useEffect, useRef } from 'react';

const CARDS = '.project-card, .skill-card, .certificate-card, .experience-card, .project-slider-card';
const INTERACTIVE = 'a[href], button, [role="button"]';
// Adjust all sounds here: 0 = silent, 1 = original level, 2.5 = louder.
const MASTER_VOLUME = 10.5;

const TONES = {
  hover: { from: 620, to: 460, duration: 0.055, volume: 0.012 },
  click: { from: 400, to: 650, duration: 0.075, volume: 0.022 },
  enable: { from: 660, to: 880, duration: 0.11, volume: 0.022 },
  disable: { from: 440, to: 260, duration: 0.085, volume: 0.018 },
};

export default function useHoverSounds(enabled) {
  const contextRef = useRef(null);
  const lastPlayedRef = useRef({ hover: -Infinity, click: -Infinity });

  const prepareAudio = useCallback(async () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!contextRef.current || contextRef.current.state === 'closed') {
        contextRef.current = new AudioContext();
      }
      if (contextRef.current.state === 'suspended') {
        await contextRef.current.resume();
      }
      return contextRef.current;
    } catch {
      // Audio is optional; unsupported or blocked audio must not affect navigation.
    }
  }, []);

  const playTone = useCallback((kind) => {
    const context = contextRef.current;
    if (document.hidden || !context || context.state !== 'running') return;
    const now = performance.now();
    const last = lastPlayedRef.current;
    if (kind === 'hover' && (now - last.hover < 160 || now - last.click < 120)) return;
    if (kind === 'click' && now - last.click < 75) return;
    if (kind === 'hover') last.hover = now;
    else last.click = now;

    const tone = TONES[kind];
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    const start = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(tone.from, start);
    oscillator.frequency.exponentialRampToValueAtTime(tone.to, start + tone.duration);
    volume.gain.setValueAtTime(0, start);
    volume.gain.linearRampToValueAtTime(Math.min(Math.max(tone.volume * MASTER_VOLUME, 0), 1), start + 0.006);
    volume.gain.exponentialRampToValueAtTime(0.0001, start + tone.duration);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.onended = () => { oscillator.disconnect(); volume.disconnect(); };
    oscillator.start(start);
    oscillator.stop(start + tone.duration + 0.005);
  }, []);

  const confirmAudio = useCallback(async (nextEnabled) => {
    const context = await prepareAudio();
    if (context) playTone(nextEnabled ? 'enable' : 'disable');
  }, [prepareAudio, playTone]);

  useEffect(() => {
    if (!enabled) return;
    const handleHover = (event) => {
      if (event.pointerType === 'touch' || !(event.target instanceof Element)) return;
      const target = event.target.closest(CARDS) || event.target.closest(INTERACTIVE);
      if (!target || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) return;
      if (target.matches(':disabled, [aria-disabled="true"]')) return;
      playTone('hover');
    };
    const handleFocus = (event) => {
      if (event.target instanceof Element && event.target.matches(':focus-visible') && event.target.closest(INTERACTIVE)) playTone('hover');
    };
    let active = true;
    const handleClick = async (event) => {
      if (!(event.target instanceof Element) || event.target.closest('[data-audio-toggle]')) return;
      const target = event.target.closest(`${CARDS}, ${INTERACTIVE}`);
      if (!target || target.matches(':disabled, [aria-disabled="true"]')) return;
      await prepareAudio();
      if (active) playTone('click');
    };
    // A saved opt-in is retained, but browsers still require a gesture after reload.
    document.addEventListener('pointerdown', prepareAudio, { passive: true });
    document.addEventListener('keydown', prepareAudio);
    document.addEventListener('pointerover', handleHover, { passive: true });
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('click', handleClick);
    return () => {
      active = false;
      document.removeEventListener('pointerdown', prepareAudio);
      document.removeEventListener('keydown', prepareAudio);
      document.removeEventListener('pointerover', handleHover);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('click', handleClick);
      // Let the brief mute confirmation finish; no further interaction sounds play.
    };
  }, [enabled, prepareAudio, playTone]);

  useEffect(() => () => {
    contextRef.current?.close().catch(() => {});
    contextRef.current = null;
  }, []);

  return confirmAudio;
}
