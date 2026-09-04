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
  Play,
  Pause,
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
      setDraftConfig(prev => ({
        ...prev,
        mode: 'custom_image',
        customImageUrl: reader.result
      }));
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
    <div className="bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
              Store Logo & Brand Identity
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Customize the Krishi Kutir emblem, upload your custom logo, adjust swing physics, scale, and colors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset logo to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Logo Saved!' : 'Save Logo'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950 text-emerald-200 border border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Store Logo settings updated and live across navigation headers, footers, and dashboards!</span>
        </div>
      )}

      {/* ================= LIVE PREVIEW SHOWCASE ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            Live Storefront Logo Preview
          </label>
          <span className="text-[11px] text-neutral-500">Updates live as you adjust controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Light Theme Header Preview */}
          <div className="bg-[#fcfaf4] p-5 rounded-2xl border border-[#e8dfcf] shadow-sm flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 border-b border-[#ebdcc7] pb-1.5">
              <span>Light Storefront Header</span>
              <span className="text-emerald-700">Live Simulation</span>
            </div>
            <div className="py-2 flex items-center justify-start text-neutral-900">
              <AnimatedLogo previewConfig={draftConfig} />
            </div>
          </div>

          {/* Dark Theme / Admin Header Preview */}
          <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm flex flex-col justify-between min-h-[130px]">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 border-b border-neutral-800 pb-1.5">
              <span>Dark Header & Admin View</span>
              <span className="text-amber-400">Live Simulation</span>
            </div>
            <div className="py-2 flex items-center justify-start text-white">
              <AnimatedLogo previewConfig={draftConfig} />
            </div>
          </div>

        </div>
      </div>

      {/* Subtab Navigation for Controls */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-800 pb-3 pt-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('appearance')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'appearance' 
              ? 'bg-amber-400 text-neutral-950 font-black shadow-sm' 
              : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800'
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
              ? 'bg-amber-400 text-neutral-950 font-black shadow-sm' 
              : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800'
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
              ? 'bg-amber-400 text-neutral-950 font-black shadow-sm' 
              : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800'
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
              ? 'bg-amber-400 text-neutral-950 font-black shadow-sm' 
              : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800'
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
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Logo Render Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => handleUpdateDraft('mode', 'emblem')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  draftConfig.mode === 'emblem'
                    ? 'bg-neutral-900 border-amber-400 text-white shadow-md'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase text-amber-400">Signature Emblem</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[11px] leading-snug">
                  Original vector SVG botanical crest with rising sun, tea leaves, and tagline.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateDraft('mode', 'custom_image')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  draftConfig.mode === 'custom_image'
                    ? 'bg-neutral-900 border-amber-400 text-white shadow-md'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase text-amber-400">Custom Image</span>
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[11px] leading-snug">
                  Upload your brand logo file or paste an external PNG/SVG image URL.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateDraft('mode', 'minimal')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  draftConfig.mode === 'minimal'
                    ? 'bg-neutral-900 border-amber-400 text-white shadow-md'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase text-amber-400">Minimalist Sprout</span>
                  <Sprout className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[11px] leading-snug">
                  Modern clean geometric leaf badge with high-contrast framing.
                </p>
              </button>

            </div>
          </div>

          {/* Custom Image Upload & URL input (Visible for custom_image mode or optional) */}
          {draftConfig.mode === 'custom_image' && (
            <div className="p-4 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  Upload Custom Logo File or URL
                </span>
                {draftConfig.customImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveCustomImage}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Image
                  </button>
                )}
              </div>

              {uploadError && (
                <p className="text-xs text-red-400 bg-red-950/60 p-2.5 rounded-xl border border-red-900">
                  {uploadError}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* File Upload Box */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1.5">
                    Select Logo File (PNG, SVG, JPG, WebP)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 cursor-pointer bg-neutral-950 p-2 rounded-xl border border-neutral-800"
                  />
                </div>

                {/* Direct Image URL input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1.5">
                    Or Enter Direct Image URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={draftConfig.customImageUrl || ''}
                      onChange={(e) => handleUpdateDraft('customImageUrl', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 2: SIZE & SWING PHYSICS ================= */}
      {activeSubTab === 'animation' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Logo Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Navbar Logo Size
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">{draftConfig.size || 42} px</span>
            </div>
            <input
              type="range"
              min="28"
              max="68"
              step="2"
              value={draftConfig.size || 42}
              onChange={(e) => handleUpdateDraft('size', Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
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
                      ? 'bg-amber-400 text-neutral-950' 
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pendulum Swing Toggle */}
          <div className="p-4 bg-neutral-900/70 rounded-2xl border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 block">
                Pendulum Swing Animation
              </span>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Gentle organic pendulum loop pivoting smoothly from the top center.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleUpdateDraft('enableSwing', !draftConfig.enableSwing)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                draftConfig.enableSwing !== false
                  ? 'bg-emerald-500 text-neutral-950 shadow-md'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {draftConfig.enableSwing !== false ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Swing Enabled
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" /> Static / Paused
                </>
              )}
            </button>
          </div>

          {/* Swing Speed and Angle (when enabled) */}
          {draftConfig.enableSwing !== false && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Swing Duration / Speed
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-400">{draftConfig.swingSpeed || 3.5}s</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="6.0"
                  step="0.2"
                  value={draftConfig.swingSpeed || 3.5}
                  onChange={(e) => handleUpdateDraft('swingSpeed', Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>Energetic (1.5s)</span>
                  <span>Default (3.5s)</span>
                  <span>Gentle (6.0s)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Swing Angle / Amplitude
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-400">±{draftConfig.swingAngle || 10}°</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={draftConfig.swingAngle || 10}
                  onChange={(e) => handleUpdateDraft('swingAngle', Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>Subtle (±3°)</span>
                  <span>Standard (±10°)</span>
                  <span>Pronounced (±20°)</span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ================= TAB 3: BRAND TYPOGRAPHY ================= */}
      {activeSubTab === 'typography' && (
        <div className="space-y-4 animate-in fade-in">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Brand Main Name
              </label>
              <input
                type="text"
                value={draftConfig.brandName || ''}
                onChange={(e) => handleUpdateDraft('brandName', e.target.value)}
                placeholder="KRISHI KUTIR"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold uppercase text-white outline-none focus:ring-2 focus:ring-amber-400 tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Header Subtitle / Tagline
              </label>
              <input
                type="text"
                value={draftConfig.tagline || ''}
                onChange={(e) => handleUpdateDraft('tagline', e.target.value)}
                placeholder="The Leaf Lounge • Est. 2025"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Emblem Inner Tagline (Script text)
              </label>
              <input
                type="text"
                value={draftConfig.subTagline || ''}
                onChange={(e) => handleUpdateDraft('subTagline', e.target.value)}
                placeholder="~ The leaf lounge ~"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Font Family
              </label>
              <select
                value={draftConfig.fontFamily || 'Playfair Display'}
                onChange={(e) => handleUpdateDraft('fontFamily', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                <option value="Playfair Display">Playfair Display (Premium Editorial Serif)</option>
                <option value="Inter">Inter (Modern Clean Sans-Serif)</option>
              </select>
            </div>

          </div>

          <div className="p-4 bg-neutral-900/60 rounded-2xl border border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Display Brand Text Next to Logo Icon
            </span>
            <input
              type="checkbox"
              checked={draftConfig.showText !== false}
              onChange={(e) => handleUpdateDraft('showText', e.target.checked)}
              className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
            />
          </div>

        </div>
      )}

      {/* ================= TAB 4: EMBLEM COLORS ================= */}
      {activeSubTab === 'colors' && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* Quick Color Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Quick Theme Palettes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 text-left transition-all cursor-pointer flex flex-col gap-2 group"
                >
                  <span className="text-[11px] font-bold text-neutral-200 group-hover:text-amber-400">
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
            
            <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-300">
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
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-300">
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
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-300">
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
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-300">
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
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
              <label className="block text-[11px] font-bold uppercase text-neutral-300">
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
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Save Action Footer Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
        <span className="text-[11px] text-neutral-500">
          Changes persist to your browser session & live store header navigation.
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Changes Saved!' : 'Save Logo Configuration'}</span>
        </button>
      </div>

    </div>
  );
};
