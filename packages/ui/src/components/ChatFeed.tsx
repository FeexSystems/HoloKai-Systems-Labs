'use client';

import React, { useRef, useEffect } from 'react';
import { ChatMessage, ChatMessageProps } from './ChatMessage';
import { Send } from 'lucide-react';

export interface ChatFeedProps {
  messages: ChatMessageProps[];
  isTyping?: boolean;
  onSendMessage: (msg: string) => void;
  className?: string;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({ messages, isTyping, onSendMessage, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className={`flex flex-col h-full bg-background border border-border rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-surface-elevated flex justify-between items-center">
        <h3 className="font-semibold text-foreground text-sm">HoloKai AI</h3>
        <span className="flex h-2 w-2 rounded-full bg-success"></span>
      </div>
      
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm text-center px-4">
            <p>How can I help you today?</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} {...msg} />
        ))}
        {isTyping && (
          <ChatMessage role="assistant" content="" isStreaming={true} />
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-3 bg-surface border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-surface-elevated border border-border text-foreground text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-brand text-brand-contrast rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-brand/90"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
