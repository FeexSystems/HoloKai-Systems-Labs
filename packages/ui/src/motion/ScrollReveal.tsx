'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { holokaiVariants } from './profiles';

export interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  /** Delay in seconds before the reveal animation starts */
  delay?: number;
  /** Only animate once when entering viewport */
  once?: boolean;
  /** Fraction of element visible before triggering (0–1) */
  amount?: number;
}

/**
 * Scroll-triggered reveal wrapper using Framer Motion's viewport detection
 * (Intersection Observer under the hood).
 */
export function ScrollReveal({
  children,
  delay = 0,
  once = true,
  amount = 0.2,
  className,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      variants={holokaiVariants.cardEntrance}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: '-60px' }}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface ScrollRevealStaggerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  once?: boolean;
  amount?: number;
}

/**
 * Staggered scroll reveal for grids and lists of children.
 */
export function ScrollRevealStagger({
  children,
  once = true,
  amount = 0.15,
  className,
  ...props
}: ScrollRevealStaggerProps) {
  return (
    <motion.div
      variants={holokaiVariants.staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: '-60px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

ScrollReveal.displayName = 'ScrollReveal';
ScrollRevealStagger.displayName = 'ScrollRevealStagger';
