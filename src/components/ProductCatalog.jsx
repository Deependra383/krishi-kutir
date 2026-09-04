import React, { useState, useMemo } from 'react';
import { Search, Globe, Leaf, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CURRENCIES } from '../data';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from './common/ProductCard';

export const ProductCatalog = ({
  activeTheme,
  activeCurrency,
  setActiveCurrency,
  setSelectedMicroscopeItem,
  hoverCoords = {},
  hoverState = {},
  handleCardMouseMove,
  handleCardMouseEnter,
  handleCardMouseLeave,
  formatPrice,
  onOpenAdmin
}) => {
  const { products } = useProducts();
  const { addToCart, setIsCheckoutOpen } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [addedItemEffect, setAddedItemEffect] = useState({});

  // Dynamic list of categories detected in products + common defaults
  const categories = useMemo(() => {
    const set = new Set(['All']);
    (products || []).forEach(p => {
      if (p.category) set.add(p.category);
    });
    // Ensure core expected categories exist
    ['Harvested Microgreens', 'Live Microgreens', 'Microgreens Seeds', 'Dairy Alternatives', 'Fruits and Vegetables', 'Spices and Seasoning', 'Professional Grow Trays', 'Substrates & Growing Mediums'].forEach(c => set.add(c));
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = (products || []).filter(p => {
      const name = p.name || '';
      const benefit = p.benefit || '';
      const category = p.category || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            benefit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            category.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        matchesCategory = category.toLowerCase() === selectedCategory.toLowerCase() ||
                          category.toLowerCase().includes(selectedCategory.toLowerCase());
      }
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-low') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [products, searchTerm, selectedCategory, sortBy]);

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
    <section id="full-catalogue-section" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto font-sans space-y-10">
      
      {/* Catalog Showcase Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Full Product Catalog & Farm Store</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-900">
          All Products & Farm Produce
        </h2>
        <p className="text-neutral-600 text-sm md:text-base font-light max-w-2xl mx-auto">
          Explore all live harvested microgreens, non-GMO vertical farming seeds, dehydrated plant milk powders, organic spice blends, and cultivation substrates.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Search Field */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="catalog-full-search"
              type="text" 
              placeholder="Search by name, superfood benefit, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-2xl border border-neutral-200 text-xs font-bold">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-neutral-700 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Currency Selector */}
            {setActiveCurrency && (
              <div className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-2xl border border-neutral-200 text-xs font-bold">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <select 
                  id="currency-switch-catalog"
                  value={activeCurrency} 
                  onChange={(e) => setActiveCurrency(e.target.value)}
                  className="bg-transparent text-emerald-700 border-none outline-none font-black cursor-pointer text-xs"
                >
                  {Object.keys(CURRENCIES).map((c) => (
                    <option key={c} value={c} className="text-black font-semibold">{c}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
          {categories.map(cat => (
            <button
              key={cat}
              id={`cat-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full cursor-pointer transition-all font-bold ${
                selectedCategory === cat 
                  ? 'bg-emerald-700 text-white shadow-xs font-black' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 border border-neutral-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Live Count */}
      <div className="flex justify-between items-center text-xs text-neutral-500 px-1">
        <span>Showing <strong className="text-neutral-900 font-bold">{filteredProducts.length}</strong> items in catalogue</span>
        {selectedCategory !== 'All' && (
          <button 
            onClick={() => setSelectedCategory('All')} 
            className="text-emerald-700 font-bold hover:underline"
          >
            Reset Category Filter
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            activeTheme={activeTheme}
            formatPrice={formatPrice}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
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

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-neutral-200">
          <p className="text-neutral-600 font-bold text-sm">No products found matching your active filter.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-800 transition-all cursor-pointer shadow-xs"
          >
            Clear Filters & Show All
          </button>
        </div>
      )}
    </section>
  );
};
