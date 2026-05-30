import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

// Custom inline SVG for premium luxury Instagram brand icon
const InstaIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Instagram() {
  const feedItems = [
    {
      id: 1,
      tag: '#motorsports',
      likes: '1.2k',
      comments: 48,
      bg: 'url("/motorsport_poster.png")',
      link: 'https://www.instagram.com/p/DYencGZTlMf/',
    },
    {
      id: 2,
      tag: '#football',
      likes: '840',
      comments: 24,
      bg: 'url("/football_poster.png")',
      link: 'https://www.instagram.com/p/DYwEe8tDD2A/?img_index=1',
    },
    {
      id: 3,
      tag: '#musicart',
      likes: '2.1k',
      comments: 89,
      bg: 'linear-gradient(135deg, #2b3568 0%, #c86b3a 100%)',
      link: 'https://www.instagram.com/axheditions/',
    },
    {
      id: 4,
      tag: '#modernspace',
      likes: '1.5k',
      comments: 62,
      bg: 'linear-gradient(135deg, #09080d 0%, #7b73d9 100%)',
      link: 'https://www.instagram.com/axheditions/',
    },
  ];

  return (
    <section className="instagram-section">
      <div className="section-header-editorial">
        <div className="accent-label">
          <InstaIcon size={14} style={{ color: 'var(--color-violet)' }} />
          <span>VISUAL COMMUNITY</span>
        </div>
        <a href="https://www.instagram.com/axheditions/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <h2 className="section-title-editorial" style={{ cursor: 'pointer' }}>@AXHEDITIONS</h2>
        </a>
        <p className="section-subtitle-editorial flashy-modern-text">
          Connect with modern design culture. Share your spaces with our collectible drops using the hashtag <span style={{ color: 'var(--color-violet)' }}>#axheditions</span>.
        </p>
      </div>

      <div className="instagram-grid">
        {feedItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="insta-card glass-panel"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="insta-card-media" style={{ background: item.bg }}>
              {/* Overlay styling for simulated Instagram feel */}
              <div className="insta-hover-overlay">
                <div className="insta-metrics">
                  <div className="metric-item">
                    <Heart size={16} fill="var(--color-ivory)" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="metric-item">
                    <MessageCircle size={16} fill="var(--color-ivory)" />
                    <span>{item.comments}</span>
                  </div>
                </div>
                <span className="insta-handle">@axheditions</span>
              </div>
              
              <div className="insta-artwork-placeholder">
                <InstaIcon size={32} className="insta-logo-watermark" />
                <span className="insta-card-tag">{item.tag}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .instagram-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem 2rem 2rem;
        }

        .instagram-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-top: 2rem;
        }

        .insta-card {
          overflow: hidden;
          cursor: pointer;
          border-radius: 0px !important;
        }

        .insta-card-media {
          position: relative;
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .insta-artwork-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: rgba(245, 243, 239, 0.4);
          z-index: 1;
          transition: var(--transition-smooth);
        }

        .insta-logo-watermark {
          stroke-width: 1;
        }

        .insta-card-tag {
          font-family: var(--font-serif);
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: rgba(245, 243, 239, 0.6);
        }

        .insta-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(9, 8, 13, 0.82);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }

        .insta-card:hover .insta-hover-overlay {
          opacity: 1;
        }

        .insta-card:hover .insta-artwork-placeholder {
          transform: scale(0.9);
          opacity: 0.2;
        }

        .insta-metrics {
          display: flex;
          gap: 1.5rem;
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-ivory);
        }

        .insta-handle {
          font-family: var(--font-serif);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--color-violet);
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .instagram-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .instagram-section {
            padding: 2.25rem 1.25rem 1.25rem 1.25rem;
          }
          .instagram-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            overscroll-behavior-x: contain;
            gap: 1rem;
            padding: 0.5rem 0.25rem;
            -ms-overflow-style: none; /* IE/Edge */
            scrollbar-width: none; /* Firefox */
          }
          .instagram-grid::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          .insta-card {
            flex: 0 0 200px;
            scroll-snap-align: start;
          }
          .insta-card-media {
            aspect-ratio: 1/1;
          }
          .insta-card-tag {
            font-size: 0.65rem !important;
          }
        }

      `}</style>
    </section>
  );
}
