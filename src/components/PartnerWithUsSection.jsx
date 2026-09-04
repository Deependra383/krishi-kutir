import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { supabase, isSupabaseConfigured } from '../supabase';

export const PartnerWithUsSection = ({ activeTheme }) => {
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

      if (db) {
        await addDoc(collection(db, 'partner_inquiries'), {
          ...formData,
          createdAt: serverTimestamp(),
          status: 'New Partner Inquiry'
        });
      } else {
        const local = JSON.parse(localStorage.getItem('kk_partner_inquiries') || '[]');
        local.push({
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('kk_partner_inquiries', JSON.stringify(local));
      }
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
    <section id="partner-with-us" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-20">
      
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 shadow-xl p-8 sm:p-10 space-y-8">
          <div className="space-y-2">
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
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                    Contact Person Name *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Singhal"
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
                    placeholder="e.g. Olive Bistro / NutraPure Foods"
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
                    placeholder="procurement@company.com"
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
                    placeholder="+91 98765 43210"
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
                    placeholder="e.g. Mumbai, India or Dubai, UAE"
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
                  rows={4}
                  placeholder="Detail your requirements (e.g. live trays vs harvested microgreens, custom mesh powders, private labeling, target timelines)..."
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

        {/* Right Quick Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-neutral-200 text-neutral-900 space-y-6 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-amber-600 tracking-widest">
                Direct Corporate Desk
              </span>
              <h4 className="text-xl font-black uppercase text-neutral-900">Rapid B2B Response</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Prefer an instant phone or email conversation? Reach our partnership officers directly:
              </p>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <a 
                href="tel:+919893077750" 
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 transition-all text-neutral-800"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Phone Line</span>
                  <span className="font-bold font-mono text-neutral-900">+91 98930 77750</span>
                </div>
              </a>

              <a 
                href="mailto:krishikutir@gmail.com?subject=B2B%20Partnership%20Proposal" 
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 transition-all text-neutral-800"
              >
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Commercial Inquiries</span>
                  <span className="font-bold font-mono text-neutral-900">krishikutir@gmail.com</span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-neutral-800">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Leaf Lounge Center</span>
                  <span className="text-neutral-900">Bhopal, Madhya Pradesh, India • Global Export Gate</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60">
                <span className="text-lg font-black text-amber-700 block">30%</span>
                <span className="text-[10px] text-neutral-600 uppercase font-bold">Wholesale Tier</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
                <span className="text-lg font-black text-emerald-700 block">24 Hrs</span>
                <span className="text-[10px] text-neutral-600 uppercase font-bold">Harvest to Door</span>
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
          
          {/* Item 1 */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="h-52 overflow-hidden bg-neutral-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80" 
                  alt="Controlled Vertical Farming Racks"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Farm Infrastructure</span>
                <h4 className="text-base font-bold text-neutral-900 uppercase">Controlled Vertical Racks</h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  High-efficiency LED full-spectrum lights, automated air circulation fans, and low-EC coco substrate ensure 365-day harvest reliability without seasonal crop failure.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Crop Continuity
              </span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="h-52 overflow-hidden bg-neutral-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" 
                  alt="HORECA Chef Supply"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Culinary Partners</span>
                <h4 className="text-base font-bold text-neutral-900 uppercase">HORECA Chef Supply</h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Daily recurring delivery of live trays or freshly harvested clamshells to fine-dining restaurants, five-star banquets, and boutique wellness cafes.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Direct Morning Drop-offs
              </span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="h-52 overflow-hidden bg-neutral-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80" 
                  alt="Hygienic Low-Temp Dehydration"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Botanical Processing</span>
                <h4 className="text-base font-bold text-neutral-900 uppercase">Hygienic Dehydration</h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Precision low-temperature air-drying prevents heat oxidation, preserving intact vitamins, live chlorophyll, and deep natural colors in every powder batch.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Moisture &lt; 5% Certified
              </span>
            </div>
          </div>

          {/* Item 4 */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="h-52 overflow-hidden bg-neutral-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80" 
                  alt="Global B2B Cargo Logistics"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Global Logistics</span>
                <h4 className="text-base font-bold text-neutral-900 uppercase">Global Cargo & Export</h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Phytosanitary certification, vacuum nitrogen sealing, and express air-freight clearance to the US, Europe, Middle East, and Asia-Pacific.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" /> Worldwide Export Ready
              </span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
