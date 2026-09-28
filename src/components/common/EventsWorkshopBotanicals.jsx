import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import {
  LeafCotyledon,
  LeafBasil,
  LeafAutumnGold,
  LeafCurvedShoot,
  LeafHerbal,
  FruitJamunBerry,
  FruitBabyTomato,
  FruitLimeSlice
} from './FloatingLeavesBackground';

/**
 * Gentle speed presets for subtle parallax scrolling in Events & Workshop footprint.
 */
const SPEED_PRESETS = {
  slow: {
    y: [-25, 30],
    x: [-4, 4],
    rot: [-10, 10],
    spring: { stiffness: 45, damping: 20, mass: 0.4 }
  },
  medium: {
    y: [-40, 45],
    x: [-6, 6],
    rot: [-14, 15],
    spring: { stiffness: 55, damping: 18, mass: 0.35 }
  },
  drift: {
    y: [-50, 55],
    x: [-12, 12],
    rot: [-16, 16],
    spring: { stiffness: 50, damping: 18, mass: 0.35 }
  }
};

/**
 * Individual Floating Botanical or Fruit Item
 * - Sits strictly in background layer (z-0) with pointer-events-none.
 * - Scattered exclusively in outer margin gutters so it never crowds text or cards.
 */
const FloatingItem = ({
  scrollYProgress,
  speed = "slow",
  ambientDuration = 5,
  ambientY = 2,
  className = "",
  children
}) => {
  const preset = SPEED_PRESETS[speed] || SPEED_PRESETS.slow;
  const windowScroll = useScroll();
  const activeProgress = scrollYProgress || windowScroll.scrollYProgress;

  const rawY = useTransform(activeProgress, [0, 1], preset.y);
  const rawX = useTransform(activeProgress, [0, 1], preset.x);
  const rawRot = useTransform(activeProgress, [0, 1], preset.rot);
  
  const y = useSpring(rawY, preset.spring);
  const x = useSpring(rawX, preset.spring);
  const rotate = useSpring(rawRot, preset.spring);

  return (
    <motion.div
      style={{ y, x, rotate }}
      className={`absolute z-0 pointer-events-none select-none filter drop-shadow-sm ${className}`}
    >
      <motion.div
        animate={{ y: [-ambientY, ambientY, -ambientY] }}
        transition={{ repeat: Infinity, duration: ambientDuration, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

/**
 * EventsWorkshopBotanicals
 * 
 * Clean, reduced, and widely scattered botanical accents positioned
 * strictly in the outer margins of the "OUR EVENTS & WORKSHOP FOOTPRINT" section.
 * The heading area and card center corridors are kept 100% CLEAR of clutter.
 */
export const EventsWorkshopBotanicals = ({ scrollYProgress: externalScrollYProgress }) => {
  const containerRef = useRef(null);
  const internalScroll = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scrollYProgress = externalScrollYProgress || internalScroll.scrollYProgress;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-visible" aria-hidden="true">
      
      {/* 1. Far Upper-Left Outer Flank (well above Card 1 in the outer left margin, clear of heading) */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        speed="medium"
        className="top-0 sm:top-1 left-[1%] sm:left-[3%] opacity-85"
      >
        <div className="flex items-center gap-1.5">
          <FruitBabyTomato className="w-6 h-6 sm:w-7 sm:h-7" />
          <LeafCurvedShoot className="w-5 h-7 sm:w-6 sm:h-8" />
        </div>
      </FloatingItem>

      {/* 2. Far Upper-Right Outer Flank (well above Card 3 in the outer right margin, clear of heading) */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        speed="slow"
        className="top-1 sm:top-2 right-[1%] sm:right-[3%] opacity-85"
      >
        <div className="flex items-center gap-1.5">
          <FruitLimeSlice className="w-6 h-6 sm:w-7 sm:h-7" />
          <LeafAutumnGold className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </FloatingItem>

      {/* 3. Far Lower-Left Margin (below Card 1 near left corner) */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        speed="drift"
        className="bottom-1 sm:bottom-0 left-[2%] sm:left-[5%] opacity-80"
      >
        <div className="flex items-center gap-1.5">
          <LeafHerbal className="w-6 h-6 sm:w-7 sm:h-7" />
          <FruitJamunBerry className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </FloatingItem>

      {/* 4. Far Lower-Right Margin (below Card 3 near right corner) */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        speed="slow"
        className="bottom-1 sm:bottom-0 right-[2%] sm:right-[5%] opacity-80"
      >
        <div className="flex items-center gap-1.5">
          <LeafBasil className="w-6 h-6 sm:w-7 sm:h-7" />
          <LeafCotyledon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </FloatingItem>

    </div>
  );
};
