
import React from 'react';
import { GlobeAltIcon, TelegramIcon } from './Icons.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { useTranslations } from '../hooks/useTranslations.ts';

export const Header: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <header className="bg-brand-secondary/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <GlobeAltIcon className="h-8 w-8 text-brand-accent"/>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    {t('header.title.main')} <span className="text-brand-text-secondary">{t('header.title.secondary')}</span>
                </h1>
                <p className="text-sm text-brand-text-secondary">{t('header.byline')}</p>
              </div>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
             <div className="hidden sm:flex items-center space-x-4 rtl:space-x-reverse">
                <a 
                    href="https://t.me/Empress_team" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 rtl:space-x-reverse p-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-semibold rounded-lg transition-colors duration-300 group"
                    aria-label={t('header.telegramAriaLabel')}
                >
                    <TelegramIcon className="h-5 w-5 text-sky-400/80 group-hover:text-sky-400 transition-colors"/>
                </a>
             </div>
             <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};
