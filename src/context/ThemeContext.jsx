import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {}
});

export const ThemeProvider = ({ children }) => {
  const isDarkMode = false;
  const toggleDarkMode = () => {};
  const setDarkMode = () => {};

  useEffect(() => {
    try {
      localStorage.removeItem('krishi_night_mode');
      localStorage.removeItem('krishi_admin_theme');
    } catch {}

    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.remove('app-dark-mode');
    root.classList.add('app-light-mode');
    root.style.colorScheme = 'light';
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
