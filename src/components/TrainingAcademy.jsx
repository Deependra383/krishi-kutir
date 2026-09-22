import React from 'react';
import { GraduationCap, BookOpen, Award, CheckCircle } from 'lucide-react';
import { BotanicalSectionBackdrop } from './common/BotanicalSectionBackdrop';

export const TrainingAcademy = ({ activeTheme }) => {
  return (
    <section 
      id="training-academy" 
      className="w-full py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative overflow-hidden" 
      style={{ backgroundColor: `${activeTheme.accentColor}0a` }}
    >
      {/* Background Colorful Botanicals & Fruit Accents */}
      <BotanicalSectionBackdrop variant="training" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-black uppercase tracking-widest">
            <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
            <span>Krishi Kutir Grow Academy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-900">
            Professional Microgreens Training
          </h2>
          <p className="text-neutral-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            We provide deep vertical farm setup consultation and step-by-step masterclasses for home growers and international commercial farms. Learn standard protocols directly from founder Rachna Sharma.
          </p>
        </div>

        {/* Full-width Academy Course Syllabus Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black uppercase text-neutral-900 font-sans flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Training Curriculum & Modules</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 font-mono uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              4 Weeks Masterclass
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
            {[
              { week: "01", title: "Micro-Seeds Selection & EC Substrate Physics", desc: "Understanding non-GMO seed viability, coco-peat moisture absorption capacity, and low EC salt profiles for rapid germination." },
              { week: "02", title: "Sowing Densities & Dark Blackout Phase", desc: "Calculating precise seed grams per tray, humidity control, and locking tray stacks for perfect root anchoring and stem elongation." },
              { week: "03", title: "Tricolour Light Spectrums & Fans Airflow", desc: "Optimizing wavelength ratios (blue/red) to maximize chlorophyll development, carotenoid synthesis, and mold prevention." },
              { week: "04", title: "Commercial Harvesting, Safe Packaging & Exporting", desc: "Cutting standards at first true leaves, natural refrigeration, eco-cornstarch storage, and B2B custom clearing standards." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-white/95 backdrop-blur-xs rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-xl font-black text-emerald-700 font-mono">{item.week}</span>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wide">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
