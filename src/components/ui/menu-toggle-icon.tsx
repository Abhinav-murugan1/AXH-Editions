import React from 'react';

interface MenuToggleProps extends React.SVGProps<SVGSVGElement> {
  open: boolean;
}

export function MenuToggleIcon({ open, className, style, ...props }: MenuToggleProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        ...style,
        cursor: 'pointer'
      }}
      {...props}
    >
      {/* Top Line */}
      <line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        style={{
          transform: open ? 'translate(0px, 6px) rotate(45deg)' : 'none',
          transformOrigin: '12px 6px',
          transition: 'transform 0.3s ease'
        }}
      />
      {/* Middle Line */}
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        style={{
          opacity: open ? 0 : 1,
          transition: 'opacity 0.2s ease'
        }}
      />
      {/* Bottom Line */}
      <line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        style={{
          transform: open ? 'translate(0px, -6px) rotate(-45deg)' : 'none',
          transformOrigin: '12px 18px',
          transition: 'transform 0.3s ease'
        }}
      />
    </svg>
  );
}
