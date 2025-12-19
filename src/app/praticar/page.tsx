'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Trophy, CheckCircle2, XCircle, RotateCcw, AlertCircle, Star } from 'lucide-react';
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando exercícios...</p>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 py-12 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nenhum exercício disponível
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
              Para praticar, você precisa ler alguns capítulos da Bíblia primeiro com tradução ativa.
            </p>
            
            {stats && stats.totalReadings > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Suas estatísticas:</strong>
                  <br />
                  • {stats.totalChapters} capítulos lidos
                  <br />
                  • {stats.totalVerses} versículos
                  <br />
                  • {stats.totalReadings} sessões de leitura
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Continue lendo com tradução para gerar mais exercícios!
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Link
                href="/leitura"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Começar a Ler
              </Link>
              <Link
                href="/inicio"
                className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
    const practiceLang = prefs.speechLanguage; // idioma que foi ouvido

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Parabéns!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você completou a prática de {languageNames[practiceLang as string] || 'vocabulário'}
            </p>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold mb-2">{score}%</div>
              <div className="text-blue-100">de acertos</div>
              <div className="flex items-center justify-center gap-1 mt-4">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      star <= stars
                        ? 'fill-yellow-300 text-yellow-300'
                        : 'text-blue-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Praticar Novamente
              </button>
              <Link
                href="/leitura"
                className="block w-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 py-4 rounded-xl font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
              >
                Continuar Lendo
              </Link>
              <Link
                href="/inicio"
                className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24">
      {/* Header com progresso */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Praticar Vocabulário
              </h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-2 sm:px-3 py-1 rounded-full">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm sm:text-base font-bold text-yellow-700 dark:text-yellow-400">
                {Object.values(answers).filter(Boolean).length}/{exercises.length}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {currentQuestion + 1}/{exercises.length}
            </span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do exercício */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="mb-6">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O que significa em português?
            </span>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-3">
              {currentQ.word}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentQ.reference}
            </p>
          </div>

          <div className="space-y-3 mb-6">
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
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : showWrong
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        showCorrect
                          ? 'border-green-500 bg-green-500'
                          : showWrong
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {showWrong && <XCircle className="w-4 h-4 text-white" />}
                      {isSelected && !showResult && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explicação */}
          {showResult && (
            <div className={`rounded-xl p-4 mb-6 ${
              selectedAnswer === currentQ.correctAnswer
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
            }`}>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <>
                    <strong className="text-green-700 dark:text-green-400">✓ Correto!</strong> "{currentQ.word}" significa "{currentQ.portugueseWord}" em português.
                  </>
                ) : (
                  <>
                    <strong className="text-blue-700 dark:text-blue-400">Resposta correta:</strong> "{currentQ.word}" significa "{currentQ.portugueseWord}" em português.
                  </>
                )}
              </p>
            </div>
          )}

          {/* Botões */}
          {!showResult ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                selectedAnswer
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              Verificar Resposta
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              {currentQuestion < exercises.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
