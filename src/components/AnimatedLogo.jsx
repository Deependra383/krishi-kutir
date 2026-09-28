import React from 'react';
import { motion } from 'motion/react';
import { useLogo } from '../context/LogoContext';

export const AnimatedLogo = ({ 
  size, 
  showText = true, 
  previewConfig = null,
  className = '',
  textColor = '',
  taglineColor = ''
}) => {
  const { logoConfig } = useLogo();
  const activeConfig = previewConfig || logoConfig || {};

  const effectiveSize = size || activeConfig.size || 58;
  const isCustomImage = activeConfig.mode === 'custom_image' && Boolean(activeConfig.customImageUrl);
  const enableSwing = activeConfig.enableSwing !== false;
  const swingDuration = activeConfig.swingSpeed || 3.5;
  const swingAngle = activeConfig.swingAngle || 8;

  const brandTitle = activeConfig.brandName || 'KRISHI KUTIR';
  const brandTagline = activeConfig.tagline || 'The Leaf Lounge • Est. 2025';

  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Pendulum Swing Animation Container */}
      <motion.div
        className="relative shrink-0 flex items-center justify-center"
        style={{ 
          width: effectiveSize, 
          height: effectiveSize,
          transformOrigin: "50% 0%" // Pivots from the very top center for a realistic pendulum effect
        }}
        animate={enableSwing ? { 
          rotate: [-swingAngle, swingAngle, -swingAngle]
        } : { rotate: 0 }}
        transition={{
          repeat: Infinity,
          duration: swingDuration,
          ease: "easeInOut"
        }}
      >
        {isCustomImage ? (
          /* Custom Uploaded Brand Logo Image */
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center p-0.5 bg-white/10 shadow-xs">
            <img 
              src={activeConfig.customImageUrl} 
              alt={brandTitle} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain drop-shadow-xs"
              onError={(e) => {
                // Fallback: hide broken custom image so SVG could show or don't crash
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          /* High-Precision Botanical Emblem SVG */
          <svg 
            viewBox="0 0 200 200" 
            width="100%" 
            height="100%" 
            className="drop-shadow-xs"
          >
            {/* Definitions for Gradients and Filters */}
            <defs>
              <linearGradient id="sunGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#d946ef" stopOpacity="0" />
                <stop offset="10%" stopColor={activeConfig.sunColor || "#f97316"} />
                <stop offset="100%" stopColor={activeConfig.sunGlowColor || "#facc15"} />
              </linearGradient>
              
              <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* 1. Base circular plate */}
            <circle 
              cx="100" 
              cy="100" 
              r="96" 
              fill={activeConfig.bgColor || "#fcfaf4"} 
              stroke="#eae4d3" 
              strokeWidth="1.5"
              filter="url(#softShadow)"
            />

            {/* 2. Rising Sun */}
            <g>
              <g stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" opacity="0.65">
                <line x1="120" y1="36" x2="120" y2="44" />
                <line x1="96" y1="46" x2="102" y2="52" />
                <line x1="144" y1="46" x2="138" y2="52" />
                <line x1="78" y1="72" x2="86" y2="72" />
                <line x1="162" y1="72" x2="154" y2="72" />
                <line x1="86" y1="94" x2="92" y2="88" />
                <line x1="154" y1="94" x2="148" y2="88" />
                <line x1="107" y1="39" x2="110" y2="46" />
                <line x1="133" y1="39" x2="130" y2="46" />
              </g>
              <circle cx="120" cy="72" r="24" fill="url(#sunGradient)" />
            </g>

            {/* 3. Stylized Green 'K' with leaves */}
            <g>
              <path 
                d="M 40,46 C 40,46 44,78 40,118 C 38,136 34,146 34,146 C 34,146 48,142 50,126 C 52,106 48,66 48,46 Z" 
                fill={activeConfig.leafColor || "#1b4332"} 
              />
              
              <path 
                d="M 44,82 C 48,64 74,54 84,62 C 86,74 68,88 44,82 Z" 
                fill="#2d6a4f" 
                stroke={activeConfig.leafColor || "#1b4332"} 
                strokeWidth="1"
              />
              <path 
                d="M 46,81 Q 64,72 82,64" 
                stroke={activeConfig.leafColor || "#1b4332"} 
                strokeWidth="1.2" 
              />
              
              <path 
                d="M 44,98 C 50,116 76,124 84,114 C 84,102 66,92 44,98 Z" 
                fill="#2d6a4f" 
                stroke={activeConfig.leafColor || "#1b4332"} 
                strokeWidth="1"
              />
              <path 
                d="M 46,99 Q 64,106 82,112" 
                stroke={activeConfig.leafColor || "#1b4332"} 
                strokeWidth="1.2" 
              />
              
              <circle cx="43" cy="46" r="3" fill={activeConfig.leafColor || "#1b4332"} />
              <path 
                d="M 43,46 C 36,36 44,28 50,32 C 52,38 48,44 43,46 Z" 
                fill="#52b788" 
                stroke="#2d6a4f" 
                strokeWidth="0.8" 
              />
            </g>

            {/* 4. Brand Typography 'KRISHI KUTIR' */}
            <g id="brand-typography">
              <path 
                d="M 64,68 L 74,68 L 94,94 L 82,94 Z" 
                fill={activeConfig.textColor || "#2d6a4f"} 
              />
              <path 
                d="M 72,90 L 82,86 L 100,126 L 88,126 Z" 
                fill={activeConfig.textColor || "#2d6a4f"} 
              />

              <text 
                x="88" 
                y="94" 
                fill={activeConfig.textColor || "#2d6a4f"} 
                fontSize="24" 
                fontFamily="'Playfair Display', Georgia, serif" 
                fontWeight="900" 
                letterSpacing="1.5"
              >
                RISHI
              </text>
              
              <text 
                x="88" 
                y="126" 
                fill={activeConfig.textColor || "#2d6a4f"} 
                fontSize="26" 
                fontFamily="'Playfair Display', Georgia, serif" 
                fontWeight="900" 
                letterSpacing="2.5"
              >
                UTIR
              </text>
            </g>

            {/* 5. Delicate decorative leaves surrounding 'KUTIR' */}
            <g>
              <path 
                d="M 148,118 C 158,110 174,116 172,128 C 162,132 152,126 148,118 Z" 
                fill="#52b788" 
                stroke="#2d6a4f" 
                strokeWidth="0.8" 
              />
              <path 
                d="M 150,119 Q 160,121 170,126" 
                stroke="#1b4332" 
                strokeWidth="0.8" 
                opacity="0.7" 
              />

              <path 
                d="M 156,104 C 166,94 182,98 178,110 C 168,114 158,110 156,104 Z" 
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
              fill={activeConfig.taglineColor || "#800000"} 
              fontSize="12" 
              fontFamily="'Caveat', 'Dancing Script', cursive, Georgia, serif" 
              fontWeight="bold" 
              fontStyle="italic" 
              letterSpacing="0.4"
            >
              {activeConfig.subTagline || "~ The leaf lounge ~"}
            </text>
          </svg>
        )}
      </motion.div>

      {/* Optional Brand Text */}
      {showText && (
        <div className={`flex flex-col leading-none select-none ${textColor || 'text-current'}`}>
          <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight block uppercase">
            {brandTitle}
          </span>
          <span className={`text-[10px] sm:text-xs font-bold tracking-widest block uppercase mt-0.5 ${taglineColor || 'opacity-65'}`}>
            {brandTagline}
          </span>
        </div>
      )}
    </div>
  );
};
