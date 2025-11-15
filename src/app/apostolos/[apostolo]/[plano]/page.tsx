'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2, Lock, Trophy, Star } from 'lucide-react';
import { getApostleById, getPlanById, calculatePlanProgress } from '@/lib/apostles-data';

interface PageProps {
  params: {
    apostolo: string;
    plano: string;
  };
}

interface PlanProgress {
  completedChapters: number[];
  completedExercises: number[];
  totalPoints: number;
}

export default function PlanoLeituraPage({ params }: PageProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<PlanProgress>({
    completedChapters: [],
    completedExercises: [],
    totalPoints: 0
  });

  const apostle = getApostleById(params.apostolo);
  const plan = getPlanById(params.plano);

  useEffect(() => {
    // Carregar progresso do localStorage
    const savedProgress = localStorage.getItem(`plan-progress-${params.plano}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [params.plano]);

  if (!apostle || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Plano não encontrado</p>
      </div>
    );
  }

  const progressPercentage = calculatePlanProgress(progress.completedChapters.length);
  const nextChapter = plan.chapters.find(ch => !progress.completedChapters.includes(ch.number));
  const nextExercise = plan.exercises.find(ex => !progress.completedExercises.includes(ex.afterChapter));

  const handleStartChapter = (chapterNumber: number) => {
    router.push(`/apostolos/${params.apostolo}/${params.plano}/capitulo/${chapterNumber}`);
  };

  const handleStartExercise = (afterChapter: number) => {
    router.push(`/apostolos/${params.apostolo}/${params.plano}/exercicio/${afterChapter}`);
  };

  const isChapterLocked = (chapterNumber: number) => {
    if (chapterNumber === 1) return false;
    return !progress.completedChapters.includes(chapterNumber - 1);
  };

  const isExerciseLocked = (afterChapter: number) => {
    return !progress.completedChapters.includes(afterChapter);
  };

  const shouldShowExercise = (afterChapter: number) => {
    return progress.completedChapters.includes(afterChapter) && 
           !progress.completedExercises.includes(afterChapter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div
        className="text-white px-6 py-6 safe-area-top"
        style={{ backgroundColor: apostle.color }}
      >
        <Link
          href="/apostolos"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{apostle.icon}</span>
          <div>
            <h1 className="text-xl font-bold">{plan.title}</h1>
            <p className="text-white/90 text-sm">por {apostle.name}</p>
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="px-6 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Progresso do Plano</span>
          <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
          <span>{progress.completedChapters.length}/10 capítulos</span>
          <span>{progress.completedExercises.length}/3 exercícios</span>
          <span className="flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            {progress.totalPoints} pts
          </span>
        </div>
      </div>

      {/* Descrição do Plano */}
      <div className="px-6 py-4">
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{plan.medal}</span>
            <span className="text-sm font-semibold text-gray-700">
              Nível: {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-700">{plan.description}</p>
        </div>

        {/* Próxima Ação */}
        {nextChapter && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 mb-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-semibold">Continuar Leitura</span>
            </div>
            <h3 className="font-bold text-lg mb-1">
              Capítulo {nextChapter.number}: {nextChapter.title}
            </h3>
            <p className="text-sm text-blue-100 mb-3">
              {nextChapter.book} {nextChapter.chapter}:{nextChapter.verses}
            </p>
            <button
              onClick={() => handleStartChapter(nextChapter.number)}
              className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Iniciar Capítulo
            </button>
          </div>
        )}

        {nextExercise && shouldShowExercise(nextExercise.afterChapter) && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-5 mb-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5" />
              <span className="text-sm font-semibold">Exercício Disponível</span>
            </div>
            <h3 className="font-bold text-lg mb-1">
              Exercício após Capítulo {nextExercise.afterChapter}
            </h3>
            <p className="text-sm text-green-100 mb-3">
              {nextExercise.questions.length} questões • Bônus: +{Math.round((nextExercise.bonusMultiplier - 1) * 100)}%
            </p>
            <button
              onClick={() => handleStartExercise(nextExercise.afterChapter)}
              className="w-full bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Fazer Exercício
            </button>
          </div>
        )}

        {/* Lista de Capítulos */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Capítulos do Plano</h2>
        <div className="space-y-3">
          {plan.chapters.map((chapter) => {
            const isCompleted = progress.completedChapters.includes(chapter.number);
            const isLocked = isChapterLocked(chapter.number);
            const showExerciseAfter = shouldShowExercise(chapter.number);

            return (
              <div key={chapter.number}>
                <button
                  onClick={() => !isLocked && handleStartChapter(chapter.number)}
                  disabled={isLocked}
                  className={`w-full text-left rounded-xl p-4 transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-2 border-green-200'
                      : isLocked
                      ? 'bg-gray-100 border-2 border-gray-200 opacity-60 cursor-not-allowed'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isLocked
                          ? 'bg-gray-300 text-gray-500'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-sm">{chapter.number}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {chapter.book} {chapter.chapter}:{chapter.verses}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{chapter.duration}</span>
                        {isCompleted && (
                          <span className="text-green-600 font-semibold">✓ Concluído</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Exercício após capítulo específico */}
                {showExerciseAfter && (
                  <div className="mt-3 ml-4 pl-4 border-l-2 border-green-300">
                    <button
                      onClick={() => handleStartExercise(chapter.number)}
                      className="w-full text-left bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Exercício Disponível
                          </h4>
                          <p className="text-sm text-gray-600">
                            Complete para ganhar pontos extras!
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Plano Completo */}
        {progress.completedChapters.length === 10 && progress.completedExercises.length === 3 && (
          <div className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">{plan.medal}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Plano Concluído!
            </h3>
            <p className="text-gray-800 mb-4">
              Você completou todos os capítulos e exercícios deste plano.
            </p>
            <div className="bg-white/50 rounded-lg p-4 mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {progress.totalPoints}
              </div>
              <div className="text-sm text-gray-700">Pontos Totais</div>
            </div>
            <Link
              href="/apostolos"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Escolher Próximo Plano
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
