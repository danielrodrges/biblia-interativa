'use client';

import { useState, useEffect } from 'react';
import { Check, BookOpen, ArrowRight } from 'lucide-react';
import { getVersionsByLanguage } from '@/lib/bible-versions';
import { BibleVersionData } from '@/lib/types';
import { getPreferences, savePreferences } from '@/lib/preferences';

interface LanguageVersionSetupProps {
  onComplete?: () => void;
}

export default function LanguageVersionSetup({ onComplete }: LanguageVersionSetupProps) {
  const [selectedLanguage] = useState<string>('pt-BR'); // Português como padrão fixo
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Versão Simplificada - Apenas escolher versão da Bíblia */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-stone-700 dark:text-stone-300" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-3">
            Escolha sua versão da Bíblia
          </h2>
          <p className="text-stone-600 dark:text-stone-400">
            Selecione a tradução que você prefere para começar
          </p>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-700">
          {availableVersions.map((version) => (
            <button
              key={version.version_id}
              onClick={() => handleVersionSelect(version.version_id)}
              className={`w-full p-5 rounded-2xl border text-left transition-all duration-200 ${
                selectedVersion === version.version_id
                  ? 'border-stone-800 bg-stone-50 dark:border-stone-200 dark:bg-stone-800 ring-1 ring-stone-800 dark:ring-stone-200'
                  : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 bg-white dark:bg-stone-900'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={`font-serif font-bold text-lg mb-1 ${
                    selectedVersion === version.version_id
                      ? 'text-stone-900 dark:text-stone-100'
                      : 'text-stone-800 dark:text-stone-200'
                  }`}>
                    {version.version_name}
                  </div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    {version.year && `${version.year} • `}{version.source_reference}
                  </div>
                </div>
                {selectedVersion === version.version_id && (
                  <div className="bg-stone-800 dark:bg-stone-200 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white dark:text-stone-900" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleComplete}
          disabled={!selectedVersion}
          className={`w-full py-4 px-6 rounded-2xl font-medium text-lg transition-all flex items-center justify-center gap-2 ${
            selectedVersion
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg hover:opacity-90'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
          }`}
        >
          Começar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
