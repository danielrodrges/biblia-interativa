'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, BookOpen, Globe, Headphones } from 'lucide-react';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';

const LANGUAGES = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
];

const BIBLE_VERSIONS = {
  'pt-BR': [
    { id: 'NVI', name: 'Nova Versão Internacional', source: 'Supabase' },
    { id: 'ARA', name: 'Almeida Revisada Atualizada', source: 'Supabase' },
    { id: 'ACF', name: 'Almeida Corrigida e Fiel', source: 'Supabase' },
    { id: 'BLT', name: 'Bíblia Livre Para Todos', source: 'API' },
  ],
};

export default function SetupPage() {
  const router = useRouter();
  const { prefs, savePrefs } = useReadingPrefs();
  
  const [step, setStep] = useState(1);
  const [bibleVersion, setBibleVersion] = useState(prefs.bibleVersion || '');
  const [practiceLanguage, setPracticeLanguage] = useState(prefs.practiceLanguage || '');

  // Idioma dominante fixado em português
  const dominantLanguage = 'pt-BR';

  const handleComplete = () => {
    savePrefs({
      dominantLanguage: 'pt-BR',
      bibleVersion,
      practiceLanguage,
    });
    router.push('/leitura/reader');
  };

  const versions = BIBLE_VERSIONS['pt-BR'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 py-6 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Configure sua leitura
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {step === 1 && 'Selecione sua versão da Bíblia'}
            {step === 2 && 'Qual idioma você quer praticar?'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? 'w-12 bg-blue-500' : 'w-8 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-8">
          {/* Step 1: Versão da Bíblia */}
          {step === 1 && (
            <div className="space-y-4">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => {
                    setBibleVersion(version.id);
                    setStep(2);
                  }}
                  className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all text-left ${
                    bibleVersion === version.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div>
                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                      {version.id}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {version.name}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {version.source}
                    </div>
                  </div>
                  {bibleVersion === version.id && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Idioma de Prática */}
          {step === 2 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="mb-4 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Qual idioma você quer praticar?
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Escolha entre os {LANGUAGES.length} idiomas disponíveis
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4 mb-4">
                {LANGUAGES.map((lang, index) => (
                  <button
                    key={lang.code}
                    onClick={() => setPracticeLanguage(lang.code)}
                    className={`relative w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between p-4 sm:p-5 rounded-xl border-2 transition-all min-h-[100px] sm:min-h-0 ${
                      practiceLanguage === lang.code
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full justify-center sm:justify-start">
                      <span className="text-4xl sm:text-4xl">{lang.flag}</span>
                      <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white text-center sm:text-left">
                        {lang.name}
                      </span>
                    </div>
                    {practiceLanguage === lang.code && (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 absolute top-2 right-2 sm:static" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!practiceLanguage}
                  className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold transition-all ${
                    practiceLanguage
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Começar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
