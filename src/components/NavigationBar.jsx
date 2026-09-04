import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ShoppingBag, 
  ShieldCheck, 
  Menu, 
  X,
  Package,
  Moon,
  Sun
} from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const NAV_TABS = [
  { id: 'home', label: 'Home', badge: '4', sectionId: '' },
  { id: 'products', label: 'Products', badge: null, sectionId: 'microgreens-section' },
  { id: 'about', label: 'About', badge: null, sectionId: 'about-philosophy' },
  { id: 'training', label: 'Training', badge: null, sectionId: 'training-academy' },
  { id: 'partner', label: 'Partner With Us', badge: null, sectionId: 'partner-with-us' },
];

export const NavigationBar = ({ 
  onOpenAuth, 
  onOpenProfile, 
  onOpenAdmin 
}) => {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Programmatic scroll lock ref to prevent scroll-spy from fighting tab clicks
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
    // 1. Immediately update active tab so slider pill glides instantly
    setActiveTab(tab.id);
    setIsMobileMenuOpen(false);

    // 2. Lock scroll spy during smooth travel so it cannot revert or flicker
    isManualScrollRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 1100);

    // 3. Scroll to the exact position with comfortable header offset
    if (!tab.sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(tab.sectionId);
    if (el) {
      const rect = el.getBoundingClientRect();
      const targetY = rect.top + window.scrollY - 85;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
    window.location.hash = 'cart';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 w-full max-w-7xl mx-auto select-none transition-all duration-300">
      
      {/* Floating Capsule Bar */}
      <div className={`backdrop-blur-md rounded-full border px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-neutral-900/95 border-neutral-800 text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-white/95 border-neutral-200/80 text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.07)]'
      }`}>
        
        {/* Brand Logo & Name */}
        <a 
          href="#" 
          onClick={(e) => { 
            e.preventDefault(); 
            handleTabClick(NAV_TABS[0]); 
          }}
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 group pl-1.5"
        >
          <AnimatedLogo size={36} showText={false} />
          <div className="flex flex-col leading-tight">
            <span className={`font-serif font-black text-sm sm:text-base tracking-tight transition-colors ${
              isDarkMode ? 'text-white group-hover:text-emerald-400' : 'text-neutral-900 group-hover:text-emerald-700'
            }`}>
              Krishi Kutir
            </span>
            <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-emerald-600 hidden sm:block">
              The Leaf Lounge
            </span>
          </div>
        </a>

        {/* Center: Sliding Pill Navigation Bar (matching reference design) */}
        <div className="hidden lg:flex items-center">
          <nav className={`rounded-full p-1 shadow-xs border flex items-center relative transition-colors ${
            isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200/70'
          }`}>
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`relative px-3.5 xl:px-4.5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 z-10 select-none whitespace-nowrap ${
                    isActive 
                      ? 'text-white' 
                      : isDarkMode 
                        ? 'text-neutral-300 hover:text-white' 
                        : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  {/* Active Sliding Brand Green Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavSliderPill"
                      className="absolute inset-0 bg-[#2d6a4f] rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  
                  <span className="relative z-10">{tab.label}</span>
                  
                  {/* Circular Badge for Active Tab */}
                  {isActive && tab.badge && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="relative z-10 w-5 h-5 rounded-full bg-amber-300 text-neutral-950 text-[11px] font-black flex items-center justify-center shadow-xs"
                    >
                      {tab.badge}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 shrink-0 pr-1">
          
          {/* Night / Dark Mode Toggle Button */}
          <button
            id="nav-theme-toggle-btn"
            type="button"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Day / Light Mode' : 'Switch to Night / Dark Mode'}
            aria-label="Toggle Night or Dark Mode"
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
              isDarkMode
                ? 'bg-neutral-800 hover:bg-neutral-700 text-[#2d6a4f] border-neutral-700 shadow-xs'
                : 'bg-neutral-50 hover:bg-neutral-100 text-[#2d6a4f] hover:text-[#1b4332] border-neutral-200/90'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span className="hidden xl:inline text-[#2d6a4f]">Day</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span className="hidden xl:inline text-[#2d6a4f]">Night</span>
              </>
            )}
          </button>

          {/* Store Admin Dashboard Button */}
          <button
            id="nav-admin-btn"
            type="button"
            onClick={onOpenAdmin}
            title="Store Admin Management"
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
              isAdmin 
                ? 'bg-neutral-900 text-amber-400 border-neutral-900 shadow-xs' 
                : isDarkMode
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200/80'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isAdmin ? 'text-amber-400' : isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
            <span className="hidden xl:inline">{isAdmin ? 'Admin Panel' : 'Admin'}</span>
          </button>

          {/* User Profile / Authentication */}
          {currentUser ? (
            <button
              id="nav-profile-btn"
              type="button"
              onClick={onOpenProfile}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700' 
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200/80'
              }`}
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
              className={`px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700' 
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200/80'
              }`}
            >
              <User className={`w-3.5 h-3.5 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`} />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Shopping Bag Button - Respects Light Theme */}
          <button
            id="nav-cart-btn"
            type="button"
            onClick={handleOpenCart}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full transition-all cursor-pointer relative flex items-center gap-2 border shadow-xs ${
              isDarkMode
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border-neutral-700'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 hover:text-black border-neutral-200/90'
            }`}
            title="View Shopping Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Bag</span>
            {totalItemsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full font-black text-[10px] min-w-[18px] text-center shadow-xs bg-[#2d6a4f] text-white">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-full cursor-pointer transition-colors ${
              isDarkMode 
                ? 'text-[#2d6a4f] hover:text-white hover:bg-neutral-800' 
                : 'text-[#2d6a4f] hover:text-[#1b4332] hover:bg-neutral-100'
            }`}
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
            className={`lg:hidden mt-2 p-3 backdrop-blur-md rounded-3xl shadow-xl border space-y-1 transition-colors ${
              isDarkMode 
                ? 'bg-neutral-900/95 border-neutral-800 text-white' 
                : 'bg-white/95 border-neutral-200/80 text-neutral-900'
            }`}
          >
            <div className="flex flex-col gap-1 p-1">
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`mobile-nav-tab-${tab.id}`}
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#2d6a4f] text-white shadow-xs' 
                        : isDarkMode
                          ? 'text-neutral-300 hover:bg-neutral-800'
                          : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center ${
                        isActive ? 'bg-amber-300 text-neutral-950' : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Mobile Night/Dark Mode Toggle */}
              <button
                type="button"
                onClick={() => {
                  toggleDarkMode();
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer mt-1 border ${
                  isDarkMode 
                    ? 'bg-neutral-800 text-[#2d6a4f] border-neutral-700' 
                    : 'bg-neutral-50 hover:bg-neutral-100 text-[#2d6a4f] border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDarkMode ? <Sun className="w-4 h-4 text-[#2d6a4f]" /> : <Moon className="w-4 h-4 text-[#2d6a4f]" />}
                  <span>{isDarkMode ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}</span>
                </div>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-700 text-[#2d6a4f]">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('my-orders-section');
                  if (el) {
                    const rect = el.getBoundingClientRect();
                    window.scrollTo({ top: Math.max(0, rect.top + window.scrollY - 85), behavior: 'smooth' });
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer mt-1 border-t pt-2.5 ${
                  isDarkMode ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-100 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-600">
                  <Package className="w-4 h-4" />
                  <span>Track My Orders</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
