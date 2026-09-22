/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THEMES } from './data';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';
import { LogoProvider } from './context/LogoContext';
import { HomepageContentProvider } from './context/HomepageContentContext';

// Component Imports
import { NavigationBar } from './components/NavigationBar';
import { HeroSlider } from './components/HeroSlider';
import { AboutSection } from './components/AboutSection';
import { MicrogreensSection } from './components/MicrogreensSection';
import { PowdersAndSpicesSection } from './components/PowdersAndSpicesSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductInquirySection } from './components/ProductInquirySection';
import { TrainingAcademy } from './components/TrainingAcademy';
import { PartnerWithUsSection } from './components/PartnerWithUsSection';
import { Certifications } from './components/Certifications';
import { ProductDivisionsGrid } from './components/ProductDivisionsGrid';
import { Footer } from './components/Footer';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';

// Modals & Drawers
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CartDrawer } from './components/CartDrawer';
import { FullPageCart } from './components/FullPageCart';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import Lenis from 'lenis';

function MainAppContent() {
  const { currentUser, isAdmin } = useAuth();
  const { isCheckoutOpen, setIsCheckoutOpen, isCartOpen, setIsCartOpen } = useCart();

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

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
        const isStrictAdmin = isAdmin && (currentUser?.email || '').trim().toLowerCase() === 'krishi345@gmail.com';
        if (isStrictAdmin) {
          setCurrentView('admin');
        } else {
          setCurrentView('store');
          window.location.hash = '';
          setAuthInitialTab('login');
          setIsAuthModalOpen(true);
        }
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
  }, [setIsCartOpen, isAdmin, currentUser]);

  // Active Theme (Clean Modern Default)
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  
  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Parallax interaction variables for custom cards
  const [hoverCoords, setHoverCoords] = useState({});
  const [hoverState, setHoverState] = useState({});

  // Currency state - Fixed to Indian Rupee (INR)
  const [activeCurrency] = useState('INR');
  
  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Certificate / Microscope Viewer State
  const [selectedMicroscopeItem, setSelectedMicroscopeItem] = useState(null);

  // Dynamic currency conversion helper - Fixed to INR
  const formatPrice = (priceInINR) => {
    const num = Math.round(Number(priceInINR) || 0);
    return `₹${num.toLocaleString('en-IN')}`;
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
    const isStrictAdmin = isAdmin && (currentUser?.email || '').trim().toLowerCase() === 'krishi345@gmail.com';
    if (isStrictAdmin) {
      setCurrentView('admin');
      window.location.hash = 'admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAuthInitialTab('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleBackToStore = () => {
    setCurrentView('store');
    setIsCartOpen(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {currentView === 'admin' ? (
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <AdminDashboard 
              onBackToStore={handleBackToStore}
              formatPrice={formatPrice}
            />
          </motion.div>
        ) : currentView === 'cart' || isCartOpen ? (
          <motion.div
            key="cart-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="min-h-screen font-sans bg-[#f8fcf9] text-neutral-900"
          >
            <FullPageCart 
              onBackToStore={handleBackToStore}
              formatPrice={formatPrice}
              onProceedToCheckout={() => setIsCheckoutOpen(true)}
              onOpenAuth={handleOpenAuth}
            />
          </motion.div>
        ) : (
          <motion.div
            key="store-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`min-h-screen transition-all duration-300 font-sans ${activeTheme.bodyClass}`}
          >
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

      {/* ================= MEET THE FOUNDERS & OUR STORY ================= */}
      <AboutSection 
        activeTheme={activeTheme} 
      />

      {/* ================= 1. ALL PRODUCTS & FARM PRODUCE CATALOGUE ================= */}
      <ProductCatalog
        activeTheme={activeTheme}
        setSelectedMicroscopeItem={setSelectedMicroscopeItem}
        hoverCoords={hoverCoords}
        hoverState={hoverState}
        handleCardMouseMove={handleCardMouseMove}
        handleCardMouseEnter={handleCardMouseEnter}
        handleCardMouseLeave={handleCardMouseLeave}
        formatPrice={formatPrice}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* ================= 2. HERBAL POWDERS, SPICES & SEASONING ================= */}
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

      {/* ================= 3. MICROGREENS DIVISION & INQUIRE FOR NEXT BATCH ================= */}
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

      {/* ================= DEDICATED WHATSAPP & PRODUCT PURCHASE INQUIRY SECTION ================= */}
      <ProductInquirySection 
        activeTheme={activeTheme}
      />

      {/* ================= 4. TRAINING & GROW ACADEMY ================= */}
      <TrainingAcademy 
        activeTheme={activeTheme}
      />

      {/* ================= 3. PARTNER WITH US (Inquiry Form -> Images & Description) ================= */}
      <PartnerWithUsSection 
        activeTheme={activeTheme}
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
      <Footer />
          </motion.div>
        )}
      </AnimatePresence>


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

      {/* Global Floating Quick WhatsApp Contact Desk */}
      <FloatingWhatsAppButton />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HomepageContentProvider>
          <LogoProvider>
            <ProductProvider>
              <CartProvider>
                <MainAppContent />
              </CartProvider>
            </ProductProvider>
          </LogoProvider>
        </HomepageContentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
