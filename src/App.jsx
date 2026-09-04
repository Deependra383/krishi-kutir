/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { THEMES, CURRENCIES } from './data';

// Context Providers
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';
import { LogoProvider } from './context/LogoContext';

// Component Imports
import { NavigationBar } from './components/NavigationBar';
import { HeroSlider } from './components/HeroSlider';
import { AboutSection } from './components/AboutSection';
import { MicrogreensSection } from './components/MicrogreensSection';
import { PowdersAndSpicesSection } from './components/PowdersAndSpicesSection';
import { ProductCatalog } from './components/ProductCatalog';
import { PartnerWithUsSection } from './components/PartnerWithUsSection';
import { MyOrdersSection } from './components/MyOrdersSection';
import { MicroscopeOverlay } from './components/MicroscopeOverlay';
import { Certifications } from './components/Certifications';
import { ProductDivisionsGrid } from './components/ProductDivisionsGrid';
import { VenkateshQualityPillars } from './components/VenkateshQualityPillars';
import { Footer } from './components/Footer';
import { FloatingThemeToggle } from './components/common/FloatingThemeToggle';

// Modals & Drawers
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CartDrawer } from './components/CartDrawer';
import { FullPageCart } from './components/FullPageCart';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';

function MainAppContent() {
  const { currentUser, isAdmin } = useAuth();
  const { isCheckoutOpen, setIsCheckoutOpen, isCartOpen, setIsCartOpen } = useCart();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Page View State: 'store' | 'admin' | 'cart'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    if (typeof window !== 'undefined' && (window.location.hash === '#cart' || window.location.hash === '#bag')) {
      return 'cart';
    }
    return 'store';
  });

  // Sync isCartOpen with currentView
  useEffect(() => {
    if (isCartOpen && currentView !== 'cart') {
      setCurrentView('cart');
      if (window.location.hash !== '#cart') {
        window.location.hash = 'cart';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isCartOpen, currentView]);

  // Listen to hash changes for browser back / direct link navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
        setIsCartOpen(false);
      } else if (window.location.hash === '#cart' || window.location.hash === '#bag') {
        setCurrentView('cart');
        setIsCartOpen(true);
      } else {
        setCurrentView('store');
        setIsCartOpen(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setIsCartOpen]);

  // Active Theme (Clean Modern Default)
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  
  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Parallax interaction variables for custom cards
  const [hoverCoords, setHoverCoords] = useState({});
  const [hoverState, setHoverState] = useState({});

  // Currency state
  const [activeCurrency, setActiveCurrency] = useState('INR');
  
  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Certificate / Microscope Viewer State
  const [selectedMicroscopeItem, setSelectedMicroscopeItem] = useState(null);

  // Dynamic currency conversion helper
  const formatPrice = (priceInINR) => {
    const currency = CURRENCIES[activeCurrency] || CURRENCIES.INR;
    const converted = (Number(priceInINR) || 0) * currency.rate;
    return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: activeCurrency === 'INR' ? 0 : 2 })}`;
  };

  // Mouse hover coordinate tracking for card floating effect
  const handleCardMouseMove = (e, cardId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    setHoverCoords(prev => ({ ...prev, [cardId]: { x, y } }));
  };

  const handleCardMouseEnter = (cardId) => {
    setHoverState(prev => ({ ...prev, [cardId]: true }));
  };

  const handleCardMouseLeave = (cardId) => {
    setHoverState(prev => ({ ...prev, [cardId]: false }));
    setHoverCoords(prev => ({ ...prev, [cardId]: { x: 0, y: 0 } }));
  };

  // Auth & Admin Open Handlers
  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setCurrentView('admin');
      window.location.hash = 'admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAuthInitialTab('admin');
      setIsAuthModalOpen(true);
    }
  };

  const handleBackToStore = () => {
    setCurrentView('store');
    setIsCartOpen(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin View is active, render full-page Admin Dashboard
  if (currentView === 'admin') {
    return (
      <AdminDashboard 
        onBackToStore={handleBackToStore}
        formatPrice={formatPrice}
      />
    );
  }

  // If Bag/Cart View is active, render full-page Shopping Bag (like Admin Panel)
  if (currentView === 'cart' || isCartOpen) {
    return (
      <div className={`min-h-screen font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-[#f8fcf9] text-neutral-900'
      }`}>
        <FullPageCart 
          onBackToStore={handleBackToStore}
          formatPrice={formatPrice}
          onProceedToCheckout={() => setIsCheckoutOpen(true)}
          onOpenAuth={handleOpenAuth}
          onOpenOrders={() => {
            handleBackToStore();
            setTimeout(() => {
              const el = document.getElementById('my-orders-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />

        {/* Razorpay Checkout & Address Modal */}
        <CheckoutModal 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          formatPrice={formatPrice}
          onOpenAuth={handleOpenAuth}
        />

        {/* User Authentication Modal */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authInitialTab}
          onAdminSuccess={() => {
            setIsAuthModalOpen(false);
            setCurrentView('admin');
            window.location.hash = 'admin';
          }}
        />

        {/* Quick Night / Dark Mode Toggle */}
        <FloatingThemeToggle />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 font-sans ${
      isDarkMode ? 'bg-[#0b110e] text-neutral-100' : `${activeTheme.bodyClass}`
    }`}>
      
      {/* ================= BACKGROUND DECORATIVE FLOATING ELEMENTS ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[15%] right-[5%] w-96 h-96 bg-[#be123c]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[50%] left-[80%] w-60 h-60 bg-amber-200/15 rounded-full blur-3xl"></div>
      </div>

      {/* ================= PRIMARY NAVIGATION BAR ================= */}
      <NavigationBar 
        activeTheme={activeTheme} 
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        activeCurrency={activeCurrency}
      />

      {/* ================= INTERACTIVE HERO SLIDER ================= */}
      <HeroSlider 
        activeTheme={activeTheme} 
        carouselIndex={carouselIndex} 
        setCarouselIndex={setCarouselIndex} 
        hoverCoords={hoverCoords} 
        hoverState={hoverState} 
        handleCardMouseMove={handleCardMouseMove} 
        handleCardMouseEnter={handleCardMouseEnter} 
        handleCardMouseLeave={handleCardMouseLeave} 
      />

      {/* ================= PRODUCT DIVISIONS SHOWCASE (Venkatesh Naturals style) ================= */}
      <ProductDivisionsGrid />

      {/* ================= PURITY & QUALITY PILLARS (Venkatesh Naturals style) ================= */}
      <VenkateshQualityPillars />

      {/* ================= MEET THE FOUNDERS & OUR STORY ================= */}
      <AboutSection 
        activeTheme={activeTheme} 
      />

      {/* ================= 1. MICROGREENS DIVISION (Description -> Harvested -> Live -> Seeds -> Training Contact) ================= */}
      <MicrogreensSection 
        activeTheme={activeTheme}
        formatPrice={formatPrice}
        setSelectedMicroscopeItem={setSelectedMicroscopeItem}
        hoverCoords={hoverCoords}
        hoverState={hoverState}
        handleCardMouseMove={handleCardMouseMove}
        handleCardMouseEnter={handleCardMouseEnter}
        handleCardMouseLeave={handleCardMouseLeave}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* ================= 2. HERBAL POWDERS, SPICES & SEASONING (Dairy Alternatives -> Fruits & Veg -> Spices) ================= */}
      <PowdersAndSpicesSection 
        activeTheme={activeTheme}
        formatPrice={formatPrice}
        setSelectedMicroscopeItem={setSelectedMicroscopeItem}
        hoverCoords={hoverCoords}
        hoverState={hoverState}
        handleCardMouseMove={handleCardMouseMove}
        handleCardMouseEnter={handleCardMouseEnter}
        handleCardMouseLeave={handleCardMouseLeave}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* ================= FULL PAGE ALL PRODUCTS CATALOGUE (Shows all added products across all categories) ================= */}
      <ProductCatalog
        activeTheme={activeTheme}
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
        setSelectedMicroscopeItem={setSelectedMicroscopeItem}
        hoverCoords={hoverCoords}
        hoverState={hoverState}
        handleCardMouseMove={handleCardMouseMove}
        handleCardMouseEnter={handleCardMouseEnter}
        handleCardMouseLeave={handleCardMouseLeave}
        formatPrice={formatPrice}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* ================= 3. PARTNER WITH US (Inquiry Form -> Images & Description) ================= */}
      <PartnerWithUsSection 
        activeTheme={activeTheme}
      />

      {/* ================= 4. MY ORDERS & LIVE ORDER TRACKING ================= */}
      <MyOrdersSection 
        activeTheme={activeTheme}
        formatPrice={formatPrice}
        onOpenAuth={handleOpenAuth}
        onOpenCart={() => {
          setIsCartOpen(true);
          setCurrentView('cart');
          window.location.hash = 'cart';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* ================= EXPLORE BEHIND THE SEED MICROSCOPE OVERLAY ================= */}
      <MicroscopeOverlay 
        selectedMicroscopeItem={selectedMicroscopeItem} 
        setSelectedMicroscopeItem={setSelectedMicroscopeItem} 
        activeTheme={activeTheme} 
        formatPrice={formatPrice} 
      />

      {/* ================= GLOBAL CERTIFICATIONS & BIO-SECURITY ================= */}
      <Certifications 
        activeTheme={activeTheme} 
        hoverCoords={hoverCoords} 
        hoverState={hoverState} 
        handleCardMouseMove={handleCardMouseMove} 
        handleCardMouseEnter={handleCardMouseEnter} 
        handleCardMouseLeave={handleCardMouseLeave} 
        formatPrice={formatPrice} 
      />

      {/* ================= DETAILED FOOTER ================= */}
      <Footer 
        onOpenAuth={handleOpenAuth}
        onOpenAdmin={handleOpenAdmin}
      />


      {/* ================= RAZORPAY CHECKOUT & ADDRESS MODAL ================= */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        formatPrice={formatPrice}
        onOpenAuth={handleOpenAuth}
      />

      {/* ================= USER AUTHENTICATION MODAL ================= */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authInitialTab}
        onAdminSuccess={() => {
          setIsAuthModalOpen(false);
          setCurrentView('admin');
          window.location.hash = 'admin';
        }}
      />

      {/* ================= USER PROFILE & ORDERS MODAL ================= */}
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenAdmin={handleOpenAdmin}
        formatPrice={formatPrice}
      />

      {/* Global Floating Quick Theme Switcher */}
      <FloatingThemeToggle />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LogoProvider>
          <ProductProvider>
            <CartProvider>
              <MainAppContent />
            </CartProvider>
          </ProductProvider>
        </LogoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
