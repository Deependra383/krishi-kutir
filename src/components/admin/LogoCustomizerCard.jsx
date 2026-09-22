import React, { useState, useRef } from 'react';
import { 
  Palette, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  RotateCcw, 
  Save, 
  Check, 
  Sparkles, 
  Eye, 
  Sliders, 
  Type, 
  Trash2,
  Layers,
  Sprout
} from 'lucide-react';
import { useLogo } from '../../context/LogoContext';
import { AnimatedLogo } from '../AnimatedLogo';

const COLOR_PRESETS = [
  {
    name: 'Signature Botanical',
    bgColor: '#fcfaf4',
    sunColor: '#f97316',
    sunGlowColor: '#facc15',
    leafColor: '#1b4332',
    textColor: '#e0542d',
    taglineColor: '#2d6a4f'
  },
  {
    name: 'Emerald Lush',
    bgColor: '#f0fdf4',
    sunColor: '#10b981',
    sunGlowColor: '#34d399',
    leafColor: '#064e3b',
    textColor: '#047857',
    taglineColor: '#065f46'
  },
  {
    name: 'Golden Sunrise',
    bgColor: '#fffbeb',
    sunColor: '#f59e0b',
    sunGlowColor: '#fbbf24',
    leafColor: '#292524',
    textColor: '#b45309',
    taglineColor: '#78350f'
  },
  {
    name: 'Earthy Terracotta',
    bgColor: '#fff7ed',
    sunColor: '#ea580c',
    sunGlowColor: '#fdba74',
    leafColor: '#3f2e27',
    textColor: '#9a3412',
    taglineColor: '#7c2d12'
  }
];

export const LogoCustomizerCard = () => {
  const { logoConfig, saveLogoConfig, resetLogoConfig, savedSuccess, defaultLogoConfig } = useLogo();
  
  // Local working copy for live preview before saving
  const [draftConfig, setDraftConfig] = useState(() => ({ ...logoConfig }));
  const [activeSubTab, setActiveSubTab] = useState('appearance'); // 'appearance' | 'animation' | 'colors' | 'typography'
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleUpdateDraft = (field, value) => {
    setDraftConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (preset) => {
    setDraftConfig(prev => ({
      ...prev,
      bgColor: preset.bgColor,
      sunColor: preset.sunColor,
      sunGlowColor: preset.sunGlowColor,
      leafColor: preset.leafColor,
      textColor: preset.textColor,
      taglineColor: preset.taglineColor
    }));
  };

  // Image Upload Handler
  const handleImageFileChange = (e) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setUploadError('Image size should be under 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const updated = {
        ...draftConfig,
        mode: 'custom_image',
        customImageUrl: reader.result
      };
      setDraftConfig(updated);
      saveLogoConfig(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomImage = () => {
    setDraftConfig(prev => ({
      ...prev,
      customImageUrl: '',
      mode: 'emblem'
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    saveLogoConfig(draftConfig);
  };

  const handleReset = () => {
    resetLogoConfig();
    setDraftConfig({ ...defaultLogoConfig });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-neutral-900 flex items-center gap-2">
              Store Logo & Brand Identity
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Customize the Krishi Kutir emblem, upload your custom logo, adjust swing physics, scale, and colors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset logo to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-700/20"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Logo Saved!' : 'Save Logo'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Store Logo settings updated and live across navigation headers, footers, and dashboards!</span>
        </div>
      )}

      {/* Live Preview Dual Surface Showcase */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            Live Real-Time Visualizer
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">
            {draftConfig.mode === 'custom_image' ? 'Custom Asset' : draftConfig.mode === 'minimal' ? 'Minimal Badge' : 'Botanical Crest'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Light Theme / Storefront Header Preview */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 border-b border-neutral-200 pb-1.5">
              <span>Light Header & Storefront View</span>
              <span className="text-emerald-700 font-bold">Live Simulation</span>
            </div>
            <div className="py-2 flex items-center justify-start text-neutral-900">
              <AnimatedLogo previewConfig={draftConfig} />
            </div>
          </div>

          {/* Neutral Background View */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 border-b border-neutral-200 pb-1.5">
              <span>Clean Surface View</span>
              <span className="text-emerald-700 font-bold">Live Simulation</span>
            </div>
            <div className="py-2 flex items-center justify-start text-neutral-900">
              <AnimatedLogo previewConfig={draftConfig} />
            </div>
          </div>

        </div>
      </div>

      {/* Subtab Navigation for Controls */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-200 pb-3 pt-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('appearance')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'appearance' 
              ? 'bg-emerald-600 text-white font-black shadow-xs' 
              : 'text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Style & Image
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('animation')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'animation' 
              ? 'bg-emerald-600 text-white font-black shadow-xs' 
              : 'text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Size & Swing Physics
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('typography')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'typography' 
              ? 'bg-emerald-600 text-white font-black shadow-xs' 
              : 'text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Brand Text
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('colors')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'colors' 
              ? 'bg-emerald-600 text-white font-black shadow-xs' 
              : 'text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Emblem Colors
        </button>
      </div>

      {/* ================= TAB 1: STYLE & CUSTOM IMAGE ================= */}
      {activeSubTab === 'appearance' && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* Logo Mode Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
              Logo Render Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => handleUpdateDraft('mode', 'emblem')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  draftConfig.mode === 'emblem'
                    ? 'bg-emerald-50 border-emerald-500 text-neutral-900 shadow-xs'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase text-emerald-800">Signature Emblem</span>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] leading-snug text-neutral-600">
                  Original vector SVG botanical crest with rising sun, tea leaves, and tagline.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateDraft('mode', 'custom_image')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  draftConfig.mode === 'custom_image'
                    ? 'bg-emerald-50 border-emerald-500 text-neutral-900 shadow-xs'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase text-emerald-800">Custom Image</span>
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] leading-snug text-neutral-600">
                  Upload your brand logo file or paste an external PNG/SVG image URL.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateDraft('mode', 'minimal')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  draftConfig.mode === 'minimal'
                    ? 'bg-emerald-50 border-emerald-500 text-neutral-900 shadow-xs'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase text-emerald-800">Minimalist Sprout</span>
                  <Sprout className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] leading-snug text-neutral-600">
                  Modern clean geometric leaf badge with high-contrast framing.
                </p>
              </button>

            </div>
          </div>

          {/* Custom Image Upload & URL input (Always visible and accessible) */}
          <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
            draftConfig.mode === 'custom_image'
              ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/30'
              : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  Upload Custom Logo Image
                </span>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Upload your brand logo file (PNG with transparency recommended) or provide an image link.
                </p>
              </div>
              {draftConfig.customImageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveCustomImage}
                  className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer font-bold px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Image
                </button>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {uploadError}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Upload Box */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1.5">
                  Select Logo File from Device (PNG, SVG, JPG, WebP)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-neutral-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer bg-white p-2 rounded-xl border border-neutral-200 shadow-2xs"
                />
              </div>

              {/* Direct Image URL input */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1.5">
                  Or Paste Direct Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={draftConfig.customImageUrl || ''}
                    onChange={(e) => {
                      const url = e.target.value;
                      handleUpdateDraft('customImageUrl', url);
                      if (url) {
                        handleUpdateDraft('mode', 'custom_image');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: SIZE & SWING PHYSICS ================= */}
      {activeSubTab === 'animation' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Logo Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Navbar Logo Size
              </label>
              <span className="text-xs font-mono font-bold text-emerald-700">{draftConfig.size || 42} px</span>
            </div>
            <input
              type="range"
              min="28"
              max="68"
              step="2"
              value={draftConfig.size || 42}
              onChange={(e) => handleUpdateDraft('size', Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex gap-2 pt-1">
              {[
                { label: 'Compact (36px)', val: 36 },
                { label: 'Balanced (42px)', val: 42 },
                { label: 'Medium (48px)', val: 48 },
                { label: 'Prominent (56px)', val: 56 }
              ].map(p => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => handleUpdateDraft('size', p.val)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    draftConfig.size === p.val 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pendulum Swing Toggle */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
                Pendulum Swing Animation
              </span>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Gentle organic pendulum loop pivoting smoothly from the top center.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleUpdateDraft('enableSwing', !draftConfig.enableSwing)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                draftConfig.enableSwing !== false
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {draftConfig.enableSwing !== false ? 'Enabled' : 'Disabled'}
            </button>
          </div>

        </div>
      )}

      {/* ================= TAB 3: BRAND TYPOGRAPHY ================= */}
      {activeSubTab === 'typography' && (
        <div className="space-y-4 animate-in fade-in">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Brand Main Name
              </label>
              <input
                type="text"
                value={draftConfig.brandName || ''}
                onChange={(e) => handleUpdateDraft('brandName', e.target.value)}
                placeholder="KRISHI KUTIR"
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs font-bold uppercase text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500 tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Header Subtitle / Tagline
              </label>
              <input
                type="text"
                value={draftConfig.tagline || ''}
                onChange={(e) => handleUpdateDraft('tagline', e.target.value)}
                placeholder="The Leaf Lounge • Est. 2025"
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Emblem Inner Tagline (Script text)
              </label>
              <input
                type="text"
                value={draftConfig.subTagline || ''}
                onChange={(e) => handleUpdateDraft('subTagline', e.target.value)}
                placeholder="~ The leaf lounge ~"
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Font Family
              </label>
              <select
                value={draftConfig.fontFamily || 'Playfair Display'}
                onChange={(e) => handleUpdateDraft('fontFamily', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Playfair Display">Playfair Display (Premium Editorial Serif)</option>
                <option value="Inter">Inter (Modern Clean Sans-Serif)</option>
              </select>
            </div>

          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Display Brand Text Next to Logo Icon
            </span>
            <input
              type="checkbox"
              checked={draftConfig.showText !== false}
              onChange={(e) => handleUpdateDraft('showText', e.target.checked)}
              className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

        </div>
      )}

      {/* ================= TAB 4: EMBLEM COLORS ================= */}
      {activeSubTab === 'colors' && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* Quick Color Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
              Quick Theme Palettes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 text-left transition-all cursor-pointer flex flex-col gap-2 group"
                >
                  <span className="text-[11px] font-bold text-neutral-800 group-hover:text-emerald-700">
                    {preset.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: preset.bgColor }} />
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.sunColor }} />
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.leafColor }} />
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.textColor }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-700">
                Plate Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftConfig.bgColor || '#fcfaf4'}
                  onChange={(e) => handleUpdateDraft('bgColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={draftConfig.bgColor || '#fcfaf4'}
                  onChange={(e) => handleUpdateDraft('bgColor', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900"
                />
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-700">
                Rising Sun Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftConfig.sunColor || '#f97316'}
                  onChange={(e) => handleUpdateDraft('sunColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={draftConfig.sunColor || '#f97316'}
                  onChange={(e) => handleUpdateDraft('sunColor', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900"
                />
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-700">
                Plant Leaves & Stem Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftConfig.leafColor || '#1b4332'}
                  onChange={(e) => handleUpdateDraft('leafColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={draftConfig.leafColor || '#1b4332'}
                  onChange={(e) => handleUpdateDraft('leafColor', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900"
                />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-700">
                Crest Center Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftConfig.textColor || '#e0542d'}
                  onChange={(e) => handleUpdateDraft('textColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={draftConfig.textColor || '#e0542d'}
                  onChange={(e) => handleUpdateDraft('textColor', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900"
                />
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-700">
                Script Tagline & Smile Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftConfig.taglineColor || '#2d6a4f'}
                  onChange={(e) => handleUpdateDraft('taglineColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={draftConfig.taglineColor || '#2d6a4f'}
                  onChange={(e) => handleUpdateDraft('taglineColor', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-900"
                />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Save Action Footer Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <span className="text-[11px] text-neutral-500">
          Changes persist to your browser session & live store header navigation.
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Changes Saved!' : 'Save Logo Configuration'}</span>
        </button>
      </div>

    </div>
  );
};
