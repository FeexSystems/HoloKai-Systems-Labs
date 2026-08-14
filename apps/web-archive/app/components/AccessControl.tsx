'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, Unlock, AlertCircle, Check, Users, Crown, Star } from 'lucide-react';

interface AccessLevel {
  id: string;
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  description: string;
  features: string[];
}

interface DocumentAccess {
  id: string;
  name: string;
  currentAccess: 'free' | 'pro' | 'enterprise';
  customAccess?: Record<string, 'free' | 'pro' | 'enterprise'>;
}

interface AccessControlProps {
  documentId: string;
  documentAccess: DocumentAccess;
  userTier: 'free' | 'pro' | 'enterprise';
  onAccessChange: (access: Record<string, 'free' | 'pro' | 'enterprise'>) => void;
}

const accessLevels: AccessLevel[] = [
  {
    id: 'free',
    name: 'Public',
    tier: 'free',
    description: 'Accessible to all users',
    features: ['View only', 'No download'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    description: 'Requires Pro subscription',
    features: ['View', 'Download', 'Edit metadata'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    description: 'Requires Enterprise subscription',
    features: ['View', 'Download', 'Edit', 'Share', 'API access'],
  },
];

const tierColors: Record<string, string> = {
  free: 'bg-zinc-500/20 text-zinc-300',
  pro: 'bg-amber-500/20 text-amber-400',
  enterprise: 'bg-blue-500/20 text-blue-400',
};

export function AccessControl({ documentId, documentAccess, userTier, onAccessChange }: AccessControlProps) {
  const [selectedAccess, setSelectedAccess] = useState<Record<string, 'free' | 'pro' | 'enterprise'>>(documentAccess.customAccess || {});
  const [isExpanded, setIsExpanded] = useState(false);

  const canModify = userTier === 'enterprise';
  const canView = userTier !== 'free';

  const handleAccessChange = (userId: string, level: 'free' | 'pro' | 'enterprise') => {
    if (!canModify) return;
    setSelectedAccess((prev) => ({ ...prev, [userId]: level }));
    onAccessChange(selectedAccess);
  };

  const setDefaultAccess = (level: 'free' | 'pro' | 'enterprise') => {
    if (!canModify) return;
    setSelectedAccess({ default: level });
    onAccessChange(selectedAccess);
  };

  const getAccessIcon = (level: 'free' | 'pro' | 'enterprise') => {
    switch (level) {
      case 'free':
        return <Unlock className="w-4 h-4" />;
      case 'pro':
        return <Lock className="w-4 h-4" />;
      case 'enterprise':
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Access Control</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* User Tier Display */}
      <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-400" />
            <span className="text-sm text-zinc-400">Your Access Level</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${tierColors[userTier]}`}>
            {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
          </div>
        </div>
        <p className="text-xs text-zinc-500">
          {userTier === 'free' && 'Basic access to public documents'}
          {userTier === 'pro' && 'Access to Pro and Free documents'}
          {userTier === 'enterprise' && 'Full access to all documents'}
        </p>
      </div>

      {/* Default Access Level */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Default Access Level
        </label>
        <div className="flex gap-2">
          {accessLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setDefaultAccess(level.tier as 'free' | 'pro' | 'enterprise')}
              disabled={!canModify}
              className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                documentAccess.currentAccess === level.tier
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2">
                {getAccessIcon(level.tier)}
                <span className="text-sm font-medium">{level.name}</span>
              </div>
            </button>
 ))}
        </div>
      </div>

      {/* Custom User Access */}
      {canModify && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Custom User Access
                </label>
                <p className="text-xs text-zinc-500 mb-3">
                  Grant specific users different access levels
                </p>

                <div className="space-y-2">
                  {['user1@example.com', 'user2@example.com', 'user3@example.com'].map((userId) => (
                  <div key={userId} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {userId[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white mb-1">{userId}</div>
                      <div className="flex gap-1">
                        {accessLevels.map((level) => (
                          <button
                            key={level.id}
                            onClick={() => handleAccessChange(userId, level.tier as 'free' | 'pro' | 'enterprise')}
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              selectedAccess[userId] === level.tier
                                ? tierColors[level.tier]
                                : 'bg-white/10 text-zinc-400 hover:bg-white/20'
                            }`}
                          >
                            {level.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>

              {/* Add User Button */}
              <button className="w-full py-2 px-4 rounded-lg border border-white/10 bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white text-sm transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                Add User
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Access Level Legend */}
      <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/5">
        <div className="text-sm font-medium text-zinc-300 mb-3">Access Levels</div>
        <div className="space-y-2">
          {accessLevels.map((level) => (
            <div key={level.id} className="flex items-center gap-2">
              {getAccessIcon(level.tier)}
              <span className="text-xs text-zinc-400">{level.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${tierColors[level.tier]}`}>
                {level.tier}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      {!canModify && (
        <div className="mt-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Upgrade Required</span>
          </div>
          <p className="text-sm">
            Upgrade to Pro or Enterprise to customize access controls
          </p>
        </div>
      )}

      {/* Save Button */}
      {canModify && (
        <button
          onClick={() => onAccessChange(selectedAccess)}
          className="w-full mt-6 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      )}
    </div>
  );
}
