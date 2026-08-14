import React from 'react';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  children?: React.ReactNode;
}

const gapStyles: Record<NonNullable<StackProps['gap']>, string> = {
  none: 'gap-0',
  xs: 'gap-1.5',
  sm: 'gap-3',
  md: 'gap-4 md:gap-6',
  lg: 'gap-6 md:gap-8',
  xl: 'gap-8 md:gap-12',
};

const alignStyles: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyStyles: Record<NonNullable<StackProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'col',
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const combinedClasses = [
      'flex',
      direction === 'row' ? 'flex-row' : 'flex-col',
      gapStyles[gap],
      alignStyles[align],
      justifyStyles[justify],
      wrap ? 'flex-wrap' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';
