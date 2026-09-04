import React from 'react';
import { Leaf, MapPin, Award, CheckCircle2, Sparkles } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about-philosophy" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200 select-none">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Story & Philosophy Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Origin Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-black uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bhopal, MP • Established 2025</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 leading-tight">
              Rooted in Botanical Purity, Cultivated with Modern Care
            </h2>

            <div className="space-y-4 text-neutral-600 font-light text-sm sm:text-base leading-relaxed">
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

            {/* Farm Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
              <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">100% Residue Free</h4>
                  <p className="text-xs text-neutral-500 font-light">Zero synthetic pesticides, non-GMO untreated seed lots.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Pan-India Cold Pack</h4>
                  <p className="text-xs text-neutral-500 font-light">Direct delivery across Bhopal and courier across India.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Founders */}
          <div className="lg:col-span-6 space-y-6 bg-neutral-50 p-8 sm:p-10 rounded-3xl border border-neutral-200/90 shadow-sm">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">The People Behind Krishi Kutir</span>
              <h3 className="text-2xl font-black uppercase text-neutral-900">Meet Our Founders</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Rachna Alok Sharma */}
              <div className="space-y-3 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Rachna Alok Sharma" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Rachna Alok Sharma</h4>
                  <p className="text-xs font-semibold text-emerald-700">Founder & Master Grower</p>
                </div>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  "Our mission is to bring nutrient-dense living microgreens from our grow tables directly into Indian kitchens, fresh and chemical-free."
                </p>
              </div>

              {/* Janvi Bhaghchandani */}
              <div className="space-y-3 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Janvi Bhaghchandani" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Janvi Bhaghchandani</h4>
                  <p className="text-xs font-semibold text-neutral-700">Chief Administrator</p>
                </div>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  "We ensure seamless cold-chain logistics, strict batch hygiene, and FSSAI statutory compliance across every shipment."
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
