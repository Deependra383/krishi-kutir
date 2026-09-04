import React, { useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { HARVESTED_MICROGREENS } from '../../data';
import { ProductCard } from '../common/ProductCard';

export const HarvestedMicrogreens = ({
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

  // Dynamically filter harvested microgreens from context products
  const harvestedList = useMemo(() => {
    const fromContext = (products || []).filter(p => 
      p.category === 'Harvested Microgreens' ||
      (p.category?.toLowerCase().includes('harvest') && p.category?.toLowerCase().includes('microgreen'))
    );
    return fromContext.length > 0 ? fromContext : HARVESTED_MICROGREENS;
  }, [products]);

  return (
    <div id="harvested-microgreens" className="space-y-8 pt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Fresh Cut & Packed Daily</span>
          <h3 className="text-3xl font-black uppercase text-neutral-900 mt-1">Harvested Microgreens</h3>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Hand-harvested at peak cotyledon maturity, packed in breathable biodegradable clamshells.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 self-start md:self-auto">
          {harvestedList.length} Fresh Harvest Varieties
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {harvestedList.map((product) => (
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
            badgeText="Fresh Cut"
            badgeColor="bg-emerald-600/90"
          />
        ))}
      </div>
    </div>
  );
};
