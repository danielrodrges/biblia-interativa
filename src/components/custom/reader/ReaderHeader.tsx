'use client';

import { Settings } from 'lucide-react';

interface ReaderHeaderProps {
  book: string;
  chapter: number;
  onSettingsClick: () => void;
}

export default function ReaderHeader({ book, chapter, onSettingsClick }: ReaderHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-[#FAF9F6]/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-[720px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100">
              {book} {chapter}
            </h1>
          </div>
          
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5 text-stone-600 dark:text-stone-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
