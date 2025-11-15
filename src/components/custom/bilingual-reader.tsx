'use client';

import { useState } from 'react';
import { BibleVerseData } from '@/lib/types';
import { BookOpen, Languages, Eye, EyeOff } from 'lucide-react';

interface BilingualReaderProps {
  verses: Array<{ native: BibleVerseData; learning: BibleVerseData }>;
  displayMode: 'side-by-side' | 'verse-by-verse';
  onDisplayModeChange?: (mode: 'side-by-side' | 'verse-by-verse') => void;
  fontSize?: 'small' | 'medium' | 'large';
}

export default function BilingualReader({
  verses,
  displayMode,
  onDisplayModeChange,
  fontSize = 'medium',
}: BilingualReaderProps) {
  const [showNative, setShowNative] = useState(true);
  const [showLearning, setShowLearning] = useState(true);

  const fontSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
  };

  const fontClass = fontSizeClasses[fontSize];

  if (verses.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">
          Nenhum versículo disponível para exibição.
        </p>
      </div>
    );
  }

  const firstVerse = verses[0];
  const nativeVersion = firstVerse.native.bible_version_id;
  const learningVersion = firstVerse.learning.bible_version_id;

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Modo de exibição */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Modo:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onDisplayModeChange?.('side-by-side')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  displayMode === 'side-by-side'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Lado a Lado
              </button>
              <button
                onClick={() => onDisplayModeChange?.('verse-by-verse')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  displayMode === 'verse-by-verse'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Versículo por Versículo
              </button>
            </div>
          </div>

          {/* Controles de visibilidade */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNative(!showNative)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {showNative ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
              {nativeVersion}
            </button>
            <button
              onClick={() => setShowLearning(!showLearning)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {showLearning ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
              {learningVersion}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="space-y-4">
        {displayMode === 'side-by-side' ? (
          // Modo lado a lado
          <div className="grid md:grid-cols-2 gap-6">
            {/* Coluna nativa */}
            {showNative && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    {firstVerse.native.language_name} - {nativeVersion}
                  </p>
                </div>
                {verses.map((verse) => (
                  <div
                    key={`native-${verse.native.verse}`}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded mb-2">
                      {verse.native.verse}
                    </span>
                    <p className={`${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed`}>
                      {verse.native.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Coluna aprendizado */}
            {showLearning && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                    {firstVerse.learning.language_name} - {learningVersion}
                  </p>
                </div>
                {verses.map((verse) => (
                  <div
                    key={`learning-${verse.learning.verse}`}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded mb-2">
                      {verse.learning.verse}
                    </span>
                    <p className={`${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed`}>
                      {verse.learning.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Modo versículo por versículo
          <div className="space-y-6">
            {verses.map((verse) => (
              <div
                key={`verse-${verse.native.verse}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-bold px-3 py-1 rounded">
                    Versículo {verse.native.verse}
                  </span>
                </div>

                {showNative && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      {firstVerse.native.language_name} - {nativeVersion}
                    </p>
                    <p className={`${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed`}>
                      {verse.native.text}
                    </p>
                  </div>
                )}

                {showNative && showLearning && (
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
                )}

                {showLearning && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                      {firstVerse.learning.language_name} - {learningVersion}
                    </p>
                    <p className={`${fontClass} text-gray-800 dark:text-gray-200 leading-relaxed`}>
                      {verse.learning.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
