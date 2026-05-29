import React, { useState, useRef, useCallback } from 'react';
import { X, ShieldCheck, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

export default function Product({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState('A3');
  const [isFramed, setIsFramed] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const mockupRef = useRef(null);
  const artRef = useRef(null);
  const rafRef = useRef(null);

  if (!product) return null;

  // Variant calculations
  const sizeMultiplier = size === 'A3' ? 25 : size === 'A4' ? 10 : 0;
  const frameAddon = isFramed ? 30 : 0;
  const totalPrice = product.price + sizeMultiplier + frameAddon;

  // rAF-throttled zoom: reads layout once per frame, never blocks main thread
  const handleMouseMove = useCallback((e) => {
    if (!artRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current) return; // skip if a frame is already queued
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!artRef.current) return;
      const { left, top, width, height } = artRef.current.parentElement.getBoundingClientRect();
      const x = ((clientX - left) / width) * 100;
      const y = ((clientY - top) / height) * 100;
      artRef.current.style.backgroundPosition = `${x}% ${y}%`;
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!artRef.current) return;
    artRef.current.style.backgroundSize = '200%';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!artRef.current) return;
    artRef.current.style.backgroundSize = 'cover';
    artRef.current.style.backgroundPosition = 'center';
  }, []);

  // rAF-throttled 3D tilt
  const tiltRafRef = useRef(null);
  const handleMockupMouseMove = useCallback((e) => {
    if (!mockupRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (tiltRafRef.current) return;
    tiltRafRef.current = requestAnimationFrame(() => {
      tiltRafRef.current = null;
      if (!mockupRef.current) return;
      const { left, top, width, height } = mockupRef.current.parentElement.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      mockupRef.current.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.02)`;
    });
  }, []);

  const handleMockupMouseLeave = useCallback(() => {
    if (tiltRafRef.current) { cancelAnimationFrame(tiltRafRef.current); tiltRafRef.current = null; }
    if (mockupRef.current) {
      mockupRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
    handleMouseLeave();
  }, [handleMouseLeave]);

  const handleAddToBag = () => {
    setIsAdding(true);
    
    const cartItem = {
      id: `${product.id}-${size}-${isFramed ? 'framed' : 'unframed'}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      price: totalPrice,
      size,
      framed: isFramed,
      quantity: 1
    };

    setTimeout(() => {
      onAddToCart(cartItem);
      setIsAdding(false);
    }, 800);
  };

  return (
    <div className="product-modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="product-modal-wrapper glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-content-grid">
          {/* Left Column: Interactive Product Gallery & Frame Visualizer */}
          <div 
            className="gallery-column"
            onMouseMove={handleMockupMouseMove}
            onMouseLeave={handleMockupMouseLeave}
          >
            <div className="visualizer-container">
              <div 
                ref={mockupRef}
                className={`mockup-frame-base ${isFramed ? 'framed-border' : ''} size-${size.toLowerCase()}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                style={{
                  transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
                }}
              >
                <div 
                  ref={artRef}
                  className="artwork-media-element"
                  style={{ 
                    backgroundImage: `url(${product.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}
                >
                  <div className="zoom-hint-badge">
                    HOVER TO ZOOM HIGH-RES ARTWORK
                  </div>
                </div>
              </div>
              <div className="gallery-shadow-base"></div>
            </div>
            
            {/* Visual variants summary */}
            <div className="mounting-summary-bar">
              <span className="specs-indicator">
                {isFramed ? 'SOLID WOOD FRAME' : 'UNFRAMED HEAVY ARCHIVAL'} • 250GSM ARCHIVAL STOCK
              </span>
            </div>
          </div>

          {/* Right Column: Collector Purchase Specs */}
          <div className="purchase-column">
            <span className="product-badge-serial">{product.serial || 'COLLECTOR EDITION'}</span>
            <span className="product-genre-label">{product.genre}</span>
            <h2 className="product-display-name">{product.name}</h2>
            
            <p className="product-description-full">{product.description}</p>
            
            <div className="availability-alert-banner">
              <AlertCircle size={14} className="alert-icon" />
              <span>
                {product.stock < 10 ? `Extremely limited drops. Only ${product.stock} units remaining.` : 'Active catalog drop. Curated volume allocation.'}
              </span>
            </div>

            {/* Options Toggle Block */}
            <div className="purchase-options-block">
              {/* Option 1: Framing */}
              <div className="options-selector-group">
                <span className="selector-title">SELECT MOUNTING PRESENTATION</span>
                <div className="framed-variant-toggles">
                  <button 
                    className={`variant-toggle-btn ${isFramed ? 'active' : ''}`}
                    onClick={() => setIsFramed(true)}
                  >
                    <span className="variant-label-title">Framed Edition</span>
                    <span className="variant-label-addon">+$30.00</span>
                  </button>
                  <button 
                    className={`variant-toggle-btn ${!isFramed ? 'active' : ''}`}
                    onClick={() => setIsFramed(false)}
                  >
                    <span className="variant-label-title">Archival Poster Only</span>
                    <span className="variant-label-addon">+$0.00</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Sizing */}
              <div className="options-selector-group">
                <span className="selector-title">SELECT FORMAT DIMENSIONS</span>
                <div className="dimension-selector-row">
                  {[
                    { id: 'A5', desc: '148 x 210 mm', addon: 0 },
                    { id: 'A4', desc: '210 x 297 mm', addon: 10 },
                    { id: 'A3', desc: '297 x 420 mm', addon: 25 }
                  ].map((dim) => (
                    <button
                      key={dim.id}
                      className={`dim-btn-spec ${size === dim.id ? 'active' : ''}`}
                      onClick={() => setSize(dim.id)}
                    >
                      <span className="dim-name">{dim.id}</span>
                      <span className="dim-desc">{dim.desc}</span>
                      <span className="dim-addon">+{dim.addon > 0 ? `$${dim.addon}` : 'Free'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Total Pricing & Checkout Actions */}
            <div className="purchase-actions-block">
              <div className="total-pricing-display">
                <div className="price-tag-wrapper">
                  <span className="pricing-title">ESTIMATED PRICE</span>
                  <span className="price-desc">Custom options applied</span>
                </div>
                <div className="pricing-amount">${totalPrice}</div>
              </div>

              <div className="main-actions-row">
                <button 
                  className={`btn-primary add-to-cart-action ${isAdding ? 'loading' : ''}`}
                  onClick={handleAddToBag}
                  disabled={isAdding}
                >
                  <ShoppingBag size={16} />
                  <span>{isAdding ? 'SECURED IN BAG...' : 'COLLECT THIS EDITIONS'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .product-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0, 0, 0, 0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .product-modal-wrapper {
          width: 100%;
          max-width: 1100px;
          background: var(--color-black);
          border-radius: 0px;
          border: 1px solid rgba(245, 243, 239, 0.08);
          overflow: hidden;
          position: relative;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
          animation: slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .modal-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(245, 243, 239, 0.03);
          border: 1px solid rgba(245, 243, 239, 0.08);
          color: var(--color-muted);
          width: 40px;
          height: 40px;
          border-radius: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: var(--transition-fast);
        }

        .modal-close-btn:hover {
          color: var(--color-ivory);
          background: rgba(245, 243, 239, 0.08);
          transform: rotate(90deg);
        }

        .modal-content-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          height: 100%;
          min-height: 600px;
        }

        /* Left Column: Visualizer */
        .gallery-column {
          background: rgba(17, 19, 38, 0.1);
          border-right: 1px solid rgba(245, 243, 239, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          position: relative;
        }

        .visualizer-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .mockup-frame-base {
          background: #100f13;
          border-radius: 0px;
          width: 80%;
          aspect-ratio: 3/4;
          padding: 1.5rem;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s ease, box-shadow 0.4s ease;
          transform-style: preserve-3d;
        }

        .framed-border {
          border: 14px solid #000;
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.05),
            0 30px 60px rgba(0, 0, 0, 0.8);
        }

        /* Scale simulator by sizing choice */
        .size-a5 { width: 55%; }
        .size-a4 { width: 70%; }
        .size-a3 { width: 85%; }

        .artwork-media-element {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
          transition: background-size 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-position 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: zoom-in;
        }

        .zoom-hint-badge {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(9, 8, 13, 0.92);
          color: var(--color-ivory);
          border: 1px solid rgba(245, 243, 239, 0.08);
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          padding: 0.4rem 0.8rem;
          border-radius: 0px;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.25s ease;
        }

        .artwork-media-element:hover .zoom-hint-badge {
          opacity: 0;
        }


        .gallery-shadow-base {
          margin-top: 1.5rem;
          width: 70%;
          height: 10px;
          background: radial-gradient(ellipse, rgba(0, 0, 0, 0.6) 0%, transparent 80%);
          filter: blur(3px);
        }

        .mounting-summary-bar {
          margin-top: 1.5rem;
          text-align: center;
        }

        .specs-indicator {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--color-muted);
          letter-spacing: 0.15em;
        }

        /* Right Column: Pricing & Purchase */
        .purchase-column {
          padding: 3.5rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          max-height: 80vh;
        }

        .product-badge-serial {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--color-violet);
          letter-spacing: 0.25em;
          margin-bottom: 0.5rem;
        }

        .product-genre-label {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-orange);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .product-display-name {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          color: var(--color-ivory);
          letter-spacing: -0.01em;
          margin-bottom: 1.25rem;
        }

        .product-description-full {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-muted);
          margin-bottom: 2rem;
        }

        .availability-alert-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(200, 107, 58, 0.05);
          border: 1px solid rgba(200, 107, 58, 0.15);
          color: var(--color-orange);
          padding: 0.75rem 1rem;
          border-radius: 0px;
          font-family: var(--font-serif);
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 2rem;
        }

        .alert-icon {
          flex-shrink: 0;
        }

        /* Options Blocks */
        .purchase-options-block {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          border-top: 1px solid rgba(245, 243, 239, 0.05);
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
          padding: 1.75rem 0;
          margin-bottom: 2rem;
        }

        .options-selector-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .selector-title {
          font-family: var(--font-serif);
          font-size: 0.7rem;
          color: var(--color-muted);
          letter-spacing: 0.15em;
          font-weight: 600;
        }

        .framed-variant-toggles {
          display: flex;
          gap: 0.75rem;
        }

        .variant-toggle-btn {
          flex: 1;
          background: rgba(245, 243, 239, 0.02);
          border: 1px solid rgba(245, 243, 239, 0.08);
          border-radius: 0px;
          padding: 0.85rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.2rem;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .variant-toggle-btn:hover {
          border-color: rgba(123, 115, 217, 0.5);
        }

        .variant-toggle-btn.active {
          background: rgba(123, 115, 217, 0.08);
          border-color: var(--color-violet);
        }

        .variant-label-title {
          font-family: var(--font-serif);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-ivory);
        }

        .variant-toggle-btn.active .variant-label-title {
          color: var(--color-violet);
        }

        .variant-label-addon {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: var(--color-muted);
        }

        .dimension-selector-row {
          display: flex;
          gap: 0.5rem;
        }

        .dim-btn-spec {
          flex: 1;
          background: rgba(245, 243, 239, 0.02);
          border: 1px solid rgba(245, 243, 239, 0.08);
          border-radius: 0px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .dim-btn-spec:hover {
          border-color: rgba(123, 115, 217, 0.5);
        }

        .dim-btn-spec.active {
          background: rgba(123, 115, 217, 0.08);
          border-color: var(--color-violet);
        }

        .dim-name {
          font-family: var(--font-serif);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-ivory);
        }

        .dim-btn-spec.active .dim-name {
          color: var(--color-violet);
        }

        .dim-desc, .dim-addon {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          color: var(--color-muted);
        }

        /* Action block pricing */
        .purchase-actions-block {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .total-pricing-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(245, 243, 239, 0.02);
          border: 1px solid rgba(245, 243, 239, 0.08);
          padding: 1.25rem 1.75rem;
          border-radius: 0px;
        }

        .price-tag-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .pricing-title {
          font-family: var(--font-serif);
          font-size: 0.7rem;
          color: var(--color-muted);
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .price-desc {
          font-size: 0.7rem;
          color: var(--color-muted);
        }

        .pricing-amount {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-ivory);
        }

        .add-to-cart-action {
          width: 100%;
          justify-content: center;
          padding: 1.1rem;
          border-radius: 0px;
        }

        .guarantees-editorial-grid {
          display: flex;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-muted);
          font-size: 0.75rem;
        }

        /* Modals slide in */
        @keyframes slideUpModal {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 1024px) {
          .modal-content-grid {
            grid-template-columns: 1fr;
          }
          .gallery-column {
            border-right: none;
            border-bottom: 1px solid rgba(245, 243, 239, 0.05);
            padding: 2.5rem;
          }
          .purchase-column {
            padding: 2.5rem;
            max-height: none;
          }
          .product-modal-wrapper {
            max-height: 90vh;
            overflow-y: auto;
          }
        }

        @media (max-width: 768px) {
          .product-modal-backdrop {
            padding: 0;
          }
          .product-modal-wrapper {
            border-radius: 0;
            height: 100vh;
            max-height: 100vh;
            overflow-y: auto;
          }
          .framed-variant-toggles {
            display: flex;
            gap: 0.5rem;
          }
          .dimension-selector-row {
            display: flex;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .gallery-column {
            padding: 1rem 1rem !important;
          }
          .purchase-column {
            padding: 1.25rem 1rem !important;
          }
          .mockup-frame-base {
            width: 50% !important;
          }
          .gallery-shadow-base {
            margin-top: 0.5rem;
            width: 40%;
          }
          .mounting-summary-bar {
            margin-top: 0.5rem;
          }
          .product-display-name {
            font-size: 1.5rem !important;
            margin-bottom: 0.75rem !important;
          }
          .product-description-full {
            font-size: 0.82rem !important;
            line-height: 1.5 !important;
            margin-bottom: 1rem !important;
          }
          .availability-alert-banner {
            padding: 0.5rem 0.75rem !important;
            font-size: 0.72rem !important;
            margin-bottom: 1rem !important;
          }
          .purchase-options-block {
            gap: 1rem !important;
            padding: 1rem 0 !important;
            margin-bottom: 1rem !important;
          }
          .framed-variant-toggles {
            flex-direction: row !important;
            gap: 0.5rem;
          }
          .variant-toggle-btn {
            padding: 0.5rem 0.75rem !important;
            align-items: center !important;
            text-align: center !important;
            flex: 1;
          }
          .variant-label-title {
            font-size: 0.75rem !important;
          }
          .variant-label-addon {
            font-size: 0.65rem !important;
          }
          .dimension-selector-row {
            flex-direction: row !important;
            gap: 0.4rem;
          }
          .dim-btn-spec {
            padding: 0.5rem 0.25rem !important;
            flex: 1;
          }
          .dim-name {
            font-size: 0.75rem !important;
          }
          .dim-desc {
            font-size: 0.55rem !important;
          }
          .dim-addon {
            font-size: 0.55rem !important;
          }
          .total-pricing-display {
            padding: 0.85rem 1rem !important;
          }
          .pricing-amount {
            font-size: 1.6rem !important;
          }
          .add-to-cart-action {
            padding: 0.95rem !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
}
