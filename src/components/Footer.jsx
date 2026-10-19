import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { useProducts } from '../context/ProductContext';

// On phones, only the first few links of each list are shown to keep the footer short
const MOBILE_CATEGORY_LINKS = 3;

const linkClass = 'hover:text-emerald-950 hover:underline transition-colors';
const socialClass = 'p-2 md:p-2.5 rounded-xl bg-white hover:bg-emerald-700 text-emerald-800 hover:text-white transition-all border border-emerald-200 shadow-2xs cursor-pointer hover:scale-105';

export const Footer = () => {
  const { showcaseCategories = [] } = useProducts();
  return (
    <footer className="bg-emerald-50/90 text-emerald-950 py-8 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-emerald-200/90 select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 md:gap-12">

        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1 space-y-3 md:space-y-4">
          <div className="flex items-center justify-between md:justify-start gap-3">
            {/* Smaller logo on phones */}
            <div className="md:hidden">
              <AnimatedLogo
                size={48}
                showText={true}
                textColor="text-[#2d6a4f]"
                taglineColor="text-[#800000] font-black"
              />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <AnimatedLogo
                size={68}
                showText={true}
                textColor="text-[#2d6a4f]"
                taglineColor="text-[#800000] font-black"
              />
            </div>

            {/* Social icons sit beside the logo on phones */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Description hidden on phones */}
          <p className="hidden md:block text-xs text-emerald-800/90 leading-relaxed font-normal">
            Pure dehydrated vegetable powders, single-origin botanical spices, and fresh living microgreens. Cultivated in Bhopal and delivered fresh with strict quality compliance.
          </p>

          <div className="hidden md:flex items-center gap-3 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Produce Categories Navigation */}
        <div className="space-y-2 md:space-y-3">
          <h4 className="text-[11px] md:text-xs font-black uppercase tracking-wider text-emerald-950">
            Produce Collections
          </h4>
          <ul className="space-y-1.5 md:space-y-2 text-xs text-emerald-800/85 font-medium">
            {showcaseCategories.length > 0 ? (
              showcaseCategories.slice(0, 5).map((cat, idx) => (
                <li key={cat.id} className={idx >= MOBILE_CATEGORY_LINKS ? 'hidden md:list-item' : ''}>
                  <a href={`#category=${cat.id}`} className={linkClass}>
                    {cat.title}
                  </a>
                </li>
              ))
            ) : (
              <>
                <li><a href="#product-categories-showcase" className={linkClass}>Explore Categories</a></li>
                <li><a href="#product-inquiry-section" className={linkClass}>Living Farm Store</a></li>
              </>
            )}
            <li className="hidden md:list-item"><a href="#product-inquiry-section" className={linkClass}>WhatsApp Direct Orders</a></li>
          </ul>
        </div>

        {/* Commercial & Training */}
        <div className="space-y-2 md:space-y-3">
          <h4 className="text-[11px] md:text-xs font-black uppercase tracking-wider text-emerald-950">
            Commercial & Academy
          </h4>
          <ul className="space-y-1.5 md:space-y-2 text-xs text-emerald-800/85 font-medium">
            <li><a href="#training-academy" className={linkClass}>Hydroponic Grow Academy</a></li>
            <li><a href="#partner-with-us" className={linkClass}>B2B & HoReCa Wholesale Supply</a></li>
            <li className="hidden md:list-item"><a href="#partner-with-us" className={linkClass}>Private Label Dehydration</a></li>
            <li><a href="#partner-with-us" className={linkClass}>Bulk Commercial Inquiries</a></li>
          </ul>
        </div>

        {/* Facility & Contact */}
        <div className="col-span-2 md:col-span-1 space-y-2 md:space-y-4">
          <h4 className="text-[11px] md:text-xs font-black uppercase tracking-wider text-emerald-950">
            Facility & Dispatch
          </h4>
          <div className="space-y-1.5 md:space-y-2.5 text-xs font-medium text-emerald-800/85">
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
              <a href="mailto:krishikutirbhopal@gmail.com" className="hover:text-emerald-950 transition-colors font-bold break-all">krishikutirbhopal@gmail.com</a>
            </p>
          </div>
        </div>

      </div>

      <div className="border-t border-emerald-200/90 mt-6 pt-4 md:mt-12 md:pt-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] md:text-xs text-emerald-800/80 font-normal">
        <p className="text-center sm:text-left">© 2026 Krishi Kutir – The Leaf Lounge. FSSAI Lic. #21424850009184.</p>
        {/* These links repeat the menu, so they are hidden on phones */}
        <div className="hidden md:flex gap-6 font-semibold">
          <a href="#about-philosophy" className="hover:text-emerald-950 transition-colors">About Us</a>
          <a href="#certifications-gallery" className="hover:text-emerald-950 transition-colors">Certificates</a>
          <a href="#training-academy" className="hover:text-emerald-950 transition-colors">Training</a>
          <a href="#partner-with-us" className="hover:text-emerald-950 transition-colors">Contact & B2B</a>
        </div>
      </div>
    </footer>
  );
};