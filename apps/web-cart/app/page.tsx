'use client';

import React, { Suspense, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MFEErrorBoundary, MFELoadingSkeleton, ProductCard, SubscriptionCard, Button, Spinner, holokaiVariants } from '@holokai/ui';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  imageUrl?: string;
  rating?: number;
  featured?: boolean;
}

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: string[];
  popular?: boolean;
}

function CommerceMFEContent() {
  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/bff/commerce/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  const { data: subscriptions, isLoading: isLoadingSubs } = useQuery<Subscription[]>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const res = await fetch('/api/bff/commerce/subscriptions');
      if (!res.ok) throw new Error('Failed to fetch subscriptions');
      return res.json();
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch('/api/bff/commerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [itemId] })
      });
      if (!res.ok) throw new Error('Checkout failed');
      return res.json();
    },
    onSuccess: (data) => {
      setToastMessage(data.message || 'Transaction successful.');
      setIsToastOpen(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('holokai_cart_change', { detail: { count: 1 } }));
      }
    },
    onError: () => {
      setToastMessage('Transaction failed. The Planetary BFF may be offline.');
      setIsToastOpen(true);
    }
  });

  return (
    <main className="max-w-7xl mx-auto space-y-16 p-6 md:p-12 min-h-screen bg-[#05050a] text-white">
      
      <header className="border-b border-amber-500/20 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">
            Micro-Frontend Remote · Port 3005
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse" />
            HoloKai Marketplace
          </h1>
          <p className="text-zinc-400 mt-3 max-w-2xl">
            Acquire artifacts, hardware, and access protocols necessary to thrive within the Planetary matrix.
          </p>
        </div>
      </header>

      {/* Subscriptions Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Network Access Protocols</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Choose your level of integration with the Planetary AI systems.
          </p>
        </div>

        {isLoadingSubs ? (
          <div className="flex justify-center p-12">
            <Spinner className="text-rose-500" />
          </div>
        ) : (
          <motion.div 
            variants={holokaiVariants.staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-6"
          >
            {subscriptions?.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                {...sub}
                onSubscribe={(id) => checkoutMutation.mutate(id)}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* Hardware / Artifacts Section */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Hardware & Artifacts</h2>
          <div className="h-px w-full bg-gradient-to-r from-amber-500/50 to-transparent mt-4" />
        </div>

        {isLoadingProducts ? (
          <div className="flex justify-center p-12">
            <Spinner className="text-amber-500" />
          </div>
        ) : (
          <motion.div 
            variants={holokaiVariants.staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products?.map((prod) => (
              <ProductCard
                key={prod.id}
                {...prod}
                onAddToCart={(id) => checkoutMutation.mutate(id)}
              />
            ))}
          </motion.div>
        )}
      </section>

    </main>
  );
}

export default function CommerceMFEPage() {
  return (
    <MFEErrorBoundary zoneName="Marketplace">
      <Suspense fallback={<MFELoadingSkeleton />}>
        <CommerceMFEContent />
      </Suspense>
    </MFEErrorBoundary>
  );
}
