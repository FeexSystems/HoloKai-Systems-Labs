import * as React from 'react';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
        <div className="relative">
          <input type="checkbox" className="sr-only peer" ref={ref} {...props} />
          <div className="w-10 h-6 bg-zinc-700/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-border)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand)]"></div>
        </div>
        {label && <span className="text-sm font-medium text-zinc-300 peer-checked:text-white">{label}</span>}
      </label>
    );
  }
);
Switch.displayName = 'Switch';
