import React from 'react';

export const Certifications = ({
  activeTheme,
  hoverCoords,
  hoverState,
  handleCardMouseMove,
  handleCardMouseEnter,
  handleCardMouseLeave,
  formatPrice
}) => {
  return (
    <section id="certifications-gallery" className="py-20 px-6 transition-colors duration-500" style={{ backgroundColor: `${activeTheme.accentColor}05` }}>
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Global Standards</span>
          <h2 className="text-4xl font-black uppercase">Our Professional Certifications</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-sm leading-relaxed font-light">
            We satisfy standard international biosecurity compliance and national organic requirements. Certified and cleared by elite federal regulatory bodies.
          </p>
        </div>

        {/* Certifications Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center font-sans">
          {[
            { label: "MSME", sub: "Small Enterprises", desc: "Regulated growth model.", icon: "🏢" },
            { label: "FSSAI", sub: "Food Safety", desc: "100% food-grade process.", icon: "🥗" },
            { label: "GST Registered", sub: "Tax Compliance", desc: "Official transparent invoices.", icon: "📄" },
            { label: "IEC CODE", sub: "Import Export Registration", desc: "Worldwide bulk clearance.", icon: "🚢" },
            { label: "APEDA", sub: "Agricultural Products", desc: "Certified exporter standard.", icon: "🌾" },
            { label: "ISO 9001:2015", sub: "Certified Quality System", desc: "Continuous audits.", icon: "🏅" },
            { label: "Trademarked", sub: "Brand Guarantee", desc: "Registered logo and name.", icon: "🛡️" }
          ].map((cert, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs space-y-2 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="text-3xl">{cert.icon}</div>
              <h4 className="font-extrabold text-sm uppercase text-neutral-800 leading-none">{cert.label}</h4>
              <p className="text-[10px] font-bold text-emerald-600 tracking-tight">{cert.sub}</p>
              <p className="text-[9px] text-neutral-400 font-light leading-tight">{cert.desc}</p>
            </div>
          ))}
        </div>

        {/* Social Event Spotlights */}
        <div className="pt-10 space-y-8">
          <h3 className="text-2xl font-black uppercase tracking-tight text-center">Our Events & Workshop Footprint</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Dietetics Association Workshop", location: "Bhopal Chapter", desc: "Demonstrating high-density microgreens nutrition to 100+ clinical nutritionists.", image: "https://images.unsplash.com/photo-1544535830-9d5a6724cd31?auto=format&fit=crop&w=500&q=80" },
              { title: "Central Agri Institute Visit", location: "CIAE Campus", desc: "Co-founding high-tech seedling trays and solar LED strip growth optimization tests.", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80" },
              { title: "Culinary Wellness Summit", location: "Orchard Majestic", desc: "Pairing dehydrated beetroot and spinach powder with elite vegan gourmet dishes.", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80" }
            ].map((ev, i) => {
              const cardId = `workshop-${i}`;
              const isHovering = hoverState[cardId];
              const coord = hoverCoords[cardId] || { x: 0, y: 0 };
              
              return (
                <div key={cardId} className="relative group select-none">
                  {/* Moveable Background elements unique to each workshop card */}
                  <div 
                    className="absolute inset-0 z-0 pointer-events-none transition-transform duration-500 ease-out opacity-60"
                    style={{
                      transform: `translate3d(${coord.x * 0.5}px, ${coord.y * 0.5}px, 0)`
                    }}
                  >
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-lg"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-[-12px] text-xl">🍃</div>
                    <div className="absolute top-1/4 right-[-12px] text-2xl">🌿</div>
                  </div>

                  {/* Main Card container */}
                  <div 
                    className="w-full rounded-3xl overflow-hidden relative shadow-xl z-10 border border-neutral-200 cursor-pointer bg-white transition-all duration-300 flex flex-col"
                    onMouseMove={(e) => handleCardMouseMove(e, cardId)}
                    onMouseEnter={() => handleCardMouseEnter(cardId)}
                    onMouseLeave={() => handleCardMouseLeave(cardId)}
                    style={{
                      transform: isHovering ? `scale(1.03) translate3d(${coord.x * 0.15}px, ${coord.y * 0.15}px, 0)` : 'scale(1)',
                    }}
                  >
                    <div className="h-56 overflow-hidden bg-neutral-100 relative">
                      <img 
                        src={ev.image} 
                        alt={ev.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                        style={{
                          transform: isHovering ? 'scale(1.1) translate3d(2px, 2px, 0)' : 'scale(1.05)'
                        }}
                      />
                    </div>
                    
                    {/* Clean content container below image */}
                    <div className="p-6 bg-white space-y-2">
                      <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 block">{ev.location}</span>
                      <h4 className="text-sm font-black uppercase tracking-tight leading-tight text-neutral-900 font-sans">{ev.title}</h4>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-2">{ev.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
