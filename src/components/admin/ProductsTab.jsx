import React from 'react';
import { Search, Package, Edit3, Trash2 } from 'lucide-react';

export const ProductsTab = ({
  products = [],
  filteredProducts = [],
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  formatPrice,
  onOpenEdit,
  onDeleteProduct
}) => {
  return (
    <div className="space-y-6">
      
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-800 outline-none focus:ring-2 focus:ring-emerald-500 placeholder-neutral-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-neutral-900 text-white border border-neutral-800 rounded-xl text-xs font-bold outline-none cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map(product => (
          <div 
            key={product.id}
            id={`admin-product-${product.id}`}
            className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-xs hover:border-neutral-700 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image Preview & Badge */}
              <div className="h-44 bg-neutral-900 relative overflow-hidden">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-neutral-900/85 text-white dark:text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-xs border border-white/10 shadow-xs admin-product-category-tag">
                  {product.category}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black shadow-md font-mono">
                  {formatPrice ? formatPrice(product.price) : `₹${product.price}`}
                </span>
              </div>

              {/* Information */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="text-sm font-black uppercase text-white line-clamp-1">{product.name}</h3>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2 h-8 font-light">{product.benefit}</p>
                
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-900 font-mono">
                  <span>Unit: <strong className="text-neutral-300">{product.unit || '100 GM'}</strong></span>
                  <span>MOQ: <strong className="text-neutral-300">{product.moq || '1 Pack'}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenEdit(product)}
                className="admin-product-edit-btn flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={() => onDeleteProduct(product)}
                className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition-all cursor-pointer"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
          <Package className="w-12 h-12 text-neutral-700 mx-auto" />
          <h4 className="text-sm font-bold uppercase text-neutral-400">No products found</h4>
          <p className="text-xs text-neutral-500">Try adjusting your search keyword or selected category filter.</p>
        </div>
      )}
    </div>
  );
};
