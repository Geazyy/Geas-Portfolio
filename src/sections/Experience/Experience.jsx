const experience = [
  {
    organization: 'AICA – Academic for International Community in Asia',
    location: '',
    role: 'ATLAS Pronunciation Trainer',
    type: '',
    dates: 'Oct 2026 – Present',
    technologies: ['Next.js'],
    highlights: [
      'Building ATLAS, a pronunciation training platform for Japanese students using Next.js.',
      'Developing an autonomous learning platform that supports independent pronunciation practice.',
    ],
  },
  {
    organization: 'Centre for University Research and Innovation',
    location: 'Universidad de Zamboanga',
    role: 'Full-Stack Web Developer',
    type: 'Freelance',
    dates: 'Mar 2025 – Jan 2026',
    technologies: ['React', 'Node.js', 'Supabase'],
    highlights: [
      'Developed research panel management modules with appearance tracking, reporting, and automated fee calculation.',
      'Implemented a multi-stage approval workflow for defense requests, enabling role-based review, status tracking, and approval routing across academic stakeholders.',
      'Conducted usability testing for a web-based research management system to improve research workflows for program chairs, deans, research associates, and faculty members.',
      'Designed role-based access control (RBAC), relational database schemas, Supabase Row Level Security policies, automated fee computation, and research workflow automation.',
    ],
  },
  {
    organization: 'Educational Technology',
    location: 'Universidad de Zamboanga',
    role: 'Digital Learning & Designer Intern',
    type: '',
    dates: 'Mar 2026 – Jun 2026',
    technologies: [],
    highlights: [
      'Designed digital learning materials, promotional graphics, and educational content for Wikipedia Club.',
      'Assisted with the Student Portal, including account creation, activation, password resets, and profiling.',
      'Completed hands-on training and webinars in web development, artificial intelligence, prompt engineering, networking, cybersecurity, and digital technologies.',
    ],
  },
  {
    organization: 'Client',
    location: 'Zamboanga City',
    role: 'Software Tester / QA',
    type: 'Freelance',
    dates: 'Aug 2026',
    technologies: [],
    highlights: [
      'Executed comprehensive QA test cases across core HRIS and payroll modules, covering system administration, user management, RBAC, audit logs, and security and compliance workflows.',
      'Maintained structured QA documentation and Excel test matrices to ensure complete module coverage.',
      'Found and reported application bugs with clear steps, screenshots, and details so developers could reproduce and fix them.',
    ],
  },
];

const Experience = () => (
  <div className="experience-list">
    {experience.map((item) => (
      <article className="experience-card" key={`${item.organization}-${item.role}`}>
        <div className="experience-card-header">
          <div>
            <p className="experience-organization">{item.organization}</p>
            <h4 className="experience-role">
              {item.role}
              {item.type && <span className="experience-type"> · {item.type}</span>}
            </h4>
            {item.technologies.length > 0 && (
              <ul className="experience-tech" aria-label="Technologies used">
                {item.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            )}
          </div>
          <div className="experience-meta">
            {item.location && <span>{item.location}</span>}
            <time>{item.dates}</time>
          </div>
        </div>
        <ul className="experience-highlights">
          {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
      </article>
    ))}
  </div>
);

export default Experience;
