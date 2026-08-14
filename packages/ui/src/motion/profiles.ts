// HoloKai Advanced Motion Profiles

// The "Humanoid Sync" profile blends a natural biological delay (classical weight) 
// with hyper-responsive AI tracking. Perfect for interactive hover states.
export const humanoidSyncTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 24,
  mass: 1.2,
  restDelta: 0.001
};

// The "Ancient Epistemic" profile is slow, deliberate, and smooth, reminiscent of 
// heavy stone or ancient mechanisms moving effortlessly via anti-gravity.
export const ancientEpistemicTransition = {
  type: "tween" as const,
  ease: [0.25, 0.1, 0.25, 1] as const, // easeInOut cubic-like
  duration: 0.8
};

// The "Ultra-Realistic" profile provides physics-based entrance animations 
// mimicking physical objects being placed into a spatial UI.
export const ultraRealisticEntrance = {
  type: "spring" as const,
  stiffness: 120,
  damping: 14,
  mass: 1,
  bounce: 0.2
};

// The "Scientific UI" profile is snappy, deterministic, and precise. 
// Best for data points, tooltips, and rapid UI state changes.
export const scientificUITransition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 40,
  mass: 0.5
};

// 3. Classical Mechanics Transition
// A smooth, predictable, elegant transition suitable for traditional premium interfaces
export const classicalMechanicsTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.6,
};

// 4. Quantum Sync Transition
// A sharp, instantaneous-feeling entrance with high stiffness, ideal for data-heavy rapid loading
export const quantumSyncTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

export const HoloKaiEntranceVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: ancientEpistemicTransition
  },
  // Allows switching the profile dynamically
  visibleHumanoid: {
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: humanoidSyncTransition
  },
  visibleClassical: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: classicalMechanicsTransition
  },
  visibleQuantum: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: quantumSyncTransition
  }
};

export const holokaiVariants = {
  // Use for cards entering the viewport (scroll or initial load)
  cardEntrance: {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: ultraRealisticEntrance
    }
  },
  // Use for orchestrating multiple children (e.g. grids of data)
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }
};
