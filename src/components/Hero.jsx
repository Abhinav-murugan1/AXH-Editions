import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ onExploreClick, onCustomClick, heroCard = {} }) {
  const {
    image = 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096506/axh_editions_static/hamilton_poster.png',
    category = 'MOTORSPORT COLLECTIBLE',
    title = 'LEWIS HAMILTON // "STILL WE RISE"',
    subtitle = 'DROP 001 // SIGNATURE EDITION',
  } = heroCard;

  const frameRef = useRef(null);
  const rectRef = useRef(null);

  const handleMouseEnter = (e) => {
    // Cache the bounding client rect on mouse enter to avoid synchronous reflows on high-frequency mousemove events
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseMove = (e) => {
    if (!frameRef.current || !rectRef.current) return;
    const { left, top, width, height } = rectRef.current;
    const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5; // -0.5 to 0.5
    frameRef.current.style.transform = `perspective(1000px) rotateX(${y * -12}deg) rotateY(${x * 12}deg) translate3d(0, 0, 10px)`;
  };

  const handleMouseLeave = () => {
    if (frameRef.current) {
      frameRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
    }
    rectRef.current = null;
  };

  return (
    <section className="hero-container">
      <div className="hero-gradient"></div>
      
      {/* Editorial blueprint background grid */}
      <div className="hero-bg-grid"></div>

      {/* Giant high-fashion outline watermark */}
      <div className="hero-bg-watermark">AXH EDITIONS</div>

      <div className="hero-grid">
        {/* Left Column: Brand Statement */}
        <div className="hero-text-block">
          
          <h1 className="hero-title animate-slide-up">
            Collect <br />
            What You <br />
            <span className="gradient-text">Genuinely Love.</span>
          </h1>
          
          <p className="hero-subtitle flashy-modern-text animate-slide-up-delayed">
            In a world of mass-produced decor, AXH Editions crafts premium visual collectibles. 
            Inspired by motorsport, football, music, gaming, and cinematic culture—designed for spaces that tell your story.
          </p>
          
          <div className="hero-actions desktop-only-actions animate-slide-up-delayed">
            <button className="btn-primary" onClick={onExploreClick}>
              Explore Drops <ArrowRight size={16} strokeWidth={2} />
            </button>
            <button className="btn-secondary" onClick={onCustomClick}>
              Custom Request
            </button>
          </div>
        </div>

        {/* Right Column: Immersive Visual Frame Mockup */}
        <div 
          className="hero-visual-block animate-fade-in-right"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hero-floating-card-wrapper">
            <div 
              ref={frameRef}
              className="editorial-artwork-frame"
              style={{
                transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)'
              }}
            >
              {/* Container gives a shared position:relative context for image + overlay */}
              <div className="artwork-image-container">
                <div className="artwork-mockup-wrapper">
                  <div className="artwork-overlay-gradient"></div>
                  <div className="art-poster-inner" style={{ backgroundImage: `url('${image}')` }}></div>
                </div>
                {/* Overlay is outside mockup-wrapper (escapes overflow:hidden) but inside the container (anchors to image) */}
                <div className="art-title-overlay">
                  <span className="art-category">{category}</span>
                  <h4>{title}</h4>
                  <p>{subtitle}</p>
                </div>
              </div>
              <div className="frame-bottom-metadata">
                <div className="meta-item">
                  <span className="meta-label">ARTIST</span>
                  <span className="meta-val">AXH STUDIO</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">MEDIUM</span>
                  <span className="meta-val">ARCHIVAL PRINT</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">STATUS</span>
                  <span className="meta-val color-glow">READY TO DROP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Actions (Visible only on mobile resolutions, positioned under the visual mockup image) */}
        <div className="hero-actions mobile-only-actions animate-slide-up-delayed">
          <button className="btn-primary" onClick={onExploreClick}>
            Explore Drops <ArrowRight size={16} strokeWidth={2} />
          </button>
          <button className="btn-secondary" onClick={onCustomClick}>
            Custom Request
          </button>
        </div>
      </div>


      <style>{`
        .hero-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 100px; /* offset navbar */
          overflow: hidden;
          background: radial-gradient(circle at 10% 20%, rgba(17, 19, 38, 0.4) 0%, transparent 100%);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
          width: 100%;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-text-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .exclusive-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(123, 115, 217, 0.08);
          border: 1px solid rgba(123, 115, 217, 0.2);
          color: var(--color-violet);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-family: var(--font-serif);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          margin-bottom: 2rem;
        }

        .badge-glow {
          width: 6px;
          height: 6px;
          background: var(--color-violet);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--color-violet);
          animation: pulse 2s infinite;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: 4.5rem;
          line-height: 1.1;
          color: var(--color-ivory);
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--color-ivory) 30%, var(--color-violet) 70%, var(--color-orange) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--color-muted);
          margin-bottom: 6.5rem; /* Increased spacing to bring buttons lower */
          max-width: 580px;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 3.5rem;
          width: 100%;
        }

        .mobile-only-actions {
          display: none !important;
        }

        .hero-actions .btn-primary {
          background: transparent;
          border: 1px solid rgba(245, 243, 239, 0.2);
          color: var(--color-ivory);
          font-family: var(--font-display);
          font-size: 0.74rem; /* Smaller text size */
          font-weight: 600;
          letter-spacing: 0.18em;
          padding: 0.85rem 2.1rem; /* Smaller padding */
          box-shadow: none;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-actions .btn-primary:hover {
          background: var(--color-violet);
          color: var(--color-ivory);
          border-color: var(--color-violet);
          box-shadow: 0 0 30px rgba(123, 115, 217, 0.4);
          transform: translateY(-2px);
        }

        .hero-actions .btn-secondary {
          background: transparent;
          border: 1px solid rgba(245, 243, 239, 0.08);
          color: var(--color-muted);
          font-family: var(--font-display);
          font-size: 0.74rem; /* Smaller text size */
          font-weight: 600;
          letter-spacing: 0.18em;
          padding: 0.85rem 2.1rem; /* Smaller padding */
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-actions .btn-secondary:hover {
          border-color: var(--color-orange);
          color: var(--color-orange);
          background: rgba(200, 107, 58, 0.04);
          box-shadow: 0 0 30px rgba(200, 107, 58, 0.1);
          transform: translateY(-2px);
        }

        .hero-perks {
          display: flex;
          gap: 2rem;
          border-top: 1px solid rgba(245, 243, 239, 0.05);
          padding-top: 2rem;
          width: 100%;
        }

        .perk {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-muted);
          font-size: 0.85rem;
        }

        .perk-icon {
          color: var(--color-violet);
        }

        /* Right column editorial preview */
        .hero-visual-block {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-floating-card-wrapper {
          animation: continuous-float 5s infinite alternate ease-in-out;
          width: 100%;
          max-width: 440px;
          display: flex;
          justify-content: center;
          z-index: 10;
        }

        @keyframes continuous-float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }

        .editorial-artwork-frame {
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0px !important; /* Strictly sharp corners */
          padding: 1.5rem;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          position: relative;
          transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s ease, box-shadow 0.4s ease;
          transform-style: preserve-3d;
        }

        .editorial-artwork-frame:hover {
          border-color: rgba(123, 115, 217, 0.45);
          box-shadow: 
            0 0 30px rgba(123, 115, 217, 0.25),
            0 0 60px rgba(200, 107, 58, 0.15),
            0 30px 60px rgba(0, 0, 0, 0.8);
        }

        .artwork-image-container {
          position: relative;
          width: 100%;
        }

        .artwork-mockup-wrapper {
          position: relative;
          aspect-ratio: 3/4;
          width: 100%;
          border-radius: 0px !important; /* Strictly sharp corners */
          overflow: hidden;
          background: #151419;
          border: 10px solid #000; /* Framed look */
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
          transform-style: preserve-3d;
          perspective: 600px;
        }

        /* Diagonal Luxury Glass Sheen Shimmer */
        .artwork-mockup-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 80%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.08) 30%,
            rgba(255, 255, 255, 0.18) 50%,
            rgba(255, 255, 255, 0.08) 70%,
            transparent
          );
          transform: skewX(-25deg);
          z-index: 3;
          pointer-events: none;
          animation: glass-shimmer 6s infinite ease-in-out;
        }

        @keyframes glass-shimmer {
          0% { left: -150%; }
          35% { left: 150%; }
          100% { left: 150%; }
        }

        .artwork-overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(9, 8, 13, 0.95) 100%);
          z-index: 2;
        }

        .art-poster-inner {
          position: absolute;
          inset: 0;
          background-image: url('https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096506/axh_editions_static/hamilton_poster.png'); /* Set uploaded Hamilton poster */
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          padding: 2rem;
          transition: var(--transition-smooth);
        }

        .artwork-mockup-wrapper:hover .art-poster-inner {
          transform: scale(1.05);
        }

        .art-title-overlay {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          right: 2rem;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          transform: translate3d(0, 0, 0px);
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .art-category {
          font-family: var(--font-sans);
          font-size: 0.52rem;
          letter-spacing: 0.22em;
          color: var(--color-orange);
          font-weight: 700;
          text-transform: uppercase;
          transition: text-shadow 0.4s ease;
        }

        .art-title-overlay h4 {
          font-family: var(--font-serif);
          font-size: 0.92rem;
          color: var(--color-ivory);
          letter-spacing: 0.03em;
          line-height: 1.25;
          transition: text-shadow 0.4s ease, color 0.4s ease;
        }

        .art-title-overlay p {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          color: var(--color-muted);
          letter-spacing: 0.05em;
          transition: text-shadow 0.4s ease;
        }

        /* === 3D Pop-out & Glow on hover === */
        /* Trigger from either the outer frame OR directly from the image wrapper */
        .editorial-artwork-frame:hover .art-title-overlay,
        .artwork-mockup-wrapper:hover ~ .art-title-overlay {
          transform: translate3d(0, 0, 55px);
        }

        .editorial-artwork-frame:hover .art-title-overlay h4,
        .artwork-mockup-wrapper:hover ~ .art-title-overlay h4 {
          color: #fff;
          text-shadow:
            0 0 8px rgba(245, 243, 239, 0.9),
            0 0 18px rgba(123, 115, 217, 0.75),
            0 0 35px rgba(123, 115, 217, 0.45),
            0 0 60px rgba(123, 115, 217, 0.2);
        }

        .editorial-artwork-frame:hover .art-category,
        .artwork-mockup-wrapper:hover ~ .art-title-overlay .art-category {
          text-shadow:
            0 0 8px rgba(200, 107, 58, 0.95),
            0 0 20px rgba(200, 107, 58, 0.6),
            0 0 40px rgba(200, 107, 58, 0.3);
        }

        .editorial-artwork-frame:hover .art-title-overlay p,
        .artwork-mockup-wrapper:hover ~ .art-title-overlay p {
          text-shadow:
            0 0 10px rgba(150, 145, 180, 0.6),
            0 0 25px rgba(123, 115, 217, 0.3);
        }

        .frame-bottom-metadata {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1.5rem;
          border-top: 1px solid rgba(245, 243, 239, 0.05);
          padding-top: 1.25rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-label {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          color: var(--color-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .meta-val {
          font-family: var(--font-serif);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-ivory);
        }

        .color-glow {
          color: var(--color-orange);
          font-weight: 600;
        }

        /* Animations */
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(123, 115, 217, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(123, 115, 217, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(123, 115, 217, 0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards, letterReveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .animate-slide-up-delayed {
          opacity: 0;
          animation: slideUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) 0.15s forwards;
        }
        .animate-fade-in-right {
          opacity: 0;
          animation: fadeInRight 1.2s cubic-bezier(0.19, 1, 0.22, 1) 0.3s forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes letterReveal {
          from {
            letter-spacing: -0.05em;
          }
          to {
            letter-spacing: -0.03em;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 1024px) {
          .hero-title {
            font-size: 3.5rem;
          }
          .hero-grid {
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .hero-container {
            padding-top: 80px;
            min-height: auto;
          }
          .hero-grid {
            display: flex;
            flex-direction: column;
            padding: 3rem 1.25rem;
            text-align: left;
            align-items: flex-start;
          }
          .hero-text-block {
            align-items: flex-start;
            text-align: left;
          }
          .hero-title {
            font-size: 2.35rem;
            line-height: 1.15;
            margin-bottom: 1.25rem;
          }
          .hero-subtitle {
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            line-height: 1.7;
          }
          .desktop-only-actions {
            display: none !important;
          }
          .mobile-only-actions {
            display: flex !important;
            margin-top: 2rem;
            margin-bottom: 1rem;
            width: 100%;
          }
          .hero-actions button {
            width: auto !important;
            flex: 1;
            padding: 0.8rem 1rem !important;
            font-size: 0.68rem !important;
            justify-content: center;
          }
          .hero-actions .btn-primary {
            background: var(--color-violet) !important;
            color: var(--color-ivory) !important;
            border-color: var(--color-violet) !important;
            box-shadow: 0 0 25px rgba(123, 115, 217, 0.4) !important;
          }
          .hero-actions .btn-secondary {
            border-color: rgba(245, 243, 239, 0.15) !important;
            color: var(--color-ivory) !important;
            background: rgba(245, 243, 239, 0.03) !important;
            box-shadow: 0 0 15px rgba(245, 243, 239, 0.02) !important;
          }
          .hero-perks {
            justify-content: flex-start;
            flex-direction: column;
            gap: 0.85rem;
            width: 100%;
          }
          .hero-visual-block {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            margin-top: 1rem;
          }
          .hero-floating-card-wrapper {
            max-width: 100%;
          }
          .editorial-artwork-frame {
            padding: 1rem;
            max-width: 100%;
          }
          .artwork-mockup-wrapper {
            border-width: 6px;
          }
          .art-title-overlay {
            bottom: 1.25rem;
            left: 1.25rem;
            right: 1.25rem;
          }
          .art-title-overlay h4 {
            font-size: 0.82rem;
          }
          .frame-bottom-metadata {
            padding-top: 1rem;
            margin-top: 1rem;
            gap: 0.5rem;
          }
          .meta-label {
            font-size: 0.52rem;
          }
          .meta-val {
            font-size: 0.65rem;
          }
        }

        /* ── Hero Backdrop Visuals ──────────────────── */
        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(245, 243, 239, 0.008) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 243, 239, 0.008) 1px, transparent 1px);
          background-size: 100px 100px;
          z-index: 0;
          pointer-events: none;
        }

        /* Giant Brand watermark */
        .hero-bg-watermark {
          position: absolute;
          bottom: 2%;
          left: -1vw; /* Moved further left to bleed off-screen slightly */
          font-family: var(--font-display);
          font-size: 16vw;
          font-weight: 800;
          color: rgba(245, 243, 239, 0.02); /* Faint filled text (2% opacity) */
          user-select: none;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }
      `}</style>
    </section>
  );
}

