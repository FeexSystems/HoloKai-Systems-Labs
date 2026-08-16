import React from 'react';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'gold' | 'white' | 'muted';
  label?: string;
  className?: string;
}

const sizeMap = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-9',
};

const strokeMap = {
  xs: 1.5,
  sm: 1.5,
  md: 2,
  lg: 2.5,
};

const colorMap = {
  gold:  'text-brand',
  white: 'text-white',
  muted: 'text-zinc-500',
};

export function Spinner({ size = 'md', color = 'gold', label = 'Loading…', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${colorMap[color]} ${className}`}
    >
      <svg
        className={`animate-spin ${sizeMap[size]}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth={strokeMap[size]}
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth={strokeMap[size]}
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

Spinner.displayName = 'Spinner';
