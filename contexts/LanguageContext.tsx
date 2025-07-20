
import React, { createContext, useState, useEffect, useMemo } from 'react';
import type { Language, Translations } from '../types.ts';
import enTranslations from '../translations/en.json';
import faTranslations from '../translations/fa.json';

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
  ready: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const allTranslations: Record<Language, Translations> = {
  en: enTranslations,
  fa: faTranslations,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });
  const [translations, setTranslations] = useState<Translations>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    try {
      const data = allTranslations[language];
      if (!data) {
        throw new Error(`Translations for '${language}' not found.`);
      }
      setTranslations(data);
    } catch (error) {
      console.error(error);
      // Fallback to English on any error
      setTranslations(allTranslations.en);
      if (language !== 'en') {
        setLanguage('en');
      }
    } finally {
      setReady(true);
    }
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
