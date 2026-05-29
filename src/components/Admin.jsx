import React, { useState, useEffect } from 'react';
import { Lock, Plus, Edit2, Trash2, LogOut, CheckSquare, ListOrdered, Sparkles, FolderOpen, ArrowRight, ShieldCheck, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

export default function Admin({ API_URL, products, onProductChange, heroCard = {}, onHeroCardChange }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('catalog'); // 'catalog', 'requests', 'orders', 'media'

  // Cloudinary Media Library State
  const [mediaAssets, setMediaAssets] = useState([]);
  const [fetchingMedia, setFetchingMedia] = useState(false);
  const [mediaFeedback, setMediaFeedback] = useState('');
  const [mediaCopiedId, setMediaCopiedId] = useState(null);
  const [mediaUploading, setMediaUploading] = useState(false);

  // Admin Logs
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('posters');
  const [genre, setGenre] = useState('MOTORSPORT');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [serial, setSerial] = useState('CATALOGUE / CORE');
  const [description, setDescription] = useState('');
  const [isDrop, setIsDrop] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Image Uploading state
  const [uploadingImage, setUploadingImage] = useState(false);
  // Hero card uploader state
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroFeedback, setHeroFeedback] = useState('');

  // Feedbacks
  const [formFeedback, setFormFeedback] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check login state on mount
  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardLogs();
      fetchMediaAssets(); // Pre-load Cloudinary media
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/check`, { credentials: 'include' });
      const data = await res.json();
      if (data.isAdmin) setIsAdmin(true);
    } catch (err) {
      console.error('Failed to check admin session status:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
      } else {
        setLoginError(data.error || 'Authorization failed.');
      }
    } catch (err) {
      setLoginError('Error connecting to backend API.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/admin/logout`, { method: 'POST', credentials: 'include' });
      setIsAdmin(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const fetchDashboardLogs = async () => {
    try {
      const ordRes = await fetch(`${API_URL}/api/admin/orders`, { credentials: 'include' });
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
      }

      const reqRes = await fetch(`${API_URL}/api/admin/custom-requests`, { credentials: 'include' });
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setCustomRequests(reqData);
      }
    } catch (err) {
      console.error('Failed to load dashboard logs:', err);
    }
  };

  const fetchMediaAssets = async () => {
    setFetchingMedia(true);
    setMediaFeedback('');
    try {
      const res = await fetch(`${API_URL}/api/admin/media`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMediaAssets(data.resources || []);
        } else {
          setMediaFeedback('Failed to retrieve assets.');
        }
      } else {
        setMediaFeedback('Failed to connect to media server.');
      }
    } catch (err) {
      console.error(err);
      setMediaFeedback('Unable to reach backend media service.');
    } finally {
      setFetchingMedia(false);
    }
  };

  const copyToClipboard = (url, publicId) => {
    navigator.clipboard.writeText(url);
    setMediaCopiedId(publicId);
    setTimeout(() => setMediaCopiedId(null), 2000);
  };

  const handleMediaLibraryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaUploading(true);
    setMediaFeedback('Uploading to Cloudinary axh_editions folder...');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          setMediaFeedback('✓ Asset uploaded successfully!');
          fetchMediaAssets(); // Reload grid immediately!
        } else {
          setMediaFeedback(`Upload failed: ${data.error || 'Check configuration'}`);
        }
      } catch (err) {
        setMediaFeedback('Failed to reach backend API.');
      } finally {
        setMediaUploading(false);
      }
    };
  };

  const selectAssetForProductForm = (assetUrl) => {
    setImage(assetUrl);
    setActiveSubTab('catalog');
    setFormFeedback('Visual asset selected from Cloudinary library!');
  };

  // High-Performance Base64 Cloudinary Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setFormFeedback('Reading file details...');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setFormFeedback('Uploading visual asset to Cloudinary...');
      
      try {
        const res = await fetch(`${API_URL}/api/admin/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data }),
          credentials: 'include'
        });
        const data = await res.json();
        
        if (data.success) {
          setImage(data.url); // Set returned Cloudinary secure URL directly!
          setFormFeedback('Image successfully secured on Cloudinary!');
        } else {
          setFormFeedback(`Upload issue: ${data.error || 'Check server keys'}`);
        }
      } catch (err) {
        setFormFeedback('Failed to establish upload request to API.');
      } finally {
        setUploadingImage(false);
      }
    };
  };

  // Hero card image upload — Cloudinary only, same endpoint as product images
  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHeroUploading(true);
    setHeroFeedback('Uploading to Cloudinary...');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          onHeroCardChange({ image: data.url });
          setHeroFeedback('✓ Hero image saved to Cloudinary!');
        } else {
          setHeroFeedback(`Upload failed: ${data.error || 'Check Cloudinary config'}`);
        }
      } catch {
        setHeroFeedback('Cannot reach upload API. Is the backend running?');
      } finally {
        setHeroUploading(false);
      }
    };
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormFeedback('');

    const payload = {
      name, category, genre, price, image, stock, serial, description, isDrop, isFeatured
    };

    const endpoint = isEditing 
      ? `${API_URL}/api/products/${editingId}`
      : `${API_URL}/api/products`;
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (res.ok) {
        setFormFeedback(isEditing ? 'Product updated successfully!' : 'New product created successfully!');
        resetForm();
        onProductChange(); // refresh products
        fetchDashboardLogs();
      } else {
        setFormFeedback('Failed to execute database action.');
      }
    } catch (err) {
      setFormFeedback('Database network connection issue.');
    }
  };

  const handleEditClick = (prod) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setName(prod.name);
    setCategory(prod.category);
    setGenre(prod.genre);
    setPrice(prod.price);
    setImage(prod.image);
    setStock(prod.stock);
    setSerial(prod.serial || 'CATALOGUE / CORE');
    setDescription(prod.description);
    setIsDrop(!!prod.isDrop);
    setIsFeatured(!!prod.isFeatured);
  };

  const handleDeleteClick = async (prodId) => {
    if (!confirm('Are you sure you want to permanently delete this visual collectible?')) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${prodId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        onProductChange();
        setFormFeedback('Product successfully deleted.');
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setCategory('posters');
    setGenre('MOTORSPORT');
    setPrice('');
    setImage('');
    setStock('');
    setSerial('CATALOGUE / CORE');
    setDescription('');
    setIsDrop(false);
    setIsFeatured(false);
  };

  // 1. Ultra-Premium Cinematic Gate Login Page
  if (!isAdmin) {
    return (
      <div className="premium-login-gate animate-fade-in">
        <div className="luxury-glow-backdrop"></div>
        <div className="cinematic-grid-overlay"></div>
        
        <div className="cinematic-login-wrapper glass-panel">
          <div className="cinematic-lock-header">
            <div className="badge-wrapper animate-slide-up">
              <span className="premium-tag-glow">SECURE PORTAL</span>
            </div>
            
            <h2 className="premium-system-title">
              AXH <span className="text-violet">EDITIONS</span>
            </h2>
            <span className="min-sub-title">CORE CONSOLE GATEWAY</span>
            
            <p className="premium-console-pitch">
              Provide credentials to gain entry to the AXH design vault. You will be authorized to sync product catalogs directly with MongoDB Atlas and upload visual assets to Cloudinary.
            </p>
          </div>

          <form onSubmit={handleLogin} className="premium-cinematic-form">
            <div className="form-group-outline">
              <input 
                type="email" 
                placeholder="CONSOLE IDENTITY (EMAIL)" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-console-input"
                required 
              />
              <span className="input-focus-line"></span>
            </div>
            <div className="form-group-outline">
              <input 
                type="password" 
                placeholder="AUTHENTICATION SECURITY PIN" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="premium-console-input"
                required 
              />
              <span className="input-focus-line"></span>
            </div>
            
            {loginError && <p className="premium-login-error">{loginError}</p>}
            
            <button 
              type="submit" 
              className="btn-primary premium-login-pay-btn"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={16} className="spinner-spin" />
                  <span>AUTHORIZING GATE ACCESS...</span>
                </>
              ) : (
                <>
                  <span>AUTHORIZE CONSOLE</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Telemetry metadata status widgets */}
          <div className="telemetry-bar-row">
            <div className="telemetry-item">
              <span className="dot active"></span>
              <span>API GATEWAY: ONLINE</span>
            </div>
            <div className="telemetry-item">
              <span className="dot active"></span>
              <span>DATABASE: ATLAS CONNECTED</span>
            </div>
            <div className="telemetry-item">
              <span className="dot active"></span>
              <span>CLOUDINARY STORAGE: ACTIVE</span>
            </div>
          </div>

          <div className="secure-badge-box" style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(245, 243, 239, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={14} className="badge-shield-icon" style={{ color: 'var(--color-violet)' }} />
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>AXH CORPORATE CONSOLE // SECURED SSL ACCESS</span>
          </div>
        </div>

        <style>{`
          .premium-login-gate {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            background: #09080D;
            overflow: hidden;
          }

          .luxury-glow-backdrop {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(123, 115, 217, 0.08) 0%, rgba(17, 19, 38, 0.4) 60%, transparent 100%);
            z-index: 0;
            pointer-events: none;
          }

          .cinematic-grid-overlay {
            position: absolute;
            inset: 0;
            background-image: linear-gradient(rgba(245, 243, 239, 0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 243, 239, 0.01) 1px, transparent 1px);
            background-size: 40px 40px;
            z-index: 0;
            pointer-events: none;
          }

          .cinematic-login-wrapper {
            width: 100%;
            max-width: 500px;
            padding: 4rem 3.5rem 3rem 3.5rem;
            background: rgba(17, 19, 38, 0.65);
            border: 1px solid rgba(245, 243, 239, 0.06);
            box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
            position: relative;
            z-index: 1;
            text-align: center;
            border-radius: 0px !important;
          }

          .cinematic-lock-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.65rem;
            margin-bottom: 3rem;
          }

          .badge-wrapper {
            margin-bottom: 0.5rem;
          }

          .premium-tag-glow {
            background: rgba(123, 115, 217, 0.06);
            border: 1px solid rgba(123, 115, 217, 0.2);
            color: var(--color-violet);
            font-family: var(--font-sans);
            font-size: 0.65rem;
            font-weight: 600;
            letter-spacing: 0.2em;
            padding: 0.35rem 1rem;
            text-shadow: 0 0 10px rgba(123, 115, 217, 0.3);
          }

          .premium-system-title {
            font-family: var(--font-serif);
            font-size: 2.25rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: var(--color-ivory);
            line-height: 1.1;
          }

          .text-violet {
            color: var(--color-violet);
          }

          .min-sub-title {
            font-family: var(--font-sans);
            font-size: 0.7rem;
            font-weight: 300;
            letter-spacing: 0.3em;
            color: var(--color-muted);
            margin-top: -0.2rem;
          }

          .premium-console-pitch {
            font-size: 0.85rem;
            line-height: 1.7;
            color: var(--color-muted);
            margin-top: 1rem;
            max-width: 380px;
          }

          .premium-cinematic-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-group-outline {
            position: relative;
            width: 100%;
          }

          .premium-console-input {
            width: 100%;
            background: rgba(9, 8, 13, 0.75);
            border: 1px solid rgba(245, 243, 239, 0.08);
            color: var(--color-ivory);
            padding: 1.1rem 1.25rem;
            font-family: var(--font-serif);
            font-size: 0.8rem;
            letter-spacing: 0.08em;
            outline: none;
            transition: var(--transition-fast);
            border-radius: 0px !important;
          }

          .premium-console-input:focus {
            border-color: var(--color-violet);
            background: rgba(9, 8, 13, 0.9);
          }

          .premium-login-pay-btn {
            width: 100%;
            justify-content: center;
            padding: 1.1rem;
            border-radius: 0px !important;
          }

          .premium-login-error {
            color: #ff5252;
            font-size: 0.75rem;
            text-align: left;
            margin-top: -0.5rem;
          }

          .telemetry-bar-row {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(245, 243, 239, 0.05);
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            text-align: left;
          }

          .telemetry-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: var(--font-sans);
            font-size: 0.65rem;
            color: var(--color-muted);
            letter-spacing: 0.05em;
          }

          .telemetry-item .dot {
            width: 6px;
            height: 6px;
            background: rgba(245, 243, 239, 0.1);
          }

          .telemetry-item .dot.active {
            background: #4caf50;
            box-shadow: 0 0 6px #4caf50;
          }

          .demologin-helper-badge {
            margin-top: 2rem;
            border-top: 1px solid rgba(245, 243, 239, 0.05);
            padding-top: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-family: var(--font-sans);
            font-size: 0.65rem;
            color: var(--color-muted);
          }

          .badge-shield-icon {
            color: var(--color-violet);
          }

          .demologin-helper-badge code {
            color: var(--color-orange);
            background: rgba(245, 243, 239, 0.03);
            padding: 0.15rem 0.4rem;
          }

          .spinner-spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Derived Business KPIs
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  // 2. High-Fidelity User-Friendly Admin Dashboard
  return (
    <section className="admin-dashboard-container animate-fade-in">
      {/* Top dashboard navbar */}
      <div className="admin-header-row glass-panel">
        <div className="admin-brand-logo">
          <span>AXH EDITIONS</span>
          <span className="sub-logo">SYSTEM CONSOLE</span>
        </div>
        
        {/* Navigation sub-tabs */}
        <div className="admin-sub-tabs">
          <button 
            className={`admin-tab-btn ${activeSubTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('catalog')}
          >
            <FolderOpen size={14} />
            <span>Manage Catalog</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeSubTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('hero')}
          >
            <ImageIcon size={14} />
            <span>Hero Card</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeSubTab === 'media' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubTab('media');
              fetchMediaAssets();
            }}
          >
            <ImageIcon size={14} />
            <span>Media Library</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeSubTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('requests')}
          >
            <Sparkles size={14} />
            <span>Bespoke Requests ({customRequests.length})</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeSubTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('orders')}
          >
            <ListOrdered size={14} />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={14} />
          <span>Exit Console</span>
        </button>
      </div>

      {/* KPI Stats Panel Overview */}
      <div className="admin-stats-summary-grid">
        <div className="admin-stat-card glass-panel">
          <span className="stat-label">CONSOLE STATUS</span>
          <strong className="stat-value text-green-glow">SECURE ENTRY</strong>
          <span className="stat-delta">✓ MongoDB & Cloudinary Live</span>
        </div>
        <div className="admin-stat-card glass-panel">
          <span className="stat-label">TOTAL REVENUE</span>
          <strong className="stat-value">${totalRevenue.toFixed(2)}</strong>
          <span className="stat-delta text-violet">Synchronized catalog sales</span>
        </div>
        <div className="admin-stat-card glass-panel">
          <span className="stat-label">BESPOKE DISPATCHES</span>
          <strong className="stat-value">{customRequests.length} REQUESTS</strong>
          <span className="stat-delta text-orange">Custom visual commissions</span>
        </div>
        <div className="admin-stat-card glass-panel">
          <span className="stat-label">CATALOG ARCHIVE</span>
          <strong className="stat-value">{products.length} COLLECTIBLES</strong>
          <span className="stat-delta">{products.filter(p => p.isDrop).length} Drop Releases</span>
        </div>
      </div>

      <div className="admin-content-layout">
        
        {/* TAB: Hero Card Editor */}
        {activeSubTab === 'hero' && (
          <div className="hero-editor-grid">

            {/* LEFT: Live Preview */}
            <div className="hero-preview-col">
              <span className="hero-preview-label">Live Preview</span>

              <div className="hero-preview-card">
                <div
                  className="hero-preview-img"
                  style={{ backgroundImage: `url('${heroCard.image || 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096506/axh_editions_static/hamilton_poster.png'}')` }}
                />
                <div className="hero-preview-gradient" />
                <div className="hero-preview-text">
                  <span className="hero-preview-cat">{heroCard.category || 'CATEGORY'}</span>
                  <span className="hero-preview-title">{heroCard.title || 'Title'}</span>
                  <span className="hero-preview-sub">{heroCard.subtitle || 'Subtitle'}</span>
                </div>
              </div>

              {/* Cloudinary indicator */}
              {heroCard.image && heroCard.image.includes('cloudinary.com') && (
                <div className="hero-cloudinary-badge">
                  <span className="dot-green" />
                  <span>Stored on Cloudinary</span>
                </div>
              )}
            </div>

            {/* RIGHT: Editor Form */}
            <div className="hero-editor-col glass-panel" style={{ padding: '2rem' }}>
              <div className="column-title-row">
                <h4>HERO CARD EDITOR</h4>
              </div>
              <p className="column-desc">Changes apply instantly on the home page. Image is uploaded to Cloudinary.</p>

              {/* Image upload */}
              <div className="hero-editor-section">
                <span className="hero-section-title">Poster Image</span>

                <div className="hero-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    disabled={heroUploading}
                  />
                  {heroUploading ? (
                    <Loader2 size={28} className="hero-upload-icon spinner-spin" />
                  ) : (
                    <Upload size={28} className="hero-upload-icon" />
                  )}
                  <div className="hero-upload-hint">
                    <strong>{heroUploading ? 'UPLOADING TO CLOUDINARY...' : 'CLICK TO UPLOAD IMAGE'}</strong>
                    JPG, PNG, WEBP — uploaded directly to Cloudinary
                  </div>
                </div>

                {heroFeedback && (
                  <span className={`hero-feedback ${heroFeedback.includes('failed') || heroFeedback.includes('Cannot') ? 'error' : ''}`}>
                    {heroFeedback}
                  </span>
                )}

                {heroCard.image && (
                  <div className="hero-current-url">
                    <strong style={{ color: 'var(--color-muted)', fontSize: '0.55rem', letterSpacing: '0.1em', display: 'block', marginBottom: '0.35rem' }}>CURRENT IMAGE URL</strong>
                    {heroCard.image}
                  </div>
                )}
              </div>

              {/* Text fields */}
              <div className="hero-editor-section">
                <span className="hero-section-title">Overlay Text</span>

                <div className="form-group">
                  <label className="crud-label">CATEGORY TAG</label>
                  <input
                    type="text"
                    className="crud-input-field"
                    value={heroCard.category || ''}
                    onChange={(e) => onHeroCardChange({ category: e.target.value })}
                    placeholder="e.g. MOTORSPORT COLLECTIBLE"
                  />
                </div>

                <div className="form-group">
                  <label className="crud-label">MAIN TITLE</label>
                  <input
                    type="text"
                    className="crud-input-field"
                    value={heroCard.title || ''}
                    onChange={(e) => onHeroCardChange({ title: e.target.value })}
                    placeholder={`e.g. LEWIS HAMILTON // "STILL WE RISE"`}
                  />
                </div>

                <div className="form-group">
                  <label className="crud-label">SUBTITLE / DROP LINE</label>
                  <input
                    type="text"
                    className="crud-input-field"
                    value={heroCard.subtitle || ''}
                    onChange={(e) => onHeroCardChange({ subtitle: e.target.value })}
                    placeholder="e.g. DROP 001 // SIGNATURE EDITION"
                  />
                </div>
              </div>

              {/* Reset to default */}
              <button
                className="cancel-pill-btn"
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                onClick={() => onHeroCardChange({
                  image: 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096506/axh_editions_static/hamilton_poster.png',
                  category: 'MOTORSPORT COLLECTIBLE',
                  title: 'LEWIS HAMILTON // "STILL WE RISE"',
                  subtitle: 'DROP 001 // SIGNATURE EDITION',
                })}
              >
                Reset to Default
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: Manage Catalog CRUD with custom image upload from device */}
        {activeSubTab === 'catalog' && (
          <div className="catalog-crud-grid">
            
            {/* CRUD Form */}
            <div className="crud-form-column glass-panel">
              <div className="column-title-row">
                <h4>{isEditing ? 'EDIT COLLECTIBLE' : 'ADD NEW COLLECTIBLE'}</h4>
                {isEditing && <button className="cancel-pill-btn" onClick={resetForm}>Reset Form</button>}
              </div>
              <p className="column-desc">Specify details to publish the artifact to MongoDB database catalog.</p>
              
              <form onSubmit={handleSaveProduct} className="crud-specs-form">
                <div className="form-group">
                  <label className="crud-label">COLLECTIBLE NAME</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Monza Speed Silhouette" 
                    className="crud-input-field" 
                    required 
                  />
                </div>

                <div className="form-row-group">
                  <div className="form-group flex-1">
                    <label className="crud-label">CATEGORY</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="crud-select"
                    >
                      <option value="posters">Posters</option>
                      <option value="framed">Framed Editions</option>
                      <option value="stickers">Sticker Packs</option>
                      <option value="custom">Custom Artwork</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label className="crud-label">GENRE CATEGORY</label>
                    <select 
                      value={genre} 
                      onChange={(e) => setGenre(e.target.value)} 
                      className="crud-select"
                    >
                      <option value="MOTORSPORT">MOTORSPORT</option>
                      <option value="FOOTBALL">FOOTBALL</option>
                      <option value="MUSIC">MUSIC</option>
                      <option value="GAMING">GAMING</option>
                      <option value="FASHION">FASHION</option>
                      <option value="CINEMA">CINEMA</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-group">
                  <div className="form-group flex-1">
                    <label className="crud-label">BASE PRICE ($)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      placeholder="45" 
                      className="crud-input-field" 
                      required 
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label className="crud-label">STOCK LEVEL</label>
                    <input 
                      type="number" 
                      value={stock} 
                      onChange={(e) => setStock(e.target.value)} 
                      placeholder="15" 
                      className="crud-input-field" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="crud-label">SERIAL CODE / LOGS</label>
                  <input 
                    type="text" 
                    value={serial} 
                    onChange={(e) => setSerial(e.target.value)} 
                    placeholder="DROP 001 / ITEM 05" 
                    className="crud-input-field" 
                  />
                </div>

                {/* Cloudinary Device Image Uploader Component */}
                <div className="form-group image-upload-group-box">
                  <label className="crud-label">IMAGE ASSET SOURCE</label>
                  
                  <div className="uploader-flex-row">
                    <div className="upload-btn-wrapper">
                      <button type="button" className="btn-secondary upload-form-btn">
                        <Upload size={14} />
                        <span>{uploadingImage ? 'UPLOADING...' : 'UPLOAD FILE'}</span>
                      </button>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden-file-input" 
                        disabled={uploadingImage}
                      />
                    </div>
                    
                    <span className="or-divider-span">OR</span>
                    
                    <input 
                      type="text" 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)} 
                      placeholder="PASTE IMAGE URL DIRECTLY" 
                      className="crud-input-field flex-1" 
                    />
                  </div>

                  {uploadingImage && (
                    <div className="upload-loader-indicator">
                      <Loader2 size={14} className="spinner-spin text-orange" />
                      <span>Transmitting payload to Cloudinary...</span>
                    </div>
                  )}

                  {/* Fully operational interactive uploader thumbnail preview */}
                  {image && (
                    <div className="uploaded-preview-container-box">
                      <div className="preview-image-frame" style={{ backgroundImage: `url(${image})` }}></div>
                      <div className="preview-details-col">
                        <span className="secure-badge-indicator">✓ CLOUDINARY ASSET SECURED</span>
                        <a href={image} target="_blank" rel="noopener noreferrer" className="preview-link-anchor">
                          Open in New Tab →
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="crud-label">EDITORIAL DESCRIPTION</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Archival specifications details..." 
                    className="crud-textarea" 
                    required 
                  />
                </div>

                <div className="checkbox-row">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={isDrop} 
                      onChange={(e) => setIsDrop(e.target.checked)} 
                    />
                    <span>Is Curated Drop Release?</span>
                  </label>

                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={isFeatured} 
                      onChange={(e) => setIsFeatured(e.target.checked)} 
                    />
                    <span>Is Featured Homepage?</span>
                  </label>
                </div>

                {formFeedback && <p className="crud-feedback-banner">{formFeedback}</p>}

                <div className="crud-action-buttons-row">
                  <button type="submit" className="btn-primary form-save-btn" disabled={uploadingImage}>
                    {isEditing ? 'UPDATE ARTIFACT' : 'CREATE ARTIFACT'}
                  </button>
                </div>
              </form>
            </div>

            {/* List Catalog Columns */}
            <div className="catalog-list-column glass-panel">
              <h4>ACTIVE CATALOG OVERVIEW</h4>
              <p className="column-desc">List of all active posters and sticker packs in MongoDB.</p>

              <div className="admin-items-table-scroller">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>IMAGE</th>
                      <th>COLLECTIBLE</th>
                      <th>SPECS</th>
                      <th>PRICE</th>
                      <th>STOCK</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <div 
                            className="table-thumb" 
                            style={{ backgroundImage: `url(${prod.image})` }}
                          ></div>
                        </td>
                        <td>
                          <div className="table-name-wrapper">
                            <span className="table-serial">{prod.serial}</span>
                            <strong className="prod-title-semibold">{prod.name}</strong>
                            <span className="table-cat-badge">{prod.category}</span>
                          </div>
                        </td>
                        <td>
                          <div className="table-spec-column">
                            <span>{prod.genre}</span>
                            <span className="badge-drop">{prod.isDrop ? 'DROP' : 'CORE'}</span>
                          </div>
                        </td>
                        <td><strong>${prod.price}</strong></td>
                        <td>
                          <span className={`stock-indicator ${prod.stock < 5 ? 'critical' : ''}`}>
                            {prod.stock} left
                          </span>
                        </td>
                        <td>
                          <div className="table-actions-group">
                            <button className="action-icon-btn edit" onClick={() => handleEditClick(prod)}>
                              <Edit2 size={12} />
                            </button>
                            <button className="action-icon-btn delete" onClick={() => handleDeleteClick(prod.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB: Cloudinary Media Library */}
        {activeSubTab === 'media' && (
          <div className="admin-media-panel glass-panel animate-fade-in" style={{ width: '100%' }}>
            <div className="column-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4>CLOUDINARY STORAGE & MEDIA LIBRARY</h4>
              <button 
                className="cancel-pill-btn" 
                onClick={fetchMediaAssets}
                disabled={fetchingMedia}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {fetchingMedia ? <Loader2 size={12} className="spinner-spin" /> : null}
                <span>REFRESH LIBRARY</span>
              </button>
            </div>
            <p className="column-desc" style={{ marginBottom: '2rem' }}>
              All uploaded visual assets stored securely in your Cloudinary <code>axh_editions</code> folder. Copy any secure URL or directly inject it into the product form.
            </p>

            {/* Direct Image Uploader inside Media Library */}
            <div className="media-direct-uploader-box" style={{ background: 'rgba(9, 8, 13, 0.3)', border: '1px dashed rgba(245, 243, 239, 0.08)', padding: '2rem', marginBottom: '2.5rem', textAlign: 'center', position: 'relative' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleMediaLibraryUpload} 
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                disabled={mediaUploading}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                {mediaUploading ? (
                  <Loader2 size={32} className="spinner-spin" style={{ color: 'var(--color-orange)' }} />
                ) : (
                  <Upload size={32} style={{ color: 'var(--color-violet)' }} />
                )}
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-ivory)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {mediaUploading ? 'TRANSMITTING ASSET PAYLOAD...' : 'DRAG & DROP OR CLICK TO UPLOAD'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    JPG, PNG, WEBP — assets are saved directly inside your secure <code>axh_editions</code> folder
                  </span>
                </div>
              </div>
            </div>

            {mediaFeedback && (
              <div style={{
                background: mediaFeedback.includes('✓') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 82, 82, 0.1)',
                border: `1px solid ${mediaFeedback.includes('✓') ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 82, 82, 0.2)'}`,
                color: mediaFeedback.includes('✓') ? '#4caf50' : '#ff5252',
                padding: '1rem',
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                marginBottom: '2rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600
              }}>
                {mediaFeedback}
              </div>
            )}

            {fetchingMedia && mediaAssets.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', gap: '1rem', color: 'var(--color-muted)' }}>
                <Loader2 size={36} className="spinner-spin text-orange" />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.2em' }}>SYNCHRONIZING WITH CLOUDINARY...</span>
              </div>
            ) : mediaAssets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-muted)', border: '1px solid rgba(245, 243, 239, 0.03)', background: 'rgba(17, 19, 38, 0.1)' }}>
                No assets detected in the <code>axh_editions</code> folder. Try uploading a new visual asset above!
              </div>
            ) : (
              <div className="media-assets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                {mediaAssets.map((asset) => {
                  const isCopied = mediaCopiedId === asset.public_id;
                  return (
                    <div 
                      key={asset.public_id} 
                      className="media-asset-card glass-panel" 
                      style={{ 
                        background: 'rgba(17, 19, 38, 0.2)', 
                        border: '1px solid rgba(245, 243, 239, 0.04)', 
                        display: 'flex', 
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s'
                      }}
                    >
                      {/* Image Thumbnail Frame */}
                      <div 
                        className="media-thumb-frame" 
                        style={{ 
                          width: '100%', 
                          aspectRatio: '1', 
                          backgroundImage: `url(${asset.secure_url})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center',
                          borderBottom: '1px solid rgba(245, 243, 239, 0.04)',
                          position: 'relative'
                        }}
                      >
                        {/* Overlay with info */}
                        <div className="media-hover-overlay" style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(9, 8, 13, 0.85)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '0.8rem',
                          padding: '1.25rem'
                        }}>
                          <button 
                            onClick={() => selectAssetForProductForm(asset.secure_url)}
                            className="btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.65rem', width: '100%', justifyContent: 'center' }}
                          >
                            INSERT INTO FORM
                          </button>
                          <button 
                            onClick={() => copyToClipboard(asset.secure_url, asset.public_id)}
                            className="btn-secondary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.65rem', width: '100%', justifyContent: 'center', border: '1px solid rgba(123, 115, 217, 0.3)', color: 'var(--color-violet)' }}
                          >
                            {isCopied ? '✓ COPIED' : 'COPY SECURE URL'}
                          </button>
                        </div>
                      </div>

                      {/* Details row */}
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.52rem', fontFamily: 'var(--font-sans)', color: 'var(--color-violet)', fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          ID: {asset.public_id.replace('axh_editions/', '')}
                        </span>
                        <strong style={{ fontSize: '0.7rem', color: 'var(--color-ivory)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {asset.width}x{asset.height} px // {asset.format.toUpperCase()}
                        </strong>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>
                          Uploaded: {new Date(asset.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Copied Banner Overlay */}
                      {isCopied && (
                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: '#4caf50',
                          color: '#fff',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.5rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                          zIndex: 5
                        }}>
                          LINK COPIED!
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Inject hover effect CSS */}
            <style>{`
              .media-asset-card:hover {
                transform: translateY(-4px);
                border-color: rgba(123, 115, 217, 0.3) !important;
                box-shadow: 0 10px 25px rgba(0,0,0,0.4);
              }
              .media-asset-card:hover .media-hover-overlay {
                opacity: 1 !important;
              }
            `}</style>
          </div>
        )}

        {/* TAB 2: Custom Bespoke Artwork Requests */}
        {activeSubTab === 'requests' && (
          <div className="admin-logs-panel glass-panel animate-fade-in">
            <h4>BESPOKE CUSTOM COMMISSIONS LOGS</h4>
            <p className="column-desc">Visual requests and personalized Vision Details submitted by users.</p>

            <div className="logs-scroller">
              {customRequests.length === 0 ? (
                <div className="no-logs">No custom commissions requests logged in database.</div>
              ) : (
                <div className="requests-grid">
                  {customRequests.map((req) => (
                    <div key={req.requestId} className="request-log-card glass-panel">
                      <div className="req-header">
                        <span className="req-id">{req.requestId}</span>
                        <span className="req-date">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="req-body">
                        <strong>THEME: {req.theme?.toUpperCase()}</strong>
                        <p className="req-details">"{req.details}"</p>
                        <div className="req-specs-meta">
                          <span>SIZE: {req.size}</span>
                          <span>MOUNTING: {req.framed ? 'Framed Edition' : 'Unframed Print'}</span>
                          <strong className="req-price">${req.price}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Completed E-Commerce Orders */}
        {activeSubTab === 'orders' && (
          <div className="admin-logs-panel glass-panel animate-fade-in">
            <h4>CUSTOMER TRANSACTIONS</h4>
            <p className="column-desc">Order records, purchased artifacts, and logistics shipping coordinates.</p>

            <div className="logs-scroller">
              {orders.length === 0 ? (
                <div className="no-logs">No transaction logs registered.</div>
              ) : (
                <div className="orders-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ORDER ID</th>
                        <th>DATE</th>
                        <th>CUSTOMER DETAILS</th>
                        <th>PURCHASED ITEMS</th>
                        <th>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord.orderId}>
                          <td><strong className="color-orange">{ord.orderId}</strong></td>
                          <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="cust-cell">
                              <strong>{ord.customer?.name}</strong>
                              <span>{ord.customer?.email}</span>
                              <span className="cust-addr">{ord.customer?.address}</span>
                            </div>
                          </td>
                          <td>
                            <div className="order-items-cell">
                              {ord.items?.map((item, idx) => (
                                <div key={idx} className="order-sub-item">
                                  • {item.name} ({item.size}) x{item.quantity}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td><strong>${ord.total?.toFixed(2)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <style>{`
        .admin-dashboard-container {
          max-width: 1400px;
          margin: 100px auto 6rem auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Top Header Bar */
        .admin-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2.5rem;
          background: rgba(17, 19, 38, 0.45);
          border-color: rgba(245, 243, 239, 0.06);
          border-radius: 0px !important;
        }

        .admin-brand-logo {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.35rem;
          letter-spacing: 0.1em;
          color: var(--color-ivory);
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .admin-brand-logo .sub-logo {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          color: var(--color-violet);
          letter-spacing: 0.2em;
          font-weight: 600;
        }

        .admin-sub-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .admin-tab-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--color-muted);
          padding: 0.65rem 1.35rem;
          border-radius: 0px !important;
          font-family: var(--font-serif);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .admin-tab-btn:hover {
          color: var(--color-ivory);
          background: rgba(245, 243, 239, 0.02);
        }

        .admin-tab-btn.active {
          background: rgba(123, 115, 217, 0.08);
          border-color: rgba(123, 115, 217, 0.2);
          color: var(--color-violet);
          font-weight: 600;
        }

        .admin-logout-btn {
          background: none;
          border: 1px solid rgba(255, 82, 82, 0.15);
          color: #ff5252;
          padding: 0.6rem 1.25rem;
          border-radius: 0px !important;
          font-family: var(--font-serif);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .admin-logout-btn:hover {
          background: rgba(255, 82, 82, 0.08);
        }

        /* KPI Stats summary panel grid */
        .admin-stats-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .admin-stat-card {
          padding: 1.5rem 2rem;
          background: rgba(17, 19, 38, 0.25);
          border: 1px solid rgba(245, 243, 239, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          border-radius: 0px !important;
        }

        .stat-label {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 600;
          color: var(--color-muted);
          letter-spacing: 0.1em;
        }

        .stat-value {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--color-ivory);
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .stat-value.text-green-glow {
          color: #4caf50;
          text-shadow: 0 0 10px rgba(76, 175, 80, 0.2);
        }

        .stat-delta {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          color: var(--color-muted);
        }

        /* Layout Grid for CRUD */
        .catalog-crud-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 2rem;
        }

        .crud-form-column, .catalog-list-column, .admin-logs-panel {
          padding: 2.5rem;
          background: rgba(17, 19, 38, 0.25);
          border: 1px solid rgba(245, 243, 239, 0.04);
          border-radius: 0px !important;
        }

        .column-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cancel-pill-btn {
          background: rgba(245, 243, 239, 0.04);
          border: 1px solid rgba(245, 243, 239, 0.1);
          color: var(--color-ivory);
          font-family: var(--font-serif);
          font-size: 0.7rem;
          padding: 0.35rem 0.8rem;
          cursor: pointer;
          transition: var(--transition-fast);
          border-radius: 0px !important;
        }

        .cancel-pill-btn:hover {
          border-color: var(--color-orange);
          color: var(--color-orange);
        }

        .crud-form-column h4, .catalog-list-column h4, .admin-logs-panel h4 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          letter-spacing: 0.05em;
          color: var(--color-ivory);
        }

        .column-desc {
          font-size: 0.8rem;
          color: var(--color-muted);
          margin-bottom: 2.25rem;
        }

        .crud-specs-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .crud-label {
          font-family: var(--font-serif);
          font-size: 0.7rem;
          color: var(--color-muted);
          letter-spacing: 0.12em;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
        }

        .crud-input-field, .crud-select {
          width: 100%;
          background: rgba(9, 8, 13, 0.5);
          border: 1px solid rgba(245, 243, 239, 0.08);
          color: var(--color-ivory);
          padding: 0.85rem 1.1rem;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          outline: none;
          transition: var(--transition-fast);
          border-radius: 0px !important;
        }

        .crud-input-field:focus, .crud-select:focus {
          border-color: var(--color-violet);
        }

        .crud-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23f5f3ef' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .form-row-group {
          display: flex;
          gap: 1.25rem;
        }

        /* Uploader Styles */
        .image-upload-group-box {
          border: 1px dashed rgba(245, 243, 239, 0.08);
          padding: 1.5rem;
          background: rgba(9, 8, 13, 0.2);
          border-radius: 0px !important;
        }

        .uploader-flex-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .upload-btn-wrapper {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }

        .upload-form-btn {
          border-color: rgba(123, 115, 217, 0.25);
          color: var(--color-violet);
          padding: 0.8rem 1.25rem;
          font-size: 0.75rem;
          border-radius: 0px !important;
        }

        .upload-form-btn:hover {
          background: rgba(123, 115, 217, 0.06);
        }

        .hidden-file-input {
          font-size: 100px;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          cursor: pointer;
        }

        .or-divider-span {
          font-family: var(--font-serif);
          font-size: 0.7rem;
          color: rgba(245, 243, 239, 0.2);
          font-weight: 600;
        }

        .upload-loader-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--color-orange);
          margin-top: 1rem;
        }

        .text-orange {
          color: var(--color-orange);
        }

        .uploaded-preview-container-box {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 1.25rem;
          padding: 1rem;
          background: rgba(9, 8, 13, 0.4);
          border: 1px solid rgba(123, 115, 217, 0.15);
          border-radius: 0px !important;
        }

        .preview-image-frame {
          width: 50px;
          aspect-ratio: 3/4;
          background-size: cover;
          background-position: center;
          border: 1px solid rgba(245, 243, 239, 0.1);
        }

        .preview-details-col {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .secure-badge-indicator {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--color-violet);
          letter-spacing: 0.05em;
        }

        .preview-link-anchor {
          font-family: var(--font-serif);
          font-size: 0.75rem;
          color: var(--color-muted);
          text-decoration: none;
          transition: var(--transition-fast);
        }

        .preview-link-anchor:hover {
          color: var(--color-ivory);
          text-decoration: underline;
        }

        .crud-textarea {
          background: rgba(9, 8, 13, 0.5);
          border: 1px solid rgba(245, 243, 239, 0.08);
          color: var(--color-ivory);
          padding: 1rem;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 300;
          min-height: 120px;
          resize: vertical;
          outline: none;
          transition: var(--transition-fast);
          border-radius: 0px !important;
        }

        .crud-textarea:focus {
          border-color: var(--color-violet);
        }

        .checkbox-row {
          display: flex;
          gap: 2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--color-muted);
          cursor: pointer;
        }

        .checkbox-label input {
          accent-color: var(--color-violet);
        }

        .crud-feedback-banner {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: var(--color-violet);
        }

        .crud-action-buttons-row {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .form-save-btn {
          flex: 1;
          justify-content: center;
          padding: 1rem;
          border-radius: 0px !important;
        }

        /* Items Table List */
        .admin-items-table-scroller {
          max-height: 600px;
          overflow-y: auto;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          border: 1px solid rgba(245, 243, 239, 0.04);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th {
          font-family: var(--font-serif);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--color-muted);
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
          background: rgba(9, 8, 13, 0.2);
        }

        .admin-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(245, 243, 239, 0.03);
          font-size: 0.85rem;
          vertical-align: middle;
        }

        .table-thumb {
          width: 44px;
          aspect-ratio: 3/4;
          background-size: cover;
          background-position: center;
          background-color: #111;
          border: 1px solid rgba(245, 243, 239, 0.05);
          border-radius: 0px !important;
        }

        .table-name-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .prod-title-semibold {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          color: var(--color-ivory);
          font-weight: 600;
        }

        .table-serial {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          color: var(--color-muted);
          letter-spacing: 0.05em;
        }

        .table-cat-badge {
          align-self: flex-start;
          font-family: var(--font-sans);
          font-size: 0.55rem;
          font-weight: 600;
          color: var(--color-violet);
          border: 1px solid rgba(123, 115, 217, 0.2);
          padding: 0.1rem 0.35rem;
          margin-top: 0.25rem;
          text-transform: uppercase;
        }

        .table-spec-column {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .badge-drop {
          align-self: flex-start;
          font-family: var(--font-sans);
          font-size: 0.55rem;
          background: rgba(200, 107, 58, 0.08);
          color: var(--color-orange);
          padding: 0.1rem 0.35rem;
          font-weight: 600;
        }

        .stock-indicator.critical {
          color: #ff5252;
          font-weight: 600;
        }

        .table-actions-group {
          display: flex;
          gap: 0.5rem;
        }

        .action-icon-btn {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(245, 243, 239, 0.08);
          background: rgba(245, 243, 239, 0.02);
          color: var(--color-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          border-radius: 0px !important;
        }

        .action-icon-btn.edit:hover {
          border-color: var(--color-violet);
          color: var(--color-violet);
          background: rgba(123, 115, 217, 0.05);
        }

        .action-icon-btn.delete:hover {
          border-color: #ff5252;
          color: #ff5252;
          background: rgba(255, 82, 82, 0.05);
        }

        /* Bespoke Logs */
        .logs-scroller {
          max-height: 600px;
          overflow-y: auto;
        }

        .no-logs {
          padding: 6rem;
          text-align: center;
          color: var(--color-muted);
          font-family: var(--font-serif);
          font-size: 1.1rem;
        }

        .requests-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.5rem;
        }

        .request-log-card {
          padding: 2rem;
          background: rgba(9, 8, 13, 0.25);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border: 1px solid rgba(245, 243, 239, 0.04);
          border-radius: 0px !important;
        }

        .req-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
          padding-bottom: 0.75rem;
        }

        .req-id {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-orange);
          letter-spacing: 0.05em;
        }

        .req-date {
          font-size: 0.8rem;
          color: var(--color-muted);
        }

        .req-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .req-body strong {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          color: var(--color-ivory);
          letter-spacing: 0.05em;
        }

        .req-details {
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-muted);
          background: rgba(9, 8, 13, 0.4);
          padding: 1rem;
          border: 1px solid rgba(245, 243, 239, 0.03);
          border-radius: 0px !important;
        }

        .req-specs-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--color-muted);
          border-top: 1px solid rgba(245, 243, 239, 0.03);
          padding-top: 0.75rem;
        }

        .req-price {
          color: var(--color-ivory);
          font-weight: 600;
        }

        /* Orders logs styles */
        .orders-table-wrapper {
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          border: 1px solid rgba(245, 243, 239, 0.04);
        }

        .cust-cell {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .cust-cell span {
          color: var(--color-muted);
          font-size: 0.8rem;
        }

        .cust-cell .cust-addr {
          font-size: 0.75rem;
          margin-top: 0.25rem;
          color: var(--color-violet);
        }

        .order-items-cell {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .order-sub-item {
          font-size: 0.8rem;
          color: var(--color-muted);
        }

        .color-orange {
          color: var(--color-orange);
        }

        /* ── Hero Card Editor ───────────────────────── */
        .hero-editor-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 3rem;
          align-items: start;
        }

        .hero-preview-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: sticky;
          top: 2rem;
        }

        .hero-preview-label {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--color-muted);
          text-transform: uppercase;
          border-bottom: 1px solid rgba(245,243,239,0.06);
          padding-bottom: 0.75rem;
        }

        .hero-preview-card {
          position: relative;
          aspect-ratio: 3/4;
          max-width: 260px;
          background: #151419;
          border: 8px solid #000;
          overflow: hidden;
        }

        .hero-preview-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
        }

        .hero-preview-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(9,8,13,0.95) 100%);
        }

        .hero-preview-text {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          right: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .hero-preview-cat {
          font-family: var(--font-sans);
          font-size: 0.45rem;
          letter-spacing: 0.22em;
          color: var(--color-orange);
          font-weight: 700;
          text-transform: uppercase;
        }

        .hero-preview-title {
          font-family: var(--font-serif);
          font-size: 0.75rem;
          color: var(--color-ivory);
          line-height: 1.25;
        }

        .hero-preview-sub {
          font-family: var(--font-sans);
          font-size: 0.5rem;
          color: var(--color-muted);
          letter-spacing: 0.05em;
        }

        .hero-cloudinary-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-sans);
          font-size: 0.6rem;
          color: #4caf50;
          letter-spacing: 0.05em;
        }

        .hero-cloudinary-badge .dot-green {
          width: 5px;
          height: 5px;
          background: #4caf50;
          border-radius: 50%;
          box-shadow: 0 0 6px #4caf50;
          flex-shrink: 0;
        }

        .hero-editor-col {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .hero-editor-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .hero-section-title {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--color-muted);
          text-transform: uppercase;
          border-bottom: 1px solid rgba(245,243,239,0.06);
          padding-bottom: 0.75rem;
        }

        .hero-upload-zone {
          border: 1px dashed rgba(123,115,217,0.3);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: border-color 0.3s ease, background 0.3s ease;
          background: rgba(123,115,217,0.02);
          position: relative;
        }

        .hero-upload-zone:hover {
          border-color: rgba(123,115,217,0.6);
          background: rgba(123,115,217,0.05);
        }

        .hero-upload-zone input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .hero-upload-icon {
          color: var(--color-violet);
          opacity: 0.7;
        }

        .hero-upload-hint {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          color: var(--color-muted);
          text-align: center;
          line-height: 1.6;
        }

        .hero-upload-hint strong {
          color: var(--color-violet);
          display: block;
          margin-bottom: 0.2rem;
          letter-spacing: 0.1em;
        }

        .hero-current-url {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          color: var(--color-muted);
          word-break: break-all;
          background: rgba(245,243,239,0.03);
          border: 1px solid rgba(245,243,239,0.06);
          padding: 0.6rem 0.8rem;
          border-left: 2px solid var(--color-violet);
        }

        .hero-feedback {
          font-family: var(--font-sans);
          font-size: 0.68rem;
          color: var(--color-violet);
          min-height: 1.2em;
          letter-spacing: 0.05em;
        }

        .hero-feedback.error {
          color: #ff5252;
        }

        @media (max-width: 1024px) {
          .hero-editor-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .hero-preview-col {
            position: static;
            align-items: center;
            text-align: center;
          }
          .hero-preview-card {
            margin: 0 auto;
            max-width: 220px;
          }
          .admin-stats-summary-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .catalog-crud-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .requests-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .admin-dashboard-container {
            margin-top: 80px;
            padding: 0 1.25rem;
            gap: 1.5rem;
          }
          .admin-header-row {
            padding: 1.25rem;
            flex-direction: column;
            gap: 1.25rem;
            align-items: stretch;
          }
          .admin-sub-tabs {
            overflow-x: auto;
            white-space: nowrap;
            display: flex;
            width: 100%;
            padding-bottom: 0.5rem;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-x: contain;
            scrollbar-width: none;
            gap: 0.25rem;
          }
          .admin-sub-tabs::-webkit-scrollbar {
            display: none;
          }
          .admin-tab-btn {
            flex-shrink: 0;
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }
          .admin-logout-btn {
            align-self: flex-start;
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }
          .admin-table {
            min-width: 650px;
          }
          .orders-table-wrapper .admin-table {
            min-width: 750px;
          }
          .crud-form-column, .catalog-list-column, .admin-logs-panel {
            padding: 1.75rem 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .admin-stats-summary-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .admin-stat-card {
            padding: 1rem;
            gap: 0.2rem;
          }
          .stat-value {
            font-size: 1.15rem;
          }
          .stat-delta {
            font-size: 0.65rem;
          }
          .form-row-group {
            flex-direction: column;
            gap: 1.75rem;
          }
          .uploader-flex-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .or-divider-span {
            text-align: center;
            margin: 0.15rem 0;
          }
          .checkbox-row {
            flex-direction: column;
            gap: 1rem;
          }
          .column-desc {
            margin-bottom: 1.5rem;
          }
          .req-specs-meta {
            flex-direction: column;
            gap: 0.4rem;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .cinematic-login-wrapper {
            padding: 2.5rem 1.5rem 2rem 1.5rem;
          }
          .premium-system-title {
            font-size: 1.75rem;
          }
          .premium-console-pitch {
            font-size: 0.78rem;
            margin-top: 0.75rem;
          }
          .premium-console-input {
            padding: 0.95rem 1.1rem;
          }
          .premium-login-pay-btn {
            padding: 0.95rem;
          }
          .telemetry-bar-row {
            margin-top: 1.5rem;
            padding-top: 1.25rem;
          }
          .demologin-helper-badge {
            margin-top: 1.5rem;
            padding-top: 1rem;
            flex-direction: column;
            gap: 0.25rem;
            text-align: center;
          }
          .admin-stats-summary-grid {
            grid-template-columns: 1fr;
          }
        }

      `}</style>
    </section>
  );
}
