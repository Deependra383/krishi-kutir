import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Sparkles, Leaf, Flame } from 'lucide-react';
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

  // Auto-play when multiple slides exist
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length, setCarouselIndex]);

  return (
    <section 
      id="hero-banner" 
      className="relative bg-[#faf9f6] border-b border-neutral-200/80 overflow-hidden select-none"
    >
      {/* ================= HERO PANORAMIC CANVAS (Full Viewport Fill) ================= */}
      <div className="relative min-h-[calc(100vh-68px)] lg:min-h-[calc(100vh-74px)] flex items-center justify-between">
        
        {/* Full-bleed background image with subtle natural light blend */}
        <div className="absolute inset-0 z-0">
          <img 
            src={activeSlideImage} 
            alt={currentSlide?.heading || "Bringing Out The Beauty In You"}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right sm:object-right md:object-center transform scale-100 hover:scale-102 transition-transform duration-1000 ease-out"
          />
          {/* Subtle soft white gradient overlay on the left to ensure crisp, accessible typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 to-transparent lg:w-[64%] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent sm:hidden pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-12 sm:py-16 lg:py-24">
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
            <h1 className="font-serif-hero text-4xl sm:text-5xl md:text-6xl lg:text-[68px] text-neutral-900 leading-[1.1] tracking-tight font-semibold">
              {currentSlide?.heading || "Bringing Out The Beauty In You"}
            </h1>

            {/* Subtitle / Narrative Copy */}
            <p className="mt-4 sm:mt-5 mb-7 sm:mb-8 text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg font-sans">
              {currentSlide?.description || "Nurtured with zero pesticides in our Bhopal vertical farm and botanical reserve. From antioxidant-rich living microgreens to pure sun-cured powders and restorative herbal wellness, experience nature's freshest vitality crafted to nourish your skin and vitality."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href={currentSlide?.target || "#full-catalogue-section"}
                id="hero-shop-now-btn"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-98"
              >
                <span>Shop Catalogue</span>
              </a>

              <a 
                href="#partner-with-us"
                id="hero-explore-division-btn"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white/90 hover:bg-white text-neutral-800 text-sm sm:text-base font-semibold rounded-full border border-neutral-300 shadow-2xs hover:border-neutral-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>B2B & Wholesale</span>
                <ChevronRight className="w-4 h-4 ml-1 text-neutral-500" />
              </a>
            </div>

            {/* Interactive Category Jump Chips */}
            <div className="mt-8 sm:mt-10 pt-6 border-t border-neutral-200/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 mr-1 hidden sm:inline">Explore:</span>
              
              <a 
                href="#full-catalogue-section" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-emerald-700 hover:text-white border border-neutral-200/90 text-xs font-semibold text-neutral-700 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>All Farm Produce</span>
              </a>

              <a 
                href="#powders-spices-section" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-emerald-700 hover:text-white border border-neutral-200/90 text-xs font-semibold text-neutral-700 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Herbal Powders & Spices</span>
              </a>

              <a 
                href="#microgreens-section" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-emerald-700 hover:text-white border border-neutral-200/90 text-xs font-semibold text-neutral-700 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Microgreens</span>
              </a>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
