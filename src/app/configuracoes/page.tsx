'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  BookOpen, 
  Type, 
  LogOut,
  Edit2
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowSetup(false)}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <LanguageVersionSetup onComplete={handleSetupComplete} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Configurações</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-6 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-bold text-gray-800 dark:text-white">Bíblia</h2>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Idioma</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentLanguage ? LANGUAGE_NAMES[currentLanguage] : 'Não configurado'}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Versão da Bíblia</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentVersion ? (
                  <div>
                    <div>{currentVersion.version_id} - {currentVersion.version_name}</div>
                    {currentVersion.year && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
              className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Alterar Idioma e Versão
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-bold text-gray-800 dark:text-white">Aparência</h2>
            </div>
          </div>

          <div className="p-5">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Tamanho da fonte</div>
            <div className="flex gap-3">
              <button
                onClick={() => handleFontSizeChange('small')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                  fontSize === 'small'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-sm">Pequeno</div>
                <div className="text-xs mt-1">Aa</div>
              </button>
              <button
                onClick={() => handleFontSizeChange('medium')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                  fontSize === 'medium'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-sm">Médio</div>
                <div className="text-base mt-1">Aa</div>
              </button>
              <button
                onClick={() => handleFontSizeChange('large')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                  fontSize === 'large'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-sm">Grande</div>
                <div className="text-lg mt-1">Aa</div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={handleResetApp}
            className="w-full px-5 py-4 flex items-center justify-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Resetar Aplicativo
          </button>
        </div>
      </div>
    </div>
  );
}
