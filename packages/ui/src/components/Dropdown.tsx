'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'right', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 mt-2 min-w-[200px] origin-top-right rounded-xl border border-border-strong bg-surface-elevated shadow-xl shadow-glow-subtle backdrop-blur-xl ${alignmentClasses[align]}`}
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  const element = child as React.ReactElement<{ onClick?: (e: any) => void }>;
                  return React.cloneElement(element, {
                    onClick: (e: any) => {
                      if (element.props.onClick) {
                        element.props.onClick(e);
                      }
                      setIsOpen(false);
                    },
                  });
                }
                return child;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  danger?: boolean;
}

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ children, icon, danger, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200 hover:bg-surface-hover ${
          danger ? 'text-danger hover:text-danger hover:bg-danger/10' : 'text-foreground hover:text-brand'
        } ${className}`}
        role="menuitem"
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-grow text-left font-medium">{children}</span>
      </button>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';
