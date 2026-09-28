import React, { useState, useRef } from 'react';
import { Sprout, Send, CheckCircle2, PhoneCall, MessageCircle, Mail, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../../supabase';
import { LeafCotyledon, LeafBasil, LeafAmaranth, FruitWildBerry } from '../common/FloatingLeavesBackground';

export const MicrogreensTraining = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 60, damping: 18, mass: 0.35 };
  // Multi-speed parallax: fast foreground drift, counter-scroll movement, and steady midground
  const leaf1Y = useSpring(useTransform(scrollYProgress, [0, 1], [-85, 105]), springConfig);
  const leaf1Rotate = useSpring(useTransform(scrollYProgress, [0, 1], [-22, 28]), springConfig);
  const leaf2Y = useSpring(useTransform(scrollYProgress, [0, 1], [70, -80]), springConfig);
  const leaf2Rotate = useSpring(useTransform(scrollYProgress, [0, 1], [28, -22]), springConfig);
  const berryY = useSpring(useTransform(scrollYProgress, [0, 1], [-55, 65]), springConfig);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    variety: 'Broccoli & Radish Sango Duo',
    batchType: 'Living Root Trays (Longest Shelf Life)',
    deliveryArea: 'Bhopal City Delivery',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('training_inquiries').insert([{
            applicant_name: form.fullName,
            email: form.email,
            phone: form.phone,
            workshop_type: form.batchType,
            batch_preference: form.variety,
            questions: `${form.deliveryArea} - ${form.message}`,
            status: 'Next Batch Inquiry'
          }]);
        } catch (sbErr) {
          console.warn('Supabase next batch inquiry notice:', sbErr);
        }
      }

      const local = JSON.parse(localStorage.getItem('kk_microgreens_batch_inquiries') || '[]');
      local.push({ 
        ...form, 
        id: Date.now().toString(), 
        createdAt: new Date().toISOString(), 
        status: 'Next Batch Reserved' 
      });
      localStorage.setItem('kk_microgreens_batch_inquiries', JSON.stringify(local));
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving batch inquiry:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppInstant = () => {
    const text = encodeURIComponent(
      `Hi Krishi Kutir! I would like to inquire/reserve for the next microgreens batch:\n` +
      `• Name: ${form.fullName || 'Customer'}\n` +
      `• Variety: ${form.variety}\n` +
      `• Format: ${form.batchType}\n` +
      `• Location: ${form.deliveryArea || 'Bhopal'}\n` +
      `Please let me know the harvest day & availability.`
    );
    window.open(`https://wa.me/919009911030?text=${text}`, '_blank');
  };

  return (
    <div ref={containerRef} id="microgreens-batch-inquiry" className="pt-6 select-none font-sans relative">
      <div className="p-8 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/70 text-neutral-900 border border-emerald-200/90 shadow-xl relative overflow-hidden">
        
        {/* Decorative soft glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Scroll-Reactive Leaves & Fruits positioned strictly in background */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none" aria-hidden="true">
          <motion.div 
            style={{ y: leaf1Y, rotate: leaf1Rotate }}
            className="absolute -top-3 right-6 filter drop-shadow-sm opacity-70 hidden sm:block"
          >
            <LeafBasil className="w-12 h-12 text-emerald-700" />
          </motion.div>

          <motion.div 
            style={{ y: berryY }}
            className="absolute top-1/3 right-4 filter drop-shadow-sm opacity-80 hidden md:block"
          >
            <FruitWildBerry className="w-9 h-9" />
          </motion.div>

          <motion.div 
            style={{ y: leaf2Y, rotate: leaf2Rotate }}
            className="absolute -bottom-4 left-6 filter drop-shadow-sm opacity-80"
          >
            <LeafCotyledon className="w-14 h-14 text-emerald-600" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch relative z-10">
          
          {/* Left: Next Batch Overview & Benefits */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
                <Sprout className="w-4 h-4 text-emerald-700" />
                <span>Fresh Harvest Reservation • Bhopal Hydroponic Facility</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
                Inquire for Next Batch
              </h3>
              
              <p className="text-neutral-600 text-sm sm:text-base font-normal leading-relaxed">
                We sow fresh seed trays every 48 hours inside our Bhopal climate-controlled vertical farm. Reserve your live trays or freshly harvested boxes before tray germination cutoff for peak cellular vitality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs">
                  <Clock className="w-5 h-5 text-emerald-700 mb-1.5" />
                  <h4 className="text-xs font-bold text-neutral-900 uppercase">Cut at Sunrise</h4>
                  <p className="text-[11px] text-neutral-500 font-normal mt-0.5">Harvested 5:00 AM – 7:00 AM on delivery day</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 mb-1.5" />
                  <h4 className="text-xs font-bold text-neutral-900 uppercase">100% Pesticide Free</h4>
                  <p className="text-[11px] text-neutral-500 font-normal mt-0.5">Pure RO water hydration, zero synthetic inputs</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="pt-4 border-t border-emerald-200/70 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Direct Farm Desk Reservations:
              </span>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-700 font-semibold">
                <a 
                  href="https://wa.me/919009911030?text=Hi%20Krishi%20Kutir,%20I%20would%20like%20to%20inquire%20for%20the%20next%20microgreens%20batch."
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Reservation (+91 90099 11030)</span>
                </a>
                <a 
                  href="tel:+919009911030" 
                  className="flex items-center gap-1.5 text-neutral-700 hover:text-emerald-700 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>+91 90099 11030</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Next Batch Inquiry Form */}
          <div className="lg:col-span-6 bg-white border border-neutral-200/90 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-2xl font-black uppercase text-neutral-900">Batch Reservation Received!</h4>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="font-bold">{form.fullName}</strong>. We have placed your reservation for the next batch of <strong className="font-bold">{form.variety}</strong>. Our farm manager will confirm the harvest schedule with you directly.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleWhatsAppInstant}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Reserve Another Batch
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h4 className="text-lg font-black uppercase text-neutral-900">Reserve Next Harvest Batch</h4>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5">Specify your preferred microgreens variety and harvest quantity below.</p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder=""
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder=""
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Microgreen Variety *</label>
                      <select
                        value={form.variety}
                        onChange={(e) => setForm(prev => ({ ...prev, variety: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                      >
                        <option value="Broccoli & Radish Sango Duo">Broccoli & Radish Sango Duo</option>
                        <option value="Living Sunflower Shoots">Living Sunflower Shoots</option>
                        <option value="Crispy Pea Shoots">Crispy Pea Shoots</option>
                        <option value="Alfalfa & Red Amaranth">Alfalfa & Red Amaranth</option>
                        <option value="Fresh Cut Wheatgrass">Fresh Cut Wheatgrass</option>
                        <option value="Spicy Mustard & Fenugreek">Spicy Mustard & Fenugreek</option>
                        <option value="Gourmet Salad Chef Blend">Gourmet Salad Chef Blend</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Harvest Format *</label>
                      <select
                        value={form.batchType}
                        onChange={(e) => setForm(prev => ({ ...prev, batchType: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                      >
                        <option value="Living Root Trays (Longest Shelf Life)">Living Root Trays (Longest Shelf Life)</option>
                        <option value="Harvested Cut Packs (100g / 250g)">Harvested Cut Packs (100g / 250g)</option>
                        <option value="Weekly Recurring Subscription (3 Trays)">Weekly Recurring Subscription (3 Trays)</option>
                        <option value="Commercial HORECA Batch (5kg+)">Commercial HORECA Batch (5kg+)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Delivery City / Area in Bhopal</label>
                    <input
                      type="text"
                      value={form.deliveryArea}
                      onChange={(e) => setForm(prev => ({ ...prev, deliveryArea: e.target.value }))}
                      placeholder=""
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Special Notes or Target Delivery Date</label>
                    <textarea
                      rows={2}
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder=""
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-700/20 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Reservation...' : 'Inquire for Next Batch'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppInstant}
                    className="py-3.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
