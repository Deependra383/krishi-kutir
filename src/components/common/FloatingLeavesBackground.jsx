import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

// ================= BOTANICAL LEAF & FRUIT SVG DEFINITIONS =================

// 1. Tender Microgreen Cotyledon Leaf (Fresh Lime / Emerald Sprout)
export const LeafCotyledon = ({ className = "w-10 h-10 text-emerald-600" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cotyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="45%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
      <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    <path 
      d="M50 85 C 48 65, 49 45, 50 35" 
      stroke="url(#stemGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M50 42 C 32 40, 15 28, 24 15 C 34 2, 48 20, 50 42 Z" 
      fill="url(#cotyGrad)" 
      opacity="0.95"
    />
    <path 
      d="M50 42 C 68 40, 85 28, 76 15 C 66 2, 52 20, 50 42 Z" 
      fill="url(#cotyGrad)" 
      opacity="0.95"
    />
    <path d="M50 40 Q 36 22 30 18" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <path d="M50 40 Q 64 22 70 18" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// 2. Basil / Mint Leaf (Forest Emerald Leaf)
export const LeafBasil = ({ className = "w-12 h-12 text-emerald-700" }) => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="basilGrad" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="30%" stopColor="#22c55e" />
        <stop offset="70%" stopColor="#15803d" />
        <stop offset="100%" stopColor="#052e16" />
      </linearGradient>
    </defs>
    <path 
      d="M50 10 C 20 30, 10 70, 48 108 C 50 110, 52 110, 52 108 C 90 70, 80 30, 50 10 Z" 
      fill="url(#basilGrad)" 
      opacity="0.95"
    />
    <path d="M50 14 C 50 45, 50 80, 50 114" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
    <path d="M50 35 Q 35 45 26 50" stroke="#bbf7d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
    <path d="M50 35 Q 65 45 74 50" stroke="#bbf7d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
    <path d="M50 55 Q 32 67 22 75" stroke="#bbf7d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
    <path d="M50 55 Q 68 67 78 75" stroke="#bbf7d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
  </svg>
);

// 3. Red Amaranth Microgreen Leaf (Vibrant Magenta / Purple-Burgundy)
export const LeafAmaranth = ({ className = "w-11 h-11 text-rose-600" }) => (
  <svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="amaranthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="40%" stopColor="#be123c" />
        <stop offset="75%" stopColor="#881337" />
        <stop offset="100%" stopColor="#4c0519" />
      </linearGradient>
      <linearGradient id="amaranthStem" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#9f1239" />
      </linearGradient>
    </defs>
    <path d="M50 105 C 49 85, 48 65, 50 45" stroke="url(#amaranthStem)" strokeWidth="3" strokeLinecap="round" />
    <path 
      d="M50 15 C 25 25, 18 55, 48 85 C 50 87, 52 87, 52 85 C 82 55, 75 25, 50 15 Z" 
      fill="url(#amaranthGrad)" 
      opacity="0.95"
    />
    <path d="M50 20 C 50 45, 50 65, 50 85" stroke="#fecdd3" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
    <path d="M50 40 Q 32 48 25 54" stroke="#fecdd3" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M50 40 Q 68 48 75 54" stroke="#fecdd3" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M50 60 Q 36 67 30 72" stroke="#fecdd3" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M50 60 Q 64 67 70 72" stroke="#fecdd3" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 4. Autumn Golden Amber Leaf (Warm Honey / Golden Orange)
export const LeafAutumnGold = ({ className = "w-11 h-11 text-amber-500" }) => (
  <svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="goldGrad" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#f59e0b" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <path 
      d="M50 10 C 25 28, 20 65, 48 100 C 50 102, 52 102, 52 100 C 80 65, 75 28, 50 10 Z" 
      fill="url(#goldGrad)" 
      opacity="0.95"
    />
    <path d="M50 15 C 50 45, 50 75, 50 100" stroke="#fef3c7" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
    <path d="M50 35 Q 36 46 28 52" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
    <path d="M50 35 Q 64 46 72 52" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
    <path d="M50 60 Q 38 68 32 74" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
    <path d="M50 60 Q 62 68 68 74" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
  </svg>
);

// 5. Slender Curved Microgreen Shoot (Delicate botanical curve)
export const LeafCurvedShoot = ({ className = "w-8 h-12 text-emerald-500" }) => (
  <svg viewBox="0 0 80 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="shootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="50%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <path d="M30 135 C 35 100, 48 70, 40 30" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
    <path d="M40 30 C 25 20, 20 5, 38 4 C 55 4, 52 20, 40 30 Z" fill="url(#shootGrad)" opacity="0.95" />
    <path d="M42 55 C 55 50, 68 45, 62 35 C 55 25, 45 40, 42 55 Z" fill="url(#shootGrad)" opacity="0.9" />
  </svg>
);

// 6. Broad Herbal Leaf (Sage / Moringa Foliage)
export const LeafHerbal = ({ className = "w-11 h-11 text-emerald-800" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="herbGrad" x1="20%" y1="10%" x2="80%" y2="90%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="40%" stopColor="#10b981" />
        <stop offset="85%" stopColor="#065f46" />
      </linearGradient>
    </defs>
    <path d="M15 85 C 10 50, 30 15, 85 15 C 85 70, 50 90, 15 85 Z" fill="url(#herbGrad)" opacity="0.92" />
    <path d="M18 82 Q 45 55 83 17" stroke="#d1fae5" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
    <path d="M40 60 Q 30 45 32 35" stroke="#d1fae5" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M55 45 Q 68 55 78 58" stroke="#d1fae5" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// ================= COLORFUL SMALL FRUITS DEFINITIONS =================

// 7. Small Juicy Wild Berry / Strawberry (Glossy Ruby Red with green calyx)
export const FruitWildBerry = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="berryGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="25%" stopColor="#f43f5e" />
        <stop offset="70%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#881337" />
      </radialGradient>
      <linearGradient id="calyxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    {/* Stem */}
    <path d="M50 15 C 50 8, 55 4, 60 2" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
    {/* Berry Body */}
    <path 
      d="M50 92 C 30 78, 18 58, 20 40 C 22 24, 38 22, 50 26 C 62 22, 78 24, 80 40 C 82 58, 70 78, 50 92 Z" 
      fill="url(#berryGrad)" 
      filter="drop-shadow(0 2px 4px rgba(136, 19, 55, 0.35))"
    />
    {/* Star Calyx Leaves at Top */}
    <path d="M50 25 C 45 18, 36 18, 32 20 C 38 23, 44 26, 50 26 Z" fill="url(#calyxGrad)" />
    <path d="M50 25 C 55 18, 64 18, 68 20 C 62 23, 56 26, 50 26 Z" fill="url(#calyxGrad)" />
    <path d="M50 25 C 50 16, 50 14, 50 22 Z" stroke="url(#calyxGrad)" strokeWidth="2" strokeLinecap="round" />
    {/* Glossy High-Light Sheen */}
    <ellipse cx="38" cy="38" rx="8" ry="12" transform="rotate(-25 38 38)" fill="white" opacity="0.45" />
    <circle cx="34" cy="32" r="3" fill="white" opacity="0.75" />
    {/* Delicate Seeds */}
    <circle cx="42" cy="52" r="1.5" fill="#fecdd3" opacity="0.8" />
    <circle cx="58" cy="54" r="1.5" fill="#fecdd3" opacity="0.8" />
    <circle cx="50" cy="68" r="1.5" fill="#fecdd3" opacity="0.8" />
    <circle cx="36" cy="65" r="1.3" fill="#fecdd3" opacity="0.7" />
    <circle cx="64" cy="66" r="1.3" fill="#fecdd3" opacity="0.7" />
  </svg>
);

// 8. Sunny Citrus Segment / Baby Orange (Bright Golden Citrus)
export const FruitCitrus = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="citrusPeel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fed7aa" />
        <stop offset="40%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id="citrusPulp" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    {/* Outer citrus slice wedge */}
    <path 
      d="M10 85 C 10 35, 35 10, 85 10 C 85 55, 55 85, 10 85 Z" 
      fill="url(#citrusPeel)"
    />
    {/* White pith inner crescent */}
    <path 
      d="M15 80 C 15 40, 40 15, 80 15 C 80 50, 50 80, 15 80 Z" 
      fill="#fffbeb" 
      opacity="0.9"
    />
    {/* Juicy citrus pulpy segments */}
    <path d="M22 74 C 22 55, 35 32, 52 24 C 42 45, 32 62, 22 74 Z" fill="url(#citrusPulp)" />
    <path d="M36 75 C 44 60, 56 42, 72 26 C 65 48, 52 64, 36 75 Z" fill="url(#citrusPulp)" />
    {/* Glossy highlight */}
    <path d="M30 45 Q 45 30 65 24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
    <circle cx="50" cy="38" r="2.5" fill="white" opacity="0.8" />
  </svg>
);

// 9. Jamun / Blue Berry (Deep Indigo / Violet Glossy Berry)
export const FruitJamunBerry = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="jamunGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="30%" stopColor="#9333ea" />
        <stop offset="70%" stopColor="#6b21a8" />
        <stop offset="100%" stopColor="#3b0764" />
      </radialGradient>
    </defs>
    {/* Tiny stem */}
    <path d="M50 18 C 52 10, 58 6, 62 4" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
    {/* Berry Body */}
    <circle cx="50" cy="54" r="34" fill="url(#jamunGrad)" filter="drop-shadow(0 2px 4px rgba(59, 7, 100, 0.4))" />
    {/* Calyx notch */}
    <circle cx="50" cy="22" r="3.5" fill="#3b0764" />
    {/* Glossy highlight */}
    <ellipse cx="40" cy="42" rx="7" ry="11" transform="rotate(-30 40 42)" fill="white" opacity="0.4" />
    <circle cx="36" cy="36" r="3" fill="white" opacity="0.75" />
  </svg>
);

// 10. Mini Cherry / Baby Tomato (Bright Crimson with Little Twin Leaves)
export const FruitCherry = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="cherryGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="25%" stopColor="#ef4444" />
        <stop offset="70%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
    </defs>
    {/* Curved stalk */}
    <path d="M50 30 C 56 18, 68 12, 76 8" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
    {/* Baby leaf on stalk */}
    <path d="M62 16 C 68 12, 75 14, 74 20 C 68 22, 62 20, 62 16 Z" fill="#22c55e" />
    {/* Round Fruit */}
    <circle cx="48" cy="58" r="32" fill="url(#cherryGrad)" filter="drop-shadow(0 2px 4px rgba(127, 29, 29, 0.35))" />
    {/* High Gloss */}
    <ellipse cx="38" cy="46" rx="6" ry="10" transform="rotate(-25 38 46)" fill="white" opacity="0.5" />
    <circle cx="34" cy="40" r="3" fill="white" opacity="0.8" />
  </svg>
);

// ================= REALISTIC FRUIT PHOTO BADGES & CURATED ASSETS =================

export const FruitPhoto = ({ src, alt, className = "w-11 h-11" }) => (
  <div className={`${className} rounded-full overflow-hidden border border-white/80 shadow-md bg-white/40 backdrop-blur-xs select-none pointer-events-none`}>
    <img 
      src={src} 
      alt={alt} 
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover select-none"
    />
  </div>
);

export const FRUIT_PHOTOS = {
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=120&q=80",
  orangeSlice: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=120&q=80",
  blueberries: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=120&q=80",
  cherry: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=120&q=80",
  raspberry: "https://images.unsplash.com/photo-1577069808021-7299a9108b47?auto=format&fit=crop&w=120&q=80",
  limeSlice: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=120&q=80",
  carrot: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=120&q=80",
  tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=120&q=80",
  cucumber: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=120&q=80",
  radish: "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=120&q=80",
  avocado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=120&q=80"
};

// ================= SMOOTH SPRING-BASED BOTANICAL ITEM =================

const SmoothScrollBotanicalItem = ({
  Component,
  children,
  top,
  left,
  right,
  size = 46,
  amplitude = 45,
  phase = 0,
  rotateFactor = 30,
  ambientDuration = 5,
  opacity = 0.88,
  scrollY
}) => {
  // Smooth bounded parallax: stays on screen by oscillating smoothly with scroll
  const rawY = useTransform(scrollY, (val) => Math.sin(val * 0.0016 + phase) * amplitude);
  const smoothY = useSpring(rawY, { stiffness: 40, damping: 18 });

  const rawRotate = useTransform(scrollY, (val) => Math.sin(val * 0.0012 + phase) * rotateFactor);
  const smoothRotate = useSpring(rawRotate, { stiffness: 40, damping: 18 });

  return (
    <motion.div
      style={{
        top,
        left: left !== undefined ? left : 'auto',
        right: right !== undefined ? right : 'auto',
        y: smoothY,
        rotate: smoothRotate,
        width: size,
        height: size,
      }}
      className="fixed pointer-events-none select-none z-10 filter drop-shadow-md transition-opacity duration-300 block"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity, 
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.8 },
        scale: { duration: 0.8 },
      }}
    >
      <motion.div
        animate={{ 
          y: [-5, 5, -5],
          rotate: [-3, 3, -3]
        }}
        transition={{
          repeat: Infinity,
          duration: ambientDuration,
          ease: "easeInOut"
        }}
        className="w-full h-full flex items-center justify-center"
      >
        {Component ? <Component className="w-full h-full" /> : children}
      </motion.div>
    </motion.div>
  );
};

export const FloatingLeavesBackground = () => {
  return null;
};
