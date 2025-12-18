'use client';

import { Settings } from 'lucide-react';
import BookChapterSelector from './BookChapterSelector';

interface ReaderHeaderProps {
  book: string;
  chapter: number;
  onSettingsClick: () => void;
  onNavigate: (bookCode: string, chapter: number) => void;
}

export default function ReaderHeader({ book, chapter, onSettingsClick, onNavigate }: ReaderHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-[720px] mx-auto px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {book} {chapter}
            </h1>
          </div>
          
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Seletor de Livro e Capítulo */}
        <BookChapterSelector
          currentBook={book}
          currentChapter={chapter}
          onNavigate={onNavigate}
        />
      </div>
    </header>
  );
}
