import React, { useState } from 'react';
import { Save, CheckCircle2, QrCode, User, Images, Sparkles, Sliders, Truck } from 'lucide-react';
import { LogoCustomizerCard } from './LogoCustomizerCard';
import { FoundersCustomizerCard } from './FoundersCustomizerCard';
import { HomepageImagesCard } from './HomepageImagesCard';
import { CourierSettingsCard } from './CourierSettingsCard';
import { getMerchantUpiId, getMerchantName, generateUpiQrUrl } from '../../utils/upi';

export const StoreSettingsTab = () => {
  // Direct UPI Settings State
  const [merchantUpi, setMerchantUpi] = useState(() => getMerchantUpiId());
  const [merchantBusinessName, setMerchantBusinessName] = useState(() => getMerchantName());
  const [upiSaved, setUpiSaved] = useState(false);

  // Sub-navigation filter
  const [settingsFilter, setSettingsFilter] = useState('all'); // 'all' | 'courier' | 'home-images' | 'founders' | 'logo' | 'payments'

  const handleSaveUpiConfig = (e) => {
    e.preventDefault();
    const cleanUpi = merchantUpi.trim();
    const cleanName = merchantBusinessName.trim() || 'Krishi Kutir';

    if (cleanUpi) {
      localStorage.setItem('krishi_merchant_upi', cleanUpi);
    } else {
      localStorage.removeItem('krishi_merchant_upi');
    }

    localStorage.setItem('krishi_merchant_name', cleanName);
    setUpiSaved(true);
    setTimeout(() => setUpiSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Sub-Navigation Quick Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSettingsFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            settingsFilter === 'all'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          All Settings
        </button>

        <button
          type="button"
          onClick={() => setSettingsFilter('courier')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            settingsFilter === 'courier'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Courier & Delivery Charges</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsFilter('home-images')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            settingsFilter === 'home-images'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Images className="w-3.5 h-3.5" />
          <span>Homepage 4 Images</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsFilter('founders')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            settingsFilter === 'founders'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Founders & Leadership</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsFilter('logo')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            settingsFilter === 'logo'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Brand Logo</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsFilter('payments')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            settingsFilter === 'payments'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>UPI Payments</span>
        </button>
      </div>

      {/* 0. Courier & Location-Based Delivery Charges Customizer */}
      {(settingsFilter === 'all' || settingsFilter === 'courier') && (
        <CourierSettingsCard />
      )}

      {/* 1. Homepage 4 Showcase Images Customizer */}
      {(settingsFilter === 'all' || settingsFilter === 'home-images') && (
        <HomepageImagesCard />
      )}

      {/* 2. Founders & Leadership Customizer (Founder & Master Grower + Chief Administrator) */}
      {(settingsFilter === 'all' || settingsFilter === 'founders') && (
        <FoundersCustomizerCard />
      )}

      {/* 3. Brand Logo & Visual Identity Customizer */}
      {(settingsFilter === 'all' || settingsFilter === 'logo') && (
        <LogoCustomizerCard />
      )}

      {/* 4. Direct UPI & Dynamic QR Code Payment Configuration */}
      {(settingsFilter === 'all' || settingsFilter === 'payments') && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black uppercase text-neutral-900">Direct UPI & Dynamic QR Payments</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    0% Fee • Instant Settlement
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Collect money directly to your Bank / GPay / PhonePe / Paytm UPI ID without third-party fees.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveUpiConfig} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-4">
              {upiSaved && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>UPI merchant credentials saved successfully!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Your Merchant UPI ID / VPA *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. yourname@okaxis, 9876543210@paytm, business@ybl"
                  value={merchantUpi}
                  onChange={(e) => setMerchantUpi(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-900 outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="text-[11px] text-neutral-500 mt-1.5 block">
                  Any UPI ID from Google Pay, PhonePe, Paytm, BHIM, or your bank account.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Merchant / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Krishi Kutir - The Leaf Lounge"
                  value={merchantBusinessName}
                  onChange={(e) => setMerchantBusinessName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="text-[11px] text-neutral-500 mt-1.5 block">
                  This name appears on the payer's UPI confirmation screen.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Merchant UPI Configuration</span>
                </button>
              </div>
            </div>

            {/* Live QR Code Preview Card */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-center space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                Sample Dynamic QR Preview
              </span>
              <div className="bg-white p-2.5 rounded-xl inline-block shadow-sm border border-neutral-200">
                <img
                  src={generateUpiQrUrl({
                    upiId: merchantUpi || 'krishikutir@okaxis',
                    merchantName: merchantBusinessName || 'Krishi Kutir',
                    amountInRupees: 450,
                    orderId: 'SAMPLE-101',
                    size: 140
                  })}
                  alt="UPI Preview"
                  className="w-32 h-32 mx-auto rounded-lg"
                />
              </div>
              <p className="text-[11px] text-neutral-600 font-mono">
                ₹450 &rarr; <span className="text-neutral-900 font-bold">{merchantUpi || 'krishikutir@okaxis'}</span>
              </p>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
