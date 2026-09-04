import React from 'react';
import { motion } from 'motion/react';

export const AnimatedLogo = ({ size = 64, showText = true }) => {
  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Pendulum Swing Animation Container */}
      <motion.div
        className="relative shrink-0"
        style={{ 
          width: size, 
          height: size,
          transformOrigin: "50% 0%" // Pivots from the very top center for a realistic pendulum effect
        }}
        animate={{ 
          rotate: [-8, 8, -8] // Swing range back and forth
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5, // gentle organic swing
          ease: "easeInOut"
        }}
      >
        <svg 
          viewBox="0 0 200 200" 
          width="100%" 
          height="100%" 
          className="drop-shadow-xs"
        >
          {/* Definitions for Gradients and Filters */}
          <defs>
            {/* Sun Glow Gradient */}
            <linearGradient id="sunGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0" /> {/* Transparent baseline */}
              <stop offset="10%" stopColor="#f97316" /> {/* Deep warm orange */}
              <stop offset="100%" stopColor="#facc15" /> {/* Bright radiant yellow */}
            </linearGradient>
            
            {/* Soft Shadow Filter for the logo inner plate */}
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* 1. Cream-colored circular base background matching the logo */}
          <circle 
            cx="100" 
            cy="100" 
            r="96" 
            fill="#fcfaf4" 
            stroke="#eae4d3" 
            strokeWidth="1.5"
            filter="url(#softShadow)"
          />

          {/* 2. Rising Sun (behind text) */}
          <g>
            {/* Sun Rays */}
            <g stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" opacity="0.65">
              <line x1="120" y1="36" x2="120" y2="44" />
              <line x1="96" y1="46" x2="102" y2="52" />
              <line x1="144" y1="46" x2="138" y2="52" />
              <line x1="78" y1="72" x2="86" y2="72" />
              <line x1="162" y1="72" x2="154" y2="72" />
              <line x1="86" y1="94" x2="92" y2="88" />
              <line x1="154" y1="94" x2="148" y2="88" />
              
              {/* Additional micro-rays for visual richness */}
              <line x1="107" y1="39" x2="110" y2="46" />
              <line x1="133" y1="39" x2="130" y2="46" />
            </g>
            
            {/* Sun Core */}
            <circle cx="120" cy="72" r="24" fill="url(#sunGradient)" />
          </g>

          {/* 3. Stylized Green 'K' with leaves on the left */}
          <g>
            {/* Stem of K */}
            <path 
              d="M 46,54 L 46,116" 
              stroke="#1b4332" 
              strokeWidth="6" 
              strokeLinecap="round" 
            />
            {/* Top Serif */}
            <path 
              d="M 40,54 L 52,54" 
              stroke="#1b4332" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            {/* Bottom Serif */}
            <path 
              d="M 40,116 L 52,116" 
              stroke="#1b4332" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />

            {/* Upper Leaf Branch (Up-Right) */}
            <path 
              d="M 46,84 Q 68,70 82,53 Q 70,82 46,84" 
              fill="#1b4332" 
            />
            {/* Upper Leaf Central Vein */}
            <path 
              d="M 46,84 Q 64,72 82,53" 
              stroke="#2d6a4f" 
              strokeWidth="1" 
              strokeLinecap="round" 
              opacity="0.8" 
            />

            {/* Lower Leaf Branch (Down-Right) */}
            <path 
              d="M 46,84 Q 68,98 82,117 Q 70,88 46,84" 
              fill="#1b4332" 
            />
            {/* Lower Leaf Central Vein */}
            <path 
              d="M 46,84 Q 64,96 82,117" 
              stroke="#2d6a4f" 
              strokeWidth="1" 
              strokeLinecap="round" 
              opacity="0.8" 
            />
          </g>

          {/* 4. 'KRISHI UTIR' Branding Text */}
          <g>
            {/* KRISHI */}
            <text 
              x="122" 
              y="88" 
              textAnchor="middle" 
              fill="#e0542d" 
              fontSize="24" 
              fontWeight="900" 
              fontFamily="Playfair Display, 'Times New Roman', Georgia, serif" 
              letterSpacing="1.2"
            >
              KRISHI
            </text>

            {/* UTIR */}
            <text 
              x="122" 
              y="118" 
              textAnchor="middle" 
              fill="#e0542d" 
              fontSize="26" 
              fontWeight="900" 
              fontFamily="Playfair Display, 'Times New Roman', Georgia, serif" 
              letterSpacing="1.8"
            >
              UTIR
            </text>
          </g>

          {/* 5. Delicate decorative elements */}
          <g>
            {/* Small green crescent smile accent under the word UTIR */}
            <path 
              d="M 88,124 Q 105,134 116,126" 
              stroke="#2d6a4f" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            {/* Small leaf bud on the smile accent */}
            <path 
              d="M 116,126 C 119,124 122,120 121,117 C 117,118 115,123 116,126 Z" 
              fill="#2d6a4f" 
            />

            {/* Floating green leaf on the right of UTIR */}
            <path 
              d="M 158,104 Q 169,96 175,102 Q 167,112 158,104 Z" 
              fill="#40916c" 
            />
            <path 
              d="M 158,104 Q 166,101 175,102" 
              stroke="#2d6a4f" 
              strokeWidth="0.8" 
              opacity="0.8" 
            />
          </g>

          {/* 6. Tagline at the bottom */}
          <text 
            x="100" 
            y="156" 
            textAnchor="middle" 
            fill="#2d6a4f" 
            fontSize="12" 
            fontFamily="'Caveat', 'Dancing Script', cursive, Georgia, serif" 
            fontWeight="bold" 
            fontStyle="italic"
            letterSpacing="0.4"
          >
            ~ The leaf lounge ~
          </text>
        </svg>
      </motion.div>

      {/* Optional Brand Text (for headers where we still want a side label) */}
      {showText && (
        <div className="flex flex-col leading-none select-none">
          <span className="text-xl md:text-2xl font-black tracking-tight block uppercase text-current">
            KRISHI KUTIR
          </span>
          <span className="text-[10px] font-bold tracking-widest block uppercase opacity-60">
            The Leaf Lounge • Est. 2025
          </span>
        </div>
      )}
    </div>
  );
};
