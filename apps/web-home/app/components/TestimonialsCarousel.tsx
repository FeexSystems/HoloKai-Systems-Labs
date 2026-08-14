'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial, HoloKaiProduct, PricingTier } from '@holokai/contracts';

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Professor of Ancient History',
    company: 'Oxford University',
    quote: 'HoloKai Research Tier has revolutionized how my students access ancient texts. The semantic search is incredibly accurate.',
    rating: 5,
    product: 'research-tier',
    tier: 'pro',
  },
  {
    id: '2',
    name: 'Marcus Rivera',
    role: 'Documentary Filmmaker',
    company: 'History Channel Productions',
    quote: 'The voice synthesis capabilities are mind-blowing. We can now have ancient figures "speak" in our documentaries.',
    rating: 5,
    product: 'voice-services',
    tier: 'enterprise',
  },
  {
    id: '3',
    name: 'Elena Kowalski',
    role: 'Museum Curator',
    company: 'British Museum',
    quote: 'HoloKai Vision helps us generate artifact reconstructions that were previously impossible. It\'s transformed our exhibits.',
    rating: 5,
    product: 'vision',
    tier: 'pro',
  },
  {
    id: '4',
    name: 'James Okonkwo',
    role: 'Independent Researcher',
    quote: 'The Oracle feature is like having a brilliant historian available 24/7. It understands context and nuance.',
    rating: 5,
    product: 'oracle',
    tier: 'free',
  },
  {
    id: '5',
    name: 'Dr. Aisha Patel',
    role: 'Archaeologist',
    company: 'Field Research Institute',
    quote: 'Archive keeps all my field notes organized and searchable. The version history has saved me multiple times.',
    rating: 4,
    product: 'archive',
    tier: 'pro',
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="px-6 py-24 max-w-7xl mx-auto bg-[#0a0a0f] border-t border-white/5">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          What Our Users Say
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Hear from researchers, historians, and content creators who use HoloKai
        </p>
      </div>

      <div
        className="relative max-w-4xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Testimonial Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="relative p-8 md:p-12 rounded-2xl border border-white/10 bg-[#12121a]"
          >
            {/* Quote Icon */}
            <Quote className="absolute top-6 right-6 w-12 h-12 text-amber-500/20" />

            {/* Rating */}
            <div className="flex gap-1 mb-6">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-bold text-white">{currentTestimonial.name}</div>
                <div className="text-sm text-zinc-400">
                  {currentTestimonial.role}
                  {currentTestimonial.company && (
                    <span> • {currentTestimonial.company}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Product & Tier Badges */}
            <div className="flex gap-2 mt-6">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                {currentTestimonial.product}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                {currentTestimonial.tier}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-amber-500' : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
