'use client';

import { useState, useEffect } from 'react';
import { Check, BookOpen, Globe } from 'lucide-react';
import { BibleVersionData } from '@/lib/types';
import { getVersionsByLanguage, getVersionById } from '@/lib/bible-versions';

interface BibleVersionSelectorProps {
  languageCode: string;
  languageName: string;
  selectedVersionId?: string;
  onVersionSelect: (versionId: string) => void;
  label?: string;
}

export default function BibleVersionSelector({
  languageCode,
  languageName,
  selectedVersionId,
  onVersionSelect,
  label,
}: BibleVersionSelectorProps) {
  const [versions, setVersions] = useState<BibleVersionData[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<BibleVersionData | undefined>();

  useEffect(() => {
    const availableVersions = getVersionsByLanguage(languageCode);
    setVersions(availableVersions);

    if (selectedVersionId) {
      const version = getVersionById(selectedVersionId);
      setSelectedVersion(version);
    } else if (availableVersions.length > 0) {
      // Seleciona a primeira versão disponível por padrão
      setSelectedVersion(availableVersions[0]);
      onVersionSelect(availableVersions[0].version_id);
    }
  }, [languageCode, selectedVersionId, onVersionSelect]);

  const handleVersionSelect = (versionId: string) => {
    const version = versions.find((v) => v.version_id === versionId);
    setSelectedVersion(version);
    onVersionSelect(versionId);
  };

  if (versions.length === 0) {
    return (
      <div className="bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-stone-600 dark:text-stone-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
              Nenhuma versão disponível
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              Não há versões bíblicas disponíveis para {languageName}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
            {label}
          </label>
        </div>
      )}

      <div className="space-y-2">
        {versions.map((version) => (
          <button
            key={version.version_id}
            onClick={() => handleVersionSelect(version.version_id)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
              selectedVersion?.version_id === version.version_id
                ? 'border-stone-800 bg-stone-50 dark:border-stone-200 dark:bg-stone-800 ring-1 ring-stone-800 dark:ring-stone-200'
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 bg-white dark:bg-stone-900'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                    {version.version_id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {version.year}
                  </span>
                </div>
                <p className="text-sm text-stone-700 dark:text-stone-300 mb-1">
                  {version.version_name}
                </p>
                {version.description && (
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {version.description}
                  </p>
                )}
              </div>
              {selectedVersion?.version_id === version.version_id && (
                <div className="bg-stone-800 dark:bg-stone-200 rounded-full p-1">
                  <Check className="w-3 h-3 text-white dark:text-stone-900" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedVersion && (
        <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-3 text-xs text-stone-600 dark:text-stone-400 border border-stone-100 dark:border-stone-800">
          <p>
            <span className="font-medium">Fonte:</span>{' '}
            {selectedVersion.source_reference || 'Não especificada'}
          </p>
        </div>
      )}
    </div>
  );
}
