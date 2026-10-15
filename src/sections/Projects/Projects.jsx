import ecommerceImg from '../../assets/projects/ecommerce.png';
import taskAppImg from '../../assets/projects/taskapp.png';
import aiGenImg from '../../assets/projects/aigen.png';
import { assetSrc } from '../../lib/assetSrc';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card reveal">
      <div className="project-image">
        <img src={assetSrc(project.image)} alt={project.title} />
        <div className="project-overlay">
          <div className="project-links">
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-icon-link">
              GitHub
            </a>
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-icon-link">
              Live Demo
            </a>
          </div>
        </div>
      </div>
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <div className="project-tech">
          {project.tech.map((t, idx) => (
            <span key={idx} className="tech-badge">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
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

  return (
    <section id="projects" className="section color-bg-alt">
      <div className="container">
        <h2 className="section-title reveal">Featured <span>Projects</span></h2>
        <div className="projects-grid">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
export { ProjectCard };
