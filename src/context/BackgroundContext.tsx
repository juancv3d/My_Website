import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BackgroundTheme, BackgroundContextType } from '../types';

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider = ({ children }: BackgroundProviderProps) => {
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Background theme state with localStorage persistence
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>(() => {
    const saved = localStorage.getItem('backgroundTheme');
    return (saved as BackgroundTheme) || 'particles';
  });

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  // Persist background theme
  useEffect(() => {
    localStorage.setItem('backgroundTheme', backgroundTheme);
  }, [backgroundTheme]);

  const toggleDarkMode = () => setDarkMode((prev: boolean) => !prev);

  return (
    <BackgroundContext.Provider
      value={{
        backgroundTheme,
        setBackgroundTheme,
        darkMode,
        setDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = (): BackgroundContextType => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};

export default BackgroundContext;
