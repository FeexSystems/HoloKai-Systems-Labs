'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, CreditCard, Lock, Loader2, CheckCircle, ChevronRight } from 'lucide-react';

interface CheckoutStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface CheckoutFlowProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  };
  selectedTier: 'free' | 'pro' | 'enterprise';
  items: Array<{
    product: { id: string; name: string };
    quantity: number;
    tier: 'free' | 'pro' | 'enterprise';
  }>;
  onComplete: () => void;
  onError: (error: string) => void;
}

export function CheckoutFlow({ formData, selectedTier, items, onComplete, onError }: CheckoutFlowProps) {
  const [steps, setSteps] = useState<CheckoutStep[]>([
    { id: 'validate', title: 'Validating Information', status: 'pending' },
    { id: 'create-account', title: 'Creating Account', status: 'pending' },
    { id: 'setup-subscription', title: 'Setting Up Subscription', status: 'pending' },
    { id: 'process-payment', title: 'Processing Payment', status: 'pending' },
    { id: 'confirmation', title: 'Confirmation', status: 'pending' },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const processCheckout = async () => {
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      setSteps((prev) => {
        const newSteps = [...prev];
        newSteps[i].status = 'processing';
        return newSteps;
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        if (steps[i].id === 'validate') {
          if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            throw new Error('Missing required fields');
          }
          if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
          }
        }

        if (steps[i].id === 'create-account') {
          if (formData.email === 'existing@example.com') {
            throw new Error('Email already exists');
          }
        }

        if (steps[i].id === 'setup-subscription') {
          if (selectedTier === 'free' && items.length === 0) {
            throw new Error('No products selected');
          }
        }

        if (steps[i].id === 'process-payment') {
          if (selectedTier !== 'free') {
            // Simulate payment gateway call
          }
        }

        setSteps((prev) => {
          const newSteps = [...prev];
          newSteps[i].status = 'completed';
          return newSteps;
        });
      } catch (error) {
        setSteps((prev) => {
          const newSteps = [...prev];
          newSteps[i].status = 'error';
          newSteps[i].error = error instanceof Error ? error.message : 'Unknown error';
          return newSteps;
        });
        onError(steps[i].error || 'Checkout failed');
        return;
      }
    }

    onComplete();
  };

  const resetFlow = () => {
    setSteps([
      { id: 'validate', title: 'Validating Information', status: 'pending' },
      { id: 'create-account', title: 'Creating Account', status: 'pending' },
      { id: 'setup-subscription', title: 'Setting Up Subscription', status: 'pending' },
      { id: 'process-payment', title: 'Processing Payment', status: 'pending' },
      { id: 'confirmation', title: 'Confirmation', status: 'pending' },
    ]);
    setCurrentStepIndex(0);
  };

  const hasError = steps.some((step) => step.status === 'error');
  const isComplete = steps.every((step) => step.status === 'completed');

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <h2 className="text-xl font-bold mb-6">Checkout Process</h2>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-4 rounded-xl border ${
              step.status === 'error'
                ? 'border-red-500/50 bg-red-500/10'
                : step.status === 'completed'
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              {step.status === 'processing' && (
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
              )}
              {step.status === 'completed' && (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              )}
              {step.status === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              {step.status === 'pending' && (
                <div className="w-2 h-2 rounded-full bg-white/20" />
              )}
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium text-white">{step.title}</div>
              {step.error && (
                <div className="text-xs text-red-400 mt-1">{step.error}</div>
              )}
            </div>

            {step.status === 'completed' && index < steps.length - 1 && (
              <ChevronRight className="w-5 h-5 text-emerald-400" />
            )}
          </motion.div>
        ))}
      </div>

      {hasError && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Checkout Failed</span>
          </div>
          <p className="text-sm">
            {steps.find((s) => s.status === 'error')?.error || 'An error occurred during checkout'}
          </p>
        </div>
      )}

      {isComplete && (
        <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Checkout Complete!</span>
          </div>
          <p className="text-sm">
            Your account has been created and subscription is now active.
          </p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {hasError && (
          <button
            onClick={resetFlow}
            className="flex-1 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
          >
            Try Again
          </button>
        )}
        {!isComplete && !hasError && (
          <button
            onClick={processCheckout}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
          >
            {steps[currentStepIndex].status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Complete Purchase
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
