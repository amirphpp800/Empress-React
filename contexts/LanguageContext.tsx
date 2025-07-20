
import React, { createContext, useState, useEffect, useMemo } from 'react';
import type { Language, Translations } from '../types.ts';

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
  ready: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });
  const [translations, setTranslations] = useState<Translations>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false); // Set ready to false while fetching new language
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/translations/${language}.json`);
        if (!response.ok) {
          throw new Error(`Could not load ${language} translation file.`);
        }
        const data = await response.json();
        setTranslations(data);
        setReady(true);
      } catch (error) {
        console.error(error);
        // Fallback to English on error
        if (language !== 'en') {
          setLanguage('en');
        } else {
          setTranslations({}); // Clear translations on error for english
          setReady(true);
        }
      }
    };

    fetchTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    // Set initial direction and lang attribute on mount
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, []); // Run only on initial mount

  const t = (key: string, replacements?: { [key:string]: string }): string => {
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Return the key if not found
      }
    }
    
    let strResult = String(result);

    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            strResult = strResult.replace(`{{${rKey}}}`, replacements[rKey]);
        });
    }

    return strResult;
  };

  const value = useMemo(() => ({
    language,
    translations,
    setLanguage,
    t,
    ready,
  }), [language, translations, ready]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
