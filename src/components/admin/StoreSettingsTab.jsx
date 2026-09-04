import React, { useState } from 'react';
import { Save, CheckCircle2, ShieldCheck, Globe, Database, Copy, Check, ExternalLink, Zap, Palette, CreditCard, QrCode, Smartphone, Sparkles } from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured, SUPABASE_SQL_SCHEMA } from '../../supabase';
import { LogoCustomizerCard } from './LogoCustomizerCard';
import { getMerchantUpiId, getMerchantName, generateUpiQrUrl } from '../../utils/upi';

export const StoreSettingsTab = ({
  razorpayKey,
  setRazorpayKey,
  handleSaveRazorpayKey,
  settingsSaved
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('krishi_supabase_url') || SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('krishi_supabase_anon_key') || SUPABASE_ANON_KEY || '');
  const [sbSaved, setSbSaved] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Direct UPI Settings State
  const [merchantUpi, setMerchantUpi] = useState(() => getMerchantUpiId());
  const [merchantBusinessName, setMerchantBusinessName] = useState(() => getMerchantName());
  const [upiSaved, setUpiSaved] = useState(false);

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

  const handleSaveSupabaseConfig = (e) => {
    e.preventDefault();
    let cleanedUrl = supabaseUrl.trim();
    if (cleanedUrl && !cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
      if (cleanedUrl.includes('.supabase.co')) {
        cleanedUrl = `https://${cleanedUrl}`;
      } else if (/^[a-z0-9-]+$/i.test(cleanedUrl)) {
        cleanedUrl = `https://${cleanedUrl}.supabase.co`;
      } else {
        cleanedUrl = `https://${cleanedUrl}`;
      }
    }
    if (!cleanedUrl) {
      localStorage.removeItem('krishi_supabase_url');
    } else {
      localStorage.setItem('krishi_supabase_url', cleanedUrl);
    }

    const cleanedKey = supabaseKey.trim();
    if (!cleanedKey) {
      localStorage.removeItem('krishi_supabase_anon_key');
    } else {
      localStorage.setItem('krishi_supabase_anon_key', cleanedKey);
    }

    setSbSaved(true);
    setTimeout(() => {
      setSbSaved(false);
      window.location.reload();
    }, 1200);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* 1. Brand Logo & Visual Identity Customizer */}
      <LogoCustomizerCard />

      {/* 2. Supabase Backend Integration Card */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black uppercase text-white">Supabase PostgreSQL Backend</h3>
                {isSupabaseConfigured ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Connected & Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800">
                    Fallback Active (Local/Firebase)
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Connect your Supabase project for enterprise PostgreSQL tables, real-time sync, and auth.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySchema}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          >
            {copiedSchema ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
            <span>{copiedSchema ? 'SQL Copied to Clipboard!' : 'Copy Supabase SQL Schema'}</span>
          </button>
        </div>

        {sbSaved && (
          <div className="p-3.5 bg-emerald-950 text-emerald-200 border border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Supabase credentials saved! Refreshing backend connection...
          </div>
        )}

        <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzproject.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-neutral-500">
              Can also be set in <code className="text-emerald-400 font-mono">.env.example</code> (<code className="text-neutral-400 font-mono">VITE_SUPABASE_URL</code> & <code className="text-neutral-400 font-mono">VITE_SUPABASE_ANON_KEY</code>).
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" /> Save Supabase Keys
            </button>
          </div>
        </form>

        {/* Quick Setup Guide */}
        <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/80 text-xs text-neutral-400 space-y-2">
          <div className="font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick 1-Minute Setup in Supabase Dashboard:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-neutral-400 pl-1">
            <li>Open your free Supabase project at <span className="text-emerald-400">app.supabase.com</span></li>
            <li>Click <strong>SQL Editor</strong> in the left sidebar</li>
            <li>Click <strong>Copy Supabase SQL Schema</strong> above, paste it into the editor, and click <strong>Run</strong></li>
            <li>Copy your Project URL & Anon Key from <strong>Settings &rarr; API</strong> and save them here!</li>
          </ol>
        </div>
      </div>

      {/* 3. Direct UPI & Dynamic QR Code Payment Configuration */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black uppercase text-white">Direct UPI & Dynamic QR Payments</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
                  0% Fee • Zero Verification Delay
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Collect money directly to your Bank / GPay / PhonePe / Paytm UPI ID without waiting for gateway KYC approval.
              </p>
            </div>
          </div>
        </div>

        {upiSaved && (
          <div className="p-3.5 bg-emerald-950 text-emerald-200 border border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Direct UPI ID saved successfully! Checkout QR codes will now route directly to your account.
          </div>
        )}

        <form onSubmit={handleSaveUpiConfig} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Your Merchant UPI ID / VPA *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. yourname@okaxis, 9876543210@paytm, business@ybl"
                value={merchantUpi}
                onChange={(e) => setMerchantUpi(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-neutral-500 mt-1.5 block">
                Any UPI ID from Google Pay, PhonePe, Paytm, BHIM, or your bank account.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Payee / Store Display Name
              </label>
              <input
                type="text"
                placeholder="Krishi Kutir"
                value={merchantBusinessName}
                onChange={(e) => setMerchantBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" /> Save Direct UPI
              </button>
            </div>
          </div>

          {/* Live QR Code Preview Card */}
          <div className="p-4 bg-neutral-900/90 rounded-xl border border-neutral-800 text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
              Sample Dynamic QR Preview
            </span>
            <div className="bg-white p-2.5 rounded-xl inline-block shadow-inner">
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
            <p className="text-[11px] text-neutral-400 font-mono">
              ₹450 &rarr; <span className="text-white font-bold">{merchantUpi || 'krishikutir@okaxis'}</span>
            </p>
          </div>
        </form>
      </div>

      {/* 4. Payment Gateway & Razorpay Settings Card */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black uppercase text-white">Razorpay Payment Gateway</h3>
                {razorpayKey?.startsWith('rzp_live_') ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Production
                  </span>
                ) : razorpayKey?.startsWith('rzp_test_') ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800">
                    Custom Test Key Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800">
                    Instant Sandbox Enabled
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Collect payments via UPI (GPay/PhonePe/Paytm), Debit/Credit Cards & NetBanking directly into your bank.
              </p>
            </div>
          </div>

          <a
            href="https://dashboard.razorpay.com/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <span>Razorpay Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </div>

        {settingsSaved && (
          <div className="p-3.5 bg-emerald-950 text-emerald-200 border border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Razorpay gateway settings saved and persisted successfully!
          </div>
        )}

        <form onSubmit={handleSaveRazorpayKey} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                Razorpay Key ID (Live / Test Key)
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRazorpayKey('rzp_test_1DP5mmOlF5G5ag')}
                  className="text-[11px] text-blue-400 hover:underline font-bold cursor-pointer"
                >
                  Use Sample Test Key
                </button>
                {razorpayKey && (
                  <button
                    type="button"
                    onClick={() => setRazorpayKey('')}
                    className="text-[11px] text-neutral-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              placeholder="e.g. rzp_live_xxxxxxxx or rzp_test_xxxxxxxx"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-neutral-500 mt-1.5 block">
              Generate your API Keys from <strong className="text-neutral-400">Razorpay Dashboard &rarr; Settings &rarr; API Keys</strong>.
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-neutral-500">
              Can also be provided via <code className="text-emerald-400 font-mono">VITE_RAZORPAY_KEY_ID</code> in environment.
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" /> Save Gateway Settings
            </button>
          </div>
        </form>

        {/* Global Shipping Rates Table */}
        <div className="pt-6 border-t border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-black uppercase text-white">International Phytosanitary Export Rates</h4>
          </div>
          <div className="bg-neutral-900/80 rounded-xl p-4 text-xs text-neutral-400 space-y-2 border border-neutral-800 font-mono">
            <div className="flex justify-between">
              <span>Domestic India (All States):</span>
              <span className="text-emerald-400 font-bold">Standard ₹80 (Free over ₹500)</span>
            </div>
            <div className="flex justify-between">
              <span>United States / North America (Air Express):</span>
              <span className="text-neutral-200 font-bold">$25 USD</span>
            </div>
            <div className="flex justify-between">
              <span>European Union / UK:</span>
              <span className="text-neutral-200 font-bold">€22 EUR</span>
            </div>
            <div className="flex justify-between">
              <span>Middle East (UAE / Saudi / Qatar):</span>
              <span className="text-neutral-200 font-bold">75 AED</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
