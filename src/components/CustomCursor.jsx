import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Check if touch device or mobile screen
    if (window.innerWidth <= 768) return;

    // Use requestAnimationFrame to throttle cursor coordinates update for GPU-level performance
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !ringRef.current) return;
      
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.reduced-prod-card') || 
        target.closest('.action-icon-btn') || 
        target.closest('.carousel-arrow-btn') ||
        target.closest('.admin-tab-btn') ||
        target.closest('.view-all-shop-btn') ||
        target.closest('.product-card');

      if (isInteractive) {
        ringRef.current.classList.add('hovered');
      } else {
        ringRef.current.classList.remove('hovered');
      }
    };

    // Smooth cursor trailing animation loop using requestAnimationFrame (60fps/120fps native)
    let animFrameId;
    const updatePosition = () => {
      // Direct DOM manipulation bypasses React rendering pipeline completely
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
      
      if (ringRef.current) {
        // Subtle lagging inertia effect for the outer ring
        const ease = 0.15;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        ringRef.current.style.left = `${currentX}px`;
        ringRef.current.style.top = `${currentY}px`;
      }
      
      animFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    
    // Start cursor animation loop
    updatePosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" style={{ transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, background-color 0.3s ease' }} />
    </>
  );
}
