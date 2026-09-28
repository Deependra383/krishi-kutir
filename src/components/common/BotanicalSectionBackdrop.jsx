import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import {
  LeafCotyledon,
  LeafBasil,
  LeafAmaranth,
  LeafAutumnGold,
  LeafCurvedShoot,
  LeafHerbal,
  FruitWildBerry,
  FruitCitrus,
  FruitJamunBerry,
  FruitCherry,
  FruitSeaBuckthorn,
  FruitBlueberries,
  FruitLimeSlice,
  FruitBabyTomato,
  FruitPhoto,
  FRUIT_PHOTOS
} from './FloatingLeavesBackground';

// Re-export for any existing consumers
export {
  FruitSeaBuckthorn,
  FruitBlueberries,
  FruitLimeSlice,
  FruitBabyTomato,
  FruitPhoto,
  FRUIT_PHOTOS
};

/**
 * Speed presets for multi-tier parallax scrolling using Framer Motion.
 * Allows fruits and leaves to glide at distinctly different speeds than the page scroll,
 * creating an authentic 3D botanical depth behind the main cards.
 */
const SPEED_PRESETS = {
  // Fast / Foreground layer: moves noticeably faster than normal scroll rate
  fast: {
    y: [-125, 145],
    x: [-14, 16],
    rot: [-24, 26],
    spring: { stiffness: 75, damping: 16, mass: 0.3 }
  },
  // Medium / Midground layer: steady, balanced parallax travel
  medium: {
    y: [-65, 80],
    x: [-8, 10],
    rot: [-15, 17],
    spring: { stiffness: 60, damping: 18, mass: 0.35 }
  },
  // Slow / Deep background layer: subtle, distant floating effect
  slow: {
    y: [-28, 36],
    x: [-4, 4],
    rot: [-9, 10],
    spring: { stiffness: 45, damping: 20, mass: 0.4 }
  },
  // Counter-parallax: glides in opposite vertical direction for high visual contrast
  counter: {
    y: [65, -75],
    x: [12, -12],
    rot: [18, -18],
    spring: { stiffness: 65, damping: 17, mass: 0.35 }
  },
  // Drift: 2D lateral sway combined with vertical translation
  drift: {
    y: [-90, 105],
    x: [-26, 28],
    rot: [-20, 22],
    spring: { stiffness: 55, damping: 18, mass: 0.35 }
  }
};

/**
 * Reusable individual floating botanical leaf or fruit
 * - Multi-speed Parallax Scrolling using Framer Motion (useScroll, useTransform, useSpring)
 * - Supports depth tiers ('fast', 'medium', 'slow', 'counter', 'drift') or custom ranges
 * - Strict layering: sits behind all card components (z-0) with pointer-events-none
 * - Organic gentle ambient breathing when idle
 */
const FloatingBotanical = ({
  children,
  className = "",
  scrollYProgress,
  speed = "medium",
  yRange,
  xRange,
  rotRange,
  ambientDuration = 5.0,
  ambientY = 3.0,
  springConfig
}) => {
  const preset = SPEED_PRESETS[speed] || SPEED_PRESETS.medium;
  const effectiveY = yRange || preset.y;
  const effectiveX = xRange || preset.x;
  const effectiveRot = rotRange || preset.rot;
  const effectiveSpring = springConfig || preset.spring;

  const windowScroll = useScroll();
  const activeProgress = scrollYProgress || windowScroll.scrollYProgress;

  const rawY = useTransform(activeProgress, [0, 1], effectiveY);
  const rawX = useTransform(activeProgress, [0, 1], effectiveX);
  const rawRot = useTransform(activeProgress, [0, 1], effectiveRot);

  const y = useSpring(rawY, effectiveSpring);
  const x = useSpring(rawX, effectiveSpring);
  const rotate = useSpring(rawRot, effectiveSpring);

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
 * BotanicalSectionBackdrop
 * 
 * Scattered background botanicals and authentic fruits positioned in organic, non-linear constellations
 * behind section cards. Supports parallax speeds and zero card overlap.
 */
export const BotanicalSectionBackdrop = ({ 
  variant = "general", 
  showSoftGlows = true,
  scrollYProgress: externalScrollYProgress,
  className = "" 
}) => {
  const backdropRef = useRef(null);
  const internalScroll = useScroll({
    target: backdropRef,
    offset: ["start end", "end start"]
  });

  const scrollYProgress = externalScrollYProgress || internalScroll.scrollYProgress;

  return (
    <div 
      ref={backdropRef}
      className={`absolute inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Soft Ambient Radial Tint Glows */}
      {showSoftGlows && (
        <>
          <div className="absolute top-[10%] -left-32 w-96 h-96 rounded-full bg-emerald-100/35 blur-3xl pointer-events-none" />
          <div className="absolute top-[50%] -right-32 w-96 h-96 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[10%] left-1/3 w-96 h-96 rounded-full bg-rose-100/20 blur-3xl pointer-events-none" />
        </>
      )}

      {/* ========================================================================= */}
      {/* 1. VARIANT: ABOUT & PHILOSOPHY (MATCHING SCREENSHOT 60 CIRCLES + SCATTERED) */}
      {/* ========================================================================= */}
      {variant === "about" && (
        <>
          {/* USER CIRCLE 1: Top Corridor above Title */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[6%] sm:top-[7%] left-[33%] sm:left-[36%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafCotyledon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 2: Top Center Corridor between Title & Founders */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[8%] sm:top-[10%] left-[50%] sm:left-[52%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 3: Top Right above "Meet Our Founders" */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[14%] sm:top-[16%] left-[71%] sm:left-[74%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 4: Far Top-Right Corner */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[6%] sm:top-[7%] right-[10%] sm:right-[13%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitBabyTomato className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 5: Bottom Left below 100% Residue Free cards */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="bottom-[7%] sm:bottom-[9%] left-[3%] sm:left-[5%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Fresh Orange" className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafCurvedShoot className="w-7 h-9 sm:w-8 sm:h-10" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 6: Bottom Center under Founders card */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="bottom-[4%] sm:bottom-[5%] left-[58%] sm:left-[62%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
              <FruitJamunBerry className="w-6 h-6 sm:w-7 sm:h-7" />
              <LeafBasil className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          </FloatingBotanical>

          {/* Non-linear Scattered Flank Items (staggered horizontally so NEVER a straight line) */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[12%] left-[2%] sm:left-[4%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[24%] left-[10%] sm:left-[14%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[45%] left-[3%] sm:left-[6%] opacity-95">
            <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[68%] left-[9%] sm:left-[12%] opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[28%] right-[3%] sm:right-[5%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[48%] right-[11%] sm:right-[15%] opacity-95">
            <FruitCherry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[72%] right-[2%] sm:right-[4%] opacity-90">
            <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="bottom-[5%] right-[9%] sm:right-[12%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. VARIANT: PRODUCT CATALOG (MATCHING SCREENSHOT 61 CIRCLES + SCATTERED) */}
      {/* ========================================================================= */}
      {variant === "catalog" && (
        <>
          {/* USER CIRCLE 1: Top-Left above search bar, left of heading */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[8%] sm:top-[9%] left-[18%] sm:left-[20%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 2: Left Upper-Mid Flank */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[20%] sm:top-[22%] left-[6%] sm:left-[8%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
              <LeafCotyledon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 3: Left Inner-Mid (below search bar on the left) */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[33%] sm:top-[35%] left-[18%] sm:left-[21%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 4: Left Lower-Outer Flank */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[48%] sm:top-[51%] left-[3%] sm:left-[5%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 5: Left Bottom Corner */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="bottom-[3%] sm:bottom-[4%] left-[3%] sm:left-[4%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitBabyTomato className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 6: Top-Right above heading / category */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[8%] sm:top-[9%] right-[22%] sm:right-[25%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 7: Far Top-Right Corner */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[14%] sm:top-[16%] right-[8%] sm:right-[10%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitCherry className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 8: Right Inner-Mid (below search bar on right) */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[35%] sm:top-[38%] right-[18%] sm:right-[21%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 9: Right Lower-Outer Flank */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[58%] sm:top-[61%] right-[2%] sm:right-[4%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
              <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 10: Bottom Center below Category Pills */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="bottom-[2%] sm:bottom-[3%] left-[31%] sm:left-[34%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafCurvedShoot className="w-7 h-9 sm:w-8 sm:h-10" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 11: Bottom Right */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="bottom-[2%] sm:bottom-[3%] right-[9%] sm:right-[12%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* Scattered Intermediate Items along Catalog Height (varied X depth) */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[42%] left-[10%] sm:left-[13%] opacity-90">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[68%] left-[11%] sm:left-[14%] opacity-95">
            <LeafCurvedShoot className="w-7 h-9 sm:w-8 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[82%] left-[4%] sm:left-[6%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Raspberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[48%] right-[11%] sm:right-[14%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[73%] right-[12%] sm:right-[15%] opacity-90">
            <FruitJamunBerry className="w-6 h-6 sm:w-7 sm:h-7" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[85%] right-[3%] sm:right-[5%] opacity-95">
            <FruitBabyTomato className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. VARIANT: CERTIFICATIONS (MATCHING SCREENSHOT 62 CIRCLES + SCATTERED) */}
      {/* ========================================================================= */}
      {(variant === "certifications" || variant === "general") && (
        <>
          {/* USER CIRCLE 1: Top-Left (below facility cards) */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[10%] sm:top-[12%] left-[8%] sm:left-[10%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
              <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 2: Top Mid-Left (above Certifications Title) */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[16%] sm:top-[18%] left-[27%] sm:left-[30%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 3: Left Flank Upper */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[35%] sm:top-[38%] left-[2%] sm:left-[3%] opacity-90">
            <div className="flex items-center gap-1.5">
              <FruitBabyTomato className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 4: Bottom-Left Far Outer Corner */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="bottom-[4%] sm:bottom-[5%] left-[2%] sm:left-[3%] opacity-90">
            <div className="flex items-center gap-1.5">
              <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafCurvedShoot className="w-7 h-9 sm:w-8 sm:h-10" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 5: Top Mid-Right (above Certifications Title) */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[18%] sm:top-[20%] right-[18%] sm:right-[21%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 6: Far Top Right */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[12%] sm:top-[14%] right-[3%] sm:right-[4%] opacity-95">
            <div className="flex items-center gap-1.5">
              <FruitCherry className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 7: Far Right Upper Flank */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[35%] sm:top-[38%] right-[2%] sm:right-[3%] opacity-90">
            <div className="flex items-center gap-1.5">
              <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
              <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>

          {/* USER CIRCLE 8: Bottom-Right Far Outer Corner */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="bottom-[4%] sm:bottom-[5%] right-[2%] sm:right-[3%] opacity-90">
            <div className="flex items-center gap-1.5">
              <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
              <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </FloatingBotanical>
        </>
      )}

      {/* ========================================================================= */}
      {/* 4. VARIANT: PARTNER WITH US (ORGANIC SCATTERED) */}
      {/* ========================================================================= */}
      {variant === "partner" && (
        <>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[2%] left-[4%] sm:left-[7%] opacity-90">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[3%] left-[22%] sm:left-[26%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[2%] right-[22%] sm:right-[26%] opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[2%] right-[4%] sm:right-[7%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[18%] left-[2%] sm:left-[4%] opacity-95">
            <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[28%] left-[10%] sm:left-[14%] opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[40%] left-[3%] sm:left-[5%] opacity-95">
            <FruitBabyTomato className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[52%] left-[12%] sm:left-[16%] opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[64%] left-[2%] sm:left-[4%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[18%] right-[11%] sm:right-[15%] opacity-95">
            <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[28%] right-[2%] sm:right-[4%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[40%] right-[12%] sm:right-[16%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[52%] right-[2%] sm:right-[4%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[64%] right-[10%] sm:right-[14%] opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* Infrastructure Corridor */}
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[72%] left-[3%] sm:left-[6%] opacity-90">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[73%] left-[18%] sm:left-[22%] opacity-95">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[72%] right-[18%] sm:right-[22%] opacity-95">
            <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[73%] right-[3%] sm:right-[6%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[85%] left-[2%] sm:left-[5%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[85%] right-[2%] sm:right-[5%] opacity-95">
            <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="bottom-4 left-[3%] sm:left-[6%] opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="bottom-4 right-[3%] sm:right-[6%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
        </>
      )}

      {/* ========================================================================= */}
      {/* 5. VARIANT: INQUIRY DESK / CUSTOM ORDER (SCATTERED) */}
      {/* ========================================================================= */}
      {variant === "inquiry" && (
        <>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[6%] left-[2%] sm:left-[5%] opacity-90">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[22%] left-[11%] sm:left-[15%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[38%] left-[2%] sm:left-[4%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[54%] left-[10%] sm:left-[14%] opacity-95">
            <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[70%] left-[2%] sm:left-[4%] opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[86%] left-[11%] sm:left-[15%] opacity-95">
            <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[6%] right-[11%] sm:right-[15%] opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[22%] right-[2%] sm:right-[4%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[38%] right-[12%] sm:right-[16%] opacity-95">
            <FruitCherry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[54%] right-[2%] sm:right-[4%] opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[70%] right-[11%] sm:right-[15%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[86%] right-[2%] sm:right-[4%] opacity-90">
            <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ========================================================================= */}
      {/* 6. VARIANT: POWDERS & SPICES (SCATTERED) */}
      {/* ========================================================================= */}
      {variant === "powders" && (
        <>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-2 left-[3%] sm:left-[6%] opacity-95">
            <FruitSeaBuckthorn className="w-10 h-10 sm:w-11 sm:h-11" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-4 left-[20%] sm:left-[24%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-2 left-[38%] sm:left-[42%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-1 left-1/2 -translate-x-1/2 opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-2 right-[36%] sm:right-[40%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-4 right-[18%] sm:right-[22%] opacity-95">
            <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-2 right-[3%] sm:right-[6%] opacity-95">
            <FruitWildBerry className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>

          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[22%] left-[2%] sm:left-[4%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[36%] left-[10%] sm:left-[14%] opacity-95">
            <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[50%] left-[2%] sm:left-[4%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[64%] left-[11%] sm:left-[15%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[78%] left-[2%] sm:left-[4%] opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[90%] left-[10%] sm:left-[14%] opacity-95">
            <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[22%] right-[11%] sm:right-[15%] opacity-95">
            <FruitWildBerry className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[36%] right-[2%] sm:right-[4%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[50%] right-[11%] sm:right-[15%] opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[64%] right-[2%] sm:right-[4%] opacity-95">
            <FruitCherry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[78%] right-[11%] sm:right-[15%] opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[90%] right-[2%] sm:right-[4%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
        </>
      )}

      {/* ========================================================================= */}
      {/* 7. VARIANT: MICROGREENS (SCATTERED) */}
      {/* ========================================================================= */}
      {variant === "microgreens" && (
        <>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[3%] left-[2%] sm:left-[4%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[12%] left-[10%] sm:left-[14%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[21%] left-[2%] sm:left-[4%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[30%] left-[11%] sm:left-[15%] opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[39%] left-[2%] sm:left-[5%] opacity-90">
            <LeafCurvedShoot className="w-7 h-10 sm:w-8 sm:h-11" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[48%] left-[11%] sm:left-[15%] opacity-95">
            <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[57%] left-[2%] sm:left-[4%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[66%] left-[10%] sm:left-[14%] opacity-95">
            <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[75%] left-[2%] sm:left-[4%] opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[84%] left-[11%] sm:left-[15%] opacity-95">
            <FruitBabyTomato className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[93%] left-[2%] sm:left-[4%] opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[3%] right-[10%] sm:right-[14%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[12%] right-[2%] sm:right-[4%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[21%] right-[11%] sm:right-[15%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[30%] right-[2%] sm:right-[4%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[39%] right-[11%] sm:right-[15%] opacity-95">
            <FruitCherry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[48%] right-[2%] sm:right-[4%] opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-[57%] right-[11%] sm:right-[15%] opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-[66%] right-[2%] sm:right-[4%] opacity-95">
            <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-[75%] right-[11%] sm:right-[15%] opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-[84%] right-[2%] sm:right-[4%] opacity-95">
            <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-[93%] right-[10%] sm:right-[14%] opacity-90">
            <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ========================================================================= */}
      {/* 8. VARIANT: PRODUCT DIVISIONS (SCATTERED) */}
      {/* ========================================================================= */}
      {variant === "divisions" && (
        <>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-4 left-[2%] sm:left-[5%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-20 left-[12%] sm:left-[16%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-4 right-[12%] sm:right-[16%] opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-20 right-[2%] sm:right-[5%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-1/2 left-[2%] sm:left-[5%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-1/2 right-[11%] sm:right-[15%] opacity-95">
            <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="bottom-6 left-[10%] sm:left-[14%] opacity-95">
            <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="bottom-6 right-[2%] sm:right-[5%] opacity-95">
            <FruitCherry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ========================================================================= */}
      {/* 9. VARIANT: TRAINING ACADEMY (VIBRANT FRUITS & LEAVES PARALLAX) */}
      {/* ========================================================================= */}
      {variant === "training" && (
        <>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="top-4 left-[2%] sm:left-[5%] opacity-95">
            <FruitSeaBuckthorn className="w-9 h-9 sm:w-10 sm:h-10" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-14 left-[12%] sm:left-[16%] opacity-95">
            <FruitWildBerry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="top-4 right-[11%] sm:right-[15%] opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="top-14 right-[2%] sm:right-[5%] opacity-95">
            <FruitLimeSlice className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="top-1/2 left-[2%] sm:left-[5%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="drift" className="top-1/2 right-[12%] sm:right-[16%] opacity-95">
            <FruitBlueberries className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="slow" className="bottom-4 left-[11%] sm:left-[15%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="fast" className="bottom-4 right-[2%] sm:right-[5%] opacity-95">
            <FruitCitrus className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="counter" className="bottom-16 left-[2%] sm:left-[4%] opacity-95">
            <FruitCherry className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} speed="medium" className="bottom-16 right-[12%] sm:right-[16%] opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

    </div>
  );
};
