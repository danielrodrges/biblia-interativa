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
          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <Book className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {currentBookInfo?.name || currentBook}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Seletor de Capítulo */}
        <button
          onClick={() => setShowChapterPicker(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Cap. {currentChapter}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Modal de Seleção de Livro */}
      {showBookPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Selecione o Livro</h2>
            </div>
            
            <div className="overflow-y-auto p-4">
              {/* Antigo Testamento */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 px-2">
                  ANTIGO TESTAMENTO
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {oldTestamentBooks.map(book => (
                    <button
                      key={book.code}
                      onClick={() => handleBookSelect(book)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        book.code === currentBook
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {book.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Novo Testamento */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 px-2">
                  NOVO TESTAMENTO
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {newTestamentBooks.map(book => (
                    <button
                      key={book.code}
                      onClick={() => handleBookSelect(book)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        book.code === currentBook
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {book.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={() => setShowBookPicker(false)}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Capítulo */}
      {showChapterPicker && currentBookInfo && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[70vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentBookInfo.name} - Selecione o Capítulo
              </h2>
            </div>
            
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {chapterNumbers.map(chapter => (
                  <button
                    key={chapter}
                    onClick={() => handleChapterSelect(chapter)}
                    className={`aspect-square rounded-lg text-sm font-semibold transition-all ${
                      chapter === currentChapter
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {chapter}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={() => setShowChapterPicker(false)}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
