import React, { useState } from 'react';
import { Database, FolderKanban, CheckCircle2, Copy, AlertTriangle, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_URL } from '../../supabase';

export const StorageBucketsGuideCard = ({ isDarkMode = false }) => {
  const [copiedKey, setCopiedKey] = useState(null);

  const BUCKETS = [
    {
      id: 'products',
      name: 'products',
      title: 'Product Catalog Images',
      description: 'Used when adding/editing products in the Admin Catalog or bulk syncing.',
      folder: 'products/*',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'homepage',
      name: 'homepage',
      title: 'Homepage & Hero Slider',
      description: 'Used for homepage hero banners, 3D showcases, and top slider slides.',
      folder: 'homepage/*',
      color: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      id: 'workshops',
      name: 'workshops',
      title: 'Events & Workshops',
      description: 'Used for farm training sessions, masterclasses, and workshop cards.',
      folder: 'workshops/*',
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'founders',
      name: 'founders',
      title: 'Founders & Leadership',
      description: 'Used for Rachna Alok Sharma & Janvi Bhagchandani leadership portraits.',
      folder: 'founders/*',
      color: 'bg-rose-50 text-rose-800 border-rose-200'
    }
  ];

  const handleCopy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sqlQuickSetup = `-- Run this in Supabase Dashboard -> SQL Editor:
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('products', 'products', true),
  ('homepage', 'homepage', true),
  ('workshops', 'workshops', true),
  ('founders', 'founders', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Read All Krishi Buckets"
ON storage.objects FOR SELECT
USING (bucket_id IN ('products', 'homepage', 'workshops', 'founders'));

CREATE POLICY "Public Upload All Krishi Buckets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('products', 'homepage', 'workshops', 'founders'));`;

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
      isDarkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black uppercase tracking-tight">
              Supabase Storage Buckets
            </h3>
            <p className="text-xs text-neutral-500">
              High-efficiency cloud image storage for all Krishi Kutir photos and media
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSupabaseConfigured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Local Storage Mode
            </span>
          )}
        </div>
      </div>

      {/* 4 Dedicated Buckets Grid */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Dedicated Storage Buckets Setup
          </span>
          <span className="text-[11px] text-neutral-400">
            All buckets must be set to <strong>Public</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUCKETS.map((b) => (
            <div 
              key={b.id}
              className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-mono border ${b.color}`}>
                    bucket: {b.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(b.name, `bucket-${b.name}`)}
                    className="text-[10px] font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === `bucket-${b.name}` ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedKey === `bucket-${b.name}` ? 'Copied' : 'Copy Name'}</span>
                  </button>
                </div>
                <h4 className="text-sm font-bold text-neutral-900 pt-1">{b.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{b.description}</p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="font-mono">Storage path: {b.folder}</span>
                <span className="text-emerald-700 font-bold">Public CDN</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Step Easy Creation Guide */}
      <div className="mt-6 p-5 rounded-2xl bg-neutral-100 border border-neutral-200 space-y-3 text-xs">
        <h4 className="font-bold text-neutral-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>How to create these 4 buckets in 10 seconds:</span>
        </h4>
        <ol className="list-decimal list-inside space-y-1.5 text-neutral-700 leading-relaxed">
          <li>
            Open your <strong>Supabase Dashboard</strong> &rarr; Click <strong>Storage</strong> in the left sidebar.
          </li>
          <li>
            Click <strong>New Bucket</strong> &rarr; Name it <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-300 font-bold">products</code> &rarr; <strong>Toggle "Public bucket" to ON</strong> &rarr; Save.
          </li>
          <li>
            Repeat for <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-300 font-bold">homepage</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-300 font-bold">workshops</code>, and <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-300 font-bold">founders</code>.
          </li>
          <li>
            Or execute the 1-click SQL command below in your <strong>Supabase SQL Editor</strong> to auto-create all 4 buckets and access policies instantly:
          </li>
        </ol>

        <div className="relative mt-2">
          <pre className="p-3.5 bg-neutral-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-neutral-800">
            {sqlQuickSetup}
          </pre>
          <button
            type="button"
            onClick={() => handleCopy(sqlQuickSetup, 'sql-setup')}
            className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {copiedKey === 'sql-setup' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey === 'sql-setup' ? 'SQL Copied!' : 'Copy SQL Script'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
