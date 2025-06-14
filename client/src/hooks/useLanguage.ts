import { useState, useEffect } from 'react';

export function useLanguage() {
  const [language, setLanguageState] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'fr';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: 'en' | 'fr') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return { language, setLanguage };
}