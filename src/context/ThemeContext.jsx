'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('aqua-blue');
  const [isInitialized, setIsInitialized] = useState(false);
  const [systemTheme, setSystemTheme] = useState('dark');
  const resolvedTheme = theme === 'system'
    ? systemTheme
    : theme === 'light'
      ? 'light'
      : 'dark';

  useEffect(() => {
    let savedTheme;
    try {
      savedTheme = localStorage.getItem('portfolio-theme') || localStorage.getItem('theme');
    } catch {
      // Keep the default theme when browser storage is unavailable.
    }
    const validThemes = ['system', 'aqua-blue', 'dark', 'light'];
    if (validThemes.includes(savedTheme)) setTheme(savedTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const updateSystemTheme = () => setSystemTheme(mediaQuery.matches ? 'light' : 'dark');
    updateSystemTheme();
    mediaQuery.addEventListener('change', updateSystemTheme);
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      // Theme selection still applies for this session without browser storage.
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-color-mode', resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [isInitialized, resolvedTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
