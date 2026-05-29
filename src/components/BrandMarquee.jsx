import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function BrandMarquee() {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (svgRef.current && !isMobile) {
      const rect = svgRef.current.getBoundingClientRect();
      const cxPct = ((cursor.x - rect.left) / rect.width) * 100;
      const cyPct = ((cursor.y - rect.top) / rect.height) * 100;
      setMaskPosition({ cx: `${cxPct}%`, cy: `${cyPct}%` });
    }
  }, [cursor, isMobile]);

  return (
    <section className="brand-marquee-section">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
        style={{ display: 'block', cursor: 'crosshair', userSelect: 'none' }}
      >
        <defs>
          <linearGradient
            id="bqTextGradient"
            gradientUnits="userSpaceOnUse"
            x1="0" y1="110" x2="1000" y2="110"
          >
            {(hovered || isMobile) && (
              <>
                <stop offset="0%"   stopColor="#C86B3A" />
                <stop offset="25%"  stopColor="#7B73D9" />
                <stop offset="50%"  stopColor="#F5F3EF" />
                <stop offset="75%"  stopColor="#7B73D9" />
                <stop offset="100%" stopColor="#C86B3A" />
              </>
            )}
          </linearGradient>

          <motion.radialGradient
            id="bqRevealMask"
            gradientUnits="userSpaceOnUse"
            r={isMobile ? "100%" : "30%"}
            initial={{ cx: '50%', cy: '50%' }}
            animate={isMobile ? { cx: '50%', cy: '50%' } : maskPosition}
            transition={{ duration: 0, ease: 'easeOut' }}
          >
            <stop offset="0%"   stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </motion.radialGradient>

          <mask id="bqTextMask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#bqRevealMask)" />
          </mask>
        </defs>

        {/* Faint outline — appears on hover */}
        <text
          x="500" y="110"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.5"
          textLength="980"
          lengthAdjust="spacingAndGlyphs"
          style={{
            fill: 'transparent',
            stroke: 'rgba(245,243,239,0.08)',
            fontFamily: 'var(--font-display)',
            fontSize: '120px',
            fontWeight: 800,
            opacity: (hovered || isMobile) ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          AXH EDITIONS
        </text>

        {/* Draw-on stroke animation — plays once on mount */}
        <motion.text
          x="500" y="110"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.5"
          textLength="980"
          lengthAdjust="spacingAndGlyphs"
          style={{
            fill: 'transparent',
            stroke: 'rgba(123,115,217,0.3)',
            fontFamily: 'var(--font-display)',
            fontSize: '120px',
            fontWeight: 800,
          }}
          initial={{ strokeDashoffset: 3000, strokeDasharray: 3000 }}
          animate={{ strokeDashoffset: 0, strokeDasharray: 3000 }}
          transition={{ duration: 5, ease: 'easeInOut' }}
        >
          AXH EDITIONS
        </motion.text>

        {/* Mouse-reveal gradient text */}
        <text
          x="500" y="110"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="url(#bqTextGradient)"
          strokeWidth="0.5"
          textLength="980"
          lengthAdjust="spacingAndGlyphs"
          mask="url(#bqTextMask)"
          style={{
            fill: 'transparent',
            fontFamily: 'var(--font-display)',
            fontSize: '120px',
            fontWeight: 800,
          }}
        >
          AXH EDITIONS
        </text>
      </svg>

      <style>{`
        .brand-marquee-section {
          width: 100%;
          height: 22rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: transparent;
          padding: 0.5rem 0;
        }

        @media (max-width: 1024px) {
          .brand-marquee-section {
            height: 16rem;
            padding: 0.25rem 0;
          }
        }

        @media (max-width: 768px) {
          .brand-marquee-section {
            height: 10rem;
            padding: 0.25rem 0;
          }
        }
      `}</style>
    </section>
  );
}
