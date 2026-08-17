'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Clock, Trash2, Search } from 'lucide-react';

interface Conversation {
  id: string;
  query: string;
  timestamp: Date;
  category?: string;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  currentConversationId?: string;
}

export function ConversationHistory({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  currentConversationId,
}: ConversationHistoryProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.query.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-white/10 bg-[#0a0a0f] flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-bold text-white mb-4">History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {filteredConversations.map((conv, index) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectConversation(conv.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                currentConversationId === conv.id
                  ? 'bg-amber-500/20 border-amber-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium line-clamp-2">
                    {conv.query}
                  </p>
                  {conv.category && (
                    <span className="text-xs text-zinc-400">
                      {conv.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock className="w-3 h-3" />
                <span>{conv.timestamp.toLocaleTimeString()}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredConversations.length === 0 && (
          <div className="text-center py-8 text-zinc-500 text-sm">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No conversations yet</p>
          </div>
        )}
      </div>

      {conversations.length > 0 && (
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              conversations.forEach((conv) => onDeleteConversation(conv.id));
            }}
            className="w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-zzinc-400 hover:text-white text-sm transition-colors"
          >
            Clear All History
          </button>
        </div>
      )}
    </div>
  );
}
