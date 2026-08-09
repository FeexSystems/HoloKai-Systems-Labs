import React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?:
    | 'display-xl'
    | 'display-lg'
    | 'display-md'
    | 'heading-xl'
    | 'heading-lg'
    | 'heading-md'
    | 'body-lg'
    | 'body-md'
    | 'body-sm'
    | 'body-xs'
    | 'mono';
  color?: 'primary' | 'secondary' | 'muted' | 'gold' | 'goldLight' | 'amber';
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<TextProps['variant']>, string> = {
  'display-xl': 'text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none',
  'display-lg': 'text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight',
  'display-md': 'text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight',
  'heading-xl': 'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight',
  'heading-lg': 'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight',
  'heading-md': 'text-lg sm:text-xl md:text-2xl font-bold tracking-tight',
  'body-lg': 'text-lg md:text-xl font-normal leading-relaxed',
  'body-md': 'text-base font-normal leading-relaxed',
  'body-sm': 'text-sm font-normal leading-normal',
  'body-xs': 'text-xs font-normal leading-normal',
  mono: 'font-mono text-xs tracking-wider uppercase',
};

const colorStyles: Record<NonNullable<TextProps['color']>, string> = {
  primary: 'text-white',
  secondary: 'text-zinc-300',
  muted: 'text-zinc-400',
  gold: 'text-[#c8952a]',
  goldLight: 'text-[#e8b84b]',
  amber: 'text-amber-400',
};

const alignStyles: Record<NonNullable<TextProps['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as,
      variant = 'body-md',
      color = 'primary',
      align = 'left',
      weight,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const Component =
      as ||
      (variant.startsWith('display')
        ? 'h1'
        : variant.startsWith('heading')
        ? 'h2'
        : variant === 'mono'
        ? 'code'
        : 'p');

    const weightStyle = weight ? `font-${weight}` : '';

    const combinedClasses = [
      variantStyles[variant],
      colorStyles[color],
      alignStyles[align],
      weightStyle,
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

Text.displayName = 'Text';
