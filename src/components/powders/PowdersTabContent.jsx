import React, { useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { DAIRY_ALTERNATIVES, FRUITS_AND_VEGETABLES_POWDERS, SPICES_AND_SEASONING } from '../../data';
import { ProductCard } from '../common/ProductCard';

export const PowdersTabContent = ({
  activeTab, // 'dairy' | 'fruits-veg' | 'spices' | 'all'
  searchTerm,
  activeTheme,
  formatPrice,
  setSelectedMicroscopeItem,
  onAddToCart,
  onBuyNow,
  addedItemEffect = {},
  hoverCoords = {},
  hoverState = {},
  handleCardMouseMove,
  handleCardMouseEnter,
  handleCardMouseLeave,
  onOpenAdmin
}) => {
  const { products } = useProducts();

  const currentProducts = useMemo(() => {
    let baseList = [];
    
    if (activeTab === 'dairy') {
      const fromContext = (products || []).filter(p => 
        p.category === 'Dairy Alternatives' || 
        p.category?.toLowerCase().includes('dairy') ||
        p.category?.toLowerCase().includes('milk')
      );
      baseList = fromContext.length > 0 ? fromContext : DAIRY_ALTERNATIVES;
    } else if (activeTab === 'fruits-veg') {
      const fromContext = (products || []).filter(p => 
        p.category === 'Fruits and Vegetables' || 
        p.category === 'Vegetables Powder' || 
        p.category === 'Fruit Powder' ||
        p.category?.toLowerCase().includes('fruit') ||
        p.category?.toLowerCase().includes('vegetable')
      );
      baseList = fromContext.length > 0 ? fromContext : FRUITS_AND_VEGETABLES_POWDERS;
    } else if (activeTab === 'spices') {
      const fromContext = (products || []).filter(p => 
        p.category === 'Spices and Seasoning' || 
        p.category === 'Premium Spices Powder' ||
        p.category?.toLowerCase().includes('spice') ||
        p.category?.toLowerCase().includes('seasoning')
      );
      baseList = fromContext.length > 0 ? fromContext : SPICES_AND_SEASONING;
    } else {
      // All Powders & Spices
      baseList = (products || []).filter(p => 
        p.category?.toLowerCase().includes('powder') ||
        p.category?.toLowerCase().includes('spice') ||
        p.category?.toLowerCase().includes('dairy') ||
        p.category?.toLowerCase().includes('fruit') ||
        p.category?.toLowerCase().includes('vegetable')
      );
    }

    if (!searchTerm.trim()) return baseList;

    return baseList.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.benefit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, activeTab, searchTerm]);

  if (currentProducts.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-neutral-200 p-8 space-y-2">
        <p className="text-neutral-500 font-bold text-sm">No botanical powders found matching your search.</p>
        <p className="text-xs text-neutral-400">Try searching for moringa, turmeric, amchur, or oat milk.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {currentProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          activeTheme={activeTheme}
          formatPrice={formatPrice}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          isAdded={addedItemEffect[product.id]}
          onInspect={setSelectedMicroscopeItem}
          onOpenAdmin={onOpenAdmin}
          isHovering={hoverState[product.id]}
          coord={hoverCoords[product.id]}
          onMouseMove={handleCardMouseMove}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />
      ))}
    </div>
  );
};
