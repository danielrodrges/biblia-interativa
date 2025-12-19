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
      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-8 text-center border border-stone-200 dark:border-stone-800">
        <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />
        <p className="text-stone-600 dark:text-stone-400">
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
      <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Modo de exibição */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Modo:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onDisplayModeChange?.('side-by-side')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 font-medium ${
                  displayMode === 'side-by-side'
                    ? 'bg-stone-800 text-stone-50 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                Lado a Lado
              </button>
              <button
                onClick={() => onDisplayModeChange?.('verse-by-verse')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 font-medium ${
                  displayMode === 'verse-by-verse'
                    ? 'bg-stone-800 text-stone-50 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
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
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all duration-200 font-medium ${
                showNative
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700'
                  : 'bg-stone-50 dark:bg-stone-900 text-stone-400 dark:text-stone-600 border border-transparent'
              }`}
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
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all duration-200 font-medium ${
                showLearning
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700'
                  : 'bg-stone-50 dark:bg-stone-900 text-stone-400 dark:text-stone-600 border border-transparent'
              }`}
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
                <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-300 text-center uppercase tracking-wide">
                    {firstVerse.native.language_name}
                  </p>
                </div>
                {verses.map((verse) => (
                  <div
                    key={`native-${verse.native.verse}`}
                    className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="inline-block bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold px-2 py-1 rounded-md mb-2">
                      {verse.native.verse}
                    </span>
                    <p className={`${fontClass} font-serif text-stone-800 dark:text-stone-200 leading-relaxed`}>
                      {verse.native.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Coluna aprendizado */}
            {showLearning && (
              <div className="space-y-4">
                <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-300 text-center uppercase tracking-wide">
                    {firstVerse.learning.language_name}
                  </p>
                </div>
                {verses.map((verse) => (
                  <div
                    key={`learning-${verse.learning.verse}`}
                    className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="inline-block bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold px-2 py-1 rounded-md mb-2">
                      {verse.learning.verse}
                    </span>
                    <p className={`${fontClass} font-serif text-stone-800 dark:text-stone-200 leading-relaxed`}>
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
                className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-sm font-bold px-3 py-1 rounded-md">
                    Versículo {verse.native.verse}
                  </span>
                </div>

                {showNative && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                      {firstVerse.native.language_name}
                    </p>
                    <p className={`${fontClass} font-serif text-stone-800 dark:text-stone-200 leading-relaxed`}>
                      {verse.native.text}
                    </p>
                  </div>
                )}

                {showNative && showLearning && (
                  <div className="border-t border-stone-100 dark:border-stone-800 my-4" />
                )}

                {showLearning && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                      {firstVerse.learning.language_name}
                    </p>
                    <p className={`${fontClass} font-serif text-stone-800 dark:text-stone-200 leading-relaxed`}>
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
