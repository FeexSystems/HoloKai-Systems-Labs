import React, { forwardRef } from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5
            text-white appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]/50 focus:border-[var(--color-border)]/50
            transition-all duration-200
            ${error ? 'border-red-500/50 ring-1 ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
