import { useEffect } from 'react';

const LINE_HEIGHT = 16;
const EASING_TIME = 105;
const MAX_SPEED = 4.5;

function isNestedScroller(target) {
  let element = target instanceof Element ? target : null;
  while (element && element !== document.body && element !== document.documentElement) {
    const overflow = window.getComputedStyle(element).overflowY;
    if (/^(auto|scroll|overlay)$/.test(overflow) && element.scrollHeight > element.clientHeight + 1) {
      return true;
    }
    element = element.parentElement;
  }
  return false;
}

function usesKeyboardForInteraction(target, key) {
  if (!(target instanceof Element)) return false;
  if (target.closest(
    'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="dialog"], [role="slider"], [role="spinbutton"], [role="combobox"], [role="listbox"]',
  )) return true;
  return (key === ' ' || key === 'Spacebar') && Boolean(target.closest('button, [role="button"]'));
}

export default function useGentleScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let destination = window.scrollY;
    let lastTime = 0;
    let lastDirection = 0;

    const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clamp = (value) => Math.max(0, Math.min(value, maxScroll()));

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      lastDirection = 0;
      destination = window.scrollY;
    };

    const animate = (time) => {
      const elapsed = Math.min(lastTime ? time - lastTime : 16, 48);
      lastTime = time;
      destination = clamp(destination);
      const distance = destination - window.scrollY;

      if (Math.abs(distance) < 0.8) {
        window.scrollTo({ top: destination, behavior: 'instant' });
        stop();
        return;
      }

      const eased = distance * (1 - Math.exp(-elapsed / EASING_TIME));
      const step = Math.sign(distance) * Math.min(Math.abs(eased), elapsed * MAX_SPEED);
      window.scrollTo({ top: window.scrollY + step, behavior: 'instant' });
      frame = window.requestAnimationFrame(animate);
    };

    const moveBy = (delta) => {
      const direction = Math.sign(delta);
      if (frame && direction !== lastDirection) destination = window.scrollY;
      lastDirection = direction;
      destination = clamp((frame ? destination : window.scrollY) + delta);
      if (!frame && Math.abs(destination - window.scrollY) > 0.8) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const moveTo = (position) => {
      destination = clamp(position);
      lastDirection = Math.sign(destination - window.scrollY);
      if (!frame && Math.abs(destination - window.scrollY) > 0.8) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const onWheel = (event) => {
      if (motionPreference.matches || event.defaultPrevented || event.ctrlKey || event.metaKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) || isNestedScroller(event.target) ||
        document.body.style.overflow === 'hidden') {
        stop();
        return;
      }

      const unit = event.deltaMode === 1 ? LINE_HEIGHT : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = event.deltaY * unit;
      if (!delta || (clamp(window.scrollY + delta) === window.scrollY && !frame)) return;
      event.preventDefault();
      if (!frame) window.scrollTo({ top: window.scrollY, behavior: 'instant' });
      moveBy(delta);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        stop();
        return;
      }
      if (motionPreference.matches || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ||
        usesKeyboardForInteraction(event.target, event.key) || isNestedScroller(event.target) ||
        document.body.style.overflow === 'hidden') {
        stop();
        return;
      }

      const page = window.innerHeight * 0.85;
      let delta = 0;
      if (event.key === 'ArrowDown') delta = 88;
      else if (event.key === 'ArrowUp') delta = -88;
      else if (event.key === 'PageDown') delta = page;
      else if (event.key === 'PageUp') delta = -page;
      else if (event.key === ' ' || event.key === 'Spacebar') delta = event.shiftKey ? -page : page;
      else if (event.key === 'Home') moveTo(0);
      else if (event.key === 'End') moveTo(maxScroll());
      else return;

      if (delta) moveBy(delta);
      event.preventDefault();
    };

    const onPointerDown = () => {
      stop();
      window.scrollTo({ top: window.scrollY, behavior: 'instant' });
    };
    const onMotionChange = () => { if (motionPreference.matches) stop(); };

    window.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    document.addEventListener('click', stop, true);
    window.addEventListener('hashchange', stop);
    window.addEventListener('popstate', stop);
    motionPreference.addEventListener('change', onMotionChange);

    return () => {
      stop();
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('click', stop, true);
      window.removeEventListener('hashchange', stop);
      window.removeEventListener('popstate', stop);
      motionPreference.removeEventListener('change', onMotionChange);
    };
  }, []);
}
