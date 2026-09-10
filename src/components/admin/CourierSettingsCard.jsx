import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Save, RotateCcw, CheckCircle2, Info, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { getCourierSettings, saveCourierSettings, resetCourierSettings } from '../../utils/deliveryCharges';
import { useTheme } from '../../context/ThemeContext';

export const CourierSettingsCard = () => {
  const { isDarkMode } = useTheme();
  const [settings, setSettings] = useState(getCourierSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(getCourierSettings());
  }, []);

  const handleRateChange = (zoneKey, field, value) => {
    const num = Number(value);
    setSettings(prev => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zoneKey]: {
          ...prev.zones[zoneKey],
          [field]: isNaN(num) ? 0 : num
        }
      }
    }));
  };

  const handleTextChange = (zoneKey, field, value) => {
    setSettings(prev => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zoneKey]: {
          ...prev.zones[zoneKey],
          [field]: value
        }
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveCourierSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset courier delivery charges to standard default slabs (Bhopal ₹40, MP ₹70, Pan-India ₹110)?')) {
      const reset = resetCourierSettings();
      setSettings(reset);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
      isDarkMode 
        ? 'bg-neutral-950 border-neutral-800 text-white' 
        : 'bg-white border-neutral-200 text-neutral-900 shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-6 border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">Courier & Delivery Charges</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Automated location-based delivery pricing originating from Bhopal facility
            </p>
          </div>
        </div>

        {/* Origin Hub Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Dispatch Hub: <strong>Bhopal, MP (462036)</strong></span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl mb-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-300 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>How location-based courier charges are applied:</span>
        </div>
        <p className="text-[11px] leading-relaxed opacity-90">
          When customers place an order, the system identifies their delivery zone by their <strong>city name and pincode</strong>. If the parcel is from <strong>Bhopal to Bhopal</strong>, the local intra-city courier rate is charged. For other MP cities (Indore, Jabalpur, etc.), the regional rate is applied. For other states, Pan-India courier rates apply.
        </p>
      </div>

      {/* 4 Delivery Zones Grid */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Zone 1: Bhopal Local */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkMode 
              ? 'bg-neutral-900/60 border-emerald-800/40 hover:border-emerald-700' 
              : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h4 className="text-sm font-black uppercase text-emerald-800 dark:text-emerald-400">
                  Zone 1: Bhopal Intra-City
                </h4>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Local Dispatch
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-4">
              Applied when customer's city is <strong>Bhopal</strong> or PIN starts with <strong>462</strong>.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Delivery Charge (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.zones?.localBhopal?.rate ?? 40}
                    onChange={(e) => handleRateChange('localBhopal', 'rate', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Free Above (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.zones?.localBhopal?.freeThreshold ?? 499}
                    onChange={(e) => handleRateChange('localBhopal', 'freeThreshold', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Estimated Delivery Time
              </label>
              <input
                type="text"
                value={settings.zones?.localBhopal?.estimatedDelivery || 'Same Day / Within 24 Hours'}
                onChange={(e) => handleTextChange('localBhopal', 'estimatedDelivery', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Zone 2: MP Regional */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkMode 
              ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700' 
              : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <h4 className="text-sm font-black uppercase text-neutral-900 dark:text-white">
                  Zone 2: Madhya Pradesh
                </h4>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                Regional Courier
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-4">
              Indore, Jabalpur, Gwalior, Ujjain, etc. (MP PINs 45xxxx - 48xxxx, non-Bhopal).
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Delivery Charge (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.zones?.regionalMP?.rate ?? 70}
                    onChange={(e) => handleRateChange('regionalMP', 'rate', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Free Above (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.zones?.regionalMP?.freeThreshold ?? 999}
                    onChange={(e) => handleRateChange('regionalMP', 'freeThreshold', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Estimated Delivery Time
              </label>
              <input
                type="text"
                value={settings.zones?.regionalMP?.estimatedDelivery || '1 - 2 Business Days'}
                onChange={(e) => handleTextChange('regionalMP', 'estimatedDelivery', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Zone 3: Pan-India */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkMode 
              ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700' 
              : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <h4 className="text-sm font-black uppercase text-neutral-900 dark:text-white">
                  Zone 3: Pan-India (Rest of India)
                </h4>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                National Express
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-4">
              Delhi, Mumbai, Bengaluru, Pune, Hyderabad, UP, Rajasthan, etc.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Delivery Charge (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.zones?.panIndia?.rate ?? 110}
                    onChange={(e) => handleRateChange('panIndia', 'rate', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Free Above (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.zones?.panIndia?.freeThreshold ?? 1499}
                    onChange={(e) => handleRateChange('panIndia', 'freeThreshold', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Estimated Delivery Time
              </label>
              <input
                type="text"
                value={settings.zones?.panIndia?.estimatedDelivery || '3 - 5 Business Days'}
                onChange={(e) => handleTextChange('panIndia', 'estimatedDelivery', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Zone 4: Remote Regions */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkMode 
              ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700' 
              : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h4 className="text-sm font-black uppercase text-neutral-900 dark:text-white">
                  Zone 4: Special Remote Regions
                </h4>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Air Cargo / Speed Post
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-4">
              North-East (Assam, etc.), J&K, Ladakh, Andaman & Nicobar.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Delivery Charge (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.zones?.remoteRegion?.rate ?? 160}
                    onChange={(e) => handleRateChange('remoteRegion', 'rate', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Free Above (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.zones?.remoteRegion?.freeThreshold ?? 2499}
                    onChange={(e) => handleRateChange('remoteRegion', 'freeThreshold', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Estimated Delivery Time
              </label>
              <input
                type="text"
                value={settings.zones?.remoteRegion?.estimatedDelivery || '5 - 7 Business Days'}
                onChange={(e) => handleTextChange('remoteRegion', 'estimatedDelivery', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Courier charges saved & updated in store!</span>
              </span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Courier Charges</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
