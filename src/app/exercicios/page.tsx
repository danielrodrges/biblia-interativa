'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Star, BookOpen, AlertCircle } from 'lucide-react';
import { generateVocabularyExercises, getReadingStats, type VocabularyExercise } from '@/lib/reading-history';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';

function ExerciciosContent() {
  const router = useRouter();
  const { prefs } = useReadingPrefs();
  
  const [exercises, setExercises] = useState<VocabularyExercise[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReturnType<typeof getReadingStats> | null>(null);

  useEffect(() => {
    // Carrega exercícios baseados no idioma de áudio (ouvido)
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
      10,
      true // preferir idioma de áudio
    );
    
    setExercises(generated);
    setStats(getReadingStats());
    setLoading(false);
  }, [prefs.speechLanguage]);

  const currentQ = exercises[currentQuestion];

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 pb-24">
        <div className="animate-pulse text-gray-600">Carregando exercícios...</div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 py-12 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhum exercício disponível
            </h1>
            <p className="text-gray-600 mb-6">
              Para gerar exercícios, você precisa ler alguns capítulos da Bíblia primeiro.
            </p>
            
            {stats && stats.totalReadings > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Suas estatísticas:</strong>
                  <br />
                  • {stats.totalChapters} capítulos lidos
                  <br />
                  • {stats.totalVerses} versículos
                  <br />
                  • {stats.totalReadings} sessões de leitura
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Os exercícios são gerados com base nas palavras que você leu em outro idioma.
                  Continue lendo com tradução ativa!
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Link
                href="/leitura"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Começar a Ler
              </Link>
              <Link
                href="/inicio"
                className="block w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;

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

  const calculateScore = () => {
    const correct = Object.values(answers).filter(Boolean).length;
    const total = exercises.length;
    return Math.round((correct / total) * 100);
  };

  if (completed) {
    const score = calculateScore();
    const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
    const languageNames: { [key: string]: string } = {
      'en-US': 'Inglês',
      'es-ES': 'Espanhol',
      'it-IT': 'Italiano',
      'fr-FR': 'Francês',
    };
    const practiceLang = prefs.practiceLanguage || prefs.textLanguage;

    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white pb-24">
        <div className="px-6 py-8 safe-area-top">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Exercícios Concluídos!
            </h1>
            <p className="text-gray-600 mb-6">
              Vocabulário de {languageNames[practiceLang as string] || 'outro idioma'}
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
                onClick={() => {
                  setCompleted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                  setSelectedAnswer(null);
                  setShowResult(false);
                  const generated = generateVocabularyExercises(
                    practiceLang as 'en-US' | 'es-ES' | 'it-IT' | 'fr-FR',
                    10
                  );
                  setExercises(generated);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Tentar Novamente
              </button>
              <Link
                href="/leitura"
                className="block w-full bg-blue-100 text-blue-700 py-4 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
              >
                Continuar Lendo
              </Link>
              <Link
                href="/inicio"
                className="block w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-4 sm:py-6 safe-area-top sticky top-0 z-10">
        <Link
          href="/inicio"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-3 sm:mb-4"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">Voltar</span>
        </Link>
        <h1 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Exercícios de Vocabulário</h1>
        <p className="text-blue-100 text-sm">Baseado nas suas leituras</p>
      </div>

      {/* Progresso */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Questão {currentQuestion + 1} de {exercises.length}</span>
          <span>{Math.round(((currentQuestion + 1) / exercises.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questão */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              O que significa em português?
            </span>
          </div>
          
          <h2 className="text-3xl font-bold text-blue-600 mb-2 text-center">
            {currentQ.word}
          </h2>
          
          <p className="text-sm text-gray-500 text-center mb-6">
            {currentQ.reference}
          </p>

          <div className="space-y-3">
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
                      ? 'border-green-500 bg-green-50'
                      : showWrong
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
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
                          : 'border-gray-300'
                      }`}
                    >
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {showWrong && <XCircle className="w-4 h-4 text-white" />}
                      {isSelected && !showResult && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explicação */}
        {showResult && (
          <div className={`rounded-xl p-4 mb-6 ${
            selectedAnswer === currentQ.correctAnswer
              ? 'bg-green-50 border border-green-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className="text-sm text-gray-700">
              {selectedAnswer === currentQ.correctAnswer ? (
                <>
                  <strong className="text-green-700">✓ Correto!</strong> "{currentQ.word}" significa "{currentQ.portugueseWord}" em português.
                </>
              ) : (
                <>
                  <strong className="text-blue-700">Resposta correta:</strong> "{currentQ.word}" significa "{currentQ.portugueseWord}" em português.
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
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
  );
}

export default function ExerciciosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando exercícios...</p>
      </div>
    }>
      <ExerciciosContent />
    </Suspense>
  );
}
