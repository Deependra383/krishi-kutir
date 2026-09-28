import React, { useState, useRef } from 'react';
import { useScroll } from 'motion/react';
import { HarvestedMicrogreens } from './microgreens/HarvestedMicrogreens';
import { LiveMicrogreens } from './microgreens/LiveMicrogreens';
import { MicrogreensSeeds } from './microgreens/MicrogreensSeeds';
import { MicrogreensTraining } from './microgreens/MicrogreensTraining';
import { useCart } from '../context/CartContext';
import { BotanicalSectionBackdrop } from './common/BotanicalSectionBackdrop';

export const MicrogreensSection = ({
  activeTheme,
  formatPrice,
  setSelectedMicroscopeItem,
  hoverCoords,
  hoverState,
  handleCardMouseMove,
  handleCardMouseEnter,
  handleCardMouseLeave,
  onOpenAdmin
}) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const { addToCart, setIsCheckoutOpen } = useCart();
  const [addedItemEffect, setAddedItemEffect] = useState({});

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItemEffect(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemEffect(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  return (
    <section 
      ref={sectionRef}
      id="microgreens-section" 
      className="w-full py-16 px-4 sm:px-6 lg:px-8 space-y-24 font-sans relative overflow-hidden"
    >
      {/* Botanical Background Decor with Parallax */}
      <BotanicalSectionBackdrop variant="microgreens" scrollYProgress={scrollYProgress} />

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
      {/* 1. Harvested Microgreens Sub-section */}
      <HarvestedMicrogreens 
        activeTheme={activeTheme}
        formatPrice={formatPrice}
        setSelectedMicroscopeItem={setSelectedMicroscopeItem}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        addedItemEffect={addedItemEffect}
        hoverCoords={hoverCoords}
        hoverState={hoverState}
        handleCardMouseMove={handleCardMouseMove}
        handleCardMouseEnter={handleCardMouseEnter}
        handleCardMouseLeave={handleCardMouseLeave}
        onOpenAdmin={onOpenAdmin}
      />

      {/* 3. Live Microgreens Sub-section */}
      <LiveMicrogreens 
        activeTheme={activeTheme}
        formatPrice={formatPrice}
        setSelectedMicroscopeItem={setSelectedMicroscopeItem}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        addedItemEffect={addedItemEffect}
        hoverCoords={hoverCoords}
        hoverState={hoverState}
        handleCardMouseMove={handleCardMouseMove}
        handleCardMouseEnter={handleCardMouseEnter}
        handleCardMouseLeave={handleCardMouseLeave}
        onOpenAdmin={onOpenAdmin}
      />

      {/* 4. Microgreens Seeds Sub-section */}
      <MicrogreensSeeds 
        formatPrice={formatPrice}
        onOpenAdmin={onOpenAdmin}
      />

      {/* 5. Microgreens Training & Masterclass Contact Section */}
      <MicrogreensTraining />
      </div>
    </section>
  );
};

