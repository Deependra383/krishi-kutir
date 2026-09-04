import React, { useState } from 'react';
import { Milk, Apple, Flame, Search } from 'lucide-react';
import { PowdersOverview } from './powders/PowdersOverview';
import { PowdersTabContent } from './powders/PowdersTabContent';
import { useCart } from '../context/CartContext';

export const PowdersAndSpicesSection = ({
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
  const [activeTab, setActiveTab] = useState('dairy'); // 'dairy' | 'fruits-veg' | 'spices'
  const [searchTerm, setSearchTerm] = useState('');
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
    <section id="powders-spices-section" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 font-sans">
      {/* 1. Header Overview */}
      <PowdersOverview />

      {/* 2. Sub-Section Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start w-full sm:w-auto">
          {/* Option 1: Dairy alternatives */}
          <button
            id="tab-dairy-alternatives"
            onClick={() => setActiveTab('dairy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dairy'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/10'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
            }`}
          >
            <Milk className="w-4 h-4" />
            <span>1. Dairy Alternatives</span>
          </button>

          {/* Option 2: Fruits & Vegetables */}
          <button
            id="tab-fruits-vegetables"
            onClick={() => setActiveTab('fruits-veg')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'fruits-veg'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/10'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>2. Fruits & Vegetables</span>
          </button>

          {/* Option 3: Spices & Seasoning */}
          <button
            id="tab-spices-seasoning"
            onClick={() => setActiveTab('spices')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'spices'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/10'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>3. Spices & Seasoning</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="powders-search-input"
            type="text"
            placeholder="Search powders & spices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-full text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
          />
        </div>
      </div>

      {/* 3. Tab Grid Products */}
      <PowdersTabContent
        activeTab={activeTab}
        searchTerm={searchTerm}
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
    </section>
  );
};
