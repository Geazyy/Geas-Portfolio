import laptopWallpaper from '../../assets/image/homeimage.jpg';

export default function LaptopFallback({ closed = false }) {
  return (
          <figure className={`hero-laptop${closed ? ' hero-laptop--closed' : ''}`} aria-label="Gaming laptop displaying Geaser's portrait">
            <div className="hero-laptop-model">
              <div className="hero-laptop-lid">
                <span className="hero-laptop-camera" aria-hidden="true" />
                <div className="hero-laptop-display">
                  <img src={laptopWallpaper.src} width={laptopWallpaper.width} height={laptopWallpaper.height}
                    alt="Geaser in graduation attire displayed on the laptop screen"
                    className="hero-laptop-wallpaper" decoding="async" fetchPriority="high" />
                </div>
              </div>
              <div className="hero-laptop-hinge" aria-hidden="true" />
              <div className="hero-laptop-deck" aria-hidden="true">
                <div className="hero-laptop-keyboard">
                  {Array.from({ length: 70 }, (_, index) => (
                    <span key={index} style={{ '--key-light': `hsl(${185 + (index % 14) * 8} 65% 60%)` }} />
                  ))}
                </div>
                <div className="hero-laptop-touchpad" />
              </div>
              <div className="hero-laptop-front" aria-hidden="true" />
            </div>
          </figure>
  );
}
