'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Star } from 'lucide-react';
import { getPlanById } from '@/lib/apostles-data';
import type { ExerciseQuestion } from '@/lib/types';

// Exercícios de exemplo baseados no plano de leitura
const exercisesByPlan: { [key: string]: ExerciseQuestion[] } = {
  'paulo-amor': [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Segundo Paulo, o que acontece se falarmos as línguas dos homens e dos anjos, mas não tivermos amor?',
      options: [
        'Seremos como bronze que soa',
        'Seremos abençoados',
        'Seremos sábios',
        'Seremos profetas'
      ],
      correctAnswer: 'Seremos como bronze que soa',
      explanation: 'Paulo diz que sem amor, somos como bronze que soa ou címbalo que retine - apenas barulho sem significado.'
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'O amor é paciente e bondoso.',
      options: ['Verdadeiro', 'Falso'],
      correctAnswer: 'Verdadeiro',
      explanation: 'Correto! Paulo descreve o amor como paciente e bondoso.'
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      question: 'Qual destas características NÃO é do amor verdadeiro?',
      options: [
        'É paciente',
        'Guarda rancor',
        'É bondoso',
        'Não se orgulha'
      ],
      correctAnswer: 'Guarda rancor',
      explanation: 'O amor verdadeiro não guarda rancor. Paulo deixa claro que o amor perdoa.'
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question: 'Segundo o texto, o que permanece para sempre?',
      options: [
        'Fé, esperança e amor',
        'Apenas o amor',
        'Profecias e conhecimento',
        'Línguas e sabedoria'
      ],
      correctAnswer: 'Fé, esperança e amor',
      explanation: 'Paulo diz que permanecem a fé, a esperança e o amor, mas o maior deles é o amor.'
    }
  ],
  'paulo-fe': [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Como somos salvos, segundo Paulo em Efésios?',
      options: [
        'Pela fé, é dom de Deus',
        'Pelas nossas obras',
        'Pela nossa bondade',
        'Pelo nosso conhecimento'
      ],
      correctAnswer: 'Pela fé, é dom de Deus',
      explanation: 'Paulo ensina claramente que somos salvos pela graça, mediante a fé - e isso não vem de nós, é dom de Deus.'
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'Podemos nos orgulhar da nossa salvação porque fizemos boas obras.',
      options: ['Verdadeiro', 'Falso'],
      correctAnswer: 'Falso',
      explanation: 'Falso! Paulo diz que não é por obras, para que ninguém se orgulhe. A salvação é presente de Deus.'
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      question: 'Qual era nossa condição antes de Cristo?',
      options: [
        'Mortos em transgressões',
        'Justos e santos',
        'Neutros',
        'Meio salvos'
      ],
      correctAnswer: 'Mortos em transgressões',
      explanation: 'Paulo descreve que estávamos mortos em transgressões e pecados antes de Cristo nos vivificar.'
    }
  ]
};

function ExerciciosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plano');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [completed, setCompleted] = useState(false);

  const plan = planId ? getPlanById(planId) : null;
  const exercises = planId ? exercisesByPlan[planId] || [] : [];
  const currentQ = exercises[currentQuestion];

  if (!plan || exercises.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-gray-600 mb-4">Exercícios não disponíveis para este plano</p>
        <Link
          href="/apostolos"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Voltar para Apóstolos
        </Link>
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

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
        <div className="px-6 py-8 safe-area-top">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Exercícios Concluídos!
            </h1>
            <p className="text-gray-600 mb-6">
              Você completou os exercícios sobre "{plan.title}"
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
                onClick={() => router.push('/apostolos')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Escolher Novo Estudo
              </button>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-6 safe-area-top">
        <Link
          href="/apostolos"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </Link>
        <h1 className="text-xl font-bold mb-2">Exercícios</h1>
        <p className="text-blue-100 text-sm">{plan.title}</p>
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
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            {currentQ.question}
          </h2>

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
        {showResult && currentQ.explanation && (
          <div className={`rounded-xl p-4 mb-6 ${
            selectedAnswer === currentQ.correctAnswer
              ? 'bg-green-50 border border-green-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className="text-sm text-gray-700">
              <strong>Explicação:</strong> {currentQ.explanation}
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
