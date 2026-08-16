'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Badge } from './Badge';
import type { Testimonial } from '@holokai/contracts';

export interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export function TestimonialCarousel({
  testimonials,
  autoScroll = true,
  autoScrollInterval = 5000,
  showDots = true,
  showArrows = true,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, isPaused, nextSlide]);

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-brand fill-brand' : 'text-zinc-600'
        }`}
      />
    ));
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Testimonial Card */}
      <div className="relative overflow-hidden rounded-2xl bg-background border border-white/10 p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Quote Icon */}
            <Quote className="absolute top-4 right-4 w-12 h-12 text-brand/10" />

            {/* Content */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand/20 to-transparent border border-white/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand">
                    {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="flex-1">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(currentTestimonial.rating)}
                </div>

                {/* Quote */}
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div>
                    <div className="text-white font-medium">{currentTestimonial.name}</div>
                    <div className="text-sm text-zinc-400">{currentTestimonial.role}</div>
                  </div>
                  {currentTestimonial.company && (
                    <>
                      <span className="hidden sm:inline text-zinc-600">•</span>
                      <div className="text-sm text-zinc-400">{currentTestimonial.company}</div>
                    </>
                  )}
                </div>

                {/* Product & Tier Badges */}
                <div className="flex gap-2 mt-4">
                  {currentTestimonial.product && (
                    <Badge variant="default" className="text-xs">
                      {currentTestimonial.product.replace('-', ' ').toUpperCase()}
                    </Badge>
                  )}
                  {currentTestimonial.tier && (
                    <Badge variant="gold" className="text-xs">
                      {currentTestimonial.tier.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {showArrows && testimonials.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center text-white hover:border-brand hover:text-brand transition-colors z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center text-white hover:border-brand hover:text-brand transition-colors z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {showDots && testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-brand w-8'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-scroll Indicator */}
      {autoScroll && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500'}`} />
            <span>{isPaused ? 'Paused' : 'Auto-scrolling'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
