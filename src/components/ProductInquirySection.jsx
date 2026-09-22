import React, { useState, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { supabase } from '../supabase';
import { BotanicalSectionBackdrop } from './common/BotanicalSectionBackdrop';

const WHATSAPP_NUMBER = '9009911030';
const FORMATTED_PHONE = '+91 90099 11030';

const POPULAR_PRODUCTS = [
  { id: 'micro-radish', name: 'Fresh Radish Red Microgreens (Clamshell)', category: 'Harvested Microgreens', price: '₹149' },
  { id: 'micro-sunflower', name: 'Crisp Sunflower Shoots (Living Tray)', category: 'Live Microgreens', price: '₹220' },
  { id: 'micro-broccoli', name: 'Superfood Broccoli Microgreens (Clamshell)', category: 'Harvested Microgreens', price: '₹180' },
  { id: 'powder-beetroot', name: 'Cryo-Dehydrated Beetroot Powder (100g)', category: 'Natural Powders', price: '₹249' },
  { id: 'powder-moringa', name: 'Raw Shade-Dried Moringa Powder (100g)', category: 'Natural Powders', price: '₹199' },
  { id: 'spice-lakadong', name: 'Lakadong High-Curcumin Turmeric (100g)', category: 'Spices & Seasoning', price: '₹280' },
  { id: 'spice-cardamom', name: 'Single-Origin Green Cardamom (50g)', category: 'Spices & Seasoning', price: '₹320' },
  { id: 'seed-alfalfa', name: 'Untreated Heirloom Alfalfa Seeds (250g)', category: 'Untreated Seeds', price: '₹350' }
];

export const ProductInquirySection = ({ activeTheme }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [selectedProduct, setSelectedProduct] = useState(POPULAR_PRODUCTS[0]);
  const [quantity, setQuantity] = useState(1);
  const [customProduct, setCustomProduct] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate customized WhatsApp Link
  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    const productName = customProduct.trim() || selectedProduct.name;
    const msg = 
      `*KRISHI KUTIR - PRODUCT INQUIRY*\n` +
      `--------------------------------\n` +
      `• *Item Requested:* ${productName}\n` +
      `• *Quantity:* ${quantity}\n` +
      `• *Customer Name:* ${fullName.trim() || 'Not specified'}\n` +
      `• *Delivery Location / City:* ${city.trim() || 'Bhopal / Direct Courier'}\n` +
      `• *Contact Number:* ${phone.trim() || 'Via WhatsApp'}\n` +
      (notes.trim() ? `• *Special Notes:* ${notes.trim()}\n` : '') +
      `--------------------------------\n` +
      `_Sent from Krishi Kutir online inquiry desk._`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/91${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  // Submit Inquiry to Supabase / Local storage
  const handleSubmitOnline = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const productName = customProduct.trim() || selectedProduct.name;
    const inquiryRecord = {
      product_name: productName,
      quantity,
      customer_name: fullName.trim() || 'Anonymous Guest',
      phone: phone.trim() || 'Not Provided',
      city: city.trim() || 'Bhopal',
      notes: notes.trim() || 'Online product inquiry',
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
    <section 
      id="product-inquiry-section" 
      ref={sectionRef}
      className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden"
    >
      {/* Scroll-Reactive Leaves and Fruit Badges positioned strictly in background */}
      <BotanicalSectionBackdrop variant="inquiry" scrollYProgress={scrollYProgress} showSoftGlows={false} />

      <div className="max-w-4xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Farm Fresh Dispatch Desk</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
          Send a Product Inquiry
        </h2>
        
        <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
          Select your harvest item and connect instantly with our Bhopal farm desk. We fulfill fresh living trays, dried powders, spices, and untreated seeds daily.
        </p>
      </div>

      {/* Main Form Card - Spacious & Clean */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative z-20">
        
        {isSubmitted ? (
          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-black uppercase text-neutral-900">Inquiry Received!</h4>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto">
                Our farm coordinator will review your request and confirm batch availability and dispatch schedules shortly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setNotes('');
              }}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase transition-all cursor-pointer shadow-sm"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleWhatsAppSend} className="space-y-6">
            
            {/* 1. Item Selection Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                Select Farm Product
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {POPULAR_PRODUCTS.map((prod) => {
                  const isSelected = selectedProduct.id === prod.id && !customProduct;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        setSelectedProduct(prod);
                        setCustomProduct('');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-2xs ring-1 ring-emerald-600' 
                          : 'bg-neutral-50/70 border-neutral-200 text-neutral-700 hover:bg-neutral-100/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold leading-tight">{prod.name}</span>
                        <span className="text-xs font-black text-emerald-700 shrink-0 font-mono">{prod.price}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1 block">
                        {prod.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Product Input fallback */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1">
                Looking for something else?
              </label>
              <input
                type="text"
                value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                placeholder="Or type custom product name, e.g. Organic Chia Microgreens, Custom Powder Blend..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* 2. Customer Contact & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Rachna Sharma"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 98260 12345"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bhopal, Indore, Delhi"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Quantity Selector & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Quantity
                </label>
                <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 text-neutral-600 hover:bg-neutral-200 font-black cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center bg-transparent text-xs sm:text-sm font-bold text-neutral-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2.5 text-neutral-600 hover:bg-neutral-200 font-black cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                  Special Notes / Schedule Requirements
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need weekly supply for restaurant, or living trays for weekend harvest"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#075E54] hover:bg-[#054c44] text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#075E54]/25 hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Send via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitOnline}
                disabled={isSubmitting}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Online</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
      </div>
    </section>
  );
};
