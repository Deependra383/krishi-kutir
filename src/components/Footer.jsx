import React from 'react';
import { MapPin, ShieldCheck, Phone, Mail, Package, ArrowUpRight, Instagram, Facebook, Youtube } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';

export const Footer = ({ onOpenAuth, onOpenAdmin }) => {
  return (
    <footer className="bg-neutral-50 text-neutral-600 py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-200 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-900">
            <AnimatedLogo size={52} showText={true} />
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed font-normal">
            Pure dehydrated vegetable powders, single-origin botanical spices, and fresh living microgreens. Cultivated in Bhopal and delivered fresh with strict quality compliance.
          </p>
          <div className="flex items-center gap-3 pt-2 text-neutral-600">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-xl bg-white hover:text-emerald-700 hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-2xs"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-xl bg-white hover:text-emerald-700 hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-2xs"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-xl bg-white hover:text-emerald-700 hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-2xs"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Microgreens Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
            Living Microgreens
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600 font-normal">
            <li><a href="#harvested-microgreens" className="hover:text-emerald-700 transition-colors">Fresh Harvested Clamshells</a></li>
            <li><a href="#live-microgreens" className="hover:text-emerald-700 transition-colors">Living Grow Trays</a></li>
            <li><a href="#microgreens-seeds" className="hover:text-emerald-700 transition-colors">Untreated Heirloom Seeds</a></li>
            <li><a href="#training-academy" className="hover:text-emerald-700 transition-colors">Commercial Training Masterclass</a></li>
            <li><a href="#partner-with-us" className="hover:text-emerald-700 transition-colors">HoReCa Chef Supply</a></li>
          </ul>
        </div>

        {/* Powders & Spices */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
            Botanical Powders & Extracts
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600 font-normal">
            <li><a href="#powders-spices-section" className="hover:text-emerald-700 transition-colors">Pure Fruit & Vegetable Powders</a></li>
            <li><a href="#powders-spices-section" className="hover:text-emerald-700 transition-colors">Lakadong Turmeric & Spices</a></li>
            <li><a href="#powders-spices-section" className="hover:text-emerald-700 transition-colors">Plant Milk Powders (Almond, Oat)</a></li>
            <li><a href="#partner-with-us" className="hover:text-emerald-700 transition-colors">Private Label Dehydration</a></li>
            <li><a href="#partner-with-us" className="hover:text-emerald-700 transition-colors">Bulk Commercial Orders</a></li>
          </ul>
        </div>

        {/* Facility & Contact */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
            Facility & Dispatch
          </h4>
          <div className="space-y-2 text-xs font-normal text-neutral-600">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>B-26, Orchard Majesty, Airport Road, Asharam Square, Gandhi Nagar, Bhopal, MP - 462036</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <a href="tel:+919009166101" className="hover:text-emerald-700 transition-colors font-medium">+91 90091 66101 / +91 90099 11030</a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
              <a href="mailto:krishikutirbhopal@gmail.com" className="hover:text-emerald-700 transition-colors font-medium">krishikutirbhopal@gmail.com</a>
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="#my-orders-section"
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-200 shadow-2xs"
              >
                <Package className="w-3.5 h-3.5 text-emerald-700" /> Track My Order
              </a>
              <button 
                onClick={onOpenAdmin}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-amber-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-neutral-200 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Store Admin
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-neutral-200 mt-12 pt-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-normal">
        <p>© 2026 Krishi Kutir – The Leaf Lounge. FSSAI Lic. #21424850009184.</p>
        <div className="flex gap-6 font-medium">
          <a href="#about-philosophy" className="hover:text-neutral-900 transition-colors">About Us</a>
          <a href="#certifications-gallery" className="hover:text-neutral-900 transition-colors">Certificates</a>
          <a href="#partner-with-us" className="hover:text-neutral-900 transition-colors">Contact & B2B</a>
        </div>
      </div>
    </footer>
  );
};
