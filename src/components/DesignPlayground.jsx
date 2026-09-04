import React from 'react';
import { THEMES } from '../data';

export const DesignPlayground = ({ activeTheme, setActiveTheme }) => {
  return (
    <div className="bg-neutral-900 text-white py-3 px-4 sticky top-0 z-50 shadow-md select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500 text-neutral-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-sm tracking-wider">Design Studio</span>
          <span className="text-xs text-neutral-300 font-medium">Click a design philosophy to view the website's layout change instantly:</span>
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              id={`theme-btn-${theme.id}`}
              onClick={() => setActiveTheme(theme)}
              className={`text-[11px] font-bold px-3 py-1 rounded transition-all cursor-pointer ${
                activeTheme.id === theme.id 
                  ? 'bg-white text-neutral-900 shadow-sm scale-105' 
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
