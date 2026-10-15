import { useEffect } from 'react';

const useScrollReveal = () => {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
      revealObserver.observe(reveal);
    });

    return () => {
      reveals.forEach(reveal => {
        revealObserver.disconnect();
      });
    };
  }, []);
};

export default useScrollReveal;
