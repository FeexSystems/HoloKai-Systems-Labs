import * as React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            className="peer appearance-none w-5 h-5 border border-zinc-600 rounded bg-zinc-800/50 checked:bg-[var(--color-brand)] checked:border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]/50 transition-all"
            ref={ref}
            {...props}
          />
          <svg
            className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-black stroke-current transition-opacity"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        {label && <span className="text-sm font-medium text-zinc-300 select-none peer-checked:text-white">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
