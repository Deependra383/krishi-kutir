import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Leaf,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES_CONFIG } from '../data/categoriesConfig';

const NAV_TABS = [
  { id: 'home', label: 'Home', badge: null, sectionId: '' },
  { id: 'products', label: 'Products', hasDropdown: true, badge: null, sectionId: 'product-categories-showcase' },
  { id: 'training', label: 'Training', badge: null, sectionId: 'training-academy' },
  { id: 'about', label: 'About', badge: null, sectionId: 'about-philosophy' },
  { id: 'partner', label: 'Partner With Us', badge: null, sectionId: 'partner-with-us' },
];

export const NavigationBar = ({ 
  onOpenAuth, 
  onOpenProfile, 
  onOpenAdmin 
}) => {
  const { currentUser, userProfile } = useAuth();
  const { products = [], showcaseCategories = [], majorCategories = [] } = useProducts();
  const categoriesList = showcaseCategories && showcaseCategories.length > 0 ? showcaseCategories : CATEGORIES_CONFIG;
  
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsExpanded, setIsMobileProductsExpanded] = useState(false);
  const [activeMajorCatId, setActiveMajorCatId] = useState(null);
  const [activeDropdownCatId, setActiveDropdownCatId] = useState('dairy-alternatives');
  const [expandedMobileMajorId, setExpandedMobileMajorId] = useState(null);
  const [expandedMobileCatId, setExpandedMobileCatId] = useState(null);
  
  const dropdownTimeoutRef = useRef(null);
  const isManualScrollRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Active Major Category
  const currentMajorCat = (majorCategories && majorCategories.length > 0)
    ? (majorCategories.find(m => m.id === activeMajorCatId) || majorCategories[0])
    : null;

  // Sub-categories under currently active Major Category (or all if none)
  const currentMajorSubCategories = useMemo(() => {
    if (!currentMajorCat) return categoriesList;
    const subs = categoriesList.filter(c => c.majorCategoryId === currentMajorCat.id);
    return subs.length > 0 ? subs : categoriesList;
  }, [currentMajorCat, categoriesList]);

  // Helper to extract products belonging to each category
  const getCategoryProducts = (cat) => {
    if (!products || products.length === 0 || !cat) return [];
    if (typeof cat.filterProduct === 'function') {
      const filtered = products.filter(p => {
        try {
          return cat.filterProduct(p);
        } catch {
          return false;
        }
      });
      if (filtered.length > 0) return filtered;
    }
    const catTitle = (cat.title || cat.name || '').toLowerCase();
    const catId = (cat.id || '').toLowerCase();
    return products.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pSub = (p.subCategory || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      return pCat === catTitle || pSub === catTitle || pCat.includes(catTitle) || pName.includes(catTitle) || pCat.includes(catId);
    });
  };

  // Currently active/hovered/clicked category for the desktop sub-dropdown
  const currentNavCat = categoriesList.find(c => c.id === activeDropdownCatId) 
    || currentMajorSubCategories.find(c => c.id === 'dairy-alternatives')
    || currentMajorSubCategories[0] 
    || categoriesList[0];

  const activeCategoryProducts = getCategoryProducts(currentNavCat);

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

  const handleNavigateCategory = (categoryId) => {
    setActiveTab('products');
    setIsProductsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    if (categoryId) {
      window.location.hash = `category=${categoryId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateAllShowcase = () => {
    setActiveTab('products');
    setIsProductsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    if (typeof window !== 'undefined' && window.location.hash.startsWith('#category=')) {
      window.location.hash = '';
    }
    setTimeout(() => {
      const el = document.getElementById('product-categories-showcase');
      if (el) {
        const offset = 80;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    }, 50);
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
          <AnimatedLogo size={70} showText={false} />
          <div className="flex flex-col leading-tight">
            <span className="font-serif font-black text-2xl sm:text-3xl md:text-[30px] tracking-tight transition-colors text-[#2d6a4f] group-hover:text-[#1b4332]">
              Krishi Kutir
            </span>
            <span className="text-[11px] sm:text-[12px] font-sans font-black uppercase tracking-widest text-[#800000] block">
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

                    {/* Products Dropdown Menu: Major Categories -> Sub Categories -> Sub Products flyout */}
                    <AnimatePresence>
                      {isProductsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.16 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[640px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-neutral-200/90 z-50 overflow-hidden flex flex-col"
                        >
                          {categoriesList.length === 0 ? (
                            <div className="p-8 text-center space-y-2.5">
                              <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
                              <h4 className="text-xs font-bold text-neutral-800">No categories created yet</h4>
                              <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                                Add categories in the Admin Dashboard to organize your products into dropdown menus.
                              </p>
                              {onOpenAdmin && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsProductsDropdownOpen(false);
                                    onOpenAdmin();
                                  }}
                                  className="mt-2 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                                >
                                  <span>Open Admin</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="grid grid-cols-12">
                            
                            {/* Column 1: Major Categories (e.g. Natural Powders, Microgreens & Seeds) */}
                            {majorCategories && majorCategories.length > 0 && (
                              <div className="col-span-5 border-r border-neutral-100 p-2.5 bg-neutral-100/60 flex flex-col justify-between">
                                <div>
                                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-2 py-1 mb-1 flex items-center justify-between">
                                    <span>Major Categories</span>
                                    <span className="text-[9px] font-mono font-bold bg-neutral-200/80 px-1.5 py-0.5 rounded text-neutral-600">
                                      {majorCategories.length}
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    {majorCategories.map((m) => {
                                      const isMajorSelected = (currentMajorCat?.id === m.id);
                                      const majorSubs = categoriesList.filter(c => c.majorCategoryId === m.id);
                                      return (
                                        <button
                                          key={m.id}
                                          type="button"
                                          onMouseEnter={() => {
                                            setActiveMajorCatId(m.id);
                                            const firstSub = categoriesList.find(c => c.majorCategoryId === m.id);
                                            if (firstSub) setActiveDropdownCatId(firstSub.id);
                                          }}
                                          onClick={() => {
                                            setActiveMajorCatId(m.id);
                                            const firstSub = categoriesList.find(c => c.majorCategoryId === m.id);
                                            if (firstSub) setActiveDropdownCatId(firstSub.id);
                                          }}
                                          className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group cursor-pointer text-xs ${
                                            isMajorSelected
                                              ? 'bg-neutral-900 text-white font-black shadow-2xs'
                                              : 'text-neutral-700 hover:bg-neutral-200/80 font-bold'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className="truncate leading-tight">{m.name}</span>
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0">
                                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                                              isMajorSelected ? 'bg-white/20 text-white font-bold' : 'bg-neutral-200 text-neutral-600'
                                            }`}>
                                              {majorSubs.length}
                                            </span>
                                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isMajorSelected ? 'translate-x-0.5 text-white' : 'text-neutral-400'}`} />
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Column 2: Sub-Categories under the Selected Major Category */}
                            <div className={`${majorCategories && majorCategories.length > 0 ? 'col-span-7' : 'col-span-12'} p-2.5 bg-white flex flex-col`}>
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-950 px-2 py-1 mb-1 flex items-center justify-between border-b border-neutral-100 pb-1.5">
                                  <span>{currentMajorCat ? `${currentMajorCat.name} Sub-Categories` : 'Sub-Categories'}</span>
                                  <span className="text-[9px] font-mono font-bold bg-emerald-100/70 text-emerald-800 px-1.5 py-0.5 rounded">
                                    {currentMajorSubCategories.length}
                                  </span>
                                </div>

                                <div className="space-y-1 max-h-[300px] overflow-y-auto pr-0.5 scrollbar-none mt-1">
                                  {currentMajorSubCategories.map((cat) => {
                                    return (
                                      <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleNavigateCategory(cat.id)}
                                        className="w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group cursor-pointer bg-neutral-50/70 hover:bg-emerald-700 text-neutral-800 hover:text-white border border-neutral-100 hover:border-emerald-600 shadow-2xs hover:shadow-xs"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          {cat.icon && (
                                            <span className="text-sm shrink-0">{cat.icon}</span>
                                          )}
                                          <div className="min-w-0">
                                            <span className="text-xs font-bold truncate block group-hover:text-white">
                                              {cat.title}
                                            </span>
                                            {cat.tagline && (
                                              <span className="text-[10px] text-neutral-400 group-hover:text-emerald-100 block truncate">
                                                {cat.tagline}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                          <span className="text-[10px] font-semibold text-emerald-700 group-hover:text-white flex items-center gap-0.5">
                                            <span>Explore</span>
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                          </span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            </div>
                          )}
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
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 pr-0.5">
          
          {/* In place of Shop Catalogue: Options for Harvested Microgreens & Natural Powders */}
          <a
            href="#category=harvested-microgreens"
            className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-[#2d6a4f] hover:text-white border border-emerald-200 text-[#2d6a4f] text-xs font-bold transition-all shadow-2xs cursor-pointer group/navchip"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600 group-hover/navchip:text-white transition-colors" />
            <span>Harvested Microgreens</span>
          </a>

          <a
            href="#category=fruits"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-[#b8862d] hover:text-white border border-amber-200 text-[#b8862d] text-xs font-bold transition-all shadow-2xs cursor-pointer group/navchip"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover/navchip:text-white transition-colors" />
            <span>Natural Powders</span>
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
              {/* Quick direct category options (dynamic) */}
              {categoriesList.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pb-2 mb-1 border-b border-neutral-100">
                  {categoriesList.slice(0, 2).map((cat) => (
                    <a
                      key={cat.id}
                      href={`#category=${cat.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-50 hover:bg-[#2d6a4f] hover:text-white text-[#2d6a4f] border border-emerald-200 text-xs font-bold shadow-2xs text-center transition-colors"
                    >
                      <Leaf className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cat.title}</span>
                    </a>
                  ))}
                </div>
              )}

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

                      {/* Expandable Mobile Product Categories (Clean text, grouped by Major Category) */}
                      {isMobileProductsExpanded && (
                        <div className="pl-2 pr-1 py-1 space-y-2 border-l-2 border-emerald-500/50 ml-3">
                          {categoriesList.length === 0 ? (
                            <div className="py-2.5 px-2 text-xs text-neutral-400">
                              No categories created yet
                            </div>
                          ) : majorCategories && majorCategories.length > 0 ? (
                            majorCategories.map((major) => {
                              const majorSubs = categoriesList.filter(c => c.majorCategoryId === major.id);
                              if (majorSubs.length === 0) return null;

                              return (
                                <div key={major.id} className="space-y-1 pt-1 first:pt-0">
                                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-50/80 px-2 py-1 rounded-md flex items-center justify-between">
                                    <span>{major.name}</span>
                                    <span className="text-[9px] font-mono text-emerald-700">({majorSubs.length})</span>
                                  </div>

                                  <div className="pl-1.5 space-y-0.5">
                                    {majorSubs.map((cat) => {
                                      const isCatExpanded = expandedMobileCatId === cat.id;
                                      const catProds = getCategoryProducts(cat);
                                      return (
                                        <div key={cat.id} className="space-y-0.5">
                                          <div className="flex items-center justify-between rounded-lg hover:bg-emerald-50/60 px-2 py-1.5 transition-colors">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setExpandedMobileCatId(isCatExpanded ? null : cat.id);
                                              }}
                                              className="text-xs font-bold text-neutral-800 hover:text-emerald-800 text-left flex-1"
                                            >
                                              {cat.title}
                                            </button>
                                            <div className="flex items-center gap-1">
                                              <button
                                                type="button"
                                                onClick={() => handleNavigateCategory(cat.id)}
                                                className="text-[10px] font-semibold text-emerald-700 hover:underline px-1 py-0.5"
                                                title={`Open ${cat.title} page`}
                                              >
                                                Page &rarr;
                                              </button>
                                              {catProds.length > 0 && (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedMobileCatId(isCatExpanded ? null : cat.id);
                                                  }}
                                                  className="p-1 text-neutral-400 hover:text-emerald-800 cursor-pointer flex items-center gap-0.5"
                                                  aria-label={`Toggle ${cat.title} products`}
                                                >
                                                  <span className="text-[10px] font-mono text-neutral-400">({catProds.length})</span>
                                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCatExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          {/* Nested sub products under this category (e.g. Dairy Alternatives products) */}
                                          {isCatExpanded && (
                                            <div className="pl-3 pr-1 py-1 space-y-1.5 border-l-2 border-emerald-400/60 ml-2 bg-emerald-50/30 rounded-r-lg p-1.5">
                                              {catProds.length > 0 ? (
                                                <>
                                                  {catProds.map(p => (
                                                    <button
                                                      key={p.id}
                                                      type="button"
                                                      onClick={() => handleNavigateCategory(cat.id)}
                                                      className="w-full text-left py-1 text-[11px] text-neutral-700 hover:text-emerald-800 font-semibold truncate flex items-center justify-between gap-1"
                                                    >
                                                      <span className="truncate">• {p.name}</span>
                                                      {p.price !== undefined && (
                                                        <span className="text-[10px] font-mono text-emerald-700 font-bold shrink-0">₹{p.price}</span>
                                                      )}
                                                    </button>
                                                  ))}
                                                  <button
                                                    type="button"
                                                    onClick={() => handleNavigateCategory(cat.id)}
                                                    className="w-full text-left pt-1 mt-1 border-t border-emerald-200/70 text-[10px] font-bold text-emerald-800 hover:underline block"
                                                  >
                                                    View All {cat.title} Products &rarr;
                                                  </button>
                                                </>
                                              ) : (
                                                <span className="text-[10px] text-neutral-400 italic block">No products in this category yet.</span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            categoriesList.map((cat) => {
                              const isCatExpanded = expandedMobileCatId === cat.id;
                              const catProds = getCategoryProducts(cat);
                              return (
                                <div key={cat.id} className="space-y-0.5">
                                  <div className="flex items-center justify-between rounded-lg hover:bg-emerald-50/60 px-2 py-1.5 transition-colors">
                                    <button
                                      type="button"
                                      onClick={() => handleNavigateCategory(cat.id)}
                                      className="text-xs font-bold text-neutral-800 hover:text-emerald-800 text-left flex-1"
                                    >
                                      {cat.title}
                                    </button>
                                    {catProds.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedMobileCatId(isCatExpanded ? null : cat.id);
                                        }}
                                        className="p-1 text-neutral-400 hover:text-emerald-800 cursor-pointer flex items-center gap-1"
                                        aria-label={`Toggle ${cat.title} products`}
                                      >
                                        <span className="text-[10px] font-mono text-neutral-400">({catProds.length})</span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCatExpanded ? 'rotate-180' : ''}`} />
                                      </button>
                                    )}
                                  </div>

                                  {/* Nested products under this category */}
                                  {isCatExpanded && catProds.length > 0 && (
                                    <div className="pl-3 pr-1 py-1 space-y-1 border-l border-neutral-200 ml-2">
                                      {catProds.map(p => (
                                        <button
                                          key={p.id}
                                          type="button"
                                          onClick={() => handleNavigateCategory(cat.id)}
                                          className="w-full text-left py-1 text-[11px] text-neutral-600 hover:text-emerald-800 font-medium truncate block"
                                        >
                                          • {p.name}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
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
