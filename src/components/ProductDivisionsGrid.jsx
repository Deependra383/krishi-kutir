import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Award, CheckCircle2 } from 'lucide-react';

export const ProductDivisionsGrid = () => {
  const divisions = [
    {
      id: 'div-microgreens',
      name: 'Living Microgreens & Trays',
      subtitle: 'Living Superfoods with 40x Nutrient Density',
      description: 'Living broccoli, daikon radish, sweet pea shoots, and sunflower greens delivered growing on organic coco pads or freshly harvested.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      badge: 'Fresh & Living Harvest',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      tag: '0 Chemical Residue',
      target: '#microgreens-section'
    },
    {
      id: 'div-powders',
      name: 'Fruit & Vegetable Powders',
      subtitle: 'Dehydrated Pure Plant Concentrates',
      description: 'Cryo-dehydrated beetroot, moringa, amla, spinach, and tomato umami powder retaining maximum bioflavonoids, vitamins, and natural aroma.',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      badge: 'Cryo Processed',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      tag: '100% Pure Active Enzymes',
      target: '#powders-spices-section'
    },
    {
      id: 'div-spices',
      name: 'Organic Spices & Herbal Extracts',
      subtitle: 'Ayurvedic Potency & High-Curcumin Spices',
      description: 'Single-origin Lakadong turmeric (>7.5% curcumin), Ceylon cinnamon, sun-dried Sonth ginger, and hand-sorted Tellicherry black pepper.',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      badge: 'Tested High Potency',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      tag: 'Steam Sterilized',
      target: '#powders-spices-section'
    },
    {
      id: 'div-dairy',
      name: 'Plant-Based Milk Alternatives',
      subtitle: 'Lactose-Free Pure Botanical Powders',
      description: 'Spray-dried oat milk, pure almond milk powder, and creamy coconut milk powder designed for everyday smoothies, baking, and barista drinks.',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      badge: 'Dairy Free & Vegan',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      tag: 'Zero Additives / No Maltodextrin',
      target: '#powders-spices-section'
    },
    {
      id: 'div-supplies',
      name: 'Professional Trays & Mediums',
      subtitle: 'Food-Grade Grow Trays & Substrates',
      description: 'Commercial 10" x 20" slotted grow trays, triple-washed low-EC cocopeat blocks, biodegradable packaging, and untreated non-GMO seed lots.',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
      badge: 'Commercial Grade',
      badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-300',
      tag: 'Direct Grower Supply',
      target: '#full-catalogue-section'
    }
  ];

  const handleNavigate = (target) => {
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
        {divisions.map((division, idx) => (
          <div 
            key={division.id}
            onClick={() => handleNavigate(division.target)}
            className={`group bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
              idx === 0 ? 'lg:col-span-2 lg:flex-row' : ''
            }`}
          >
            {/* Image Container - Clean without text overlay */}
            <div className={`relative overflow-hidden ${idx === 0 ? 'lg:w-1/2 h-64 lg:h-auto min-h-[260px]' : 'h-52 w-full'} bg-neutral-100`}>
              <img 
                src={division.image} 
                alt={division.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Content Container */}
            <div className={`p-6 sm:p-7 flex flex-col justify-between space-y-4 ${idx === 0 ? 'lg:w-1/2' : 'flex-1'}`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${division.badgeColor}`}>
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
        ))}
      </div>

    </section>
  );
};
