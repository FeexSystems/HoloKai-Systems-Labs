'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, X, TrendingUp, Calendar, CreditCard } from 'lucide-react';

interface SubscriptionManagementProps {
  currentTier: 'free' | 'pro' | 'enterprise';
  nextBillingDate: string;
  onCancel: () => void;
  onPause: () => void;
  onResume: () => void;
  onUpgrade: () => void;
}

export function SubscriptionManagement({
  currentTier,
  nextBillingDate,
  onCancel,
  onPause,
  onResume,
  onUpgrade,
}: SubscriptionManagementProps) {
  const [isPaused, setIsPaused] = React.useState(false);

  const handlePauseToggle = () => {
    if (isPaused) {
      onResume();
      setIsPaused(false);
    } else {
      onPause();
      setIsPaused(true);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <h2 className="text-xl font-bold mb-6">Subscription Management</h2>

      {/* Current Plan */}
      <div className="p-4 rounded-xl border border-white/10 bg-white/5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-zinc-400 mb-1">Current Plan</div>
            <div className="text-2xl font-bold text-white capitalize">{currentTier}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-400 mb-1">Next Billing</div>
            <div className="text-lg font-medium text-amber-400">{nextBillingDate}</div>
          </div>
        </div>

        {currentTier !== 'free' && (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar className="w-4 h-4" />
            <span>Renews automatically on {nextBillingDate}</span>
          </div>
        )}
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-400">Queries Used</span>
          </div>
          <div className="text-2xl font-bold text-white">847</div>
          <div className="text-xs text-zinc-500">of 1,000 this month</div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-zinc-400">Documents</span>
          </div>
          <div className="text-2xl font-bold text-white">23</div>
          <div className="text-xs text-zinc-500">of 100 stored</div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePauseToggle}
          disabled={currentTier === 'free'}
          className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4" />
              Resume Subscription
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              Pause Subscription
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUpgrade}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Upgrade Plan
        </motion.button>

        {currentTier !== 'free' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="w-full py-3 px-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel Subscription
          </motion.button>
        )}
      </div>

      {/* Pause Notice */}
      {isPaused && (
        <div className="mt-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <p className="text-sm text-amber-300">
            Your subscription is paused. You won't be charged while paused, but access to premium features is suspended.
          </p>
        </div>
      )}
    </div>
  );
}
