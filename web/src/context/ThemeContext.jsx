import { useState, useEffect } from 'react';
import { lightColors, darkColors } from '../config/theme';
import { subscribeToGlobalSettings, saveGlobalSettings } from '../firebase/globalSettings';
import { ThemeContext } from './ThemeContextDef';

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customLightColors, setCustomLightColors] = useState(null);
  const [customDarkColors, setCustomDarkColors] = useState(null);
  const [customFont, setCustomFont] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ascolta impostazioni globali da Firebase
  useEffect(() => {
    const unsubscribe = subscribeToGlobalSettings((result) => {
      if (result.success && result.data) {
        const settings = result.data;

        // Applica impostazioni globali
        if (settings.isDarkMode !== undefined) {
          setIsDarkMode(settings.isDarkMode);
        }
        if (settings.customLightColors) {
          setCustomLightColors(settings.customLightColors);
        }
        if (settings.customDarkColors) {
          setCustomDarkColors(settings.customDarkColors);
        }
        if (settings.customFont) {
          setCustomFont(settings.customFont);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Usa colori personalizzati se esistono, altrimenti usa light/dark default
  const colors = isDarkMode
    ? (customDarkColors || darkColors)
    : (customLightColors || lightColors);

  useEffect(() => {
    // Applica colore di sfondo al body
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.textPrimary;
    document.body.style.transition = 'background-color 0.3s, color 0.3s';

    // Applica font personalizzato se presente
    if (customFont) {
      document.body.style.fontFamily = customFont;
    }
  }, [colors.background, colors.textPrimary, customFont]);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Salva su Firebase per tutti gli utenti
    await saveGlobalSettings({
      isDarkMode: newMode,
      customLightColors,
      customDarkColors,
      customFont
    });
  };

  // Applica colori personalizzati GLOBALMENTE per tutti gli utenti
  const applyCustomColors = async (newColors, mode = isDarkMode ? 'dark' : 'light') => {
    if (mode === 'light') {
      setCustomLightColors(newColors);
      await saveGlobalSettings({
        isDarkMode,
        customLightColors: newColors,
        customDarkColors,
        customFont
      });
    } else {
      setCustomDarkColors(newColors);
      await saveGlobalSettings({
        isDarkMode,
        customLightColors,
        customDarkColors: newColors,
        customFont
      });
    }
  };

  // Applica font personalizzato GLOBALMENTE
  const applyCustomFont = async (fontFamily) => {
    setCustomFont(fontFamily);
    await saveGlobalSettings({
      isDarkMode,
      customLightColors,
      customDarkColors,
      customFont: fontFamily
    });
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      colors,
      toggleDarkMode,
      applyCustomColors,
      applyCustomFont,
      customLightColors,
      customDarkColors,
      customFont,
      isLoading
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
