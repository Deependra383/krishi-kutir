import React from 'react';
import { Search, Package, Edit3, Trash2, Plus, Tag } from 'lucide-react';

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
  onDeleteProduct,
  onOpenAdd,
  isDarkMode = false
}) => {
  return (
    <div className="space-y-6">
      
      {/* Search & Category Filter Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
        isDarkMode 
          ? 'bg-neutral-950 border-neutral-800' 
          : 'bg-white border-neutral-200 shadow-sm'
      }`}>
        <div className="relative flex-1 w-full">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isDarkMode ? 'text-neutral-400' : 'text-neutral-400'
          }`} />
          <input
            type="text"
            placeholder="Search all catalog and manual products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all ${
              isDarkMode 
                ? 'bg-neutral-900 text-white border-neutral-800 placeholder-neutral-500' 
                : 'bg-neutral-50 text-neutral-900 border-neutral-200 placeholder-neutral-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3.5 py-2.5 border rounded-xl text-xs font-bold outline-none cursor-pointer transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900 text-white border-neutral-800' 
                  : 'bg-neutral-50 text-neutral-900 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {onOpenAdd && (
            <button
              onClick={onOpenAdd}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm hover:shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Counter & Info Bar */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}>
          Showing <strong className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}>{filteredProducts.length}</strong> of <strong className={isDarkMode ? 'text-white' : 'text-neutral-900'}>{products.length}</strong> total products
        </span>
        {selectedCategory !== 'All' && (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            isDarkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
          }`}>
            Filtered by: {selectedCategory}
          </span>
        )}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map(product => (
          <div 
            key={product.id}
            id={`admin-product-${product.id}`}
            className={`rounded-2xl border overflow-hidden shadow-xs transition-all flex flex-col justify-between group ${
              isDarkMode 
                ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700' 
                : 'bg-white border-neutral-200 hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div>
              {/* Image Preview */}
              <div className={`h-44 relative overflow-hidden ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black shadow-md font-mono">
                  {formatPrice ? formatPrice(product.price) : `₹${product.price}`}
                </span>
                {product.category && (
                  <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                    isDarkMode 
                      ? 'bg-black/70 text-emerald-300 backdrop-blur-xs border border-emerald-900/50' 
                      : 'bg-white/90 text-emerald-800 backdrop-blur-xs border border-emerald-200'
                  }`}>
                    <Tag className="w-2.5 h-2.5" />
                    {product.category}
                  </span>
                )}
              </div>

              {/* Information */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-1">
                  <h3 className={`text-sm font-black uppercase line-clamp-1 ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>{product.name}</h3>
                </div>
                <p className={`text-xs line-clamp-2 min-h-[2.75rem] font-light leading-relaxed ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>{product.benefit}</p>
                
                <div className={`flex items-center justify-between text-[11px] pt-2 border-t font-mono ${
                  isDarkMode 
                    ? 'text-neutral-400 border-neutral-900' 
                    : 'text-neutral-500 border-neutral-100'
                }`}>
                  <span>Unit: <strong className={isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}>{product.unit || '100 GM'}</strong></span>
                  <span>MOQ: <strong className={isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}>{product.moq || '1 Pack'}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`p-3 border-t flex items-center justify-between gap-2 ${
              isDarkMode 
                ? 'bg-neutral-900/60 border-neutral-800' 
                : 'bg-neutral-50 border-neutral-100'
            }`}>
              <button
                onClick={() => onOpenEdit(product)}
                className={`admin-product-edit-btn flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white' 
                    : 'bg-neutral-200/80 hover:bg-neutral-300 text-neutral-800'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={() => onDeleteProduct(product)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40' 
                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                }`}
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className={`py-20 text-center rounded-2xl border space-y-3 ${
          isDarkMode 
            ? 'bg-neutral-950 border-neutral-800' 
            : 'bg-white border-neutral-200 shadow-sm'
        }`}>
          <Package className={`w-12 h-12 mx-auto ${isDarkMode ? 'text-neutral-700' : 'text-neutral-300'}`} />
          <h4 className={`text-sm font-bold uppercase ${isDarkMode ? 'text-neutral-400' : 'text-neutral-700'}`}>No products found</h4>
          <p className={`text-xs ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Try adjusting your search keyword or selected category filter.</p>
        </div>
      )}
    </div>
  );
};
