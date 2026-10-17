import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import darkProfile from '../../assets/Darkmodeprofile.png';
import lightProfile from '../../assets/ligthmodeprofile.png';
import '../../components/css/Home.css';

const Home = () => {
  const { theme } = useTheme();
  const titles = ['Web Developer', 'Javascript Developer', 'BIST Student'];
  const [displayText, setDisplayText] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(350);

  useEffect(() => {
    const handleTyping = () => {
      const currentTitle = titles[titleIndex];
      const shouldDelete = isDeleting;

      setDisplayText(prev =>
        shouldDelete
          ? currentTitle.substring(0, prev.length - 1)
          : currentTitle.substring(0, prev.length + 1)
      );

      setTypingSpeed(shouldDelete ? 20 : 350);

      if (!shouldDelete && displayText === currentTitle) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (shouldDelete && displayText === '') {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex, titles, typingSpeed]);

  const currentImg = theme === 'dark' ? darkProfile : lightProfile;

  return (
    <section id="home" className="home-section">
      <div className="container home-container">
        <div className="home-content">
          <h3 className="home-hello reveal">Hello, it's Me</h3>
          <h1 className="home-name reveal"> Gea sir </h1>
          <h2 className="home-typing reveal">
            And I'm a <span>{displayText}</span><span className="cursor">|</span>
          </h2>
          <p className="home-subtitle reveal">
            I build modern, high-performance web applications using React, Javascript, HTML and CSS. with all information about myself hope you will like it.
          </p>

          <div className="social-links reveal">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/geaserjangadz"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/DhynzCode"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/dhynzio"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/geaser-jan-gadingan-553b84285/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>

          <div className="home-btns reveal">
            <a href="#" className="download-btn">Download CV</a>
          </div>
        </div>
        <div className="home-image reveal">
          <div className="image-wrapper">
            <img
              key={theme}
              src={currentImg}
              alt="Gea Profile"
              className="profile-img"
            />
            <div className={`image-bg ${theme === 'dark' ? 'dark-glow' : ''}`}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
