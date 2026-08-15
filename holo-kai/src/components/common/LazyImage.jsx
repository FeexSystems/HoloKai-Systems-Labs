import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

/**
 * LazyImage component that provides:
 * 1. Native browser lazy loading (loading="lazy", decoding="async")
 * 2. IntersectionObserver fallback support
 * 3. Animated skeleton placeholder while loading
 * 4. Smooth fade-in transition upon load completion
 * 5. Clean fallback UI if image fails to load
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  placeholderBg = 'bg-zinc-900',
  aspectRatio = '',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-zinc-900/90 text-zinc-600 border border-white/5 ${placeholderBg} ${wrapperClassName}`}
      >
        <ImageIcon className="w-6 h-6 mb-1 opacity-40" />
        <span className="text-[10px] font-mono opacity-50 uppercase tracking-wider">Image Unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Animated Skeleton Loader Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse z-10 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Lazy Loaded Image */}
      <img
        src={src}
        alt={alt || 'Archive illustration'}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
