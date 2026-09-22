import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { SEEDS_CATALOGUE } from '../../data';
import { ProductCard } from '../common/ProductCard';

export const MicrogreensSeeds = ({
  formatPrice,
  onOpenAdmin
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
    if (!seedSearch.trim()) return seedList;
    const q = seedSearch.toLowerCase();
    return seedList.filter(s => 
      s.name.toLowerCase().includes(q) || 
      (s.benefit && s.benefit.toLowerCase().includes(q))
    );
  }, [seedList, seedSearch]);

  return (
    <div className="space-y-6 select-none">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <h3 className="text-base sm:text-lg font-black uppercase text-neutral-900">Untreated Microgreen Seeds</h3>
          <p className="text-xs text-neutral-500 font-light">Certified non-GMO, chemical-free seeds with over 90% germination rate.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text"
            placeholder="Search seeds (broccoli, kale, basil)..."
            value={seedSearch}
            onChange={(e) => setSeedSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid using the unified ProductCard */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        {filteredSeeds.map((seed) => (
          <ProductCard
            key={seed.id}
            product={{
              ...seed,
              price: seed.kgPrice || seed.price || 800,
              unit: `Per KG • MOQ ${seed.moq || '100g'}`,
              category: 'Microgreens Seeds',
            }}
            formatPrice={formatPrice}
            onOpenAdmin={onOpenAdmin}
            badgeText="Untreated Seeds"
          />
        ))}
      </div>

      {filteredSeeds.length === 0 && (
        <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-200">
          <p className="text-xs text-neutral-500">No seeds found matching "{seedSearch}".</p>
        </div>
      )}
    </div>
  );
};
