import React from 'react';
import { 
  ArrowLeft, 
  Store, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Package, 
  Sparkles, 
  CheckCircle2, 
  Leaf, 
  Clock, 
  CreditCard,
  MessageSquare,
  Moon,
  Sun
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { AnimatedLogo } from './AnimatedLogo';

export const FullPageCart = ({
  onBackToStore,
  formatPrice,
  onProceedToCheckout,
  onOpenAuth,
  onOpenOrders
}) => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalItemsCount, 
    subtotal, 
    deliveryFee, 
    grandTotal 
  } = useCart();

  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your shopping bag?')) {
      clearCart();
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-neutral-950 text-neutral-100' 
        : 'bg-[#f8fcf9] text-neutral-850'
    }`}>
      
      {/* 1. Full-Page Top Header */}
      <header className={`sticky top-0 z-40 transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-neutral-900 border-b border-neutral-800 shadow-xl' 
          : 'bg-white/95 border-b border-neutral-200/90 shadow-xs backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Left: Back to Storefront & Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                id="cart-back-to-store-btn"
                onClick={onBackToStore}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                  isDarkMode 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border-neutral-700' 
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 border-neutral-200'
                }`}
                title="Return to store"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Storefront</span>
              </button>

              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-xl border flex items-center justify-center shrink-0 shadow-xs ${
                  isDarkMode 
                    ? 'bg-neutral-800 border-neutral-700' 
                    : 'bg-emerald-50 border-emerald-100'
                }`}>
                  <AnimatedLogo size={28} showText={false} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className={`text-sm font-black uppercase tracking-tight flex items-center gap-1.5 ${
                      isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}>
                      Krishi Kutir
                    </h1>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 border ${
                      isDarkMode 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      <ShoppingBag className="w-2.5 h-2.5" /> Customer Bag
                    </span>
                  </div>
                  <p className={`text-[10px] font-mono hidden sm:block ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    Farm-Fresh Harvest & Living Microgreens
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Items Counter Pill */}
              <div className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 font-mono ${
                isDarkMode 
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-300' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700'
              }`}>
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  <strong className={isDarkMode ? 'text-white' : 'text-neutral-900'}>{totalItemsCount}</strong> {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Night / Dark Mode Toggle Button */}
              <button
                id="cart-theme-toggle-btn"
                type="button"
                onClick={toggleDarkMode}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-400 border-neutral-700'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 border-neutral-200'
                }`}
                title={isDarkMode ? 'Switch to Day / Light Mode' : 'Switch to Night / Dark Mode'}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline text-amber-300">Day</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">Night</span>
                  </>
                )}
              </button>

              {/* Quick Link to My Orders */}
              {onOpenOrders && (
                <button
                  onClick={onOpenOrders}
                  className={`hidden md:flex px-3 py-2 rounded-xl border text-xs font-bold uppercase items-center gap-1.5 transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border-neutral-700' 
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 border-neutral-200'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  <span>My Orders</span>
                </button>
              )}

              {/* Continue Shopping Button */}
              <button
                onClick={onBackToStore}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Continue Shopping</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. Banner Notification */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-2.5 text-xs transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-200' 
          : 'bg-emerald-50/90 border-emerald-100 text-emerald-900'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Truck className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`} />
            <span>🎉 <strong>Free Pan-India Cold-Chain Delivery</strong> enabled on all living trays & dehydrated superfoods!</span>
          </div>
          <div className={`hidden md:flex items-center gap-3 text-[11px] ${
            isDarkMode ? 'text-emerald-300/80' : 'text-emerald-800/90'
          }`}>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> 100% Residue-Free
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> FSSAI Certified
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Bag Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {cartItems.length === 0 ? (
          /* Empty Bag State */
          <div className={`max-w-2xl mx-auto py-16 px-6 text-center space-y-6 rounded-3xl p-8 sm:p-12 border transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-neutral-900/60 border-neutral-800 shadow-2xl' 
              : 'bg-white border-neutral-200/90 shadow-sm'
          }`}>
            <div className={`w-24 h-24 rounded-3xl border mx-auto flex items-center justify-center shadow-inner ${
              isDarkMode 
                ? 'bg-neutral-800 border-neutral-700 text-neutral-500' 
                : 'bg-emerald-50 border-emerald-100 text-emerald-600'
            }`}>
              <ShoppingBag className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className={`text-2xl font-black uppercase tracking-wide ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                Your Shopping Bag is Empty
              </h2>
              <p className={`text-sm max-w-md mx-auto leading-relaxed ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                You haven't added any living microgreens trays, fresh seeds, or herbal superfood powders to your harvest bag yet.
              </p>
            </div>

            {/* Quick Categories Navigation */}
            <div className="pt-2 flex flex-wrap justify-center gap-2.5">
              <button
                onClick={() => {
                  onBackToStore();
                  setTimeout(() => {
                    document.getElementById('microgreens-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border-neutral-700' 
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 border-neutral-200'
                }`}
              >
                🌱 Live Microgreens
              </button>
              <button
                onClick={() => {
                  onBackToStore();
                  setTimeout(() => {
                    document.getElementById('powders-spices-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border-neutral-700' 
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 border-neutral-200'
                }`}
              >
                ✨ Herbal Powders & Spices
              </button>
              <button
                onClick={() => {
                  onBackToStore();
                  setTimeout(() => {
                    document.getElementById('full-catalogue-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border-neutral-700' 
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 border-neutral-200'
                }`}
              >
                📦 Full Catalog
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={onBackToStore}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-700/20 inline-flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Return to Storefront</span>
              </button>
            </div>
          </div>
        ) : (
          /* Populated Full-Page Bag Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (8 cols): Items Table & Quality Assurance */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Items Card Header */}
              <div className={`border rounded-2xl p-4 sm:p-5 flex items-center justify-between transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-white' 
                  : 'bg-white border-neutral-200/90 shadow-xs text-neutral-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base font-black uppercase tracking-wide ${
                      isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}>
                      Selected Items ({totalItemsCount})
                    </h2>
                    <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Review your fresh harvest selections before checkout
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClearCart}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 border-neutral-700' 
                      : 'bg-neutral-50 hover:bg-red-50 text-neutral-600 hover:text-red-600 border-neutral-200'
                  }`}
                  title="Remove all items"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear Bag</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-2xl p-4 sm:p-5 transition-all shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${
                      isDarkMode 
                        ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-white' 
                        : 'bg-white border-neutral-200/90 hover:border-emerald-200 text-neutral-900'
                    }`}
                  >
                    {/* Item Image & Details */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80'}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border ${
                          isDarkMode 
                            ? 'bg-neutral-800 border-neutral-700' 
                            : 'bg-neutral-100 border-neutral-200'
                        }`}
                      />

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                            isDarkMode 
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800/60' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {item.category || 'Organic Harvest'}
                          </span>
                          <span className={`text-[10px] font-mono ${
                            isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                          }`}>
                            {item.unit || item.moq || 'Unit'}
                          </span>
                        </div>

                        <h3 className={`text-sm sm:text-base font-black uppercase truncate ${
                          isDarkMode ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {item.name}
                        </h3>

                        {item.benefit && (
                          <p className={`text-xs line-clamp-1 ${
                            isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                          }`}>
                            🌱 {item.benefit}
                          </p>
                        )}

                        <div className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Unit Price: <span className={`font-bold ${isDarkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper, Item Total & Delete Action */}
                    <div className={`flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 ${
                      isDarkMode ? 'border-neutral-800' : 'border-neutral-100'
                    }`}>
                      
                      {/* Quantity Stepper */}
                      <div className={`flex items-center border rounded-xl overflow-hidden shadow-xs ${
                        isDarkMode 
                          ? 'bg-neutral-800 border-neutral-700' 
                          : 'bg-neutral-50 border-neutral-200'
                      }`}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`p-2 transition-colors cursor-pointer ${
                            isDarkMode 
                              ? 'hover:bg-neutral-700 text-neutral-300 hover:text-white' 
                              : 'hover:bg-neutral-200/60 text-neutral-600 hover:text-neutral-900'
                          }`}
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className={`px-3 text-xs font-black min-w-[28px] text-center font-mono ${
                          isDarkMode ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`p-2 transition-colors cursor-pointer ${
                            isDarkMode 
                              ? 'hover:bg-neutral-700 text-neutral-300 hover:text-white' 
                              : 'hover:bg-neutral-200/60 text-neutral-600 hover:text-neutral-900'
                          }`}
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[90px]">
                        <span className={`text-base sm:text-lg font-black font-mono ${
                          isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                        }`}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <div className={`text-[10px] font-mono uppercase ${
                          isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>
                          {item.quantity} × {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 border-neutral-700' 
                            : 'bg-neutral-50 hover:bg-red-50 text-neutral-400 hover:text-red-600 border-neutral-200'
                        }`}
                        title="Remove from bag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Action Bar Below Items */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  onClick={onBackToStore}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800' 
                      : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/90 shadow-xs'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping / Add More Items</span>
                </button>

                <p className={`text-xs flex items-center gap-1.5 font-mono ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  <Clock className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span>Harvested fresh upon order confirmation</span>
                </p>
              </div>

              {/* Quality & Bio-Security Assurances Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className={`p-4 rounded-2xl border space-y-1.5 transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-neutral-900/80 border-neutral-800 text-neutral-100' 
                    : 'bg-white border-neutral-200/90 shadow-xs text-neutral-850'
                }`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className={`text-xs font-black uppercase ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Cold-Chain Packed
                  </h4>
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Moisture-regulated organic food-grade trays maintain crispness nationwide.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1.5 transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-neutral-900/80 border-neutral-800 text-neutral-100' 
                    : 'bg-white border-neutral-200/90 shadow-xs text-neutral-850'
                }`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    <Leaf className="w-4 h-4" />
                  </div>
                  <h4 className={`text-xs font-black uppercase ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Residue-Free Clean
                  </h4>
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Grown with RO water & zero synthetic pesticides or chemical fertilizers.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1.5 transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-neutral-900/80 border-neutral-800 text-neutral-100' 
                    : 'bg-white border-neutral-200/90 shadow-xs text-neutral-850'
                }`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className={`text-xs font-black uppercase ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    FSSAI Certified Lab
                  </h4>
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Lab-tested for nutritional potency under license #21424850009184.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column (4 cols): Sticky Order Summary & Checkout CTA */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              {/* Order Summary Box */}
              <div className={`border rounded-3xl p-6 shadow-md space-y-6 transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 shadow-2xl text-white' 
                  : 'bg-white border-neutral-200/90 text-neutral-900'
              }`}>
                <div className={`flex items-center justify-between border-b pb-4 ${
                  isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
                }`}>
                  <h3 className={`text-base font-black uppercase tracking-wide flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>
                    <ShoppingBag className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span>Order Summary</span>
                  </h3>
                  <span className={`text-xs font-mono ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className={`flex justify-between ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    <span>Items Subtotal</span>
                    <span className={`font-bold font-mono ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className={`flex justify-between ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    <span>Pan-India Express Shipping</span>
                    <span className={`font-black uppercase tracking-wider font-mono ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                    }`}>
                      {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <div className={`flex justify-between ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    <span>Sanitized Cold-Chain Pack</span>
                    <span className={`font-black uppercase tracking-wider font-mono ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                    }`}>
                      INCLUDED (₹0)
                    </span>
                  </div>

                  <div className={`pt-3 border-t flex justify-between items-baseline ${
                    isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
                  }`}>
                    <div>
                      <span className={`text-sm font-black uppercase tracking-wider block ${
                        isDarkMode ? 'text-white' : 'text-neutral-900'
                      }`}>
                        Total Payable
                      </span>
                      <span className={`text-[10px] font-mono ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        Inclusive of all farm taxes
                      </span>
                    </div>
                    <span className={`text-2xl font-black font-mono ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                    }`}>
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Primary Checkout CTA */}
                <div className="space-y-3">
                  <button
                    id="fullpage-checkout-btn"
                    onClick={onProceedToCheckout}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Payment Methods Info */}
                  <div className={`p-3.5 rounded-xl border space-y-2 ${
                    isDarkMode 
                      ? 'bg-neutral-800/90 border-neutral-700 text-neutral-300' 
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                  }`}>
                    <div className={`flex items-center gap-2 text-[11px] font-bold ${
                      isDarkMode ? 'text-neutral-300' : 'text-neutral-800'
                    }`}>
                      <CreditCard className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span>Multiple Payment Options Available</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                      <span className={`px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'bg-neutral-700 text-neutral-200 border-neutral-600' 
                          : 'bg-white text-neutral-800 border-neutral-200'
                      }`}>
                        Razorpay
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'bg-neutral-700 text-neutral-200 border-neutral-600' 
                          : 'bg-white text-neutral-800 border-neutral-200'
                      }`}>
                        UPI / QR
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'bg-neutral-700 text-neutral-200 border-neutral-600' 
                          : 'bg-white text-neutral-800 border-neutral-200'
                      }`}>
                        Cards
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'bg-neutral-700 text-neutral-200 border-neutral-600' 
                          : 'bg-white text-neutral-800 border-neutral-200'
                      }`}>
                        NetBanking
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'bg-neutral-700 text-neutral-200 border-neutral-600' 
                          : 'bg-white text-neutral-800 border-neutral-200'
                      }`}>
                        COD
                      </span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className={`flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider pt-1 ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    <ShieldCheck className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span>256-Bit SSL Encrypted & Verified Checkout</span>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp Farm Help Desk */}
              <div className={`border rounded-2xl p-4 text-xs space-y-2 transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-neutral-900/80 border-neutral-800 text-neutral-300' 
                  : 'bg-emerald-50/50 border-emerald-100 text-neutral-700'
              }`}>
                <div className={`flex items-center gap-2 font-bold ${
                  isDarkMode ? 'text-neutral-200' : 'text-neutral-900'
                }`}>
                  <MessageSquare className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span>Need Assistance or Custom Trays?</span>
                </div>
                <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Have questions about harvest schedules or bulk commercial pricing? Chat directly with our head cultivator:
                </p>
                <a
                  href="https://wa.me/919009166101?text=Hi%20Krishi%20Kutir,%20I%20have%20an%20inquiry%20regarding%20my%20bag%20items."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 font-bold text-xs transition-colors ${
                    isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                >
                  <span>💬 WhatsApp: +91 90091 66101</span>
                </a>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer copyright */}
      <footer className={`border-t py-6 px-4 text-center text-xs transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-neutral-900 border-neutral-800 text-neutral-400' 
          : 'bg-white border-neutral-200 text-neutral-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Krishi Kutir Microgreens & Superfoods. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onBackToStore} className={`transition-colors cursor-pointer ${
              isDarkMode ? 'hover:text-white' : 'hover:text-neutral-950'
            }`}>
              Storefront
            </button>
            <span>•</span>
            {onOpenOrders && (
              <button onClick={onOpenOrders} className={`transition-colors cursor-pointer ${
                isDarkMode ? 'hover:text-white' : 'hover:text-neutral-950'
              }`}>
                My Orders
              </button>
            )}
            <span>•</span>
            <span>FSSAI Lic. #21424850009184</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
