
import React from 'react';
import { useTranslations } from '../hooks/useTranslations.ts';
import type { Language } from '../types.ts';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslations();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fa', label: 'FA' },
  ];

  return (
    <div className="flex items-center bg-brand-secondary p-1 rounded-lg border border-gray-700">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-300 ${
            language === lang.code
              ? 'bg-brand-accent text-white'
              : 'text-brand-text-secondary hover:bg-gray-700/50'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
