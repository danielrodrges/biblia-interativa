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
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-stone-950 px-4 sm:px-6 py-6 sm:py-12 pb-24 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 dark:bg-stone-900 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-stone-800 dark:text-stone-200" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2 sm:mb-3">
            Configure sua leitura
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400">
            {step === 1 && 'Selecione sua versão da Bíblia'}
            {step === 2 && 'Qual idioma você quer praticar?'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'w-12 bg-stone-800 dark:bg-stone-200' : 'w-8 bg-stone-200 dark:bg-stone-800'
              }`}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl shadow-stone-200/50 dark:shadow-none p-4 sm:p-8 border border-stone-100 dark:border-stone-800 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150">
          {/* Step 1: Versão da Bíblia */}
          {step === 1 && (
            <div className="space-y-3">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => {
                    setBibleVersion(version.id);
                    setStep(2);
                  }}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 text-left ${
                    bibleVersion === version.id
                      ? 'border-stone-800 bg-stone-50 dark:border-stone-200 dark:bg-stone-800 ring-1 ring-stone-800 dark:ring-stone-200'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 bg-white dark:bg-stone-900'
                  }`}
                >
                  <div>
                    <div className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                      {version.id}
                    </div>
                    <div className="text-sm text-stone-700 dark:text-stone-300 mt-1">
                      {version.name}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {version.source}
                    </div>
                  </div>
                  {bibleVersion === version.id && (
                    <div className="bg-stone-800 dark:bg-stone-200 rounded-full p-1">
                      <Check className="w-4 h-4 text-white dark:text-stone-900" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Idioma de Prática */}
          {step === 2 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="mb-4 text-center">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">
                  Qual idioma você quer praticar?
                </h2>
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
                  Escolha entre os {LANGUAGES.length} idiomas disponíveis
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-3 mb-4">
                {LANGUAGES.map((lang, index) => (
                  <button
                    key={lang.code}
                    onClick={() => setPracticeLanguage(lang.code)}
                    className={`relative w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 min-h-[100px] sm:min-h-0 ${
                      practiceLanguage === lang.code
                        ? 'border-stone-800 bg-stone-50 dark:border-stone-200 dark:bg-stone-800 ring-1 ring-stone-800 dark:ring-stone-200 shadow-md'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 hover:shadow-sm bg-white dark:bg-stone-900'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full justify-center sm:justify-start">
                      <span className="text-4xl sm:text-3xl">{lang.flag}</span>
                      <span className="text-base sm:text-lg font-medium text-stone-800 dark:text-stone-200 text-center sm:text-left">
                        {lang.name}
                      </span>
                    </div>
                    {practiceLanguage === lang.code && (
                      <div className="bg-stone-800 dark:bg-stone-200 rounded-full p-1 absolute top-2 right-2 sm:static">
                        <Check className="w-4 h-4 text-white dark:text-stone-900" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-sm sm:text-base font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!practiceLanguage}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl text-sm sm:text-base font-medium transition-all ${
                    practiceLanguage
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg hover:opacity-90'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
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
