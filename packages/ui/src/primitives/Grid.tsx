'use client';

import React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
}

const colStyles: Record<NonNullable<GridProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
  12: 'grid-cols-12',
};

const gapStyles: Record<NonNullable<GridProps['gap']>, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6 md:gap-8',
  lg: 'gap-8 md:gap-12',
  xl: 'gap-12 md:gap-16',
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 3, gap = 'md', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`grid ${colStyles[cols]} ${gapStyles[gap]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';
