'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReaderHeader from '@/components/custom/reader/ReaderHeader';
import ReaderContent from '@/components/custom/reader/ReaderContent';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';
import { loadBibleChapter, BibleChapter } from '@/lib/bible-loader';
import { getNextChapter, getPreviousChapter } from '@/lib/bible-navigation';
import { X, Type, Languages, Loader2 } from 'lucide-react';

export default function ReaderPage() {
  const router = useRouter();
  const { prefs, savePrefs, hasValidPrefs, isLoaded } = useReadingPrefs();
  
  const [showSettings, setShowSettings] = useState(false);
  const [currentBook, setCurrentBook] = useState('JHN'); // João como padrão
  const [currentChapter, setCurrentChapter] = useState(1);
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Verificar se tem preferências válidas
  useEffect(() => {
    if (isLoaded && !hasValidPrefs()) {
      router.push('/leitura/setup');
    }
  }, [isLoaded, hasValidPrefs, router]);

  // Carregar capítulo quando preferências ou navegação mudam
  useEffect(() => {
    if (!isLoaded || !hasValidPrefs()) return;

    const loadChapter = async () => {
      setIsLoadingChapter(true);
      setLoadError(null);

      try {
        // Timeout de 10 segundos
        const timeoutPromise = new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error('Tempo limite excedido')), 10000)
        );

        const dataPromise = loadBibleChapter(
          currentBook,
          currentChapter,
          prefs.bibleVersion!
        );

        const data = await Promise.race([dataPromise, timeoutPromise]);

        if (data) {
          setChapterData(data);
        } else {
          setLoadError('Capítulo não encontrado no banco de dados');
        }
      } catch (error: any) {
        console.error('Erro ao carregar capítulo:', error);
        setLoadError(error.message || 'Erro ao carregar capítulo');
      } finally {
        setIsLoadingChapter(false);
      }
    };

    loadChapter();
  }, [currentBook, currentChapter, prefs.bibleVersion, isLoaded, hasValidPrefs]);

  const handlePreviousChapter = () => {
    const prev = getPreviousChapter(currentBook, currentChapter);
    if (prev) {
      setCurrentBook(prev.book);
      setCurrentChapter(prev.chapter);
    }
  };

  const handleNextChapter = () => {
    const next = getNextChapter(currentBook, currentChapter);
    if (next) {
      setCurrentBook(next.book);
      setCurrentChapter(next.chapter);
    }
  };

  const handleNavigateToChapter = (bookCode: string, chapter: number) => {
    setCurrentBook(bookCode);
    setCurrentChapter(chapter);
  };

  const canGoPrevious = () => {
    return getPreviousChapter(currentBook, currentChapter) !== null;
  };

  const canGoNext = () => {
    return getNextChapter(currentBook, currentChapter) !== null;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasValidPrefs()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col pb-36">
      <ReaderHeader
        book={chapterData?.bookName || currentBook}
        chapter={currentChapter}
        onSettingsClick={() => setShowSettings(true)}
        onNavigate={handleNavigateToChapter}
      />

      {isLoadingChapter ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Carregando capítulo...</p>
          </div>
        </div>
      ) : loadError ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{loadError}</p>
            <button
              onClick={() => router.push('/leitura/setup')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Configurar novamente
            </button>
          </div>
        </div>
      ) : chapterData ? (
        <>
          <ReaderContent
            verses={chapterData.verses}
            fontSize={prefs.readerFontSize}
          />
        </>
      ) : null}

      {/* Navegação de Capítulos */}
      <div className="fixed bottom-20 left-0 right-0 z-40 bg-white/98 dark:bg-gray-900/98 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-[720px] mx-auto px-6 py-4 flex items-center justify-center gap-6">
          <button
            onClick={handlePreviousChapter}
            disabled={!canGoPrevious()}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              canGoPrevious()
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            ← Anterior
          </button>
          <button
            onClick={handleNextChapter}
            disabled={!canGoNext()}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              canGoNext()
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configurações</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tamanho da Fonte do Texto */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <label className="font-semibold text-gray-900 dark:text-white">
                    Tamanho do texto
                  </label>
                </div>
                <div className="flex gap-3">
                  {(['S', 'M', 'L'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => savePrefs({ readerFontSize: size })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                        prefs.readerFontSize === size
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {size === 'S' ? 'Pequeno' : size === 'M' ? 'Médio' : 'Grande'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Idiomas Configurados */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Idioma de leitura:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {prefs.dominantLanguage === 'pt-BR' ? 'Português' : 'English'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Versão da Bíblia:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {prefs.bibleVersion}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idioma de prática:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {prefs.practiceLanguage === 'pt-BR' ? 'Português' : 'English'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão para alterar configurações */}
              <button
                onClick={() => router.push('/leitura/setup')}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Alterar idiomas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
