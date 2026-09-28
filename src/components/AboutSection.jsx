import React, { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { MapPin, ShieldCheck, Star, Check } from 'lucide-react';
import { useHomepageContent } from '../context/HomepageContentContext';
import { BotanicalSectionBackdrop } from './common/BotanicalSectionBackdrop';

export const AboutSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const { founders } = useHomepageContent();
  const founder1 = founders?.founder1 || {};
  const founder2 = founders?.founder2 || {};

  const founder1Image = founder1.image || '/rachna-alok-sharma.jpg';
  const founder2Image = founder2.image || '/janvi-bhagchandani.jpg';

  return (
    <section 
      ref={sectionRef}
      id="about-philosophy" 
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f8faf6] border-b border-neutral-200/80 select-none relative overflow-hidden"
    >
      {/* Background Botanicals Layer with Parallax */}
      <BotanicalSectionBackdrop variant="about" scrollYProgress={scrollYProgress} showSoftGlows={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Two-Column Side-by-Side Cards (Rooted in Botanical Purity & Meet Our Founders) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ================= LEFT CARD: ROOTED IN BOTANICAL PURITY ================= */}
          <motion.div 
            initial={{ opacity: 0, y: -28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[28px] sm:rounded-[32px] border border-neutral-200/90 shadow-md sm:shadow-lg p-6 sm:p-9 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top-Right Decorative Organic Accent Shape */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-100/50 via-emerald-50/20 to-transparent rounded-bl-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f4f6f0] text-[#4a5848] border border-[#e2e6dc] rounded-full text-[10px] sm:text-[11px] font-bold font-mono tracking-wider shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#52796f]" />
                <span>BHOPAL, MP • ESTABLISHED 2025</span>
              </div>
              
              {/* Editorial Display Heading */}
              <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-[#0b3d2c] uppercase tracking-tight leading-[1.14]">
                ROOTED IN<br />
                BOTANICAL PURITY,<br />
                CULTIVATED WITH<br />
                MODERN CARE
              </h2>

              {/* Story Description Paragraphs */}
              <div className="space-y-4 text-neutral-600 font-light text-xs sm:text-sm leading-relaxed">
                <p>
                  At <strong className="font-bold text-neutral-900">Krishi Kutir – The Leaf Lounge</strong>, we began with a simple belief: the food we eat every day should be alive with natural nutrients, completely unadulterated, and grown with radical transparency.
                </p>
                <p>
                  Operating our specialized vertical farm and dehydration facility in Bhopal, we harvest delicate living microgreens daily and gently cryo-dehydrate farm-fresh vegetables, herbs, and spices at low temperatures to protect sensitive plant enzymes, vibrant pigments, and essential phytonutrients.
                </p>
                <p>
                  From single-origin high-curcumin Lakadong turmeric and pure moringa powder to gourmet live microgreens trays, our produce serves families seeking cleaner diets as well as chefs who refuse to compromise on fresh taste.
                </p>
              </div>
            </div>

            {/* Bottom Section: Divider & Two Guarantee Mini-Cards */}
            <div className="relative z-10 pt-6 mt-6 border-t border-neutral-200/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* 100% Residue Free */}
                <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-[#f9faf7] rounded-2xl border border-neutral-200/80 shadow-2xs">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#15803d]" />
                  </div>
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900">
                      100% RESIDUE FREE
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-neutral-500 font-light mt-0.5 leading-snug">
                      Zero synthetic pesticides, non-GMO untreated seed lots.
                    </p>
                  </div>
                </div>

                {/* Pan-India Cold Pack */}
                <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-[#f9faf7] rounded-2xl border border-neutral-200/80 shadow-2xs">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0">
                    <span className="font-black text-sm sm:text-base text-[#15803d]">$</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900">
                      PAN-INDIA COLD PACK
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-neutral-500 font-light mt-0.5 leading-snug">
                      Direct delivery across Bhopal and courier across India.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT CARD: MEET OUR FOUNDERS ================= */}
          <motion.div 
            initial={{ opacity: 0, y: -28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[28px] sm:rounded-[32px] border border-neutral-200/90 shadow-md sm:shadow-lg p-6 sm:p-9 flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              {/* Header */}
              <div className="mb-6">
                <span className="text-[10px] sm:text-[11px] font-bold font-mono uppercase tracking-[0.2em] text-[#52796f] block">
                  THE PEOPLE BEHIND KRISHI KUTIR
                </span>
                <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-[#0b3d2c] uppercase tracking-tight mt-1.5">
                  MEET OUR FOUNDERS
                </h2>
                <div className="w-14 sm:w-16 h-0.5 bg-[#c89d5c] mt-2.5" />
              </div>

              {/* Two Founders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                
                {/* Founder 1: Rachna Alok Sharma */}
                <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:shadow-md p-4 sm:p-5 flex flex-col items-center text-center space-y-3 transition-shadow">
                  {/* Arched Portrait Frame */}
                  <div className="relative w-32 h-44 sm:w-36 sm:h-48 md:w-40 md:h-52 rounded-t-[72px] rounded-b-2xl overflow-hidden border-2 border-[#bfa168] bg-[#f4f1ea] shadow-xs shrink-0">
                    <img 
                      src={founder1Image} 
                      alt={founder1.name || 'Rachna Alok Sharma'} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/rachna-alok-sharma.jpg';
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Star Badge on bottom-right */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#0b3d2c] text-[#d4af37] border-2 border-white flex items-center justify-center shadow-xs">
                      <Star className="w-3 h-3 fill-[#d4af37]" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#0b3d2c] tracking-tight leading-snug">
                      {founder1.name || 'Rachna Alok Sharma'}
                    </h3>
                    <p className="text-[11px] sm:text-xs font-medium text-neutral-600">
                      {founder1.role || 'Founder & Master Grower'}
                    </p>
                  </div>

                  {/* Gold quote symbol */}
                  <span className="text-[#c89d5c] font-serif text-lg leading-none select-none -my-1">“</span>

                  <p className="text-[11px] sm:text-xs text-neutral-600 italic font-light leading-relaxed max-w-[220px]">
                    "{founder1.quote || 'Our mission is to bring nutrient-dense living microgreens from our grow tables directly into Indian kitchens, fresh and chemical-free.'}"
                  </p>
                </div>

                {/* Founder 2: Janvi Bhagchandani */}
                <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:shadow-md p-4 sm:p-5 flex flex-col items-center text-center space-y-3 transition-shadow">
                  {/* Arched Portrait Frame */}
                  <div className="relative w-32 h-44 sm:w-36 sm:h-48 md:w-40 md:h-52 rounded-t-[72px] rounded-b-2xl overflow-hidden border-2 border-[#bfa168] bg-[#f4f1ea] shadow-xs shrink-0">
                    <img 
                      src={founder2Image} 
                      alt={founder2.name || 'Janvi Bhagchandani'} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/janvi-bhagchandani.jpg';
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Checkmark Badge on bottom-right */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#0b3d2c] text-white border-2 border-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#0b3d2c] tracking-tight leading-snug">
                      {founder2.name || 'Janvi Bhagchandani'}
                    </h3>
                    <p className="text-[11px] sm:text-xs font-medium text-neutral-600">
                      {founder2.role || 'Chief Administrator'}
                    </p>
                  </div>

                  {/* Gold quote symbol */}
                  <span className="text-[#c89d5c] font-serif text-lg leading-none select-none -my-1">“</span>

                  <p className="text-[11px] sm:text-xs text-neutral-600 italic font-light leading-relaxed max-w-[220px]">
                    "{founder2.quote || 'We ensure seamless cold-chain logistics, strict batch hygiene, and FSSAI statutory compliance across every shipment.'}"
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom Footer Strip */}
            <div className="pt-6 mt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-600 font-medium text-[11px] sm:text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Direct From Farm • Cryo Dehydrated Facility</span>
              </div>
              <span className="font-serif italic text-[#c89d5c] font-medium text-xs">
                Pure by Nature
              </span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
