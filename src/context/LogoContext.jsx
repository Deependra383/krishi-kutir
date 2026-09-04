import React, { createContext, useContext, useState, useEffect } from 'react';

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
  textColor: '#e0542d',
  taglineColor: '#2d6a4f',
  fontFamily: 'Playfair Display' // 'Playfair Display' | 'Inter' | 'Caveat'
};

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
  const [logoConfig, setLogoConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krishi_logo_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_LOGO_CONFIG, ...parsed };
        }
      } catch (e) {
        console.warn('Error reading logo config from localStorage:', e);
      }
    }
    return DEFAULT_LOGO_CONFIG;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Helper to update specific fields in state
  const updateLogoConfig = (newFields) => {
    setLogoConfig(prev => {
      const updated = { ...prev, ...newFields };
      try {
        localStorage.setItem('krishi_logo_config', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error persisting logo config:', e);
      }
      return updated;
    });
  };

  // Helper to commit full state & persist
  const saveLogoConfig = (fullConfig) => {
    const toSave = { ...DEFAULT_LOGO_CONFIG, ...fullConfig };
    setLogoConfig(toSave);
    try {
      localStorage.setItem('krishi_logo_config', JSON.stringify(toSave));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.warn('Error saving logo config:', e);
    }
  };

  // Reset to original default logo
  const resetLogoConfig = () => {
    setLogoConfig(DEFAULT_LOGO_CONFIG);
    try {
      localStorage.removeItem('krishi_logo_config');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.warn('Error resetting logo config:', e);
    }
  };

  return (
    <LogoContext.Provider value={{
      logoConfig,
      updateLogoConfig,
      saveLogoConfig,
      resetLogoConfig,
      savedSuccess,
      defaultLogoConfig: DEFAULT_LOGO_CONFIG
    }}>
      {children}
    </LogoContext.Provider>
  );
};
