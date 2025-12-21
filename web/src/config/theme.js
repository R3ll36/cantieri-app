// Configurazione centralizzata colori e font del sito General Beton

export const lightColors = {
  // Colori principali
  primary: '#DC2626',      // Rosso principale
  primaryHover: '#B91C1C', // Rosso scuro hover

  // Colori secondari
  secondary: '#10B981',    // Verde
  secondaryHover: '#059669', // Verde scuro hover

  // Sfondo generale
  background: '#F3F4F6',   // Grigio chiaro
  surface: '#FFFFFF',      // Bianco per card/navbar

  // Navbar
  navbarBg: '#FFFFFF',     // Sfondo navbar
  navbarBorder: '#E5E7EB', // Bordo navbar

  // Pulsanti navbar
  buttonActiveBg: '#DC2626',      // Sfondo pulsante attivo (rosso)
  buttonActiveText: '#FFFFFF',    // Testo pulsante attivo (BIANCO)
  buttonInactiveBg: '#E5E7EB',    // Sfondo pulsante inattivo (grigio)
  buttonInactiveText: '#000000',  // Testo pulsante inattivo (NERO)
  buttonHover: '#D1D5DB',         // Hover pulsante inattivo

  // Altri pulsanti
  danger: '#EF4444',       // Rosso pericolo
  dangerHover: '#DC2626',  // Rosso pericolo hover
  success: '#10B981',      // Verde successo
  successHover: '#059669', // Verde successo hover
  warning: '#F59E0B',      // Giallo warning
  info: '#3B82F6',         // Blu info

  // Grigi
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Testi
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textWhite: '#FFFFFF',
  textMuted: '#9CA3AF',

  // Bordi
  border: '#E5E7EB',
  borderHover: '#D1D5DB',
};

export const darkColors = {
  // Colori principali (più vivaci in dark mode)
  primary: '#EF4444',
  primaryHover: '#DC2626',

  // Colori secondari
  secondary: '#10B981',
  secondaryHover: '#059669',

  // Sfondo generale
  background: '#111827',   // Grigio molto scuro
  surface: '#1F2937',      // Grigio scuro per card/navbar

  // Navbar
  navbarBg: '#1F2937',
  navbarBorder: '#374151',

  // Pulsanti navbar
  buttonActiveBg: '#EF4444',      // Sfondo pulsante attivo (rosso brillante)
  buttonActiveText: '#FFFFFF',    // Testo pulsante attivo (BIANCO)
  buttonInactiveBg: '#374151',    // Sfondo pulsante inattivo (grigio scuro)
  buttonInactiveText: '#E5E7EB',  // Testo pulsante inattivo (grigio chiaro)
  buttonHover: '#4B5563',         // Hover pulsante inattivo

  // Altri pulsanti
  danger: '#EF4444',
  dangerHover: '#DC2626',
  success: '#10B981',
  successHover: '#059669',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Grigi (invertiti)
  gray50: '#111827',
  gray100: '#1F2937',
  gray200: '#374151',
  gray300: '#4B5563',
  gray400: '#6B7280',
  gray500: '#9CA3AF',
  gray600: '#D1D5DB',
  gray700: '#E5E7EB',
  gray800: '#F3F4F6',
  gray900: '#F9FAFB',

  // Testi
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textWhite: '#FFFFFF',
  textMuted: '#9CA3AF',

  // Bordi
  border: '#374151',
  borderHover: '#4B5563',
};

export const fonts = {
  // Font families
  primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  heading: '"Arial Black", sans-serif',
  mono: '"Courier New", monospace',

  // Font sizes
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
};

export default { lightColors, darkColors, fonts, spacing };
