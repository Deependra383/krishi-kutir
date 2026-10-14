import React, { createContext, useContext, useState } from 'react';
import { useSyncedSetting } from './useSyncedSetting';

const DEFAULT_LOGO_CONFIG = {
  mode: 'emblem', // 'emblem' | 'custom_image' | 'minimal'
  customImageUrl: '',
  brandName: 'KRISHI KUTIR',
  tagline: 'The Leaf Lounge • Est. 2025',
  subTagline: '~ The leaf lounge ~',
  showText: true,
  size: 42,
  enableSwing: true,
  swingSpeed: 3.5, // seconds
  swingAngle: 10,  // degrees
  bgColor: '#fcfaf4',
  sunColor: '#f97316',
  sunGlowColor: '#facc15',
  leafColor: '#1b4332',
  textColor: '#2d6a4f', // Same green as in navbar
  taglineColor: '#800000', // Maroon
  fontFamily: 'Playfair Display' // 'Playfair Display' | 'Inter' | 'Caveat'
};

const normalizeLogo = (v) => ({ ...DEFAULT_LOGO_CONFIG, ...(v || {}) });

const LogoContext = createContext(null);

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (!context) {
    return {
      logoConfig: DEFAULT_LOGO_CONFIG,
      updateLogoConfig: () => {},
      resetLogoConfig: () => {},
      saveLogoConfig: () => {}
    };
  }
  return context;
};

export const LogoProvider = ({ children }) => {
  // Stored in Supabase `site_settings` (key: logo_config), shared by every device
  const logo = useSyncedSetting({
    key: 'logo_config',
    cacheKey: 'krishi_logo_config',
    defaults: DEFAULT_LOGO_CONFIG,
    normalize: normalizeLogo
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const flashSaved = (ok) => {
    if (!ok) return;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Update specific fields (saved automatically a moment later)
  const updateLogoConfig = (newFields) => {
    logo.setValue(prev => ({ ...prev, ...newFields }));
  };

  // Commit full config and save straight away
  const saveLogoConfig = (fullConfig) => {
    logo.setValue(normalizeLogo(fullConfig), { immediate: true }).then(flashSaved);
  };

  // Reset to the original default logo for everyone
  const resetLogoConfig = () => {
    logo.reset().then(flashSaved);
  };

  return (
    <LogoContext.Provider value={{
      logoConfig: logo.value,
      updateLogoConfig,
      saveLogoConfig,
      resetLogoConfig,
      savedSuccess,
      logoError: logo.error,
      defaultLogoConfig: DEFAULT_LOGO_CONFIG
    }}>
      {children}
    </LogoContext.Provider>
  );
};