'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart, Share2, Volume2, Languages, BookOpen } from 'lucide-react';
import { getPreferences, savePreferences, getFontSizeClass } from '@/lib/preferences';
import { UserPreferences } from '@/lib/types';
import { getBilingualVerses, getChapterVerses } from '@/lib/bible-data';
import { fetchChapterFromAPI, fetchBilingualChapter } from '@/lib/bible-api';
import { bibleBooks, getBookName } from '@/lib/bible-books';

type ReadingMode = 'native' | 'learning' | 'both';

export default function LeituraPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [readingMode, setReadingMode] = useState<ReadingMode>('both');
  const [currentBookId, setCurrentBookId] = useState('JOH');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prefs = getPreferences();
    if (!prefs.onboardingCompleted) {
      router.push('/onboarding');
      return;
    }
    setPreferences(prefs);
    setReadingMode(prefs.readingMode);

    // Restaurar última leitura se existir
    if (prefs.lastReading) {
      const book = bibleBooks.find(b => 
        b.names['pt-BR'] === prefs.lastReading?.book || 
        b.book_id === prefs.lastReading?.book
      );
      if (book) {
        setCurrentBookId(book.book_id);
        setCurrentChapter(prefs.lastReading.chapter || 1);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!preferences) return;

    loadVerses();
  }, [preferences, currentBookId, currentChapter, readingMode]);

  const loadVerses = async () => {
    if (!preferences) return;

    setLoading(true);

    const nativeLang = preferences.nativeLanguage?.code || 'pt-BR';
    const nativeVersion = preferences.nativeVersion?.abbreviation || 'NVI';
    const learningLang = preferences.learningLanguage?.code || 'en-US';
    const learningVersion = preferences.learningVersion?.abbreviation || 'NIV';

    try {
      let loadedVerses: any[] = [];

      if (readingMode === 'both') {
        // Tentar buscar do Supabase primeiro
        const supabaseVerses = await fetchBilingualChapter(
          nativeLang,
          nativeVersion,
          learningLang,
          learningVersion,
          currentBookId,
          currentChapter
        );

        if (supabaseVerses.length > 0) {
          loadedVerses = supabaseVerses;
        } else {
          // Fallback para dados locais
          const bilingualVerses = getBilingualVerses(
            nativeLang,
            nativeVersion,
            learningLang,
            learningVersion,
            currentBookId,
            currentChapter
          );
          loadedVerses = bilingualVerses;
        }
      } else if (readingMode === 'native') {
        // Tentar buscar do Supabase primeiro
        const supabaseVerses = await fetchChapterFromAPI(
          nativeLang,
          nativeVersion,
          currentBookId,
          currentChapter
        );

        if (supabaseVerses.length > 0) {
          loadedVerses = supabaseVerses.map(v => ({ native: v }));
        } else {
          // Fallback para dados locais
          const nativeVerses = getChapterVerses(nativeLang, nativeVersion, currentBookId, currentChapter);
          loadedVerses = nativeVerses.map(v => ({ native: v }));
        }
      } else {
        // Tentar buscar do Supabase primeiro
        const supabaseVerses = await fetchChapterFromAPI(
          learningLang,
          learningVersion,
          currentBookId,
          currentChapter
        );

        if (supabaseVerses.length > 0) {
          loadedVerses = supabaseVerses.map(v => ({ learning: v }));
        } else {
          // Fallback para dados locais
          const learningVerses = getChapterVerses(learningLang, learningVersion, currentBookId, currentChapter);
          loadedVerses = learningVerses.map(v => ({ learning: v }));
        }
      }

      setVerses(loadedVerses);
    } catch (error) {
      console.error('Erro ao carregar versículos:', error);
      setVerses([]);
    } finally {
      setLoading(false);
    }

    // Salvar progresso
    savePreferences({ 
      lastReading: { 
        book: currentBookId, 
        chapter: currentChapter 
      } 
    });
  };

  const handleModeChange = () => {
    const modes: ReadingMode[] = ['native', 'learning', 'both'];
    const currentIndex = modes.indexOf(readingMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setReadingMode(nextMode);
    savePreferences({ readingMode: nextMode });
  };

  const getModeLabel = () => {
    switch (readingMode) {
      case 'native':
        return preferences?.nativeLanguage?.name || 'Idioma nativo';
      case 'learning':
        return preferences?.learningLanguage?.name || 'Idioma de estudo';
      case 'both':
        return 'Dois idiomas';
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else {
      // Ir para o livro anterior
      const currentBookIndex = bibleBooks.findIndex(b => b.book_id === currentBookId);
      if (currentBookIndex > 0) {
        const previousBook = bibleBooks[currentBookIndex - 1];
        setCurrentBookId(previousBook.book_id);
        setCurrentChapter(previousBook.total_chapters);
      }
    }
  };

  const handleNextChapter = () => {
    const currentBook = bibleBooks.find(b => b.book_id === currentBookId);
    if (!currentBook) return;

    if (currentChapter < currentBook.total_chapters) {
      setCurrentChapter(currentChapter + 1);
    } else {
      // Ir para o próximo livro
      const currentBookIndex = bibleBooks.findIndex(b => b.book_id === currentBookId);
      if (currentBookIndex < bibleBooks.length - 1) {
        const nextBook = bibleBooks[currentBookIndex + 1];
        setCurrentBookId(nextBook.book_id);
        setCurrentChapter(1);
      }
    }
  };

  const canGoPrevious = () => {
    if (currentChapter > 1) return true;
    const currentBookIndex = bibleBooks.findIndex(b => b.book_id === currentBookId);
    return currentBookIndex > 0;
  };

  const canGoNext = () => {
    const currentBook = bibleBooks.find(b => b.book_id === currentBookId);
    if (!currentBook) return false;
    if (currentChapter < currentBook.total_chapters) return true;
    const currentBookIndex = bibleBooks.findIndex(b => b.book_id === currentBookId);
    return currentBookIndex < bibleBooks.length - 1;
  };

  if (!preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const fontSizeClass = getFontSizeClass(preferences.fontSize);
  const currentBookName = getBookName(currentBookId, preferences.nativeLanguage?.code || 'pt-BR');

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push('/inicio')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <button
              onClick={() => setShowBookSelector(!showBookSelector)}
              className="flex-1 mx-4"
            >
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {currentBookName} {currentChapter}
                </div>
                <div className="text-xs text-gray-500">
                  {preferences.nativeVersion?.abbreviation} / {preferences.learningVersion?.abbreviation}
                </div>
              </div>
            </button>

            <button
              onClick={handleModeChange}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Languages className="w-6 h-6 text-blue-500" />
            </button>
          </div>

          {/* Mode Indicator */}
          <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
            <span className="text-sm font-medium text-blue-700">
              {getModeLabel()}
            </span>
          </div>
        </div>
      </div>

      {/* Book Selector */}
      {showBookSelector && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Escolher livro
                </h3>
                <button
                  onClick={() => setShowBookSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Antigo Testamento */}
            <div className="p-6">
              <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Antigo Testamento</h4>
              <div className="space-y-2">
                {bibleBooks.filter(b => b.testament === 'old').map((book) => (
                  <button
                    key={book.book_id}
                    onClick={() => {
                      setCurrentBookId(book.book_id);
                      setCurrentChapter(1);
                      setShowBookSelector(false);
                    }}
                    className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-800">
                      {getBookName(book.book_id, preferences.nativeLanguage?.code || 'pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">{book.total_chapters} capítulos</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Novo Testamento */}
            <div className="p-6 pt-0">
              <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Novo Testamento</h4>
              <div className="space-y-2">
                {bibleBooks.filter(b => b.testament === 'new').map((book) => (
                  <button
                    key={book.book_id}
                    onClick={() => {
                      setCurrentBookId(book.book_id);
                      setCurrentChapter(1);
                      setShowBookSelector(false);
                    }}
                    className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-800">
                      {getBookName(book.book_id, preferences.nativeLanguage?.code || 'pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">{book.total_chapters} capítulos</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Carregando capítulo...</p>
          </div>
        ) : verses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Este capítulo não está disponível no momento</p>
            <p className="text-sm text-gray-400">
              Tente outro capítulo ou livro
            </p>
          </div>
        ) : (
          <>
            {/* Verses */}
            <div className="space-y-6 mb-8">
              {verses.map((verseData, index) => {
                const nativeVerse = verseData.native;
                const learningVerse = verseData.learning;
                const verseNumber = nativeVerse?.verse || learningVerse?.verse;
                
                return (
                  <div key={`verse-${verseNumber}-${index}`} className="group">
                    {/* Modo bilíngue - dois idiomas lado a lado */}
                    {readingMode === 'both' && nativeVerse && learningVerse && (
                      <div className="grid grid-cols-2 gap-3">
                        {/* Idioma Dominante - Esquerda */}
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-blue-600">
                            {nativeVerse.verse}
                          </span>
                          <p className={`${fontSizeClass} text-gray-800 leading-relaxed`}>
                            {nativeVerse.text}
                          </p>
                        </div>
                        
                        {/* Idioma de Aprendizado - Direita */}
                        <div className="space-y-1 border-l-2 border-gray-200 pl-3">
                          <span className="text-xs font-medium text-amber-600">
                            {learningVerse.verse}
                          </span>
                          <p className={`${fontSizeClass} text-gray-700 leading-relaxed`}>
                            {learningVerse.text}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Modo apenas idioma nativo */}
                    {readingMode === 'native' && nativeVerse && (
                      <div>
                        <span className="text-sm font-medium text-blue-600 mr-2">
                          {nativeVerse.verse}
                        </span>
                        <p className={`${fontSizeClass} text-gray-800 leading-relaxed inline`}>
                          {nativeVerse.text}
                        </p>
                      </div>
                    )}

                    {/* Modo apenas idioma de aprendizado */}
                    {readingMode === 'learning' && learningVerse && (
                      <div>
                        <span className="text-sm font-medium text-amber-600 mr-2">
                          {learningVerse.verse}
                        </span>
                        <p className={`${fontSizeClass} text-gray-800 leading-relaxed inline`}>
                          {learningVerse.text}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Heart className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Volume2 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between py-6 border-t border-gray-200">
              <button
                onClick={handlePreviousChapter}
                disabled={!canGoPrevious()}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </button>
              
              <button
                onClick={handleNextChapter}
                disabled={!canGoNext()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-xl font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
