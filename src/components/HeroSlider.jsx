import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Leaf, Flame } from 'lucide-react';
import { CAROUSEL_ITEMS } from '../data';
import { useHomepageContent } from '../context/HomepageContentContext';
import defaultBotanicalBanner from '../assets/images/botanical_hero_banner.jpg';

export const HeroSlider = ({ 
  carouselIndex, 
  setCarouselIndex 
}) => {
  const { heroSlides } = useHomepageContent();
  const slides = (heroSlides && heroSlides.length > 0) ? heroSlides : CAROUSEL_ITEMS;
  const currentSlide = slides[carouselIndex] || slides[0];

  const activeSlideImage = currentSlide?.image || defaultBotanicalBanner;

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-play when multiple slides exist
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length, setCarouselIndex]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCarouselIndex(prev => (prev <= 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCarouselIndex(prev => (prev >= slides.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    if (e.targetTouches?.[0]) {
      touchStartX.current = e.targetTouches[0].clientX;
    }
  };

  const handleTouchMove = (e) => {
    if (e.targetTouches?.[0]) {
      touchEndX.current = e.targetTouches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section 
      id="hero-banner" 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative bg-[#faf9f6] border-b border-neutral-200/80 overflow-hidden select-none group/hero"
    >
      {/* ================= HERO PANORAMIC CANVAS (Full Viewport Fill) ================= */}
      <div className="relative min-h-[calc(100vh-68px)] lg:min-h-[calc(100vh-74px)] flex items-center justify-between">
        
        {/* Full-bleed background image across the whole page (mobile + desktop) */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img 
              key={activeSlideImage}
              src={activeSlideImage} 
              alt={currentSlide?.heading || "Bringing Out The Beauty In You"}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0.9, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.9 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>
          {/* Desktop subtle gradient overlay on the left for crisp typography contrast */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent w-[58%] lg:w-[54%] pointer-events-none" />
          {/* Mobile subtle overlay: keeps the whole background image clearly visible without blurring */}
          <div className="block md:hidden absolute inset-0 bg-gradient-to-b from-white/75 via-white/45 to-white/70 pointer-events-none" />
        </div>

        {/* Left Arrow Navigation Button - Hidden on mobile */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/85 hover:bg-white text-neutral-800 hover:text-emerald-800 shadow-md sm:shadow-xl border border-neutral-200/90 backdrop-blur-md items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 group-hover:text-emerald-700 transition-colors" />
        </button>

        {/* Right Arrow Navigation Button - Hidden on mobile */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/85 hover:bg-white text-neutral-800 hover:text-emerald-800 shadow-md sm:shadow-xl border border-neutral-200/90 backdrop-blur-md items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 group-hover:text-emerald-700 transition-colors" />
        </button>

        {/* Slide Indicators / 1, 2, 3, 4 - Hidden on mobile */}
        <div className="hidden md:flex absolute bottom-5 sm:bottom-7 right-4 sm:right-10 z-30 items-center gap-2 bg-neutral-900/60 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 shadow-md">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCarouselIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === carouselIndex 
                  ? 'w-6 bg-emerald-400' 
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
          <span className="text-white/90 text-[11px] sm:text-xs font-mono font-bold ml-1 tracking-wider">
            {carouselIndex + 1}/{slides.length}
          </span>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-8 sm:py-14 lg:py-24">
          <div className="max-w-xl lg:max-w-2xl">
            
            {/* Live Harvest Status Pill */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/90 backdrop-blur-xs shadow-2xs mb-4"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-800 tracking-wide uppercase font-sans">
                {currentSlide?.tag || "Pure Botanical & Hydroponic Farm • Bhopal"}
              </span>
            </motion.div>

            {/* Editorial Display Heading */}
            <h1 className="font-serif-hero text-3xl sm:text-5xl md:text-6xl lg:text-[68px] text-neutral-900 leading-[1.15] sm:leading-[1.1] tracking-tight font-semibold">
              {currentSlide?.heading || "Bringing Out The Beauty In You"}
            </h1>

            {/* Subtitle / Narrative Copy */}
            <p className="mt-3 sm:mt-5 mb-6 sm:mb-8 text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg font-sans">
              {currentSlide?.description || "Nurtured with zero pesticides in our Bhopal vertical farm and botanical reserve. From antioxidant-rich living microgreens to pure sun-cured powders and restorative herbal wellness, experience nature's freshest vitality crafted to nourish your skin and vitality."}
            </p>

            {/* Action Buttons: Natural Powders and Harvested Microgreens in place of Shop Catalogue */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a 
                href="#category=harvested-microgreens"
                id="hero-harvested-microgreens-btn"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-98"
              >
                <Leaf className="w-4 h-4 text-emerald-300" />
                <span>Harvested Microgreens</span>
              </a>

              <a 
                href="#category=fruits"
                id="hero-natural-powders-btn"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-[#b8862d] hover:bg-[#996e23] text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Natural Powders</span>
              </a>

              <a 
                href="#partner-with-us"
                id="hero-explore-division-btn"
                className="inline-flex items-center justify-center px-4 sm:px-7 py-3 sm:py-4 bg-white/90 hover:bg-white text-neutral-800 text-sm sm:text-base font-semibold rounded-full border border-neutral-300 shadow-2xs hover:border-neutral-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>B2B & Wholesale</span>
                <ChevronRight className="w-4 h-4 ml-1 text-neutral-500" />
              </a>
            </div>

            {/* Interactive Category Jump Chips */}
            <div className="mt-6 sm:mt-10 pt-5 sm:pt-6 border-t border-neutral-200/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 mr-1 hidden sm:inline">Explore:</span>
              
              <a 
                href="#category=harvested-microgreens" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-[#2d6a4f] hover:text-white border border-neutral-200/90 text-xs font-semibold text-neutral-700 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Harvested Microgreens</span>
              </a>

              <a 
                href="#category=fruits" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-[#b8862d] hover:text-white border border-neutral-200/90 text-xs font-semibold text-neutral-700 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Natural Powders</span>
              </a>

              <a 
                href="#category=spices" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-emerald-700 hover:text-white border border-neutral-200/90 text-xs font-semibold text-neutral-700 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Spices & Seasoning</span>
              </a>

              <a 
                href="#category=dairy-alternatives" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-emerald-700 hover:text-white border border-neutral-200/90 text-xs font-semibold text-neutral-700 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Dairy Alternatives</span>
              </a>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
