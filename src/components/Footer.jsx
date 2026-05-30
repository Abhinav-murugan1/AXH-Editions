import React, { useState } from 'react';
import {
  Mail, MapPin, ShieldCheck, Globe, Camera, Send, PlayCircle
} from 'lucide-react';

/* ─── Footer ───────────────────────────────────────────────────── */
export default function Footer({ onAdminClick }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'How are AXH Editions prints made?',
      a: 'All prints are manufactured on heavyweight (250gsm) museum-grade archival stock with premium pigment-based inks. This ensures high-contrast blacks and vibrant details that remain fade-proof for generations.',
    },
    {
      q: 'What framing choices do you offer?',
      a: 'We offer custom-fitted, modern minimal solid wood frames in matte black. Each framed print comes pre-mounted behind high-clarity protective acrylic glass, finished with professional dust-covers, and ready-to-hang.',
    },
    {
      q: 'How does the Custom Artwork service work?',
      a: 'Our designers work closely with your creative direction. Once you submit a vision details request, we draft 2 concept variations for your review within 3 business days. After your approval, we proceed with high-end print production.',
    },
    {
      q: 'What is your return & drop policy?',
      a: 'Since limited drops are numbered and produced in exclusive volume runs, we do not restock items once a drop closes. We offer complete refunds or replacements for any prints damaged during shipping transit.',
    },
  ];

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { label: 'Shop All Drops', href: '#shop' },
        { label: 'Custom Artwork', href: '#custom' },
        { label: 'Drop Archive', href: '#archive' },
        { label: 'Collector Programme', href: '#collector' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQs', href: '#faq' },
        { label: 'Shipping Info', href: '#shipping' },
        { label: 'Returns', href: '#refunds' },
        { label: 'Live Chat', href: '#chat', pulse: true },
      ],
    },
  ];

  const contactInfo = [
    { icon: <Mail size={15} />, text: 'collect@axheditions.com', href: 'mailto:collect@axheditions.com' },
    { icon: <MapPin size={15} />, text: 'AXH Studio, London & Paris' },
  ];

  const socialLinks = [
    { icon: <Camera size={18} />, label: 'Instagram', href: 'https://www.instagram.com/axheditions/' },
    { icon: <Send size={18} />, label: 'Twitter / X', href: '#' },
    { icon: <PlayCircle size={18} />, label: 'YouTube', href: '#' },
    { icon: <Globe size={18} />, label: 'Website', href: '#' },
  ];

  return (
    <footer className="axh-footer">

      {/* Background radial glow */}
      <div className="footer-bg-glow" />

      {/* ── All content sits above ───────────────────────────── */}
      <div className="footer-content-layer">

      {/* ── Main Columns ─────────────────────────────── */}
      <div className="footer-columns-grid">

        {/* Brand */}
        <div className="footer-col-brand">
          <div className="footer-brand-logo">
            <span>AXH</span>
            <span className="sub-logo">EDITIONS</span>
          </div>
          <p className="footer-brand-pitch flashy-modern-text">
            Transforming visual ideas into premium collectible art designed for
            modern spaces. Collect what you genuinely love.
          </p>
          <div className="contact-details-list">
            {contactInfo.map((item, i) => (
              <div key={i} className="detail-item">
                <span className="detail-icon">{item.icon}</span>
                {item.href
                  ? <a href={item.href} className="detail-link">{item.text}</a>
                  : <span>{item.text}</span>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {footerLinks.map((section) => (
          <div key={section.title} className="footer-col-links">
            <h4 className="footer-col-title">{section.title}</h4>
            <ul className="footer-link-list">
              {section.links.map((link) => (
                <li key={link.label} style={{ position: 'relative' }}>
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                  {link.pulse && <span className="pulse-dot" />}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div className="footer-col-newsletter">
          <h4 className="footer-col-title">SUBSCRIBE TO FUTURE DROPS</h4>
          <p className="footer-newsletter-desc flashy-modern-text">
            Get exclusive early access to upcoming limited drops before the
            public closeout timer starts.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="ENTER EMAIL ADDRESS"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-submit-btn">
              SUBSCRIBE
            </button>
          </form>
          <div className="assurance-row">
            <ShieldCheck size={12} />
            <span>Zero spam. Secure subscriber updates only.</span>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      {/* ── Bottom bar ───────────────────────────────── */}
      <div className="footer-bottom-bar">
        <div className="social-links-row">
          {socialLinks.map(({ icon, label, href }) => (
            <a key={label} href={href} aria-label={label} className="social-link">
              {icon}
            </a>
          ))}
        </div>

        <span className="copyright-text">
          © {new Date().getFullYear()} AXH EDITIONS. ALL RIGHTS RESERVED.
        </span>

        <div className="policy-links">
          <a href="#privacy" className="policy-link">PRIVACY</a>
          <button 
            onClick={onAdminClick} 
            className="policy-link"
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              textTransform: 'uppercase',
              display: 'inline-block'
            }}
          >
            ADMIN
          </button>
          <a href="#refunds" className="policy-link">REFUNDS</a>
          <a href="#terms" className="policy-link">TERMS</a>
        </div>
      </div>
      </div> {/* end footer-content-layer */}

      <style>{`
        /* ── Container ─────────────────────────────────── */
        .axh-footer {
          position: relative;
          overflow: hidden;
          background: rgba(9, 8, 13, 0.98);
          border-top: 1px solid rgba(245, 243, 239, 0.05);
          z-index: 10;
        }

        /* ── FAQ ─────────────────────────────────── */
        .faq-editorial-container {
          max-width: 1400px;
          margin: 0 auto 6rem auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 5rem;
        }

        .faq-left-editorial-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .faq-sub-label {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--color-orange);
          letter-spacing: 0.25em;
        }

        .faq-editorial-display {
          font-family: var(--font-display);
          font-size: 2.75rem;
          line-height: 1.1;
          color: var(--color-ivory);
          letter-spacing: -0.01em;
        }

        .faq-editorial-pitch {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-muted);
          max-width: 380px;
        }

        .faq-right-accordion-col {
          display: flex;
          flex-direction: column;
          border-top: 1px solid rgba(245, 243, 239, 0.08);
        }

        .faq-editorial-line {
          padding: 2rem 0;
          border-bottom: 1px solid rgba(245, 243, 239, 0.08);
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .faq-editorial-line.active {
          border-color: rgba(123, 115, 217, 0.3);
        }

        .faq-editorial-question-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-serif);
          font-size: 1.05rem;
          color: var(--color-ivory);
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .faq-indicator {
          font-family: var(--font-sans);
          font-size: 1.25rem;
          color: var(--color-violet);
          font-weight: 300;
        }

        .faq-editorial-answer-block {
          margin-top: 1.25rem;
          padding-top: 0.5rem;
        }

        .faq-editorial-answer-block p {
          font-size: 0.9rem;
          line-height: 1.8;
          color: var(--color-muted);
        }

        /* ── Columns Grid ─────────────────────────── */
        .footer-columns-grid {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
          display: grid;
          grid-template-columns: 1.4fr 0.7fr 0.7fr 1.2fr;
          gap: 4rem;
        }

        /* ── Brand col ─────────────────────────── */
        .footer-brand-logo {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.75rem;
          letter-spacing: 0.15em;
          color: var(--color-ivory);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .sub-logo {
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: var(--color-violet);
          font-weight: 600;
          align-self: flex-end;
          padding-bottom: 0.2rem;
        }

        .footer-brand-pitch {
          font-size: 0.88rem;
          line-height: 1.8;
          color: var(--color-muted);
          margin-bottom: 1.5rem;
        }

        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: var(--color-muted);
        }

        .detail-icon {
          color: var(--color-violet);
          display: flex;
          align-items: center;
        }

        .detail-link {
          color: var(--color-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .detail-link:hover {
          color: var(--color-ivory);
        }

        /* ── Link cols ─────────────────────────── */
        .footer-col-title {
          font-family: var(--font-serif);
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          color: var(--color-ivory);
          margin-bottom: 1.25rem;
          font-weight: 600;
        }

        .footer-link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          color: var(--color-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: var(--color-ivory);
        }

        .pulse-dot {
          position: absolute;
          top: 2px;
          right: -12px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-violet);
          animation: pulseDot 1.5s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        /* ── Newsletter col ─────────────────────── */
        .footer-newsletter-desc {
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--color-muted);
          margin-bottom: 1rem;
        }

        .newsletter-form {
          display: flex;
          background: rgba(245, 243, 239, 0.03);
          border: 1px solid rgba(245, 243, 239, 0.08);
          border-radius: 4px;
          overflow: hidden;
          padding: 0.2rem;
          margin-bottom: 0.75rem;
        }

        .newsletter-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--color-ivory);
          padding: 0.65rem 0.75rem;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
        }

        .newsletter-submit-btn {
          background: var(--color-violet);
          color: var(--color-ivory);
          border: none;
          padding: 0 1.25rem;
          font-family: var(--font-serif);
          font-weight: 600;
          font-size: 0.7rem;
          letter-spacing: 0.06em;
          border-radius: 2px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          white-space: nowrap;
        }

        .newsletter-submit-btn:hover {
          background: var(--color-ivory);
          color: var(--color-black);
        }

        .assurance-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-muted);
          font-size: 0.65rem;
        }

        /* ── Divider ─────────────────────────────── */
        .footer-divider {
          border: none;
          height: 1px;
          background: rgba(245, 243, 239, 0.05);
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── Bottom bar ──────────────────────────── */
        .footer-bottom-bar {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.75rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .social-links-row {
          display: flex;
          gap: 1.25rem;
        }

        .social-link {
          color: var(--color-muted);
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .social-link:hover {
          color: var(--color-violet);
          transform: translateY(-2px);
        }

        .copyright-text {
          font-family: var(--font-sans);
          font-size: 0.68rem;
          color: var(--color-muted);
          letter-spacing: 0.04em;
          text-align: center;
        }

        .policy-links {
          display: flex;
          gap: 1.5rem;
        }

        .policy-link {
          font-family: var(--font-serif);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          color: var(--color-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .policy-link:hover {
          color: var(--color-ivory);
        }

        /* Content layer spacing */
        .footer-content-layer {
          position: relative;
          z-index: 1;
          padding: 2rem 0 3rem 0;
        }

        /* ── Radial bg glow ────────────────────────── */
        .footer-bg-glow {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse 120% 80% at 50% 85%,
            rgba(123, 115, 217, 0.06) 0%,
            transparent 70%
          );
        }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 1280px) {
          .footer-columns-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 1024px) {
          .faq-editorial-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            margin-bottom: 3rem;
          }
        }

        @media (max-width: 768px) {
          .footer-columns-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            padding: 1.5rem 1.25rem 1rem 1.25rem;
          }
          .footer-col-brand {
            grid-column: span 2;
            margin-bottom: 0.25rem;
          }
          .footer-brand-pitch {
            margin-bottom: 0.85rem;
            font-size: 0.82rem;
          }
          .footer-col-links {
            grid-column: span 1;
          }
          .footer-col-title {
            margin-bottom: 0.65rem;
            font-size: 0.74rem;
          }
          .footer-link-list {
            gap: 0.5rem;
          }
          .footer-link {
            font-size: 0.78rem;
          }
          .footer-col-newsletter {
            grid-column: span 2;
            margin-top: 0.5rem;
          }
          .footer-newsletter-desc {
            margin-bottom: 0.6rem;
            font-size: 0.78rem;
          }
          .newsletter-form {
            margin-bottom: 0.6rem;
          }
          .footer-bottom-bar {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            padding: 1.25rem;
          }
          .policy-links {
            justify-content: center;
            gap: 1.25rem;
          }
          .footer-content-layer {
            padding: 1.25rem 0;
          }
        }
      `}</style>
    </footer>
  );
}
