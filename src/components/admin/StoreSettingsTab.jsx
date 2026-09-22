import React, { useState } from 'react';
import { User, Images, Sparkles } from 'lucide-react';
import { LogoCustomizerCard } from './LogoCustomizerCard';
import { FoundersCustomizerCard } from './FoundersCustomizerCard';
import { HomepageImagesCard } from './HomepageImagesCard';

export const StoreSettingsTab = () => {
  // Sub-navigation filter
  const [settingsFilter, setSettingsFilter] = useState('all'); // 'all' | 'home-images' | 'founders' | 'logo'

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
          onClick={() => setSettingsFilter('home-images')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            settingsFilter === 'home-images'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Images className="w-3.5 h-3.5" />
          <span>Home Bar Images & Slides</span>
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
      </div>

      {/* 1. Homepage Showcase Images & Slides Customizer */}
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

    </div>
  );
};
