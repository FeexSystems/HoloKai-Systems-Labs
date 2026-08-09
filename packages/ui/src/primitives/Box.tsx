import React from 'react';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  variant?: 'abyss' | 'obsidian' | 'panel' | 'elevated' | 'card' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'full';
  border?: boolean | 'subtle' | 'gold';
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<BoxProps['variant']>, string> = {
  abyss: 'bg-[#05050a] text-white',
  obsidian: 'bg-[#0a0a0a] text-white',
  panel: 'bg-[#12121a] text-white',
  elevated: 'bg-[#1a1a26] text-white',
  card: 'bg-[#1f1f2e] text-white',
  glass: 'bg-[#0a0a0f]/85 backdrop-blur-xl text-white',
};

const paddingStyles: Record<NonNullable<BoxProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-3 md:p-4',
  md: 'p-5 md:p-6',
  lg: 'p-6 md:p-8',
  xl: 'p-8 md:p-12',
};

const radiusStyles: Record<NonNullable<BoxProps['radius']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  hero: 'rounded-[36px]',
  full: 'rounded-full',
};

const borderStyles: Record<string, string> = {
  true: 'border border-white/10',
  subtle: 'border border-white/5',
  gold: 'border border-amber-500/25',
};

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      as: Component = 'div',
      variant = 'panel',
      padding = 'md',
      radius = 'lg',
      border = 'gold',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const combinedClasses = [
      variantStyles[variant],
      paddingStyles[padding],
      radiusStyles[radius],
      typeof border === 'boolean'
        ? borderStyles[String(border)]
        : border
        ? borderStyles[border]
        : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={combinedClasses} {...props}>
        {children}
      </Component>
    );
  }
);

Box.displayName = 'Box';
