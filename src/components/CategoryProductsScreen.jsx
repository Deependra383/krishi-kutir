import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ArrowUpDown, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Leaf, 
  PackageOpen, 
  Layers
} from 'lucide-react';
import { CATEGORIES_CONFIG, getCategoryById } from '../data/categoriesConfig';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from './common/ProductCard';

export const CategoryProductsScreen = ({
  selectedCategoryId,
  onSelectCategory,
  onBackToHome,
  formatPrice,
  setSelectedMicroscopeItem,
  hoverCoords = {},
  hoverState = {},
  handleCardMouseMove,
  handleCardMouseEnter,
  handleCardMouseLeave,
  onOpenAdmin,
  activeTheme
}) => {
  const { products } = useProducts();
  const { addToCart, setIsCheckoutOpen } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [addedItemEffect, setAddedItemEffect] = useState({});

  const currentCategory = useMemo(() => {
    return getCategoryById(selectedCategoryId);
  }, [selectedCategoryId]);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchTerm('');
  }, [selectedCategoryId]);

  // Filter products strictly for the selected category
  const categoryProducts = useMemo(() => {
    if (!products || !currentCategory) return [];

    let filtered = products.filter(p => currentCategory.filterProduct(p));

    // Fallback: if category specific filter returns empty, match by category name substring
    if (filtered.length === 0) {
      filtered = products.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const title = currentCategory.title.toLowerCase();
        return pCat.includes(title) || pName.includes(title);
      });
    }

    // Apply search within category
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name || '').toLowerCase().includes(q) || 
        (p.benefit || '').toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return filtered;
  }, [products, currentCategory, searchTerm, sortBy]);

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
    <div className="min-h-screen bg-[#fafcf9] pb-24 font-sans select-none">
      
      {/* Top Breadcrumb & Back Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-700 hover:text-emerald-800 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-emerald-100 text-neutral-700 group-hover:text-emerald-800 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span>Back to Home</span>
          </button>

          {/* Breadcrumb Path */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <span className="hover:text-neutral-700 cursor-pointer" onClick={onBackToHome}>Krishi Kutir</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-500">Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-800 font-bold">{currentCategory.title}</span>
          </div>

          {/* Item counter */}
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {categoryProducts.length} Items Found
          </span>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        
        {/* ================= CATEGORY HERO BANNER ================= */}
        <div 
          className={`relative overflow-hidden bg-white border ${currentCategory.borderColor} rounded-3xl p-6 sm:p-10 shadow-lg`}
        >
          {/* Large Serif Watermark Letter */}
          <span 
            className={`absolute -top-4 left-6 sm:left-10 text-[160px] sm:text-[220px] font-serif font-black leading-none select-none pointer-events-none ${currentCategory.watermarkColor} opacity-70`}
          >
            {currentCategory.letter}
          </span>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
            
            {/* Centerpiece Cutout Image */}
            <div className="w-36 h-36 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center p-2 bg-neutral-50/60 rounded-2xl border border-neutral-100 shadow-2xs">
              <img
                src={currentCategory.image}
                alt={currentCategory.title}
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
            </div>

            {/* Category Info */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentCategory.tag}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-neutral-900 tracking-tight leading-tight">
                {currentCategory.title}
              </h1>

              <p className="text-neutral-600 text-sm sm:text-base font-normal max-w-2xl leading-relaxed">
                {currentCategory.shortDesc}
              </p>

              {/* Key Benefits Pills */}
              <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                {currentCategory.benefits.slice(0, 2).map((b, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-700 shadow-2xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ================= CATEGORY QUICK JUMP SWITCHER ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold px-1">
            <span>Switch Category:</span>
            <span className="text-neutral-400 font-normal">Click any category to change view</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
            {CATEGORIES_CONFIG.map((cat) => {
              const isCurrent = cat.id === currentCategory.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isCurrent 
                      ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600/30 scale-[1.02]' 
                      : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/90 shadow-2xs'
                  }`}
                >
                  <span className="font-serif font-black text-sm">{cat.letter}</span>
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= SEARCH & SORT TOOLBAR ================= */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search inside this category */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={`Search within ${currentCategory.title}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-sans"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 w-full sm:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-xs font-bold w-full sm:w-auto"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

        </div>

        {/* ================= DEDICATED PRODUCTS GRID ================= */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {categoryProducts.map((product) => (
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
        ) : (
          /* Empty State */
          <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-neutral-200/90 shadow-xs">
            <PackageOpen className="w-12 h-12 text-neutral-400 mx-auto" />
            <div className="space-y-1 max-w-md mx-auto">
              <p className="text-neutral-800 font-bold text-base">No produce items found</p>
              <p className="text-neutral-500 text-xs">
                {searchTerm 
                  ? `No products in ${currentCategory.title} match "${searchTerm}".`
                  : `Currently updating freshly harvested stock for ${currentCategory.title}.`}
              </p>
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-900 transition-all cursor-pointer shadow-xs"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryProductsScreen;
