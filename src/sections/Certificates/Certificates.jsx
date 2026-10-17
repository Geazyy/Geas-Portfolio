import { useState, useEffect, useCallback } from 'react';
import '../../components/css/Certificates.css';
import cert1 from '../../assets/certificate/certificate1.png';
import cert2 from '../../assets/certificate/certificate2.png';
import cert3 from '../../assets/certificate/certificate3.png';
import cert4 from '../../assets/certificate/certificate4.png';
import cert5 from '../../assets/certificate/certificate5.png';
import cert6 from '../../assets/certificate/certificate6.png';
import cert7 from '../../assets/certificate/certificate7.png';
import cert8 from '../../assets/certificate/certificate8.png';
import cert9 from '../../assets/certificate/certificate9.png';
import cert10 from '../../assets/certificate/certificate10.png';

const Certificates = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const certificatesList = [
    {
      id: 1,
      title: 'Computer Hardware Basics',
      issuer: 'Cisco Networking Academy',
      image: cert1,
      description: 'In this certification I have learned how to work on hardware like identifying components, assembling PCs, and troubleshooting common hardware issues. This foundation is essential for understanding the physical layer of IT systems.',
      skills: 'PC Assembly, Hardware Troubleshooting, Device Maintenance'
    },
    {
      id: 2,
      title: 'Technical Support Fundamentals',
      issuer: 'Google Career Certificates',
      image: cert2,
      description: 'I gained a comprehensive understanding of the troubleshooting process, customer service, networking, operating systems, system administration, and security – all the essential skills for a tech support role.',
      skills: 'IT Support, Troubleshooting, Linux, Windows, Networking'
    },
    {
      id: 3,
      title: 'Foundations of Project Management',
      issuer: 'Coursera',
      image: cert3,
      description: 'Learned the foundational concepts of project management, including project phases, project manager roles, and methodologies like Agile and Waterfall to ensure successful project delivery.',
      skills: 'Project Planning, Agile Methodologies, Documentation'
    },
    {
      id: 4,
      title: 'HTML Essentials',
      issuer: 'Sololearn',
      image: cert4,
      description: 'Mastered the core building blocks of the web. This certification covered semantic HTML5, accessible markup, and the best practices for structuring content for search engines and assistive technologies.',
      skills: 'HTML5, Semantic Web, Web Accessibility'
    },
    {
      id: 5,
      title: 'Digital Awareness',
      issuer: 'Cisco Networking Academy',
      image: cert5,
      description: 'Completed Digital Awareness certification, expanding knowledge in fundamental digital skills and technologies.',
      skills: 'Digital Literacy, Tech Fundamentals'
    },
    {
      id: 6,
      title: 'Introduction to Cybersecurity',
      issuer: 'Cisco Networking Academy',
      image: cert6,
      description: 'Explored the broader landscape of cybersecurity, learning how to protect networks, devices, and data from unauthorized access.',
      skills: 'Cybersecurity Basics, Network Protection, Threat Mitigation'
    },
    {
      id: 7,
      title: 'Additional Certificate 7',
      issuer: 'Organization Name',
      image: cert7,
      description: 'Description of the knowledge and skills gained during this certification process. Please update this text.',
      skills: 'Skill 1, Skill 2, Skill 3'
    },
    {
      id: 8,
      title: 'Additional Certificate 8',
      issuer: 'Organization Name',
      image: cert8,
      description: 'Description of the knowledge and skills gained during this certification process. Please update this text.',
      skills: 'Skill 1, Skill 2, Skill 3'
    },
    {
      id: 9,
      title: 'Additional Certificate 9',
      issuer: 'Organization Name',
      image: cert9,
      description: 'Description of the knowledge and skills gained during this certification process. Please update this text.',
      skills: 'Skill 1, Skill 2, Skill 3'
    },
    {
      id: 10,
      title: 'Additional Certificate 10',
      issuer: 'Organization Name',
      image: cert10,
      description: 'Description of the knowledge and skills gained during this certification process. Please update this text.',
      skills: 'Skill 1, Skill 2, Skill 3'
    },
  ];

  const totalPages = Math.ceil(certificatesList.length / itemsPerPage);

  const closeModal = useCallback(() => setSelectedCert(null), []);

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCert]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert, closeModal]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('cert-modal-overlay')) {
      closeModal();
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentCertificates = certificatesList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section id="certificates" className="certificates-section">
      <div className="container">
        <h2 className="section-title reveal">My <span>Certificates</span></h2>
        
        <div className="certificates-carousel-container reveal">
          <button className="carousel-arrow prev" onClick={prevPage} aria-label="Previous page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className="certificates-grid">
            {currentCertificates.map((cert) => (
              <div 
                key={cert.id} 
                className="certificate-card"
                onClick={() => setSelectedCert(cert)}
              >
                <div className="certificate-image">
                  <img src={cert.image} alt={cert.title} />
                  <div className="hover-overlay">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-arrow next" onClick={nextPage} aria-label="Next page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        {totalPages > 1 && (
          <div className="carousel-dots reveal">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx} 
                className={`dot ${currentPage === idx ? 'active' : ''}`}
                onClick={() => setCurrentPage(idx)}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Section */}
      {selectedCert && (
        <div className="cert-modal-overlay" onClick={handleBackdropClick}>
          <div className="cert-modal-content reveal-modal">
            <button className="cert-modal-close" onClick={closeModal} aria-label="Close modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="cert-modal-body">
              <div className="cert-modal-image-col">
                <img src={selectedCert.image} alt={selectedCert.title} />
              </div>
              <div className="cert-modal-info-col">
                <h2 className="cert-modal-heading">{selectedCert.title}</h2>
                <p className="cert-modal-description">{selectedCert.description}</p>
                
                <div className="cert-modal-skills">
                  <strong>Skills:</strong>
                  <div className="skills-tags">
                    {selectedCert.skills.split(',').map((skill, index) => (
                      <span key={index} className="skill-tag">{skill.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certificates;
