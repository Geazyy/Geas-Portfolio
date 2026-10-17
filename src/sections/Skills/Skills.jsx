import { useState } from 'react';
import '../../components/css/Skills.css';

// Frontend Logos
import htmlImg from '../../assets/techskills/HTML5.png';
import cssImg from '../../assets/techskills/CSS3.png';
import jsImg from '../../assets/techskills/JavaScript.png';
import tsImg from '../../assets/techskills/TypeScript.png';
import reactImg from '../../assets/react.svg';
import nextImg from '../../assets/techskills/NextJS.png';
import tailwindImg from '../../assets/techskills/Tailwind.png';
import viteImg from '../../assets/techskills/Vite.png';

// Backend Logos
import nodeImg from '../../assets/techskills/NodeJS.png';
import expressImg from '../../assets/techskills/Express.png';
import phpImg from '../../assets/techskills/PHP.png';
import laravelImg from '../../assets/techskills/Laravel.png';
import mysqlImg from '../../assets/techskills/MySQL.png';
import mongoImg from '../../assets/techskills/MongoDB.png';
import firebaseImg from '../../assets/techskills/Firebase.png';
import pythonImg from '../../assets/techskills/Python.png';
import csharpImg from '../../assets/techskills/CSharp.png';
import cppImg from '../../assets/techskills/CPlusPlus.png';
import dartImg from '../../assets/techskills/Dart.png';

// Tool Logos
import gitImg from '../../assets/techskills/Git.png';
import githubImg from '../../assets/techskills/GitHub.png';
import vscodeImg from '../../assets/techskills/VSCode.png';
import composerImg from '../../assets/techskills/Composer.png';

const technicalSkills = [
  // Frontend first
  { name: 'HTML5', icon: htmlImg, level: 95, cat: 'frontend' },
  { name: 'CSS3', icon: cssImg, level: 90, cat: 'frontend' },
  { name: 'JavaScript', icon: jsImg, level: 85, cat: 'frontend' },
  { name: 'TypeScript', icon: tsImg, level: 80, cat: 'frontend' },
  { name: 'ReactJS', icon: reactImg, level: 85, cat: 'frontend' },
  { name: 'Next.js', icon: nextImg, level: 75, cat: 'frontend' },
  { name: 'Tailwind CSS', icon: tailwindImg, level: 85, cat: 'frontend' },
  { name: 'Vite', icon: viteImg, level: 80, cat: 'frontend' },
  
  // Backend tech
  { name: 'Node.js', icon: nodeImg, level: 80, cat: 'backend' },
  { name: 'Express', icon: expressImg, level: 75, cat: 'backend' },
  { name: 'PHP', icon: phpImg, level: 70, cat: 'backend' },
  { name: 'Laravel', icon: laravelImg, level: 65, cat: 'backend' },
  { name: 'MySQL', icon: mysqlImg, level: 80, cat: 'backend' },
  { name: 'MongoDB', icon: mongoImg, level: 75, cat: 'backend' },
  { name: 'Firebase', icon: firebaseImg, level: 75, cat: 'backend' },
  { name: 'Python', icon: pythonImg, level: 85, cat: 'backend' },
  { name: 'C#', icon: csharpImg, level: 60, cat: 'backend' },
  { name: 'C++', icon: cppImg, level: 65, cat: 'backend' },
  { name: 'Dart', icon: dartImg, level: 55, cat: 'backend' },

  // Tools
  { name: 'Git', icon: gitImg, level: 90, cat: 'tool' },
  { name: 'GitHub', icon: githubImg, level: 85, cat: 'tool' },
  { name: 'VS Code', icon: vscodeImg, level: 95, cat: 'tool' },
  { name: 'Composer', icon: composerImg, level: 70, cat: 'tool' },
];

const softSkills = [
  { name: 'Communication', level: 90 },
  { name: 'Team Work', level: 85 },
  { name: 'Project Management', level: 80 },
  { name: 'Creativity', level: 75 },
  { name: 'Problem Solving', level: 85 },
  { name: 'Adaptability', level: 80 },
];

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const SkillCard = ({ skill, type }) => {
  const [isHovered, setIsHovered] = useState(false);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <div 
      className={`skill-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {type === 'tech' ? (
        <div className="tech-card-inner">
          <div className="skill-icon-wrapper">
            <img src={skill.icon} alt={skill.name} className="skill-icon-img" />
          </div>
          <div className="skill-info">
            <span className="skill-name">{skill.name}</span>
            <div className={`skill-reveal-area ${isHovered ? 'visible' : ''}`}>
               <div className="skill-progress-bar">
                  <div className="skill-progress-fill" style={{ width: `${skill.level}%` }}></div>
               </div>
               <span className="skill-percent">{skill.level}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="soft-card-inner">
          <div className="soft-ring-wrapper">
            <svg width="60" height="60">
              <circle cx="30" cy="30" r={radius} fill="none" className="progress-ring-track" strokeWidth="4" />
              <circle 
                cx="30" cy="30" r={radius} fill="none" stroke="var(--accent-primary)" 
                strokeWidth="4" strokeDasharray={circumference} 
                strokeDashoffset={circumference - (skill.level / 100) * circumference}
                strokeLinecap="round"
              />
            </svg>
            <span className="ring-percent">{skill.level}%</span>
          </div>
          <span className="skill-name">{skill.name}</span>
        </div>
      )}
    </div>
  );
};

const Skills = () => {
  const [techIndex, setTechIndex] = useState(0);
  const [softIndex, setSoftIndex] = useState(0);

  // Group tech skills by 12 per slide for denser display now that bars are hidden
  const techChunks = chunkArray(technicalSkills, 12);
  const softChunks = chunkArray(softSkills, 3);

  const handleNextTech = () => setTechIndex((prev) => (prev + 1) % techChunks.length);
  const handlePrevTech = () => setTechIndex((prev) => (prev - 1 + techChunks.length) % techChunks.length);

  const handleNextSoft = () => setSoftIndex((prev) => (prev + 1) % softChunks.length);
  const handlePrevSoft = () => setSoftIndex((prev) => (prev - 1 + softChunks.length) % softChunks.length);

  return (
    <section id="skills" className="section color-bg">
      <div className="container">
        <h2 className="section-title reveal">My <span>Skills</span></h2>
        
        <div className="skills-sliders-container">
          {/* Technical Skills Slider */}
          <div className="skills-slider-box">
             <h3 className="slider-header">Technical <span>Skills</span> (Frontend • Backend • Tools)</h3>
             <div className="slider-viewport">
                 <button className="slider-arrow prev" onClick={handlePrevTech} aria-label="Previous">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                 </button>
                 <div className="slider-track-container" style={{ overflow: 'hidden', width: '100%', padding: '1rem 0' }}>
                    <div className="slider-track" style={{ transform: `translateX(-${techIndex * 100}%)` }}>
                       {techChunks.map((chunk, idx) => (
                          <div key={idx} className="skill-group-slide">
                             <div className="tech-grid compact">
                                {chunk.map((skill, i) => (
                                   <SkillCard key={i} skill={skill} type="tech" />
                                ))}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
                 <button className="slider-arrow next" onClick={handleNextTech} aria-label="Next">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                 </button>
             </div>
          </div>

          {/* Soft Skills Slider */}
          <div className="skills-slider-box">
             <h3 className="slider-header">Professional <span>Skills</span></h3>
             <div className="slider-viewport">
                 <button className="slider-arrow prev" onClick={handlePrevSoft} aria-label="Previous">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                 </button>
                 <div className="slider-track-container" style={{ overflow: 'hidden', width: '100%', padding: '1rem 0' }}>
                    <div className="slider-track" style={{ transform: `translateX(-${softIndex * 100}%)` }}>
                       {softChunks.map((chunk, idx) => (
                          <div key={idx} className="skill-group-slide">
                             <div className="soft-grid">
                                {chunk.map((skill, i) => (
                                   <SkillCard key={i} skill={skill} type="soft" />
                                ))}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
                 <button className="slider-arrow next" onClick={handleNextSoft} aria-label="Next">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                 </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
