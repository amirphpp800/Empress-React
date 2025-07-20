
import React, { useState } from 'react';
import type { IpInfo } from '../types.ts';
import { FlagIcon, ServerStackIcon, CopyIcon, CheckIcon } from './Icons.tsx';
import { useTranslations } from '../hooks/useTranslations.ts';

interface IpInfoCardProps extends IpInfo {
  showNotification: (message: string) => void;
  index: number;
}

export const IpInfoCard: React.FC<IpInfoCardProps> = ({ ip, countryName, isp, countryCode, showNotification, countryNameKey, ispKey, index }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslations();

  const handleCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(ip).then(() => {
      showNotification(t('notification.copied', { ip }));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      showNotification(t('notification.copyFailed'));
    });
  };
  
  const displayCountry = countryNameKey ? t(countryNameKey) : countryName;
  const displayIsp = ispKey ? t(ispKey) : isp;
  const animationDelay = `${index * 100}ms`;

  const showFlag = countryCode && countryCode.length === 2 && !['XX', '??', 'ER'].includes(countryCode);

  return (
    <div 
      className="bg-brand-secondary border border-gray-800 rounded-xl p-5 shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-brand-accent/20 animate-card"
      style={{ animationDelay }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <p className="text-xs text-brand-text-secondary">{t('card.ipAddress')}</p>
            <p className="font-mono text-lg text-white tracking-wider">{ip}</p>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-gray-700/50 transition-colors duration-200 text-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
            aria-label={t('card.copyAriaLabel')}
          >
            {isCopied 
              ? <CheckIcon className="h-5 w-5 text-green-400" /> 
              : <CopyIcon className="h-5 w-5" />
            }
          </button>
        </div>
        
        <div className="space-y-4 flex-grow">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <FlagIcon className="h-6 w-6 text-brand-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-brand-text-secondary">{t('card.country')}</p>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {showFlag && (
                  <img
                    src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
                    width="20"
                    height="15"
                    alt={countryName}
                    className="rounded-sm object-cover h-[15px] flex-shrink-0"
                  />
                )}
                <p className="font-semibold text-brand-text break-words">
                  {displayCountry} ({countryCode})
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <ServerStackIcon className="h-6 w-6 text-brand-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-brand-text-secondary">{t('card.isp')}</p>
              <p className="font-semibold text-brand-text break-words">{displayIsp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
