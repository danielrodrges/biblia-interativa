'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Verse } from '@/mocks/bibleChapter';

interface ReaderContentProps {
  verses: Verse[];
  fontSize: 'S' | 'M' | 'L';
}

const fontSizeClasses = {
  S: 'text-base leading-relaxed',
  M: 'text-lg leading-relaxed',
  L: 'text-xl leading-loose',
};

// Versículos por página fixos - mais simples e rápido
const VERSES_PER_PAGE = {
  S: 12,
  M: 10,
  L: 8,
};

export default function ReaderContent({ verses, fontSize }: ReaderContentProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const versesPerPage = VERSES_PER_PAGE[fontSize];

  // Calcula páginas usando useMemo
  const pages = useMemo(() => {
    const newPages: Verse[][] = [];
    for (let i = 0; i < verses.length; i += versesPerPage) {
      newPages.push(verses.slice(i, i + versesPerPage));
    }
    return newPages;
  }, [verses, versesPerPage]);

  // Reset para primeira página ao mudar de capítulo
  useEffect(() => {
    setCurrentPage(0);
  }, [verses]);

  const totalPages = pages.length;

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  // Configuração do swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNextPage,
    onSwipedRight: goToPreviousPage,
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: false,
  });

  const currentVerses = pages[currentPage] || [];
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <div className="flex-1 flex flex-col relative">{/* Conteúdo com swipe */}
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
