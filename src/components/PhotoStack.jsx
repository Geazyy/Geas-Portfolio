'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import photo1 from '../assets/image/image1.jpg';
import photo2 from '../assets/image/image2.jpg';
import photo3 from '../assets/image/image3.jpg';
import photo4 from '../assets/image/image4.jpg';
import photo5 from '../assets/image/image5.jpg';
import photo6 from '../assets/image/image6.jpg';
import photo7 from '../assets/image/image7.jpg';
import photo8 from '../assets/image/image8.jpg';

const photos = [
  { image: photo8, alt: 'My laptop and coding workspace' },
  { image: photo7, alt: 'Celebrating graduation with my diploma' },
  { image: photo1, alt: 'A photo with a friend at an event' },
  { image: photo2, alt: 'Spending time with a friend indoors' },
  { image: photo3, alt: 'A personal moment with someone close to me' },
  { image: photo4, alt: 'A photo with friends on campus' },
  { image: photo5, alt: 'Standing by the police help desk' },
  { image: photo6, alt: 'A photo of my motorcycle' },
];

// Advance every five seconds; the CSS controls how slowly each turn animates.
const AUTO_SLIDE_INTERVAL = 5000;

export default function PhotoStack() {
  const [step, setStep] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPaused = !autoplay || hovered || focused;

  useEffect(() => {
    if (isPaused) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = window.setInterval(() => {
      if (!reducedMotion.matches && !document.hidden) {
        setStep((index) => index + 1);
      }
    }, AUTO_SLIDE_INTERVAL);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const active = ((step % photos.length) + photos.length) % photos.length;
  const showNext = () => setStep((index) => index + 1);
  const showPrevious = () => setStep((index) => index - 1);
  const choosePhoto = (index) => {
    const distance = (index - active + photos.length) % photos.length;
    setStep((current) => current + (distance > photos.length / 2 ? distance - photos.length : distance));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      setStep((index) => index + direction);
    }
  };

  return (
    <div
      className="photo-stack"
      role="region"
      aria-roledescription="carousel"
      aria-label="Personal photo gallery"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => setFocused(event.target.matches(':focus-visible'))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <button
        type="button"
        className="photo-stack-stage"
        aria-label={`Show next photo. Currently photo ${active + 1} of ${photos.length}: ${photos[active].alt}`}
        onClick={showNext}
        onKeyDown={handleKeyDown}
      >
        <span className="photo-stack-scene">
          <span className="photo-stack-rotor">
            {photos.map((photo, index) => (
              <span
                className="photo-stack-card"
                key={photo.image.src}
                aria-hidden={index !== active}
                style={{ '--photo-ring-angle': `${(index - step) * (360 / photos.length)}deg` }}
              >
                <Image src={photo.image} alt={photo.alt} fill sizes="(max-width: 640px) 38vw, 210px" loading="eager" placeholder="blur" draggable={false} />
              </span>
            ))}
          </span>
        </span>
      </button>
      <div className="photo-stack-controls">
        <button type="button" className="photo-stack-arrow" aria-label="Previous photo" onClick={showPrevious}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <div className="photo-stack-dots" aria-label="Choose a photo">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo.image.src}
              aria-label={`Show photo ${index + 1}: ${photo.alt}`}
              aria-pressed={active === index}
              onClick={() => choosePhoto(index)}
            ><span /></button>
          ))}
        </div>
        <button type="button" className="photo-stack-arrow" aria-label="Next photo" onClick={showNext}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
        </button>
        <button
          type="button"
          className="photo-stack-arrow"
          aria-label={autoplay ? 'Pause automatic rotation' : 'Enable automatic rotation'}
          aria-pressed={!autoplay}
          onClick={() => setAutoplay((enabled) => !enabled)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {autoplay ? <path d="M6 5h4v14H6zm8 0h4v14h-4z" /> : <path d="m8 5 11 7-11 7z" />}
          </svg>
        </button>
      </div>
      <p className="photo-stack-hint">Slow automatic rotation · Hover or focus to pause</p>
      <span className="sr-only" aria-live={isPaused ? 'polite' : 'off'}>Photo {active + 1} of {photos.length}</span>
    </div>
  );
}
