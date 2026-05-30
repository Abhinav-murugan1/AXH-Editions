import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Drops from './components/Drops';
import Catalog from './components/Catalog';
import Custom from './components/Custom';
import About from './components/About';
import Instagram from './components/Instagram';
import Cart from './components/Cart';
import Product from './components/Product';
import Checkout from './components/Checkout';
import Admin from './components/Admin';
import Footer from './components/Footer';
import BrandMarquee from './components/BrandMarquee';
import CursorGlow from './components/CursorGlow';

// Dynamic Cloudinary Image Optimizer
const getCloudinaryUrl = (publicIdOrUrl, width = 800, height = 1000) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dsgoqckqh';
  if (!publicIdOrUrl) return '';
  if (publicIdOrUrl.startsWith('http') && !publicIdOrUrl.includes('cloudinary.com')) return publicIdOrUrl;
  if (publicIdOrUrl.startsWith('/')) return publicIdOrUrl;

  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.includes('res.cloudinary.com')) {
    const parts = publicIdOrUrl.split('/upload/');
    if (parts.length > 1) {
      publicId = parts[1].replace(/^v\d+\//, '');
    }
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_center,w_${width},h_${height},q_auto,f_auto/${publicId}`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'posters', 'framed', 'stickers', 'custom', 'about', 'admin'
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutInfo, setCheckoutInfo] = useState(null);

  // Hero card content — persisted to localStorage so admin changes survive refresh
  const [heroCard, setHeroCard] = useState(() => {
    try {
      const saved = localStorage.getItem('axh_hero_card');
      return saved ? JSON.parse(saved) : {
        image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096506/axh_editions_static/hamilton_poster.png',
        category: 'MOTORSPORT COLLECTIBLE',
        title: 'LEWIS HAMILTON // "STILL WE RISE"',
        subtitle: 'DROP 001 // SIGNATURE EDITION',
      };
    } catch { return { image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096506/axh_editions_static/hamilton_poster.png', category: 'MOTORSPORT COLLECTIBLE', title: 'LEWIS HAMILTON // "STILL WE RISE"', subtitle: 'DROP 001 // SIGNATURE EDITION' }; }
  });

  const updateHeroCard = (newData) => {
    const updated = { ...heroCard, ...newData };
    setHeroCard(updated);
    localStorage.setItem('axh_hero_card', JSON.stringify(updated));
  };

  // In production (Cloudflare Pages), VITE_API_URL is empty so requests go to
  // /api/* on the same domain, proxied by functions/api/[[path]].js.
  // In local dev, fall back to localhost:5000 directly.
  const API_URL = import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.DEV ? 'http://localhost:5000' : '');

  // Fetch products and session-based cart on boot
  useEffect(() => {
    fetchProducts();
    fetchSessionCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.map(p => ({
          ...p,
          image: getCloudinaryUrl(p.image)
        })));
      } else {
        throw new Error('Fallback required');
      }
    } catch (err) {
      // Offline fallback
      const fallbackProducts = [
        {
          id: 'prod-001',
          name: 'Nürburgring Monochrome',
          category: 'posters',
          genre: 'MOTORSPORT',
          price: 45,
          image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096507/axh_editions_static/motorsport_poster.jpg',
          stock: 12,
          serial: 'DROP 001 / ITEM 04',
          description: 'A high-contrast cinematic capture of the legendary Nürburgring Nordschleife Carousel, designed for ultra-clean minimalist interiors. Heavy archival print.',
          isDrop: true,
          isFeatured: true
        },
        {
          id: 'prod-002',
          name: 'Monaco Retro-Grand Prix',
          category: 'posters',
          genre: 'MOTORSPORT',
          price: 45,
          image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096507/axh_editions_static/motorsport_poster.jpg',
          stock: 5,
          serial: 'DROP 001 / ITEM 01',
          description: 'Vintage Monte Carlo silhouettes combined with a deep indigo luxury modern overlay. Intentionally numbered volume edition.',
          isDrop: true
        },
        {
          id: 'prod-003',
          name: 'San Siro Golden Hour',
          category: 'posters',
          genre: 'FOOTBALL',
          price: 45,
          image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096505/axh_editions_static/football_poster.jpg',
          stock: 8,
          serial: 'DROP 001 / ITEM 02',
          description: 'A geometric visual representation of San Siro stadium under deep amber lights. Crafted for modern football enthusiasts.',
          isDrop: true
        },
        {
          id: 'prod-004',
          name: 'Anfield Archival Print',
          category: 'framed',
          genre: 'FOOTBALL',
          price: 75,
          image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096505/axh_editions_static/football_poster.jpg',
          stock: 15,
          serial: 'DROP 001 / ITEM 03',
          description: 'Matte black minimal framed edition of our iconic Anfield Kop silhouette. Arrives pre-mounted with protective museum-grade cover.',
          isDrop: true,
          isFeatured: true
        },
        {
          id: 'prod-005',
          name: 'A24 Cinematic Editorial',
          category: 'posters',
          genre: 'CINEMA',
          price: 50,
          image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096507/axh_editions_static/motorsport_poster.jpg',
          stock: 20,
          serial: 'CATALOGUE / CORE',
          description: 'An abstract typographic poster celebrating independent cinema art culture. Soft ivory styling on premium black backdrop.',
          isDrop: false,
          isFeatured: true
        },
        {
          id: 'prod-006',
          name: 'Retro Synthwave Gaming',
          category: 'posters',
          genre: 'GAMING',
          price: 45,
          image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096505/axh_editions_static/football_poster.jpg',
          stock: 14,
          serial: 'CATALOGUE / CORE',
          description: 'Neon indigo aesthetic layout celebrating retro arcade design culture and minimal grid styling.',
          isDrop: false
        },
        {
          id: 'prod-007',
          name: 'Motorsport Signature Stickers',
          category: 'stickers',
          genre: 'MOTORSPORT',
          price: 15,
          image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096507/axh_editions_static/motorsport_poster.jpg',
          stock: 40,
          serial: 'DROP 001 / ACCS',
          description: 'A curated bundle of 5 mini collectible sticker packs featuring premium matte paper print and minimal motorsport silhouettes.',
          isDrop: false
        }
      ];
      setProducts(fallbackProducts);
    }
  };

  // Cookies & Sessions Cart Synchronizers
  const fetchSessionCart = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cart`, { credentials: 'include' });
      if (res.ok) {
        const sessionCart = await res.json();
        setCart(sessionCart);
      }
    } catch (err) {
      console.warn('Backend offline, using local memory state for session cart.');
    }
  };

  const syncCartWithSession = async (updatedCart) => {
    try {
      await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: updatedCart }),
        credentials: 'include'
      });
    } catch (err) {
      console.warn('Backend cart session sync issue.');
    }
  };

  // Cart Operations
  const handleAddToCart = (newItem) => {
    let updatedCart;
    const existing = cart.find(item => item.id === newItem.id);
    if (existing) {
      updatedCart = cart.map(item => item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updatedCart = [...cart, newItem];
    }
    
    setCart(updatedCart);
    syncCartWithSession(updatedCart);
    setCartOpen(true);
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const updatedCart = cart.map(item => item.id === itemId ? { ...item, quantity: newQty } : item);
    setCart(updatedCart);
    syncCartWithSession(updatedCart);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    syncCartWithSession(updatedCart);
  };

  const handleClearCart = async () => {
    setCart([]);
    try {
      await fetch(`${API_URL}/api/cart`, { method: 'DELETE', credentials: 'include' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutClick = (grandTotal, appliedDiscount) => {
    setCartOpen(false);
    setCheckoutInfo({ grandTotal, appliedDiscount });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Home Page reduced products selector - Show all featured products in carousel
  const homeFeaturedProducts = products.filter(p => p.isFeatured);

  const featuredScrollRef = useRef(null);

  const handleFeaturedScroll = (direction) => {
    if (featuredScrollRef.current) {
      const scrollAmount = featuredScrollRef.current.clientWidth * 0.75;
      featuredScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="app-layout">
      {/* Sleek Ambient Backdrops */}
      <div className="hero-gradient"></div>
      <div className="glow-ambient" style={{ top: '35%', left: '80%' }}></div>
      <div className="glow-ambient" style={{ top: '80%', left: '5%' }}></div>

      {/* Floating Sticky Minimized Navbar */}
      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setCartOpen(true)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAdminClick={() => setActiveTab('admin')}
      />

      <main className="main-content-layout">
        
        {/* VIEW 1: HOME PAGE (Gallery renamed with reduced size Handpicked prints) */}
        {activeTab === 'home' && (
          <>
            <Hero 
              onExploreClick={() => {
                const el = document.getElementById('handpicked-home');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onCustomClick={() => setActiveTab('custom')}
              heroCard={heroCard}
            />
            
            {/* Active curated drops right on landing */}
            <Drops 
              products={products}
              onSelectProduct={setSelectedProduct}
            />

            {/* Premium centered view all button linking to Curated Shop tab */}
            <div className="view-all-shop-divider">
              <button 
                className="view-all-shop-btn"
                onClick={() => {
                  setActiveTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>EXPLORE ALL EDITIONS</span>
                <span className="view-all-arrow">→</span>
              </button>
            </div>

            {/* Reduced Cards Handpicked Gallery Section */}
            <section className="handpicked-gallery-section" id="handpicked-home">
              <div className="section-header-editorial">
                <span className="accent-label">HANDPICKED EDITIONS</span>
                <h2 className="section-title-editorial">THE CORE SELECTION</h2>
                <p className="section-subtitle-editorial flashy-modern-text">
                  A condensed edit of our core design prints, sized with premium dimensions to accent clean wall displays.
                </p>
              </div>

              {/* Sideways scrolling carousel track */}
              <div className="carousel-wrapper-outer">
                {/* Navigation Arrows - Hidden by default, visible on hover */}
                <button 
                  className="carousel-arrow-btn prev-btn" 
                  onClick={() => handleFeaturedScroll('left')}
                  aria-label="Scroll featured left"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="featured-carousel-track" ref={featuredScrollRef}>
                  {homeFeaturedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="carousel-item reduced-prod-card glass-panel"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="reduced-card-media">
                        <div 
                          className="reduced-card-image"
                          style={{ backgroundImage: `url(${product.image})` }}
                        ></div>
                      </div>
                      <div className="reduced-card-details">
                        <span className="reduced-genre">{product.genre}</span>
                        <h4 className="reduced-name">{product.name}</h4>
                        <div className="reduced-footer">
                          <span className="reduced-price">₹{product.price}</span>
                          <span className="reduced-link-btn">COLLECT NOW →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="carousel-arrow-btn next-btn" 
                  onClick={() => handleFeaturedScroll('right')}
                  aria-label="Scroll featured right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: CURATED UNIFIED SHOP VIEW (Posters, Framed, Stickers combined with internal subcategories) */}
        {activeTab === 'shop' && (
          <Catalog 
            products={products.filter(p => p.category !== 'custom')} 
            onSelectProduct={setSelectedProduct} 
          />
        )}

        {/* VIEW 5: CUSTOM ARTWORK PAGE */}
        {activeTab === 'custom' && (
          <Custom 
            onAddCustomToCart={handleAddToCart} 
          />
        )}

        {/* VIEW 6: ABOUT MISSION STORY */}
        {activeTab === 'about' && (
          <About />
        )}

        {/* VIEW 7: CRUD SYSTEM ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <Admin 
            API_URL={API_URL} 
            products={products}
            onProductChange={fetchProducts}
            heroCard={heroCard}
            onHeroCardChange={updateHeroCard}
          />
        )}

        {/* Community social feed under home and about pages */}
        {(activeTab === 'home' || activeTab === 'about') && (
          <Instagram />
        )}
      </main>

      {/* Details View Modal */}
      {selectedProduct && (
        <Product 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <Cart 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutClick={handleCheckoutClick}
      />

      {/* Checkout Screen */}
      {checkoutInfo && (
        <Checkout 
          cartItems={cart}
          grandTotal={checkoutInfo.grandTotal}
          appliedDiscount={checkoutInfo.appliedDiscount}
          onClose={() => setCheckoutInfo(null)}
          onClearCart={handleClearCart}
        />
      )}

      {/* Footer Accordions */}
      <BrandMarquee />
      <Footer onAdminClick={() => {
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Cursor Glow layer */}
      <CursorGlow />

      <style>{`
        .app-layout {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .main-content-layout {
          flex: 1;
        }

        /* View All Shop Button Divider */
        .view-all-shop-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem 0 5rem 0;
          position: relative;
        }

        .view-all-shop-btn {
          display: inline-flex;
          align-items: center;
          gap: 1.25rem;
          background: rgba(17, 19, 38, 0.2);
          color: var(--color-ivory);
          border: 1px solid rgba(245, 243, 239, 0.08);
          padding: 1.25rem 3.5rem;
          font-family: var(--font-serif);
          font-weight: 500;
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .view-all-shop-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(123, 115, 217, 0.1) 0%, rgba(43, 53, 104, 0.25) 100%);
          opacity: 0;
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
        }

        .view-all-shop-btn span {
          position: relative;
          z-index: 1;
        }

        .view-all-arrow {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .view-all-shop-btn:hover {
          border-color: var(--color-violet);
          color: var(--color-violet);
          box-shadow: 0 0 35px rgba(123, 115, 217, 0.15);
          letter-spacing: 0.25em;
        }

        .view-all-shop-btn:hover::before {
          opacity: 1;
        }

        .view-all-shop-btn:hover .view-all-arrow {
          transform: translateX(8px);
        }

        /* Reduced Card Sizes Styling & Carousel */
        .handpicked-gallery-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem 6rem 2rem;
          position: relative;
        }

        .carousel-wrapper-outer {
          position: relative;
          width: 100%;
          margin-top: 2rem;
        }

        .featured-carousel-track {
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

        .featured-carousel-track::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .carousel-item {
          flex: 0 0 calc(25% - 1.5rem);
          min-width: 250px;
          scroll-snap-align: start;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
        }

        .carousel-item:hover {
          transform: translateY(-6px);
          border-color: var(--color-border-hover);
        }

        .reduced-prod-card {
          cursor: pointer;
          overflow: hidden;
          background: rgba(17, 19, 38, 0.1);
          border-radius: 0px !important;
        }

        .reduced-card-media {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #111;
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
        }

        .reduced-card-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .carousel-item:hover .reduced-card-image {
          transform: scale(1.04);
        }

        .reduced-card-details {
          padding: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .reduced-genre {
          font-family: var(--font-sans);
          font-size: 0.54rem;
          font-weight: 600;
          color: var(--color-violet);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .reduced-name {
          font-family: var(--font-serif);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-ivory);
          letter-spacing: 0.01em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .reduced-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.15rem;
          border-top: 1px solid rgba(245, 243, 239, 0.03);
          padding-top: 0.45rem;
        }

        .reduced-price {
          font-family: var(--font-serif);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-ivory);
        }

        .reduced-link-btn {
          font-family: var(--font-sans);
          font-size: 0.58rem;
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
            flex: 0 0 calc(50% - 1rem);
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
            flex: 0 0 85%; /* Let the next item peek slightly to invite horizontal swiping */
          }
          .featured-carousel-track {
            gap: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
