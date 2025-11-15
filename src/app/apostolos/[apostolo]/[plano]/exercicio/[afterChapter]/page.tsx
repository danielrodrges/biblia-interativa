'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Star } from 'lucide-react';
import { getApostleById, getPlanById, calculateExercisePoints } from '@/lib/apostles-data';

interface PageProps {
  params: {
    apostolo: string;
    plano: string;
    afterChapter: string;
  };
}

export default function ExercicioPage({ params }: PageProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const apostle = getApostleById(params.apostolo);
  const plan = getPlanById(params.plano);
  const afterChapter = parseInt(params.afterChapter);
  const exercise = plan?.exercises.find(ex => ex.afterChapter === afterChapter);

  useEffect(() => {
    if (exercise) {
      setAnswers(new Array(exercise.questions.length).fill(null));
    }
  }, [exercise]);

  if (!apostle || !plan || !exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Exercício não encontrado</p>
      </div>
    );
  }

  const currentQ = exercise.questions[currentQuestion];
  const totalQuestions = exercise.questions.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calcular pontuação
      let totalScore = 0;
      exercise.questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
          totalScore += q.points;
        }
      });
      
      // Aplicar multiplicador de bônus
      totalScore = Math.round(totalScore * exercise.bonusMultiplier);
      setScore(totalScore);
      setShowResults(true);

      // Salvar progresso
      const progressKey = `plan-progress-${params.plano}`;
      const savedProgress = localStorage.getItem(progressKey);
      const progress = savedProgress ? JSON.parse(savedProgress) : {
        completedChapters: [],
        completedExercises: [],
        totalPoints: 0
      };

      if (!progress.completedExercises.includes(afterChapter)) {
        progress.completedExercises.push(afterChapter);
        progress.totalPoints += totalScore;
        localStorage.setItem(progressKey, JSON.stringify(progress));
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFinish = () => {
    router.push(`/apostolos/${params.apostolo}/${params.plano}`);
  };

  const correctAnswers = answers.filter((ans, idx) => ans === exercise.questions[idx].correctAnswer).length;
  const totalPoints = calculateExercisePoints(exercise);

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
        {/* Header */}
        <div
          className="text-white px-6 py-6 safe-area-top"
          style={{ backgroundColor: apostle.color }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{apostle.icon}</span>
            <div>
              <h1 className="text-xl font-bold">Exercício Concluído!</h1>
              <p className="text-white/90 text-sm">Capítulo {afterChapter}</p>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="px-6 py-8">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-center mb-6">
            <Trophy className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Parabéns!
            </h2>
            <p className="text-gray-800 mb-6">
              Você completou o exercício do capítulo {afterChapter}
            </p>

            <div className="bg-white/50 rounded-xl p-6 mb-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {score}
              </div>
              <div className="text-sm text-gray-700">Pontos Ganhos</div>
              <div className="text-xs text-gray-600 mt-2">
                Bônus: +{Math.round((exercise.bonusMultiplier - 1) * 100)}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-white/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-xs text-gray-700">Acertos</div>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round((correctAnswers / totalQuestions) * 100)}%
                </div>
                <div className="text-xs text-gray-700">Aproveitamento</div>
              </div>
            </div>
          </div>

          {/* Revisão das Respostas */}
          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-gray-900">Revisão das Respostas</h3>
            {exercise.questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`rounded-xl p-4 border-2 ${
                    isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">
                        {idx + 1}. {q.question}
                      </p>
                      {q.type === 'multiple-choice' && q.options && (
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isUserAnswer = userAnswer === optIdx;
                            const isCorrectAnswer = q.correctAnswer === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`text-sm p-2 rounded ${
                                  isCorrectAnswer
                                    ? 'bg-green-100 text-green-800 font-semibold'
                                    : isUserAnswer
                                    ? 'bg-red-100 text-red-800'
                                    : 'text-gray-600'
                                }`}
                              >
                                {opt}
                                {isCorrectAnswer && ' ✓'}
                                {isUserAnswer && !isCorrectAnswer && ' ✗'}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {q.type === 'true-false' && (
                        <div className="space-y-2">
                          <div
                            className={`text-sm p-2 rounded ${
                              q.correctAnswer === 0
                                ? 'bg-green-100 text-green-800 font-semibold'
                                : userAnswer === 0
                                ? 'bg-red-100 text-red-800'
                                : 'text-gray-600'
                            }`}
                          >
                            Verdadeiro
                            {q.correctAnswer === 0 && ' ✓'}
                            {userAnswer === 0 && q.correctAnswer !== 0 && ' ✗'}
                          </div>
                          <div
                            className={`text-sm p-2 rounded ${
                              q.correctAnswer === 1
                                ? 'bg-green-100 text-green-800 font-semibold'
                                : userAnswer === 1
                                ? 'bg-red-100 text-red-800'
                                : 'text-gray-600'
                            }`}
                          >
                            Falso
                            {q.correctAnswer === 1 && ' ✓'}
                            {userAnswer === 1 && q.correctAnswer !== 1 && ' ✗'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleFinish}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Voltar ao Plano
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div
        className="text-white px-6 py-6 safe-area-top"
        style={{ backgroundColor: apostle.color }}
      >
        <Link
          href={`/apostolos/${params.apostolo}/${params.plano}`}
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Voltar ao Plano</span>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Exercício</h1>
            <p className="text-white/90 text-sm">Após Capítulo {afterChapter}</p>
          </div>
        </div>
      </div>

      {/* Progresso */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Questão {currentQuestion + 1} de {totalQuestions}
          </span>
          <span className="text-sm text-gray-600">
            Bônus: +{Math.round((exercise.bonusMultiplier - 1) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Questão */}
      <div className="px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {currentQ.question}
          </h2>

          {/* Opções de Múltipla Escolha */}
          {currentQ.type === 'multiple-choice' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    answers[currentQuestion] === idx
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        answers[currentQuestion] === idx
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {answers[currentQuestion] === idx && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Opções Verdadeiro/Falso */}
          {currentQ.type === 'true-false' && (
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer(0)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion] === 0
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[currentQuestion] === 0
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {answers[currentQuestion] === 0 && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-800 font-semibold">Verdadeiro</span>
                </div>
              </button>

              <button
                onClick={() => handleAnswer(1)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion] === 1
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-red-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[currentQuestion] === 1
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {answers[currentQuestion] === 1 && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-800 font-semibold">Falso</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Botão Próxima */}
        <button
          onClick={handleNext}
          disabled={answers[currentQuestion] === null}
          className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
            answers[currentQuestion] !== null
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? 'Finalizar Exercício' : 'Próxima Questão'}
        </button>
      </div>
    </div>
  );
}
