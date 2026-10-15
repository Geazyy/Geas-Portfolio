import { useEffect, useState } from 'react';
import ThemeSelector from './ThemeSelector';
import EffectsControls from './EffectsControls';

const Navbar = ({ isSidebarHidden, onToggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleToggle = () => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      setIsMobileMenuOpen((open) => !open);
    } else {
      onToggleSidebar();
    }
  };

  return (
    <>
      <nav
        className={`navbar ${isSidebarHidden ? 'sidebar-hidden' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="container nav-container">
          <div className="logo">
            <a className="logo-mark" href="#home" aria-label="Go to home" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/gadingan-logo.png" alt="Geaser Jan Gadingan circuit logo" />
            </a>
            <a
              className="logo-name"
              href="#home"
              aria-label="Geaser Jan, home"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Geaser Gadingan
            </a>
          </div>

          <div id="primary-navigation" className="nav-links">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                {link.name}
              </a>
            ))}
            <div className="nav-preferences">
              <ThemeSelector />
              <EffectsControls />
            </div>
          </div>
        </div>
      </nav>

      <button
        type="button"
        className={`sidebar-toggle ${isSidebarHidden ? 'is-hidden' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={handleToggle}
        aria-label={isMobileMenuOpen ? 'Close navigation menu' : isSidebarHidden ? 'Show navigation' : 'Hide navigation'}
        aria-expanded={isMobileViewport ? isMobileMenuOpen : !isSidebarHidden}
        aria-controls="primary-navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isMobileMenuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
