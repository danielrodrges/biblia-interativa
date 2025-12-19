'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Trophy, CheckCircle2, XCircle, RotateCcw, AlertCircle, Star, ArrowRight } from 'lucide-react';
import { generateVocabularyExercises, getReadingStats, type VocabularyExercise } from '@/lib/reading-history';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';

export default function PraticarPage() {
  const router = useRouter();
  const { prefs, isLoaded } = useReadingPrefs();
  
  const [exercises, setExercises] = useState<VocabularyExercise[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReturnType<typeof getReadingStats> | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    // Usa o idioma de áudio (ouvido) para gerar exercícios
    const audioLanguage = prefs.speechLanguage;
    
    if (!audioLanguage || audioLanguage === 'pt-BR') {
      setLoading(false);
      return;
    }
    
    const validLanguages = ['en-US', 'es-ES', 'it-IT', 'fr-FR'] as const;
    if (!validLanguages.includes(audioLanguage as any)) {
      setLoading(false);
      return;
    }
    
    const generated = generateVocabularyExercises(
      audioLanguage as 'en-US' | 'es-ES' | 'it-IT' | 'fr-FR',
      15,
      true // preferir idioma de áudio
    );
    
    setExercises(generated);
    setStats(getReadingStats());
    setLoading(false);
  }, [prefs.speechLanguage, isLoaded]);

  const currentQ = exercises[currentQuestion];

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !currentQ) return;

    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    setAnswers({
      ...answers,
      [currentQ.id]: isCorrect
    });
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers({});
    setCompleted(false);
    
    const audioLanguage = prefs.speechLanguage;
    if (audioLanguage && audioLanguage !== 'pt-BR') {
      const generated = generateVocabularyExercises(
        audioLanguage as 'en-US' | 'es-ES' | 'it-IT' | 'fr-FR',
        15,
        true
      );
      setExercises(generated);
    }
  };

  const calculateScore = () => {
    const correct = Object.values(answers).filter(Boolean).length;
    const total = exercises.length;
    return Math.round((correct / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 pb-24 bg-[#FAF9F6] dark:bg-stone-950">
        <div className="w-12 h-12 border-4 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-stone-600 dark:text-stone-400 font-serif">Carregando exercícios...</p>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-stone-950 px-4 sm:px-6 py-12 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center border border-stone-100 dark:border-stone-800">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-4">
              Nenhum exercício disponível
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
              Para praticar, você precisa ler alguns capítulos da Bíblia primeiro com a tradução ativa.
            </p>
            
            {stats && stats.totalReadings > 0 && (
              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-6 mb-8 text-left">
                <p className="text-stone-800 dark:text-stone-200 font-serif font-medium mb-3">
                  Suas estatísticas:
                </p>
                <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    {stats.totalChapters} capítulos lidos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    {stats.totalVerses} versículos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    {stats.totalReadings} sessões de leitura
                  </li>
                </ul>
                <p className="text-xs text-stone-500 dark:text-stone-500 mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                  Continue lendo com tradução para gerar mais exercícios!
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Link
                href="/leitura"
                className="flex items-center justify-center w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-2xl font-medium hover:opacity-90 transition-opacity"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Começar a Ler
              </Link>
              <Link
                href="/inicio"
                className="flex items-center justify-center w-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 py-4 rounded-2xl font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    const score = calculateScore();
    const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
    const languageNames: { [key: string]: string } = {
      'en-US': 'Inglês',
      'es-ES': 'Espanhol',
      'it-IT': 'Italiano',
      'fr-FR': 'Francês',
    };
    const practiceLang = prefs.speechLanguage;

    return (
      <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-stone-950 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center border border-stone-100 dark:border-stone-800">
            <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">
              Parabéns!
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mb-8">
              Você completou a prática de {languageNames[practiceLang as string] || 'vocabulário'}
            </p>

            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-8 mb-8">
              <div className="text-6xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">{score}%</div>
              <div className="text-stone-500 dark:text-stone-400 font-medium">de acertos</div>
              <div className="flex items-center justify-center gap-2 mt-6">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      star <= stars
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-stone-200 dark:text-stone-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-2xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Praticar Novamente
              </button>
              <Link
                href="/leitura"
                className="flex items-center justify-center w-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 py-4 rounded-2xl font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                Continuar Lendo
              </Link>
              <Link
                href="/inicio"
                className="flex items-center justify-center w-full text-stone-500 hover:text-stone-800 dark:text-stone-500 dark:hover:text-stone-300 py-4 font-medium transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / exercises.length) * 100;

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-stone-950 pb-24">
      {/* Header com progresso */}
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-xl">
                <BookOpen className="w-5 h-5 text-stone-700 dark:text-stone-300" />
              </div>
              <h1 className="text-lg font-serif font-bold text-stone-800 dark:text-stone-100">
                Praticar Vocabulário
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                {Object.values(answers).filter(Boolean).length}/{exercises.length}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 w-8">
              {currentQuestion + 1}/{exercises.length}
            </span>
            <div className="flex-1 h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-stone-800 dark:bg-stone-200 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do exercício */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 border border-stone-100 dark:border-stone-800">
          <div className="mb-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-medium text-stone-500 dark:text-stone-400 mb-4">
              TRADUÇÃO
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-3">
              {currentQ.word}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
              {currentQ.reference}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {currentQ.options?.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQ.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group ${
                    showCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : showWrong
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : isSelected
                      ? 'border-stone-800 bg-stone-50 dark:border-stone-200 dark:bg-stone-800'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 bg-white dark:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        showCorrect
                          ? 'border-green-500 bg-green-500'
                          : showWrong
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-stone-800 bg-stone-800 dark:border-stone-200 dark:bg-stone-200'
                          : 'border-stone-300 dark:border-stone-600 group-hover:border-stone-400'
                      }`}
                    >
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {showWrong && <XCircle className="w-4 h-4 text-white" />}
                      {isSelected && !showResult && (
                        <div className="w-2 h-2 bg-white dark:bg-stone-900 rounded-full" />
                      )}
                    </div>
                    <span className={`font-medium text-lg ${
                      isSelected ? 'text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'
                    }`}>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explicação */}
          {showResult && (
            <div className={`rounded-2xl p-5 mb-6 animate-in fade-in slide-in-from-bottom-4 ${
              selectedAnswer === currentQ.correctAnswer
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'
                : 'bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700'
            }`}>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <>
                    <strong className="text-green-700 dark:text-green-400 block mb-1">✓ Correto!</strong>
                    "{currentQ.word}" significa "{currentQ.portugueseWord}" em português.
                  </>
                ) : (
                  <>
                    <strong className="text-stone-900 dark:text-stone-100 block mb-1">Resposta correta:</strong>
                    "{currentQ.word}" significa "{currentQ.portugueseWord}" em português.
                  </>
                )}
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="pt-2">
            {!showResult ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer}
                className={`w-full py-4 rounded-2xl font-medium text-lg transition-all ${
                  selectedAnswer
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg hover:opacity-90'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                }`}
              >
                Verificar Resposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-2xl font-medium text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {currentQuestion < exercises.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
