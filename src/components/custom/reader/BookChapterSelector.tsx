'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Book, Hash } from 'lucide-react';
import { BIBLE_BOOKS, type BookInfo } from '@/lib/bible-navigation';

interface BookChapterSelectorProps {
  currentBook: string;
  currentChapter: number;
  onNavigate: (bookCode: string, chapter: number) => void;
}

export default function BookChapterSelector({
  currentBook,
  currentChapter,
  onNavigate,
}: BookChapterSelectorProps) {
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showChapterPicker, setShowChapterPicker] = useState(false);

  const currentBookInfo = useMemo(
    () => BIBLE_BOOKS.find(b => b.code === currentBook),
    [currentBook]
  );

  const oldTestamentBooks = useMemo(
    () => BIBLE_BOOKS.filter(b => b.testament === 'old'),
    []
  );

  const newTestamentBooks = useMemo(
    () => BIBLE_BOOKS.filter(b => b.testament === 'new'),
    []
  );

  const chapterNumbers = useMemo(
    () => currentBookInfo ? Array.from({ length: currentBookInfo.chapters }, (_, i) => i + 1) : [],
    [currentBookInfo]
  );

  const handleBookSelect = (book: BookInfo) => {
    onNavigate(book.code, 1);
    setShowBookPicker(false);
  };

  const handleChapterSelect = (chapter: number) => {
    onNavigate(currentBook, chapter);
    setShowChapterPicker(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Seletor de Livro */}
        <button
          onClick={() => setShowBookPicker(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all border border-stone-200 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800"
        >
          <Book className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          <span className="text-sm font-serif font-medium text-stone-800 dark:text-stone-200">
            {currentBookInfo?.name || currentBook}
          </span>
          <ChevronDown className="w-4 h-4 text-stone-400" />
        </button>

        {/* Seletor de Capítulo */}
        <button
          onClick={() => setShowChapterPicker(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all border border-stone-200 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800"
        >
          <Hash className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          <span className="text-sm font-serif font-medium text-stone-800 dark:text-stone-200">
            Cap. {currentChapter}
          </span>
          <ChevronDown className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Modal de Seleção de Livro */}
      {showBookPicker && (
        <div className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 sm:p-0">
          <div className="bg-[#FAF9F6] dark:bg-stone-900 rounded-3xl w-full sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="sticky top-0 bg-[#FAF9F6]/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-6 py-4 z-10">
              <h2 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100">Selecione o Livro</h2>
            </div>
            
            <div className="overflow-y-auto p-6">
              {/* Antigo Testamento */}
              <div className="mb-8">
                <h3 className="text-xs font-bold tracking-wider text-stone-500 dark:text-stone-400 mb-4 px-1 uppercase">
                  Antigo Testamento
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {oldTestamentBooks.map(book => (
                    <button
                      key={book.code}
                      onClick={() => handleBookSelect(book)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        book.code === currentBook
                          ? 'bg-stone-800 text-stone-50 shadow-lg scale-[1.02]'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-100 dark:border-stone-700'
                      }`}
                    >
                      {book.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Novo Testamento */}
              <div>
                <h3 className="text-xs font-bold tracking-wider text-stone-500 dark:text-stone-400 mb-4 px-1 uppercase">
                  Novo Testamento
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {newTestamentBooks.map(book => (
                    <button
                      key={book.code}
                      onClick={() => handleBookSelect(book)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        book.code === currentBook
                          ? 'bg-stone-800 text-stone-50 shadow-lg scale-[1.02]'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-100 dark:border-stone-700'
                      }`}
                    >
                      {book.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 dark:border-stone-800 p-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
              <button
                onClick={() => setShowBookPicker(false)}
                className="w-full py-3 px-4 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Capítulo */}
      {showChapterPicker && currentBookInfo && (
        <div className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 sm:p-0">
          <div className="bg-[#FAF9F6] dark:bg-stone-900 rounded-3xl w-full sm:max-w-lg max-h-[70vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="sticky top-0 bg-[#FAF9F6]/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-6 py-4 z-10">
              <h2 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100">
                {currentBookInfo.name} <span className="text-stone-400 font-sans font-normal text-base ml-2">Capítulo</span>
              </h2>
            </div>
            
            <div className="overflow-y-auto p-6">
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {chapterNumbers.map(chapter => (
                  <button
                    key={chapter}
                    onClick={() => handleChapterSelect(chapter)}
                    className={`aspect-square rounded-xl text-sm font-serif font-bold transition-all duration-200 flex items-center justify-center ${
                      chapter === currentChapter
                        ? 'bg-stone-800 text-stone-50 shadow-lg scale-110'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-100 dark:border-stone-700'
                    }`}
                  >
                    {chapter}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-200 dark:border-stone-800 p-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
              <button
                onClick={() => setShowChapterPicker(false)}
                className="w-full py-3 px-4 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
