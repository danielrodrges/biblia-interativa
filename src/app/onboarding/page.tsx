'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Check } from 'lucide-react';
import { availableLanguages, bibleVersions } from '@/lib/data';
import { Language, BibleVersion } from '@/lib/types';
import { savePreferences } from '@/lib/preferences';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [nativeLanguage, setNativeLanguage] = useState<Language | null>(null);
  const [learningLanguage, setLearningLanguage] = useState<Language | null>(null);
  const [nativeVersion, setNativeVersion] = useState<BibleVersion | null>(null);
  const [learningVersion, setLearningVersion] = useState<BibleVersion | null>(null);

  const handleComplete = () => {
    if (nativeLanguage && learningLanguage && nativeVersion && learningVersion) {
      savePreferences({
        nativeLanguage,
        learningLanguage,
        nativeVersion,
        learningVersion,
        onboardingCompleted: true,
      });
      router.push('/inicio');
    }
  };

  const nativeVersions = bibleVersions.filter(v => v.languageCode === nativeLanguage?.code);
  const learningVersions = bibleVersions.filter(v => v.languageCode === learningLanguage?.code);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-amber-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">📖</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Vamos montar sua Bíblia de estudos
          </h1>
          <p className="text-gray-600 text-lg">
            Configure seus idiomas para começar
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? 'w-12 bg-blue-500' : 'w-8 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Native Language */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Selecione o idioma que você domina
            </h2>
            <p className="text-gray-600 mb-6">
              Este será o idioma principal para sua leitura
            </p>
            <div className="space-y-3">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setNativeLanguage(lang);
                    setStep(2);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    nativeLanguage?.code === lang.code
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <span className="text-lg font-medium text-gray-800">
                      {lang.name}
                    </span>
                  </div>
                  {nativeLanguage?.code === lang.code && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Learning Language */}
        {step === 2 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <button
              onClick={() => setStep(1)}
              className="text-blue-500 mb-4 flex items-center gap-1 hover:underline"
            >
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Selecione o idioma que deseja aprender
            </h2>
            <p className="text-gray-600 mb-6">
              Você praticará este idioma durante a leitura
            </p>
            <div className="space-y-3">
              {availableLanguages
                .filter(lang => lang.code !== nativeLanguage?.code)
                .map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLearningLanguage(lang);
                      setStep(3);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      learningLanguage?.code === lang.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{lang.flag}</span>
                      <span className="text-lg font-medium text-gray-800">
                        {lang.name}
                      </span>
                    </div>
                    {learningLanguage?.code === lang.code && (
                      <Check className="w-6 h-6 text-blue-500" />
                    )}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Step 3: Native Version */}
        {step === 3 && nativeLanguage && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <button
              onClick={() => setStep(2)}
              className="text-blue-500 mb-4 flex items-center gap-1 hover:underline"
            >
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Escolha a versão em {nativeLanguage.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Selecione sua versão preferida da Bíblia
            </p>
            <div className="space-y-3">
              {nativeVersions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => {
                    setNativeVersion(version);
                    setStep(4);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    nativeVersion?.id === version.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-lg font-medium text-gray-800">
                      {version.abbreviation}
                    </div>
                    <div className="text-sm text-gray-600">
                      {version.name}
                    </div>
                  </div>
                  {nativeVersion?.id === version.id && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Learning Version */}
        {step === 4 && learningLanguage && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <button
              onClick={() => setStep(3)}
              className="text-blue-500 mb-4 flex items-center gap-1 hover:underline"
            >
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Escolha a versão em {learningLanguage.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Selecione a versão para praticar o idioma
            </p>
            <div className="space-y-3 mb-6">
              {learningVersions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => setLearningVersion(version)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    learningVersion?.id === version.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-lg font-medium text-gray-800">
                      {version.abbreviation}
                    </div>
                    <div className="text-sm text-gray-600">
                      {version.name}
                    </div>
                  </div>
                  {learningVersion?.id === version.id && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </button>
              ))}
            </div>

            {learningVersion && (
              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Começar minha jornada
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        )}

        {/* Summary */}
        {step > 1 && (
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 text-sm text-gray-600">
            <div className="flex items-center justify-between mb-2">
              <span>Idioma que domina:</span>
              <span className="font-medium text-gray-800">
                {nativeLanguage?.flag} {nativeLanguage?.name}
              </span>
            </div>
            {learningLanguage && (
              <div className="flex items-center justify-between">
                <span>Idioma para aprender:</span>
                <span className="font-medium text-gray-800">
                  {learningLanguage?.flag} {learningLanguage?.name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
