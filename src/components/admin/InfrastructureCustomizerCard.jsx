import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Save, 
  Sparkles, 
  Link as LinkIcon, 
  RefreshCw, 
  Eye, 
  Tag, 
  FileText, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { uploadProductImage, isSupabaseConfigured } from '../../supabase';

export const InfrastructureCustomizerCard = () => {
  const { 
    infrastructureCards, 
    saveInfrastructureCards, 
    resetInfrastructureCards, 
    defaultInfrastructureCards 
  } = useHomepageContent();

  const [cardsList, setCardsList] = useState(() => {
    return Array.isArray(infrastructureCards) && infrastructureCards.length > 0 
      ? infrastructureCards 
      : defaultInfrastructureCards;
  });

  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Refs for each card's file input
  const fileInputRefs = useRef([]);

  useEffect(() => {
    if (Array.isArray(infrastructureCards) && infrastructureCards.length > 0) {
      setCardsList(infrastructureCards);
    }
  }, [infrastructureCards]);

  const handleFieldChange = (index, field, value) => {
    setCardsList(prev => {
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
            setSuccessMsg(`Infrastructure Card #${index + 1} image uploaded to cloud storage successfully!`);
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
        setSuccessMsg(`Infrastructure Card #${index + 1} image processed locally! Click "Save All Cards" to publish.`);
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
    saveInfrastructureCards(cardsList);
    setSuccessMsg('All 4 Infrastructure & Supply Guarantee cards updated and published live!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all 4 Infrastructure & Supply Guarantee cards back to default photos and text?')) {
      resetInfrastructureCards();
      setCardsList(defaultInfrastructureCards);
      setSuccessMsg('Reset all 4 infrastructure cards to original defaults.');
      setTimeout(() => setSuccessMsg(''), 3500);
    }
  };

  return (
    <div className="bg-neutral-950 rounded-3xl border border-neutral-800/80 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Top Accent Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-black tracking-widest text-emerald-400">Collaborate & Partner Section</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            Our Infrastructure & Supply Guarantee (4 Cards)
          </h3>
          <p className="text-neutral-400 text-xs max-w-2xl leading-relaxed">
            Upload custom photos and edit the category, title, description, and guarantee badge for each of the 4 cards in "Our Infrastructure & Supply Guarantee".
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
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-900/30 ml-auto sm:ml-0"
          >
            <Save className="w-4 h-4" />
            <span>Save All 4 Cards</span>
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

      {/* Grid of the 4 Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardsList.map((item, idx) => {
          const isUploading = uploadingIndex === idx;

          return (
            <div 
              key={item.id || idx}
              className="bg-neutral-900/70 rounded-2xl border border-neutral-800/90 p-5 space-y-4 flex flex-col hover:border-neutral-700 transition-all group justify-between"
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Card #{idx + 1}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    {item.category || `Category ${idx + 1}`}
                  </span>
                </div>

                {/* Image Preview */}
                <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 group-hover:border-emerald-500/40 transition-all">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || `Infrastructure ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Building2 className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  {/* Uploading Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-emerald-400 gap-2">
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
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
                      className="w-full pl-8 pr-2 py-1.5 text-[11px] bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Text Fields: Category, Title, Description, Guarantee Badge */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                      <Tag className="w-3 h-3 text-emerald-400" />
                      Category / Subtitle
                    </label>
                    <input
                      type="text"
                      value={item.category || ''}
                      onChange={(e) => handleFieldChange(idx, 'category', e.target.value)}
                      placeholder="e.g. Farm Infrastructure, Culinary Partners..."
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                      <FileText className="w-3 h-3 text-cyan-400" />
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Controlled Vertical Racks"
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                      <FileText className="w-3 h-3 text-teal-400" />
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={item.desc || ''}
                      onChange={(e) => handleFieldChange(idx, 'desc', e.target.value)}
                      placeholder="Enter description of the infrastructure or service..."
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 outline-none focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      Supply Guarantee Badge
                    </label>
                    <input
                      type="text"
                      value={item.badge || ''}
                      onChange={(e) => handleFieldChange(idx, 'badge', e.target.value)}
                      placeholder="e.g. 100% Crop Continuity"
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
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
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Updates to these 4 cards appear immediately under "Our Infrastructure & Supply Guarantee" on the live storefront.</span>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black uppercase tracking-wider rounded-xl text-xs transition-all cursor-pointer shrink-0 shadow-md"
        >
          Save All 4 Cards
        </button>
      </div>

    </div>
  );
};
