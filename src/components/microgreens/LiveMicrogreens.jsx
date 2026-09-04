import React, { useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { LIVE_MICROGREENS } from '../../data';
import { ProductCard } from '../common/ProductCard';

export const LiveMicrogreens = ({
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

  // Dynamically filter live microgreens from context products
  const liveList = useMemo(() => {
    const fromContext = (products || []).filter(p => 
      p.category === 'Live Microgreens' ||
      (p.category?.toLowerCase().includes('live') && p.category?.toLowerCase().includes('microgreen'))
    );
    return fromContext.length > 0 ? fromContext : LIVE_MICROGREENS;
  }, [products]);

  return (
    <div id="live-microgreens" className="space-y-8 pt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Grow on Your Countertop</span>
          <h3 className="text-3xl font-black uppercase text-neutral-900 mt-1">Live Microgreens Trays</h3>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Delivered living on organic coco-coir mats. Cut freshly on-demand for zero vitamin oxidation.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 self-start md:self-auto">
          {liveList.length} Live Trays Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {liveList.map((product) => (
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
            badgeText="Live Root Pad"
            badgeColor="bg-amber-600/90"
          />
        ))}
      </div>
    </div>
  );
};
