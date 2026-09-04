import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FloatingThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <button
        id="floating-theme-toggle-btn"
        type="button"
        onClick={toggleDarkMode}
        title={isDarkMode ? 'Switch to Day / Light Mode' : 'Switch to Night / Dark Mode'}
        aria-label="Toggle Night or Dark Mode"
        className={`group flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg border text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ${
          isDarkMode
            ? 'bg-neutral-900/90 hover:bg-neutral-800 text-amber-400 border-neutral-700 shadow-neutral-950/60'
            : 'bg-white/95 hover:bg-neutral-50 text-neutral-800 border-neutral-200/90 shadow-neutral-400/20'
        }`}
      >
        {isDarkMode ? (
          <>
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="text-[11px] font-black text-amber-300">Day Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-indigo-600 transition-transform group-hover:-rotate-12" />
            <span className="text-[11px] font-black text-neutral-800">Night Mode</span>
          </>
        )}
      </button>
    </div>
  );
};
