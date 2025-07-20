
import React from 'react';
import { TelegramIcon } from './Icons.tsx';
import { useTranslations } from '../hooks/useTranslations.ts';

export const Footer: React.FC = () => {
  const { t } = useTranslations();

  return (
    <footer className="bg-brand-secondary/30 mt-12 py-8">
      <div className="container mx-auto px-4 text-center text-brand-text-secondary text-sm">
        <div className="flex flex-col items-center space-y-6">
          <div>
            <p className="font-semibold text-brand-text text-base">{t('footer.teamName')}</p>
            <a 
                href="https://t.me/Empress_team" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse mt-2 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-semibold rounded-lg transition-colors duration-300 group"
            >
                <TelegramIcon className="h-5 w-5 text-sky-400/80 group-hover:text-sky-400 transition-colors"/>
                <span>{t('footer.telegramLink')}</span>
            </a>
          </div>
          <div className="w-full max-w-lg border-t border-gray-800 pt-6">
            <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
            <p className="mt-1">{t('footer.attribution')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
