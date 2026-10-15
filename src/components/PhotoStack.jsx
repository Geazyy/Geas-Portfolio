import { useState } from 'react';
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

const positions = [
  { x: 9, y: 2, rotate: 6, scale: 1 },
  { x: -12, y: 0, rotate: -2, scale: 1 },
  { x: -34, y: 5, rotate: -7, scale: 0.96 },
  { x: 34, y: 8, rotate: 10, scale: 0.93 },
  { x: -55, y: 11, rotate: -11, scale: 0.9 },
  { x: 54, y: 13, rotate: 14, scale: 0.87 },
  { x: -69, y: 17, rotate: -14, scale: 0.83 },
  { x: 69, y: 18, rotate: 17, scale: 0.8 },
];

export default function PhotoStack() {
  const [active, setActive] = useState(0);
  const showNext = () => setActive((index) => (index + 1) % photos.length);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      setActive((index) => (index + direction + photos.length) % photos.length);
    }
  };

  return (
    <div className="photo-stack" role="group" aria-label="Personal photo gallery">
      <button
        type="button"
        className="photo-stack-stage"
        aria-label={`Show next photo. Currently photo ${active + 1} of ${photos.length}: ${photos[active].alt}`}
        onClick={showNext}
        onKeyDown={handleKeyDown}
      >
        {photos.map((photo, index) => {
          const depth = (index - active + photos.length) % photos.length;
          const position = positions[depth];
          return (
            <span
              className="photo-stack-card"
              key={photo.image.src}
              aria-hidden={depth !== 0}
              style={{
                '--stack-x': `${position.x}%`,
                '--stack-y': `${position.y}%`,
                '--stack-rotation': `${position.rotate}deg`,
                '--stack-scale': position.scale,
                zIndex: photos.length - depth,
              }}
            >
              <Image src={photo.image} alt={photo.alt} fill sizes="(max-width: 640px) 42vw, 260px" loading="eager" placeholder="blur" draggable={false} />
            </span>
          );
        })}
      </button>
      <div className="photo-stack-dots" aria-label="Choose a photo">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.image.src}
            aria-label={`Show photo ${index + 1}: ${photo.alt}`}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          ><span /></button>
        ))}
      </div>
      <p className="photo-stack-hint">Click the stack to shuffle</p>
      <span className="sr-only" aria-live="polite">Photo {active + 1} of {photos.length}</span>
    </div>
  );
}
