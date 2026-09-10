import React, { useState, useRef } from 'react';
import { User, Upload, RotateCcw, CheckCircle2, Save, Sparkles, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { uploadProductImage, isSupabaseConfigured } from '../../supabase';

export const FoundersCustomizerCard = () => {
  const { founders, updateFounder, saveFounders, resetFounders, defaultFounders } = useHomepageContent();

  const [formState, setFormState] = useState({
    founder1: { ...(founders?.founder1 || {}) },
    founder2: { ...(founders?.founder2 || {}) }
  });

  const [uploadingFounder1, setUploadingFounder1] = useState(false);
  const [uploadingFounder2, setUploadingFounder2] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const founder1InputRef = useRef(null);
  const founder2InputRef = useRef(null);

  // Sync state if context changes externally
  React.useEffect(() => {
    if (founders) {
      setFormState({
        founder1: { ...(founders.founder1 || {}) },
        founder2: { ...(founders.founder2 || {}) }
      });
    }
  }, [founders]);

  const handleChange = (founderKey, field, value) => {
    setFormState(prev => ({
      ...prev,
      [founderKey]: {
        ...prev[founderKey],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (e, founderKey) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size must be under 8MB.');
      return;
    }

    const setUploading = founderKey === 'founder1' ? setUploadingFounder1 : setUploadingFounder2;
    setUploading(true);

    try {
      // Try Supabase upload if available
      if (isSupabaseConfigured) {
        try {
          const res = await uploadProductImage(file);
          if (res?.url) {
            handleChange(founderKey, 'image', res.url);
            setSuccessMsg(`Image uploaded to Supabase storage successfully for ${founderKey === 'founder1' ? 'Founder 1' : 'Founder 2'}`);
            setTimeout(() => setSuccessMsg(''), 3000);
            setUploading(false);
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase upload fallback to dataURL:', sbErr);
        }
      }

      // FileReader fallback (immediate local base64)
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        handleChange(founderKey, 'image', dataUrl);
        setSuccessMsg(`Image loaded successfully for ${founderKey === 'founder1' ? 'Founder 1' : 'Founder 2'}`);
        setTimeout(() => setSuccessMsg(''), 3000);
        setUploading(false);
      };
      reader.onerror = () => {
        setErrorMsg('Failed to process image file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMsg(err.message || 'Error processing file');
      setUploading(false);
    }
  };

  const handleSave = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    try {
      saveFounders(formState);
      setSuccessMsg('Leadership & Founder profiles successfully updated live on website!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg('Failed to save profiles: ' + err.message);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset both founder names, roles, quotes, and photos to original default settings?')) {
      resetFounders();
      setFormState({
        founder1: { ...defaultFounders.founder1 },
        founder2: { ...defaultFounders.founder2 }
      });
      if (founder1InputRef.current) founder1InputRef.current.value = '';
      if (founder2InputRef.current) founder2InputRef.current.value = '';
      setSuccessMsg('Profiles reset to defaults');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div id="founders-settings-card" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-neutral-900 flex items-center gap-2">
              Founders & Leadership Profiles
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Customize the names, role titles, quotes, and profile photos displayed in the "Meet Our Founders" storefront section.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset to default founders profiles"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profiles</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Two Founders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ================= FOUNDER 1 (Founder & Master Grower) ================= */}
        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Profile 1 • Founder & Master Grower
            </span>
            <span className="text-[10px] font-mono text-neutral-400 font-bold">Slot: founder1</span>
          </div>

          {/* Live Preview Badge */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
            <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-neutral-100">
              <img
                src={formState.founder1.image}
                alt={formState.founder1.name || 'Founder'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-neutral-900 truncate">
                {formState.founder1.name || 'Name not set'}
              </h4>
              <p className="text-xs font-semibold text-emerald-700 truncate">
                {formState.founder1.role || 'Role not set'}
              </p>
              <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 italic">
                "{formState.founder1.quote}"
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formState.founder1.name}
                onChange={(e) => handleChange('founder1', 'name', e.target.value)}
                placeholder="e.g. Rachna Alok Sharma"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Designation / Role Title
              </label>
              <input
                type="text"
                value={formState.founder1.role}
                onChange={(e) => handleChange('founder1', 'role', e.target.value)}
                placeholder="e.g. Founder & Master Grower"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Mission Statement / Bio Quote
              </label>
              <textarea
                rows={2}
                value={formState.founder1.quote}
                onChange={(e) => handleChange('founder1', 'quote', e.target.value)}
                placeholder="Our mission is to bring nutrient-dense living microgreens..."
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Image Upload / URL Controls */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                Profile Photo
              </label>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={founder1InputRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'founder1')}
                  className="hidden"
                  id="founder1-file-input"
                />
                <label
                  htmlFor="founder1-file-input"
                  className="flex-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  {uploadingFounder1 ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Upload Photo File</span>
                    </>
                  )}
                </label>
              </div>

              {/* Direct Image URL input */}
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  value={formState.founder1.image.startsWith('data:') ? '(Uploaded image file active)' : formState.founder1.image}
                  onChange={(e) => handleChange('founder1', 'image', e.target.value)}
                  placeholder="Or paste public image URL..."
                  disabled={formState.founder1.image.startsWith('data:')}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono text-neutral-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOUNDER 2 (Chief Administrator) ================= */}
        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-700"></span>
              Profile 2 • Chief Administrator
            </span>
            <span className="text-[10px] font-mono text-neutral-400 font-bold">Slot: founder2</span>
          </div>

          {/* Live Preview Badge */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
            <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-neutral-100">
              <img
                src={formState.founder2.image}
                alt={formState.founder2.name || 'Chief Administrator'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-neutral-900 truncate">
                {formState.founder2.name || 'Name not set'}
              </h4>
              <p className="text-xs font-semibold text-neutral-700 truncate">
                {formState.founder2.role || 'Role not set'}
              </p>
              <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 italic">
                "{formState.founder2.quote}"
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formState.founder2.name}
                onChange={(e) => handleChange('founder2', 'name', e.target.value)}
                placeholder="e.g. Janvi Bhaghchandani"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Designation / Role Title
              </label>
              <input
                type="text"
                value={formState.founder2.role}
                onChange={(e) => handleChange('founder2', 'role', e.target.value)}
                placeholder="e.g. Chief Administrator"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Mission Statement / Bio Quote
              </label>
              <textarea
                rows={2}
                value={formState.founder2.quote}
                onChange={(e) => handleChange('founder2', 'quote', e.target.value)}
                placeholder="We ensure seamless cold-chain logistics, strict batch hygiene..."
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Image Upload / URL Controls */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                Profile Photo
              </label>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={founder2InputRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'founder2')}
                  className="hidden"
                  id="founder2-file-input"
                />
                <label
                  htmlFor="founder2-file-input"
                  className="flex-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  {uploadingFounder2 ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Upload Photo File</span>
                    </>
                  )}
                </label>
              </div>

              {/* Direct Image URL input */}
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  value={formState.founder2.image.startsWith('data:') ? '(Uploaded image file active)' : formState.founder2.image}
                  onChange={(e) => handleChange('founder2', 'image', e.target.value)}
                  placeholder="Or paste public image URL..."
                  disabled={formState.founder2.image.startsWith('data:')}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono text-neutral-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-500"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer hint */}
      <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Changes made here take effect immediately on the live storefront under the <strong>Meet Our Founders</strong> section.</span>
      </div>
    </div>
  );
};
