import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_night_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      const adminSaved = localStorage.getItem('krishi_admin_theme');
      if (adminSaved !== null) {
        return adminSaved === 'dark';
      }
      return false; // Default to Light mode
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('krishi_night_mode', String(isDarkMode));
      localStorage.setItem('krishi_admin_theme', isDarkMode ? 'dark' : 'light');
    } catch {}

    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.add('app-dark-mode');
      root.classList.remove('app-light-mode');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.remove('app-dark-mode');
      root.classList.add('app-light-mode');
      root.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const setDarkMode = (val) => {
    setIsDarkMode(!!val);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
