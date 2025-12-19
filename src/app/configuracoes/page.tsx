'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  BookOpen, 
  Type, 
  LogOut,
  Edit2,
  Settings
} from 'lucide-react';
import { getPreferences, savePreferences, clearPreferences, getPreferredLanguage, getPreferredBibleVersion } from '@/lib/preferences';
import { getVersionById } from '@/lib/bible-versions';
import { BibleVersionData } from '@/lib/types';
import LanguageVersionSetup from '@/components/custom/language-version-setup';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<BibleVersionData | null>(null);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    const prefs = getPreferences();
    const lang = getPreferredLanguage();
    const versionId = getPreferredBibleVersion();
    
    setCurrentLanguage(lang);
    setFontSize(prefs.fontSize || 'medium');
    
    if (versionId) {
      const version = getVersionById(versionId);
      setCurrentVersion(version || null);
    }
  }, []);

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    savePreferences({ fontSize: size });
    setFontSize(size);
  };

  const handleResetApp = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações? Você precisará configurar novamente seu idioma e versão da Bíblia.')) {
      clearPreferences();
      router.push('/onboarding');
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    const lang = getPreferredLanguage();
    const versionId = getPreferredBibleVersion();
    setCurrentLanguage(lang);
    if (versionId) {
      const version = getVersionById(versionId);
      setCurrentVersion(version || null);
    }
  };

  const LANGUAGE_NAMES: { [key: string]: string } = {
    'pt-BR': 'Português do Brasil 🇧🇷',
    'en-US': 'English (US) 🇺🇸',
    'es-ES': 'Español 🇪🇸',
    'fr-FR': 'Français 🇫🇷',
    'de-DE': 'Deutsch 🇩🇪',
    'it-IT': 'Italiano 🇮🇹',
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-stone-950 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowSetup(false)}
            className="mb-6 flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </button>
          
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-stone-100 dark:border-stone-800">
            <LanguageVersionSetup onComplete={handleSetupComplete} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto scrollable-content bg-[#FAF9F6] dark:bg-stone-950 pb-24">
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-stone-700 dark:text-stone-300" />
            </button>
            <h1 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100">Configurações</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-stone-100 dark:border-stone-800">
          <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-xl">
                <BookOpen className="w-5 h-5 text-stone-700 dark:text-stone-300" />
              </div>
              <h2 className="font-serif font-bold text-stone-800 dark:text-stone-100">Bíblia</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wide">Idioma</div>
              <div className="text-lg font-serif font-medium text-stone-900 dark:text-stone-100">
                {currentLanguage ? LANGUAGE_NAMES[currentLanguage] : 'Não configurado'}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wide">Versão da Bíblia</div>
              <div className="text-lg font-serif font-medium text-stone-900 dark:text-stone-100">
                {currentVersion ? (
                  <div>
                    <div>{currentVersion.version_id} - {currentVersion.version_name}</div>
                    {currentVersion.year && (
                      <div className="text-sm font-sans text-stone-500 dark:text-stone-400 mt-1">
                        {currentVersion.year} • {currentVersion.source_reference}
                      </div>
                    )}
                  </div>
                ) : (
                  'Não configurado'
                )}
              </div>
            </div>

            <button
              onClick={() => setShowSetup(true)}
              className="w-full py-4 px-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Alterar Idioma e Versão
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-stone-100 dark:border-stone-800">
          <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-xl">
                <Type className="w-5 h-5 text-stone-700 dark:text-stone-300" />
              </div>
              <h2 className="font-serif font-bold text-stone-800 dark:text-stone-100">Aparência</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-4 uppercase tracking-wide">Tamanho da fonte</div>
            <div className="flex gap-3">
              <button
                onClick={() => handleFontSizeChange('small')}
                className={`flex-1 py-4 px-4 rounded-2xl border transition-all duration-200 ${
                  fontSize === 'small'
                    ? 'border-stone-800 bg-stone-50 dark:border-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'
                }`}
              >
                <div className="text-sm font-medium">Pequeno</div>
                <div className="text-xs mt-1 font-serif">Aa</div>
              </button>
              <button
                onClick={() => handleFontSizeChange('medium')}
                className={`flex-1 py-4 px-4 rounded-2xl border transition-all duration-200 ${
                  fontSize === 'medium'
                    ? 'border-stone-800 bg-stone-50 dark:border-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'
                }`}
              >
                <div className="text-sm font-medium">Médio</div>
                <div className="text-base mt-1 font-serif">Aa</div>
              </button>
              <button
                onClick={() => handleFontSizeChange('large')}
                className={`flex-1 py-4 px-4 rounded-2xl border transition-all duration-200 ${
                  fontSize === 'large'
                    ? 'border-stone-800 bg-stone-50 dark:border-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'
                }`}
              >
                <div className="text-sm font-medium">Grande</div>
                <div className="text-lg mt-1 font-serif">Aa</div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-stone-100 dark:border-stone-800">
          <button
            onClick={handleResetApp}
            className="w-full px-6 py-5 flex items-center justify-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Resetar Aplicativo
          </button>
        </div>
      </div>
    </div>
  );
}
