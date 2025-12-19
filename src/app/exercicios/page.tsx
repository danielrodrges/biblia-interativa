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
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 pb-24 bg-[#FAF9F6]">
        <div className="animate-pulse text-stone-600 font-serif">Carregando exercícios...</div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen w-full bg-[#FAF9F6] px-4 sm:px-6 py-12 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-stone-800 mb-4">
              Nenhum exercício disponível
            </h1>
            <p className="text-stone-600 mb-6">
              Para gerar exercícios, você precisa ler alguns capítulos da Bíblia primeiro.
            </p>
            
            {stats && stats.totalReadings > 0 && (
              <div className="bg-stone-50 rounded-2xl p-4 mb-6 border border-stone-100">
                <p className="text-sm text-stone-700">
                  <strong>Suas estatísticas:</strong>
                  <br />
                  • {stats.totalChapters} capítulos lidos
                  <br />
                  • {stats.totalVerses} versículos
                  <br />
                  • {stats.totalReadings} sessões de leitura
                </p>
                <p className="text-xs text-stone-500 mt-2">
                  Os exercícios são gerados com base nas palavras que você leu em outro idioma.
                  Continue lendo com tradução ativa!
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Link
                href="/leitura"
                className="block w-full bg-stone-800 text-white py-4 rounded-2xl font-medium hover:bg-stone-700 transition-colors"
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Começar a Ler
              </Link>
              <Link
                href="/inicio"
                className="block w-full bg-stone-100 text-stone-700 py-4 rounded-2xl font-medium hover:bg-stone-200 transition-colors"
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
      <div className="min-h-screen w-full bg-[#FAF9F6] pb-24">
        <div className="px-6 py-8 safe-area-top">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-stone-800 mb-2">
              Exercícios Concluídos!
            </h1>
            <p className="text-stone-600 mb-6">
              Vocabulário de {languageNames[practiceLang as string] || 'outro idioma'}
            </p>

            <div className="bg-stone-800 text-white rounded-2xl p-6 mb-6">
              <div className="text-5xl font-serif font-bold mb-2">{score}%</div>
              <div className="text-stone-300">de acertos</div>
              <div className="flex items-center justify-center gap-1 mt-4">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      star <= stars
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-stone-600'
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
                className="w-full bg-stone-800 text-white py-4 rounded-2xl font-medium hover:bg-stone-700 transition-colors"
              >
                Tentar Novamente
              </button>
              <Link
                href="/leitura"
                className="block w-full bg-stone-100 text-stone-700 py-4 rounded-2xl font-medium hover:bg-stone-200 transition-colors"
              >
                Continuar Lendo
              </Link>
              <Link
                href="/inicio"
                className="block w-full bg-white border border-stone-200 text-stone-700 py-4 rounded-2xl font-medium hover:bg-stone-50 transition-colors"
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
    <div className="min-h-screen w-full bg-[#FAF9F6] pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 sm:px-6 py-4 sm:py-6 safe-area-top sticky top-0 z-10">
        <Link
          href="/inicio"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-3 sm:mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Voltar</span>
        </Link>
        <h1 className="text-lg sm:text-xl font-serif font-bold text-stone-800 mb-1 sm:mb-2">Exercícios de Vocabulário</h1>
        <p className="text-stone-500 text-sm">Baseado nas suas leituras</p>
      </div>

      {/* Progresso */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-stone-500 mb-2 font-medium">
          <span>Questão {currentQuestion + 1} de {exercises.length}</span>
          <span>{Math.round(((currentQuestion + 1) / exercises.length) * 100)}%</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2">
          <div
            className="bg-stone-800 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questão */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 mb-6">
          <div className="mb-4">
            <span className="text-xs text-stone-400 uppercase tracking-wide font-bold">
              O que significa em português?
            </span>
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2 text-center">
            {currentQ.word}
          </h2>
          
          <p className="text-sm text-stone-500 text-center mb-6 font-serif italic">
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
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showWrong
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-stone-800 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        showCorrect
                          ? 'border-green-500 bg-green-500'
                          : showWrong
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-stone-800 bg-stone-800'
                          : 'border-stone-300'
                      }`}
                    >
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {showWrong && <XCircle className="w-4 h-4 text-white" />}
                      {isSelected && !showResult && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className={`font-medium ${isSelected || showCorrect ? 'text-stone-900' : 'text-stone-600'}`}>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explicação */}
        {showResult && (
          <div className={`rounded-2xl p-4 mb-6 border ${
            selectedAnswer === currentQ.correctAnswer
              ? 'bg-green-50 border-green-200'
              : 'bg-stone-50 border-stone-200'
          }`}>
            <p className="text-sm text-stone-700">
              {selectedAnswer === currentQ.correctAnswer ? (
                <>
                  <strong className="text-green-700">✓ Correto!</strong> "{currentQ.word}" significa "{currentQ.portugueseWord}" em português.
                </>
              ) : (
                <>
                  <strong className="text-stone-800">Resposta correta:</strong> "{currentQ.word}" significa "{currentQ.portugueseWord}" em português.
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
            className={`w-full py-4 rounded-2xl font-medium text-lg transition-all ${
              selectedAnswer
                ? 'bg-stone-800 text-white shadow-sm hover:bg-stone-700'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            Verificar Resposta
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-stone-800 text-white py-4 rounded-2xl font-medium text-lg shadow-sm hover:bg-stone-700 transition-colors"
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <p className="text-stone-600 font-serif">Carregando exercícios...</p>
      </div>
    }>
      <ExerciciosContent />
    </Suspense>
  );
}