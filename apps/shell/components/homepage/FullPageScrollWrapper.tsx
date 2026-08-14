'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FullPageScrollWrapperProps {
  children: React.ReactNode;
  onSectionChange?: (index: number) => void;
  onSectionTransitionStart?: (fromIndex: number, toIndex: number) => void;
  onSectionTransitionEnd?: (index: number) => void;
  scrollDelay?: number;
}

export function FullPageScrollWrapper({ 
  children, 
  onSectionChange, 
  onSectionTransitionStart, 
  onSectionTransitionEnd,
  scrollDelay = 1000 
}: FullPageScrollWrapperProps) {
  const childrenArray = React.Children.toArray(children).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(1);
  const isScrolling = useRef(false);
  const previousIndex = useRef(0);

  useEffect(() => {
    // We only attach event listeners on the client side
    const handleWheel = (e: WheelEvent) => {
      // If the user is scrolling inside a scrollable element (e.g. FAQ or long text), don't hijack!
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest('.allow-scroll');
      if (scrollableParent) {
        // Only skip if there's actually room to scroll in the direction they are scrolling
        const isScrollingDown = e.deltaY > 0;
        const canScrollDown = scrollableParent.scrollTop + scrollableParent.clientHeight < scrollableParent.scrollHeight - 1;
        const canScrollUp = scrollableParent.scrollTop > 0;

        if ((isScrollingDown && canScrollDown) || (!isScrollingDown && canScrollUp)) {
          return; // Let the browser handle inner scroll naturally
        }
      }

      e.preventDefault();
      if (isScrolling.current) return;

      const threshold = 30; // sensitivity
      if (e.deltaY > threshold && activeIndex < childrenArray.length - 1) {
        isScrolling.current = true;
        setScrollDirection(1);
        previousIndex.current = activeIndex;
        onSectionTransitionStart?.(activeIndex, activeIndex + 1);
        setActiveIndex(prev => prev + 1);
        setTimeout(() => { isScrolling.current = false; }, scrollDelay);
      } else if (e.deltaY < -threshold && activeIndex > 0) {
        isScrolling.current = true;
        setScrollDirection(-1);
        previousIndex.current = activeIndex;
        onSectionTransitionStart?.(activeIndex, activeIndex - 1);
        setActiveIndex(prev => prev - 1);
        setTimeout(() => { isScrolling.current = false; }, scrollDelay);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { 
      touchStartY = e.touches[0].clientY; 
    };
    const handleTouchMove = (e: TouchEvent) => {
      // Only prevent default if we're not inside an allow-scroll element that can scroll
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest('.allow-scroll');
      if (scrollableParent) {
        const touchCurrentY = e.touches[0].clientY;
        const isScrollingDown = touchStartY > touchCurrentY;
        const canScrollDown = scrollableParent.scrollTop + scrollableParent.clientHeight < scrollableParent.scrollHeight - 1;
        const canScrollUp = scrollableParent.scrollTop > 0;

        if ((isScrollingDown && canScrollDown) || (!isScrollingDown && canScrollUp)) {
          return; // Let browser handle it
        }
      }
      e.preventDefault(); 
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY - touchEndY;
      if (delta > 50 && activeIndex < childrenArray.length - 1) {
        isScrolling.current = true;
        setScrollDirection(1);
        previousIndex.current = activeIndex;
        onSectionTransitionStart?.(activeIndex, activeIndex + 1);
        setActiveIndex(prev => prev + 1);
        setTimeout(() => { isScrolling.current = false; }, scrollDelay);
      } else if (delta < -50 && activeIndex > 0) {
        isScrolling.current = true;
        setScrollDirection(-1);
        previousIndex.current = activeIndex;
        onSectionTransitionStart?.(activeIndex, activeIndex - 1);
        setActiveIndex(prev => prev - 1);
        setTimeout(() => { isScrolling.current = false; }, scrollDelay);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeIndex, childrenArray.length, scrollDelay, onSectionTransitionStart]);

  // Call callbacks when section changes
  useEffect(() => {
    if (activeIndex !== previousIndex.current) {
      onSectionChange?.(activeIndex);
      // Call transition end after animation completes
      setTimeout(() => {
        onSectionTransitionEnd?.(activeIndex);
      }, 900); // Matches the transition duration
    }
  }, [activeIndex, onSectionChange, onSectionTransitionEnd]);

  return (
    <div className="w-full h-screen fixed inset-0 overflow-hidden bg-[#05050a] text-white">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
         <motion.div 
           className="w-[800px] h-[800px] rounded-full bg-[var(--color-brand)]/5 blur-[120px] absolute top-1/2 left-1/2"
           animate={{
             x: `calc(-50% + ${Math.sin(activeIndex) * 200}px)`,
             y: `calc(-50% + ${Math.cos(activeIndex) * 200}px)`,
             scale: 1 + (activeIndex % 2) * 0.2
           }}
           transition={{ duration: 2, ease: "easeInOut" }}
         />
      </div>

      <AnimatePresence initial={false} custom={scrollDirection}>
        <motion.div
          key={activeIndex}
          custom={scrollDirection}
          variants={{
            enter: (direction: number) => ({
              opacity: 0,
              y: direction > 0 ? 50 : -50,
              scale: 0.95,
              filter: 'blur(10px)',
            }),
            center: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
            },
            exit: (direction: number) => ({
              opacity: 0,
              y: direction > 0 ? -50 : 50,
              scale: 1.05,
              filter: 'blur(10px)',
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ 
            duration: scrollDelay / 1000, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="absolute inset-0 flex flex-col justify-center items-center w-full h-full"
        >
          {/* Note: 'allow-scroll' class lets users scroll long sections natively before triggering a slide change */}
          <div className="w-full h-full relative z-10 overflow-y-auto overflow-x-hidden scrollbar-none allow-scroll flex flex-col justify-center">
            {childrenArray[activeIndex]}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Progress Navigation Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 mix-blend-difference">
        {childrenArray.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isScrolling.current || idx === activeIndex) return;
              setScrollDirection(idx > activeIndex ? 1 : -1);
              setActiveIndex(idx);
            }}
            className="group relative flex items-center justify-center p-2"
            aria-label={`Go to section ${idx + 1}`}
          >
            <span 
              className={`absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest ${
                activeIndex === idx ? 'text-[var(--color-brand)]' : 'text-white/50'
              }`}
            >
              0{idx + 1}
            </span>
            <div
              className={`w-1.5 rounded-full transition-all duration-700 ease-out ${
                activeIndex === idx 
                  ? 'h-8 bg-[var(--color-brand)] shadow-glow-brand' 
                  : 'h-1.5 bg-white/20 group-hover:bg-white/50 group-hover:h-3'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
