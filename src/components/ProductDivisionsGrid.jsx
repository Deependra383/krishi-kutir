import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Award, CheckCircle2 } from 'lucide-react';
import { HOME_3D_ASSETS } from '../data';
import { useHomepageContent } from '../context/HomepageContentContext';

export const ProductDivisionsGrid = () => {
  const { divisionCards, defaultDivisionCards } = useHomepageContent();
  const activeDivisions = (divisionCards && divisionCards.length > 0) ? divisionCards : defaultDivisionCards;

  const handleNavigate = (target) => {
    if (!target) return;
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Header with Venkatesh Naturals inspiration */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Core Product Divisions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
          Pure Botanical Ingredients & Living Superfoods
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
          Crafted under rigorous hygienic standards. Discover our specialized divisions spanning living hydroponic microgreens, cryo-dehydrated vegetable powders, and certified organic herbal extracts.
        </p>
      </div>

      {/* Grid of Product Divisions with authentic photography */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {activeDivisions.map((division, idx) => {
          const fallbacks = [
            HOME_3D_ASSETS.microgreens,
            HOME_3D_ASSETS.botanicalPowders,
            HOME_3D_ASSETS.spices,
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
            HOME_3D_ASSETS.verticalFarm
          ];
          const fallbackImg = fallbacks[idx] || HOME_3D_ASSETS.microgreens;

          return (
            <div 
              key={division.id || idx}
              onClick={() => handleNavigate(division.target)}
              className={`group bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                idx === 0 ? 'lg:col-span-2 lg:flex-row' : ''
              }`}
            >
              {/* Image Container - Clean without text overlay */}
              <div className={`relative overflow-hidden ${idx === 0 ? 'lg:w-1/2 h-64 lg:h-auto min-h-[260px]' : 'h-52 w-full'} bg-neutral-100`}>
                <img 
                  src={division.image || fallbackImg} 
                  alt={division.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImg;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Content Container */}
              <div className={`p-6 sm:p-7 flex flex-col justify-between space-y-4 ${idx === 0 ? 'lg:w-1/2' : 'flex-1'}`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${division.badgeColor || 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                      {division.badge}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-wider font-semibold">
                      {division.tag}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                    {division.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-neutral-900 group-hover:text-emerald-700 transition-colors">
                    {division.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                    {division.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-800 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                    <span>Explore Division</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    FSSAI Compliant
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
