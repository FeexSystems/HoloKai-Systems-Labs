import React, { forwardRef } from 'react';

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: { label: string; value: string; description?: string }[];
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className = '', options, name, value, onChange, label, error, ...props }, ref) => {
    return (
      <div ref={ref} className={`flex flex-col gap-3 ${className}`} {...props}>
        {label && (
          <label className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const isChecked = value === opt.value;
            return (
              <label
                key={opt.value}
                className={`
                  flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200
                  ${isChecked 
                    ? 'border-[var(--color-border)] bg-[var(--color-brand)]/5' 
                    : 'border-white/10 bg-[#0a0a0f] hover:border-white/20 hover:bg-white/[0.02]'
                  }
                `}
              >
                <div className="relative flex items-center justify-center pt-0.5">
                  <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={isChecked}
                    onChange={() => onChange?.(opt.value)}
                    className="sr-only"
                  />
                  <div className={`
                    w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                    ${isChecked ? 'border-[var(--color-border)]' : 'border-zinc-600'}
                  `}>
                    {isChecked && <div className="w-2 h-2 rounded-full bg-[var(--color-brand)]" />}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isChecked ? 'text-[var(--color-brand)]' : 'text-zinc-200'}`}>
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="text-xs text-zinc-500 mt-1">
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
