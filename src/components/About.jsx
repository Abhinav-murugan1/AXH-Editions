import React, { useState } from 'react';
import { Target, Heart, Eye, ArrowUpRight } from 'lucide-react';

export default function About() {
  const [activeFocus, setActiveFocus] = useState('motorsport');

  const focuses = {
    motorsport: {
      label: 'MOTORSPORT',
      serial: 'TRACK // SF.01',
      motto: 'Deconstructing the pure physics of velocity, track layouts, and high-contrast grand prix typography.',
      stamp: 'LAT. 50.3341° N // NÜRBURGRING CAROUSEL',
      glow: 'rgba(200, 107, 58, 0.12)', // Orange glow
      color: 'var(--color-orange)'
    },
    football: {
      label: 'FOOTBALL',
      serial: 'PITCH // SF.02',
      motto: 'Exposing the structural geometry of stadium stands, pitch markers, and legendary football culture.',
      stamp: 'LAT. 45.4781° N // SAN SIRO GATE 14',
      glow: 'rgba(123, 115, 217, 0.12)', // Violet glow
      color: 'var(--color-violet)'
    },
    music: {
      label: 'MUSIC & SOUND',
      serial: 'AUDIO // SF.03',
      motto: 'Mapping acoustic frequencies, visual vinyl grids, and analog synthesizer design aesthetics.',
      stamp: 'RPM. 33.3 // TAPE DECK STUDIO',
      glow: 'rgba(226, 79, 79, 0.1)', // Red glow
      color: '#E24F4F'
    },
    gaming: {
      label: 'GAMING SYSTEMS',
      serial: 'VIRTUAL // SF.04',
      motto: 'Styling isometric game maps, glowing virtual matrices, and modern geometric UI environments.',
      stamp: 'RES. 3840×2160 // DIGITAL MATRIX',
      glow: 'rgba(123, 115, 217, 0.12)', // Violet glow
      color: 'var(--color-violet)'
    },
    cinema: {
      label: 'CINEMATIC ART',
      serial: 'MOTION // SF.05',
      motto: 'Capturing independent director layout ratios, cinematic typography layouts, and retro poster grids.',
      stamp: 'FPS. 24 // ULTRA-PANAVISION 70',
      glow: 'rgba(245, 243, 239, 0.08)', // Ivory glow
      color: 'var(--color-ivory)'
    }
  };

  const activeFocusData = focuses[activeFocus];

  return (
    <section className="about-section" id="about">
      {/* Dynamic Background Drafting Grid Backdrop */}
      <div className="about-blueprint-bg">
        <div className="bp-grid-line bp-horiz h1" />
        <div className="bp-grid-line bp-horiz h2" />
        <div className="bp-grid-line bp-horiz h3" />
        <div className="bp-grid-line bp-vert v1" />
        <div className="bp-grid-line bp-vert v2" />
        <div className="bp-grid-line bp-vert v3" />
        <div className="bp-coordinate-stamp top-right">LAT. 45.4642° N // LONG. 9.1900° E</div>
        <div className="bp-coordinate-stamp bottom-left">AXH.MANIFESTO // ED.2026</div>
      </div>

      {/* Dynamic Ambient Color Orb tied to Interactive Focus */}
      <div 
        className="about-glow-ambient-interactive"
        style={{
          background: `radial-gradient(circle, ${activeFocusData.glow} 0%, transparent 70%)`,
          boxShadow: `0 0 60px ${activeFocusData.glow}`
        }}
      />
      
      {/* 1. Dramatic Editorial Masthead Section */}
      <div className="about-editorial-masthead">
        <div className="about-masthead-meta">
          <span className="meta-bracket">[</span>
          <span className="meta-text">THE BRAND MANIFESTO // AXH EDITIONS</span>
          <span className="meta-bracket">]</span>
        </div>
        <h1 className="about-masthead-title">
          COLLECT WHAT<br />
          <span className="title-glow-accent">DEFINES</span> YOU.
        </h1>
        <div className="about-masthead-subtitle">
          <p>
            An unyielding dedication to curation, architectural symmetry, and high-contrast design culture. Crafted in Milan, delivered to exclusive galleries worldwide.
          </p>
        </div>
        <div className="masthead-horizontal-line" />
      </div>

      {/* 2. Interactive Focus Matrix & Brand Narrative Grid */}
      <div className="about-narrative-grid">
        {/* Left Column: Core Narrative */}
        <div className="about-story-col">
          <span className="story-label-mini">01 // ORIGINS</span>
          <p className="narrative-paragraph-lead">
            AXH Editions was created from a simple, unyielding idea: collectors should be able to own pieces that celebrate their deepest identities with premium presentation standards.
          </p>
          <p className="narrative-paragraph-body">
            In an era filled with mass-produced print works and disposable graphic decor, we specialize in high-end visual editions. Our collections are deeply influenced by motorsport speed, stadium architecture, cinematic grids, and minimal typographic styling.
          </p>
          <p className="narrative-paragraph-body">
            Every product is printed on heavy museum-grade archival media, hand-mounted in deep shadow wood frames, and finished with a unique catalog identification serial. Strictly boxy. Strictly zero-radius.
          </p>
        </div>

        {/* Right Column: Interactive Focus Matrix */}
        <div className="about-focus-col glass-panel">
          <div className="focus-header">
            <span className="focus-header-number">02 // FIELD MATRIX</span>
            <h3 className="focus-header-title">THE CULTURAL FOCUS</h3>
          </div>

          {/* Interactive Tag Grid */}
          <div className="focus-pill-matrix">
            {Object.keys(focuses).map((key) => {
              const item = focuses[key];
              const isActive = activeFocus === key;
              return (
                <button
                  key={key}
                  className={`focus-matrix-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveFocus(key)}
                  onMouseEnter={() => setActiveFocus(key)}
                  style={{
                    '--accent-focus': item.color
                  }}
                >
                  <span className="matrix-btn-dot" />
                  <span className="matrix-btn-text">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Detail Card */}
          <div className="focus-detail-card" style={{ '--border-accent': activeFocusData.color }}>
            <div className="detail-meta">
              <span className="detail-serial">{activeFocusData.serial}</span>
              <span className="detail-stamp">{activeFocusData.stamp}</span>
            </div>
            <p className="detail-motto">{activeFocusData.motto}</p>
            <div className="detail-bottom-indicator">
              <span className="active-glow-tag" style={{ color: activeFocusData.color }}>
                FOCUS ACTIVE
              </span>
              <ArrowUpRight size={14} className="active-arrow-indicator" style={{ color: activeFocusData.color }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Anatomy of an Edition - High-Fashion Specifications Grid */}
      <div className="anatomy-section-wrap">
        <div className="anatomy-section-header">
          <span className="anatomy-meta">03 // TECHNICAL SPECIFICATIONS</span>
          <h2 className="anatomy-title">ANATOMY OF AN EDITION</h2>
          <div className="anatomy-header-line" />
        </div>

        <div className="anatomy-specification-grid">
          <div className="anatomy-cell glass-panel">
            <div className="cell-header">
              <span className="cell-index">SPEC_01</span>
              <h4 className="cell-headline">ARCHIVAL MEDIUM</h4>
            </div>
            <p className="cell-paragraph">
              Printed on heavy museum-grade 230gsm matte archival cotton rag stock. Acid-free base guarantees zero yellowing, rich shadows, and pristine color retention over decades.
            </p>
            <div className="cell-blueprint-lines">
              <div className="bp-cell-line horiz" />
              <div className="bp-cell-dot" />
            </div>
          </div>

          <div className="anatomy-cell glass-panel">
            <div className="cell-header">
              <span className="cell-index">SPEC_02</span>
              <h4 className="cell-headline">SHADOW TIMBER</h4>
            </div>
            <p className="cell-paragraph">
              Hand-mounted in premium sustainable wood shadow frames. Features a deep internal spacer layout that offsets the print medium for a spectacular gallery look.
            </p>
            <div className="cell-blueprint-lines">
              <div className="bp-cell-line vert" />
              <div className="bp-cell-dot" />
            </div>
          </div>

          <div className="anatomy-cell glass-panel">
            <div className="cell-header">
              <span className="cell-index">SPEC_03</span>
              <h4 className="cell-headline">CATALOGUE SEAL</h4>
            </div>
            <p className="cell-paragraph">
              Every drop is finished with a physical embossed curatorial seal and individually serialized to catalog database registries, establishing collectible authenticity.
            </p>
            <div className="cell-blueprint-lines">
              <div className="bp-cell-line diag" />
              <div className="bp-cell-dot" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Staggered Architectural Columns (Pillars Overhaul) */}
      <div className="pillars-architectural-section">
        <div className="pillars-section-header">
          <span className="pillars-meta">04 // DESIGN SYSTEM</span>
          <h2 className="pillars-title">THE CURATORIAL PILLARS</h2>
        </div>

        <div className="staggered-columns-grid">
          {/* Column 1 - Emotional Connection */}
          <div className="architectural-col column-first glass-panel">
            <div className="architectural-top">
              <div className="pillar-icon-box">
                <Heart size={20} className="icon-pulse" />
              </div>
              <span className="pillar-index">P.01</span>
            </div>
            <h3 className="pillar-headline">EMOTIONAL CONNECTION</h3>
            <p className="pillar-description">
              Art should celebrate the culture you are deeply invested in. We capture motorsport speed, football pitches, and music frequencies to form immediate visceral bonds.
            </p>
            <div className="column-technical-border" />
          </div>

          {/* Column 2 - Staggered Offset - Intentional Design */}
          <div className="architectural-col column-second glass-panel">
            <div className="architectural-top">
              <div className="pillar-icon-box">
                <Target size={20} className="icon-pulse" />
              </div>
              <span className="pillar-index">P.02</span>
            </div>
            <h3 className="pillar-headline">INTENTIONAL DESIGN</h3>
            <p className="pillar-description">
              Every single canvas undergoes hundreds of design iterations. Establishing structural blueprint alignment, high-contrast layouts, and ultimate typographic balance.
            </p>
            <div className="column-technical-border" />
          </div>

          {/* Column 3 - Staggered Offset - Premium Presentation */}
          <div className="architectural-col column-third glass-panel">
            <div className="architectural-top">
              <div className="pillar-icon-box">
                <Eye size={20} className="icon-pulse" />
              </div>
              <span className="pillar-index">P.03</span>
            </div>
            <h3 className="pillar-headline">PREMIUM PRESENTATION</h3>
            <p className="pillar-description">
              From heavy cotton media stocks and deep shadow timber framings to security-vault packaging—we guarantee a spectacular visual impact upon unboxing.
            </p>
            <div className="column-technical-border" />
          </div>
        </div>
      </div>

      {/* 5. Glowing Curatorial Bottom Ticker */}
      <div className="curatorial-stat-ticker">
        <div className="ticker-alignment-line" />
        <div className="ticker-track-container">
          <div className="ticker-scroll-track">
            {['0px_SHARP_EDGES', '100%_ARCHIVAL_COTTON', '230gsm_MUSEUM_STOCK', 'VAULT_SECURED_DROPS', '0px_SHARP_EDGES', '100%_ARCHIVAL_COTTON', '230gsm_MUSEUM_STOCK', 'VAULT_SECURED_DROPS'].map((stat, idx) => (
              <div key={idx} className="ticker-stat-item">
                <span className="stat-text-neon">{stat}</span>
                <span className="stat-divider">//</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ticker-alignment-line" />
      </div>

      <style>{`
        /* ── Section Wrapper ────────────────────────── */
        .about-section {
          position: relative;
          padding: 8rem 0 10rem 0;
          overflow: hidden;
          background: var(--color-black);
        }

        /* ── Drafting Blueprint Backdrop ────────────── */
        .about-blueprint-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .bp-grid-line {
          position: absolute;
          background: rgba(245, 243, 239, 0.02);
        }

        .bp-horiz {
          left: 0; right: 0; height: 1px;
        }
        .bp-horiz.h1 { top: 20%; }
        .bp-horiz.h2 { top: 55%; }
        .bp-horiz.h3 { top: 80%; }

        .bp-vert {
          top: 0; bottom: 0; width: 1px;
        }
        .bp-vert.v1 { left: 15%; }
        .bp-vert.v2 { left: 50%; }
        .bp-vert.v3 { left: 85%; }

        .bp-coordinate-stamp {
          position: absolute;
          font-family: var(--font-sans);
          font-size: 0.55rem;
          font-weight: 500;
          color: rgba(245, 243, 239, 0.15);
          letter-spacing: 0.2em;
        }
        .bp-coordinate-stamp.top-right {
          top: 3rem; right: 3rem;
        }
        .bp-coordinate-stamp.bottom-left {
          bottom: 3rem; left: 3rem;
        }

        /* ── Dynamic Ambient Color Orb ───────────────── */
        .about-glow-ambient-interactive {
          position: absolute;
          top: 35%;
          left: 60%;
          width: 500px;
          height: 500px;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          transition: background 0.8s ease, box-shadow 0.8s ease;
          border-radius: 50%;
        }

        /* ── 1. Editorial Masthead ───────────────────── */
        .about-editorial-masthead {
          max-width: 1400px;
          margin: 0 auto 5rem auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .about-masthead-meta {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }

        .meta-bracket {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          color: var(--color-orange);
          font-weight: 600;
        }

        .meta-text {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--color-orange);
          letter-spacing: 0.3em;
        }

        .about-masthead-title {
          font-family: var(--font-display);
          font-size: 5.5rem;
          line-height: 0.9;
          letter-spacing: -0.04em;
          color: var(--color-ivory);
          font-weight: 800;
          text-transform: uppercase;
        }

        .title-glow-accent {
          color: var(--color-violet);
          text-shadow: 0 0 35px rgba(123, 115, 217, 0.3);
        }

        .about-masthead-subtitle {
          margin-top: 2rem;
          max-width: 580px;
        }

        .about-masthead-subtitle p {
          font-family: var(--font-sans);
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--color-muted);
          font-weight: 400;
        }

        .masthead-horizontal-line {
          height: 1px;
          background: linear-gradient(to right, rgba(245, 243, 239, 0.08) 0%, transparent 100%);
          margin-top: 3.5rem;
        }

        @media (max-width: 1024px) {
          .about-masthead-title {
            font-size: 4rem;
          }
        }
        @media (max-width: 640px) {
          .about-masthead-title {
            font-size: 3rem;
          }
        }

        /* ── 2. Narrative & Focus Grid ───────────────── */
        .about-narrative-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 5rem;
          max-width: 1400px;
          margin: 0 auto 7rem auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .about-story-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .story-label-mini {
          font-family: var(--font-sans);
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--color-violet);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border-left: 2px solid var(--color-violet);
          padding-left: 0.75rem;
          margin-bottom: 0.25rem;
        }

        .narrative-paragraph-lead {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          line-height: 1.65;
          color: var(--color-ivory);
          font-weight: 400;
        }

        .narrative-paragraph-body {
          font-family: var(--font-sans);
          font-size: 0.94rem;
          line-height: 1.8;
          color: var(--color-muted);
          font-weight: 400;
        }

        /* Focus Matrix Card Column */
        .about-focus-col {
          padding: 2.25rem;
          background: rgba(17, 19, 38, 0.15);
          border: 1px solid rgba(245, 243, 239, 0.04);
          border-radius: 0px !important;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .focus-header {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
          padding-bottom: 1rem;
        }

        .focus-header-number {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--color-muted);
          letter-spacing: 0.15em;
        }

        .focus-header-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-ivory);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .focus-pill-matrix {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .focus-matrix-btn {
          position: relative;
          background: rgba(245, 243, 239, 0.01);
          border: 1px solid rgba(245, 243, 239, 0.08);
          color: var(--color-muted);
          padding: 0.5rem 1rem;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 0px !important;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .matrix-btn-dot {
          width: 4px;
          height: 4px;
          background: rgba(245, 243, 239, 0.2);
          transition: all 0.3s;
        }

        .focus-matrix-btn:hover {
          border-color: var(--accent-focus);
          color: var(--color-ivory);
        }

        .focus-matrix-btn.active {
          border-color: var(--accent-focus);
          color: var(--color-ivory);
          background: rgba(245, 243, 239, 0.03);
          box-shadow: 0 0 15px rgba(245, 243, 239, 0.03);
        }

        .focus-matrix-btn.active .matrix-btn-dot {
          background: var(--accent-focus);
          box-shadow: 0 0 8px var(--accent-focus);
        }

        /* Detail display panel */
        .focus-detail-card {
          margin-top: auto;
          background: rgba(9, 8, 13, 0.4);
          border-left: 2px solid var(--border-accent);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: border-color 0.5s ease;
        }

        .detail-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-serial {
          font-family: var(--font-sans);
          font-size: 0.58rem;
          font-weight: 700;
          color: var(--color-muted);
          letter-spacing: 0.15em;
        }

        .detail-stamp {
          font-family: var(--font-sans);
          font-size: 0.54rem;
          color: rgba(245, 243, 239, 0.4);
          letter-spacing: 0.08em;
        }

        .detail-motto {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-ivory);
        }

        .detail-bottom-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(245, 243, 239, 0.03);
          padding-top: 0.75rem;
          margin-top: 0.25rem;
        }

        .active-glow-tag {
          font-family: var(--font-sans);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          transition: color 0.5s ease;
        }

        .active-arrow-indicator {
          transition: color 0.5s ease, transform 0.3s;
        }

        .focus-detail-card:hover .active-arrow-indicator {
          transform: translate(2px, -2px);
        }

        @media (max-width: 1024px) {
          .about-narrative-grid {
            grid-template-columns: 1fr;
            gap: 3.5rem;
          }
        }

        /* ── 3. Anatomy Section Redesign ──────────────── */
        .anatomy-section-wrap {
          max-width: 1400px;
          margin: 0 auto 7rem auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .anatomy-section-header {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 3.5rem;
        }

        .anatomy-meta {
          font-family: var(--font-sans);
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--color-orange);
          letter-spacing: 0.2em;
        }

        .anatomy-title {
          font-family: var(--font-display);
          font-size: 2.25rem;
          color: var(--color-ivory);
          font-weight: 800;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .anatomy-header-line {
          height: 1px;
          background: linear-gradient(to right, rgba(200, 107, 58, 0.2) 0%, transparent 100%);
          margin-top: 1rem;
        }

        .anatomy-specification-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        .anatomy-cell {
          position: relative;
          padding: 2.25rem;
          background: rgba(17, 19, 38, 0.12);
          border: 1px solid rgba(245, 243, 239, 0.04);
          border-radius: 0px !important;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          overflow: hidden;
        }

        .cell-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .cell-index {
          font-family: var(--font-sans);
          font-size: 0.58rem;
          font-weight: 700;
          color: var(--color-violet);
          letter-spacing: 0.1em;
        }

        .cell-headline {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--color-ivory);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .cell-paragraph {
          font-family: var(--font-sans);
          font-size: 0.86rem;
          line-height: 1.7;
          color: var(--color-muted);
        }

        .cell-blueprint-lines {
          position: absolute;
          bottom: 1.25rem;
          right: 1.25rem;
          width: 50px;
          height: 50px;
          pointer-events: none;
          opacity: 0.2;
          transition: opacity 0.3s;
        }

        .anatomy-cell:hover .cell-blueprint-lines {
          opacity: 0.6;
        }

        .bp-cell-line {
          position: absolute;
          background: var(--color-violet);
        }

        .bp-cell-line.horiz {
          top: 50%; left: 0; right: 0; height: 1px;
        }
        .bp-cell-line.vert {
          left: 50%; top: 0; bottom: 0; width: 1px;
        }
        .bp-cell-line.diag {
          top: 0; left: 0; width: 70px; height: 1px;
          transform: rotate(45deg);
          transform-origin: top left;
        }

        .bp-cell-dot {
          position: absolute;
          top: calc(50% - 2px);
          left: calc(50% - 2px);
          width: 4px;
          height: 4px;
          background: var(--color-violet);
          border-radius: 50%;
        }

        @media (max-width: 1024px) {
          .anatomy-specification-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        /* ── 4. Curatorial Pillars (Staggered Overhaul) ── */
        .pillars-architectural-section {
          max-width: 1400px;
          margin: 0 auto 9rem auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .pillars-section-header {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 5rem;
          align-items: center;
          text-align: center;
        }

        .pillars-meta {
          font-family: var(--font-sans);
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--color-violet);
          letter-spacing: 0.2em;
        }

        .pillars-title {
          font-family: var(--font-display);
          font-size: 2.25rem;
          color: var(--color-ivory);
          font-weight: 800;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .staggered-columns-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
          padding-bottom: 4rem; /* Buffer space for offsets */
        }

        .architectural-col {
          position: relative;
          padding: 3rem 2.25rem;
          background: rgba(17, 19, 38, 0.15);
          border: 1px solid rgba(245, 243, 239, 0.04);
          border-radius: 0px !important;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: fit-content;
        }

        /* Staggered Vertical Offsets on Desktop */
        @media (min-width: 1024px) {
          .column-second {
            transform: translateY(3rem);
          }
          .column-third {
            transform: translateY(6rem);
          }
        }

        .architectural-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pillar-icon-box {
          width: 40px;
          height: 40px;
          background: rgba(123, 115, 217, 0.05);
          border: 1px solid rgba(123, 115, 217, 0.15);
          color: var(--color-violet);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0px !important;
          transition: all 0.4s;
        }

        .architectural-col:hover .pillar-icon-box {
          background: var(--color-violet);
          color: var(--color-black);
          box-shadow: 0 0 15px rgba(123, 115, 217, 0.3);
        }

        .pillar-index {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--color-muted);
          letter-spacing: 0.1em;
        }

        .pillar-headline {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-ivory);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .pillar-description {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          line-height: 1.75;
          color: var(--color-muted);
        }

        .column-technical-border {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: transparent;
          transition: background 0.4s;
        }

        .architectural-col:hover .column-technical-border {
          background: var(--color-violet);
        }

        @media (max-width: 1024px) {
          .staggered-columns-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding-bottom: 0;
          }
          .architectural-col {
            align-items: stretch;
            text-align: left;
          }
        }

        /* ── 5. Bottom Brand Ticker ──────────────────── */
        .curatorial-stat-ticker {
          width: 100%;
          position: relative;
          z-index: 1;
          margin-top: 4rem;
        }

        .ticker-alignment-line {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(245, 243, 239, 0.06) 20%, rgba(245, 243, 239, 0.06) 80%, transparent);
        }

        .ticker-track-container {
          overflow: hidden;
          padding: 1.5rem 0;
          display: flex;
          background: rgba(9, 8, 13, 0.5);
          backdrop-filter: blur(4px);
        }

        .ticker-scroll-track {
          display: flex;
          white-space: nowrap;
          animation: infinite-ticker 30s linear infinite;
        }

        @keyframes infinite-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ticker-stat-item {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 0 1rem;
        }

        .stat-text-neon {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: rgba(245, 243, 239, 0.35);
          transition: color 0.3s;
        }

        .ticker-stat-item:hover .stat-text-neon {
          color: var(--color-orange);
          text-shadow: 0 0 10px rgba(200, 107, 58, 0.3);
        }

        .stat-divider {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: rgba(123, 115, 217, 0.2);
        }

        @media (max-width: 768px) {
          .about-section {
            padding: 4rem 0 6rem 0 !important;
          }
          .about-masthead-title {
            font-size: 2.5rem !important;
          }
          .about-story-col .narrative-paragraph-lead {
            font-size: 1.15rem !important;
          }
          .about-focus-col {
            padding: 1.25rem !important;
          }
          .anatomy-title, .pillars-title {
            font-size: 1.75rem !important;
          }
          .anatomy-cell {
            padding: 1.5rem !important;
          }
          .architectural-col {
            padding: 2rem 1.5rem !important;
          }
          .ticker-stat-item {
            gap: 1rem !important;
          }
          .stat-text-neon {
            font-size: 0.68rem !important;
            letter-spacing: 0.15em !important;
          }
        }
      `}</style>
    </section>
  );
}
