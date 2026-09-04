import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Leaf, Award, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { CAROUSEL_ITEMS } from '../data';

export const HeroSlider = ({ 
  carouselIndex, 
  setCarouselIndex 
}) => {
  const currentSlide = CAROUSEL_ITEMS[carouselIndex] || CAROUSEL_ITEMS[0];

  // Optional subtle auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev === CAROUSEL_ITEMS.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [setCarouselIndex]);

  const handleNext = (e) => {
    e?.stopPropagation();
    setCarouselIndex(prev => (prev === CAROUSEL_ITEMS.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCarouselIndex(prev => (prev === 0 ? CAROUSEL_ITEMS.length - 1 : prev - 1));
  };

  return (
    <section 
      id="hero-banner" 
      className="relative bg-gradient-to-b from-emerald-50/50 via-white to-white border-b border-neutral-200/80 pt-8 pb-16 px-4 sm:px-6 lg:px-12 select-none"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Origin & Purity Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-black uppercase tracking-widest shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>{currentSlide.tag || 'Living Harvest'}</span>
              <span className="text-emerald-300">•</span>
              <span className="text-emerald-700 font-semibold">Vertical Farm in Bhopal</span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 block">
                {currentSlide.title}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-neutral-900 tracking-tight leading-[1.12]">
                {currentSlide.heading}
              </h1>
            </div>
            
            {/* Narrative description */}
            <p className="text-neutral-600 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              {currentSlide.description}
            </p>

            {/* Signature Varieties Tag */}
            {currentSlide.accent && (
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Featured Farm Lot
                  </span>
                  <span className="text-sm font-bold text-neutral-800 truncate block">
                    {currentSlide.accent}
                  </span>
                </div>
              </div>
            )}

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="#full-catalogue-section" 
                className="px-8 py-4 text-sm font-black uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-full transition-all shadow-lg shadow-emerald-700/25 flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <span>Shop Catalogue</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a 
                href="#partner-with-us" 
                className="px-7 py-4 text-sm font-bold uppercase tracking-wider text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:border-neutral-400"
              >
                <span>HoReCa & Bulk Supply</span>
              </a>

              <a 
                href="#my-orders-section" 
                className="text-xs font-black uppercase tracking-wider text-neutral-600 hover:text-emerald-700 transition-colors px-3 py-2"
              >
                Track Order →
              </a>
            </div>

            {/* 4 Pillars Trust Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-2 text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-tight">100% Residue Free</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-tight">FSSAI Certified</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-tight">Low-Temp Dried</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-tight">Untreated Seeds</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Photographic Card Showcase */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="w-full h-[380px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden relative shadow-2xl border border-neutral-200/90 bg-neutral-900 group">
              <img 
                src={currentSlide.image} 
                alt={currentSlide.heading}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Top tag */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-neutral-900/85 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10 shadow-sm">
                  Krishi Kutir • Bhopal
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-black uppercase tracking-wider shadow-sm">
                  {currentSlide.tag}
                </span>
              </div>
              
              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/50 to-transparent p-6 sm:p-8 text-white">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                      Leaf Lounge Vertical Farm
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black uppercase text-white truncate">
                      {currentSlide.heading}
                    </h3>
                  </div>
                  
                  {/* Slider Arrows */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      id="hero-prev-btn"
                      onClick={handlePrev}
                      className="p-3 bg-white/20 hover:bg-white text-white hover:text-neutral-900 rounded-full backdrop-blur-md transition-all cursor-pointer hover:scale-105"
                      title="Previous slide"
                      aria-label="Previous slide"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button 
                      id="hero-next-btn"
                      onClick={handleNext}
                      className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all cursor-pointer shadow-md hover:scale-105"
                      title="Next slide"
                      aria-label="Next slide"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Navigation indicators */}
            <div className="flex items-center justify-between gap-3 px-2 pt-1">
              <div className="flex items-center gap-2">
                {CAROUSEL_ITEMS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      carouselIndex === i 
                        ? 'w-10 bg-emerald-700' 
                        : 'w-3 bg-neutral-300 hover:bg-neutral-400'
                    }`}
                    title={item.heading}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <span className="text-xs text-neutral-500 font-mono font-bold">
                0{carouselIndex + 1} / 0{CAROUSEL_ITEMS.length}
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
