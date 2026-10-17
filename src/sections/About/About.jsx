import { useState, useEffect } from 'react';
import profileImg from '../../assets/profile.jpg';
import '../../components/css/About.css';

const About = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    if (isAboutModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
                <img src={profileImg} alt="Profile" />
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
            <button className="primary-btn read-more-btn" onClick={toggleAboutModal}>
              Read more
            </button>
          </div>
        </div>
      </div>

      {/* Detailed About Modal */}
      {isAboutModalOpen && (
        <div className="about-modal-overlay" onClick={handleBackdropClick}>
          <div className="about-modal-content reveal-modal">
            <button className="about-modal-close" onClick={toggleAboutModal} aria-label="Close modal">
              &times;
            </button>
            <div className="about-modal-body">
              <div className="about-modal-header">
                <h2>Who <span>Am I?</span></h2>
              </div>
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
