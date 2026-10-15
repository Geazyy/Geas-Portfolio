import { useState, useEffect, useRef } from 'react';
import profileImg from '../../assets/profile.jpg';
import { assetSrc } from '../../lib/assetSrc';
import PhotoStack from '../../components/PhotoStack';

const About = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const readMoreRef = useRef(null);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isAboutModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = readMoreRef.current;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsAboutModalOpen(false);
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

  const toggleAboutModal = () => setIsAboutModalOpen(!isAboutModalOpen);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('about-modal-overlay')) {
      toggleAboutModal();
    }
  };

  return (
    <section id="about" className="section color-bg">
      <div className="container">
        <div className="about-wrapper">
          {/* Main Side View */}
          <div className="about-profile reveal">
            <div className="hexagon-container">
              <div className="hexagon">
                <img src={assetSrc(profileImg)} alt="Profile" />
              </div>
              <div className="hexagon-glow"></div>
            </div>
          </div>

          <div className="about-brief reveal">
            <h2 className="about-title">About <span>Me</span></h2>
            <h3 className="about-role">BS Information Technology Student</h3>
            <p className="about-intro">
              As an aspiring full-stack developer with a focus on modern web stacks (MERN/PERN), I have built several projects that solve real-world problems. Recently, I've been exploring the world of AI integration and scalable web development.
            </p>
            <button ref={readMoreRef} className="primary-btn read-more-btn" onClick={toggleAboutModal} aria-haspopup="dialog">
              Read more
            </button>
          </div>
        </div>
      </div>

      {/* Detailed About Modal */}
      {isAboutModalOpen && (
        <div className="about-modal-overlay" onClick={handleBackdropClick}>
          <div ref={dialogRef} className="about-modal-content reveal-modal" role="dialog" aria-modal="true" aria-labelledby="about-modal-title">
            <div className="about-modal-header">
              <h2 id="about-modal-title">Who <span>Am I?</span></h2>
              <button ref={closeRef} className="about-modal-close" onClick={toggleAboutModal} aria-label="Close modal">
                &times;
              </button>
            </div>
            <div className="about-modal-body">
              <PhotoStack />
              <div className="about-modal-text">
                <p>
                  I'm a passionate developer currently pursuing my degree in BS Information Technology. I love building web applications that solve real-world problems and provide great user experiences.
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
