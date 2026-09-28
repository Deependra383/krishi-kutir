import React, { useState, useRef } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { motion, useScroll } from 'motion/react';
import { supabase } from '../supabase';
import { BotanicalSectionBackdrop } from './common/BotanicalSectionBackdrop';

const WHATSAPP_NUMBER = '9009911030';

const FARM_PRODUCTS = [
  { 
    id: 'micro-radish', 
    name: 'Fresh Radish Red Microgreens (Clamshell)', 
    categoryType: 'harvested',
    categoryLabel: 'HARVESTED MICROGREENS', 
    categoryBadgeColor: 'bg-[#881337] text-white',
    price: '₹149', 
    priceNum: 149,
    subtext: '50g Sealed Eco-pack • Harvested 2h prior to dispatch'
  },
  { 
    id: 'micro-sunflower', 
    name: 'Crisp Sunflower Shoots (Living Tray)', 
    categoryType: 'living',
    categoryLabel: 'LIVE MICROGREENS', 
    categoryBadgeColor: 'bg-[#059669] text-white',
    price: '₹220', 
    priceNum: 220,
    subtext: 'Living Bio-tray • Snip as you eat for 7-10 days freshness'
  },
  { 
    id: 'micro-broccoli', 
    name: 'Superfood Broccoli Microgreens (Clamshell)', 
    categoryType: 'harvested',
    categoryLabel: 'HARVESTED MICROGREENS', 
    categoryBadgeColor: 'bg-[#881337] text-white',
    price: '₹180', 
    priceNum: 180,
    subtext: '50g Box • Crisp and highly nutrient-dense harvest'
  },
  { 
    id: 'powder-beetroot', 
    name: 'Cryo-Dehydrated Beetroot Powder (100g)', 
    categoryType: 'cryo',
    categoryLabel: 'NATURAL POWDERS', 
    categoryBadgeColor: 'bg-[#581c87] text-white',
    price: '₹249', 
    priceNum: 249,
    subtext: 'Retains 98% bio-active enzymes & natural nitrates'
  },
  { 
    id: 'powder-moringa', 
    name: 'Raw Shade-Dried Moringa Powder (100g)', 
    categoryType: 'cryo',
    categoryLabel: 'NATURAL POWDERS', 
    categoryBadgeColor: 'bg-[#581c87] text-white',
    price: '₹199', 
    priceNum: 199,
    priceNote: '100g pack',
    subtext: 'Direct farm leaves, gently milled without thermal loss'
  },
  { 
    id: 'spice-lakadong', 
    name: 'Lakadong High-Curcumin Turmeric (100g)', 
    categoryType: 'spices',
    categoryLabel: 'SPICES & SEASONING', 
    categoryBadgeColor: 'bg-[#9a3412] text-white',
    price: '₹280', 
    priceNum: 280,
    subtext: 'Pure Meghalaya single-origin heirloom turmeric root'
  },
  { 
    id: 'spice-cardamom', 
    name: 'Single-Origin Green Cardamom (50g)', 
    categoryType: 'spices',
    categoryLabel: 'SPICES & SEASONING', 
    categoryBadgeColor: 'bg-[#9a3412] text-white',
    price: '₹320', 
    priceNum: 320,
    subtext: 'High essential oil, Idukki shade-plantation harvest'
  },
  { 
    id: 'seed-alfalfa', 
    name: 'Untreated Heirloom Alfalfa Seeds (250g)', 
    categoryType: 'seeds',
    categoryLabel: 'UNTREATED SEEDS', 
    categoryBadgeColor: 'bg-[#134e4a] text-white',
    price: '₹350', 
    priceNum: 350,
    subtext: 'Non-GMO tested microgreen sprouting grade'
  }
];

const FILTER_TABS = [
  { id: 'all', label: 'All Items (8)' },
  { id: 'harvested', label: 'Harvested Clamshells' },
  { id: 'living', label: 'Living Trays' },
  { id: 'cryo', label: 'Cryo Powders' }
];

export const ProductInquirySection = ({ activeTheme }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(FARM_PRODUCTS[0]);
  const [trayMultiplier, setTrayMultiplier] = useState(1);
  const [customProduct, setCustomProduct] = useState('');
  const [isSpecialOrderActive, setIsSpecialOrderActive] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter products by category tab
  const displayedProducts = FARM_PRODUCTS.filter(item => {
    if (activeFilter === 'all') return true;
    return item.categoryType === activeFilter;
  });

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
      : selectedProduct.name;
    const priceEst = isSpecialOrderActive ? 'Custom Quote' : selectedProduct.price;

    const msg = 
      `*KRISHI KUTIR - FARM-TO-FORK ORDER INQUIRY*\n` +
      `----------------------------------------\n` +
      `• *Selected Item:* ${productName}\n` +
      `• *Item Price/Est:* ${priceEst}\n` +
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
      : selectedProduct.name;

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
            <div className="shrink-0 flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-2xs">
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
                {/* Card Sub-Header: Select Farm Products + Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
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

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100/70 rounded-full border border-neutral-200/60">
                    {FILTER_TABS.map((tab) => {
                      const isActive = activeFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveFilter(tab.id)}
                          className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-[#1b4332] text-white shadow-2xs' 
                              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Products Grid (2 Columns, 8 Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedProducts.map((prod) => {
                    const isSelected = selectedProduct?.id === prod.id && !isSpecialOrderActive;
                    return (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod)}
                        className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected 
                            ? 'border-2 border-emerald-600 bg-emerald-50/30 shadow-sm' 
                            : 'border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50/50'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${prod.categoryBadgeColor}`}>
                              {prod.categoryLabel}
                            </span>
                            <div className="text-right">
                              <span className="text-base font-black text-neutral-900">
                                {prod.price}
                              </span>
                              {prod.priceNote && (
                                <span className="block text-[10px] text-neutral-400">
                                  {prod.priceNote}
                                </span>
                              )}
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-neutral-900 leading-snug group-hover:text-emerald-800 transition-colors">
                            {prod.name}
                          </h4>

                          <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                            {prod.subtext}
                          </p>
                        </div>

                        {/* Selected Radio Check Indicator */}
                        <div className="pt-2 flex items-center justify-end">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-emerald-600 text-white' 
                              : 'border border-neutral-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Looking For Something Else? / Special Order */}
                <div className="space-y-2 pt-2">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
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
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-neutral-200/70 text-xs text-neutral-500 font-medium">
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
