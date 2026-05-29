import React, { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    // Disable glow completely on touch/mobile devices for perfect visual performance
    if (window.innerWidth <= 768) return;

    let animFrameId;
    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updatePosition = () => {
      if (glowRef.current) {
        // Linear interpolation (lerp) for a smooth, organic lagging minimal glow trailing effect
        const ease = 0.12;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        
        // Translate3d pushes coordinate changes directly to the GPU compositor thread (120fps fluid)
        glowRef.current.style.transform = `translate3d(${currentX - 150}px, ${currentY - 150}px, 0)`;
      }
      animFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    updatePosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-ambient-glow" />
      <style>{`
        .cursor-ambient-glow {
          position: fixed;
          top: 0;
          left: 0;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(123, 115, 217, 0.08) 0%,
            rgba(123, 115, 217, 0.02) 40%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 99999;
          transform: translate3d(-500px, -500px, 0);
          will-change: transform;
          mix-blend-mode: screen;
        }
      `}</style>
    </>
  );
}
