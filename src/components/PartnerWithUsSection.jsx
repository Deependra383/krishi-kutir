import React, { useState, useRef } from 'react';
import { useScroll } from 'motion/react';
import { 
  Handshake, 
  Building2, 
  Truck, 
  Globe2, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Boxes, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Layers,
  MessageCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabase';
import { useHomepageContent } from '../context/HomepageContentContext';
import { BotanicalSectionBackdrop } from './common/BotanicalSectionBackdrop';

export const PartnerWithUsSection = ({ activeTheme }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const { infrastructureCards, defaultInfrastructureCards } = useHomepageContent();
  const displayInfrastructure = (infrastructureCards && infrastructureCards.length > 0) 
    ? infrastructureCards 
    : defaultInfrastructureCards;


  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    partnerType: 'Restaurant & Cafe (HORECA)',
    cityLocation: '',
    estimatedVolume: 'Weekly Recurring (5-20 KG)',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('partner_inquiries').insert([{
            company_name: formData.businessName || formData.fullName,
            contact_person: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            business_type: formData.partnerType,
            estimated_volume: formData.estimatedVolume,
            city: formData.cityLocation,
            notes: formData.message,
            status: 'New Lead'
          }]);
        } catch (sbErr) {
          console.warn('Supabase partner inquiry error:', sbErr);
        }
      }

      const local = JSON.parse(localStorage.getItem('kk_partner_inquiries') || '[]');
      local.push({
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('kk_partner_inquiries', JSON.stringify(local));
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting partner inquiry:', err);
      // Fallback to local storage
      const local = JSON.parse(localStorage.getItem('kk_partner_inquiries') || '[]');
      local.push({
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('kk_partner_inquiries', JSON.stringify(local));
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="partner-with-us" ref={sectionRef} className="w-full py-20 px-4 sm:px-6 lg:px-8 space-y-20 relative overflow-hidden">
      {/* Background Botanical Decor */}
      <BotanicalSectionBackdrop variant="partner" scrollYProgress={scrollYProgress} />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
      {/* ================= SECTION HEADER ================= */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-black uppercase tracking-wider">
          <Handshake className="w-4 h-4 text-emerald-700" />
          <span>B2B & Commercial Partnerships</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-900">
          Partner With Krishi Kutir
        </h2>
        <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed">
          Join hands with India's premier hyper-local microgreens and pure dehydrated botanical superfood producer. We power leading restaurants, supermarkets, wellness brands, and international distributors.
        </p>
      </div>

      {/* ================= PARTNER WITH US FORM ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 shadow-xl p-8 sm:p-10 flex flex-col justify-between h-full relative z-20">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-700 tracking-widest">
                Commercial Partnerships & Bulk Supply
              </span>
              <h3 className="text-2xl font-black uppercase text-neutral-900">
                Submit Partnership Inquiry
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Fill out your commercial requirements below. Our corporate supply team will evaluate your request and respond within 24 business hours with bulk pricing and sample dispatch details.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-black uppercase text-neutral-900">Inquiry Submitted Successfully!</h4>
                <p className="text-xs text-neutral-700 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="font-bold">{formData.fullName}</strong>. We have registered your inquiry for <strong className="font-bold">{formData.businessName || 'your business'}</strong>. Our B2B operations desk will reach out via <span className="font-mono font-bold text-emerald-800">{formData.email}</span> and <span className="font-mono font-bold text-emerald-800">{formData.phone}</span>.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      fullName: '',
                      businessName: '',
                      email: '',
                      phone: '',
                      partnerType: 'Restaurant & Cafe (HORECA)',
                      cityLocation: '',
                      estimatedVolume: 'Weekly Recurring (5-20 KG)',
                      message: ''
                    });
                  }}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      Contact Person Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder=""
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      Company / Brand Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder=""
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      Work Email *
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder=""
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      Direct Phone / WhatsApp *
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder=""
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      Partnership Category *
                    </label>
                    <select
                      value={formData.partnerType}
                      onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    >
                      <option value="Restaurant & Cafe (HORECA)">Restaurant & Cafe (HORECA)</option>
                      <option value="Supermarket / Organic Retail Chain">Supermarket / Organic Retail Chain</option>
                      <option value="Bulk B2B Wholesaler / Trader">Bulk B2B Wholesaler / Trader</option>
                      <option value="International Importer / Exporter">International Importer / Exporter</option>
                      <option value="Private Label & Custom Dehydration">Private Label & Custom Dehydration</option>
                      <option value="Farm Franchisee / Contract Grower">Farm Franchisee / Contract Grower</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                      City & Country *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder=""
                      value={formData.cityLocation}
                      onChange={(e) => setFormData({ ...formData, cityLocation: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                    Estimated Purchase Volume
                  </label>
                  <select
                    value={formData.estimatedVolume}
                    onChange={(e) => setFormData({ ...formData, estimatedVolume: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="Weekly Recurring (5-20 KG)">Weekly Recurring (5-20 KG)</option>
                    <option value="Daily Fresh Delivery (HORECA 2-10 KG)">Daily Fresh Delivery (HORECA 2-10 KG)</option>
                    <option value="Monthly Bulk Powders (100 - 500 KG)">Monthly Bulk Powders (100 - 500 KG)</option>
                    <option value="Container Export Lot (1 Ton+)">Container Export Lot (1 Ton+)</option>
                    <option value="Sample Evaluation Trial">Sample Evaluation Trial</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                    Specific Products & Custom Requirements
                  </label>
                  <textarea 
                    rows={3}
                    placeholder=""
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <button
                  id="submit-partner-form-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Details...' : 'Submit Partnership Proposal'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Quick Info Card (Matching Equal Length) */}
        <div className="lg:col-span-5 h-full flex flex-col relative z-20">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200/90 text-neutral-900 shadow-xl flex-1 flex flex-col justify-between h-full space-y-6">
            
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-600 tracking-widest">
                  Direct Corporate Desk
                </span>
                <h4 className="text-2xl font-black uppercase text-neutral-900">Rapid B2B Response</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Prefer an instant phone or email conversation? Reach our commercial directors directly for pricing sheets, custom dehydration batches, and export logistics:
                </p>
              </div>

              {/* Contact Channels */}
              <div className="space-y-3.5 text-xs font-medium">
                <a 
                  href="https://wa.me/919009911030?text=Hi%20Krishi%20Kutir,%20I%20am%20interested%20in%20partnering%20or%20purchasing%20products%20wholesale." 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 transition-all text-neutral-800 shadow-2xs group"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]/20 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] text-emerald-800 block uppercase font-black tracking-wide">Direct WhatsApp Desk</span>
                    <span className="font-bold font-mono text-neutral-900 text-sm">+91 90099 11030</span>
                  </div>
                </a>

                <a 
                  href="tel:+919009911030" 
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 transition-all text-neutral-800 group"
                >
                  <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">Direct Agronomy Hotline</span>
                    <span className="font-bold font-mono text-neutral-900 text-sm">+91 90099 11030 / +91 98930 77750</span>
                  </div>
                </a>

                <a 
                  href="mailto:krishikutir@gmail.com?subject=B2B%20Partnership%20Proposal" 
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 transition-all text-neutral-800 group"
                >
                  <Mail className="w-5 h-5 text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">Commercial RFP & Export Desk</span>
                    <span className="font-bold font-mono text-neutral-900 text-sm">krishikutir@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-neutral-800">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">Leaf Lounge Center</span>
                    <span className="text-neutral-900 text-xs">Bhopal Vertical Farm • Madhya Pradesh, India • Global Export Gate</span>
                  </div>
                </div>
              </div>

              {/* B2B Assurance Badges */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/70 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                  Our B2B Supply Guarantees:
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-[11px] text-neutral-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Complimentary tasting & evaluation samples for HORECA chefs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Batch COA (Certificate of Analysis) & moisture lab testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Temperature-regulated cold chain & vacuum sealed export packs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Key Metric Strip */}
            <div className="pt-4 border-t border-neutral-200 grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60">
                <span className="text-base sm:text-lg font-black text-amber-700 block">30%</span>
                <span className="text-[9px] sm:text-[10px] text-neutral-600 uppercase font-bold">Wholesale Tier</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
                <span className="text-base sm:text-lg font-black text-emerald-700 block">24 Hrs</span>
                <span className="text-[9px] sm:text-[10px] text-neutral-600 uppercase font-bold">Harvest to Door</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/60">
                <span className="text-base sm:text-lg font-black text-rose-700 block">100%</span>
                <span className="text-[9px] sm:text-[10px] text-neutral-600 uppercase font-bold">Residue Free</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* IMAGES AND DESCRIPTION SECTION */}
      {/* ========================================================================= */}
      <div className="space-y-12 pt-8">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Why Collaborate With Us
          </span>
          <h3 className="text-3xl font-black uppercase text-neutral-900">
            Our Infrastructure & Supply Guarantee
          </h3>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Behind every harvest is a sterile, temperature-regulated micro-climate vertical farm and ISO-aligned dehydration facility.
          </p>
        </div>

        {/* 4 Image & Description Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayInfrastructure.map((card, idx) => {
            const colorThemes = [
              { label: 'text-emerald-700', icon: ShieldCheck, fallbackImg: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80' },
              { label: 'text-amber-700', icon: Truck, fallbackImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80' },
              { label: 'text-rose-700', icon: Layers, fallbackImg: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
              { label: 'text-sky-700', icon: Globe2, fallbackImg: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80' }
            ];
            const theme = colorThemes[idx % colorThemes.length];
            const IconComponent = theme.icon;

            return (
              <div 
                key={card.id || idx}
                className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 overflow-hidden bg-neutral-100 relative">
                    <img 
                      src={card.image} 
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = theme.fallbackImg;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <span className={`text-[10px] font-bold ${theme.label} uppercase tracking-wider block`}>
                      {card.category}
                    </span>
                    <h4 className="text-base font-bold text-neutral-900 uppercase">
                      {card.title}
                    </h4>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <span className={`text-[11px] font-bold ${theme.label} flex items-center gap-1`}>
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    <span>{card.badge}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
      </div>

    </section>
  );
};
