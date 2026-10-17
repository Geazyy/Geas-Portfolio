import { Routes, Route } from 'react-router-dom';
import Navbar from './layouts/Navbar/Navbar';
import Home from './sections/Home/Home';
import About from './sections/About/About';
import Skills from './sections/Skills/Skills';
import Projects from './sections/Projects/Projects';
import Contact from './sections/Contact/Contact';
import Certificates from './sections/Certificates/Certificates';
import Footer from './layouts/Footer/Footer';
import ParticleBackground from './components/effects/ParticleBackground/ParticleBackground';
import ChatBot from './components/ChatBot';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import useScrollReveal from './hooks/useScrollReveal';
import './styles/index.css';

const PortfolioLayout = () => (
  <>
    <ParticleBackground />
    <Navbar />
    <main>
      <Home />
      <About />
      <Skills />
      <Projects />
      <Certificates />
      <Contact />
    </main>
    <Footer />
    <ChatBot />
  </>
);

function App() {
  useScrollReveal();

  return (
    <ThemeProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<PortfolioLayout />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
