import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Check, 
  ArrowRight, 
  X, 
  Sprout, 
  ShieldCheck, 
  MessageCircle, 
  PhoneCall, 
  Download,
  Calendar,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { BotanicalSectionBackdrop } from './common/BotanicalSectionBackdrop';

const MODULES_DATA = [
  {
    week: "01",
    phase: "WEEK 01 FOUNDATION",
    hours: "6 Practical Hours + Lab",
    accent: "emerald",
    badgeBg: "bg-[#064e3b]",
    phaseColor: "text-[#064e3b]",
    topGlow: "from-emerald-500/10 via-emerald-100/20 to-transparent",
    borderColor: "border-emerald-200/90",
    pillBg: "bg-emerald-50/80 border-emerald-200/80 text-[#064e3b]",
    dotColor: "bg-emerald-500",
    title: "MICRO-SEEDS SELECTION & EC SUBSTRATE PHYSICS",
    desc: "Understanding non-GMO seed viability tests, coco-peat moisture absorption capacity, washed buffered mediums, and low Electrical Conductivity (EC) salt profiles for rapid, uniform root sprouting.",
    tags: [
      "Non-GMO Seed Audit",
      "EC & pH Balancing",
      "Coco-Peat Prep SOP"
    ],
    footerHighlight: "Live Substrate Demo Included",
    syllabusDetails: {
      overview: "Deep foundational dive into substrate chemistry, seed pathology, and pre-soak priming physics for maximum germination percentage.",
      days: [
        { title: "Day 1: Non-GMO Seed Viability & Lot Testing", desc: "Seed float test, germination percentage calculation, and seed-borne pathogen identification." },
        { title: "Day 2: Coco-Peat Leaching, Buffering & EC Reduction", desc: "Calcium nitrate pre-wash buffer to wash off sodium/potassium salts, achieving EC < 0.5 mS/cm." },
        { title: "Day 3: Tray Perforation & Capillary Mat Hydraulics", desc: "Selecting 1020 food-grade shallow trays, drainage channels, and bottom-watering wicking mats." }
      ],
      deliverables: ["Standard Operating Procedure (SOP) Seed Viability PDF", "Coco-Peat Salt Leaching Calculation Sheet", "Supplier Directory for Certified Non-GMO Seeds"]
    }
  },
  {
    week: "02",
    phase: "WEEK 02 INCUBATION",
    hours: "8 Practical Hours + Lab",
    accent: "amber",
    badgeBg: "bg-[#92400e]",
    phaseColor: "text-[#92400e]",
    topGlow: "from-amber-400/20 via-amber-100/30 to-transparent",
    borderColor: "border-amber-200/90",
    pillBg: "bg-amber-50/80 border-amber-200/80 text-[#92400e]",
    dotColor: "bg-amber-500",
    title: "SOWING DENSITIES & DARK BLACKOUT PHASE",
    desc: "Calculating precise seed grams per 1020 tray, humiditydome microclimates, weighted tray stacking protocols for strong hypocotyl elongation, and preventing pre-emergent root dampening.",
    tags: [
      "Seed Weight Gram Matrix",
      "Weighted Stacking System",
      "Mold-Free Germination"
    ],
    footerHighlight: "Includes 1020 Tray Density Calculator",
    syllabusDetails: {
      overview: "Mastering the dark period, weighted germination stacks, and humidity dome calibration for uniform root shoot anchorage.",
      days: [
        { title: "Day 1: Mathematical Sowing Density Matrix", desc: "Formulas calculating optimal grams per square inch for brassicas, legumes, and mucilaginous seeds." },
        { title: "Day 2: Weighted Tray Stacking Physics", desc: "Applying 2.5kg – 5kg weight distribution to force deep taproot establishment and simultaneous germination." },
        { title: "Day 3: Dark Blackout Phase & Humidity Management", desc: "Controlling RH between 65%-70% during initial 72 hours without creating mold spores." }
      ],
      deliverables: ["1020 Tray Seeding Gram Density Calculator (Excel)", "Weighted Stacking Step-by-Step SOP", "Bio-Fungicide Prevention Guide (Hydrogen Peroxide / Grapefruit extract)"]
    }
  },
  {
    week: "03",
    phase: "WEEK 03 PHOTOBIOLOGY",
    hours: "8 Practical Hours + Lab",
    accent: "cyan",
    badgeBg: "bg-[#0e7490]",
    phaseColor: "text-[#0e7490]",
    topGlow: "from-cyan-400/15 via-teal-100/20 to-transparent",
    borderColor: "border-cyan-200/90",
    pillBg: "bg-cyan-50/80 border-cyan-200/80 text-[#0e7490]",
    dotColor: "bg-cyan-500",
    title: "TRICOLOUR LIGHT SPECTRUMS & FANS AIRFLOW",
    desc: "Optimizing wavelength ratios (deep red 660nm to royal blue 450nm) to maximize chlorophyll development, carotenoid synthesis, and precise CFM fan air circulation to stop dampening-off.",
    tags: [
      "PAR & DLI Calculations",
      "CFM Airflow Engineering",
      "LED Distance & Photoperiod"
    ],
    footerHighlight: "Quantum PAR Meter Blueprint Included",
    syllabusDetails: {
      overview: "Engineering the indoor environment: LED spectrum tuning, Daily Light Integral (DLI), PPFD mapping, and cross-canopy airflow dynamics.",
      days: [
        { title: "Day 1: Full-Spectrum vs. Di-Chromatic Photobiology", desc: "Understanding 660nm red for stem elongation and 450nm blue for compact, nutrient-dense cotyledon leaves." },
        { title: "Day 2: PPFD & DLI Mapping Across Farm Racks", desc: "Measuring PAR levels across 4-tier vertical racks; maintaining 150-200 µmol/m²/s uniform distribution." },
        { title: "Day 3: Boundary Layer Airflow & CFM Circulation", desc: "Inline fan sizing, laminar airflow velocity (0.3 - 0.5 m/s) over canopy to prevent micro-condensation and dampening-off." }
      ],
      deliverables: ["Rack Lighting & PPFD Sensor Layout Blueprint", "Vertical Farm CFM Ventilation Formula", "16h / 8h Photoperiod Energy Consumption Matrix"]
    }
  },
  {
    week: "04",
    phase: "WEEK 04 COMMERCIAL EXIT",
    hours: "10 Practical Hours + Business Plan",
    accent: "green",
    badgeBg: "bg-[#15803d]",
    phaseColor: "text-[#15803d]",
    topGlow: "from-emerald-400/20 via-emerald-100/20 to-transparent",
    borderColor: "border-emerald-200/90",
    pillBg: "bg-emerald-50/80 border-emerald-200/80 text-[#15803d]",
    dotColor: "bg-emerald-500",
    title: "COMMERCIAL HARVESTING, SAFE PACKAGING & EXPORTING",
    desc: "Sharp edge harvesting standards at first true leaves, pre-cooling, dry-spin methods, biodegradable cornstarch clamshell storage, and meeting B2B luxury hotel and chef certifications.",
    tags: [
      "14-Day Shelf Life Method",
      "Food Grade Clamshell Packs",
      "B2B Restaurant Contracts"
    ],
    footerHighlight: "Export & FSSAI Compliance Checklist",
    syllabusDetails: {
      overview: "Commercial farm monetization, food safety compliance, zero-damage harvesting, post-harvest cooling, and enterprise chef supply contracts.",
      days: [
        { title: "Day 1: Harvesting at First True Leaf Emergence", desc: "Laser blade cutting techniques 5mm above medium line to avoid coco debris; pre-cooling to 4°C within 15 minutes." },
        { title: "Day 2: Moisture Removal, Dry-Spinning & Modified Packaging", desc: "Centrifugal de-watering, bio-based PLA cornstarch clamshells with anti-fog respiration films for 14-day shelf life." },
        { title: "Day 3: Commercial Business Plan, Pricing & Chef Pitch", desc: "Sample menu pairing guide, FSSAI hygiene compliance, wholesale pricing models, and weekly subscription logistics." }
      ],
      deliverables: ["Commercial Farm Financial Model & Unit Economics Excel", "FSSAI & Global Food Safety Compliance Protocol", "Restaurant Tasting Kit Sample Pitch Deck"]
    }
  }
];

export const TrainingAcademy = ({ activeTheme }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [selectedModule, setSelectedModule] = useState(null);

  const handleOpenSyllabus = (module) => {
    setSelectedModule(module);
  };

  const handleCloseSyllabus = () => {
    setSelectedModule(null);
  };

  const handleDirectEnrollWhatsApp = (moduleTitle) => {
    const text = encodeURIComponent(
      `Hello Rachna Sharma & Krishi Kutir Team! I am interested in enrolling in the Professional Microgreens Training Masterclass:\n` +
      `• Module Focus: ${moduleTitle || 'Full 4-Week Commercial Agriculture Masterclass'}\n` +
      `• Location: Bhopal / Online\n` +
      `Please share the upcoming batch dates, fee structure, and syllabus details.`
    );
    window.open(`https://wa.me/919009911030?text=${text}`, '_blank');
  };

  return (
    <section 
      ref={sectionRef}
      id="training-academy" 
      className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#fafcf9]/85 text-neutral-900 font-sans relative overflow-hidden select-none border-t border-b border-neutral-200/70"
    >
      {/* Background Colorful Botanicals & Fruit Accents with Parallax - RESTORED FULL VIBRANCY */}
      <BotanicalSectionBackdrop variant="training" scrollYProgress={scrollYProgress} />

      {/* Top Left Leaf Silhouette Watermark */}
      <div className="absolute top-4 left-4 sm:left-10 pointer-events-none opacity-[0.14] text-emerald-800 z-0">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>

      {/* Top Right Subtle Botanical Watermark */}
      <div className="absolute top-6 right-6 sm:right-12 pointer-events-none opacity-[0.12] text-amber-700 z-0">
        <svg width="110" height="110" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center space-y-4 mb-8 sm:mb-10">
          
          {/* Academy Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fef9ee] text-[#b45309] border border-[#fde68a] rounded-full text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-2xs">
            <GraduationCap className="w-3.5 h-3.5 text-[#d97706]" />
            <span>KRISHI KUTIR GROW ACADEMY</span>
          </div>

          {/* Masterclass Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black uppercase tracking-tight text-[#064e3b] leading-[1.08]">
            PROFESSIONAL MICROGREENS<br className="hidden sm:inline" /> TRAINING MASTERCLASS
          </h1>

          {/* Subtitle Description */}
          <p className="text-neutral-600 max-w-3xl mx-auto text-sm sm:text-[15px] leading-relaxed font-normal">
            We provide deep vertical farm setup consultation and step-by-step masterclasses for home growers and international commercial farms. Learn standard protocols directly from founder <span className="font-bold text-[#064e3b] underline decoration-[#064e3b]/30 underline-offset-2">Rachna Sharma</span>.
          </p>

          {/* 3 Pill Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            <div className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200/90 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Commercial SOPs Included</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200/90 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>1-on-1 Rack Optimization</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200/90 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
              <span>Global Certification</span>
            </div>
          </div>

        </div>

        {/* ================= CURRICULUM SECTION HEADER BAR ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 pb-4 border-b border-neutral-200/60 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#064e3b] text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase text-neutral-900 tracking-tight leading-none">
                TRAINING CURRICULUM & MODULES
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-mono tracking-wide mt-1">
                Standardized Commercial Agriculture Protocol (V4.2)
              </p>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-300 bg-emerald-50/70 text-emerald-800 text-[11px] font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>4 WEEKS INTENSIVE MASTERCLASS</span>
            </div>
          </div>
        </div>

        {/* ================= 4 MASTERCLASS MODULE CARDS (2x2 Grid) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODULES_DATA.map((item, idx) => (
            <motion.div
              key={item.week}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ 
                duration: 0.5, 
                delay: idx * 0.1, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className={`group relative bg-white rounded-2xl sm:rounded-3xl border ${item.borderColor} p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden`}
            >
              {/* Soft ambient gradient glow radiating from top edge */}
              <div className={`absolute top-0 inset-x-0 h-28 bg-gradient-to-b ${item.topGlow} pointer-events-none`} />

              <div>
                {/* Top Bar: Week Badge, Title, Lab Hours, and Right Sprout Icon */}
                <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.badgeBg} text-white font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                      {item.week}
                    </div>
                    <div>
                      <span className={`block text-xs font-black uppercase tracking-wider ${item.phaseColor}`}>
                        {item.phase}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{item.hours}</span>
                      </span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <Sprout className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Module Title */}
                <h4 className="font-black text-neutral-900 text-base sm:text-[17px] uppercase tracking-tight leading-snug mb-2.5 relative z-10">
                  {item.title}
                </h4>

                {/* Module Description */}
                <p className="text-xs sm:text-[13px] text-neutral-600 font-normal leading-relaxed mb-4 relative z-10">
                  {item.desc}
                </p>

                {/* Feature Tags / Checkmark Pills */}
                <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                  {item.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${item.pillBg}`}
                    >
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Divider */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between relative z-10 mt-auto">
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                  <span>{item.footerHighlight}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenSyllabus(item)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors group/btn hover:underline underline-offset-4"
                >
                  <span>View Syllabus Details</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* ================= BOTTOM FOOTER NOTICE ================= */}
        <div className="pt-10 pb-4 text-center text-xs text-neutral-400 border-t border-neutral-200/60 mt-12">
          © 2026 Krishi Kutir • The Leaf Lounge. All rights reserved. Masterclass design refactored for professional vertical agrotech standards.
        </div>

      </div>

      {/* ================= INTERACTIVE SYLLABUS DETAILS MODAL ================= */}
      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 p-6 sm:p-8 relative text-neutral-900"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseSyllabus}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${selectedModule.badgeBg} text-white font-mono font-black text-lg flex items-center justify-center shrink-0 shadow-sm`}>
                  {selectedModule.week}
                </div>
                <div>
                  <span className={`block text-xs font-black uppercase tracking-wider ${selectedModule.phaseColor}`}>
                    {selectedModule.phase} • {selectedModule.hours}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black uppercase text-neutral-900 tracking-tight">
                    {selectedModule.title}
                  </h3>
                </div>
              </div>

              <p className="text-neutral-600 text-sm leading-relaxed mb-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
                {selectedModule.syllabusDetails.overview}
              </p>

              {/* Day-by-Day Practical Modules */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Practical Laboratory Schedule
                </h4>
                {selectedModule.syllabusDetails.days.map((day, dIdx) => (
                  <div key={dIdx} className="p-3.5 rounded-xl border border-neutral-200/70 bg-white">
                    <h5 className="text-xs font-bold text-neutral-900 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      {day.title}
                    </h5>
                    <p className="text-xs text-neutral-500 leading-relaxed pl-4">
                      {day.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Deliverables Checklist */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Key SOPs & Masterclass Deliverables Included
                </h4>
                <div className="space-y-1.5">
                  {selectedModule.syllabusDetails.deliverables.map((del, delIdx) => (
                    <div key={delIdx} className="flex items-center gap-2 text-xs text-neutral-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleDirectEnrollWhatsApp(selectedModule.title)}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#064e3b] hover:bg-[#043327] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>Enroll In This Module via WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseSyllabus}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
