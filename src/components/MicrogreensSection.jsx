import React, { useState } from 'react';
import { MicrogreensOverview } from './microgreens/MicrogreensOverview';
import { HarvestedMicrogreens } from './microgreens/HarvestedMicrogreens';
import { LiveMicrogreens } from './microgreens/LiveMicrogreens';
import { MicrogreensSeeds } from './microgreens/MicrogreensSeeds';
import { MicrogreensTraining } from './microgreens/MicrogreensTraining';
import { useCart } from '../context/CartContext';

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
    <section id="microgreens-section" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-24 font-sans">
      {/* 1. Microgreens Nutritional Profile & Description Bento */}
      <MicrogreensOverview />

      {/* 2. Harvested Microgreens Sub-section */}
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
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        addedItemEffect={addedItemEffect}
        hoverState={hoverState}
      />

      {/* 5. Microgreens Training & Masterclass Contact Section */}
      <MicrogreensTraining />
    </section>
  );
};
