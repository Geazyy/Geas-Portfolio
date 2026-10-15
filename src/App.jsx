'use client';

import { useState } from 'react';
import Navbar from './layouts/Navbar/Navbar';
import Home from './sections/Home/Home';
import About from './sections/About/About';
import Experience from './sections/Experience/Experience';
import Skills from './sections/Skills/Skills';
import Projects from './sections/Projects/Projects';
import Contact from './sections/Contact/Contact';
import Certificates from './sections/Certificates/Certificates';
import Footer from './layouts/Footer/Footer';
import ParticleBackground from './components/effects/ParticleBackground/ParticleBackground';
import ChatBot from './components/ChatBot';
import useScrollReveal from './hooks/useScrollReveal';

const PortfolioLayout = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  useScrollReveal();

  return (
    <>
      <ParticleBackground />
      <Navbar
        isSidebarHidden={isSidebarHidden}
        onToggleSidebar={() => setIsSidebarHidden((hidden) => !hidden)}
      />
      <div className={`portfolio-content ${isSidebarHidden ? 'sidebar-collapsed' : ''}`}>
        <main>
          <Home />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Certificates />
          <Contact />
        </main>
        <Footer />
      </div>
      <ChatBot />
    </>
  );
};

export default PortfolioLayout;
