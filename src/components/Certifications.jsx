import React, { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { useHomepageContent } from '../context/HomepageContentContext';
import { BotanicalSectionBackdrop } from './common/BotanicalSectionBackdrop';
import { EventsWorkshopBotanicals } from './common/EventsWorkshopBotanicals';

export const Certifications = ({
  activeTheme,
  hoverCoords,
  hoverState,
  handleCardMouseMove,
  handleCardMouseEnter,
  handleCardMouseLeave,
  formatPrice
}) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const { eventsWorkshops, defaultEventsWorkshops } = useHomepageContent();
  const displayEvents = (eventsWorkshops && eventsWorkshops.length > 0) ? eventsWorkshops : defaultEventsWorkshops;

  return (
    <section 
      ref={sectionRef}
      id="certifications-gallery" 
      className="py-20 px-6 transition-colors duration-500 relative overflow-hidden" 
      style={{ backgroundColor: `${activeTheme.accentColor}05` }}
    >
      {/* Background Botanical Decor with Parallax matching Screenshot 62 */}
      <BotanicalSectionBackdrop variant="certifications" scrollYProgress={scrollYProgress} />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        <div className="text-center space-y-4 relative z-20">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Global Standards</span>
          <h2 className="text-4xl font-black uppercase">Our Professional Certifications</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-sm leading-relaxed font-light">
            We satisfy standard international biosecurity compliance and national organic requirements. Certified and cleared by elite federal regulatory bodies.
          </p>
        </div>

        {/* Certifications Standing Cards Row - Upright Standing Rectangles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-3.5 text-center font-sans relative z-20">
          {[
            { 
              id: "msme",
              label: "MSME", 
              sub: "Small Enterprises", 
              authority: "Ministry of MSME",
              desc: "Udyam registered sustainable enterprise following regulated agricultural models.", 
              icon: "🏢",
              regCode: "UDYAM-MP-03",
              statusText: "Active Registry"
            },
            { 
              id: "fssai",
              label: "FSSAI", 
              sub: "Food Safety", 
              authority: "Food Safety & Standards",
              desc: "100% food-grade process, sterile handling, and contaminant-free testing clearance.", 
              icon: "🥗",
              regCode: "LIC-10023-FSS",
              statusText: "100% Food Grade"
            },
            { 
              id: "gst",
              label: "GST Registered", 
              sub: "Tax Compliance", 
              authority: "CBIC Central Board",
              desc: "Official transparent invoices with full business-to-business tax legitimacy.", 
              icon: "📄",
              regCode: "23AAACV8921",
              statusText: "Compliant Invoices"
            },
            { 
              id: "iec",
              label: "IEC CODE", 
              sub: "Import Export", 
              authority: "DGFT Ministry of Commerce",
              desc: "Authorized global cross-border botanical export and international port clearance.", 
              icon: "🚢",
              regCode: "IEC-GLOBAL-EX",
              statusText: "Export Clearance"
            },
            { 
              id: "apeda",
              label: "APEDA", 
              sub: "Agricultural Products", 
              authority: "Agri Export Authority",
              desc: "Standardized organic crop exports meeting stringent global biosecurity benchmarks.", 
              icon: "🌾",
              regCode: "RCMC-APEDA",
              statusText: "Organic Standard"
            },
            { 
              id: "iso",
              label: "ISO 9001:2015", 
              sub: "Quality System", 
              authority: "Quality Management",
              desc: "Strictly audited quality assurance for indoor vertical crops, seed purity, and distribution.", 
              icon: "🏅",
              regCode: "ISO-QMS-2026",
              statusText: "Audited System"
            },
            { 
              id: "trademark",
              label: "Trademarked", 
              sub: "Brand Guarantee", 
              authority: "IP India Registry",
              desc: "Legally secured brand identity, proprietary extraction methods, and certified origin.", 
              icon: "🛡️",
              regCode: "TM-REG-CL31",
              statusText: "Legal Protection"
            }
          ].map((cert, idx) => (
            <motion.div 
              key={cert.id || idx} 
              initial={{ opacity: 0, y: -26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ 
                duration: 0.55, 
                delay: idx * 0.07, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-emerald-400/80 transition-all duration-300 relative z-20 flex flex-col justify-between items-center text-center p-4 sm:p-5 min-h-[310px] sm:min-h-[335px] group overflow-hidden"
            >
              {/* Top standing accent stripe */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600 opacity-90 group-hover:h-2 transition-all duration-300" />

              {/* Card Header & Reg Badge */}
              <div className="w-full pt-1 flex items-center justify-between text-[8.5px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                <span className="truncate max-w-[80px]">{cert.regCode}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500/80 group-hover:scale-125 transition-transform shrink-0" />
              </div>

              {/* Standing Seal Medallion */}
              <div className="relative my-2.5">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-amber-50/70 via-neutral-50 to-emerald-50/70 border border-neutral-200/80 shadow-2xs flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 group-hover:rotate-2 group-hover:border-emerald-300 transition-all duration-300">
                  {cert.icon}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shadow-xs border-2 border-white">
                  ✓
                </div>
              </div>

              {/* Standing Card Body */}
              <div className="space-y-1 flex-1 flex flex-col justify-center w-full px-0.5">
                <h4 className="font-extrabold text-xs sm:text-sm uppercase text-neutral-900 tracking-tight leading-snug group-hover:text-emerald-950 transition-colors">
                  {cert.label}
                </h4>
                <p className="text-[10px] font-bold text-emerald-700 tracking-tight leading-tight">
                  {cert.sub}
                </p>
                <div className="w-6 h-0.5 bg-neutral-200 mx-auto my-1.5 group-hover:w-10 group-hover:bg-emerald-400 transition-all duration-300" />
                <p className="text-[10px] text-neutral-500 font-light leading-relaxed line-clamp-3">
                  {cert.desc}
                </p>
              </div>

              {/* Bottom Standing Base / Verification Stamp */}
              <div className="w-full pt-2.5 mt-2.5 border-t border-dashed border-neutral-200 flex flex-col items-center gap-1">
                <span className="text-[8.5px] uppercase font-mono tracking-widest text-neutral-400 font-semibold truncate max-w-full">
                  {cert.authority}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50/90 px-2 py-0.5 rounded-full border border-emerald-200/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {cert.statusText}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Event Spotlights with generous open margin */}
        <div className="pt-16 pb-12 space-y-8 relative">
          {/* Parallax Floating Fruits & Leaves dynamically moving on scroll, placed strictly in open gaps */}
          <EventsWorkshopBotanicals scrollYProgress={scrollYProgress} />

          <div className="space-y-1 text-center sm:text-left relative z-20">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 block">Community & Knowledge Exchange</span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
              Our Events & Workshop Footprint
            </h3>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20 overflow-x-auto scrollbar-none pb-2"
          >
            {displayEvents.map((ev, i) => {
              const cardId = `workshop-${i}`;
              const isHovering = hoverState[cardId];
              const coord = hoverCoords[cardId] || { x: 0, y: 0 };
              
              return (
                <motion.div 
                  key={cardId} 
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: i * 0.12, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="relative z-20 group select-none min-w-[280px]"
                >
                  {/* Subtle soft ambient glow behind each workshop card */}
                  <div 
                    className="absolute inset-0 z-0 pointer-events-none transition-transform duration-500 ease-out opacity-40"
                    style={{
                      transform: `translate3d(${coord.x * 0.5}px, ${coord.y * 0.5}px, 0)`
                    }}
                  >
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-lg"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
                  </div>

                  {/* Main Card container */}
                  <div 
                    className="w-full rounded-3xl overflow-hidden relative shadow-xl z-20 border border-neutral-200 cursor-pointer bg-white transition-all duration-300 flex flex-col"
                    onMouseMove={(e) => handleCardMouseMove(e, cardId)}
                    onMouseEnter={() => handleCardMouseEnter(cardId)}
                    onMouseLeave={() => handleCardMouseLeave(cardId)}
                    style={{
                      transform: isHovering ? `scale(1.03) translate3d(${coord.x * 0.15}px, ${coord.y * 0.15}px, 0)` : 'scale(1)',
                    }}
                  >
                    <div className="h-56 overflow-hidden bg-neutral-100 relative">
                      <img 
                        src={ev.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'} 
                        alt={ev.title} 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80';
                        }}
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
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
