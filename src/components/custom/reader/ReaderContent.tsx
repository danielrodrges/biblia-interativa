'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

interface Verse {
  number: number;
  text: string;
}

interface ReaderContentProps {
  verses: Verse[];
  fontSize: 'S' | 'M' | 'L';
}

const fontSizeClasses = {
  S: 'text-base leading-relaxed',
  M: 'text-lg leading-relaxed',
  L: 'text-xl leading-loose',
};

export default function ReaderContent({ verses, fontSize }: ReaderContentProps) {
  // Renderizar todos os versículos de uma vez (mais simples e rápido)
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-[720px] mx-auto">
        <div className={`space-y-4 ${fontSizeClasses[fontSize]} text-gray-800 dark:text-gray-200`}>
          {verses.map((verse) => (
            <p key={verse.number} className="text-justify">
              <span className="inline-block w-8 text-sm font-semibold text-blue-600 dark:text-blue-400 mr-2">
                {verse.number}
              </span>
              <span>{verse.text}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}{/* Conteúdo com swipe */}
      <div
        {...swipeHandlers}
        className="flex-1 overflow-y-auto px-6 py-8"
        style={{ touchAction: 'pan-y' }}
      >
        <div className="max-w-[720px] mx-auto">
          <div className={`space-y-4 ${fontSizeClasses[fontSize]} text-gray-800 dark:text-gray-200`}>
            {currentVerses.map((verse) => (
              <p key={verse.number} className="text-justify">
                <span className="inline-block w-8 text-sm font-semibold text-blue-600 dark:text-blue-400 mr-2">
                  {verse.number}
                </span>
                <span>{verse.text}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Indicador de página e navegação */}
      {totalPages > 1 && (
        <div className="absolute bottom-4 left-0 right-0 pointer-events-none">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between gap-4 pointer-events-auto">
              {/* Botão Anterior */}
              <button
                onClick={goToPreviousPage}
                disabled={!canGoPrevious}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  !canGoPrevious
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Indicador de Página */}
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Página <span className="text-blue-600 dark:text-blue-400 font-bold">{currentPage + 1}</span> de {totalPages}
                </span>
              </div>

              {/* Botão Próximo */}
              <button
                onClick={goToNextPage}
                disabled={!canGoNext}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  !canGoNext
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg'
                }`}
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
