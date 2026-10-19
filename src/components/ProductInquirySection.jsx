import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  MessageCircle, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Droplet, 
  Zap, 
  Plus, 
  Minus,
  Send,
  HelpCircle,
  ExternalLink,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, useScroll } from 'motion/react';
import { supabase } from '../supabase';
import { BotanicalSectionBackdrop } from './common/BotanicalSectionBackdrop';
import { useProducts } from '../context/ProductContext';

const WHATSAPP_NUMBER = '9009911030';

// How many products are offered from each category (Infinity = every product)
const PRODUCTS_PER_CATEGORY = Infinity;

// In the "All" tab, how many cards to show at first, and how many more each "Show more" adds
const PAGE_SIZE = 6;

// true  = the search bar looks through the whole catalog
// false = the search bar only looks through the products offered above
const SEARCH_WHOLE_CATALOG = true;

export const ProductInquirySection = ({ activeTheme }) => {
  const { products = [] } = useProducts();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [trayMultiplier, setTrayMultiplier] = useState(1);
  const [customProduct, setCustomProduct] = useState('');
  const [isSpecialOrderActive, setIsSpecialOrderActive] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (products.length > 0 && (!selectedProduct || !products.some(p => p.id === selectedProduct.id))) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  // Only the first few products of every category are offered in this section
  const offeredProducts = useMemo(() => {
    const perCategory = {};
    return products.filter(item => {
      const key = (item.category || 'Other').toLowerCase();
      perCategory[key] = (perCategory[key] || 0) + 1;
      return perCategory[key] <= PRODUCTS_PER_CATEGORY;
    });
  }, [products]);

  const filterTabs = useMemo(() => {
    const tabs = [{ id: 'all', label: 'All Items', count: offeredProducts.length }];
    const counts = {};
    const order = [];
    offeredProducts.forEach(p => {
      if (!p.category) return;
      const id = p.category.toLowerCase();
      if (!(id in counts)) { counts[id] = 0; order.push({ id, label: p.category }); }
      counts[id] += 1;
    });
    order.forEach(cat => tabs.push({ ...cat, count: counts[cat.id] }));
    return tabs;
  }, [offeredProducts]);

  // Horizontal category strip
  const tabsScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateTabScrollButtons = () => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateTabScrollButtons();
    window.addEventListener('resize', updateTabScrollButtons);
    return () => window.removeEventListener('resize', updateTabScrollButtons);
  }, [filterTabs]);

  const scrollTabs = (direction) => {
    const el = tabsScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(200, el.clientWidth * 0.7), behavior: 'smooth' });
  };

  const handleSelectTab = (tabId, buttonEl) => {
    setActiveFilter(tabId);
    buttonEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  // Filter products by category tab, then by search text
  const displayedProducts = useMemo(() => {
    const words = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const source = (words.length > 0 && SEARCH_WHOLE_CATALOG) ? products : offeredProducts;

    const byCategory = activeFilter === 'all'
      ? source
      : source.filter(item => (item.category || '').toLowerCase() === activeFilter);

    if (words.length === 0) return byCategory;

    return byCategory.filter(item => {
      const haystack = [item.name, item.category, item.subCategory, item.majorCategory, item.unit, item.benefit]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return words.every(word => haystack.includes(word));
    });
  }, [products, activeFilter, searchTerm]);

  // Start again from the first page whenever the tab or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeFilter, searchTerm]);

  // A category tab shows all of its products; the "All" tab and search results page through them
  const showEverything = activeFilter !== 'all' && !searchTerm.trim();
  const visibleProducts = showEverything ? displayedProducts : displayedProducts.slice(0, visibleCount);
  const hasMore = !showEverything && displayedProducts.length > visibleCount;
  const canShowLess = !showEverything && visibleCount > PAGE_SIZE && displayedProducts.length > PAGE_SIZE;

  const handleShowMore = () => setVisibleCount(prev => prev + PAGE_SIZE);
  const handleShowLess = () => {
    setVisibleCount(PAGE_SIZE);
    document.getElementById('farm-products-search')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleUseSearchAsSpecialOrder = () => {
    setCustomProduct(searchTerm.trim());
    setIsSpecialOrderActive(Boolean(searchTerm.trim()));
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setIsSpecialOrderActive(false);
  };

  const handleSpecialOrderClick = () => {
    if (customProduct.trim()) {
      setIsSpecialOrderActive(true);
    }
  };

  // Generate WhatsApp Message Link
  const handleWhatsAppSend = (e) => {
    e?.preventDefault();
    const productName = isSpecialOrderActive && customProduct.trim() 
      ? `Special Order: ${customProduct.trim()}` 
      : (selectedProduct?.name
        ? `${selectedProduct.name}${selectedProduct.unit ? ` (${selectedProduct.unit})` : ''}`
        : (customProduct.trim() || 'Fresh Farm Produce'));

    const msg = 
      `*KRISHI KUTIR - FARM-TO-FORK ORDER INQUIRY*\n` +
      `----------------------------------------\n` +
      `• *Selected Item:* ${productName}\n` +
      `• *Tray Multiplier / Qty:* ${trayMultiplier}\n` +
      `• *Customer Name:* ${fullName.trim() || 'Valued Customer'}\n` +
      `• *Phone / WhatsApp:* ${phone.trim() || 'Provided on chat'}\n` +
      `• *City / Location:* ${city.trim() || 'Bhopal / Delivery Hub'}\n` +
      (notes.trim() ? `• *Schedule / Requirements:* ${notes.trim()}\n` : '') +
      `----------------------------------------\n` +
      `_Sent directly from Krishi Kutir Living Store Desk._`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/91${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  // Submit Online to Database
  const handleSubmitOnline = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    const productName = isSpecialOrderActive && customProduct.trim() 
      ? `Special Order: ${customProduct.trim()}` 
      : (selectedProduct?.name
        ? `${selectedProduct.name}${selectedProduct.unit ? ` (${selectedProduct.unit})` : ''}`
        : (customProduct.trim() || 'Fresh Farm Produce'));

    const inquiryRecord = {
      product_name: productName,
      quantity: trayMultiplier,
      customer_name: fullName.trim() || 'Anonymous Guest',
      phone: phone.trim() || 'Not Provided',
      city: city.trim() || 'Bhopal',
      notes: notes.trim() || 'Living store product configuration',
      created_at: new Date().toISOString()
    };

    try {
      if (supabase) {
        await supabase.from('inquiries').insert([inquiryRecord]);
      } else {
        const local = JSON.parse(localStorage.getItem('kk_product_inquiries') || '[]');
        local.unshift({ id: `inq-${Date.now()}`, ...inquiryRecord });
        localStorage.setItem('kk_product_inquiries', JSON.stringify(local.slice(0, 50)));
      }
    } catch (err) {
      console.warn('Inquiry submission notice:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="relative font-sans select-none">
      <section 
        id="product-inquiry-section" 
        ref={sectionRef}
        className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#fafcf9]/85 text-neutral-900 relative overflow-hidden"
      >
        {/* Colorful Parallax Floating Botanicals & Fruit Accents in Background */}
        <BotanicalSectionBackdrop variant="inquiry" scrollYProgress={scrollYProgress} />

        <div className="max-w-5xl mx-auto relative z-10 space-y-8">
          
          {/* ================= 2. SECTION HEADER & HARVEST WINDOW BADGE ================= */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            
            {/* Left Header Stack */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300/80 text-[11px] font-black uppercase tracking-wider">
                <span>🌱</span>
                <span>DAILY MORNING HARVEST • CHEMICAL & PESTICIDE FREE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-neutral-900 leading-tight">
                Farm-To-Fork Living Store
              </h2>

              <p className="text-neutral-500 text-sm sm:text-[15px] font-normal leading-relaxed">
                Configure freshly trimmed microgreens, living trays, and sun-dried botanical powders directly from our hydroponic chambers.
              </p>
            </div>

            {/* Right: Harvest Window Badge Box */}
            <div className="shrink-0 hidden md:flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Harvest Window
                </span>
                <span className="text-xs sm:text-[13px] font-black text-neutral-900">
                  Clipped Fresh: 6:00 AM Today
                </span>
              </div>
            </div>

          </div>

          {/* ================= 3. MAIN PRODUCT SELECTION & ORDER CARD ================= */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl p-6 sm:p-8 md:p-10 space-y-8 relative overflow-hidden">
            
            {isSubmitted ? (
              <div className="py-12 px-6 text-center space-y-5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
                    Order Inquiry Dispatched!
                  </h3>
                  <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed">
                    Our farm coordinator has received your harvest preference for <strong>{selectedProduct?.name}</strong>. We will confirm delivery slots directly via WhatsApp or phone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#143526] transition-all cursor-pointer shadow-sm"
                >
                  Configure Another Harvest
                </button>
              </div>
            ) : (
              <>
                {/* Card Sub-Header: Select Farm Products */}
                <div className="space-y-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/70">
                      <ShoppingBag className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-900">
                        SELECT FARM PRODUCTS
                      </h3>
                      <p className="text-xs text-neutral-400 font-normal">
                        Pick single harvest boxes or recurring fresh trays
                      </p>
                    </div>
                  </div>

                  {/* Category Tabs: one straight line, scroll left / right */}
                  {filterTabs.length > 1 && (
                    <div className="relative">
                      {canScrollLeft && (
                        <>
                          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10" />
                          <button
                            type="button"
                            onClick={() => scrollTabs(-1)}
                            aria-label="Scroll categories left"
                            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm items-center justify-center text-neutral-700 hover:text-emerald-800 hover:border-emerald-300 transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <div
                        ref={tabsScrollRef}
                        onScroll={updateTabScrollButtons}
                        className="flex flex-nowrap items-center gap-2 overflow-x-auto scroll-smooth snap-x py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {filterTabs.map((tab) => {
                          const isActive = activeFilter === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={(e) => handleSelectTab(tab.id, e.currentTarget)}
                              className={`shrink-0 snap-start whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                                isActive 
                                  ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-2xs' 
                                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:text-neutral-900 hover:border-emerald-300 hover:bg-white'
                              }`}
                            >
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {canScrollRight && (
                        <>
                          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-10" />
                          <button
                            type="button"
                            onClick={() => scrollTabs(1)}
                            aria-label="Scroll categories right"
                            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm items-center justify-center text-neutral-700 hover:text-emerald-800 hover:border-emerald-300 transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                {products.length > 0 && (
                  <div className="space-y-2">
                    <div
                      id="farm-products-search"
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50/60 focus-within:border-emerald-600 focus-within:bg-white transition-all"
                    >
                      <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                      <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products, e.g. turmeric, chia seeds, pizza seasoning..."
                        aria-label="Search farm products"
                        className="w-full bg-transparent text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70 transition-colors cursor-pointer shrink-0"
                          aria-label="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium px-1">
                      {displayedProducts.length === 0
                        ? 'No matching products'
                        : `Showing ${visibleProducts.length} of ${displayedProducts.length} product${displayedProducts.length === 1 ? '' : 's'}`}
                      {searchTerm.trim() && displayedProducts.length > 0 && <> for "<span className="text-neutral-600">{searchTerm.trim()}</span>"</>}
                    </p>
                  </div>
                )}

                {/* Products Grid (2 Columns) */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {products.length === 0 ? (
                    <div className="col-span-2 py-10 px-4 text-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 space-y-2">
                      <p className="text-xs font-bold text-neutral-600">No catalog products listed yet.</p>
                      <p className="text-[11px] text-neutral-400">Add products via Admin Panel, or use the custom order option below to inquire directly via WhatsApp.</p>
                    </div>
                  ) : displayedProducts.length === 0 ? (
                    <div className="col-span-2 py-10 px-4 text-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 space-y-3">
                      <p className="text-xs font-bold text-neutral-600">
                        No products found{searchTerm.trim() ? ` for "${searchTerm.trim()}"` : ' in this category'}.
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Try a different word, or send it to us as a special order.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {searchTerm.trim() && (
                          <button
                            type="button"
                            onClick={handleUseSearchAsSpecialOrder}
                            className="px-3.5 py-1.5 rounded-lg bg-[#1b4332] hover:bg-[#143526] text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            Request "{searchTerm.trim()}" as Special Order
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
                          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          Show All Products
                        </button>
                      </div>
                    </div>
                  ) : (
                    visibleProducts.map((prod) => {
                      const isSelected = selectedProduct?.id === prod.id && !isSpecialOrderActive;
                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod)}
                          className={`group relative flex flex-col md:flex-row overflow-hidden rounded-2xl bg-white cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-2 border-emerald-600 shadow-md ring-4 ring-emerald-100'
                              : 'border border-neutral-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-300'
                          }`}
                        >
                          {/* Product image */}
                          <div className="relative h-32 sm:h-36 md:h-auto md:min-h-[132px] md:w-36 lg:w-40 md:shrink-0 bg-neutral-100 flex items-center justify-center overflow-hidden md:border-r md:border-neutral-100">
                            {prod.image ? (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <ShoppingBag className="w-10 h-10 text-neutral-300" />
                            )}

                            {isSelected && (
                              <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                                <Check className="w-3 h-3 stroke-[3]" />
                                Selected
                              </span>
                            )}

                          </div>

                          {/* Details */}
                          <div className="flex flex-col flex-1 min-w-0 px-3 sm:px-4 pt-2.5 pb-3 sm:py-4">
                            <h4 className="text-[13px] sm:text-sm font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
                              {prod.name}
                            </h4>

                            <p className="mt-0.5 text-[10px] sm:text-[11px] text-neutral-500 truncate">
                              {prod.category || 'Farm Harvest'}
                            </p>

                            <div className="flex-1 min-h-3" />

                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleSelectProduct(prod); }}
                              className={`w-full py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Selected</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Select</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Show More / Show Less */}
                {(hasMore || canShowLess) && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {hasMore && (
                      <button
                        type="button"
                        onClick={handleShowMore}
                        className="px-5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Show More ({displayedProducts.length - visibleCount} more)</span>
                      </button>
                    )}
                    {canShowLess && (
                      <button
                        type="button"
                        onClick={handleShowLess}
                        className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Show Less</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Currently selected product (stays visible even if search hides it) */}
                {selectedProduct && !isSpecialOrderActive && !visibleProducts.some(p => p.id === selectedProduct.id) && (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Selected: <strong>{selectedProduct.name}</strong>
                      {selectedProduct.unit ? ` (${selectedProduct.unit})` : ''}
                    </span>
                  </div>
                )}

                {/* Looking For Something Else? / Special Order */}
                <div className="hidden md:block space-y-2 pt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    LOOKING FOR SOMETHING ELSE?
                  </label>
                  <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl border border-neutral-300 bg-neutral-50/60 focus-within:border-emerald-600 focus-within:bg-white transition-all">
                    <input 
                      type="text"
                      value={customProduct}
                      onChange={(e) => setCustomProduct(e.target.value)}
                      placeholder="Or type custom product name, e.g. Organic Chia Microgreens, Custom Powder Blend..."
                      className="w-full bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSpecialOrderClick}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isSpecialOrderActive 
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs' 
                          : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      Special Order
                    </button>
                  </div>
                </div>

                {/* Customer Details Form (Row 1: 3 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      YOUR FULL NAME <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Rachna Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-600 transition-colors"
                      required
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      PHONE / WHATSAPP <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-neutral-300 focus-within:border-emerald-600 transition-colors overflow-hidden">
                      <span className="px-3 py-2.5 bg-neutral-100 text-xs font-bold text-neutral-600 border-r border-neutral-300">
                        +91
                      </span>
                      <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98260 12345"
                        className="w-full px-3.5 py-2.5 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* City / Location */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      CITY / LOCATION <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bhopal, Indore, Delhi NCR"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-600 transition-colors"
                      required
                    />
                  </div>

                </div>

                {/* Row 2: Tray Multiplier & Special Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  
                  {/* Tray Multiplier Counter */}
                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      TOTAL TRAY MULTIPLIER
                    </label>
                    <div className="flex items-center justify-between px-4 py-2 rounded-xl border border-neutral-300 bg-white">
                      <button
                        type="button"
                        onClick={() => setTrayMultiplier(prev => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-black text-neutral-900 font-mono">
                        {trayMultiplier}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTrayMultiplier(prev => prev + 1)}
                        className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Special Notes / Schedule Requirements */}
                  <div className="sm:col-span-8 space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      SPECIAL NOTES / SCHEDULE REQUIREMENTS
                    </label>
                    <input 
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Need weekly supply for restaurant, or living trays for weekend harvest"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>

                </div>

                {/* Action Buttons: WhatsApp & Online Submit */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#064e3b] hover:bg-[#043327] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-300" />
                    <span>SEND VIA WHATSAPP</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitOnline}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1b4332] hover:bg-[#143225] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT ONLINE'}</span>
                  </button>
                </div>
              </>
            )}

          </div>

          {/* ================= 4. THREE INFO PILLARS BELOW CARD ================= */}
          <div className="hidden md:grid grid-cols-3 gap-4 pt-2">
            
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-200/60">
                <Droplet className="w-4 h-4 text-sky-600" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-neutral-900 uppercase">
                  Hydroponic Clean
                </h4>
                <p className="text-[11px] text-neutral-500 font-normal leading-relaxed">
                  95% less water, 100% soil-free pure growth
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-neutral-900 uppercase">
                  Live Trays Available
                </h4>
                <p className="text-[11px] text-neutral-500 font-normal leading-relaxed">
                  Living greens you harvest right on kitchen counter
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-neutral-900 uppercase">
                  Heirloom Grade Seeds
                </h4>
                <p className="text-[11px] text-neutral-500 font-normal leading-relaxed">
                  Untreated, non-hybrid pure organic origin
                </p>
              </div>
            </div>

          </div>

          {/* ================= 5. FOOTER COMPLIANCE & HELPDESK LINKS ================= */}
          <div className="hidden md:flex items-center justify-center gap-4 pt-6 border-t border-neutral-200/70 text-xs text-neutral-500 font-medium">
            <a href="#about-philosophy" className="hover:text-emerald-800 transition-colors">
              Harvest Standards
            </a>
            <span className="text-neutral-300">•</span>
            <a href="#partner-with-us" className="hover:text-emerald-800 transition-colors">
              Restaurant B2B Pricing
            </a>
            <span className="text-neutral-300">•</span>
            <a href={`https://wa.me/91${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="hover:text-emerald-800 transition-colors">
              WhatsApp Helpdesk
            </a>
          </div>

        </div>

      </section>
    </div>
  );
};