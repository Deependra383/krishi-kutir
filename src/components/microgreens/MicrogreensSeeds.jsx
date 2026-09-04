import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Zap, Leaf } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { SEEDS_CATALOGUE } from '../../data';
import { getCategoryFallbackImage } from '../../utils/categoryImages';

export const MicrogreensSeeds = ({
  formatPrice,
  onAddToCart,
  onBuyNow,
  addedItemEffect = {},
  hoverState = {}
}) => {
  const { products } = useProducts();
  const [seedSearch, setSeedSearch] = useState('');

  // Combine Firestore products categorized as seeds with initial seed metadata
  const seedList = useMemo(() => {
    const fromContextSeeds = (products || []).filter(p => 
      p.category === 'Microgreens Seeds' || 
      (p.category?.toLowerCase().includes('seed') && !p.category?.toLowerCase().includes('powder'))
    );
    
    if (fromContextSeeds.length > 0) {
      return fromContextSeeds.map(s => ({
        ...s,
        price100g: s.price100g || Math.round(s.price * 0.15) || 120,
        kgPrice: s.price || s.kgPrice || 800,
        moq: s.moq || '100 GM'
      }));
    }
    return SEEDS_CATALOGUE;
  }, [products]);

  const filteredSeeds = useMemo(() => {
    return seedList.filter(s =>
      s.name?.toLowerCase().includes(seedSearch.toLowerCase()) ||
      s.benefit?.toLowerCase().includes(seedSearch.toLowerCase())
    );
  }, [seedList, seedSearch]);

  return (
    <div id="microgreens-seeds" className="space-y-8 pt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Untreated & Non-GMO</span>
          <h3 className="text-3xl font-black uppercase text-neutral-900 mt-1">Microgreens Seeds Catalogue</h3>
          <p className="text-xs text-neutral-500 font-light mt-1">
            High-germination rate certified seeds tested for microgreen vertical farming.
          </p>
        </div>
        
        {/* Quick Seed Filter input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            id="seed-search-input"
            type="text"
            placeholder="Search seeds (broccoli, kale, basil)..."
            value={seedSearch}
            onChange={(e) => setSeedSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
        {filteredSeeds.map((seed) => {
          const isAdded = addedItemEffect[seed.id];
          const productObj = { ...seed, price: seed.kgPrice || seed.price, unit: 'KG' };
          const fallbackImg = getCategoryFallbackImage('Microgreens Seeds', seed.name);

          return (
            <div 
              key={seed.id}
              id={`product-card-${seed.id}`}
              className="bg-white border border-neutral-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300 group"
            >
              <div>
                <div className="h-32 rounded-xl overflow-hidden relative mb-3 bg-neutral-100">
                  <img 
                    src={seed.image || fallbackImg} 
                    alt={seed.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImg;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex justify-between items-start gap-1">
                  <h4 className="font-bold text-neutral-900 text-xs leading-snug line-clamp-2">{seed.name}</h4>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                    MOQ: {seed.moq || '100 GM'}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 font-light mt-1 line-clamp-2">{seed.benefit}</p>
                
                <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-neutral-400 block uppercase">100g Rate</span>
                    <span className="font-bold text-neutral-700 text-xs">{formatPrice(seed.price100g || 120)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-neutral-400 block uppercase">Per KG</span>
                    <span className="font-black text-emerald-700 text-xs">{formatPrice(seed.kgPrice || seed.price || 800)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 grid grid-cols-2 gap-1.5">
                <button
                  id={`add-cart-${seed.id}`}
                  onClick={(e) => onAddToCart(e, productObj)}
                  className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                    isAdded 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                  }`}
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>{isAdded ? 'Added' : 'Add'}</span>
                </button>
                <button
                  id={`buy-now-${seed.id}`}
                  onClick={(e) => onBuyNow(e, productObj)}
                  className="py-1.5 text-[10px] font-extrabold uppercase rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>Buy</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSeeds.length === 0 && (
        <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-200">
          <p className="text-xs text-neutral-500">No seeds found matching "{seedSearch}".</p>
        </div>
      )}
    </div>
  );
};
