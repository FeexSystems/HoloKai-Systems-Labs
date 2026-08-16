import React from 'react';
import { Bot, User } from 'lucide-react';

export interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isStreaming = false }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {/* Avatar */}
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isUser ? 'bg-brand text-brand-contrast' : 'bg-surface-elevated border border-border text-foreground'}`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        {/* Message Bubble */}
        <div className={`px-4 py-3 rounded-2xl text-sm ${isUser ? 'bg-brand text-brand-contrast rounded-br-sm' : 'bg-surface border border-border text-foreground rounded-bl-sm'}`}>
          <div className="whitespace-pre-wrap">{content}</div>
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse align-middle" />
          )}
        </div>
      </div>
    </div>
  );
};
