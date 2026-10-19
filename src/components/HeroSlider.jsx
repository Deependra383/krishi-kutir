import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Leaf, Flame, ArrowRight } from 'lucide-react';
import { CAROUSEL_ITEMS } from '../data';
import { useHomepageContent } from '../context/HomepageContentContext';
import { useProducts } from '../context/ProductContext';
import defaultBotanicalBanner from '../assets/images/botanical_hero_banner.jpg';

export const HeroSlider = ({ 
  carouselIndex, 
  setCarouselIndex 
}) => {
  const { heroSlides } = useHomepageContent();
  const { showcaseCategories = [] } = useProducts();
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
      {/* ================= MOBILE: IMAGE ONLY (full photo, no text, no blur) ================= */}
      <div className="relative md:hidden">
        <motion.img
          key={activeSlideImage}
          src={activeSlideImage}
          alt={currentSlide?.heading || "Krishi Kutir"}
          referrerPolicy="no-referrer"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="block w-full h-auto"
        />

        {/* Small slide dots (swipe left/right to change slides) */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/35 backdrop-blur-sm">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCarouselIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === carouselIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= TABLET & DESKTOP: HERO PANORAMIC CANVAS (Full Viewport Fill) ================= */}
      <div className="relative hidden md:flex min-h-[calc(100vh-68px)] lg:min-h-[calc(100vh-74px)] items-center justify-between">
        
        {/* Full-bleed background image across the whole page (mobile + desktop) */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlideImage}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.9 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="absolute inset-0 overflow-hidden"
            >
              {/* Soft blurred copy of the same photo fills any empty space around it */}
              <img
                src={activeSlideImage}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
              />
              {/* The real photo: always shown in full, never cropped or zoomed */}
              <img
                src={activeSlideImage}
                alt={currentSlide?.heading || "Bringing Out The Beauty In You"}
                referrerPolicy="no-referrer"
                className="relative w-full h-full object-contain object-center md:object-right"
              />
            </motion.div>
          </AnimatePresence>
          {/* Desktop subtle gradient overlay on the left for crisp typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent w-[58%] lg:w-[54%] pointer-events-none" />
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {showcaseCategories.length > 0 ? (
                <a 
                  href={`#category=${showcaseCategories[0].id}`}
                  id="hero-primary-cat-btn"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-98"
                >
                  <Leaf className="w-4 h-4 text-emerald-300" />
                  <span>Explore {showcaseCategories[0].title}</span>
                </a>
              ) : (
                <a 
                  href="#product-categories-showcase"
                  id="hero-categories-btn"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Explore Categories</span>
                </a>
              )}

              {showcaseCategories.length > 1 ? (
                <a 
                  href={`#category=${showcaseCategories[1].id}`}
                  id="hero-secondary-cat-btn"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-[#b8862d] hover:bg-[#996e23] text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{showcaseCategories[1].title}</span>
                </a>
              ) : (
                <a 
                  href="#product-inquiry-section"
                  id="hero-living-store-btn"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-[#b8862d] hover:bg-[#996e23] text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-98"
                >
                  <Leaf className="w-4 h-4 text-amber-200" />
                  <span>Living Farm Store</span>
                </a>
              )}

              <a 
                href="#partner-with-us"
                id="hero-explore-division-btn"
                className="inline-flex items-center justify-center px-4 sm:px-7 py-3 sm:py-4 bg-white/90 hover:bg-white text-neutral-800 text-sm sm:text-base font-semibold rounded-full border border-neutral-300 shadow-2xs hover:border-neutral-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>B2B & Wholesale</span>
                <ChevronRight className="w-4 h-4 ml-1 text-neutral-500" />
              </a>
            </div>

            {/* Interactive Category Jump Chips (Dynamic) */}
            {showcaseCategories.length > 0 && (
              <div className="mt-6 sm:mt-10 pt-5 sm:pt-6 border-t border-neutral-200/80 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-neutral-500 mr-1 hidden sm:inline">Explore:</span>
                
                {showcaseCategories.slice(0, 6).map((cat) => (
                  <a 
                    key={cat.id}
                    href={`#category=${cat.id}`} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-[#2d6a4f] hover:text-white border border-neutral-200/90 text-xs font-semibold text-neutral-700 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{cat.title}</span>
                  </a>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </section>
  );
};