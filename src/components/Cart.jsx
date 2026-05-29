import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ShieldAlert } from 'lucide-react';

export default function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckoutClick }) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percentage
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const code = couponCode.trim().toUpperCase();
    if (code === 'COLLECTOR10') {
      setAppliedDiscount(10);
      setCouponSuccess('10% Collector discount applied successfully!');
    } else if (code === 'WELCOME20') {
      setAppliedDiscount(20);
      setCouponSuccess('20% New Collector discount applied successfully!');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME20 or COLLECTOR10');
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shippingFee = subtotal > 150 ? 0 : subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal - discountAmount + shippingFee;

  return (
    <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="header-title-wrapper">
            <h3>YOUR COLLECTION</h3>
            <span className="cart-items-count">{cartItems.length} ITEMS</span>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <span className="empty-logo">AXH</span>
              <p>Your collection bag is empty.</p>
              <button className="btn-secondary" onClick={onClose}>
                BROWSE EDITIONS
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div 
                    className="cart-item-thumbnail"
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  
                  <div className="cart-item-details">
                    <div className="item-header-row">
                      <span className="item-genre">{item.category?.toUpperCase() || 'COLLECTIBLE'}</span>
                      <button className="item-remove-btn" onClick={() => onRemoveItem(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-specs">
                      {item.size || 'A3'} • {item.framed ? 'Framed Edition' : 'Archival Print'}
                    </p>
                    
                    <div className="item-pricing-row">
                      <div className="item-quantity-toggle">
                        <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={12} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="item-price-total">${item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Pricing & Checkout) */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <div className="coupon-input-wrapper">
                <Tag size={14} className="coupon-icon" />
                <input
                  type="text"
                  placeholder="COUPON (try: WELCOME20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button type="submit" className="coupon-submit-btn">APPLY</button>
              </div>
              {couponError && <p className="coupon-feedback error">{couponError}</p>}
              {couponSuccess && <p className="coupon-feedback success">{couponSuccess}</p>}
            </form>

            {/* Pricing Summary */}
            <div className="pricing-summary-block">
              <div className="summary-row">
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="summary-row discount-glow">
                  <span>DISCOUNT ({appliedDiscount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>SHIPPING</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              {shippingFee > 0 && (
                <div className="free-shipping-tip">
                  Add <span style={{ color: 'var(--color-violet)' }}>${(150 - subtotal).toFixed(2)}</span> more for Free Shipping
                </div>
              )}
              <div className="summary-row total-row">
                <span>TOTAL</span>
                <span className="grand-total-amount">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              className="btn-primary checkout-btn"
              onClick={() => onCheckoutClick(grandTotal, appliedDiscount)}
            >
              PROCEED TO SECURE CHECKOUT
            </button>
            <div className="checkout-guarantee">
              <ShieldAlert size={12} />
              <span>Secure transaction encrypted by Stripe standard security</span>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .cart-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.75);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cart-overlay.active {
          opacity: 1;
          pointer-events: all;
        }

        .cart-drawer {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 440px;
          background: var(--color-black);
          border-left: 1px solid rgba(245, 243, 239, 0.08);
          display: flex;
          flex-direction: column;
          box-shadow: -20px 0 50px rgba(0, 0, 0, 0.6);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cart-overlay.active .cart-drawer {
          transform: translateX(0);
        }

        /* Drawer Header */
        .cart-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-title-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .header-title-wrapper h3 {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--color-ivory);
          letter-spacing: 0.05em;
        }

        .cart-items-count {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          color: var(--color-violet);
          font-weight: 600;
          letter-spacing: 0.1em;
        }

        .cart-close-btn {
          background: none;
          border: none;
          color: var(--color-muted);
          cursor: pointer;
          transition: color 0.2s ease, background-color 0.2s ease;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-close-btn:hover {
          color: var(--color-ivory);
          background: rgba(245, 243, 239, 0.05);
        }

        /* Drawer Body */
        .cart-body {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }

        .empty-cart-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          height: 100%;
          text-align: center;
        }

        .empty-logo {
          font-family: var(--font-serif);
          font-size: 2rem;
          letter-spacing: 0.2em;
          color: rgba(245, 243, 239, 0.1);
        }

        /* Items List */
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cart-item-card {
          display: flex;
          gap: 1.25rem;
          background: rgba(245, 243, 239, 0.02);
          border: 1px solid rgba(245, 243, 239, 0.04);
          padding: 1rem;
          border-radius: 8px;
        }

        .cart-item-thumbnail {
          width: 75px;
          aspect-ratio: 3/4;
          background-size: cover;
          background-position: center;
          background-color: #111;
          border-radius: 4px;
          border: 1px solid rgba(245, 243, 239, 0.05);
        }

        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .item-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-genre {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 600;
          color: var(--color-orange);
          letter-spacing: 0.15em;
        }

        .item-remove-btn {
          background: none;
          border: none;
          color: rgba(245, 243, 239, 0.3);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .item-remove-btn:hover {
          color: var(--color-orange);
        }

        .item-name {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          color: var(--color-ivory);
        }

        .item-specs {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: var(--color-muted);
        }

        .item-pricing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }

        .item-quantity-toggle {
          display: flex;
          align-items: center;
          background: rgba(9, 8, 13, 0.5);
          border: 1px solid rgba(245, 243, 239, 0.08);
          border-radius: 0px !important;
          padding: 0.2rem;
        }

        .qty-btn {
          background: none;
          border: none;
          color: var(--color-muted);
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0px !important;
        }

        .qty-btn:hover {
          color: var(--color-ivory);
          background: rgba(245, 243, 239, 0.05);
        }

        .qty-val {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          width: 20px;
          text-align: center;
        }

        .item-price-total {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-ivory);
        }

        /* Drawer Footer */
        .cart-footer {
          padding: 1.5rem 2rem 2.5rem 2rem;
          border-top: 1px solid rgba(245, 243, 239, 0.05);
          background: rgba(9, 8, 13, 0.8);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .coupon-form {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .coupon-input-wrapper {
          display: flex;
          align-items: center;
          background: rgba(245, 243, 239, 0.02);
          border: 1px solid rgba(245, 243, 239, 0.08);
          border-radius: 0px !important;
          padding: 0.25rem 0.5rem 0.25rem 0.75rem;
        }

        .coupon-icon {
          color: var(--color-muted);
        }

        .coupon-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--color-ivory);
          font-family: var(--font-sans);
          font-size: 0.75rem;
          padding: 0.5rem;
        }

        .coupon-submit-btn {
          background: var(--color-indigo);
          border: none;
          color: var(--color-ivory);
          padding: 0.4rem 0.8rem;
          border-radius: 0px !important;
          font-family: var(--font-serif);
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .coupon-submit-btn:hover {
          background: var(--color-violet);
        }

        .coupon-feedback {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          margin-top: 0.1rem;
        }

        .coupon-feedback.error {
          color: #ff5252;
        }

        .coupon-feedback.success {
          color: #4caf50;
        }

        /* Pricing Summary block */
        .pricing-summary-block {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          border-top: 1px solid rgba(245, 243, 239, 0.04);
          border-bottom: 1px solid rgba(245, 243, 239, 0.04);
          padding: 1rem 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-serif);
          font-size: 0.8rem;
          color: var(--color-muted);
        }

        .discount-glow {
          color: var(--color-violet);
          font-weight: 600;
        }

        .free-shipping-tip {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          color: var(--color-muted);
          text-align: center;
          margin-top: -0.2rem;
        }

        .total-row {
          font-size: 1rem;
          color: var(--color-ivory);
          font-weight: 600;
          margin-top: 0.25rem;
        }

        .grand-total-amount {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 700;
        }

        .checkout-btn {
          width: 100%;
          justify-content: center;
          padding: 1rem;
          border-radius: 0px !important;
          font-size: 0.8rem;
        }

        .checkout-guarantee {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          color: var(--color-muted);
          font-size: 0.65rem;
        }

        @media (max-width: 480px) {
          .cart-drawer {
            max-width: 100%;
          }
          .cart-body, .cart-footer {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
