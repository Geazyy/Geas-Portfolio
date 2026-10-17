import { useState, useEffect } from 'react';
import '../../components/css/PortfolioSlider.css';

// Import Technical Logos
import pythonImg from '../../assets/techskills/Python.png';
import cssImg from '../../assets/techskills/CSS3.png';
import jsImg from '../../assets/techskills/JavaScript.png';
import htmlImg from '../../assets/techskills/HTML5.png';
import reactImg from '../../assets/react.svg';
import nodeImg from '../../assets/techskills/Node.js.png';
import gitImg from '../../assets/techskills/Git.png';
import firebaseImg from '../../assets/techskills/Firebase.png';
import mongoImg from '../../assets/techskills/MongoDB.png';
import tailwindImg from '../../assets/techskills/Tailwind.png';

// Import Project Thumbnails
import ecommerceImg from '../../assets/projects/ecommerce.png';
import taskAppImg from '../../assets/projects/taskapp.png';
import aiGenImg from '../../assets/projects/aigen.png';

// Data
const technicalSkills = [
  { name: 'Python', icon: pythonImg, level: 85 },
  { name: 'CSS3', icon: cssImg, level: 90 },
  { name: 'JavaScript', icon: jsImg, level: 85 },
  { name: 'ReactJS', icon: reactImg, level: 80 },
  { name: 'HTML5', icon: htmlImg, level: 95 },
  { name: 'Node.js', icon: nodeImg, level: 75 },
  { name: 'Tailwind', icon: tailwindImg, level: 80 },
  { name: 'Git', icon: gitImg, level: 85 },
  { name: 'Firebase', icon: firebaseImg, level: 70 },
  { name: 'MongoDB', icon: mongoImg, level: 65 },
];

const softSkills = [
  { name: 'Communication', level: 90 },
  { name: 'Team Work', level: 85 },
  { name: 'Project Management', level: 80 },
  { name: 'Creativity', level: 75 },
];

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

const PortfolioSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="portfolio-slider" className="slider-section color-bg">
      <div className="container">
        <div className="slider-outer-container">
          {/* Navigation Arrows */}
          <button className="slider-arrow left-arrow" onClick={prevSlide} aria-label="Previous Slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className="slider-viewport">
            <div 
              className="slider-track" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slide 1: Technical Skills */}
              <div className="portfolio-slide" id="skills">
                <div className="slide-content">
                  <h2 className="slide-header">Technical <span>Skills</span></h2>
                  <div className="slide-card technical-dashboard">
                    <div className="tech-items-grid">
                      {technicalSkills.map((skill, idx) => (
                        <div key={idx} className="skill-item">
                          <div className="skill-info">
                            <div className="skill-icon-box">
                               <img src={skill.icon} alt={skill.name} />
                            </div>
                            <span className="skill-name">{skill.name}</span>
                          </div>
                          <div className="skill-progress-wrapper">
                            <div className="skill-bar">
                              <div className="skill-fill" style={{ width: `${skill.level}%` }}></div>
                            </div>
                            <span className="skill-percentage">{skill.level}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 2: Professional Skills */}
              <div className="portfolio-slide">
                <div className="slide-content">
                  <h2 className="slide-header">Professional <span>Skills</span></h2>
                  <div className="slide-card soft-dashboard">
                    <div className="soft-items-grid">
                      {softSkills.map((skill, idx) => (
                        <div key={idx} className="soft-skill-item">
                          <div className="progress-ring-box">
                            <svg className="ring-svg" width="80" height="80">
                              <circle cx="40" cy="40" r="35" className="ring-bg" />
                                <circle 
                                  cx="40" cy="40" r="34" 
                                  className="ring-fill" 
                                  style={{ strokeDashoffset: 213.6 - (213.6 * skill.level) / 100, strokeDasharray: 213.6 }}
                                />
                            </svg>
                            <span className="ring-text">{skill.level}%</span>
                          </div>
                          <span className="soft-skill-name">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 3: Featured Projects */}
              <div className="portfolio-slide" id="projects">
                <div className="slide-content">
                  <h2 className="slide-header">Featured <span>Projects</span></h2>
                  <div className="projects-slider-grid">
                    {projects.map((project, idx) => (
                      <div key={idx} className="project-slider-card">
                        <div className="project-img-container">
                          <img src={project.image} alt={project.title} />
                          <div className="project-hover-overlay">
                             <div className="project-links-row">
                               <a href={project.github}>GitHub</a>
                               <a href={project.demo}>Demo</a>
                             </div>
                          </div>
                        </div>
                        <div className="project-info">
                          <h3>{project.title}</h3>
                          <p>{project.description}</p>
                          <div className="tech-stack-row">
                            {project.tech.map((t, i) => (
                              <span key={i}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <button className="slider-arrow right-arrow" onClick={nextSlide} aria-label="Next Slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="slider-dots">
          {[0, 1, 2].map((idx) => (
            <button 
              key={idx} 
              className={`dot ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSlider;
