import { useState, useEffect, useRef } from 'react';
import profileImg from '../../assets/profile.jpg';
import { assetSrc } from '../../lib/assetSrc';
import PhotoStack from '../../components/PhotoStack';

const About = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const readMoreRef = useRef(null);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const expandRef = useRef(null);
  const bodyRef = useRef(null);
  const modalScrollRef = useRef(0);

  useEffect(() => {
    if (!isAboutModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = readMoreRef.current;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const controls = dialogRef.current?.querySelectorAll('button:not([disabled]), a[href], input, textarea, [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      trigger?.focus({ preventScroll: true });
    };
  }, [isAboutModalOpen]);

  const toggleAboutModal = () => {
    setIsExpanded(false);
    setIsAboutModalOpen((open) => !open);
  };

  const expandView = () => {
    modalScrollRef.current = bodyRef.current?.scrollTop ?? 0;
    setIsExpanded(true);
    closeRef.current?.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
    });
  };

  const closeCurrentView = () => {
    if (isExpanded) {
      setIsExpanded(false);
      requestAnimationFrame(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = modalScrollRef.current;
        expandRef.current?.focus({ preventScroll: true });
      });
    } else {
      setIsAboutModalOpen(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('about-modal-overlay')) {
      toggleAboutModal();
    }
  };

  return (
    <section id="about" className="section color-bg">
      <div className="container">
        <div className="about-wrapper">
          <div className="about-profile reveal">
            <div className="about-portrait-frame">
              <div className="about-portrait">
                <img src={assetSrc(profileImg)} alt="Geaser Jan" />
              </div>
            </div>
          </div>

          <div className="about-brief reveal">
            <h2 className="about-title">About <span>Me</span></h2>
            <h3 className="about-name">Geaser Jan</h3>
            <p className="about-role">Software Developer</p>
            <p className="about-intro">
              I'm currently an AI Product Developer, building web applications and AI-powered tools that automate tasks and solve real-world problems. I combine modern web development with AI integration to create practical, easy-to-use experiences.
            </p>
            <button ref={readMoreRef} className="primary-btn read-more-btn" onClick={toggleAboutModal} aria-haspopup="dialog">
              Read more
            </button>
          </div>
        </div>
      </div>

      {/* Detailed About Modal */}
      {isAboutModalOpen && (
        <div className={`about-modal-overlay${isExpanded ? ' about-modal-overlay-expanded' : ''}`} onClick={handleBackdropClick}>
          <div
            ref={dialogRef}
            className={`about-modal-content reveal-modal${isExpanded ? ' about-modal-expanded' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-modal-title"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                closeCurrentView();
              }
            }}
          >
            <div className="about-modal-header">
              <h2 id="about-modal-title">Who <span>Am I?</span></h2>
              <div className="about-modal-actions">
                {!isExpanded && (
                  <button ref={expandRef} type="button" className="about-modal-expand" onClick={expandView} aria-label="Expand Who Am I to full-screen view">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6" /></svg>
                    Expand
                  </button>
                )}
                <button ref={closeRef} type="button" className="about-modal-close" onClick={closeCurrentView} aria-label={isExpanded ? 'Return to previous modal view' : 'Close modal'}>
                  &times;
                </button>
              </div>
            </div>
            <div ref={bodyRef} className="about-modal-body" role="region" aria-label="About details and photo gallery" tabIndex={0}>
              <PhotoStack />
              <div className="about-modal-text">
                <p>
                  I'm Geaser Jan, a software developer currently working as an AI Product Developer. I love building web applications and AI-powered tools that solve real-world problems and provide great user experiences.
                </p>
                <p>
                  My journey in tech started with a curiosity about how websites work, which led me to pursue mastering modern frameworks. I'm always eager to learn new technologies and improve my skills, especially in integrating AI into development.
                </p>  
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;
