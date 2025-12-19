'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import ReaderHeader from '@/components/custom/reader/ReaderHeader';
import ReaderContent from '@/components/custom/reader/ReaderContent';
import SpeechControls from '@/components/custom/reader/SpeechControls';
import { SubtitleDisplay } from '@/components/custom/reader/SubtitleDisplay';
import BookChapterSelector from '@/components/custom/reader/BookChapterSelector';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSwipeIndicator } from '@/hooks/useSwipeIndicator';
import { useReadingTime } from '@/hooks/useReadingTime';
import { useNavigation } from '@/contexts/NavigationContext';
import { loadBibleChapter, BibleChapter } from '@/lib/bible-loader';
import { getNextChapter, getPreviousChapter } from '@/lib/bible-navigation';
import { translateBatch } from '@/lib/translate';
import { saveReadingEntry } from '@/lib/reading-history';
import { X, Type, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

function ReaderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { prefs, savePrefs, hasValidPrefs, isLoaded } = useReadingPrefs();
  const { setShowBottomNav } = useNavigation();
  
  const speechOptions = useMemo(() => ({
    lang: prefs.speechLanguage || 'pt-BR',
    rate: prefs.speechRate || 1.0,
  }), [prefs.speechLanguage, prefs.speechRate]);
  
  const { state: speechState, currentIndex, currentCharIndex, speak, pause, resume, stop, isSupported } = useSpeechSynthesis(speechOptions);
  const { swipeDirection, showSwipeLeft, showSwipeRight } = useSwipeIndicator();
  const { startTracking, stopTracking } = useReadingTime();
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempFontSize, setTempFontSize] = useState<'S' | 'M' | 'L'>('M');
  const [tempSpeechLanguage, setTempSpeechLanguage] = useState<'pt-BR' | 'en-US' | 'es-ES' | 'it-IT' | 'fr-FR'>('pt-BR');
  const [tempTextLanguage, setTempTextLanguage] = useState<'pt-BR' | 'en-US' | 'es-ES' | 'it-IT' | 'fr-FR'>('pt-BR');
  const [tempSubtitleEnabled, setTempSubtitleEnabled] = useState(true);  const [tempSpeechRate, setTempSpeechRate] = useState(1.0);  const [currentBook, setCurrentBook] = useState('JHN'); // João como padrão
  const [currentChapter, setCurrentChapter] = useState(1);
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [translatedTexts, setTranslatedTexts] = useState<{en: string[], es: string[], it: string[], fr: string[]}>({en: [], es: [], it: [], fr: []});
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true); // controla visibilidade dos menus

  // Verificar se tem preferências válidas
  const hasValidPreferences = useMemo(() => hasValidPrefs(), [hasValidPrefs]);
  
  useEffect(() => {
    if (isLoaded && !hasValidPreferences) {
      router.push('/leitura/setup');
    }
  }, [isLoaded, hasValidPreferences, router]);

  // Carregar livro/capítulo dos query params se existirem
  useEffect(() => {
    if (!isLoaded) return;
    
    const bookParam = searchParams?.get('book');
    const chapterParam = searchParams?.get('chapter');
    
    if (bookParam) {
      setCurrentBook(bookParam);
    }
    if (chapterParam) {
      const chapter = parseInt(chapterParam, 10);
      if (!isNaN(chapter)) {
        setCurrentChapter(chapter);
      }
    }
  }, [searchParams, isLoaded]);

  // Carregar capítulo quando preferências ou navegação mudam
  useEffect(() => {
    if (!isLoaded || !hasValidPreferences) return;

    const loadChapter = async () => {
      console.log('🔄 Iniciando carregamento...', { currentBook, currentChapter, version: prefs.bibleVersion });
      setIsLoadingChapter(true);
      setLoadError(null);
      // Limpar traduções ao mudar de capítulo
      setTranslatedTexts({en: [], es: [], it: [], fr: []});

      try {
        // Timeout de 30 segundos (Supabase está lento devido a falta de índices)
        const timeoutPromise = new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error('Tempo limite excedido - verifique sua conexão')), 30000)
        );

        console.log('📖 Chamando loadBibleChapter...');
        const dataPromise = loadBibleChapter(
          currentBook,
          currentChapter,
          prefs.bibleVersion!
        );

        const data = await Promise.race([dataPromise, timeoutPromise]);

        if (data) {
          console.log('✅ Capítulo carregado com sucesso!', data.verses.length, 'versículos');
          setChapterData(data);
        } else {
          console.error('❌ Nenhum dado retornado');
          setLoadError('Capítulo não encontrado no banco de dados');
        }
      } catch (error: any) {
        console.error('💥 Erro ao carregar capítulo:', error);
        setLoadError(error.message || 'Erro ao carregar capítulo');
      } finally {
        setIsLoadingChapter(false);
      }
    };

    loadChapter();
  }, [currentBook, currentChapter, prefs.bibleVersion, isLoaded, hasValidPreferences]);

  // Rastrear tempo de leitura
  useEffect(() => {
    if (!isLoaded || !hasValidPreferences || !chapterData) return;

    // Iniciar rastreamento quando entrar na página de leitura
    startTracking();

    // Parar rastreamento ao sair
    return () => {
      stopTracking();
    };
  }, [isLoaded, hasValidPreferences, chapterData]);

  // Pré-carregar traduções em background para acelerar mudanças de idioma
  useEffect(() => {
    if (!isLoaded || !hasValidPreferences || !chapterData) return;
    if (translatedTexts.en.length > 0) return; // Já tem traduções

    // Pré-carregar inglês em background (idioma mais comum)
    const preloadTranslations = async () => {
      const portugueseTexts = chapterData.verses.map(v => v.text);
      
      // Traduzir silenciosamente em background sem mostrar loading
      setTimeout(async () => {
        try {
          const [enTexts, esTexts] = await Promise.all([
            translateBatch(portugueseTexts, 'en'),
            translateBatch(portugueseTexts, 'es')
          ]);
          
          // Atualizar cache silenciosamente se ainda não tem
          setTranslatedTexts(prev => ({
            en: prev.en.length > 0 ? prev.en : enTexts,
            es: prev.es.length > 0 ? prev.es : esTexts,
            it: prev.it,
            fr: prev.fr
          }));
          console.log('⚡ Pré-carregamento de traduções concluído');
        } catch (error) {
          console.log('ℹ️ Pré-carregamento falhou (normal se offline)');
        }
      }, 2000); // Esperar 2s após carregar o capítulo
    };

    preloadTranslations();
  }, [chapterData, isLoaded, hasValidPreferences]);

  // Traduzir para inglês ou espanhol quando idioma do texto ou voz necessitar
  useEffect(() => {
    if (!isLoaded || !hasValidPreferences || !chapterData) return;

    const translateChapter = async () => {
      const needsEnglish = prefs.textLanguage === 'en-US' || prefs.speechLanguage === 'en-US';
      const needsSpanish = prefs.textLanguage === 'es-ES' || prefs.speechLanguage === 'es-ES';
      const needsItalian = prefs.textLanguage === 'it-IT' || prefs.speechLanguage === 'it-IT';
      const needsFrench = prefs.textLanguage === 'fr-FR' || prefs.speechLanguage === 'fr-FR';
      
      if (!needsEnglish && !needsSpanish && !needsItalian && !needsFrench) {
        console.log('📖 Idioma do texto e voz são português, limpando traduções');
        setTranslatedTexts({en: [], es: [], it: [], fr: []});
        return;
      }

      const portugueseTexts = chapterData.verses.map(v => v.text);
      
      // Verificar se já temos traduções para este capítulo
      const hasEnglish = translatedTexts.en.length === portugueseTexts.length;
      const hasSpanish = translatedTexts.es.length === portugueseTexts.length;
      const hasItalian = translatedTexts.it.length === portugueseTexts.length;
      const hasFrench = translatedTexts.fr.length === portugueseTexts.length;
      
      // Se não precisa traduzir nada, retornar
      if ((!needsEnglish || hasEnglish) && (!needsSpanish || hasSpanish) && (!needsItalian || hasItalian) && (!needsFrench || hasFrench)) {
        return;
      }

      setIsTranslating(true);
      const newTranslations = {en: translatedTexts.en, es: translatedTexts.es, it: translatedTexts.it, fr: translatedTexts.fr};

      try {
        // Traduzir todos os idiomas necessários em paralelo para máxima velocidade
        const promises: Promise<void>[] = [];
        
        // Traduzir para inglês se necessário e não tiver
        if (needsEnglish && !hasEnglish) {
          promises.push(
            translateBatch(portugueseTexts, 'en').then(texts => {
              newTranslations.en = texts;
              console.log('✅ Inglês concluído');
            })
          );
        }

        // Traduzir para espanhol se necessário e não tiver
        if (needsSpanish && !hasSpanish) {
          promises.push(
            translateBatch(portugueseTexts, 'es').then(texts => {
              newTranslations.es = texts;
              console.log('✅ Espanhol concluído');
            })
          );
        }

        // Traduzir para italiano se necessário e não tiver
        if (needsItalian && !hasItalian) {
          promises.push(
            translateBatch(portugueseTexts, 'it').then(texts => {
              newTranslations.it = texts;
              console.log('✅ Italiano concluído');
            })
          );
        }

        // Traduzir para francês se necessário e não tiver
        if (needsFrench && !hasFrench) {
          promises.push(
            translateBatch(portugueseTexts, 'fr').then(texts => {
              newTranslations.fr = texts;
              console.log('✅ Francês concluído');
            })
          );
        }

        // Aguardar todas as traduções em paralelo
        await Promise.all(promises);

        setTranslatedTexts(newTranslations);
        
        // Salvar histórico de leitura quando houver traduções
        if (chapterData && Object.values(newTranslations).some(arr => arr.length > 0)) {
          const bookName = chapterData.book.name;
          const verseNumbers = chapterData.verses.map(v => v.verse);
          
          // Extrair palavras-chave dos textos em português
          const extractKeywords = (text: string): string[] => {
            const stopWords = new Set([
              'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
              'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos',
              'para', 'por', 'com', 'sem', 'e', 'ou', 'que'
            ]);
            return text
              .toLowerCase()
              .replace(/[.,!?;:()]/g, '')
              .split(/\s+/)
              .filter(word => word.length > 3 && !stopWords.has(word));
          };
          
          const allPortugueseWords = portugueseTexts.flatMap(extractKeywords);
          
          saveReadingEntry({
            book: bookName,
            chapter: currentChapter,
            verses: verseNumbers,
            timestamp: Date.now(),
            audioLanguage: prefs.speechLanguage, // salva o idioma que foi ouvido
            portugueseWords: allPortugueseWords,
            translatedWords: {
              en: newTranslations.en.flatMap(extractKeywords),
              es: newTranslations.es.flatMap(extractKeywords),
              it: newTranslations.it.flatMap(extractKeywords),
              fr: newTranslations.fr.flatMap(extractKeywords),
            },
          });
          
          console.log('📚 Histórico de leitura salvo');
        }
      } catch (err: any) {
        console.error('❌ Erro na tradução:', err.message || err);
      } finally {
        setIsTranslating(false);
      }
    };

    translateChapter();
  }, [prefs.textLanguage, prefs.speechLanguage, chapterData, isLoaded, hasValidPreferences]);

  const handlePreviousChapter = () => {
    console.log('🔙 handlePreviousChapter chamado');
    console.log('Atual:', { book: currentBook, chapter: currentChapter });
    const prev = getPreviousChapter(currentBook, currentChapter);
    console.log('Anterior encontrado:', prev);
    if (prev) {
      setCurrentBook(prev.book);
      setCurrentChapter(prev.chapter);
    }
  };

  const handleNextChapter = () => {
    console.log('▶️ handleNextChapter chamado');
    console.log('Atual:', { book: currentBook, chapter: currentChapter });
    const next = getNextChapter(currentBook, currentChapter);
    console.log('Próximo encontrado:', next);
    if (next) {
      setCurrentBook(next.book);
      setCurrentChapter(next.chapter);
    }
  };

  const handleNavigateToChapter = (bookCode: string, chapter: number) => {
    setCurrentBook(bookCode);
    setCurrentChapter(chapter);
  };

  const handleOpenSettings = () => {
    setTempFontSize(prefs.readerFontSize);
    setTempSpeechLanguage(prefs.speechLanguage);
    setTempTextLanguage(prefs.textLanguage || 'pt-BR');
    setTempSubtitleEnabled(prefs.subtitleEnabled);
    setTempSpeechRate(prefs.speechRate || 1.0);
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    const wasPlaying = speechState === 'speaking';
    const savedIndex = currentIndex;
    
    // Se estiver tocando e a velocidade mudou, parar para aplicar nova velocidade
    if (wasPlaying && tempSpeechRate !== prefs.speechRate) {
      stop();
    }
    
    savePrefs({
      readerFontSize: tempFontSize,
      speechLanguage: tempSpeechLanguage,
      textLanguage: tempTextLanguage,
      subtitleEnabled: tempSubtitleEnabled,
      speechRate: tempSpeechRate,
    });
    
    setShowSettings(false);
    
    // Reiniciar reprodução do mesmo ponto com nova velocidade
    if (wasPlaying && tempSpeechRate !== prefs.speechRate) {
      setTimeout(() => {
        handleStartReading(savedIndex);
      }, 100);
    }
  };

  const handleCancelSettings = () => {
    setShowSettings(false);
  };

  const canGoPrevious = () => {
    return getPreviousChapter(currentBook, currentChapter) !== null;
  };

  const canGoNext = () => {
    return getNextChapter(currentBook, currentChapter) !== null;
  };

  // Preparar textos para leitura (VOZ - idioma que será FALADO)
  const verseTexts = useMemo(() => {
    if (!chapterData) return [];
    
    // Idioma da VOZ determina qual texto será FALADO
    // O idioma do TEXTO (tela) é independente e determinado por prefs.textLanguage
    
    // Se idioma da voz é inglês, FALAR em inglês
    if (prefs.speechLanguage === 'en-US') {
      if (translatedTexts.en.length > 0) {
        return translatedTexts.en;
      }
      console.warn('⚠️ Tradução em inglês ainda não carregada');
      return chapterData.verses.map(v => v.text); // Fallback temporário
    }
    
    // Se idioma da voz é espanhol, FALAR em espanhol
    if (prefs.speechLanguage === 'es-ES') {
      if (translatedTexts.es.length > 0) {
        return translatedTexts.es;
      }
      console.warn('⚠️ Tradução em espanhol ainda não carregada');
      return chapterData.verses.map(v => v.text); // Fallback temporário
    }
    
    // Se idioma da voz é italiano, FALAR em italiano
    if (prefs.speechLanguage === 'it-IT') {
      if (translatedTexts.it.length > 0) {
        return translatedTexts.it;
      }
      console.warn('⚠️ Tradução em italiano ainda não carregada');
      return chapterData.verses.map(v => v.text); // Fallback temporário
    }
    
    // Se idioma da voz é francês, FALAR em francês
    if (prefs.speechLanguage === 'fr-FR') {
      if (translatedTexts.fr.length > 0) {
        return translatedTexts.fr;
      }
      console.warn('⚠️ Tradução em francês ainda não carregada');
      return chapterData.verses.map(v => v.text); // Fallback temporário
    }
    
    // Senão, FALAR em português (versão original da Bíblia)
    return chapterData.verses.map(v => v.text);
  }, [chapterData, translatedTexts, prefs.speechLanguage]);

  // Preparar versos para exibição na TELA (idioma do TEXTO - visual)
  const displayVerses = useMemo(() => {
    if (!chapterData) return [];
    
    // O idioma do TEXTO determina o que aparece na TELA
    // Isso é INDEPENDENTE do idioma da voz (speechLanguage)
    
    // Se o idioma do TEXTO for inglês, MOSTRAR em inglês
    if (prefs.textLanguage === 'en-US') {
      if (translatedTexts.en.length > 0) {
        return chapterData.verses.map((v, i) => ({
          number: v.number,
          text: translatedTexts.en[i] || v.text
        }));
      }
      console.warn('⚠️ Tradução em inglês para exibição ainda não carregada');
    }
    
    // Se o idioma do TEXTO for espanhol, MOSTRAR em espanhol
    if (prefs.textLanguage === 'es-ES') {
      if (translatedTexts.es.length > 0) {
        return chapterData.verses.map((v, i) => ({
          number: v.number,
          text: translatedTexts.es[i] || v.text
        }));
      }
      console.warn('⚠️ Tradução em espanhol para exibição ainda não carregada');
    }
    
    // Se o idioma do TEXTO for italiano, MOSTRAR em italiano
    if (prefs.textLanguage === 'it-IT') {
      if (translatedTexts.it.length > 0) {
        return chapterData.verses.map((v, i) => ({
          number: v.number,
          text: translatedTexts.it[i] || v.text
        }));
      }
      console.warn('⚠️ Tradução em italiano para exibição ainda não carregada');
    }
    
    // Se o idioma do TEXTO for francês, MOSTRAR em francês
    if (prefs.textLanguage === 'fr-FR') {
      if (translatedTexts.fr.length > 0) {
        return chapterData.verses.map((v, i) => ({
          number: v.number,
          text: translatedTexts.fr[i] || v.text
        }));
      }
      console.warn('⚠️ Tradução em francês para exibição ainda não carregada');
    }
    
    // Senão, MOSTRAR em português (texto original da Bíblia)
    return chapterData.verses;
  }, [chapterData, translatedTexts, prefs.textLanguage]);

  const handleStartReading = () => {
    if (verseTexts.length > 0) {
      console.log('🎯 CONFIGURAÇÃO DE LEITURA:');
      console.log('  📖 Texto na TELA:', prefs.textLanguage);
      console.log('  🗣️ Voz FALADA:', prefs.speechLanguage);
      console.log('  📚 Primeiros versículos (VOZ):', verseTexts.slice(0, 2));
      console.log('  📱 Primeiros versículos (TELA):', displayVerses.slice(0, 2).map(v => v.text));
      speak(verseTexts, 0);
      setShowControls(false); // esconde menus ao começar a ler
      setShowBottomNav(false); // esconde bottom nav ao começar a ler
    }
  };

  // Alterna visibilidade dos controles ao clicar no conteúdo
  const handleContentClick = () => {
    if (speechState === 'speaking') {
      const newShowState = !showControls;
      setShowControls(newShowState);
      setShowBottomNav(newShowState);
    }
  };

  // Mostra controles quando pausar ou parar
  useEffect(() => {
    if (speechState === 'paused' || speechState === 'idle') {
      setShowControls(true);
      setShowBottomNav(true);
    }
  }, [speechState, setShowBottomNav]);

  // Garante que o bottom nav apareça ao desmontar o componente
  useEffect(() => {
    return () => {
      setShowBottomNav(true);
    };
  }, [setShowBottomNav]);

  // Configurar gestos de swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (canGoNext()) {
        showSwipeLeft();
        handleNextChapter();
      }
    },
    onSwipedRight: () => {
      if (canGoPrevious()) {
        showSwipeRight();
        handlePreviousChapter();
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 50, // Sensibilidade do swipe
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasValidPreferences) {
    return null;
  }

  return (
    <div className="h-[100dvh] bg-[#FAF9F6] dark:bg-gray-950 flex flex-col relative overflow-hidden" {...swipeHandlers}>
      {/* Header flutuante */}
      <div className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none ${
        showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="bg-gradient-to-b from-[#FAF9F6] via-[#FAF9F6]/95 to-[#FAF9F6]/0 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950/0 pb-8 pointer-events-auto">
          <ReaderHeader
            book={chapterData?.bookName || currentBook}
            chapter={currentChapter}
            onSettingsClick={handleOpenSettings}
          />
        </div>
      </div>

      {isLoadingChapter || isTranslating ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {isTranslating ? 'Traduzindo para inglês...' : 'Carregando capítulo...'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {currentBook} {currentChapter} - {prefs.bibleVersion}
            </p>
            {isTranslating && (
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                🌐 Isso pode levar alguns segundos
              </p>
            )}
          </div>
        </div>
      ) : loadError ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 mb-4 max-w-md">
              <p className="text-red-600 dark:text-red-400 mb-4 font-semibold">❌ {loadError}</p>
              <div className="text-sm text-red-700 dark:text-red-300 text-left space-y-2">
                <p><strong>Debugando:</strong></p>
                <p>• Livro: {currentBook}</p>
                <p>• Capítulo: {currentChapter}</p>
                <p>• Versão: {prefs.bibleVersion}</p>
                <p>• Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/leitura/setup')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-2"
            >
              Configurar novamente
            </button>
            <button
              onClick={() => window.location.reload()}
              className="ml-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Recarregar
            </button>
          </div>
        </div>
      ) : chapterData ? (
        <>
          <div 
            className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollable-content"
            onClick={handleContentClick}
            style={{
              paddingTop: showControls ? '80px' : '20px',
              paddingBottom: showControls ? '140px' : '20px',
            }}
          >
            <ReaderContent
            verses={displayVerses}
            fontSize={prefs.readerFontSize}
            highlightedIndex={speechState === 'speaking' ? currentIndex : -1}
            currentCharIndex={speechState === 'speaking' ? currentCharIndex : 0}
          />
          </div>
        </>
      ) : null}

      {/* Indicador visual de swipe */}
      {swipeDirection && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className={`bg-blue-500/20 backdrop-blur-sm rounded-full p-6 animate-in fade-in duration-200 ${
            swipeDirection === 'left' ? 'slide-in-from-left' : 'slide-in-from-right'
          }`}>
            {swipeDirection === 'left' ? (
              <ChevronLeft className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            ) : (
              <ChevronRight className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            )}
          </div>
        </div>
      )}

      {/* Controles de Voz flutuantes */}
      {chapterData && (
        <div className={`absolute bottom-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none mb-16 ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <div className="bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/95 to-[#FAF9F6]/0 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950/0 pt-8 pointer-events-auto">
            <SpeechControls
              state={speechState}
              onPlay={handleStartReading}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              isSupported={isSupported}
            />
          </div>
        </div>
      )}

      {/* Legendas em Tempo Real */}
      {chapterData && prefs.subtitleEnabled && speechState === 'speaking' && currentIndex >= 0 && (
        <div className={`absolute left-0 right-0 z-30 transition-all duration-300 ${
          showControls ? 'bottom-32' : 'bottom-4'
        }`}>
          <SubtitleDisplay
            text={verseTexts[currentIndex]}
            fontSize={prefs.subtitleFontSize || 'M'}
          />
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-[#FAF9F6] dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] sm:max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 bg-[#FAF9F6] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-3xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configurações</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-6 pb-24 sm:pb-6 space-y-6">
              
              {/* Seletor de Livro e Capítulo */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📖</span>
                  <label className="font-semibold text-gray-900 dark:text-white">
                    Navegar para
                  </label>
                </div>
                <BookChapterSelector
                  currentBook={currentBook}
                  currentChapter={currentChapter}
                  onNavigate={(book, chapter) => {
                    handleNavigateToChapter(book, chapter);
                    setShowSettings(false);
                  }}
                />
              </div>
              
              {/* Tamanho da Fonte do Texto */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
                      onClick={() => setTempFontSize(size)}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                        tempFontSize === size
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {size === 'S' ? 'Pequeno' : size === 'M' ? 'Médio' : 'Grande'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Idioma da Voz */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🗣️</span>
                  <label className="font-semibold text-gray-900 dark:text-white">
                    Idioma da voz
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTempSpeechLanguage('pt-BR')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempSpeechLanguage === 'pt-BR'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇧🇷</span>
                    <span className="text-xs font-bold">PT</span>
                  </button>
                  <button
                    onClick={() => setTempSpeechLanguage('en-US')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempSpeechLanguage === 'en-US'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇺🇸</span>
                    <span className="text-xs font-bold">EN</span>
                  </button>
                  <button
                    onClick={() => setTempSpeechLanguage('es-ES')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempSpeechLanguage === 'es-ES'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇪🇸</span>
                    <span className="text-xs font-bold">ES</span>
                  </button>
                  <button
                    onClick={() => setTempSpeechLanguage('it-IT')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempSpeechLanguage === 'it-IT'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇮🇹</span>
                    <span className="text-xs font-bold">IT</span>
                  </button>
                  <button
                    onClick={() => setTempSpeechLanguage('fr-FR')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempSpeechLanguage === 'fr-FR'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇫🇷</span>
                    <span className="text-xs font-bold">FR</span>
                  </button>
                </div>
              </div>

              {/* Idioma do Texto */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📖</span>
                    <label className="font-semibold text-gray-900 dark:text-white">
                      Idioma do texto exibido
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTempTextLanguage('pt-BR')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempTextLanguage === 'pt-BR'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇧🇷</span>
                    <span className="text-xs font-bold">PT</span>
                  </button>
                  <button
                    onClick={() => setTempTextLanguage('en-US')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempTextLanguage === 'en-US'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇺🇸</span>
                    <span className="text-xs font-bold">EN</span>
                  </button>
                  <button
                    onClick={() => setTempTextLanguage('es-ES')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempTextLanguage === 'es-ES'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇪🇸</span>
                    <span className="text-xs font-bold">ES</span>
                  </button>
                  <button
                    onClick={() => setTempTextLanguage('it-IT')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempTextLanguage === 'it-IT'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇮🇹</span>
                    <span className="text-xs font-bold">IT</span>
                  </button>
                  <button
                    onClick={() => setTempTextLanguage('fr-FR')}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-semibold transition-all flex flex-col items-center gap-1 ${
                      tempTextLanguage === 'fr-FR'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🇫🇷</span>
                    <span className="text-xs font-bold">FR</span>
                  </button>
                </div>
              </div>

              {/* Velocidade da Leitura */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <label className="font-semibold text-gray-900 dark:text-white">
                      Velocidade da leitura
                    </label>
                  </div>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {tempSpeechRate.toFixed(1)}x
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0.6"
                    max="1.4"
                    step="0.1"
                    value={tempSpeechRate}
                    onChange={(e) => setTempSpeechRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0.6x (Lento)</span>
                    <span>1.0x (Normal)</span>
                    <span>1.4x (Rápido)</span>
                  </div>
                </div>
              </div>

              {/* Legendas em Tempo Real */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <label className="font-semibold text-gray-900 dark:text-white">
                      Legendas em tempo real
                    </label>
                  </div>
                  <button
                    onClick={() => setTempSubtitleEnabled(!tempSubtitleEnabled)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      tempSubtitleEnabled
                        ? 'bg-blue-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        tempSubtitleEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Exibe o texto do versículo atual durante a leitura em voz alta
                </p>
              </div>

              {/* Info sobre Áudio */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    🎧 Leitura em Voz Alta
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Use os controles de áudio na parte inferior para ouvir o capítulo sendo lido em voz alta. 
                    O versículo atual será destacado durante a leitura.
                  </p>
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

              {/* Botões de ação */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCancelSettings}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all active:scale-95"
                >
                  Salvar
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ReaderPageContent />
    </Suspense>
  );
}
