import React from 'react';
import { ShoppingBag, ArrowRight, Settings } from 'lucide-react';
import { MenuToggleIcon } from './ui/menu-toggle-icon';
import { useScroll } from './ui/use-scroll';

export default function Navbar({ cartCount, onCartClick, activeTab, setActiveTab, onAdminClick }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const progressBarRef = React.useRef(null);
  const scrolled = useScroll(10);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'custom', label: 'Custom Artwork' },
    { id: 'about', label: 'Our Story' },
  ];

  React.useEffect(() => {
    const handleScrollProgress = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0 && progressBarRef.current) {
        progressBarRef.current.style.width = `${(window.scrollY / totalScroll) * 100}%`;
      }
    };
    window.addEventListener('scroll', handleScrollProgress, { passive: true });
    handleScrollProgress();
    return () => window.removeEventListener('scroll', handleScrollProgress);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav className={`navbar-container-minimized ${scrolled ? 'scrolled' : ''} ${isOpen ? 'open' : ''}`}>
      <div className="navbar-content-min">
        {/* Dynamic Scroll Progress Bar */}
        <div ref={progressBarRef} className="scroll-progress-bar-min" style={{ width: '0%' }}></div>

        {/* Brand Mini Logo */}
        <div className="brand-logo-min" onClick={() => { setActiveTab('home'); setIsOpen(false); }}>
          <span>AXH</span>
          <span className="sub-logo-min">EDITIONS</span>
        </div>

        {/* Minimized Desktop Menu */}
        <div className="nav-links-min">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`nav-link-btn-min ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.label}
              {activeTab === item.id && <span className="nav-dot-min"></span>}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="nav-actions-min">

          {/* Cart Trigger */}
          <button className="cart-trigger-btn-min" onClick={() => { onCartClick(); setIsOpen(false); }}>
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && <span className="cart-badge-min">{cartCount}</span>}
          </button>

          <button className="mobile-menu-toggle-min" onClick={() => setIsOpen(!isOpen)}>
            <MenuToggleIcon open={isOpen} className="size-5" duration={300} style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-drawer-min">
          <div className="mobile-links-min">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`mobile-link-btn-min ${activeTab === item.id ? 'active' : ''}`}
              >
                {item.label}
                <ArrowRight size={14} className="arrow-icon-min" />
              </button>
            ))}
            

            <button className="mobile-cart-btn-min" onClick={() => { onCartClick(); setIsOpen(false); }}>
              <ShoppingBag size={16} style={{ marginRight: '8px' }} />
              Shopping Bag ({cartCount})
            </button>
          </div>
        </div>
      )}

      <style>{`
        .navbar-container-minimized {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          pointer-events: none;
        }

        .scroll-progress-bar-min {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2.5px;
          background: linear-gradient(90deg, var(--color-violet) 0%, var(--color-orange) 100%);
          z-index: 101;
          transition: width 0.1s ease-out;
        }

        .navbar-content-min {
          max-width: 1400px;
          margin: 0 auto;
          margin-top: 0px;
          padding: 1.15rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(9, 8, 13, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid transparent;
          border-bottom: 1px solid rgba(245, 243, 239, 0.04);
          pointer-events: auto;
          transition: 
            max-width 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            padding 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            margin-top 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Scrolled Shrink State: capsule floats down and narrows seamlessly with stable parent */
        .navbar-container-minimized.scrolled .navbar-content-min {
          padding: 0.65rem 2rem;
          background-color: rgba(17, 19, 38, 0.65);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75);
          border-bottom-color: rgba(245, 243, 239, 0.08);
        }

        @media (min-width: 769px) {
          .navbar-container-minimized.scrolled .navbar-content-min {
            margin-top: 1rem;
            max-width: 1000px;
            border-color: rgba(245, 243, 239, 0.08);
          }
        }

        .brand-logo-min {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: 0.1em;
          color: var(--color-ivory);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .sub-logo-min {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: var(--color-violet);
          margin-top: 0.1rem;
        }

        .nav-links-min {
          display: flex;
          gap: 2rem;
        }

        .nav-link-btn-min {
          background: none;
          border: none;
          color: var(--color-muted);
          font-family: var(--font-serif);
          font-weight: 400;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          padding: 0.35rem 0;
          transition: var(--transition-fast);
        }

        .nav-link-btn-min:hover {
          color: var(--color-ivory);
        }

        .nav-link-btn-min.active {
          color: var(--color-ivory);
          font-weight: 600;
        }

        .nav-dot-min {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          background: var(--color-violet);
          border-radius: 50%;
        }

        .nav-actions-min {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-panel-btn-min {
          background: none;
          border: 1px solid rgba(245, 243, 239, 0.05);
          color: var(--color-muted);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .admin-panel-btn-min:hover, .admin-panel-btn-min.active {
          border-color: var(--color-violet);
          color: var(--color-violet);
          background: rgba(123, 115, 217, 0.05);
        }

        .cart-trigger-btn-min {
          background: rgba(245, 243, 239, 0.02);
          border: 1px solid rgba(245, 243, 239, 0.05);
          color: var(--color-ivory);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: var(--transition-smooth);
        }

        .cart-trigger-btn-min:hover {
          background: rgba(123, 115, 217, 0.05);
          border-color: var(--color-violet);
          color: var(--color-violet);
        }

        .cart-badge-min {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--color-orange);
          color: var(--color-ivory);
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--color-black);
        }

        .mobile-menu-toggle-min {
          display: none;
          background: rgba(245, 243, 239, 0.02);
          border: 1px solid rgba(245, 243, 239, 0.05);
          color: var(--color-ivory);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .mobile-menu-toggle-min:hover {
          background: rgba(123, 115, 217, 0.05);
          border-color: var(--color-violet);
          color: var(--color-violet);
        }


        /* Mobile Min Drawer */
        .mobile-drawer-min {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #09080D;
          border-bottom: 1px solid rgba(245, 243, 239, 0.08);
          padding: 1.5rem 2rem;
          pointer-events: auto;
          animation: slideDownMin 0.3s ease-out forwards;
        }

        .mobile-links-min {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .mobile-link-btn-min {
          background: none;
          border: none;
          color: var(--color-muted);
          font-family: var(--font-serif);
          font-size: 1.1rem;
          text-align: left;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0;
          cursor: pointer;
          border-bottom: 1px solid rgba(245, 243, 239, 0.03);
          transition: var(--transition-fast);
        }

        .mobile-link-btn-min:hover, .mobile-link-btn-min.active {
          color: var(--color-ivory);
          border-color: var(--color-violet);
        }

        .mobile-link-btn-min.active .arrow-icon-min {
          color: var(--color-violet);
        }

        .mobile-admin-btn-min {
          margin-top: 0.5rem;
          background: rgba(245, 243, 239, 0.02);
          border: 1px solid rgba(245, 243, 239, 0.08);
          color: var(--color-muted);
          padding: 0.85rem;
          border-radius: 0px !important;
          font-family: var(--font-serif);
          font-weight: 500;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .mobile-admin-btn-min:hover {
          border-color: var(--color-violet);
          color: var(--color-violet);
        }

        .mobile-cart-btn-min {
          background: var(--color-ivory);
          color: var(--color-black);
          border: none;
          padding: 0.85rem;
          border-radius: 0px !important;
          font-family: var(--font-serif);
          font-weight: 600;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .mobile-cart-btn-min:hover {
          background: var(--color-violet);
          color: var(--color-ivory);
        }

        @keyframes slideDownMin {
          from {
            transform: translateY(-15px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 1024px) {
          .nav-links-min {
            display: none;
          }
          .mobile-menu-toggle-min {
            display: flex;
          }
          .navbar-content-min {
            padding: 0.8rem 1.5rem;
          }
          .navbar-container-minimized.scrolled .navbar-content-min {
            padding: 0.8rem 1.5rem;
          }
        }

        @media (max-width: 380px) {
          .brand-logo-min {
            font-size: 1.05rem;
            gap: 0.25rem;
          }
          .sub-logo-min {
            font-size: 0.58rem;
          }
          .navbar-content-min {
            padding: 0.8rem 1rem !important;
          }
        }
      `}</style>
    </nav>
  );
}
