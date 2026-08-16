'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from './Button';
import { Badge } from './Badge';
import { holokaiVariants, humanoidSyncTransition } from '../motion/profiles';
import SplineScene from '@splinetool/react-spline';
import type { Product } from '@holokai/contracts';

export interface ProductCard3DProps {
  product: Product;
  featured?: boolean;
  onLearnMore?: (product: Product) => void;
}

export function ProductCard3D({ product, featured, onLearnMore }: ProductCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };
  
  return (
    <motion.div
      ref={cardRef}
      variants={holokaiVariants.cardEntrance}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex flex-col p-6 rounded-2xl bg-background border transition-all duration-300 cursor-pointer ${
        featured 
          ? 'border-border-strong shadow-glow-brand' 
          : 'border-white/10 hover:border-white/30'
      }`}
      onClick={() => onLearnMore?.(product)}
    >
      {/* 3D Scene Background */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-30 pointer-events-none">
          <SplineScene
            scene="https://prod.spline.design/your-scene-url.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
      
      {/* Glowing Border Effect */}
      {featured && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.15), transparent 50%)',
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon/Visual */}
        <div className="w-full h-32 mb-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5 flex items-center justify-center relative overflow-hidden">
          {product.icon && (
            <div className="text-4xl text-brand">
              {/* Icon would be rendered here using lucide-react */}
              <span className="opacity-50">ICON</span>
            </div>
          )}
          {product.badge && (
            <Badge variant={featured ? 'gold' : 'default'} className="absolute top-2 right-2">
              {product.badge}
            </Badge>
          )}
        </div>
        
        {/* Product Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white leading-tight mb-2">{product.name}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>
        
        {/* Use Cases Preview */}
        {product.useCases && product.useCases.length > 0 && (
          <div className="mb-4 flex-1">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Use Cases</div>
            <div className="space-y-2">
              {product.useCases.slice(0, 2).map((useCase) => (
                <div key={useCase.id} className="text-xs text-zinc-400 flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  <span className="line-clamp-1">{useCase.title}</span>
                </div>
              ))}
              {product.useCases.length > 2 && (
                <div className="text-xs text-zinc-500">
                  +{product.useCases.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Pricing */}
        {product.price && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-brand">
              {product.price.displayString || `$${product.price.amount}`}
            </span>
            {product.price.period && (
              <span className="text-sm text-zinc-400 ml-1">/{product.price.period}</span>
            )}
          </div>
        )}
        
        {/* CTA Button */}
        <Button
          variant={featured ? 'primary' : 'secondary'}
          className="w-full mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            onLearnMore?.(product);
          }}
        >
          Learn More
        </Button>
      </div>
      
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)',
        }}
        animate={{
          x: isHovered ? '100%' : '-100%',
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}
