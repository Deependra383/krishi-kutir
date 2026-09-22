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
  FruitPhoto,
  FRUIT_PHOTOS
} from './FloatingLeavesBackground';

// Re-export for any existing consumers
export { FruitPhoto, FRUIT_PHOTOS };

/**
 * Reusable individual floating botanical or fruit photo
 * - Compact, organic size (w-7 to w-9, ~28px to 36px)
 * - Sits strictly in background layer (z-0) with pointer-events-none
 * - High-responsiveness spring physics (stiffness: 90, damping: 20, mass: 0.4) for smooth, noticeable scroll motion
 * - Organic soft drop shadow
 */
const FloatingBotanical = ({
  children,
  className = "",
  scrollYProgress,
  yRange = [-22, 28],
  rotRange = [-14, 16],
  ambientDuration = 4.8,
  ambientY = 2.5,
  springConfig = { stiffness: 90, damping: 20, mass: 0.4 }
}) => {
  const rawY = useTransform(scrollYProgress, [0, 1], yRange);
  const rawRot = useTransform(scrollYProgress, [0, 1], rotRange);
  const y = useSpring(rawY, springConfig);
  const rot = useSpring(rawRot, springConfig);

  return (
    <motion.div
      style={{ y, rotate: rot }}
      className={`absolute pointer-events-none select-none z-0 filter drop-shadow-sm ${className}`}
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
 * Injects realistic fruit photos and colourful leaves in the background gutters & open corridors
 * across main sections, moving dynamically with page scroll while guaranteeing ZERO card overlap.
 */
export const BotanicalSectionBackdrop = ({
  variant = "general",
  showSoftGlows = true,
  scrollYProgress: externalScrollYProgress
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
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" 
      aria-hidden="true"
    >
      {/* Soft atmospheric watercolor background glows */}
      {showSoftGlows && (
        <>
          <div className="absolute top-10 left-4 sm:left-12 w-96 h-96 bg-emerald-100/35 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-4 sm:right-12 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-amber-100/25 rounded-full blur-3xl pointer-events-none -z-10" />
        </>
      )}

      {/* ================= VARIANT: PARTNER WITH US (Matches Screenshots 54, 48, 47) ================= */}
      {variant === "partner" && (
        <>
          {/* ----- TOP BELT: Crowning & flanking "PARTNER WITH KRISHI KUTIR" (Screenshot 54) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[-15, 18]} className="top-2 left-[3%] sm:left-[6%] opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-18, 22]} rotRange={[14, -16]} className="top-4 left-[20%] sm:left-[24%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 14]} className="top-3 right-[20%] sm:right-[24%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[15, -15]} className="top-2 right-[3%] sm:right-[6%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-16, 20]} rotRange={[-12, 14]} className="top-12 left-[1%] sm:left-[3%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-7 h-7 sm:w-8 sm:h-8" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-18, 22]} rotRange={[14, -14]} className="top-12 right-[1%] sm:right-[3%] opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* ----- UPPER LEFT GUTTER: Alongside "Submit Partnership Inquiry" Form (Screenshots 54 & 48) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-15, 15]} className="top-[20%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[16, -18]} className="top-[30%] left-2 sm:left-4 lg:left-7 xl:left-10 opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[-14, 16]} className="top-[40%] left-1 sm:left-3 lg:left-5 xl:left-7 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.tomato} alt="Fresh Tomato" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 28]} rotRange={[15, -15]} className="top-[50%] left-2 sm:left-4 lg:left-8 xl:left-10 opacity-90">
            <LeafCurvedShoot className="w-7 h-10 sm:w-8 sm:h-11" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 26]} rotRange={[-16, 14]} className="top-[60%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.cucumber} alt="Fresh Cucumber" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* ----- CENTER GUTTER: Vertical Gap Between Form & Contact Desk (Screenshot 54) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-18, 22]} rotRange={[-12, 14]} className="top-[26%] left-1/2 -translate-x-1/2 opacity-85 hidden xl:block">
            <FruitPhoto src={FRUIT_PHOTOS.cherry} alt="Fresh Cherry" className="w-7 h-7 sm:w-8 sm:h-8" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[14, -14]} className="top-[42%] left-1/2 -translate-x-1/2 opacity-80 hidden xl:block">
            <LeafCotyledon className="w-8 h-8" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 25]} rotRange={[-15, 15]} className="top-[58%] left-1/2 -translate-x-1/2 opacity-85 hidden xl:block">
            <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Raspberry" className="w-7 h-7 sm:w-8 sm:h-8" />
          </FloatingBotanical>

          {/* ----- UPPER RIGHT GUTTER: Alongside "Rapid B2B Response" Desk (Screenshots 54 & 48) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[15, -16]} className="top-[20%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-16, 18]} className="top-[30%] right-2 sm:right-4 lg:right-7 xl:right-10 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[14, -15]} className="top-[40%] right-1 sm:right-3 lg:right-5 xl:right-7 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-15, 16]} className="top-[50%] right-2 sm:right-4 lg:right-8 xl:right-10 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[16, -14]} className="top-[60%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* ----- MID CORRIDOR: Above "OUR INFRASTRUCTURE & SUPPLY GUARANTEE" (Screenshot 47) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[-14, 15]} className="top-[71%] left-[2%] sm:left-[5%] opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 25]} rotRange={[15, -16]} className="top-[72%] left-[16%] sm:left-[20%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Raspberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-18, 22]} rotRange={[-12, 14]} className="top-[71%] left-[34%] sm:left-[38%] opacity-90">
            <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[14, -14]} className="top-[71%] right-[34%] sm:right-[38%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 25]} rotRange={[-15, 15]} className="top-[72%] right-[16%] sm:right-[20%] opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-19, 23]} rotRange={[14, -15]} className="top-[71%] right-[2%] sm:right-[5%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.radish} alt="Radish" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* ----- LOWER LEFT GUTTER: Alongside Infrastructure Cards (Screenshot 47) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-[80%] left-1 sm:left-3 lg:left-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-[88%] left-2 sm:left-4 lg:left-7 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[-14, 15]} className="bottom-4 left-1 sm:left-3 lg:left-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* ----- LOWER RIGHT GUTTER: Alongside Infrastructure Cards (Screenshot 47) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[16, -15]} className="top-[80%] right-1 sm:right-3 lg:right-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-15, 16]} className="top-[88%] right-2 sm:right-4 lg:right-7 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[14, -14]} className="bottom-4 right-1 sm:right-3 lg:right-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Raspberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ================= VARIANT: INQUIRY DESK / CUSTOM ORDER (Matches Screenshot 53) ================= */}
      {variant === "inquiry" && (
        <>
          {/* ----- LEFT GUTTER: 6 items along left margin outside order card (Screenshot 53) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-[6%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-[22%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[-14, 15]} className="top-[38%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 27]} rotRange={[16, -15]} className="top-[54%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-15, 16]} className="top-[70%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[14, -14]} className="top-[86%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.cucumber} alt="Fresh Cucumber" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* ----- RIGHT GUTTER: 6 items along right margin outside order card (Screenshot 53) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[16, -16]} className="top-[6%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-15, 16]} className="top-[22%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[14, -15]} className="top-[38%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 27]} rotRange={[-16, 15]} className="top-[54%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[15, -16]} className="top-[70%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Fresh Raspberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-14, 14]} className="top-[86%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-90">
            <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ================= VARIANT: POWDERS & SPICES (Matches Screenshot 50) ================= */}
      {variant === "powders" && (
        <>
          {/* ----- TOP CORRIDOR: Crowning & flanking "HERBAL POWDERS, SPICES & SEASONING" (Screenshot 50) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[-15, 18]} className="top-2 left-[3%] sm:left-[6%] opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-18, 22]} rotRange={[14, -16]} className="top-4 left-[18%] sm:left-[22%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 14]} className="top-2 left-[36%] sm:left-[40%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[15, -15]} className="top-2 right-[36%] sm:right-[40%] opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-18, 22]} rotRange={[-14, 14]} className="top-4 right-[18%] sm:right-[22%] opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[15, -18]} className="top-2 right-[3%] sm:right-[6%] opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* ----- LEFT GUTTER: Alongside category buttons and product cards (Screenshot 50) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-15, 15]} className="top-[24%] left-1 sm:left-3 lg:left-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[16, -18]} className="top-[40%] left-2 sm:left-4 lg:left-8 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[-14, 16]} className="top-[56%] left-1 sm:left-3 lg:left-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.tomato} alt="Fresh Tomato" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 28]} rotRange={[15, -15]} className="top-[72%] left-2 sm:left-4 lg:left-8 opacity-90">
            <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 26]} rotRange={[-16, 14]} className="top-[88%] left-1 sm:left-3 lg:left-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.cucumber} alt="Cucumber" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* ----- RIGHT GUTTER: Alongside category buttons and product cards (Screenshot 50) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[15, -15]} className="top-[24%] right-1 sm:right-3 lg:right-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Raspberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-16, 18]} className="top-[40%] right-2 sm:right-4 lg:right-8 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[14, -16]} className="top-[56%] right-1 sm:right-3 lg:right-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 28]} rotRange={[-15, 15]} className="top-[72%] right-2 sm:right-4 lg:right-8 opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 26]} rotRange={[16, -14]} className="top-[88%] right-1 sm:right-3 lg:right-6 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ================= VARIANT: PRODUCT CATALOG (Matches Screenshot 49) ================= */}
      {variant === "catalog" && (
        <>
          {/* ----- LEFT GUTTER: Rich sequence alongside 4-column card grid (Screenshot 49) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-[2%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-[12%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[-14, 15]} className="top-[24%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 27]} rotRange={[16, -15]} className="top-[36%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-15, 16]} className="top-[48%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[14, -14]} className="top-[60%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-[72%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-[84%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Raspberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[-14, 14]} className="top-[94%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafCurvedShoot className="w-7 h-10 sm:w-8 sm:h-11" />
          </FloatingBotanical>

          {/* ----- RIGHT GUTTER: Rich sequence alongside 4-column card grid (Screenshot 49) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[16, -16]} className="top-[2%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Raspberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-15, 16]} className="top-[12%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[14, -15]} className="top-[24%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 27]} rotRange={[-16, 15]} className="top-[36%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[15, -16]} className="top-[48%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-14, 14]} className="top-[60%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[16, -16]} className="top-[72%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-15, 16]} className="top-[84%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[14, -14]} className="top-[94%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-90">
            <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ================= VARIANT: MICROGREENS (Matches Screenshot 51) ================= */}
      {variant === "microgreens" && (
        <>
          {/* ----- LEFT GUTTER: Alongside Live Microgreens Trays & Seed cards (Screenshot 51) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-[4%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-[16%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[-14, 15]} className="top-[28%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafCurvedShoot className="w-7 h-10 sm:w-8 sm:h-11" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 27]} rotRange={[16, -15]} className="top-[40%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-15, 16]} className="top-[52%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[14, -14]} className="top-[64%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.tomato} alt="Fresh Tomato" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-[76%] left-1 sm:left-3 lg:left-6 xl:left-8 opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-[88%] left-2 sm:left-4 lg:left-8 xl:left-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.cucumber} alt="Cucumber" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>

          {/* ----- RIGHT GUTTER: Alongside Live Microgreens Trays & Seed cards (Screenshot 51) ----- */}
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[16, -16]} className="top-[4%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-15, 16]} className="top-[16%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[14, -15]} className="top-[28%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 27]} rotRange={[-16, 15]} className="top-[40%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[15, -16]} className="top-[52%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-14, 14]} className="top-[64%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Raspberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[16, -16]} className="top-[76%] right-1 sm:right-3 lg:right-6 xl:right-8 opacity-90">
            <LeafHerbal className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[-15, 16]} className="top-[88%] right-2 sm:right-4 lg:right-8 xl:right-12 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.radish} alt="Radish" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ================= VARIANT: ABOUT & PHILOSOPHY ================= */}
      {variant === "about" && (
        <>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-4 left-1 sm:left-4 lg:left-8 opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-16 left-4 sm:left-12 lg:left-16 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[16, -15]} className="top-4 right-1 sm:right-4 lg:right-8 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 27]} rotRange={[-15, 16]} className="top-16 right-4 sm:right-12 lg:right-16 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-[45%] left-1 sm:left-4 lg:left-8 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-[45%] right-1 sm:right-4 lg:right-8 opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[-14, 15]} className="bottom-6 left-2 sm:left-6 lg:left-10 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[14, -14]} className="bottom-6 right-2 sm:right-6 lg:right-10 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ================= VARIANT: TRAINING ACADEMY ================= */}
      {variant === "training" && (
        <>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-4 left-1 sm:left-4 lg:left-8 opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-14 left-4 sm:left-10 lg:left-14 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 25]} rotRange={[16, -15]} className="top-4 right-1 sm:right-4 lg:right-8 opacity-90">
            <LeafAmaranth className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-25, 27]} rotRange={[-15, 16]} className="top-14 right-4 sm:right-10 lg:right-14 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-16, 16]} className="top-1/2 left-2 sm:left-6 lg:left-8 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -16]} className="top-1/2 right-2 sm:right-6 lg:right-8 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[-14, 15]} className="bottom-4 left-2 sm:left-6 lg:left-10 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[14, -14]} className="bottom-4 right-2 sm:right-6 lg:right-10 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}

      {/* ================= VARIANT: GENERAL FALLBACK ================= */}
      {variant === "general" && (
        <>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-15, 16]} className="top-4 left-2 sm:left-6 lg:left-10 opacity-90">
            <LeafCotyledon className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-24, 28]} rotRange={[15, -15]} className="top-4 right-2 sm:right-6 lg:right-10 opacity-95">
            <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Strawberry" className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-20, 24]} rotRange={[16, -14]} className="bottom-4 left-2 sm:left-6 lg:left-10 opacity-90">
            <LeafAutumnGold className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
          <FloatingBotanical scrollYProgress={scrollYProgress} yRange={[-22, 26]} rotRange={[-15, 16]} className="bottom-4 right-2 sm:right-6 lg:right-10 opacity-90">
            <LeafBasil className="w-8 h-8 sm:w-9 sm:h-9" />
          </FloatingBotanical>
        </>
      )}
    </div>
  );
};
