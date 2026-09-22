import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Menu, 
  X,
  ChevronDown,
  Sparkles,
  Leaf,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { useAuth } from '../context/AuthContext';

const PRODUCT_CATEGORIES = [
  {
    id: 'all-products',
    label: 'All Products & Farm Produce',
    desc: 'Browse entire living & dehydrated harvest catalogue',
    icon: Layers,
    sectionId: 'full-catalogue-section',
    badge: 'Full Store',
    color: 'emerald'
  },
  {
    id: 'microgreens',
    label: 'Microgreens',
    desc: 'Living trays, harvested shoots & untreated seeds',
    icon: Leaf,
    sectionId: 'microgreens-section',
    badge: '40x Nutrition',
    color: 'emerald'
  },
  {
    id: 'natural-powders',
    label: 'Natural Powders',
    desc: 'Pure botanical, moringa & herbal superfood powders',
    icon: Sparkles,
    sectionId: 'powders-spices-section',
    tabTarget: 'tab-fruits-vegetables',
    badge: 'Sun-Cured',
    color: 'amber'
  },
  {
    id: 'spices',
    label: 'Spices & Seasoning',
    desc: 'Heritage single-origin spices, Lakadong turmeric & blends',
    icon: Flame,
    sectionId: 'powders-spices-section',
    tabTarget: 'tab-spices-seasoning',
    badge: 'Single Origin',
    color: 'rose'
  }
];

const NAV_TABS = [
  { id: 'home', label: 'Home', badge: null, sectionId: '' },
  { id: 'about', label: 'About', badge: null, sectionId: 'about-philosophy' },
  { id: 'products', label: 'Products', hasDropdown: true, badge: null, sectionId: 'full-catalogue-section' },
  { id: 'training', label: 'Training', badge: null, sectionId: 'training-academy' },
  { id: 'partner', label: 'Partner With Us', badge: null, sectionId: 'partner-with-us' },
];

export const NavigationBar = ({ 
  onOpenAuth, 
  onOpenProfile, 
  onOpenAdmin 
}) => {
  const { currentUser, userProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsExpanded, setIsMobileProductsExpanded] = useState(false);
  
  const dropdownTimeoutRef = useRef(null);
  const isManualScrollRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Release scroll lock if user manually touches or scrolls with mouse wheel
  useEffect(() => {
    const handleUserInterrupt = () => {
      if (isManualScrollRef.current) {
        isManualScrollRef.current = false;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      }
    };

    window.addEventListener('wheel', handleUserInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserInterrupt, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleUserInterrupt);
      window.removeEventListener('touchmove', handleUserInterrupt);
    };
  }, []);

  // Smooth scroll spy to highlight current section as user manually scrolls
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isManualScrollRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isManualScrollRef.current) {
            ticking = false;
            return;
          }

          const currentScrollY = window.scrollY;

          // If close to top (less than 180px), always highlight 'home'
          if (currentScrollY < 180) {
            setActiveTab('home');
            ticking = false;
            return;
          }

          // Calculate exact document coordinates for every target section
          const sections = NAV_TABS
            .filter((t) => t.sectionId)
            .map((t) => {
              const el = document.getElementById(t.sectionId);
              if (!el) return null;
              const rect = el.getBoundingClientRect();
              return {
                id: t.id,
                top: rect.top + currentScrollY,
                height: el.offsetHeight,
              };
            })
            .filter(Boolean)
            .sort((a, b) => a.top - b.top);

          const triggerLine = currentScrollY + 220;
          let matched = 'home';

          for (const sec of sections) {
            if (triggerLine >= sec.top) {
              matched = sec.id;
            }
          }

          // Snap to the last section if scrolled to the absolute bottom of the document
          if (
            window.innerHeight + currentScrollY >=
            document.documentElement.scrollHeight - 60
          ) {
            if (sections.length > 0) {
              matched = sections[sections.length - 1].id;
            }
          }

          setActiveTab(matched);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleTabClick = (tab) => {
    // 1. If currently on a different view (admin or cart), reset hash to store
    if (typeof window !== 'undefined' && (window.location.hash === '#admin' || window.location.hash === '#cart' || window.location.hash === '#bag')) {
      window.location.hash = '';
    }

    // 2. Immediately update active tab so slider pill glides instantly
    setActiveTab(tab.id);
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);

    // 3. Lock scroll spy during smooth travel so it cannot revert or flicker
    isManualScrollRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 1100);

    // 4. Scroll smoothly to target section or top
    if (!tab.sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const performScroll = () => {
      const el = document.getElementById(tab.sectionId);
      if (el) {
        const offset = 80;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, elementPosition - offset),
          behavior: 'smooth'
        });
      }
    };

    performScroll();
    // Re-attempt after small tick in case DOM needed rendering transition
    setTimeout(performScroll, 80);
  };

  const handleCategorySelect = (category) => {
    setActiveTab('products');
    setIsProductsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    isManualScrollRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 1100);

    const el = document.getElementById(category.sectionId);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }

    if (category.tabTarget) {
      setTimeout(() => {
        const tabEl = document.getElementById(category.tabTarget);
        if (tabEl) tabEl.click();
      }, 350);
    }
  };

  const handleMouseEnterProducts = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsProductsDropdownOpen(true);
  };

  const handleMouseLeaveProducts = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 180);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs select-none transition-all duration-300">
      
      {/* Full-width Bar aligned flush with page edges */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3 flex items-center justify-between gap-4 transition-colors duration-200 text-neutral-900">
        
        {/* Brand Logo & Name */}
        <a 
          href="#" 
          onClick={(e) => { 
            e.preventDefault(); 
            handleTabClick(NAV_TABS[0]); 
          }}
          className="flex items-center gap-3 sm:gap-3.5 shrink-0 group pl-0.5"
        >
          <AnimatedLogo size={52} showText={false} />
          <div className="flex flex-col leading-tight">
            <span className="font-serif font-black text-lg sm:text-xl md:text-2xl tracking-tight transition-colors text-neutral-900 group-hover:text-emerald-700">
              Krishi Kutir
            </span>
            <span className="text-[10px] sm:text-[11px] font-sans font-extrabold uppercase tracking-widest text-emerald-700 hidden sm:block">
              The Leaf Lounge
            </span>
          </div>
        </a>

        {/* Center: Spacious, Well-Proportioned Navigation Bar */}
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-auto px-4">
          <nav className="flex items-center gap-1 xl:gap-2 relative">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;

              if (tab.hasDropdown) {
                return (
                  <div
                    key={tab.id}
                    className="relative"
                    onMouseEnter={handleMouseEnterProducts}
                    onMouseLeave={handleMouseLeaveProducts}
                  >
                    <button
                      id={`nav-tab-${tab.id}`}
                      type="button"
                      onClick={() => handleTabClick(tab)}
                      className={`relative px-4 xl:px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none whitespace-nowrap ${
                        isActive 
                          ? 'bg-[#2d6a4f] text-white shadow-xs' 
                          : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Products Dropdown Menu */}
                    <AnimatePresence>
                      {isProductsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.16 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-2.5 z-50"
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5 border-b border-neutral-100">
                            Major Product Categories
                          </div>
                          
                          <div className="space-y-1 mt-1">
                            {PRODUCT_CATEGORIES.map((cat) => {
                              const IconComponent = cat.icon;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => handleCategorySelect(cat)}
                                  className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50/70 transition-all flex items-start gap-3 group cursor-pointer"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-800">
                                        {cat.label}
                                      </span>
                                      {cat.badge && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-emerald-200/60 group-hover:text-emerald-800">
                                          {cat.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-neutral-500 font-normal line-clamp-1 mt-0.5">
                                      {cat.desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`relative px-4 xl:px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#2d6a4f] text-white shadow-xs' 
                      : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2.5 shrink-0 pr-0.5">
          
          {/* Direct Shop Catalogue Pill */}
          <a
            href="#full-catalogue-section"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <span>Explore Farm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* User Profile / Authentication */}
          {currentUser ? (
            <button
              id="nav-profile-btn"
              type="button"
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200/80"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                {userProfile?.displayName?.[0] || currentUser.email?.[0] || 'U'}
              </div>
              <span className="hidden md:inline max-w-[85px] truncate text-xs">
                {userProfile?.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]}
              </span>
            </button>
          ) : (
            <button
              id="nav-login-btn"
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200/80"
            >
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full cursor-pointer transition-colors text-[#2d6a4f] hover:text-[#1b4332] hover:bg-neutral-100"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#2d6a4f]" /> : <Menu className="w-5 h-5 text-[#2d6a4f]" />}
          </button>

        </div>

      </div>

      {/* Mobile Slide-Down Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden mx-4 mb-3 p-3.5 backdrop-blur-md rounded-2xl shadow-xl border space-y-1 transition-colors bg-white border-neutral-200/90 text-neutral-900 max-h-[82vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-1.5 p-1">
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;

                if (tab.hasDropdown) {
                  return (
                    <div key={tab.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setIsMobileProductsExpanded(!isMobileProductsExpanded)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#2d6a4f] text-white shadow-xs' 
                            : 'text-neutral-800 hover:bg-neutral-100'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isMobileProductsExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Expandable Mobile Product Categories */}
                      {isMobileProductsExpanded && (
                        <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-emerald-500/50 ml-3">
                          {PRODUCT_CATEGORIES.map((cat) => {
                            const IconComponent = cat.icon;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategorySelect(cat)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-neutral-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors text-left"
                              >
                                <IconComponent className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{cat.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={tab.id}
                    id={`mobile-nav-tab-${tab.id}`}
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#2d6a4f] text-white shadow-xs' 
                        : 'text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
