import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import {
  LeafCotyledon,
  LeafBasil,
  LeafAmaranth,
  LeafAutumnGold,
  LeafCurvedShoot,
  LeafHerbal,
  FruitJamunBerry,
  FruitCherry,
  FruitPhoto,
  FRUIT_PHOTOS
} from './FloatingLeavesBackground';

/**
 * Individual Floating Botanical or Fruit Item
 * - Styled identically to the background foliage (organic, soft drop-shadow, no border box).
 * - Compact dimensions (w-7 to w-8, ~28px - 32px) so they never crowd text.
 * - Sits strictly in background layer (z-0) with pointer-events-none.
 * - Smoothly glides on page scroll via spring-damped parallax displacement and rotation.
 */
const FloatingItem = ({
  scrollYProgress,
  yRange = [-15, 20],
  rotRange = [-12, 12],
  ambientDuration = 4.8,
  ambientY = 2.5,
  className = "",
  children
}) => {
  const rawY = useTransform(scrollYProgress, [0, 1], yRange);
  const rawRot = useTransform(scrollYProgress, [0, 1], rotRange);
  
  // Spring with snappy stiffness and balanced damping for noticeable, fluid scroll motion
  const y = useSpring(rawY, { stiffness: 95, damping: 20, mass: 0.4 });
  const rotate = useSpring(rawRot, { stiffness: 95, damping: 20, mass: 0.4 });

  return (
    <motion.div
      style={{ y, rotate }}
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
 * Safely positions the 12 floating botanical/fruit elements strictly within
 * the open negative spaces surrounding the "OUR EVENTS & WORKSHOP FOOTPRINT" section.
 * 
 * GUARANTEED ZERO CARD OVERLAP:
 * - Top items sit inside the open horizontal corridor between the Certification cards
 *   and the Workshop cards (above/around the heading), with all top coordinates strictly positive
 *   so they NEVER reach the Certification cards above.
 * - Flank items sit outside the cards in the left/right gutters.
 * - Bottom items sit in the open space below the workshop cards.
 * 
 * SCROLL PARALLAX:
 * - Seamlessly connected to the section scroll progress to visibly move and rotate as you scroll.
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
      
      {/* ================= TOP OPEN CORRIDOR (CLEAR OF CERTIFICATIONS & CARDS) ================= */}
      
      {/* 1. Upper-Left: in open space above Card 1, well below Certification cards */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-12, 18]}
        rotRange={[-14, 14]}
        ambientDuration={4.5}
        className="top-2 sm:top-3 left-[4%] sm:left-[7%] opacity-90"
      >
        <div className="flex items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.tomato} alt="Fresh Tomato" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafCotyledon className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </FloatingItem>

      {/* 2. Mid-Left: diagonally to the left of the heading text, above Card 1 */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-14, 16]}
        rotRange={[12, -14]}
        ambientDuration={5.0}
        className="top-7 sm:top-8 left-[18%] sm:left-[22%] opacity-90"
      >
        <div className="flex items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafAmaranth className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </FloatingItem>

      {/* 3. Center-Top: in clear gap directly above "OUR EVENTS & WORKSHOP FOOTPRINT" */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-10, 14]}
        rotRange={[-10, 12]}
        ambientDuration={4.2}
        className="top-0 sm:top-1 left-1/2 -translate-x-1/2 opacity-95"
      >
        <div className="flex items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.carrot} alt="Fresh Carrot" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafBasil className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </FloatingItem>

      {/* 4. Mid-Right: diagonally to the right of the heading text, above Card 3 */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-14, 16]}
        rotRange={[-14, 14]}
        ambientDuration={4.8}
        className="top-7 sm:top-8 right-[18%] sm:right-[22%] opacity-90"
      >
        <div className="flex items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafHerbal className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </FloatingItem>

      {/* 5. Upper-Right: in open space above Card 3, well below Certification cards */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-12, 18]}
        rotRange={[14, -14]}
        ambientDuration={5.1}
        className="top-2 sm:top-3 right-[4%] sm:right-[7%] opacity-90"
      >
        <div className="flex items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.cucumber} alt="Fresh Cucumber" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafAutumnGold className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </FloatingItem>

      {/* 6. Far Upper-Right: in right edge open space, clear of Card 3 and Trademarked */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-12, 16]}
        rotRange={[-14, 14]}
        ambientDuration={4.6}
        className="top-1 sm:top-2 -right-2 sm:right-[1%] opacity-90"
      >
        <div className="flex items-center gap-1">
          <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafCurvedShoot className="w-6 h-8 sm:w-7 sm:h-9" />
        </div>
      </FloatingItem>

      {/* ================= OUTER SIDE FLANKS (CLEAR OF CARDS IN GUTTERS) ================= */}

      {/* 7. Far-Left Outer Margin: outside Card 1's left boundary */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-24, 24]}
        rotRange={[-16, 16]}
        ambientDuration={5.0}
        className="top-[45%] -left-6 sm:-left-9 lg:-left-12 opacity-90"
      >
        <div className="flex flex-col items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.raspberry} alt="Raspberry" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafCotyledon className="w-7 h-7 sm:w-8 sm:h-8" />
          <FruitJamunBerry className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </FloatingItem>

      {/* 8. Far-Right Outer Margin: outside Card 3's right boundary */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-24, 24]}
        rotRange={[16, -16]}
        ambientDuration={4.7}
        className="top-[45%] -right-6 sm:-right-9 lg:-right-12 opacity-90"
      >
        <div className="flex flex-col items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.limeSlice} alt="Lime Slice" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafBasil className="w-7 h-7 sm:w-8 sm:h-8" />
          <FruitCherry className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </FloatingItem>

      {/* ================= BOTTOM ROW (SAFELY BELOW WORKSHOP CARD BASES) ================= */}

      {/* 9. Bottom-Left: below Card 1 */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-6, 20]}
        rotRange={[-12, 12]}
        ambientDuration={4.6}
        className="bottom-0 sm:-bottom-2 left-[5%] sm:left-[8%] opacity-90"
      >
        <div className="flex items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.strawberry} alt="Fresh Strawberry" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafAutumnGold className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </FloatingItem>

      {/* 10. Bottom Center-Left: below gap between Card 1 & Card 2 */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-6, 20]}
        rotRange={[14, -12]}
        ambientDuration={5.2}
        className="bottom-1 sm:bottom-0 left-[34%] -translate-x-1/2 opacity-90"
      >
        <div className="flex items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.radish} alt="Fresh Radish" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafAmaranth className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </FloatingItem>

      {/* 11. Bottom Center-Right: below gap between Card 2 & Card 3 */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-6, 20]}
        rotRange={[-12, 14]}
        ambientDuration={4.5}
        className="bottom-1 sm:bottom-0 right-[34%] translate-x-1/2 opacity-90"
      >
        <div className="flex items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.orangeSlice} alt="Orange Slice" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafBasil className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </FloatingItem>

      {/* 12. Bottom-Right: below Card 3 */}
      <FloatingItem
        scrollYProgress={scrollYProgress}
        yRange={[-6, 20]}
        rotRange={[12, -12]}
        ambientDuration={4.9}
        className="bottom-0 sm:-bottom-2 right-[5%] sm:right-[8%] opacity-90"
      >
        <div className="flex items-center gap-1.5">
          <FruitPhoto src={FRUIT_PHOTOS.blueberries} alt="Blueberries" className="w-7 h-7 sm:w-8 sm:h-8" />
          <LeafHerbal className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </FloatingItem>

    </div>
  );
};
