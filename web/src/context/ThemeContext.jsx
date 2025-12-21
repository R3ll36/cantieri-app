import { createContext, useContext, useState, useEffect } from 'react';
import { lightColors, darkColors } from '../config/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Carica colori personalizzati salvati o usa default
  const [customLightColors, setCustomLightColors] = useState(() => {
    const saved = localStorage.getItem('customLightColors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [customDarkColors, setCustomDarkColors] = useState(() => {
    const saved = localStorage.getItem('customDarkColors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Usa colori personalizzati se esistono, altrimenti usa light/dark default
  const colors = isDarkMode
    ? (customDarkColors || darkColors)
    : (customLightColors || lightColors);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));

    // Applica colore di sfondo al body
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.textPrimary;
    document.body.style.transition = 'background-color 0.3s, color 0.3s';
  }, [isDarkMode, colors.background, colors.textPrimary]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Applica colori personalizzati per modalità corrente
  const applyCustomColors = (newColors, mode = isDarkMode ? 'dark' : 'light') => {
    if (mode === 'light') {
      setCustomLightColors(newColors);
      localStorage.setItem('customLightColors', JSON.stringify(newColors));
    } else {
      setCustomDarkColors(newColors);
      localStorage.setItem('customDarkColors', JSON.stringify(newColors));
    }
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      colors,
      toggleDarkMode,
      applyCustomColors,
      customLightColors,
      customDarkColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
