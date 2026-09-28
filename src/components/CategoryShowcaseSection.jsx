import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/categoriesConfig';

export const CategoryShowcaseSection = ({ onOpenCategoryProducts }) => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic transition every 2 seconds continuously without getting stuck
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CATEGORIES_CONFIG.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Smoothly scroll the container to center the active card whenever currentIndex changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = el.children;
    if (cards && cards[currentIndex]) {
      const targetCard = cards[currentIndex];
      const targetLeft = targetCard.offsetLeft - (el.clientWidth - targetCard.offsetWidth) / 2;
      el.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const handleManualPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CATEGORIES_CONFIG.length) % CATEGORIES_CONFIG.length);
  };

  const handleManualNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CATEGORIES_CONFIG.length);
  };

  const handleCategoryClick = (catId) => {
    if (onOpenCategoryProducts) {
      onOpenCategoryProducts(catId);
    }
  };

  return (
    <section 
      id="product-categories-showcase" 
      className="py-16 sm:py-24 bg-white relative overflow-hidden select-none border-b border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f4faea] text-[#5fa114] text-xs font-black uppercase tracking-widest border border-[#98c56c]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#5fa114]" />
            <span>Produce Collections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-neutral-900">
            Explore By Category
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base font-normal">
            Discover our harvested living microgreens, pure plant milk powders, single-origin spices, and untreated sprouting seeds.
          </p>
        </div>

        {/* Carousel Outer Container with Left and Right Circular Lime Green Buttons */}
        <div className="relative px-2 sm:px-4">
          
          {/* Left Lime-Green Circular Arrow Button */}
          <button
            type="button"
            onClick={handleManualPrev}
            aria-label="Previous categories"
            className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#68a816] hover:bg-[#5a9412] text-white shadow-xl shadow-lime-950/20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.8]" />
          </button>

          {/* Horizontal Scrolling Card Track */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto scroll-smooth py-6 px-2 scrollbar-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {CATEGORIES_CONFIG.map((cat, idx) => {
              const isActive = currentIndex === idx;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`relative shrink-0 w-[270px] sm:w-[295px] md:w-[310px] bg-white border ${cat.borderColor} p-6 sm:p-7 flex flex-col justify-between items-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1.5 ${
                    isActive ? 'ring-2 ring-[#68a816]/60 shadow-xl shadow-lime-950/10 scale-[1.02]' : 'shadow-md'
                  }`}
                  style={{
                    boxShadow: isActive ? '0 12px 35px rgba(104,168,22,0.15)' : '0 8px 25px rgba(0,0,0,0.06)'
                  }}
                >
                  {/* Background Large Serif Watermark Letter */}
                  <span 
                    className={`absolute top-2 left-6 sm:left-7 text-[130px] sm:text-[145px] font-serif font-black leading-none select-none pointer-events-none ${cat.watermarkColor} ${
                      isActive ? 'opacity-85' : 'opacity-60'
                    } transition-opacity`}
                  >
                    {cat.letter}
                  </span>

                  {/* Center Isolated Product Image */}
                  <div className="relative z-10 w-full h-36 sm:h-40 flex items-center justify-center pt-2">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className={`max-h-32 sm:max-h-36 max-w-full object-contain drop-shadow-md transition-transform duration-500 ease-out ${
                        isActive ? 'scale-108' : 'scale-100'
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <div className="relative z-10 w-full text-center mt-3">
                    <h3 className="font-serif text-xl sm:text-[22px] font-bold text-neutral-900 tracking-tight leading-snug">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Learn More Button with Circular Accent Icon */}
                  <div className="relative z-10 mt-5 flex items-center justify-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${cat.buttonColor} text-white flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110`}>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <span className="font-serif text-sm sm:text-[15px] font-bold text-neutral-800 hover:text-neutral-950 transition-colors">
                      Learn More
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Right Lime-Green Circular Arrow Button */}
          <button
            type="button"
            onClick={handleManualNext}
            aria-label="Next categories"
            className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#68a816] hover:bg-[#5a9412] text-white shadow-xl shadow-lime-950/20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.8]" />
          </button>

        </div>

        {/* 2-Second Step Indicators / Progress Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {CATEGORIES_CONFIG.map((cat, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to ${cat.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive 
                    ? 'w-7 h-2.5 bg-[#68a816] shadow-xs' 
                    : 'w-2.5 h-2.5 bg-neutral-200 hover:bg-neutral-300'
                }`}
              />
            );
          })}
        </div>

      </div>

    </section>
  );
};

export default CategoryShowcaseSection;
