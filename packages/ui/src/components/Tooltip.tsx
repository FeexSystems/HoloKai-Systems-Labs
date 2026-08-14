'use client';

import React from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const sideStyles = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowSide = {
  top:    'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-[#242424]',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-[#242424]',
  left:   'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-[#242424]',
  right:  'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-[#242424]',
};

export function Tooltip({
  content,
  children,
  side = 'top',
  className = '',
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      {visible && (
        <span
          role="tooltip"
          className={[
            'absolute z-50 whitespace-nowrap px-3 py-1.5 rounded-xl',
            'text-xs font-medium text-zinc-200',
            'bg-[#1a1a26] border border-white/10 shadow-xl',
            'animate-in fade-in zoom-in-95 duration-150',
            sideStyles[side],
            className,
          ].join(' ')}
        >
          {content}
          {/* Arrow */}
          <span
            aria-hidden="true"
            className={`absolute w-0 h-0 border-4 ${arrowSide[side]}`}
          />
        </span>
      )}
    </span>
  );
}

Tooltip.displayName = 'Tooltip';
