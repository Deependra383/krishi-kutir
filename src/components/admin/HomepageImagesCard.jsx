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
  Eye, 
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { uploadProductImage, isSupabaseConfigured } from '../../supabase';

export const HomepageImagesCard = () => {
  const { homeImages, updateHomeImage, saveHomeImages, resetHomeImages, defaultHomeImages } = useHomepageContent();

  const [imagesState, setImagesState] = useState(() => ({
    microgreens: { ...(homeImages?.microgreens || {}) },
    botanicalPowders: { ...(homeImages?.botanicalPowders || {}) },
    spices: { ...(homeImages?.spices || {}) },
    verticalFarm: { ...(homeImages?.verticalFarm || {}) }
  }));

  const [uploadingKey, setUploadingKey] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showHowToGuide, setShowHowToGuide] = useState(false);

  // File input refs for the 4 images
  const fileInputRefs = {
    microgreens: useRef(null),
    botanicalPowders: useRef(null),
    spices: useRef(null),
    verticalFarm: useRef(null)
  };

  useEffect(() => {
    if (homeImages) {
      setImagesState({
        microgreens: { ...(homeImages.microgreens || {}) },
        botanicalPowders: { ...(homeImages.botanicalPowders || {}) },
        spices: { ...(homeImages.spices || {}) },
        verticalFarm: { ...(homeImages.verticalFarm || {}) }
      });
    }
  }, [homeImages]);

  const handleUrlChange = (key, newUrl) => {
    setImagesState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        url: newUrl
      }
    }));
  };

  const handleFileUpload = async (e, key) => {
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

    setUploadingKey(key);

    try {
      // 1. Try Supabase cloud upload first
      if (isSupabaseConfigured) {
        try {
          const res = await uploadProductImage(file);
          if (res?.url) {
            handleUrlChange(key, res.url);
            setSuccessMsg(`Image ${key} uploaded to cloud storage successfully!`);
            setTimeout(() => setSuccessMsg(''), 3000);
            setUploadingKey(null);
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
        handleUrlChange(key, dataUrl);
        setSuccessMsg(`Image for ${imagesState[key]?.title || key} loaded! Click "Save 4 Images" to apply.`);
        setTimeout(() => setSuccessMsg(''), 3000);
        setUploadingKey(null);
      };
      reader.onerror = () => {
        setErrorMsg('Failed to read image file');
        setUploadingKey(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMsg(err.message || 'Error processing file upload');
      setUploadingKey(null);
    }
  };

  const handleSaveAll = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    try {
      saveHomeImages(imagesState);
      setSuccessMsg('All 4 homepage images successfully updated live on the website!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg('Failed to save homepage images: ' + err.message);
    }
  };

  const handleResetSingle = (key) => {
    const defaultImg = defaultHomeImages[key];
    if (defaultImg) {
      setImagesState(prev => ({
        ...prev,
        [key]: { ...defaultImg }
      }));
      if (fileInputRefs[key]?.current) fileInputRefs[key].current.value = '';
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all 4 homepage showcase images to default 3D renders?')) {
      resetHomeImages();
      setImagesState({
        microgreens: { ...defaultHomeImages.microgreens },
        botanicalPowders: { ...defaultHomeImages.botanicalPowders },
        spices: { ...defaultHomeImages.spices },
        verticalFarm: { ...defaultHomeImages.verticalFarm }
      });
      Object.values(fileInputRefs).forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
      setSuccessMsg('Reset all 4 images to default 3D renders');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const imageCardsList = [
    {
      key: 'microgreens',
      number: '1',
      title: 'Living Microgreens Tray',
      subtitle: 'Living Harvest Division',
      heroUsage: 'Hero Slider Slide 1 & Product Division 1',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Used on the homepage hero banner for freshly harvested & living broccoli, radish, and pea shoot trays.'
    },
    {
      key: 'botanicalPowders',
      number: '2',
      title: 'Cryo-Dehydrated Fruit & Veg Powders',
      subtitle: 'Dehydrated Pure Plant Concentrates',
      heroUsage: 'Hero Slider Slide 4 & Product Division 2',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      description: 'Used on the homepage for freeze-dried/cryo vegetable powders, moringa, beetroot, and pure enzyme powders.'
    },
    {
      key: 'spices',
      number: '3',
      title: 'Herbal Spices & Natural Extracts',
      subtitle: 'Single-Origin Ayurvedic Spices',
      heroUsage: 'Hero Slider Slide 2 & Product Division 3',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'Used on the homepage for Lakadong turmeric (>7.5% curcumin), Ceylon cinnamon, and sun-dried spice lots.'
    },
    {
      key: 'verticalFarm',
      number: '4',
      title: 'Vertical Farm Hydroponic Facility',
      subtitle: 'B2B, Commercial & Grow Supplies',
      heroUsage: 'Hero Slider Slide 3 & Product Division 5',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      description: 'Used on the homepage for HoReCa commercial supply, hydroponic vertical farm racks, and nursery trays.'
    }
  ];

  return (
    <div id="homepage-images-settings-card" className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <Images className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-neutral-900 flex items-center gap-2">
              Homepage 4 Showcase Images
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Upload custom photography or banners for the 4 primary visual showcase sections on the storefront homepage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowHowToGuide(prev => !prev)}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>How to do that?</span>
            {showHowToGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset all 4 images to default 3D renders"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 4 Images</span>
          </button>
          
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save 4 Images</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step "How to do that" Guide Banner */}
      {showHowToGuide && (
        <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-2xl border border-emerald-200 text-neutral-800 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-900 font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Step-by-Step Guide: How to upload the 4 different images for your homepage</span>
          </div>
          <ol className="list-decimal list-inside text-xs space-y-1.5 text-neutral-700 leading-relaxed font-medium pl-1">
            <li>
              <strong>Choose the section:</strong> Each of the 4 cards below corresponds to one of the 4 featured sections on your homepage (Microgreens, Powders, Spices, and Vertical Farm).
            </li>
            <li>
              <strong>Upload your image:</strong> Click the green <strong>"Upload Image File"</strong> button to select any photo directly from your computer or phone (JPG, PNG, WebP up to 8MB).
            </li>
            <li>
              <strong>Or enter an image URL:</strong> If your image is hosted online (e.g. on Supabase, Unsplash, or CDN), simply paste the direct URL into the URL input box.
            </li>
            <li>
              <strong>Preview live:</strong> Check the rectangular preview card to verify how the image frames and looks.
            </li>
            <li>
              <strong>Save:</strong> Click the <strong>"Save 4 Images"</strong> button at the top or bottom. Your new images will immediately appear on the storefront home page without needing to redeploy!
            </li>
            <li>
              <strong>Reset anytime:</strong> If you ever want to revert back to the original 3D renders, simply click <strong>"Reset 4 Images"</strong> or click "Reset" on any individual card.
            </li>
          </ol>
        </div>
      )}

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

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imageCardsList.map((item) => {
          const currentImgObj = imagesState[item.key] || {};
          const isUploading = uploadingKey === item.key;
          const currentUrl = currentImgObj.url || '';

          return (
            <div 
              key={item.key} 
              className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-black flex items-center justify-center">
                      {item.number}
                    </span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      {item.title}
                    </h4>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleResetSingle(item.key)}
                    className="text-[11px] font-bold text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                    title="Reset this image to default 3D render"
                  >
                    Reset
                  </button>
                </div>

                {/* Where it appears badge */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                  <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.heroUsage}</span>
                </div>

                {/* Live Preview Image Box */}
                <div className="w-full h-44 rounded-xl overflow-hidden relative border border-neutral-300 bg-neutral-900 group shadow-inner">
                  <img
                    src={currentUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                      Image #{item.number}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Upload & Input Controls */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <input
                  type="file"
                  ref={fileInputRefs[item.key]}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, item.key)}
                  className="hidden"
                  id={`file-input-${item.key}`}
                />

                <label
                  htmlFor={`file-input-${item.key}`}
                  className="w-full py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs hover:border-emerald-500"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Uploading Image...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Image #{item.number}</span>
                    </>
                  )}
                </label>

                {/* Direct URL input */}
                <div className="relative">
                  <LinkIcon className="w-3 h-3 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    value={currentUrl.startsWith('data:') ? '(Uploaded file active)' : currentUrl}
                    onChange={(e) => handleUrlChange(item.key, e.target.value)}
                    placeholder="Or paste direct image URL..."
                    disabled={currentUrl.startsWith('data:')}
                    className="w-full pl-7 pr-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-[11px] font-mono text-neutral-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-500"
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Save Bar */}
      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Uploaded images are synchronized live with the Hero Carousel and Division Grid.</span>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save 4 Homepage Images</span>
        </button>
      </div>

    </div>
  );
};
