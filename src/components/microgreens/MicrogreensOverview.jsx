import React from 'react';
import { Leaf, Droplets, Sun, Sparkles } from 'lucide-react';

export const MicrogreensOverview = () => {
  return (
    <div id="microgreens-about" className="space-y-10 select-none">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-black uppercase tracking-widest">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Fresh Microgreens & Live Trays</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-900">
          Concentrated Nutrition, Harvested Daily
        </h2>
        <p className="text-neutral-600 text-sm md:text-base font-light leading-relaxed">
          Microgreens are young seedling greens harvested 7 to 14 days after germination when the first true leaves emerge. Studies demonstrate they possess up to 40 times the concentrated polyphenol and micronutrient density of mature vegetables.
        </p>
      </div>

      {/* 3-Pillar Information Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900">Bioactive Sulforaphane & Polyphenols</h3>
          <p className="text-xs text-neutral-600 leading-relaxed font-light">
            Particularly rich in sulforaphane, carotenoids, and vitamins C, E, and K. Natural compounds that support cellular defense and metabolic wellness.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900">Hydroponic & Filtered RO Water</h3>
          <p className="text-xs text-neutral-600 leading-relaxed font-light">
            Grown exclusively on washed coco-coir using multi-stage filtered water in an indoor vertical chamber, preventing heavy metals and outdoor dust.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Sun className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900">Live Trays & Fresh Cut Options</h3>
          <p className="text-xs text-neutral-600 leading-relaxed font-light">
            Available as living trays for on-demand harvesting in your kitchen or professionally harvested and packed in breathable biodegradable clamshells.
          </p>
        </div>
      </div>
    </div>
  );
};
