import React from 'react';
import { Sparkles } from 'lucide-react';

export const PowdersOverview = () => {
  return (
    <div className="text-center space-y-4 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-black uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span>Division 02 • Pure Botanical Nutrition</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-900">
        Herbal Powders, Spices & Seasoning
      </h2>
      <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed">
        Gently dehydrated and micro-pulverized whole foods. From creamy plant-based dairy substitutes to potent botanical remedies and aromatic whole spices.
      </p>
    </div>
  );
};
