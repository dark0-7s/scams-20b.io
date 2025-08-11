import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'hi' | 'zh';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface AccessibilityContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
  screenReaderEnabled: boolean;
  setScreenReaderEnabled: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  hi: 'हिन्दी',
  zh: '中文'
};

const fontSizes = {
  small: '14px',
  medium: '16px',
  large: '18px',
  'extra-large': '20px'
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('scams-language');
    return (stored as Language) || 'en';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const stored = localStorage.getItem('scams-font-size');
    return (stored as FontSize) || 'medium';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('scams-high-contrast') === 'true';
  });

  const [reduceMotion, setReduceMotion] = useState(() => {
    return localStorage.getItem('scams-reduce-motion') === 'true';
  });

  const [screenReaderEnabled, setScreenReaderEnabled] = useState(() => {
    return localStorage.getItem('scams-screen-reader') === 'true';
  });

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = fontSizes[fontSize];
    localStorage.setItem('scams-font-size', fontSize);
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('scams-high-contrast', highContrast.toString());
  }, [highContrast]);

  // Apply reduced motion
  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('scams-reduce-motion', reduceMotion.toString());
  }, [reduceMotion]);

  // Store language preference
  useEffect(() => {
    localStorage.setItem('scams-language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Store screen reader preference
  useEffect(() => {
    localStorage.setItem('scams-screen-reader', screenReaderEnabled.toString());
  }, [screenReaderEnabled]);

  return (
    <AccessibilityContext.Provider value={{
      language,
      setLanguage,
      fontSize,
      setFontSize,
      highContrast,
      setHighContrast,
      reduceMotion,
      setReduceMotion,
      screenReaderEnabled,
      setScreenReaderEnabled
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

export { languages, fontSizes };
