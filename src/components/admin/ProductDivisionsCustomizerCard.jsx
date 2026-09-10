import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Save, 
  Link as LinkIcon, 
  RefreshCw, 
  Eye, 
  Leaf, 
  FileText, 
  Tag, 
  Award,
  Layers
} from 'lucide-react';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { uploadProductImage, isSupabaseConfigured } from '../../supabase';

export const ProductDivisionsCustomizerCard = () => {
  const { 
    divisionCards, 
    saveDivisionCards, 
    resetDivisionCards, 
    defaultDivisionCards 
  } = useHomepageContent();

  const [divisionsList, setDivisionsList] = useState(() => {
    return Array.isArray(divisionCards) && divisionCards.length > 0 
      ? divisionCards 
      : defaultDivisionCards;
  });

  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRefs = useRef([]);

  useEffect(() => {
    if (Array.isArray(divisionCards) && divisionCards.length > 0) {
      setDivisionsList(divisionCards);
    }
  }, [divisionCards]);

  const handleFieldChange = (index, field, value) => {
    setDivisionsList(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  const handleFileUpload = async (e, index) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image file size must be under 8MB.');
      return;
    }

    setUploadingIndex(index);

    try {
      // 1. Try Supabase cloud storage first
      if (isSupabaseConfigured) {
        try {
          const res = await uploadProductImage(file);
          if (res?.url) {
            handleFieldChange(index, 'image', res.url);
            setSuccessMsg(`Division Card #${index + 1} image uploaded to cloud storage successfully!`);
            setTimeout(() => setSuccessMsg(''), 3000);
            setUploadingIndex(null);
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase upload fallback to dataURL:', sbErr);
        }
      }

      // 2. Local Base64 DataURL fallback
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        handleFieldChange(index, 'image', dataUrl);
        setSuccessMsg(`Division Card #${index + 1} image processed locally! Click "Save All 5 Divisions" to publish.`);
        setTimeout(() => setSuccessMsg(''), 3000);
        setUploadingIndex(null);
      };
      reader.onerror = () => {
        setErrorMsg('Failed to read image file.');
        setUploadingIndex(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg('Upload error: ' + (err.message || 'Unknown error'));
      setUploadingIndex(null);
    }
  };

  const handleSaveAll = () => {
    saveDivisionCards(divisionsList);
    setSuccessMsg('All 5 Botanical & Superfood division cards updated and published live!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all 5 Botanical Ingredients & Living Superfood cards back to default images and descriptions?')) {
      resetDivisionCards();
      setDivisionsList(defaultDivisionCards);
      setSuccessMsg('Reset all division cards to original defaults.');
      setTimeout(() => setSuccessMsg(''), 3500);
    }
  };

  return (
    <div className="bg-neutral-950 rounded-3xl border border-neutral-800/80 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Top Accent Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400"></div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-black tracking-widest text-rose-400">Core Product Divisions</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            Pure Botanical Ingredients & Living Superfoods (5 Cards)
          </h3>
          <p className="text-neutral-400 text-xs max-w-2xl leading-relaxed">
            Upload custom photos and customize the title, subtitle, description, and tags for each of the 5 core divisions appearing under "Pure Botanical Ingredients & Living Superfoods".
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetToDefaults}
            title="Reset cards to original defaults"
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-rose-900/30 ml-auto sm:ml-0"
          >
            <Save className="w-4 h-4" />
            <span>Save All 5 Divisions</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-800 text-red-300 text-xs font-medium animate-in fade-in duration-200">
          {errorMsg}
        </div>
      )}

      {/* Grid of the 5 Divisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {divisionsList.map((item, idx) => {
          const isUploading = uploadingIndex === idx;

          return (
            <div 
              key={item.id || idx}
              className={`bg-neutral-900/70 rounded-2xl border border-neutral-800/90 p-5 space-y-4 flex flex-col hover:border-neutral-700 transition-all group justify-between ${
                idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    Division #{idx + 1}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    {item.badge || `Division ${idx + 1}`}
                  </span>
                </div>

                {/* Image Preview */}
                <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 group-hover:border-rose-500/40 transition-all">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || `Division ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Leaf className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  {/* Uploading Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-rose-400 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Uploading photo...</span>
                    </div>
                  )}

                  {/* Quick View Button */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={item.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-black/70 text-white hover:bg-neutral-900 transition-colors inline-flex"
                      title="View Full Resolution"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Upload Button & URL input */}
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => (fileInputRefs.current[idx] = el)}
                    onChange={(e) => handleFileUpload(e, idx)}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    disabled={isUploading}
                    className="w-full py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>

                  <div className="relative">
                    <LinkIcon className="w-3 h-3 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={item.image || ''}
                      onChange={(e) => handleFieldChange(idx, 'image', e.target.value)}
                      placeholder="Or paste image URL"
                      className="w-full pl-8 pr-2 py-1.5 text-[11px] bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                    />
                  </div>
                </div>

                {/* Text Fields: Subtitle, Title / Name, Description, Badge, Quality Tag */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                      <Tag className="w-3 h-3 text-emerald-400" />
                      Subtitle / Eyebrow
                    </label>
                    <input
                      type="text"
                      value={item.subtitle || ''}
                      onChange={(e) => handleFieldChange(idx, 'subtitle', e.target.value)}
                      placeholder="e.g. Living Superfoods with 40x Nutrient Density"
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                      <FileText className="w-3 h-3 text-rose-400" />
                      Division Name
                    </label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Living Microgreens & Trays"
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                      <FileText className="w-3 h-3 text-amber-400" />
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={item.description || ''}
                      onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                      placeholder="Enter division description..."
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 outline-none focus:ring-2 focus:ring-rose-500 font-normal leading-relaxed resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                        <Award className="w-3 h-3 text-cyan-400" />
                        Badge Pill
                      </label>
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={(e) => handleFieldChange(idx, 'badge', e.target.value)}
                        placeholder="e.g. 3D Living Harvest"
                        className="w-full px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-teal-400" />
                        Quality Tag
                      </label>
                      <input
                        type="text"
                        value={item.tag || ''}
                        onChange={(e) => handleFieldChange(idx, 'tag', e.target.value)}
                        placeholder="e.g. 0 Chemical Residue"
                        className="w-full px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Save Action Bar */}
      <div className="bg-neutral-900/50 rounded-2xl p-4 border border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Updates to these 5 cards appear immediately under "Pure Botanical Ingredients & Living Superfoods" on the homepage.</span>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-neutral-950 font-black uppercase tracking-wider rounded-xl text-xs transition-all cursor-pointer shrink-0 shadow-md"
        >
          Save All 5 Divisions
        </button>
      </div>

    </div>
  );
};
