import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useTheme } from '../../../context/ThemeContext';
import { useEffects } from '../../../context/EffectsContext';
import particlesConfig from '../../../assets/particles.json';

const ParticleBackground = () => {
  const { theme, resolvedTheme } = useTheme();
  const { particlesEnabled, isReady } = useEffects();
  const [libraryReady, setLibraryReady] = useState(false);

  useEffect(() => {
    if (!particlesEnabled || !libraryReady || !window.particlesJS) return;
    const isDark = resolvedTheme === 'dark';
    const accentColor = theme === 'aqua-blue'
      ? '#00e5ff'
      : isDark
        ? '#a3a3a3'
        : '#525252';

    const config = structuredClone(particlesConfig);
    config.particles.color.value = accentColor;
    config.particles.number.value = 70;
    config.particles.opacity.value = isDark ? 0.4 : 0.25;
    config.particles.line_linked.color = accentColor;
    config.particles.line_linked.opacity = isDark ? 0.18 : 0.12;
    // Decorative only: clicks never add particles or capture content input.
    config.interactivity.events.onhover.enable = false;
    config.interactivity.events.onclick.enable = false;
    config.interactivity.events.resize = false;

    window.particlesJS('particles-js', config);
    const instance = window.pJSDom[window.pJSDom.length - 1];
    const particles = instance.pJS;
    const resize = () => {
      const ratio = particles.tmp.retina ? particles.canvas.pxratio : 1;
      particles.canvas.w = particles.canvas.el.offsetWidth * ratio;
      particles.canvas.h = particles.canvas.el.offsetHeight * ratio;
      particles.fn.canvasSize();
      particles.fn.vendors.densityAutoParticles();
    };
    let paused = false;
    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(particles.fn.drawAnimFrame);
        paused = true;
      } else if (paused) {
        paused = false;
        particles.fn.vendors.draw();
      }
    };
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    handleVisibility();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.cancelAnimationFrame(particles.fn.drawAnimFrame);
      window.cancelAnimationFrame(particles.tmp.checkAnimFrame);
      particles.canvas.el.remove();
      particles.fn.particlesEmpty();
      // The library's destroy method nulls its global registry; remove only our instance.
      window.pJSDom = window.pJSDom.filter((item) => item !== instance);
    };
  }, [libraryReady, particlesEnabled, resolvedTheme, theme]);

  if (!isReady || !particlesEnabled) return null;

  return (
    <>
      <Script src="/vendor/particles.js" strategy="afterInteractive" onReady={() => setLibraryReady(true)} />
      <div id="particles-js" className="particles-container" aria-hidden="true" />
    </>
  );
};

export default ParticleBackground;
