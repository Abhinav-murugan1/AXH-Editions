import React, { useState, useEffect } from 'react';
import { Paintbrush, ArrowRight, Upload, X, MessageCircle, CheckCircle, Zap, Layers, Type, Palette, Maximize2, Frame, FileText } from 'lucide-react';

export default function Custom({ onAddCustomToCart }) {
  const [step, setStep]           = useState(1);
  const [size, setSize]           = useState('A3');
  const [isFramed, setIsFramed]   = useState(true);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [imageSrc, setImageSrc]   = useState(null);
  const [imageName, setImageName] = useState('');
  const [overlayText, setOverlayText]   = useState('YOUR TEXT HERE');
  const [overlayFont, setOverlayFont]   = useState('syne');
  const [overlayColor, setOverlayColor] = useState('#F5F3EF');
  const [overlayColorName, setOverlayColorName] = useState('ivory');
  const [activeGlow, setActiveGlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setActiveGlow(true), 600);
    return () => clearTimeout(t);
  }, []);

  const basePrice      = 45;
  const sizeMultiplier = size === 'A3' ? 25 : size === 'A4' ? 10 : 0;
  const frameAddon     = isFramed ? 30 : 0;
  const totalPrice     = basePrice + sizeMultiplier + frameAddon;

  const templates = [
    { emoji: '🏁', label: 'F1 APEX',     text: 'A high-contrast monochrome vector silhouette of a classic 1970s Formula 1 race car sweeping through a high-speed apex, designed with clean architectural coordinate lines.' },
    { emoji: '⚽', label: 'PITCH GRID',  text: 'A minimal, geometric outline blueprint of an iconic European football stadium under a deep amber lighting glow, featuring subtle grid lines and typography.' },
    { emoji: '📻', label: 'RETRO VINYL', text: 'A typographic retro collage showcasing a classic cassette deck and a vinyl record, styled with bold Syne display titles and limited-edition drop labels.' },
    { emoji: '🎬', label: 'CINEMA LOOK', text: 'An abstract, minimalist cinematic print styled like an independent film poster, utilizing soft ivory backing layers and structured display font headers.' },
  ];

  const fonts = [
    { id: 'syne',  label: 'SYNE',   family: 'var(--font-display)' },
    { id: 'serif', label: 'OUTFIT', family: 'var(--font-serif)'   },
    { id: 'clean', label: 'INTER',  family: 'var(--font-sans)'    },
    { id: 'mono',  label: 'MONO',   family: 'monospace'           },
  ];

  const colors = [
    { id: 'ivory',  hex: '#F5F3EF', name: 'Ivory'  },
    { id: 'black',  hex: '#09080D', name: 'Obsidian'},
    { id: 'orange', hex: '#C86B3A', name: 'Ember'  },
    { id: 'violet', hex: '#7B73D9', name: 'Violet' },
    { id: 'green',  hex: '#39FF14', name: 'Neon'   },
  ];

  const steps = [
    { num: 1, icon: <Upload size={14} />,    label: 'ARTWORK'    },
    { num: 2, icon: <Type size={14} />,      label: 'TYPOGRAPHY' },
    { num: 3, icon: <Maximize2 size={14} />, label: 'FORMAT'     },
    { num: 4, icon: <FileText size={14} />,  label: 'VISION'     },
  ];

  const getFontFamily = (id) => {
    const f = fonts.find(f => f.id === id);
    return f ? f.family : 'var(--font-display)';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageName(file.name.toUpperCase());
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = {
      id: `custom-${Date.now()}`,
      name: `${size} Custom Print ${isFramed ? '(Framed)' : ''}`,
      category: 'custom',
      price: totalPrice,
      size,
      framed: isFramed,
      details: `IMAGE: ${imageName || 'None'}, TEXT: ${overlayText}, FONT: ${overlayFont.toUpperCase()}, COLOR: ${overlayColorName.toUpperCase()}, DESC: ${description}`,
      image: imageSrc || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    };
    onAddCustomToCart(item);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      setImageSrc(null);
      setImageName('');
      setOverlayText('YOUR TEXT HERE');
      setStep(1);
    }, 4500);
  };

  return (
    <section className="cs-root" id="custom">

      {/* ── Ambient background glows ── */}
      <div className={`cs-glow cs-glow-1 ${activeGlow ? 'cs-glow-active' : ''}`} />
      <div className={`cs-glow cs-glow-2 ${activeGlow ? 'cs-glow-active' : ''}`} />

      {/* ── Page header ── */}
      <div className="cs-hero">
        <div className="cs-hero-eyebrow">
          <Paintbrush size={11} />
          <span>BESPOKE COMMISSION STUDIO</span>
        </div>
        <h2 className="cs-hero-title">CUSTOM ARTWORK</h2>
        <p className="cs-hero-sub">
          Design your museum-grade collectible — upload, configure typography, choose format and describe your vision. We handle the rest.
        </p>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="cs-body">

        {/* LEFT — Live Preview Canvas */}
        <div className="cs-preview-col">
          <div className="cs-preview-shell">

            {/* Terminal-style header */}
            <div className="cs-terminal-bar">
              <span className="cs-led" />
              <span className="cs-led cs-led-amber" />
              <span className="cs-led cs-led-green" />
              <span className="cs-terminal-label">AXH STUDIO · LIVE PREVIEW</span>
              <span className="cs-terminal-badge">{size} · {isFramed ? 'FRAMED' : 'ROLL'}</span>
            </div>

            {/* Preview canvas */}
            <div className="cs-canvas-wrap">
              <div className={`cs-canvas-frame ${isFramed ? 'is-framed' : ''} cs-size-${size.toLowerCase()}`}>
                <div className="cs-canvas-inner">
                  {imageSrc ? (
                    <>
                      <img src={imageSrc} alt="Preview" className="cs-preview-img" />
                      <div className="cs-preview-vignette" />
                    </>
                  ) : (
                    <div className="cs-empty-state">
                      <div className="cs-crosshair">
                        <span /><span /><span /><span />
                      </div>
                      <Upload size={28} className="cs-upload-icon" />
                      <p className="cs-empty-label">UPLOAD BASE ARTWORK</p>
                      <p className="cs-empty-hint">PNG · JPG · WEBP</p>
                    </div>
                  )}

                  {/* Text overlay */}
                  {overlayText && (
                    <div
                      className="cs-text-overlay"
                      style={{ fontFamily: getFontFamily(overlayFont), color: overlayColor }}
                    >
                      {overlayText}
                    </div>
                  )}

                  {/* Metadata strip */}
                  <div className="cs-meta-strip">
                    <span className="cs-meta-badge">AXH · HIGH-FIDELITY PRINT</span>
                    <span className="cs-meta-spec">{size} · {isFramed ? 'SOLID WOOD GALLERY MOUNT' : 'HEAVYWEIGHT MATTE ROLL'}</span>
                  </div>
                </div>
              </div>
              <div className="cs-canvas-shadow" />
            </div>

            {/* Price badge */}
            <div className="cs-price-badge">
              <span className="cs-price-label">LIVE ESTIMATE</span>
              <span className="cs-price-value">₹{totalPrice}.00</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Form Panel */}
        <div className="cs-form-col">
          {submitted ? (
            <div className="cs-success">
              <div className="cs-success-ring">
                <CheckCircle size={36} />
              </div>
              <h3 className="cs-success-title">Commission Registered</h3>
              <p className="cs-success-body">
                Your custom configuration has been added to your bag. Design parameters will be finalised via email post-checkout.
              </p>
              <div className="cs-success-ref">REF #AXH-{Math.floor(1000 + Math.random() * 9000)}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="cs-form">

              {/* Step progress bar */}
              <div className="cs-stepper">
                {steps.map((s) => (
                  <button
                    key={s.num}
                    type="button"
                    className={`cs-step ${step === s.num ? 'is-active' : ''} ${step > s.num ? 'is-done' : ''}`}
                    onClick={() => setStep(s.num)}
                  >
                    <span className="cs-step-icon">{step > s.num ? <CheckCircle size={12} /> : s.icon}</span>
                    <span className="cs-step-label">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* ── STEP 1 · Artwork Upload ── */}
              {step === 1 && (
                <div className="cs-panel cs-panel-animate">
                  <div className="cs-panel-header">
                    <span className="cs-step-num">01</span>
                    <div>
                      <h3 className="cs-panel-title">BASE ARTWORK</h3>
                      <p className="cs-panel-desc">Upload the graphic you'd like as the foundation of your print.</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    id="cs-file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />

                  {!imageSrc ? (
                    <label htmlFor="cs-file" className="cs-drop-zone">
                      <div className="cs-drop-icon-wrap">
                        <Upload size={22} />
                      </div>
                      <span className="cs-drop-primary">Click to upload</span>
                      <span className="cs-drop-secondary">PNG, JPG, WEBP — max 20MB</span>
                    </label>
                  ) : (
                    <div className="cs-file-card">
                      <div className="cs-file-thumb">
                        <img src={imageSrc} alt="thumb" />
                      </div>
                      <div className="cs-file-info">
                        <span className="cs-file-name">{imageName}</span>
                        <span className="cs-file-status">Ready for print</span>
                      </div>
                      <button type="button" className="cs-file-remove" onClick={() => { setImageSrc(null); setImageName(''); }}>
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <button type="button" className="cs-next-btn" onClick={() => setStep(2)}>
                    CONTINUE <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* ── STEP 2 · Typography ── */}
              {step === 2 && (
                <div className="cs-panel cs-panel-animate">
                  <div className="cs-panel-header">
                    <span className="cs-step-num">02</span>
                    <div>
                      <h3 className="cs-panel-title">TYPOGRAPHY</h3>
                      <p className="cs-panel-desc">Set your title overlay text, font and colour palette.</p>
                    </div>
                  </div>

                  <div className="cs-field">
                    <label className="cs-label">OVERLAY TEXT</label>
                    <input
                      type="text"
                      className="cs-input"
                      placeholder="Enter title text…"
                      value={overlayText}
                      onChange={(e) => setOverlayText(e.target.value)}
                      maxLength={40}
                    />
                  </div>

                  <div className="cs-field">
                    <label className="cs-label">FONT FAMILY</label>
                    <div className="cs-font-grid">
                      {fonts.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className={`cs-font-btn ${overlayFont === f.id ? 'is-active' : ''}`}
                          style={{ fontFamily: f.family }}
                          onClick={() => setOverlayFont(f.id)}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="cs-field">
                    <label className="cs-label">TEXT COLOUR</label>
                    <div className="cs-color-row">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className={`cs-color-dot ${overlayColorName === c.id ? 'is-active' : ''}`}
                          style={{ background: c.hex }}
                          title={c.name}
                          onClick={() => { setOverlayColor(c.hex); setOverlayColorName(c.id); }}
                        />
                      ))}
                      <span className="cs-color-name">{colors.find(c => c.id === overlayColorName)?.name}</span>
                    </div>
                  </div>

                  <div className="cs-step-nav">
                    <button type="button" className="cs-back-btn" onClick={() => setStep(1)}>← BACK</button>
                    <button type="button" className="cs-next-btn" onClick={() => setStep(3)}>CONTINUE <ArrowRight size={14} /></button>
                  </div>
                </div>
              )}

              {/* ── STEP 3 · Format ── */}
              {step === 3 && (
                <div className="cs-panel cs-panel-animate">
                  <div className="cs-panel-header">
                    <span className="cs-step-num">03</span>
                    <div>
                      <h3 className="cs-panel-title">FORMAT</h3>
                      <p className="cs-panel-desc">Choose your print dimensions and mounting preference.</p>
                    </div>
                  </div>

                  <div className="cs-field">
                    <label className="cs-label">PRINT SIZE</label>
                    <div className="cs-size-grid">
                      {[
                        { sz: 'A5', dim: '148 × 210mm', delta: '—'    },
                        { sz: 'A4', dim: '210 × 297mm', delta: '+₹10' },
                        { sz: 'A3', dim: '297 × 420mm', delta: '+₹25' },
                      ].map(({ sz, dim, delta }) => (
                        <button
                          key={sz}
                          type="button"
                          className={`cs-size-card ${size === sz ? 'is-active' : ''}`}
                          onClick={() => setSize(sz)}
                        >
                          <span className="cs-size-code">{sz}</span>
                          <span className="cs-size-dim">{dim}</span>
                          <span className="cs-size-delta">{delta}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="cs-field">
                    <label className="cs-label">MOUNTING</label>
                    <div className="cs-mount-grid">
                      <button
                        type="button"
                        className={`cs-mount-card ${isFramed ? 'is-active' : ''}`}
                        onClick={() => setIsFramed(true)}
                      >
                        <Frame size={18} className="cs-mount-icon" />
                        <span className="cs-mount-name">FRAMED</span>
                        <span className="cs-mount-desc">Solid wood gallery mount +₹30</span>
                      </button>
                      <button
                        type="button"
                        className={`cs-mount-card ${!isFramed ? 'is-active' : ''}`}
                        onClick={() => setIsFramed(false)}
                      >
                        <Layers size={18} className="cs-mount-icon" />
                        <span className="cs-mount-name">UNFRAMED</span>
                        <span className="cs-mount-desc">Heavyweight matte roll</span>
                      </button>
                    </div>
                  </div>

                  <div className="cs-step-nav">
                    <button type="button" className="cs-back-btn" onClick={() => setStep(2)}>← BACK</button>
                    <button type="button" className="cs-next-btn" onClick={() => setStep(4)}>CONTINUE <ArrowRight size={14} /></button>
                  </div>
                </div>
              )}

              {/* ── STEP 4 · Vision + Submit ── */}
              {step === 4 && (
                <div className="cs-panel cs-panel-animate">
                  <div className="cs-panel-header">
                    <span className="cs-step-num">04</span>
                    <div>
                      <h3 className="cs-panel-title">YOUR VISION</h3>
                      <p className="cs-panel-desc">Describe your ideal artwork — style, mood, references.</p>
                    </div>
                  </div>

                  {/* Prompt templates */}
                  <div className="cs-field">
                    <label className="cs-label">QUICK TEMPLATES</label>
                    <div className="cs-templates">
                      {templates.map((t, i) => (
                        <button
                          key={i}
                          type="button"
                          className="cs-template-pill"
                          onClick={() => setDescription(t.text)}
                        >
                          <span>{t.emoji}</span>
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="cs-field">
                    <label className="cs-label">DESCRIBE YOUR CONCEPT</label>
                    <textarea
                      className="cs-textarea"
                      placeholder="Describe your design — style, tone, colour palette, references, borders…"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Invoice summary */}
                  <div className="cs-invoice">
                    <div className="cs-invoice-row">
                      <span>Base design fee</span>
                      <span>₹45.00</span>
                    </div>
                    <div className="cs-invoice-row">
                      <span>Size upgrade [{size}]</span>
                      <span>{sizeMultiplier > 0 ? `+₹${sizeMultiplier}.00` : '—'}</span>
                    </div>
                    <div className="cs-invoice-row">
                      <span>Gallery mount [{isFramed ? 'Framed' : 'Unframed'}]</span>
                      <span>{frameAddon > 0 ? `+₹${frameAddon}.00` : '—'}</span>
                    </div>
                    <div className="cs-invoice-divider" />
                    <div className="cs-invoice-total">
                      <span>TOTAL ESTIMATE</span>
                      <span className="cs-invoice-amount">₹{totalPrice}.00</span>
                    </div>
                  </div>

                  <div className="cs-step-nav">
                    <button type="button" className="cs-back-btn" onClick={() => setStep(3)}>← BACK</button>
                    <button type="submit" className="cs-submit-btn">
                      <Zap size={14} />
                      BOOK COMMISSION
                    </button>
                  </div>

                  <a
                    href="https://wa.me/447700900077?text=Hi%20AXH%20Editions!%20I'd%20like%20to%20discuss%20a%20custom%20artwork."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cs-whatsapp"
                  >
                    <MessageCircle size={12} />
                    <span>Have a complex vision? Chat with our concierge on WhatsApp</span>
                  </a>
                </div>
              )}

            </form>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      <style>{`

        /* ══ ROOT ══════════════════════════════════════════════════════════ */
        .cs-root {
          position: relative;
          max-width: 1180px;
          margin: 0 auto;
          padding: 4.5rem 2rem 4rem;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* ══ AMBIENT GLOWS ═════════════════════════════════════════════════ */
        .cs-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .cs-glow-active { opacity: 1; }
        .cs-glow-1 {
          width: 500px; height: 500px;
          top: -80px; left: -120px;
          background: radial-gradient(circle, rgba(123,115,217,0.10) 0%, transparent 70%);
          filter: blur(50px);
          animation: csFloat1 18s ease-in-out infinite alternate;
        }
        .cs-glow-2 {
          width: 400px; height: 400px;
          bottom: 0; right: -80px;
          background: radial-gradient(circle, rgba(200,107,58,0.08) 0%, transparent 70%);
          filter: blur(50px);
          animation: csFloat2 22s ease-in-out infinite alternate;
        }
        @keyframes csFloat1 {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(60px,-40px) scale(1.15); }
        }
        @keyframes csFloat2 {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(-50px,40px) scale(1.12); }
        }

        /* ══ HERO HEADER ═══════════════════════════════════════════════════ */
        .cs-hero {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
          z-index: 1;
        }
        .cs-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid rgba(123,115,217,0.25);
          background: rgba(123,115,217,0.05);
          color: var(--color-violet);
          font-family: var(--font-display);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          padding: 0.35rem 0.9rem;
          margin-bottom: 1.25rem;
        }
        .cs-hero-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-ivory);
          line-height: 1.05;
          margin-bottom: 1rem;
        }
        .cs-hero-sub {
          max-width: 540px;
          margin: 0 auto;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          color: var(--color-muted);
          line-height: 1.7;
          font-weight: 300;
        }

        /* ══ BODY LAYOUT ════════════════════════════════════════════════════ */
        .cs-body {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 2.5rem;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }

        /* ══ PREVIEW COLUMN ════════════════════════════════════════════════ */
        .cs-preview-col {
          position: sticky;
          top: 110px;
        }
        .cs-preview-shell {
          background: rgba(9,8,13,0.6);
          border: 1px solid rgba(245,243,239,0.06);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        /* Terminal bar */
        .cs-terminal-bar {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(245,243,239,0.05);
        }
        .cs-led {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(245,243,239,0.15);
          flex-shrink: 0;
        }
        .cs-led-amber { background: #f59e0b; box-shadow: 0 0 5px #f59e0b66; }
        .cs-led-green {
          background: #39ff14;
          box-shadow: 0 0 5px #39ff1466;
          animation: ledBlink 2s ease-in-out infinite;
        }
        @keyframes ledBlink {
          0%,100% { opacity:.5; }
          50%      { opacity:1; }
        }
        .cs-terminal-label {
          flex: 1;
          font-family: monospace;
          font-size: 0.5rem;
          letter-spacing: 0.12em;
          color: rgba(245,243,239,0.35);
          margin-left: 0.25rem;
        }
        .cs-terminal-badge {
          font-family: monospace;
          font-size: 0.48rem;
          letter-spacing: 0.08em;
          color: var(--color-violet);
          border: 1px solid rgba(123,115,217,0.2);
          padding: 0.15rem 0.45rem;
        }

        /* Canvas frame */
        .cs-canvas-wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cs-canvas-frame {
          width: 72%;
          aspect-ratio: 3/4;
          background: #0e0d12;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          position: relative;
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease;
        }
        .cs-canvas-frame.is-framed {
          border: 10px solid #1a1820;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 25px 60px rgba(0,0,0,0.7);
        }
        .cs-size-a5 { width: 46% !important; }
        .cs-size-a4 { width: 59% !important; }
        .cs-size-a3 { width: 72% !important; }

        .cs-canvas-inner {
          width: 100%; height: 100%;
          border: 1px dashed rgba(245,243,239,0.08);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(43,53,104,0.2) 0%, rgba(123,115,217,0.03) 50%, rgba(200,107,58,0.04) 100%);
        }

        /* Empty state */
        .cs-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: rgba(245,243,239,0.3);
          padding: 1.5rem;
          text-align: center;
          height: 100%;
          width: 100%;
          position: relative;
        }
        .cs-crosshair {
          position: absolute;
          inset: 12px;
          pointer-events: none;
        }
        .cs-crosshair span {
          position: absolute;
          background: rgba(245,243,239,0.04);
        }
        .cs-crosshair span:nth-child(1) { top:0; left:0; width:20px; height:1px; }
        .cs-crosshair span:nth-child(2) { top:0; left:0; width:1px; height:20px; }
        .cs-crosshair span:nth-child(3) { bottom:0; right:0; width:20px; height:1px; }
        .cs-crosshair span:nth-child(4) { bottom:0; right:0; width:1px; height:20px; }

        .cs-upload-icon { color: rgba(123,115,217,0.5); margin-bottom: 0.4rem; }
        .cs-empty-label {
          font-family: var(--font-display);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(245,243,239,0.5);
        }
        .cs-empty-hint {
          font-family: monospace;
          font-size: 0.5rem;
          letter-spacing: 0.08em;
          color: rgba(245,243,239,0.25);
        }

        /* Image preview */
        .cs-preview-img {
          width: 100%; height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
        }
        .cs-preview-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(9,8,13,0.8) 100%);
          z-index: 1;
        }

        /* Text overlay */
        .cs-text-overlay {
          position: absolute;
          left: 50%;
          bottom: 22%;
          transform: translateX(-50%);
          width: 88%;
          text-align: center;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          z-index: 10;
          pointer-events: none;
          text-shadow: 0 2px 12px rgba(0,0,0,0.9);
          word-break: break-word;
          transition: color 0.3s ease, font-family 0.3s ease;
        }

        /* Meta strip */
        .cs-meta-strip {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 20;
          background: rgba(9,8,13,0.8);
          border-top: 1px solid rgba(245,243,239,0.05);
          padding: 0.4rem 0.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          text-align: center;
        }
        .cs-meta-badge {
          font-family: monospace;
          font-size: 0.42rem;
          letter-spacing: 0.14em;
          color: rgba(245,243,239,0.3);
          text-transform: uppercase;
        }
        .cs-meta-spec {
          font-family: var(--font-sans);
          font-size: 0.44rem;
          letter-spacing: 0.08em;
          color: var(--color-violet);
          text-transform: uppercase;
        }

        /* Canvas shadow */
        .cs-canvas-shadow {
          width: 60%;
          height: 12px;
          margin-top: 0.5rem;
          background: radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 80%);
          filter: blur(4px);
        }

        /* Price badge */
        .cs-price-badge {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(123,115,217,0.06);
          border: 1px solid rgba(123,115,217,0.12);
          padding: 0.65rem 1rem;
        }
        .cs-price-label {
          font-family: monospace;
          font-size: 0.52rem;
          letter-spacing: 0.14em;
          color: rgba(245,243,239,0.4);
        }
        .cs-price-value {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-orange);
          letter-spacing: -0.01em;
        }

        /* ══ FORM COLUMN ═══════════════════════════════════════════════════ */
        .cs-form-col {
          min-width: 0;
        }
        .cs-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ══ STEPPER ════════════════════════════════════════════════════════ */
        .cs-stepper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.35rem;
        }
        .cs-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          padding: 0.6rem 0.25rem;
          background: rgba(245,243,239,0.02);
          border: 1px solid rgba(245,243,239,0.06);
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
        }
        .cs-step:hover {
          border-color: rgba(245,243,239,0.15);
        }
        .cs-step.is-active {
          border-color: var(--color-violet);
          background: rgba(123,115,217,0.06);
        }
        .cs-step.is-done {
          border-color: rgba(57,255,20,0.25);
          background: rgba(57,255,20,0.03);
        }
        .cs-step-icon {
          color: var(--color-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cs-step.is-active .cs-step-icon { color: var(--color-violet); }
        .cs-step.is-done   .cs-step-icon { color: #39ff14; }
        .cs-step-label {
          font-family: var(--font-display);
          font-size: 0.48rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(245,243,239,0.35);
        }
        .cs-step.is-active .cs-step-label { color: var(--color-violet); }
        .cs-step.is-done   .cs-step-label { color: #39ff14; }

        /* ══ PANEL ══════════════════════════════════════════════════════════ */
        .cs-panel {
          background: rgba(17,19,38,0.3);
          border: 1px solid rgba(245,243,239,0.06);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .cs-panel-animate {
          animation: panelIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes panelIn {
          from { opacity:0; transform: translateY(12px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .cs-panel-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .cs-step-num {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          color: rgba(123,115,217,0.15);
          line-height: 1;
          flex-shrink: 0;
          letter-spacing: -0.04em;
        }
        .cs-panel-title {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--color-ivory);
          margin-bottom: 0.2rem;
        }
        .cs-panel-desc {
          font-family: var(--font-sans);
          font-size: 0.76rem;
          color: var(--color-muted);
          font-weight: 300;
          line-height: 1.5;
        }

        /* ══ FORM ELEMENTS ══════════════════════════════════════════════════ */
        .cs-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .cs-label {
          font-family: var(--font-display);
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: rgba(245,243,239,0.45);
        }
        .cs-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(9,8,13,0.6);
          border: 1px solid rgba(245,243,239,0.08);
          color: var(--color-ivory);
          padding: 0.75rem 1rem;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          transition: border-color 0.2s;
        }
        .cs-input:focus { border-color: var(--color-violet); }
        .cs-input::placeholder { color: rgba(245,243,239,0.2); }

        .cs-textarea {
          width: 100%;
          box-sizing: border-box;
          background: rgba(9,8,13,0.6);
          border: 1px solid rgba(245,243,239,0.08);
          color: var(--color-ivory);
          padding: 0.85rem 1rem;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 300;
          min-height: 110px;
          resize: vertical;
          line-height: 1.6;
          transition: border-color 0.2s;
        }
        .cs-textarea:focus { border-color: var(--color-violet); }
        .cs-textarea::placeholder { color: rgba(245,243,239,0.2); }

        /* Drop zone */
        .cs-drop-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          border: 2px dashed rgba(245,243,239,0.1);
          padding: 2.5rem 1.5rem;
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
          text-align: center;
        }
        .cs-drop-zone:hover {
          border-color: rgba(123,115,217,0.4);
          background: rgba(123,115,217,0.03);
        }
        .cs-drop-icon-wrap {
          width: 48px; height: 48px;
          border: 1px solid rgba(123,115,217,0.25);
          background: rgba(123,115,217,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-violet);
          margin-bottom: 0.25rem;
        }
        .cs-drop-primary {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--color-ivory);
        }
        .cs-drop-secondary {
          font-family: monospace;
          font-size: 0.55rem;
          letter-spacing: 0.06em;
          color: var(--color-muted);
        }

        /* File card */
        .cs-file-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(9,8,13,0.5);
          border: 1px solid rgba(57,255,20,0.15);
          padding: 0.75rem;
        }
        .cs-file-thumb {
          width: 48px; height: 48px;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid rgba(245,243,239,0.06);
        }
        .cs-file-thumb img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .cs-file-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .cs-file-name {
          font-family: monospace;
          font-size: 0.6rem;
          letter-spacing: 0.06em;
          color: var(--color-ivory);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cs-file-status {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          color: #39ff14;
          letter-spacing: 0.04em;
        }
        .cs-file-remove {
          background: transparent;
          border: 1px solid rgba(245,243,239,0.08);
          color: rgba(245,243,239,0.35);
          width: 32px; height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.2s, color 0.2s;
        }
        .cs-file-remove:hover {
          border-color: #c86b3a;
          color: #c86b3a;
        }

        /* Font grid */
        .cs-font-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.4rem;
        }
        .cs-font-btn {
          background: rgba(245,243,239,0.01);
          border: 1px solid rgba(245,243,239,0.07);
          color: rgba(245,243,239,0.45);
          padding: 0.55rem 0.25rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .cs-font-btn:hover {
          border-color: rgba(245,243,239,0.2);
          color: var(--color-ivory);
        }
        .cs-font-btn.is-active {
          border-color: var(--color-violet);
          color: var(--color-violet);
          background: rgba(123,115,217,0.05);
        }

        /* Color row */
        .cs-color-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .cs-color-dot {
          width: 22px; height: 22px;
          border-radius: 50% !important;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          flex-shrink: 0;
        }
        .cs-color-dot:hover { transform: scale(1.15); }
        .cs-color-dot.is-active {
          border-color: rgba(245,243,239,0.7);
          box-shadow: 0 0 0 2px rgba(123,115,217,0.4);
          transform: scale(1.1);
        }
        .cs-color-name {
          font-family: var(--font-sans);
          font-size: 0.62rem;
          color: var(--color-muted);
          letter-spacing: 0.04em;
          margin-left: 0.2rem;
        }

        /* Size cards */
        .cs-size-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .cs-size-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          padding: 0.85rem 0.5rem;
          background: rgba(245,243,239,0.01);
          border: 1px solid rgba(245,243,239,0.07);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .cs-size-card:hover {
          border-color: rgba(245,243,239,0.2);
          background: rgba(245,243,239,0.02);
        }
        .cs-size-card.is-active {
          border-color: var(--color-violet);
          background: rgba(123,115,217,0.05);
        }
        .cs-size-code {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--color-ivory);
        }
        .cs-size-card.is-active .cs-size-code { color: var(--color-violet); }
        .cs-size-dim {
          font-family: monospace;
          font-size: 0.48rem;
          letter-spacing: 0.04em;
          color: rgba(245,243,239,0.3);
        }
        .cs-size-delta {
          font-family: var(--font-sans);
          font-size: 0.58rem;
          color: var(--color-orange);
          font-weight: 500;
        }

        /* Mount cards */
        .cs-mount-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .cs-mount-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          padding: 1.1rem 0.75rem;
          background: rgba(245,243,239,0.01);
          border: 1px solid rgba(245,243,239,0.07);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          text-align: center;
        }
        .cs-mount-card:hover {
          border-color: rgba(245,243,239,0.2);
        }
        .cs-mount-card.is-active {
          border-color: var(--color-violet);
          background: rgba(123,115,217,0.05);
        }
        .cs-mount-icon {
          color: rgba(245,243,239,0.3);
          margin-bottom: 0.2rem;
        }
        .cs-mount-card.is-active .cs-mount-icon { color: var(--color-violet); }
        .cs-mount-name {
          font-family: var(--font-display);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--color-ivory);
        }
        .cs-mount-desc {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          color: rgba(245,243,239,0.35);
          line-height: 1.4;
        }

        /* Templates */
        .cs-templates {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .cs-template-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(245,243,239,0.02);
          border: 1px solid rgba(245,243,239,0.07);
          color: rgba(245,243,239,0.5);
          padding: 0.35rem 0.7rem;
          font-family: var(--font-display);
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .cs-template-pill:hover {
          border-color: var(--color-violet);
          color: var(--color-ivory);
          background: rgba(123,115,217,0.04);
        }

        /* Invoice */
        .cs-invoice {
          background: #09080d;
          border: 1px solid rgba(245,243,239,0.07);
          padding: 1.1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .cs-invoice-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          color: rgba(245,243,239,0.55);
        }
        .cs-invoice-divider {
          border-bottom: 1px dashed rgba(245,243,239,0.12);
          margin: 0.35rem 0;
        }
        .cs-invoice-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--color-ivory);
        }
        .cs-invoice-amount {
          font-size: 1.15rem;
          color: var(--color-orange);
        }

        /* Navigation buttons */
        .cs-step-nav {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .cs-back-btn {
          background: transparent;
          border: 1px solid rgba(245,243,239,0.1);
          color: rgba(245,243,239,0.45);
          padding: 0.7rem 1.25rem;
          font-family: var(--font-display);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .cs-back-btn:hover {
          border-color: rgba(245,243,239,0.3);
          color: var(--color-ivory);
        }
        .cs-next-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: var(--color-ivory);
          color: var(--color-black);
          border: none;
          padding: 0.8rem 1.5rem;
          font-family: var(--font-display);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, box-shadow 0.25s, transform 0.2s;
        }
        .cs-next-btn:hover {
          background: var(--color-violet);
          color: var(--color-ivory);
          box-shadow: 0 8px 24px rgba(123,115,217,0.35);
          transform: translateY(-1px);
        }

        .cs-submit-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #7b73d9 0%, #5a52c8 100%);
          color: #fff;
          border: none;
          padding: 0.9rem 1.5rem;
          font-family: var(--font-display);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          cursor: pointer;
          transition: box-shadow 0.25s, transform 0.2s;
          box-shadow: 0 4px 20px rgba(123,115,217,0.25);
        }
        .cs-submit-btn:hover {
          box-shadow: 0 10px 32px rgba(123,115,217,0.5);
          transform: translateY(-2px);
        }

        /* WhatsApp link */
        .cs-whatsapp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(37, 211, 102, 0.08);
          color: #25d366;
          border: 1px solid rgba(37, 211, 102, 0.25);
          padding: 0.85rem 1.25rem;
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-decoration: none;
          text-align: center;
          transition: background 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.2s;
          cursor: pointer;
          margin-top: 0.5rem;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.05);
          width: 100%;
          box-sizing: border-box;
        }
        .cs-whatsapp:hover {
          background: rgba(37, 211, 102, 0.16);
          border-color: rgba(37, 211, 102, 0.6);
          color: #25d366;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.15);
          transform: translateY(-1px);
        }

        /* ══ SUCCESS ═══════════════════════════════════════════════════════ */
        .cs-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-align: center;
          padding: 4rem 2rem;
          border: 1px solid rgba(57,255,20,0.12);
          background: rgba(57,255,20,0.02);
          animation: panelIn 0.5s ease both;
        }
        .cs-success-ring {
          width: 72px; height: 72px;
          border: 1px solid rgba(57,255,20,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #39ff14;
          filter: drop-shadow(0 0 12px rgba(57,255,20,0.4));
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(57,255,20,0.2); }
          50%      { box-shadow: 0 0 0 12px rgba(57,255,20,0); }
        }
        .cs-success-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: var(--color-ivory);
        }
        .cs-success-body {
          max-width: 320px;
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: var(--color-muted);
          line-height: 1.6;
          font-weight: 300;
        }
        .cs-success-ref {
          font-family: monospace;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          color: rgba(57,255,20,0.6);
          border: 1px solid rgba(57,255,20,0.15);
          padding: 0.3rem 0.8rem;
        }

        /* ══ RESPONSIVE ════════════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .cs-root { padding: 4rem 1.5rem 3rem; }
          /* Stack into single column, preview on top */
          .cs-body { grid-template-columns: 1fr; gap: 2rem; }
          .cs-preview-col { position: static; }
          /* Narrower canvas when stacked so it doesn't dominate */
          .cs-canvas-frame { width: 55% !important; }
          .cs-size-a5 { width: 38% !important; }
          .cs-size-a4 { width: 46% !important; }
          .cs-size-a3 { width: 55% !important; }
        }

        @media (max-width: 768px) {
          .cs-root { padding: 3.5rem 1rem 2.5rem; }
          .cs-hero { margin-bottom: 2rem; }
          .cs-hero-title { font-size: clamp(1.8rem, 7vw, 2.6rem); }
          .cs-hero-sub { font-size: 0.82rem; }
          .cs-body { gap: 1.25rem; }
          .cs-preview-shell { padding: 1rem; }
          .cs-canvas-frame { width: 60% !important; }
          .cs-size-a5 { width: 42% !important; }
          .cs-size-a4 { width: 51% !important; }
          .cs-size-a3 { width: 60% !important; }
          .cs-panel { padding: 1.25rem; gap: 1.25rem; }
          .cs-font-grid { grid-template-columns: repeat(2, 1fr); }
          .cs-size-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 480px) {
          .cs-root { padding: 3rem 0.85rem 2rem; }
          .cs-hero-title { font-size: clamp(1.6rem, 9vw, 2.2rem); }
          .cs-hero-sub { font-size: 0.78rem; }
          .cs-stepper { grid-template-columns: repeat(4, 1fr); gap: 0.25rem; }
          .cs-step { padding: 0.5rem 0.15rem; }
          .cs-step-label { font-size: 0.42rem; letter-spacing: 0.06em; }
          .cs-canvas-frame { width: 72% !important; }
          .cs-size-a5 { width: 50% !important; }
          .cs-size-a4 { width: 62% !important; }
          .cs-size-a3 { width: 72% !important; }
          .cs-panel { padding: 1rem 0.9rem; gap: 1rem; }
          .cs-panel-header { gap: 0.6rem; }
          .cs-step-num { font-size: 1.5rem; }
          .cs-panel-title { font-size: 0.82rem; }
          .cs-panel-desc { font-size: 0.72rem; }
          .cs-font-grid { grid-template-columns: repeat(2, 1fr); gap: 0.35rem; }
          .cs-size-grid { grid-template-columns: repeat(3, 1fr); gap: 0.35rem; }
          .cs-size-card { padding: 0.7rem 0.3rem; }
          .cs-size-code { font-size: 0.85rem; }
          .cs-size-dim { font-size: 0.42rem; }
          .cs-mount-grid { gap: 0.35rem; }
          .cs-mount-card { padding: 0.85rem 0.5rem; }
          .cs-mount-name { font-size: 0.62rem; }
          .cs-mount-desc { font-size: 0.55rem; }
          .cs-invoice { padding: 0.9rem; }
          .cs-invoice-row { font-size: 0.67rem; }
          .cs-invoice-amount { font-size: 1rem; }
          .cs-step-nav { gap: 0.5rem; }
          .cs-back-btn { padding: 0.65rem 0.85rem; font-size: 0.58rem; }
          .cs-next-btn,
          .cs-submit-btn { padding: 0.75rem 1rem; font-size: 0.62rem; }
          .cs-success { padding: 3rem 1.25rem; }
          .cs-drop-zone { padding: 2rem 1rem; }
          .cs-templates { gap: 0.35rem; }
          .cs-template-pill { font-size: 0.54rem; padding: 0.3rem 0.55rem; }
          .cs-price-value { font-size: 0.95rem; }
        }

        @media (max-width: 360px) {
          .cs-root { padding: 2.5rem 0.7rem 1.5rem; }
          .cs-stepper { gap: 0.2rem; }
          .cs-step-label { display: none; }
          .cs-panel { padding: 0.85rem 0.75rem; }
          .cs-invoice-row { font-size: 0.62rem; }
        }
      `}</style>
    </section>
  );
}
