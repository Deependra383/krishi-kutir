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
  Tag, 
  FileText, 
  ShieldCheck,
  Plus,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { uploadProductImage, isSupabaseConfigured } from '../../supabase';

export const InfrastructureCustomizerCard = () => {
  const { 
    infrastructureCards, 
    saveInfrastructureCards, 
    resetInfrastructureCards, 
    addInfrastructureCard,
    deleteInfrastructureCard,
    defaultInfrastructureCards 
  } = useHomepageContent();

  const [cardsList, setCardsList] = useState(() => {
    return Array.isArray(infrastructureCards) && infrastructureCards.length > 0 
      ? infrastructureCards 
      : defaultInfrastructureCards;
  });

  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showGuide, setShowGuide] = useState(false);

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

  const handleAddNewCard = () => {
    const newIdx = cardsList.length + 1;
    const newCard = {
      id: `infra-${Date.now()}`,
      category: 'Facility & Logistics',
      title: `Facility Logistics & Cold Chain #${newIdx}`,
      desc: 'Active climate-monitored vertical farming with ISO-aligned sterile packing and rapid dispatch.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      badge: 'Certified Clean Lot'
    };

    setCardsList(prev => [...prev, newCard]);
    addInfrastructureCard(newCard);
    setSuccessMsg(`Added new Infrastructure & Partner Card #${newIdx}! You can now edit its photography and details.`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleDeleteCard = (index) => {
    if (cardsList.length <= 1) {
      setErrorMsg('You must maintain at least one card in this section.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    if (confirmDeleteIdx !== index) {
      setConfirmDeleteIdx(index);
      return;
    }

    setCardsList(prev => prev.filter((_, i) => i !== index));
    deleteInfrastructureCard(index);
    setConfirmDeleteIdx(null);
    setSuccessMsg(`Card #${index + 1} removed successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveAll = () => {
    saveInfrastructureCards(cardsList);
    setSuccessMsg(`All ${cardsList.length} Collaborate & Partner Section infrastructure cards updated and published live!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleResetToDefaults = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    resetInfrastructureCards();
    setCardsList(defaultInfrastructureCards);
    setConfirmReset(false);
    setSuccessMsg('Reset all infrastructure cards to original defaults.');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div id="infrastructure-customizer-card" className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Building2 className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-black tracking-widest text-emerald-700">Collaborate & Partner Section</span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900">
              Our Infrastructure & Supply Guarantee
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
              {cardsList.length} Cards Active
            </span>
          </div>
          <p className="text-neutral-500 text-xs max-w-2xl leading-relaxed">
            Customize the photography, division title, and supply guarantees in the "Collaborate & Partner" storefront section. You can add more cards as needed.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowGuide(prev => !prev)}
            className="p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Guide</span>
            {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={handleAddNewCard}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More Images</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            title="Reset cards to original defaults"
            className="p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-700/20 ml-auto sm:ml-0"
          >
            <Save className="w-4 h-4" />
            <span>Save All Cards</span>
          </button>
        </div>
      </div>

      {/* Guide */}
      {showGuide && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-neutral-700 space-y-1.5 animate-in fade-in">
          <p className="font-bold text-emerald-900">How to manage Collaborate & Partner Section Cards:</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Click <strong>"+ Add More Images"</strong> to append a new card to the infrastructure grid.</li>
            <li>Use <strong>"Upload File"</strong> or paste an image URL to replace any card photo.</li>
            <li>Update the Category, Title, and Description to showcase your facilities or certifications.</li>
            <li>Click <strong>"Save All Cards"</strong> to publish your changes live to the website.</li>
          </ul>
        </div>
      )}

      {/* Status Messages */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium animate-in fade-in duration-200">
          {errorMsg}
        </div>
      )}

      {/* Grid of the Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardsList.map((item, idx) => {
          const isUploading = uploadingIndex === idx;

          return (
            <div 
              key={item.id || idx}
              className="bg-neutral-50/80 hover:bg-neutral-50 rounded-2xl border border-neutral-200 p-5 space-y-4 flex flex-col transition-all group justify-between"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white text-emerald-800 border border-neutral-200 shadow-2xs">
                    Card #{idx + 1}
                  </span>

                  {cardsList.length > 1 && (
                    confirmDeleteIdx === idx ? (
                      <div className="flex items-center gap-1 animate-in fade-in">
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(idx)}
                          className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                        >
                          Confirm?
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteIdx(null)}
                          className="px-1.5 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-[11px] font-bold transition-all cursor-pointer"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteIdx(idx)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                        title={`Remove Card #${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </div>

                {/* Image Preview Box */}
                <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group-hover:border-emerald-500/50 transition-all shadow-xs">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || `Infrastructure Card ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 text-xs">
                      <Building2 className="w-6 h-6 mb-1 text-neutral-300" />
                      <span>No image set</span>
                    </div>
                  )}

                  {/* Light Image Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-neutral-900 border border-neutral-200 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                      Card #{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Edit Form Inputs */}
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      value={item.category || ''}
                      onChange={(e) => handleFieldChange(idx, 'category', e.target.value)}
                      placeholder="e.g. Farm Infrastructure"
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Sterile Controlled Vertical Racks"
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={item.desc || ''}
                      onChange={(e) => handleFieldChange(idx, 'desc', e.target.value)}
                      placeholder="e.g. Medical-grade airflow and zero-touch grow protocols."
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl text-neutral-800 outline-none focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Upload & Link Controls */}
              <div className="space-y-2 pt-3 border-t border-neutral-200">
                <input
                  type="file"
                  ref={el => fileInputRefs.current[idx] = el}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, idx)}
                  className="hidden"
                  id={`infra-file-${idx}`}
                />

                <label
                  htmlFor={`infra-file-${idx}`}
                  className="w-full py-2 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs hover:border-emerald-500"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Photo File</span>
                    </>
                  )}
                </label>

                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={item.image || ''}
                    onChange={(e) => handleFieldChange(idx, 'image', e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full pl-8 pr-2 py-1.5 text-[11px] bg-white border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleAddNewCard}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Another Infrastructure Card</span>
        </button>

        <button
          type="button"
          onClick={handleSaveAll}
          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save All {cardsList.length} Cards</span>
        </button>
      </div>

    </div>
  );
};
