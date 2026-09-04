import React from 'react';
import { ShieldCheck, Award, Leaf, Zap, Droplets, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react';

export const VenkateshQualityPillars = () => {
  const pillars = [
    {
      icon: Leaf,
      title: '100% Untreated & Non-GMO',
      tag: 'Seed Integrity',
      description: 'We exclusively cultivate using untreated, non-hybrid heirloom and certified non-GMO seeds, grown in chemical-free virgin coco-coir.',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      icon: Zap,
      title: 'Cryo-Dehydration Process',
      tag: '< 38°C Low Temperature',
      description: 'Our proprietary gentle dehydration retains above 95% of native active enzymes, natural pigments, and heat-sensitive antioxidants.',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Chemical Extraction',
      tag: '100% Residue Free',
      description: 'No chemical solvents, zero artificial anti-caking agents, no maltodextrin carriers, and no synthetic color boosters ever used.',
      color: 'text-rose-700 bg-rose-50 border-rose-200'
    },
    {
      icon: Droplets,
      title: 'Pure RO-Hydroponic Growing',
      tag: 'Controlled Environment',
      description: 'Grown in our sanitized Leaf Lounge vertical facility with multi-stage RO water purification, ensuring zero heavy metal or groundwater runoff.',
      color: 'text-sky-700 bg-sky-50 border-sky-200'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 border-y border-neutral-200/80 text-neutral-900 select-none">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-xs font-mono uppercase tracking-widest text-emerald-800 border border-emerald-200">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Standard of Purity & Verification</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
              Why Krishi Kutir Natural Extracts?
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              Echoing international botanical standards, our mission is to deliver pure, unadulterated taste with complete transparency and pharmaceutical-grade hygienic handling.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#certifications-gallery"
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-700/20 hover:scale-102"
            >
              <span>View Lab Certifications</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={i}
                className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-xl hover:border-emerald-500/80 transition-all duration-300 space-y-4 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${pillar.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                    {pillar.tag}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 uppercase leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Lab Verified Pure</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications ticker strip */}
        <div className="pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600">
          <span className="font-mono uppercase tracking-wider text-neutral-500 text-[11px] font-bold">
            Statutory & Quality Accreditations:
          </span>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-semibold text-neutral-700">
            <span className="px-3 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs">FSSAI Lic. #21424850009184</span>
            <span className="px-3 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs">ISO 22000:2018 Standards</span>
            <span className="px-3 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs">100% Residue Free</span>
            <span className="px-3 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs">Cold-Chain Insulated Packing</span>
          </div>
        </div>

      </div>
    </section>
  );
};
