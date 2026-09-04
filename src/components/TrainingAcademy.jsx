import React, { useState } from 'react';
import { GraduationCap, Calendar, CheckCircle } from 'lucide-react';

export const TrainingAcademy = ({ activeTheme }) => {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <section id="training-academy" className="py-20 px-6 transition-colors duration-500" style={{ backgroundColor: `${activeTheme.accentColor}0a` }}>
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-sans">Krishi Kutir Grow Academy</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase">Professional Microgreens Training</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-sm leading-relaxed font-light">
            We provide deep vertical farm setup consultation and step-by-step masterclasses for home growers and international commercial farms. Learn standard protocols directly from founder Rachna Sharma.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Academy Course Syllabus Grid */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-black uppercase text-neutral-900 font-sans">Training Curriculum</h3>
            
            <div className="space-y-4 font-sans">
              {[
                { week: "01", title: "Micro-Seeds Selection & EC Substrate Physics", desc: "Understanding non-GMO seed viability, coco-peat moisture absorption capacity, and low EC salt profiles." },
                { week: "02", title: "Sowing Densities & Dark Blackout Phase", desc: "Calculating precise seed grams per tray, humidity control, and locking tray stacks for perfect root anchoring." },
                { week: "03", title: "Tricolour Light Spectrums & Fans Airflow", desc: "Optimizing wavelength ratios (blue/red) to maximize chlorophyll development and prevent mold formation." },
                { week: "04", title: "Commercial Harvesting, Safe Packaging & Exporting", desc: "Cutting standards at first true leaves, natural refrigeration, eco-cornstarch storage, and B2B custom clearing." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
                  <span className="text-2xl font-black text-emerald-600 font-mono">{item.week}</span>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm uppercase">{item.title}</h4>
                    <p className="text-xs text-neutral-500 font-light mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Training Cohort Registration Widget */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-100 shadow-xl p-8 space-y-6">
            
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-black uppercase text-neutral-900 font-sans">Join Next Cohort</h3>
            </div>

            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Unlock instant access to certified learning materials, seed sowing spreadsheets, and a 2-week live virtual coaching curriculum with 1-on-1 support.
            </p>

            <hr className="border-neutral-100" />

            {isRegistered ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 font-sans animate-fade-in">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-neutral-900">Enrolled Successfully!</h4>
                <p className="text-xs text-neutral-600">
                  A verification email has been triggered to your address. We've sent the Zoom links, curriculum guide, and spreadsheet attachments. See you in the Leaf Lounge!
                </p>
                <button
                  onClick={() => setIsRegistered(false)}
                  className="text-xs font-bold text-emerald-600 hover:underline block mx-auto pt-2"
                >
                  Register another seat
                </button>
              </div>
            ) : (
              <div className="space-y-3 font-sans">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">Next Live Cohort:</span>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-neutral-800">July 15, 2026 • 2 Weeks Virtual Cohort</p>
                    <p className="text-[10px] text-neutral-500">Live Q&A, Video Access, PDF Handbook</p>
                  </div>
                </div>
                <button 
                  id="enroll-cohort-btn"
                  onClick={() => setIsRegistered(true)}
                  className={`w-full py-3.5 text-xs font-extrabold uppercase tracking-widest rounded-full transition-all duration-300 ${activeTheme.buttonClass}`}
                >
                  Request Registration (Free)
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
