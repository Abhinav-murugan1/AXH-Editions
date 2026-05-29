import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, SlidersHorizontal, ArrowUpRight, ChevronDown } from 'lucide-react';

export default function Catalog({ products, onSelectProduct }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low-high', 'price-high-low', 'alpha-a-z'
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Curated Items' },
    { id: 'posters', label: 'Premium Posters' },
    { id: 'framed', label: 'Framed Prints' },
    { id: 'stickers', label: 'Sticker Packs' },
  ];

  const filteredProducts = filterCategory === 'all' 
    ? products 
    : products.filter(p => p.category === filterCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-high') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high-low') {
      return b.price - a.price;
    }
    if (sortBy === 'alpha-a-z') {
      return a.name.localeCompare(b.name);
    }
    return 0; // Default Curation Order
  });

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  const getSortLabel = () => {
    switch(sortBy) {
      case 'price-low-high': return 'Price: Low to High';
      case 'price-high-low': return 'Price: High to Low';
      case 'alpha-a-z': return 'Alphabetical A-Z';
      default: return 'Curation Order';
    }
  };

  // Mouse spotlight glow + 3D Tilt + Parallax image shifting
  const ProductCard = ({ product }) => {
    const cardRef = useRef(null);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [imgShiftX, setImgShiftX] = useState(0);
    const [imgShiftY, setImgShiftY] = useState(0);

    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCoords({ x, y });

      // 3D Tilt calculation
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      const centerX = cardWidth / 2;
      const centerY = cardHeight / 2;
      const rX = ((y - centerY) / centerY) * -5; // Max -5deg
      const rY = ((x - centerX) / centerX) * 5;  // Max 5deg
      setRotateX(rX);
      setRotateY(rY);

      // Parallax image shift calculation
      const sX = ((x - centerX) / centerX) * -8; // Max -8px
      const sY = ((y - centerY) / centerY) * -8; // Max -8px
      setImgShiftX(sX);
      setImgShiftY(sY);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setRotateX(0);
      setRotateY(0);
      setImgShiftX(0);
      setImgShiftY(0);
    };

    const isLowStock = product.stock > 0 && product.stock <= 10;
    const isCustom = product.category === 'custom';

    return (
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="luxury-product-card"
        onClick={() => onSelectProduct(product)}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0)',
          transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s'
        }}
      >
        {/* Mouse Spotlight Glow effect inside card borders */}
        {isHovered && (
          <div
            className="card-spotlight-glow"
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
            }}
          />
        )}

        {/* Card Border Lights */}
        <div className="card-border-line top" />
        <div className="card-border-line right" />
        <div className="card-border-line bottom" />
        <div className="card-border-line left" />

        {/* Image Container */}
        <div className="luxury-media-container">
          <div 
            className="luxury-media-image"
            style={{ 
              backgroundImage: `url(${product.image})`,
              transform: isHovered
                ? `scale(1.06) translate3d(${imgShiftX}px, ${imgShiftY}px, 0)`
                : 'scale(1) translate3d(0, 0, 0)',
              transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
          
          <div className="luxury-media-overlay" />

          {/* Action indicator appearing on hover */}
          <div className="luxury-action-reveal">
            <span className="action-tag">ACQUIRE COLLECTIBLE</span>
            <div className="action-arrow-wrap">
              <ArrowUpRight size={14} className="action-arrow" />
            </div>
          </div>

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="editorial-edition-badge">
              <span>EDITION / ONE</span>
            </div>
          )}

          {/* Top Info Bar */}
          <div className="media-top-bar">
            <span className="monospace-serial">{product.serial || 'CATALOGUE / CORE'}</span>
          </div>
        </div>

        {/* Card Details */}
        <div className="luxury-card-details">
          <div className="card-details-header">
            <span className="detail-genre">{product.genre || 'COLLECTIBLE'}</span>
            {isLowStock ? (
              <div className="stock-warning">
                <span className="pulse-red-dot" />
                <span className="stock-label">ONLY {product.stock} LEFT</span>
              </div>
            ) : isCustom ? (
              <span className="spec-badge bespoke">BESPOKE</span>
            ) : (
              <span className="spec-badge">VAULTED</span>
            )}
          </div>

          <h3 className="detail-name">{product.name}</h3>

          <div className="card-details-footer">
            <span className="detail-price">
              {isCustom ? `From $${product.price}` : `$${product.price}`}
            </span>
            <span className="acquire-cta-label">
              <span>COLLECT</span>
              <ArrowUpRight size={10} className="cta-mini-arrow" />
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="luxury-catalog-section" id="gallery">
      {/* Dynamic Grid Blueprint Background Lines */}
      <div className="blueprint-grid-lines">
        <div className="grid-vert-line left" />
        <div className="grid-vert-line middle-left" />
        <div className="grid-vert-line center" />
        <div className="grid-vert-line middle-right" />
        <div className="grid-vert-line right" />
      </div>

      {/* Stunning Magazine Editorial Masthead Cover Header */}
      <div className="masthead-editorial-wrap">
        <div className="masthead-top-row">
          <div className="masthead-metadata">
            <span className="mono-tag">AXH ARCHIVES</span>
            <span className="mono-dot" />
            <span className="mono-tag">VOL.01 // ED.2026</span>
          </div>
          <div className="masthead-curator-version">
            <span className="pulse-purple-dot" />
            <span className="curator-ver-text">ED.2026-05.29 / REALTIME</span>
          </div>
        </div>

        <div className="masthead-main-layout">
          <div className="masthead-left-col">
            <h2 className="masthead-display-title">
              COLLECTIBLE <br />
              <span className="title-outline-text">EDITIONS</span>.
            </h2>
            <div className="masthead-coordinate-badge">
              <span>LAT. 45.4642° N // LONG. 9.1900° E</span>
            </div>
          </div>

          <div className="masthead-right-col">
            <div className="curator-quote-card glass-panel">
              <span className="quote-number">01 // INTRODUCTION</span>
              <p className="curator-quote-text">
                "A library of curated typographic, motorsport, and cinematic print mediums built to elevate design-forward environments. Every piece is archival and hand-assembled with strict zero-radius border layouts."
              </p>
              <div className="curator-sign">
                <span className="sign-line" />
                <span className="sign-text">AXH CURATORIAL DEPT.</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="masthead-bottom-bar" />
      </div>

      {/* Modern Filter Pill Navigation + Operational Sort Selector */}
      <div className="curation-controls-bar">
        <div className="category-pills-scroll-container">
          <div className="category-pills-container">
            {categories.map((cat) => {
              const isActive = filterCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  className={`category-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat.id)}
                >
                  <span className="pill-text">{cat.label}</span>
                  <span className="pill-count-badge">{count}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="active-pill-background"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Sorting Dropdown Selector */}
        <div className="sort-selector-outer">
          <button 
            className={`sort-trigger-btn ${sortDropdownOpen ? 'active' : ''}`}
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            <SlidersHorizontal size={12} className="sort-icon-accent" />
            <span className="sort-btn-label">SORT: {getSortLabel()}</span>
            <ChevronDown size={12} className={`sort-chevron ${sortDropdownOpen ? 'open' : ''}`} />
          </button>

          <AnimatePresence>
            {sortDropdownOpen && (
              <>
                <div className="sort-dropdown-backdrop" onClick={() => setSortDropdownOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="sort-dropdown-menu glass-panel"
                >
                  {[
                    { id: 'default', label: 'Curation Order' },
                    { id: 'price-low-high', label: 'Price: Low to High' },
                    { id: 'price-high-low', label: 'Price: High to Low' },
                    { id: 'alpha-a-z', label: 'Alphabetical A-Z' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      className={`sort-dropdown-item ${sortBy === option.id ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy(option.id);
                        setSortDropdownOpen(false);
                      }}
                    >
                      <span className="option-label">{option.label}</span>
                      {sortBy === option.id && <span className="option-active-indicator" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reduced Sized 4-Column Product Catalog Grid */}
      <div className="luxury-catalog-grid">
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        /* ── Section Wrapper ────────────────────────── */
        .luxury-catalog-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 8rem 2rem 10rem 2rem;
          position: relative;
        }

        /* ── Blueprint Lines Backdrop ────────────────── */
        .blueprint-grid-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .grid-vert-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(
            to bottom,
            rgba(245, 243, 239, 0.01) 0%,
            rgba(245, 243, 239, 0.03) 30%,
            rgba(245, 243, 239, 0.03) 70%,
            rgba(245, 243, 239, 0.01) 100%
          );
        }

        .grid-vert-line.left { left: 0%; }
        .grid-vert-line.middle-left { left: 25%; }
        .grid-vert-line.center { left: 50%; }
        .grid-vert-line.middle-right { left: 75%; }
        .grid-vert-line.right { right: 0%; }

        @media (max-width: 1024px) {
          .grid-vert-line.middle-left { left: 33.333%; }
          .grid-vert-line.center { display: none; }
          .grid-vert-line.middle-right { left: 66.666%; }
        }

        @media (max-width: 768px) {
          .grid-vert-line.middle-left { left: 50%; }
          .grid-vert-line.middle-right { display: none; }
        }

        /* ── Editorial Masthead Redesign ─────────────── */
        .masthead-editorial-wrap {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 4.5rem;
        }

        .masthead-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
          padding-bottom: 1rem;
        }

        .masthead-metadata {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mono-tag {
          font-family: var(--font-sans);
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          color: var(--color-muted);
          text-transform: uppercase;
        }

        .mono-dot {
          width: 4px;
          height: 4px;
          background: var(--color-violet);
        }

        .masthead-curator-version {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(123, 115, 217, 0.04);
          border: 1px solid rgba(123, 115, 217, 0.15);
          padding: 0.35rem 0.75rem;
        }

        .pulse-purple-dot {
          width: 5px;
          height: 5px;
          background-color: var(--color-violet);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--color-violet);
          animation: purple-pulse 2s infinite;
        }

        @keyframes purple-pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }

        .curator-ver-text {
          font-family: var(--font-sans);
          font-size: 0.58rem;
          font-weight: 700;
          color: var(--color-violet);
          letter-spacing: 0.12em;
        }

        .masthead-main-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .masthead-display-title {
          font-family: var(--font-display);
          font-size: 5rem;
          line-height: 0.85;
          letter-spacing: -0.04em;
          color: var(--color-ivory);
          font-weight: 800;
          text-transform: uppercase;
        }

        .title-outline-text {
          color: transparent;
          -webkit-text-stroke: 1px var(--color-ivory);
          opacity: 0.85;
        }

        .masthead-coordinate-badge {
          margin-top: 1.5rem;
          display: inline-block;
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: var(--color-orange);
        }

        .curator-quote-card {
          padding: 1.75rem;
          background: rgba(17, 19, 38, 0.15);
          border: 1px solid rgba(245, 243, 239, 0.04);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-radius: 0px !important;
        }

        .quote-number {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--color-violet);
        }

        .curator-quote-text {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-muted);
          font-weight: 400;
        }

        .curator-sign {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .sign-line {
          width: 20px;
          height: 1px;
          background: rgba(245, 243, 239, 0.2);
        }

        .sign-text {
          font-family: var(--font-sans);
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--color-ivory);
        }

        .masthead-bottom-bar {
          height: 1px;
          background: linear-gradient(to right, var(--color-border) 0%, rgba(245, 243, 239, 0.02) 100%);
          margin-top: 1rem;
        }

        @media (max-width: 1024px) {
          .masthead-display-title {
            font-size: 4rem;
          }
          .masthead-main-layout {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 640px) {
          .masthead-display-title {
            font-size: 2.4rem;
          }
          .masthead-top-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .luxury-catalog-section {
            padding: 4rem 1rem 6rem 1rem;
          }
          .masthead-display-title {
            font-size: clamp(1.1rem, 7.5vw, 1.6rem);
            word-break: break-word;
          }
          .curator-quote-card {
            padding: 1.2rem;
            width: 100%;
            box-sizing: border-box;
          }
          .curator-quote-text {
            font-size: 0.78rem;
            line-height: 1.5;
          }
          .quote-number {
            font-size: 0.54rem !important;
            letter-spacing: 0.12em !important;
          }
          .masthead-coordinate-badge {
            margin-top: 1rem;
            font-size: 0.55rem;
          }
          .masthead-main-layout {
            width: 100%;
            gap: 1.75rem;
          }
        }

        @media (max-width: 360px) {
          .card-details-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.4rem;
          }
        }

        /* ── Controls & Sorting System ───────────────── */
        .curation-controls-bar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(245, 243, 239, 0.05);
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
          padding: 0.75rem 0;
          margin-bottom: 3.5rem;
          gap: 2rem;
        }

        .category-pills-scroll-container {
          overflow-x: auto;
          scrollbar-width: none;
          display: flex;
          flex-grow: 1;
          width: 100%;
          max-width: 100%;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
        }

        .category-pills-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .category-pills-container {
          display: flex;
          gap: 0.5rem;
          flex-wrap: nowrap;
        }

        .category-pill-btn {
          position: relative;
          background: transparent;
          border: none;
          color: var(--color-muted);
          padding: 0.65rem 1.25rem;
          font-family: var(--font-serif);
          font-weight: 500;
          font-size: 0.8rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 0px !important;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .category-pill-btn:hover {
          color: var(--color-ivory);
        }

        .category-pill-btn.active {
          color: var(--color-black);
          font-weight: 600;
        }

        .pill-text {
          z-index: 1;
        }

        .pill-count-badge {
          font-family: var(--font-sans);
          font-size: 0.58rem;
          font-weight: 600;
          padding: 0.15rem 0.35rem;
          background: rgba(245, 243, 239, 0.08);
          border: 1px solid rgba(245, 243, 239, 0.08);
          color: var(--color-muted);
          z-index: 1;
          transition: all 0.4s;
        }

        .category-pill-btn.active .pill-count-badge {
          background: var(--color-black);
          color: var(--color-ivory);
          border-color: rgba(0, 0, 0, 0.15);
        }

        .active-pill-background {
          position: absolute;
          inset: 0;
          background: var(--color-ivory);
          border-radius: 0px !important;
          z-index: 0;
        }

        /* Sorting Dropdown Elements */
        .sort-selector-outer {
          position: relative;
        }

        .sort-trigger-btn {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(17, 19, 38, 0.3);
          border: 1px solid rgba(245, 243, 239, 0.06);
          color: var(--color-ivory);
          padding: 0.65rem 1.15rem;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 0px !important;
          text-transform: uppercase;
        }

        .sort-trigger-btn:hover, .sort-trigger-btn.active {
          border-color: var(--color-violet);
          background: rgba(123, 115, 217, 0.05);
          box-shadow: 0 0 15px rgba(123, 115, 217, 0.15);
        }

        .sort-icon-accent {
          color: var(--color-violet);
        }

        .sort-chevron {
          color: var(--color-muted);
          transition: transform 0.3s ease;
        }

        .sort-chevron.open {
          transform: rotate(180deg);
        }

        .sort-dropdown-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: transparent;
        }

        .sort-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 220px;
          background: rgba(9, 8, 13, 0.96);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(245, 243, 239, 0.08);
          z-index: 100;
          border-radius: 0px !important;
          padding: 0.35rem 0;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
        }

        .sort-dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: transparent;
          border: none;
          color: var(--color-muted);
          padding: 0.7rem 1.15rem;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .sort-dropdown-item:hover {
          color: var(--color-ivory);
          background: rgba(245, 243, 239, 0.03);
        }

        .sort-dropdown-item.active {
          color: var(--color-violet);
          background: rgba(123, 115, 217, 0.04);
        }

        .option-active-indicator {
          width: 5px;
          height: 5px;
          background: var(--color-violet);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--color-violet);
        }

        @media (max-width: 768px) {
          .curation-controls-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            padding: 0.75rem 0;
          }
          .sort-trigger-btn {
            width: 100%;
            justify-content: space-between;
          }
          .sort-dropdown-menu {
            width: 100%;
          }
        }

        /* ── Compact 4-Column Product Grid ──────────── */
        .luxury-catalog-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.25rem 1.5rem;
        }

        @media (max-width: 1024px) {
          .luxury-catalog-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem 1.25rem;
          }
        }

        @media (max-width: 768px) {
          .luxury-catalog-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.75rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .luxury-catalog-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
        }

        /* ── Optimized Reduced Sized Product Card ───── */
        .luxury-product-card {
          position: relative;
          cursor: pointer;
          background: rgba(17, 19, 38, 0.08);
          padding: 0.85rem;
          border-radius: 0px !important;
          overflow: hidden;
          backface-visibility: hidden;
        }

        /* Spotlight tracking hover glow */
        .card-spotlight-glow {
          position: absolute;
          width: 250px;
          height: 250px;
          background: radial-gradient(
            circle,
            rgba(123, 115, 217, 0.06) 0%,
            rgba(200, 107, 58, 0.02) 40%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
          transform: translate(-50%, -50%);
          transition: opacity 0.5s ease;
        }

        /* Ambient subtle border outline lines */
        .card-border-line {
          position: absolute;
          background: rgba(245, 243, 239, 0.04);
          transition: background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-border-line.top {
          top: 0; left: 0; right: 0; height: 1px;
        }
        .card-border-line.right {
          top: 0; bottom: 0; right: 0; width: 1px;
        }
        .card-border-line.bottom {
          bottom: 0; left: 0; right: 0; height: 1px;
        }
        .card-border-line.left {
          top: 0; bottom: 0; left: 0; width: 1px;
        }

        .luxury-product-card:hover {
          background: rgba(17, 19, 38, 0.16);
        }

        .luxury-product-card:hover .card-border-line {
          background-color: rgba(123, 115, 217, 0.2);
        }

        /* Media Container */
        .luxury-media-container {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #111;
          z-index: 1;
        }

        .luxury-media-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          will-change: transform;
        }

        .luxury-media-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(9, 8, 13, 0.4) 0%, transparent 40%);
          z-index: 2;
        }

        /* Top Information Bar on media */
        .media-top-bar {
          position: absolute;
          top: 0.6rem;
          left: 0.6rem;
          right: 0.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 3;
        }

        .monospace-serial {
          font-family: var(--font-sans);
          font-size: 0.52rem;
          font-weight: 600;
          color: rgba(245, 243, 239, 0.4);
          letter-spacing: 0.1em;
          background: rgba(9, 8, 13, 0.7);
          padding: 0.25rem 0.5rem;
          border: 1px solid rgba(245, 243, 239, 0.05);
        }

        .editorial-edition-badge {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          background: var(--color-orange);
          color: var(--color-black);
          font-family: var(--font-sans);
          font-size: 0.52rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.5rem;
          text-transform: uppercase;
          z-index: 3;
        }

        /* Luxury hover CTA card button */
        .luxury-action-reveal {
          position: absolute;
          inset: 0;
          background: rgba(9, 8, 13, 0.6);
          backdrop-filter: blur(3px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 4;
        }

        .luxury-product-card:hover .luxury-action-reveal {
          opacity: 1;
        }

        .action-tag {
          font-family: var(--font-serif);
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--color-ivory);
          letter-spacing: 0.12em;
          transform: translateY(8px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .action-arrow-wrap {
          width: 36px;
          height: 36px;
          border-radius: 0px !important;
          border: 1px solid rgba(245, 243, 239, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(9, 8, 13, 0.4);
          transform: scale(0.8) translateY(8px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          color: var(--color-ivory);
        }

        .luxury-product-card:hover .action-tag {
          transform: translateY(0);
        }

        .luxury-product-card:hover .action-arrow-wrap {
          transform: scale(1) translateY(0);
          border-color: var(--color-violet);
          color: var(--color-violet);
          background: rgba(123, 115, 217, 0.05);
          box-shadow: 0 0 15px rgba(123, 115, 217, 0.2);
        }

        /* Card details area */
        .luxury-card-details {
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          position: relative;
          z-index: 1;
        }

        .card-details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-genre {
          font-family: var(--font-sans);
          font-size: 0.54rem;
          font-weight: 600;
          color: var(--color-violet);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Stock micro meters */
        .stock-warning {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .pulse-red-dot {
          width: 4px;
          height: 4px;
          background-color: #E24F4F;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 6px #E24F4F;
          animation: dot-pulse 1.8s infinite;
        }

        @keyframes dot-pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }

        .stock-label {
          font-family: var(--font-sans);
          font-size: 0.52rem;
          font-weight: 700;
          color: #E24F4F;
          letter-spacing: 0.08em;
        }

        .spec-badge {
          font-family: var(--font-sans);
          font-size: 0.52rem;
          color: rgba(245, 243, 239, 0.35);
          letter-spacing: 0.05em;
        }

        .spec-badge.bespoke {
          color: var(--color-orange);
          font-weight: 600;
        }

        .detail-name {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          color: var(--color-ivory);
          font-weight: 600;
          letter-spacing: 0.01em;
          line-height: 1.3;
          margin-top: 0.1rem;
          transition: color 0.3s ease;
          text-transform: uppercase;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
        }

        .luxury-product-card:hover .detail-name {
          color: var(--color-violet);
        }

        .card-details-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.3rem;
          border-top: 1px solid rgba(245, 243, 239, 0.03);
          padding-top: 0.65rem;
        }

        .detail-price {
          font-family: var(--font-serif);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-ivory);
        }

        /* Tiny Acquire CTA text reveal */
        .acquire-cta-label {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-family: var(--font-sans);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-muted);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cta-mini-arrow {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-product-card:hover .acquire-cta-label {
          color: var(--color-violet);
          transform: translateX(-1px);
        }

        .luxury-product-card:hover .cta-mini-arrow {
          transform: translate(1px, -1px);
        }
      `}</style>
    </section>
  );
}
