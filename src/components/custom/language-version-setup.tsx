'use client';

import { useState, useEffect } from 'react';
import { Check, BookOpen, Globe } from 'lucide-react';
import { getVersionsByLanguage } from '@/lib/bible-versions';
import { BibleVersionData } from '@/lib/types';
import { getPreferences, savePreferences } from '@/lib/preferences';

interface LanguageVersionSetupProps {
  onComplete?: () => void;
}

const AVAILABLE_LANGUAGES = [
  { code: 'pt-BR', name: 'Português do Brasil', flag: '🇧🇷' },
  { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
];

export default function LanguageVersionSetup({ onComplete }: LanguageVersionSetupProps) {
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [availableVersions, setAvailableVersions] = useState<BibleVersionData[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  // Carregar preferências salvas
  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.preferredLanguage) {
      setSelectedLanguage(prefs.preferredLanguage);
      const versions = getVersionsByLanguage(prefs.preferredLanguage);
      setAvailableVersions(versions);
    }
    if (prefs.preferredBibleVersion) {
      setSelectedVersion(prefs.preferredBibleVersion);
    }
  }, []);

  // Atualizar versões quando idioma muda
  useEffect(() => {
    if (selectedLanguage) {
      const versions = getVersionsByLanguage(selectedLanguage);
      setAvailableVersions(versions);
      
      // Auto-selecionar primeira versão se não houver seleção
      if (versions.length > 0 && !selectedVersion) {
        setSelectedVersion(versions[0].version_id);
      }
    }
  }, [selectedLanguage, selectedVersion]);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setSelectedVersion(null); // Reset versão ao mudar idioma
    setStep(2);
  };

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersion(versionId);
  };

  const handleComplete = () => {
    if (selectedLanguage && selectedVersion) {
      savePreferences({
        preferredLanguage: selectedLanguage,
        preferredBibleVersion: selectedVersion,
        onboardingCompleted: true,
      });
      
      if (onComplete) {
        onComplete();
      }
    }
  };

  const selectedLang = AVAILABLE_LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center mb-8 gap-2">
        <div className={`h-2 w-12 rounded-full transition-all ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
        <div className={`h-2 w-12 rounded-full transition-all ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
      </div>

      {/* Etapa 1: Escolher Idioma */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Qual idioma você domina?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Escolha o idioma em que você lerá a Bíblia
            </p>
          </div>

          <div className="grid gap-3">
            {AVAILABLE_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                  selectedLanguage === lang.code
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{lang.flag}</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {lang.name}
                  </span>
                </div>
                {selectedLanguage === lang.code && (
                  <Check className="w-6 h-6 text-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Etapa 2: Escolher Versão da Bíblia */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Escolha sua versão da Bíblia
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Versões disponíveis em {selectedLang?.name}
            </p>
          </div>

          {availableVersions.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 text-center">
              <p className="text-amber-900 dark:text-amber-100">
                Nenhuma versão disponível para este idioma
              </p>
              <button
                onClick={() => setStep(1)}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Escolher outro idioma
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {availableVersions.map((version) => (
                  <button
                    key={version.version_id}
                    onClick={() => handleVersionSelect(version.version_id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      selectedVersion === version.version_id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-lg text-gray-900 dark:text-white">
                            {version.version_id}
                          </span>
                          {version.year && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              {version.year}
                            </span>
                          )}
                        </div>
                        <p className="text-base font-medium text-gray-800 dark:text-gray-200 mb-1">
                          {version.version_name}
                        </p>
                        {version.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {version.description}
                          </p>
                        )}
                      </div>
                      {selectedVersion === version.version_id && (
                        <Check className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!selectedVersion}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    selectedVersion
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Começar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
