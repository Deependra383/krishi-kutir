import React, { useState } from 'react';
import { GraduationCap, Send, CheckCircle2, PhoneCall, MessageCircle, Mail, BookOpen, Sun } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { supabase, isSupabaseConfigured } from '../../supabase';

export const MicrogreensTraining = () => {
  const [trainingForm, setTrainingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    experienceLevel: 'Beginner / Home Grower',
    trainingMode: 'Online Masterclass',
    message: ''
  });
  const [trainingSubmitting, setTrainingSubmitting] = useState(false);
  const [trainingSuccess, setTrainingSuccess] = useState(false);

  const handleTrainingSubmit = async (e) => {
    e.preventDefault();
    setTrainingSubmitting(true);
    try {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('training_inquiries').insert([{
            applicant_name: trainingForm.fullName,
            email: trainingForm.email,
            phone: trainingForm.phone,
            workshop_type: trainingForm.trainingMode,
            batch_preference: trainingForm.experienceLevel,
            questions: trainingForm.message,
            status: 'New Inquiry'
          }]);
        } catch (sbErr) {
          console.warn('Supabase training inquiry notice:', sbErr);
        }
      }

      if (db) {
        await addDoc(collection(db, 'training_inquiries'), {
          ...trainingForm,
          createdAt: serverTimestamp(),
          status: 'New Inquiry'
        });
      } else {
        const local = JSON.parse(localStorage.getItem('kk_training_inquiries') || '[]');
        local.push({ ...trainingForm, id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'New Inquiry' });
        localStorage.setItem('kk_training_inquiries', JSON.stringify(local));
      }
      setTrainingSuccess(true);
    } catch (err) {
      console.error('Error saving training inquiry:', err);
      const local = JSON.parse(localStorage.getItem('kk_training_inquiries') || '[]');
      local.push({ ...trainingForm, id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'New Inquiry' });
      localStorage.setItem('kk_training_inquiries', JSON.stringify(local));
      setTrainingSuccess(true);
    } finally {
      setTrainingSubmitting(false);
    }
  };

  return (
    <div id="training-academy" className="pt-4 select-none">
      <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/60 text-neutral-900 border border-emerald-200/90 shadow-xl relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          
          {/* Left: Program Overview */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Krishi Kutir Microgreens Academy</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-900">
              Learn Commercial & Kitchen Microgreen Farming
            </h3>
            
            <p className="text-neutral-600 text-sm font-normal leading-relaxed">
              Master step-by-step seed soaking, blackout incubation, high-aeration coir hydration, natural fungal prevention, harvest sanitization, and farm monetization.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                <BookOpen className="w-5 h-5 text-emerald-700 mb-1.5" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase">Complete SOP Manuals</h4>
                <p className="text-[10px] text-neutral-500 font-normal mt-0.5">Seed-to-harvest data charts</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                <Sun className="w-5 h-5 text-amber-600 mb-1.5" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase">1-on-1 Agronomist Guidance</h4>
                <p className="text-[10px] text-neutral-500 font-normal mt-0.5">Troubleshoot grow issues live</p>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-600 font-medium">
              <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                <span>+91 98765 43210</span>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp Academy</span>
              </a>
              <a href="mailto:training@krishikutir.com" className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>training@krishikutir.com</span>
              </a>
            </div>
          </div>

          {/* Right: Contact Inquiry Form */}
          <div className="bg-white border border-neutral-200/90 p-6 md:p-8 rounded-3xl shadow-xl">
            {trainingSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black uppercase text-neutral-900">Inquiry Received!</h4>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for your interest. Our master agronomist will contact you via WhatsApp or Email within 24 hours with syllabus and schedule details.
                </p>
                <button
                  onClick={() => setTrainingSuccess(false)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleTrainingSubmit} className="space-y-4">
                <div>
                  <h4 className="text-lg font-black uppercase text-neutral-900">Inquire for Next Batch</h4>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5">Fill in your details to receive syllabus & batch schedules.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={trainingForm.fullName}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={trainingForm.phone}
                        onChange={(e) => setTrainingForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={trainingForm.email}
                        onChange={(e) => setTrainingForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Experience Level</label>
                      <select
                        value={trainingForm.experienceLevel}
                        onChange={(e) => setTrainingForm(prev => ({ ...prev, experienceLevel: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                      >
                        <option value="Beginner / Home Grower">Beginner / Home Grower</option>
                        <option value="Commercial Startup Aspirant">Commercial Startup Aspirant</option>
                        <option value="Chef / Restaurant Professional">Chef / Restaurant Professional</option>
                        <option value="Commercial Urban Farmer">Commercial Urban Farmer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Preferred Mode</label>
                      <select
                        value={trainingForm.trainingMode}
                        onChange={(e) => setTrainingForm(prev => ({ ...prev, trainingMode: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                      >
                        <option value="Online Masterclass (Interactive)">Online Masterclass (Live)</option>
                        <option value="On-Farm Hands-on Workshop">On-Farm Hands-on Workshop</option>
                        <option value="Commercial Farm Setup Consulting">Commercial Setup Consulting</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1">Special Requirements (Optional)</label>
                    <textarea
                      rows={2}
                      value={trainingForm.message}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us about your growing space or goals..."
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={trainingSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-700/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{trainingSubmitting ? 'Submitting Inquiry...' : 'Submit Training Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
