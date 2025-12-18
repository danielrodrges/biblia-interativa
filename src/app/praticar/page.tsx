'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { generateExerciseSet, ExerciseSet, ExerciseQuestion } from '@/lib/exercise-generator';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';

export default function PraticarPage() {
  const router = useRouter();
  const { prefs, hasValidPrefs, isLoaded } = useReadingPrefs();
  
  const [exerciseSet, setExerciseSet] = useState<ExerciseSet | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const hasValidPreferences = hasValidPrefs();

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!hasValidPreferences) {
      router.push('/leitura/setup');
      return;
    }

    loadExercises();
  }, [isLoaded, hasValidPreferences, router]);

  const loadExercises = async () => {
    setLoading(true);
    const book = 'genesis';
    const chapter = 1;
    
    const exercises = await generateExerciseSet(book, chapter);
    if (exercises) {
      setExerciseSet(exercises);
    }
    setLoading(false);
  };

  const handleAnswerMultipleChoice = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!exerciseSet || answered) return;
    
    const question = exerciseSet.questions[currentQuestion];
    const correct = selectedAnswer === question.correctAnswer;

    setIsCorrect(correct);
    setAnswered(true);
    if (correct) {
      setScore(score + 10);
    }
  };

  const handleNextQuestion = () => {
    if (!exerciseSet) return;
    
    if (currentQuestion < exerciseSet.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setAnswered(false);
      setIsCorrect(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setAnswered(false);
    setIsCorrect(false);
    setScore(0);
    loadExercises();
  };

  if (loading || !exerciseSet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Gerando exercícios...</p>
      </div>
    );
  }

  const question = exerciseSet.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exerciseSet.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* Header com progresso */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {exerciseSet.title}
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-yellow-700 dark:text-yellow-400">{score} pts</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentQuestion + 1}/{exerciseSet.questions.length}
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#FAF9F6] dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {question.question}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-l-4 border-blue-500">
              <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                "{question.verse.text}"
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                {question.verse.reference}
              </p>
            </div>
          </div>

          {question.type === 'multiple-choice' && question.options && (
            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === question.correctAnswer;
                
                let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all transform hover:scale-[1.02] ';
                
                if (!answered) {
                  buttonClass += isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300';
                } else if (isCorrectOption) {
                  buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/20';
                } else if (isSelected) {
                  buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/20';
                } else {
                  buttonClass += 'border-gray-200 dark:border-gray-700 opacity-50';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerMultipleChoice(option)}
                    disabled={answered}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {answered && isCorrectOption && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {answered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {answered && (
            <div className={`rounded-xl p-4 mb-6 ${
              isCorrect 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-semibold ${
                    isCorrect ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {isCorrect ? '✨ Correto! Muito bem!' : '❌ Incorreto. Tente novamente!'}
                  </p>
                  {question.explanation && (
                    <p className="text-sm mt-1">
                      {question.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </button>
            
            {!answered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
              >
                Verificar Resposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 transition-all flex items-center justify-center gap-2"
              >
                Próxima Questão
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
