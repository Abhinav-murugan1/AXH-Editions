import React, { useState, useEffect, useRef } from 'react';
import { Clock, Flame, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Drops({ products, onSelectProduct }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 9,
  });

  const scrollContainerRef = useRef(null);

  // Dynamic countdown timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter only the limited drop products
  const dropProducts = products.filter((p) => p.isDrop);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="drops-section" id="drops">
      <div className="section-header-editorial">
        <div className="accent-label">
          <Flame size={14} style={{ color: 'var(--color-orange)' }} />
          <span>ACTIVE COUTURE DROPS</span>
        </div>
        <h2 className="section-title-editorial">DROP 001: SPEED & SILHOUETTES</h2>
        <p className="section-subtitle-editorial flashy-modern-text">
          Intentionally crafted, highly limited visual drops inspired by retro-motorsport and classic engineering. Once sold out, these physical prints will not return.
        </p>
      </div>

      {/* Countdown Clock Banner */}
      <div className="countdown-banner-container glass-panel">
        <div className="countdown-info">
          <span className="info-title">CLOSEOUT COOLDOWN</span>
          <p className="info-desc">Vaulting active drops forever in:</p>
        </div>
        
        <div className="countdown-clock">
          <div className="clock-segment">
            <span className="segment-number">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="segment-label">DAYS</span>
          </div>
          <span className="clock-divider">:</span>
          <div className="clock-segment">
            <span className="segment-number">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="segment-label">HRS</span>
          </div>
          <span className="clock-divider">:</span>
          <div className="clock-segment">
            <span className="segment-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="segment-label">MINS</span>
          </div>
          <span className="clock-divider">:</span>
          <div className="clock-segment">
            <span className="segment-number-glow">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="segment-label">SECS</span>
          </div>
        </div>
      </div>

      {/* Sideways scrolling carousel track */}
      <div className="carousel-wrapper-outer">
        {/* Navigation Arrows - Hidden by default, visible on hover */}
        <button 
          className="carousel-arrow-btn prev-btn" 
          onClick={() => handleScroll('left')}
          aria-label="Scroll drops left"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="drops-carousel-track" ref={scrollContainerRef}>
          {dropProducts.map((product) => (
            <div 
              key={product.id} 
              className="carousel-item reduced-prod-card glass-panel"
              onClick={() => onSelectProduct(product)}
            >
              <div className="reduced-card-media">
                <div 
                  className="reduced-card-image"
                  style={{ backgroundImage: `url(${product.image})` }}
                ></div>
                <div className="drop-card-badge" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(9, 8, 13, 0.85)', border: '1px solid rgba(200, 107, 58, 0.3)', color: 'var(--color-orange)', fontSize: '0.6rem', padding: '0.2rem 0.5rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.05em', zIndex: 2 }}>
                  {product.stock < 10 ? `ONLY ${product.stock} LEFT` : 'DROP'}
                </div>
              </div>
              
              <div className="reduced-card-details">
                <span className="reduced-genre">{product.genre}</span>
                <h4 className="reduced-name">{product.name}</h4>
                <div className="reduced-footer">
                  <span className="reduced-price">${product.price}</span>
                  <span className="reduced-link-btn">COLLECT NOW →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="carousel-arrow-btn next-btn" 
          onClick={() => handleScroll('right')}
          aria-label="Scroll drops right"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <style>{`
        .drops-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 6rem 2rem;
          position: relative;
        }

        .section-header-editorial {
          text-align: center;
          margin-bottom: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .accent-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-orange);
          font-family: var(--font-serif);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .section-title-editorial {
          font-family: var(--font-display);
          font-size: 2.5rem;
          color: var(--color-ivory);
          letter-spacing: -0.01em;
          margin-bottom: 1rem;
        }

        .section-subtitle-editorial {
          max-width: 700px;
          font-size: 1rem;
          color: var(--color-muted);
          line-height: 1.8;
        }

        /* Countdown Banner */
        .countdown-banner-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 3rem;
          margin-bottom: 4rem;
          background: rgba(200, 107, 58, 0.03);
          border: 1px solid rgba(200, 107, 58, 0.15);
        }

        .countdown-banner-container:hover {
          border-color: rgba(200, 107, 58, 0.3);
        }

        .countdown-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-title {
          font-family: var(--font-serif);
          font-size: 0.75rem;
          color: var(--color-orange);
          font-weight: 600;
          letter-spacing: 0.2em;
        }

        .info-desc {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-ivory);
        }

        .countdown-clock {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .clock-segment {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
        }

        .segment-number, .segment-number-glow {
          font-family: var(--font-display);
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--color-ivory);
          line-height: 1;
        }

        .segment-number-glow {
          color: var(--color-orange);
          text-shadow: 0 0 10px rgba(200, 107, 58, 0.5);
        }

        .segment-label {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          color: var(--color-muted);
          margin-top: 0.5rem;
          letter-spacing: 0.1em;
        }

        .clock-divider {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          color: rgba(245, 243, 239, 0.2);
          padding-bottom: 1.2rem;
        }

        /* Carousel Layout */
        .carousel-wrapper-outer {
          position: relative;
          width: 100%;
          margin-top: 2rem;
        }

        .drops-carousel-track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          overscroll-behavior-x: contain;
          gap: 2rem;
          padding: 1.5rem 0.25rem;
          -ms-overflow-style: none; /* IE/Edge */
          scrollbar-width: none; /* Firefox */
        }

        .drops-carousel-track::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .carousel-item {
          flex: 0 0 220px;
          scroll-snap-align: start;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
        }

        .carousel-item:hover {
          transform: translateY(-6px);
          border-color: var(--color-border-hover);
        }

        .reduced-card-media {
          position: relative;
          aspect-ratio: 3/4; /* Match Core Selection card shape perfectly */
          overflow: hidden;
          background: #111;
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
        }

        .reduced-card-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: var(--transition-smooth);
        }

        .carousel-item:hover .reduced-card-image {
          transform: scale(1.03);
        }

        .reduced-card-details {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .reduced-genre {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 600;
          color: var(--color-violet);
          letter-spacing: 0.15em;
        }

        .reduced-name {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: var(--color-ivory);
          letter-spacing: 0.02em;
        }

        .reduced-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.25rem;
          border-top: 1px solid rgba(245, 243, 239, 0.03);
          padding-top: 0.6rem;
        }

        .reduced-price {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-ivory);
        }

        .reduced-link-btn {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--color-orange);
          letter-spacing: 0.05em;
        }

        /* Carousel Navigation Buttons Overlay - Redesigned to Vertical Edge Blurs */
        .carousel-arrow-btn {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 70px;
          background: linear-gradient(to right, rgba(9, 8, 13, 0.98) 0%, rgba(9, 8, 13, 0.5) 40%, transparent 100%);
          border: none;
          color: var(--color-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s, background 0.4s;
        }

        .carousel-arrow-btn:hover {
          color: var(--color-violet);
          background: linear-gradient(to right, rgba(123, 115, 217, 0.2) 0%, rgba(123, 115, 217, 0.05) 50%, transparent 100%) !important;
          text-shadow: 0 0 10px rgba(123, 115, 217, 0.8);
        }

        .carousel-arrow-btn.prev-btn {
          left: 0;
        }

        .carousel-arrow-btn.next-btn {
          right: 0;
          background: linear-gradient(to left, rgba(9, 8, 13, 0.98) 0%, rgba(9, 8, 13, 0.5) 40%, transparent 100%);
        }

        .carousel-arrow-btn.next-btn:hover {
          background: linear-gradient(to left, rgba(123, 115, 217, 0.2) 0%, rgba(123, 115, 217, 0.05) 50%, transparent 100%) !important;
        }

        /* Make arrows visible on hover of the outermost wrapper container */
        .carousel-wrapper-outer:hover .carousel-arrow-btn {
          opacity: 1;
          pointer-events: all;
        }

        @media (max-width: 1024px) {
          .carousel-item {
            flex: 0 0 190px;
          }
          .carousel-arrow-btn {
            display: none; /* Rely entirely on direct swiping touch controls on smaller devices */
          }
          .carousel-wrapper-outer {
            margin-top: 1rem;
          }
        }

        @media (max-width: 640px) {
          .carousel-item {
            flex: 0 0 160px;
          }
          .drops-carousel-track {
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .drops-section {
            padding: 2.25rem 1.25rem 1.75rem 1.25rem;
          }
          .section-header-editorial {
            margin-bottom: 2rem;
          }
          .countdown-banner-container {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
            padding: 1.75rem 1rem;
            margin-bottom: 2.25rem;
          }
          .countdown-clock {
            gap: 0.75rem;
            width: 100%;
            justify-content: center;
          }
          .clock-segment {
            min-width: 48px;
          }
          .segment-number, .segment-number-glow {
            font-size: 1.65rem;
          }
          .clock-divider {
            font-size: 1.4rem;
            padding-bottom: 0.75rem;
          }
          .segment-label {
            font-size: 0.5rem;
            margin-top: 0.25rem;
          }
          .info-desc {
            font-size: 1.1rem;
          }
        }

      `}</style>
    </section>
  );
}
