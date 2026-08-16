import React from 'react';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  elevation?: 'none' | 'subtle' | 'base' | 'elevated';
  interactive?: boolean;
  children: React.ReactNode;
}

const elevationStyles = {
  none: 'bg-transparent border-transparent',
  subtle: 'bg-surface-subtle border-border-subtle shadow-sm',
  base: 'bg-surface border-border shadow-md',
  elevated: 'bg-surface-elevated border-border-strong shadow-lg',
};

const interactiveStyles = 'hover:bg-surface-hover hover:-translate-y-1 hover:shadow-glow-subtle cursor-pointer transition-all duration-300 ease-planetary';

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ as: Component = 'div', elevation = 'base', interactive = false, className = '', children, ...props }, ref) => {
    return React.createElement(
      Component,
      {
        ref,
        className: `rounded-2xl border ${elevationStyles[elevation]} ${interactive ? interactiveStyles : ''} ${className}`,
        ...props
      },
      children
    );
  }
);

Surface.displayName = 'Surface';
