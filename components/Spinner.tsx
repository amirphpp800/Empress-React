
import React from 'react';
import { useTranslations } from '../hooks/useTranslations.ts';

export const Spinner: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <div className="flex justify-center items-center py-10">
      <svg 
        className="animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-10 w-10 text-brand-accent" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="text-lg text-brand-text-secondary">{t('spinner.fetching')}</span>
    </div>
  );
}
