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
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Nenhuma versão disponível
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
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
          <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        </div>
      )}

      <div className="space-y-2">
        {versions.map((version) => (
          <button
            key={version.version_id}
            onClick={() => handleVersionSelect(version.version_id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedVersion?.version_id === version.version_id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {version.version_id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {version.year}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {version.version_name}
                </p>
                {version.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {version.description}
                  </p>
                )}
              </div>
              {selectedVersion?.version_id === version.version_id && (
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedVersion && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium">Fonte:</span>{' '}
            {selectedVersion.source_reference || 'Não especificada'}
          </p>
        </div>
      )}
    </div>
  );
}
