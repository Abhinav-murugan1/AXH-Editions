import React, { useState } from 'react';
import { CreditCard, ShieldCheck, ShoppingBag, Landmark, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

export default function Checkout({ cartItems, grandTotal, appliedDiscount, onClose, onClearCart }) {
  const [step, setStep] = useState('billing'); // 'billing', 'processing', 'success'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shippingFee = subtotal > 150 ? 0 : 15;

  const handlePay = (e) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate premium payment processing flow
    setTimeout(() => {
      setStep('success');
      onClearCart();
    }, 3500);
  };

  return (
    <div className="checkout-fullscreen-overlay animate-fade-in">
      <div className="checkout-container">
        
        {/* Step 1 & 2: Billing & Processing */}
        {step !== 'success' && (
          <div className="checkout-grid">
            
            {/* Left Panel: Checkout Form & Inputs */}
            <div className="checkout-form-panel glass-panel">
              <button className="back-to-gallery-btn" onClick={onClose} disabled={step === 'processing'}>
                <ArrowLeft size={14} />
                <span>Return to Bag</span>
              </button>

              {step === 'processing' ? (
                <div className="processing-state-block">
                  <Loader2 size={48} className="spinner-glow" />
                  <h3>Securing Your Limited Drops</h3>
                  <p className="processing-subtitle">Verifying card authenticity & allocating serial numbers from Drop vault...</p>
                  
                  <div className="processing-steps-visual">
                    <div className="step-bullet done">Secure SSL Connection Established</div>
                    <div className="step-bullet done">Item Volume Availability Confirmed</div>
                    <div className="step-bullet active">Processing Payment Transaction...</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePay} className="checkout-billing-form">
                  <div className="form-header-editorial">
                    <span className="accent-label-mini">SECURE TRANSACT</span>
                    <h2>CHECKOUT BILLING</h2>
                  </div>

                  <div className="form-group-section">
                    <span className="section-label-num">1. CUSTOMER IDENTITY</span>
                    <div className="form-group">
                      <input 
                        type="email" 
                        placeholder="EMAIL ADDRESS" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="checkout-input"
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group-section">
                    <span className="section-label-num">2. SHIPPING LOGISTICS</span>
                    <div className="form-group-row">
                      <input 
                        type="text" 
                        placeholder="FULL NAME" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="checkout-input flex-1"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="text" 
                        placeholder="DELIVERY ADDRESS" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="checkout-input"
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group-section">
                    <span className="section-label-num">3. SECURE PAYMENT METHOD</span>
                    <div className="form-group">
                      <div className="card-input-wrapper">
                        <CreditCard size={16} className="card-icon" />
                        <input 
                          type="text" 
                          placeholder="CARD NUMBER" 
                          value={cardNum}
                          onChange={(e) => setCardNum(e.target.value)}
                          className="checkout-input-inline"
                          maxLength={19}
                          required 
                        />
                      </div>
                    </div>
                    <div className="form-group-row">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="checkout-input flex-1"
                        maxLength={5}
                        required 
                      />
                      <input 
                        type="password" 
                        placeholder="CVV" 
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="checkout-input flex-1"
                        maxLength={4}
                        required 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary checkout-pay-btn">
                    AUTHORIZE PAYMENTS • ₹{grandTotal.toFixed(2)}
                  </button>

                  <div className="ssl-badge-assurance">
                    <ShieldCheck size={14} style={{ color: 'var(--color-violet)' }} />
                    <span>256-Bit SSL Encrypted Connection</span>
                  </div>
                </form>
              )}
            </div>

            {/* Right Panel: Order Review Details */}
            <div className="checkout-summary-panel">
              <h3 className="summary-title">ORDER ANALYSIS</h3>
              
              <div className="summary-items-scroll">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item-line">
                    <div 
                      className="summary-thumb"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="summary-details">
                      <h4>{item.name}</h4>
                      <p>{item.size} • {item.framed ? 'Framed Edition' : 'Archival Poster'}</p>
                      <span className="summary-qty">QTY: {item.quantity}</span>
                    </div>
                    <span className="summary-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="summary-math-block">
                <div className="math-row">
                  <span>SUBTOTAL</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="math-row discount-glow">
                    <span>COUPON DISCOUNT ({appliedDiscount}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="math-row">
                  <span>SHIPPING FREIGHT</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="math-row grand-total-row">
                  <span>TOTAL AUTHORIZED</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Step 3: Success Confirmation Page */}
        {step === 'success' && (
          <div className="checkout-success-view glass-panel animate-slide-up">
            <CheckCircle2 size={64} className="success-icon-glow" />
            <span className="success-badge">TRANSACTION COMPLETED</span>
            <h2>YOUR COLLECTIBLE IS SECURED</h2>
            
            <p className="success-narrative">
              Thank you for supporting AXH Editions. Your order reference <span className="ref-code">#AXH-{Math.floor(100000 + Math.random() * 900000)}</span> has been confirmed. 
              We have dispatched your visual artifacts specifications directly to our London print studio.
            </p>

            <div className="shipping-timeline-box">
              <h4>ALLOCATED TIMELINE:</h4>
              <p>• Prints & Framing assembly: 2-3 business days</p>
              <p>• DHL Express tracking email will be sent shortly</p>
            </div>

            <button className="btn-primary success-home-btn" onClick={onClose}>
              CONTINUE TO GALLERY
            </button>
          </div>
        )}

      </div>

      <style>{`
        .checkout-fullscreen-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: var(--color-black);
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .checkout-container {
          width: 100%;
          max-width: 1100px;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3.5rem;
        }

        /* Form Panel */
        .checkout-form-panel {
          padding: 3rem;
          background: rgba(17, 19, 38, 0.2);
        }

        .back-to-gallery-btn {
          background: none;
          border: none;
          color: var(--color-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-family: var(--font-serif);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 2.5rem;
          transition: var(--transition-fast);
        }

        .back-to-gallery-btn:hover {
          color: var(--color-ivory);
        }

        .form-header-editorial {
          margin-bottom: 2.5rem;
        }

        .accent-label-mini {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--color-violet);
          letter-spacing: 0.25em;
        }

        .form-header-editorial h2 {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          color: var(--color-ivory);
          margin-top: 0.25rem;
        }

        .form-group-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2.25rem;
        }

        .section-label-num {
          font-family: var(--font-serif);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-muted);
          letter-spacing: 0.15em;
        }

        .checkout-input {
          width: 100%;
          background: rgba(9, 8, 13, 0.5);
          border: 1px solid rgba(245, 243, 239, 0.08);
          border-radius: 0px !important;
          color: var(--color-ivory);
          padding: 0.95rem 1.25rem;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 300;
          outline: none;
          transition: var(--transition-fast);
        }

        .checkout-input:focus {
          border-color: var(--color-violet);
        }

        .card-input-wrapper {
          display: flex;
          align-items: center;
          background: rgba(9, 8, 13, 0.5);
          border: 1px solid rgba(245, 243, 239, 0.08);
          border-radius: 0px !important;
          padding: 0 1.25rem;
        }

        .card-icon {
          color: var(--color-muted);
          margin-right: 0.75rem;
        }

        .checkout-input-inline {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--color-ivory);
          padding: 0.95rem 0;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 300;
        }

        .form-group-row {
          display: flex;
          gap: 1rem;
        }

        .flex-1 {
          flex: 1;
        }

        .checkout-pay-btn {
          width: 100%;
          justify-content: center;
          padding: 1.1rem;
          border-radius: 0px !important;
          margin-top: 1rem;
        }

        .ssl-badge-assurance {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          color: var(--color-muted);
          font-size: 0.7rem;
          margin-top: 1.25rem;
        }

        /* Summary Panel */
        .checkout-summary-panel {
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-left: 1px solid rgba(245, 243, 239, 0.05);
          padding-left: 3.5rem;
        }

        .summary-title {
          font-family: var(--font-serif);
          font-size: 0.9rem;
          letter-spacing: 0.15em;
          color: var(--color-ivory);
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(245, 243, 239, 0.05);
          padding-bottom: 1rem;
        }

        .summary-items-scroll {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-height: 380px;
          overflow-y: auto;
          margin-bottom: 2rem;
          padding-right: 1rem;
        }

        .summary-item-line {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .summary-thumb {
          width: 50px;
          aspect-ratio: 3/4;
          background-size: cover;
          background-position: center;
          border-radius: 0px !important;
          background-color: #111;
        }

        .summary-details {
          flex: 1;
        }

        .summary-details h4 {
          font-family: var(--font-serif);
          font-size: 0.88rem;
          color: var(--color-ivory);
        }

        .summary-details p {
          font-size: 0.75rem;
          color: var(--color-muted);
        }

        .summary-qty {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          color: var(--color-violet);
          font-weight: 600;
        }

        .summary-price {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-ivory);
        }

        .summary-math-block {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px solid rgba(245, 243, 239, 0.05);
          padding-top: 1.5rem;
        }

        .math-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-serif);
          font-size: 0.8rem;
          color: var(--color-muted);
        }

        .grand-total-row {
          font-size: 1.1rem;
          color: var(--color-ivory);
          font-weight: 600;
          margin-top: 0.5rem;
        }

        /* Processing State */
        .processing-state-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 6rem 1rem;
          gap: 1.5rem;
        }

        .spinner-glow {
          color: var(--color-violet);
          animation: spin 1.5s linear infinite;
          filter: drop-shadow(0 0 10px var(--color-violet));
        }

        .processing-subtitle {
          max-width: 320px;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .processing-steps-visual {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          background: rgba(9, 8, 13, 0.4);
          border: 1px solid rgba(245, 243, 239, 0.05);
          padding: 1.25rem 2rem;
          border-radius: 0px !important;
          margin-top: 1rem;
          text-align: left;
        }

        .step-bullet {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: var(--color-muted);
          position: relative;
          padding-left: 1.5rem;
        }

        .step-bullet::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(245, 243, 239, 0.15);
        }

        .step-bullet.done {
          color: rgba(245, 243, 239, 0.8);
        }

        .step-bullet.done::before {
          background: var(--color-violet);
        }

        .step-bullet.active {
          color: var(--color-orange);
          font-weight: 500;
        }

        .step-bullet.active::before {
          background: var(--color-orange);
          box-shadow: 0 0 8px var(--color-orange);
          animation: pulse 1s infinite;
        }

        /* Success View */
        .checkout-success-view {
          max-width: 680px;
          margin: 4rem auto;
          padding: 4rem;
          background: rgba(17, 19, 38, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
        }

        .success-icon-glow {
          color: var(--color-violet);
          filter: drop-shadow(0 0 16px var(--color-violet));
        }

        .success-badge {
          background: rgba(123, 115, 217, 0.08);
          border: 1px solid rgba(123, 115, 217, 0.2);
          color: var(--color-violet);
          font-family: var(--font-serif);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          padding: 0.4rem 1rem;
          border-radius: 0px !important;
        }

        .checkout-success-view h2 {
          font-family: var(--font-display);
          font-size: 2.25rem;
          letter-spacing: -0.01em;
          color: var(--color-ivory);
        }

        .success-narrative {
          font-size: 0.95rem;
          line-height: 1.8;
          max-width: 480px;
        }

        .ref-code {
          color: var(--color-orange);
          font-weight: 600;
        }

        .shipping-timeline-box {
          background: rgba(9, 8, 13, 0.4);
          border: 1px solid rgba(245, 243, 239, 0.05);
          border-radius: 0px !important;
          padding: 1.5rem 2rem;
          text-align: left;
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .shipping-timeline-box h4 {
          font-family: var(--font-serif);
          font-size: 0.75rem;
          color: var(--color-muted);
          letter-spacing: 0.1em;
        }

        .shipping-timeline-box p {
          font-size: 0.8rem;
          color: var(--color-ivory);
        }

        .success-home-btn {
          padding: 1.1rem 3rem;
          border-radius: 0px !important;
          margin-top: 1rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
          .checkout-summary-panel {
            border-left: none;
            border-top: 1px solid rgba(245, 243, 239, 0.05);
            padding-left: 0;
            padding-top: 3rem;
          }
        }

        @media (max-width: 768px) {
          .checkout-fullscreen-overlay {
            padding: 1rem;
          }
          .checkout-form-panel {
            padding: 1.5rem;
          }
          .checkout-success-view {
            padding: 2.5rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
