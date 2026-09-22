import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';

export const Footer = () => {
  return (
    <footer className="bg-emerald-50/90 text-emerald-950 py-16 px-4 sm:px-6 lg:px-8 border-t border-emerald-200/90 select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AnimatedLogo 
              size={58} 
              showText={true} 
              textColor="text-neutral-900" 
              taglineColor="text-emerald-700 font-semibold" 
            />
          </div>
          <p className="text-xs text-emerald-800/90 leading-relaxed font-normal">
            Pure dehydrated vegetable powders, single-origin botanical spices, and fresh living microgreens. Cultivated in Bhopal and delivered fresh with strict quality compliance.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-xl bg-white hover:bg-emerald-700 text-emerald-800 hover:text-white transition-all border border-emerald-200 shadow-2xs cursor-pointer hover:scale-105"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-xl bg-white hover:bg-emerald-700 text-emerald-800 hover:text-white transition-all border border-emerald-200 shadow-2xs cursor-pointer hover:scale-105"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-xl bg-white hover:bg-emerald-700 text-emerald-800 hover:text-white transition-all border border-emerald-200 shadow-2xs cursor-pointer hover:scale-105"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Microgreens Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
            Living Microgreens
          </h4>
          <ul className="space-y-2 text-xs text-emerald-800/85 font-medium">
            <li><a href="#harvested-microgreens" className="hover:text-emerald-950 hover:underline transition-colors">Fresh Harvested Clamshells</a></li>
            <li><a href="#live-microgreens" className="hover:text-emerald-950 hover:underline transition-colors">Living Grow Trays</a></li>
            <li><a href="#microgreens-seeds" className="hover:text-emerald-950 hover:underline transition-colors">Untreated Heirloom Seeds</a></li>
            <li><a href="#training-academy" className="hover:text-emerald-950 hover:underline transition-colors">Commercial Training Masterclass</a></li>
            <li><a href="#partner-with-us" className="hover:text-emerald-950 hover:underline transition-colors">HoReCa Chef Supply</a></li>
          </ul>
        </div>

        {/* Powders & Spices */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
            Botanical Powders & Extracts
          </h4>
          <ul className="space-y-2 text-xs text-emerald-800/85 font-medium">
            <li><a href="#powders-spices-section" className="hover:text-emerald-950 hover:underline transition-colors">Pure Fruit & Vegetable Powders</a></li>
            <li><a href="#powders-spices-section" className="hover:text-emerald-950 hover:underline transition-colors">Lakadong Turmeric & Spices</a></li>
            <li><a href="#powders-spices-section" className="hover:text-emerald-950 hover:underline transition-colors">Plant Milk Powders (Almond, Oat)</a></li>
            <li><a href="#partner-with-us" className="hover:text-emerald-950 hover:underline transition-colors">Private Label Dehydration</a></li>
            <li><a href="#partner-with-us" className="hover:text-emerald-950 hover:underline transition-colors">Bulk Commercial Orders</a></li>
          </ul>
        </div>

        {/* Facility & Contact */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
            Facility & Dispatch
          </h4>
          <div className="space-y-2.5 text-xs font-medium text-emerald-800/85">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>B-26, Orchard Majesty, Airport Road, Asharam Square, Gandhi Nagar, Bhopal, MP - 462036</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <a href="tel:+919009166101" className="hover:text-emerald-950 transition-colors font-bold">+91 90091 66101 / +91 90099 11030</a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <a href="mailto:krishikutirbhopal@gmail.com" className="hover:text-emerald-950 transition-colors font-bold">krishikutirbhopal@gmail.com</a>
            </p>
          </div>
        </div>

      </div>

      <div className="border-t border-emerald-200/90 mt-12 pt-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-800/80 font-normal">
        <p>© 2026 Krishi Kutir – The Leaf Lounge. FSSAI Lic. #21424850009184.</p>
        <div className="flex gap-6 font-semibold">
          <a href="#about-philosophy" className="hover:text-emerald-950 transition-colors">About Us</a>
          <a href="#certifications-gallery" className="hover:text-emerald-950 transition-colors">Certificates</a>
          <a href="#training-academy" className="hover:text-emerald-950 transition-colors">Training</a>
          <a href="#partner-with-us" className="hover:text-emerald-950 transition-colors">Contact & B2B</a>
        </div>
      </div>
    </footer>
  );
};
