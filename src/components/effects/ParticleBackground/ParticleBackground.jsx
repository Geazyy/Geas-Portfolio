import { useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import './ParticleBackground.css';
import particlesConfig from '../../../assets/particles.json';

const ParticleBackground = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const isDark = theme === 'dark';
    const accentColor = isDark ? '#00e5ff' : '#334155';

    // Deep copy and update config for the current theme
    const updatedConfig = {
      ...particlesConfig,
      particles: {
        ...particlesConfig.particles,
        color: { value: accentColor },
        line_linked: {
          ...particlesConfig.particles.line_linked,
          color: accentColor,
          opacity: isDark ? 0.3 : 0.2
        }
      }
    };

    const initParticles = () => {
      if (window.particlesJS) {
        window.particlesJS('particles-js', updatedConfig);
      } else {
        setTimeout(() => {
          if (window.particlesJS) {
            window.particlesJS('particles-js', updatedConfig);
          }
        }, 500);
      }
    };

    initParticles();

    return () => {
      const canvas = document.querySelector('#particles-js canvas');
      if (canvas) canvas.remove();
    };
  }, [theme]);

  // Use the interaction-ready container
  return <div id="particles-js" className="particles-container"></div>;
};

export default ParticleBackground;
