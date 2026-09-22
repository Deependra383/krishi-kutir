import React, { useState, useRef, useEffect } from 'react';
import { 
  Images, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Save, 
  Sparkles, 
  Link as LinkIcon, 
  RefreshCw, 
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { uploadProductImage, isSupabaseConfigured } from '../../supabase';
import defaultBotanicalBanner from '../../assets/images/botanical_hero_banner.jpg';

export const HomepageImagesCard = () => {
  const { 
    heroSlides, 
    saveHeroSlides, 
    resetHeroSlides, 
    addHeroSlide, 
    deleteHeroSlide,
    homeImages, 
    updateHomeImage 
  } = useHomepageContent();

  const [slidesList, setSlidesList] = useState(() => {
    if (Array.isArray(heroSlides) && heroSlides.length > 0) {
      return heroSlides;
    }
    return [
      {
        id: 'slide-1',
        title: 'Skin Care & Botanical Wellness',
        heading: 'Bringing Out The Beauty In You',
        description: 'Nurtured with zero pesticides in our Bhopal vertical farm and botanical reserve. From antioxidant-rich living microgreens to pure sun-cured powders and restorative herbal wellness.',
        image: defaultBotanicalBanner,
        tag: 'Skin Care Product',
        badge: 'Slide 1 • Featured',
        target: '#full-catalogue-section'
      },
      {
        id: 'slide-2',
        title: 'Cryo-Dehydrated Fruit & Veg Powders',
        heading: 'Dehydrated Pure Plant Concentrates',
        description: 'Low-temperature cryo-milled powders preserving active natural vitamins.',
        image: homeImages?.botanicalPowders?.url || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
        tag: 'Botanical Powders',
        badge: 'Slide 2 • Featured',
        target: '#microgreens-section'
      },
      {
        id: 'slide-3',
        title: 'Herbal Spices & Natural Extracts',
        heading: 'Single-Origin Ayurvedic Spices',
        description: 'High-potency organic spices directly sourced from bio-diverse farms.',
        image: homeImages?.spices?.url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
        tag: 'Herbal Spices',
        badge: 'Slide 3 • Featured',
        target: '#microgreens-section'
      },
      {
        id: 'slide-4',
        title: 'Vertical Farm Hydroponic Facility',
        heading: 'B2B, Commercial & Grow Supplies',
        description: 'Sterile multi-tier vertical farming providing reliable institutional volume.',
        image: homeImages?.verticalFarm?.url || 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80',
        tag: 'Commercial Systems',
        badge: 'Slide 4 • Featured',
        target: '#microgreens-section'
      }
    ];
  });

  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showHowToGuide, setShowHowToGuide] = useState(false);

  const fileInputRefs = useRef([]);

  useEffect(() => {
    if (Array.isArray(heroSlides) && heroSlides.length > 0) {
      setSlidesList(heroSlides);
    }
  }, [heroSlides]);

  const handleFieldChange = (index, field, value) => {
    setSlidesList(prev => {
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
      // 1. Try Supabase cloud upload first
      if (isSupabaseConfigured) {
        try {
          const res = await uploadProductImage(file);
          if (res?.url) {
            handleFieldChange(index, 'image', res.url);
            setSuccessMsg(`Showcase Image #${index + 1} uploaded to cloud storage successfully!`);
            setTimeout(() => setSuccessMsg(''), 3000);
            setUploadingIndex(null);
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase upload fallback to dataURL:', sbErr);
        }
      }

      // 2. Local base64 dataURL fallback
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        handleFieldChange(index, 'image', dataUrl);
        setSuccessMsg(`Image #${index + 1} loaded! Click "Save Showcase Images" to publish.`);
        setTimeout(() => setSuccessMsg(''), 3000);
        setUploadingIndex(null);
      };
      reader.onerror = () => {
        setErrorMsg('Failed to read image file');
        setUploadingIndex(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMsg(err.message || 'Error processing file upload');
      setUploadingIndex(null);
    }
  };

  const handleAddNewImage = () => {
    const newIdx = slidesList.length + 1;
    const newSlide = {
      id: `slide-${Date.now()}`,
      title: `Showcase Harvest Lot #${newIdx}`,
      heading: `Living Hydroponic Harvest #${newIdx}`,
      description: 'Cultivated in our sterile climate-controlled Bhopal vertical farm without chemical synthetic pesticides.',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=1200&q=80',
      accent: 'Featured Living Batch',
      tag: 'Fresh Harvest',
      badge: `Showcase #${newIdx} • Live`,
      overlaySub: 'Leaf Lounge Facility',
      overlayCap: 'Bhopal Clean Grow',
      target: '#microgreens-section'
    };
    
    setSlidesList(prev => [...prev, newSlide]);
    addHeroSlide(newSlide);
    setSuccessMsg(`Added new Showcase Image #${newIdx}! You can now edit its photography and details.`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleDeleteImage = (index) => {
    if (slidesList.length <= 1) {
      setErrorMsg('You must maintain at least one showcase image for the storefront.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    if (confirmDeleteIdx !== index) {
      setConfirmDeleteIdx(index);
      return;
    }

    setSlidesList(prev => prev.filter((_, i) => i !== index));
    deleteHeroSlide(index);
    setConfirmDeleteIdx(null);
    setSuccessMsg(`Showcase Image #${index + 1} removed successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveAll = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    try {
      saveHeroSlides(slidesList);
      
      // Also sync first 4 to homeImages for backwards compatibility
      if (slidesList[0]?.image) updateHomeImage('microgreens', slidesList[0].image);
      if (slidesList[1]?.image) updateHomeImage('botanicalPowders', slidesList[1].image);
      if (slidesList[2]?.image) updateHomeImage('spices', slidesList[2].image);
      if (slidesList[3]?.image) updateHomeImage('verticalFarm', slidesList[3].image);

      setSuccessMsg(`All ${slidesList.length} homepage showcase images saved and published live!`);
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg('Failed to save showcase images: ' + err.message);
    }
  };

  const handleResetAll = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    resetHeroSlides();
    setConfirmReset(false);
    setSuccessMsg('Reset showcase images to defaults.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div id="homepage-images-settings-card" className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <Images className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black uppercase text-neutral-900 flex items-center gap-2">
                Homepage Showcase Images
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                {slidesList.length} Images Active
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Customize the primary visual showcase banners and slides displayed on the storefront homepage. Add as many images as you need.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowHowToGuide(prev => !prev)}
            className="px-3.5 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Guide</span>
            {showHowToGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleAddNewImage}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More Images</span>
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
          
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Images</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Guide Banner */}
      {showHowToGuide && (
        <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-neutral-800 space-y-2.5 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-900 font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Showcase Images Guide</span>
          </div>
          <ol className="list-decimal list-inside text-xs space-y-1.5 text-neutral-700 leading-relaxed font-medium pl-1">
            <li>Click <strong>"+ Add More Images"</strong> to add extra showcase cards beyond the initial set.</li>
            <li>Click <strong>"Upload Photo File"</strong> to choose a JPG, PNG, or WebP photo directly from your device.</li>
            <li>Or paste any public image URL into the URL input box for instant loading.</li>
            <li>Customize the image title, heading, and description to match the featured harvest.</li>
            <li>Click <strong>"Save All Images"</strong> to publish your additions live to the storefront immediately.</li>
          </ol>
        </div>
      )}

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-xs font-medium animate-in fade-in">
          {errorMsg}
        </div>
      )}

      {/* Dynamic Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slidesList.map((item, idx) => {
          const isUploading = uploadingIndex === idx;
          const currentUrl = item.image || '';

          return (
            <div 
              key={item.id || idx} 
              className="p-5 bg-neutral-50/80 hover:bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                
                {/* Top Card Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* LIGHT THEME IMAGE BADGE */}
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-900 text-xs font-black uppercase tracking-wider shadow-2xs">
                      Image #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-neutral-700 truncate max-w-[170px]">
                      {item.title || `Showcase Item ${idx + 1}`}
                    </span>
                  </div>
                  
                  {slidesList.length > 1 && (
                    confirmDeleteIdx === idx ? (
                      <div className="flex items-center gap-1 animate-in fade-in">
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
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
                        onClick={() => handleDeleteImage(idx)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                        title={`Remove Image #${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </div>

                {/* Light Theme Live Preview Image Box */}
                <div className="w-full h-44 rounded-xl overflow-hidden relative border border-neutral-200 bg-neutral-100 group shadow-xs">
                  {currentUrl ? (
                    <img
                      src={currentUrl}
                      alt={item.title || `Image ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 text-xs">
                      <Images className="w-6 h-6 mb-1 text-neutral-300" />
                      <span>No image set</span>
                    </div>
                  )}

                  {/* LIGHT THEME IMAGE 1 / IMAGE 2 BADGE */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-neutral-900 border border-neutral-200 shadow-xs text-[10px] font-black uppercase tracking-wider">
                      Image #{idx + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      Active Slide
                    </span>
                  </div>
                </div>

                {/* Image Details Editing */}
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                      Title & Label
                    </label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Living Microgreens Tray"
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                      Hero Heading
                    </label>
                    <input
                      type="text"
                      value={item.heading || ''}
                      onChange={(e) => handleFieldChange(idx, 'heading', e.target.value)}
                      placeholder="e.g. Freshly Harvested Living Trays"
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                      Summary Description
                    </label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                      placeholder="e.g. Delivered with intact roots for maximum enzyme potency."
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-700 font-normal outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>

              </div>

              {/* Upload & Direct URL Controls */}
              <div className="space-y-2 pt-3 border-t border-neutral-200">
                <input
                  type="file"
                  ref={el => fileInputRefs.current[idx] = el}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, idx)}
                  className="hidden"
                  id={`showcase-file-input-${idx}`}
                />

                <label
                  htmlFor={`showcase-file-input-${idx}`}
                  className="w-full py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs hover:border-emerald-500"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Processing Photo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Photo File (JPG / PNG)</span>
                    </>
                  )}
                </label>

                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={currentUrl}
                    onChange={(e) => handleFieldChange(idx, 'image', e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleAddNewImage}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Another Showcase Image</span>
        </button>

        <button
          type="button"
          onClick={handleSaveAll}
          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save All {slidesList.length} Showcase Images</span>
        </button>
      </div>

    </div>
  );
};
