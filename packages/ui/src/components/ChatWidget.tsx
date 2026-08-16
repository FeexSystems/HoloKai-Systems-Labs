'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { ChatFeed, ChatFeedProps } from './ChatFeed';

export interface ChatWidgetProps extends Omit<ChatFeedProps, 'className'> {
  position?: 'bottom-right' | 'bottom-left';
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ position = 'bottom-right', ...feedProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-6 right-6' 
    : 'bottom-6 left-6';

  const popoverClasses = position === 'bottom-right'
    ? 'bottom-16 right-0 mb-4 origin-bottom-right'
    : 'bottom-16 left-0 mb-4 origin-bottom-left';

  return (
    <div className={`fixed z-50 ${positionClasses}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} // --ease-planetary equivalent
            className={`absolute ${popoverClasses} w-80 sm:w-96 h-[500px] shadow-2xl rounded-xl border border-border overflow-hidden`}
          >
            <ChatFeed {...feedProps} className="h-full border-none rounded-none" />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-brand text-brand-contrast rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};
