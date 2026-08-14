import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

export function Skeleton({
  variant = 'rect',
  width,
  height,
  lines = 1,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const baseClasses =
    'animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] [animation:skeleton-shimmer_1.8s_ease-in-out_infinite]';

  if (variant === 'circle') {
    const size = width || height || '2.5rem';
    return (
      <div
        aria-hidden="true"
        className={`${baseClasses} rounded-full shrink-0 ${className}`}
        style={{ width: size, height: size, ...style }}
        {...props}
      />
    );
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`flex flex-col gap-2 ${className}`} aria-hidden="true" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} h-4 rounded-lg`}
            style={{ width: i === lines - 1 ? '70%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={[
        baseClasses,
        variant === 'text' ? 'h-4 rounded-lg' : 'rounded-2xl',
        className,
      ].join(' ')}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

Skeleton.displayName = 'Skeleton';
