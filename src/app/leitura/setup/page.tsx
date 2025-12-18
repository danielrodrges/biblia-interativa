'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, BookOpen, Globe, Headphones } from 'lucide-react';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';

const LANGUAGES = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
];

const BIBLE_VERSIONS = {
  'pt-BR': [
    { id: 'NVI', name: 'Nova Versão Internacional', source: 'GitHub + API' },
    { id: 'ACF', name: 'Almeida Corrigida e Fiel', source: 'GitHub' },
    { id: 'AA', name: 'Almeida Revisada Imprensa Bíblica', source: 'GitHub' },
    { id: 'BLT', name: 'Bíblia Livre Para Todos', source: 'API' },
  ],
  'en-US': [
    { id: 'KJV', name: 'King James Version', source: 'API' },
    { id: 'NIV', name: 'New International Version', source: 'API' },
  ],
};

export default function SetupPage() {
  const router = useRouter();
  const { prefs, savePrefs } = useReadingPrefs();
  
  const [step, setStep] = useState(1);
  const [dominantLanguage, setDominantLanguage] = useState(prefs.dominantLanguage || '');
  const [bibleVersion, setBibleVersion] = useState(prefs.bibleVersion || '');
  const [practiceLanguage, setPracticeLanguage] = useState(prefs.practiceLanguage || '');

  const handleComplete = () => {
    savePrefs({
      dominantLanguage,
      bibleVersion,
      practiceLanguage,
    });
    router.push('/leitura/reader');
  };

  const versions = BIBLE_VERSIONS[dominantLanguage as keyof typeof BIBLE_VERSIONS] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Configure sua leitura
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {step === 1 && 'Escolha o idioma que você domina'}
            {step === 2 && 'Selecione sua versão da Bíblia'}
            {step === 3 && 'Qual idioma você quer praticar?'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? 'w-12 bg-blue-500' : 'w-8 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Step 1: Idioma Dominante */}
          {step === 1 && (
            <div className="space-y-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setDominantLanguage(lang.code);
                    setBibleVersion(''); // Reset versão
                    setStep(2);
                  }}
                  className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                    dominantLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{lang.flag}</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {lang.name}
                    </span>
                  </div>
                  {dominantLanguage === lang.code && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Versão da Bíblia */}
          {step === 2 && (
            <div className="space-y-4">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => {
                    setBibleVersion(version.id);
                    setStep(3);
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
              
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 3: Idioma de Prática */}
          {step === 3 && (
            <div className="space-y-4">
              {LANGUAGES.filter(l => l.code !== dominantLanguage).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setPracticeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                    practiceLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{lang.flag}</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {lang.name}
                    </span>
                  </div>
                  {practiceLanguage === lang.code && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </button>
              ))}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!practiceLanguage}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
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
