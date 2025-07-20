import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { Button } from './components/Button.tsx';
import { Spinner } from './components/Spinner.tsx';
import { IpInfoCard } from './components/IpInfoCard.tsx';
import { Notification } from './components/Notification.tsx';
import { generateAndFetchIpInfos } from './services/ipService.ts';
import type { IpInfo } from './types.ts';
import { GlobeIcon, ServerIcon, WifiIcon } from './components/Icons.tsx';
import { useTranslations } from './hooks/useTranslations.ts';

const App: React.FC = () => {
  const [ipData, setIpData] = useState<IpInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const { t, ready, language } = useTranslations();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 250); // Corresponds to fade-out duration
    return () => clearTimeout(timer);
  }, [language]);

  const handleGenerateClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIpData([]);
    try {
      const data = await generateAndFetchIpInfos(6);
      setIpData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(t('error.apiError', { message: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  }, [t]);
  
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);
  
  if (!ready) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const mainContentClass = isTransitioning ? 'is-transitioning' : 'animate-fade-in';

  return (
    <div className="flex flex-col min-h-screen">
      <Notification 
        message={notification} 
        onClose={() => setNotification(null)} 
      />
      <Header />
      <main className={`flex-grow container mx-auto px-4 py-8 flex flex-col items-center transition-opacity duration-300 ${mainContentClass}`}>
        <div className="w-full max-w-4xl text-center">
          <p className="text-brand-text-secondary mb-6 text-lg">
            {t('app.description')}
          </p>
          <Button onClick={handleGenerateClick} disabled={isLoading}>
            {isLoading ? t('button.generating') : t('button.generate')}
          </Button>

          {isLoading && <Spinner />}
          
          {error && (
            <div className="mt-8 text-red-400 bg-red-900/50 p-4 rounded-lg">
              <p className="font-semibold">{t('error.title')}:</p>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && ipData.length > 0 && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {ipData.map((info, index) => (
                <IpInfoCard key={info.ip} {...info} index={index} showNotification={showNotification} />
              ))}
            </div>
          )}

          {!isLoading && ipData.length === 0 && !error && (
             <div className="mt-12 text-center text-brand-text-secondary w-full max-w-2xl mx-auto p-8 border border-dashed border-gray-700 rounded-lg">
                <div className="flex justify-center items-center space-x-6">
                    <GlobeIcon className="w-12 h-12 text-gray-600"/>
                    <ServerIcon className="w-12 h-12 text-gray-600"/>
                    <WifiIcon className="w-12 h-12 text-gray-600"/>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-400">{t('welcome.title')}</h3>
                <p className="mt-2 text-gray-500">{t('welcome.description')}</p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;