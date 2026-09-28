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

// ================= COLORFUL BOTANICAL FRUITS DEFINITIONS =================

// 7. Small Juicy Wild Berry / Strawberry (Glossy Ruby Red with green calyx and leaves - matches Screenshot 50 on right)
export const FruitWildBerry = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="berryGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="25%" stopColor="#ef4444" />
        <stop offset="70%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
      <linearGradient id="calyxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="60%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    {/* Curved fresh green stem */}
    <path d="M50 16 C 50 8, 56 4, 62 2" stroke="#15803d" strokeWidth="2.8" strokeLinecap="round" />
    {/* Heart-shaped Berry Body */}
    <path 
      d="M50 94 C 28 80, 16 60, 18 42 C 20 24, 38 22, 50 26 C 62 22, 80 24, 82 42 C 84 60, 72 80, 50 94 Z" 
      fill="url(#berryGrad)" 
      filter="drop-shadow(0 3px 5px rgba(127, 29, 29, 0.4))"
    />
    {/* Star Calyx Leaves at Top */}
    <path d="M50 25 C 44 16, 32 16, 28 20 C 35 23, 43 27, 50 27 Z" fill="url(#calyxGrad)" />
    <path d="M50 25 C 56 16, 68 16, 72 20 C 65 23, 57 27, 50 27 Z" fill="url(#calyxGrad)" />
    <path d="M50 25 C 48 14, 52 14, 50 22 Z" stroke="url(#calyxGrad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 27 C 38 28, 22 36, 18 40 C 26 38, 38 34, 50 29 Z" fill="url(#calyxGrad)" opacity="0.9" />
    <path d="M50 27 C 62 28, 78 36, 82 40 C 74 38, 62 34, 50 29 Z" fill="url(#calyxGrad)" opacity="0.9" />
    {/* Glossy High-Light Sheen */}
    <ellipse cx="36" cy="40" rx="9" ry="14" transform="rotate(-25 36 40)" fill="white" opacity="0.45" />
    <circle cx="32" cy="34" r="3.2" fill="white" opacity="0.8" />
    {/* Delicate Golden-Yellow Seeds */}
    <circle cx="42" cy="52" r="1.5" fill="#fef08a" opacity="0.85" />
    <circle cx="58" cy="54" r="1.5" fill="#fef08a" opacity="0.85" />
    <circle cx="50" cy="68" r="1.5" fill="#fef08a" opacity="0.85" />
    <circle cx="36" cy="65" r="1.3" fill="#fef08a" opacity="0.8" />
    <circle cx="64" cy="66" r="1.3" fill="#fef08a" opacity="0.8" />
    <circle cx="48" cy="82" r="1.2" fill="#fef08a" opacity="0.75" />
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
      filter="drop-shadow(0 2px 4px rgba(234, 88, 12, 0.35))"
    />
    {/* White pith inner crescent */}
    <path 
      d="M15 80 C 15 40, 40 15, 80 15 C 80 50, 50 80, 15 80 Z" 
      fill="#fffbeb" 
      opacity="0.92"
    />
    {/* Juicy citrus pulpy segments */}
    <path d="M22 74 C 22 55, 35 32, 52 24 C 42 45, 32 62, 22 74 Z" fill="url(#citrusPulp)" />
    <path d="M36 75 C 44 60, 56 42, 72 26 C 65 48, 52 64, 36 75 Z" fill="url(#citrusPulp)" />
    {/* Glossy highlight */}
    <path d="M30 45 Q 45 30 65 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
    <circle cx="50" cy="38" r="2.8" fill="white" opacity="0.85" />
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

// 10. Twin Ruby Cherries on curved stem with baby leaf
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
    {/* Curved stalks meeting at top node */}
    <path d="M50 12 C 40 28, 34 45, 36 60" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M50 12 C 58 26, 66 40, 68 56" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
    {/* Little top leaf */}
    <path d="M50 12 C 58 6, 70 8, 68 15 C 60 17, 52 15, 50 12 Z" fill="#22c55e" />
    {/* Cherry 1 (left) */}
    <circle cx="34" cy="68" r="22" fill="url(#cherryGrad)" filter="drop-shadow(0 2px 4px rgba(127, 29, 29, 0.4))" />
    <ellipse cx="28" cy="60" rx="4.5" ry="7" transform="rotate(-25 28 60)" fill="white" opacity="0.5" />
    <circle cx="25" cy="56" r="2" fill="white" opacity="0.8" />
    {/* Cherry 2 (right) */}
    <circle cx="68" cy="65" r="21" fill="url(#cherryGrad)" filter="drop-shadow(0 2px 4px rgba(127, 29, 29, 0.4))" />
    <ellipse cx="62" cy="57" rx="4" ry="6.5" transform="rotate(-25 62 57)" fill="white" opacity="0.5" />
    <circle cx="59" cy="53" r="1.8" fill="white" opacity="0.8" />
  </svg>
);

// 11. Orange Sea Buckthorn / Golden Berry Sprig (Matches Screenshot 50 on left)
export const FruitSeaBuckthorn = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="sbtBerry1" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="30%" stopColor="#fb923c" />
        <stop offset="75%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#9a3412" />
      </radialGradient>
      <radialGradient id="sbtBerry2" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fed7aa" />
        <stop offset="35%" stopColor="#f97316" />
        <stop offset="80%" stopColor="#c2410c" />
        <stop offset="100%" stopColor="#7c2d12" />
      </radialGradient>
      <linearGradient id="sbtLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    {/* Delicate woody sprig stem */}
    <path d="M15 88 C 30 75, 48 55, 68 28" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M42 62 C 55 58, 65 65, 72 70" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M52 45 C 50 35, 42 28, 35 22" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
    
    {/* Botanical green leaf 1 */}
    <path d="M68 28 C 78 18, 88 20, 84 32 C 78 36, 70 34, 68 28 Z" fill="url(#sbtLeafGrad)" opacity="0.95" />
    <path d="M68 28 Q 78 26 82 28" stroke="#bbf7d0" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    
    {/* Botanical green leaf 2 */}
    <path d="M35 22 C 24 16, 22 28, 30 35 C 36 34, 38 28, 35 22 Z" fill="url(#sbtLeafGrad)" opacity="0.9" />

    {/* Plump cluster of golden-orange berries */}
    {/* Berry 1 (back) */}
    <circle cx="62" cy="46" r="13" fill="url(#sbtBerry2)" filter="drop-shadow(0 2px 3px rgba(154, 52, 18, 0.35))" />
    <ellipse cx="58" cy="42" rx="3.5" ry="5" transform="rotate(-30 58 42)" fill="white" opacity="0.5" />
    <circle cx="56" cy="40" r="1.5" fill="white" opacity="0.8" />
    
    {/* Berry 2 */}
    <circle cx="44" cy="56" r="14" fill="url(#sbtBerry1)" filter="drop-shadow(0 2px 3px rgba(154, 52, 18, 0.4))" />
    <ellipse cx="40" cy="51" rx="4" ry="6" transform="rotate(-30 40 51)" fill="white" opacity="0.55" />
    <circle cx="38" cy="48" r="1.8" fill="white" opacity="0.85" />
    <circle cx="48" cy="62" r="1.5" fill="#7c2d12" opacity="0.6" />

    {/* Berry 3 */}
    <circle cx="70" cy="64" r="12" fill="url(#sbtBerry2)" filter="drop-shadow(0 2px 3px rgba(154, 52, 18, 0.35))" />
    <ellipse cx="66" cy="60" rx="3" ry="4.5" transform="rotate(-30 66 60)" fill="white" opacity="0.5" />
    <circle cx="64" cy="58" r="1.4" fill="white" opacity="0.8" />

    {/* Berry 4 (front focal) */}
    <circle cx="54" cy="72" r="13.5" fill="url(#sbtBerry1)" filter="drop-shadow(0 2px 4px rgba(154, 52, 18, 0.45))" />
    <ellipse cx="49" cy="67" rx="3.5" ry="5.5" transform="rotate(-30 49 67)" fill="white" opacity="0.6" />
    <circle cx="47" cy="64" r="1.6" fill="white" opacity="0.85" />
    <circle cx="58" cy="78" r="1.6" fill="#7c2d12" opacity="0.65" />
  </svg>
);

// 12. Wild Blueberries Cluster
export const FruitBlueberries = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="bbGrad1" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#a5b4fc" />
        <stop offset="25%" stopColor="#6366f1" />
        <stop offset="70%" stopColor="#3730a3" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </radialGradient>
      <radialGradient id="bbGrad2" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#c7d2fe" />
        <stop offset="30%" stopColor="#4f46e5" />
        <stop offset="75%" stopColor="#312e81" />
        <stop offset="100%" stopColor="#0f172a" />
      </radialGradient>
    </defs>
    {/* Tiny twig */}
    <path d="M45 20 C 50 12, 58 8, 65 6" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" />
    {/* Berry 1 (back) */}
    <circle cx="38" cy="48" r="18" fill="url(#bbGrad1)" filter="drop-shadow(0 2px 3px rgba(30, 27, 75, 0.4))" />
    <circle cx="34" cy="38" r="4" fill="#1e1b4b" />
    <path d="M32 38 L36 38 M34 36 L34 40" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" />
    <ellipse cx="44" cy="44" rx="4" ry="7" transform="rotate(25 44 44)" fill="white" opacity="0.35" />

    {/* Berry 2 (front right) */}
    <circle cx="64" cy="56" r="19" fill="url(#bbGrad2)" filter="drop-shadow(0 2px 4px rgba(30, 27, 75, 0.45))" />
    <circle cx="62" cy="44" r="4.2" fill="#0f172a" />
    <path d="M59 44 L65 44 M62 41 L62 47" stroke="#a5b4fc" strokeWidth="1.2" strokeLinecap="round" />
    <ellipse cx="70" cy="52" rx="4.5" ry="8" transform="rotate(25 70 52)" fill="white" opacity="0.4" />
    <circle cx="67" cy="48" r="2" fill="white" opacity="0.75" />

    {/* Berry 3 (front low) */}
    <circle cx="44" cy="68" r="16" fill="url(#bbGrad1)" filter="drop-shadow(0 2px 3px rgba(30, 27, 75, 0.4))" />
    <circle cx="40" cy="60" r="3.5" fill="#1e1b4b" />
    <ellipse cx="48" cy="65" rx="3.5" ry="6" transform="rotate(25 48 65)" fill="white" opacity="0.35" />
  </svg>
);

// 13. Crisp Lime Wedge / Slice
export const FruitLimeSlice = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="limeRind" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bef264" />
        <stop offset="40%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#4d7c0f" />
      </linearGradient>
      <linearGradient id="limePulp" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f7fee7" />
        <stop offset="50%" stopColor="#d9f99d" />
        <stop offset="100%" stopColor="#a3e635" />
      </linearGradient>
    </defs>
    {/* Outer peel */}
    <path d="M10 85 C 10 35, 35 10, 85 10 C 85 55, 55 85, 10 85 Z" fill="url(#limeRind)" filter="drop-shadow(0 2px 4px rgba(77, 124, 15, 0.35))" />
    {/* Pith */}
    <path d="M15 80 C 15 40, 40 15, 80 15 C 80 50, 50 80, 15 80 Z" fill="#f7fee7" opacity="0.92" />
    {/* Pulp Segments */}
    <path d="M22 74 C 22 55, 35 32, 52 24 C 42 45, 32 62, 22 74 Z" fill="url(#limePulp)" />
    <path d="M36 75 C 44 60, 56 42, 72 26 C 65 48, 52 64, 36 75 Z" fill="url(#limePulp)" />
    {/* Glossy light */}
    <path d="M30 45 Q 45 30 65 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
    <circle cx="50" cy="38" r="2.5" fill="white" opacity="0.85" />
  </svg>
);

// 14. Cherry Vine Tomato
export const FruitBabyTomato = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="tomGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="25%" stopColor="#ef4444" />
        <stop offset="70%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </radialGradient>
      <linearGradient id="tomCalyx" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    {/* Curved vine stem */}
    <path d="M50 20 C 50 10, 56 6, 64 4" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
    {/* Star sepals */}
    <path d="M50 22 L40 16 M50 22 L60 16 M50 22 L35 24 M50 22 L65 24 M50 22 L50 28" stroke="url(#tomCalyx)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Round tomato body */}
    <circle cx="50" cy="56" r="33" fill="url(#tomGrad)" filter="drop-shadow(0 2px 4px rgba(153, 27, 27, 0.4))" />
    {/* Glossy specular highlight */}
    <ellipse cx="40" cy="44" rx="7" ry="11" transform="rotate(-25 40 44)" fill="white" opacity="0.55" />
    <circle cx="36" cy="38" r="3" fill="white" opacity="0.85" />
  </svg>
);

// ================= REALISTIC FRUIT PHOTO BADGES & CURATED ASSETS =================

export const FruitPhoto = ({ src, alt, className = "w-11 h-11" }) => (
  <div className={`${className} rounded-full overflow-hidden border border-white/80 shadow-md bg-white/40 backdrop-blur-xs select-none pointer-events-none`}>
    <img 
      src={src} 
      alt={alt} 
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
      className="w-full h-full object-cover select-none"
    />
  </div>
);

export const FRUIT_PHOTOS = {
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=120&q=80",
  orangeSlice: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=120&q=80",
  blueberries: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=120&q=80",
  cherry: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=120&q=80",
  raspberry: "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=120&q=80",
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
