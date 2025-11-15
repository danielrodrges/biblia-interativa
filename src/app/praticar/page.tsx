'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Check, Eye, EyeOff, Sparkles } from 'lucide-react';
import { getPreferences } from '@/lib/preferences';
import { sampleExercises } from '@/lib/data';
import { UserPreferences, Exercise } from '@/lib/types';

export default function PraticarPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());

  useEffect(() => {
    const prefs = getPreferences();
    if (!prefs.onboardingCompleted) {
      router.push('/onboarding');
      return;
    }
    setPreferences(prefs);
  }, [router]);

  if (!preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const exercise = sampleExercises[currentExercise];

  const handleNextExercise = () => {
    setCurrentExercise((prev) => (prev + 1) % sampleExercises.length);
    setShowTranslation(false);
    setSelectedWords(new Set());
  };

  const toggleWord = (index: number) => {
    const newSelected = new Set(selectedWords);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedWords(newSelected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-6 py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Praticar Idioma
          </h1>
          <p className="text-gray-600 text-lg">
            Exercícios baseados nos versículos
          </p>
        </div>

        {/* Exercise Type Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all"
              style={{ width: `${((currentExercise + 1) / sampleExercises.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {currentExercise + 1}/{sampleExercises.length}
          </span>
        </div>

        {/* Vocabulary Exercise */}
        {exercise.type === 'vocabulary' && exercise.words && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-6 h-6 text-amber-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Vocabulário do Versículo
                </h2>
                <p className="text-sm text-gray-600">
                  {exercise.verse.reference}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {exercise.words.map((word, index) => (
                <button
                  key={index}
                  onClick={() => toggleWord(index)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedWords.has(index)
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-800">
                      {word.learning}
                    </span>
                    {selectedWords.has(index) && (
                      <Check className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div className="text-base text-gray-600 mb-1">
                    {word.native}
                  </div>
                  <div className="text-sm text-gray-500 italic">
                    "{word.context}"
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Translation Exercise */}
        {exercise.type === 'translation' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-6 h-6 text-amber-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Tradução Reversa
                </h2>
                <p className="text-sm text-gray-600">
                  {exercise.verse.reference}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-4">
              <p className="text-lg text-gray-800 leading-relaxed mb-4">
                {exercise.verse.learningText}
              </p>
              <div className="text-sm text-blue-700 font-medium">
                {preferences.learningLanguage?.flag} {preferences.learningLanguage?.name}
              </div>
            </div>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 mb-4"
            >
              {showTranslation ? (
                <>
                  <EyeOff className="w-5 h-5" />
                  Ocultar tradução
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  Ver tradução
                </>
              )}
            </button>

            {showTranslation && (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
                <p className="text-lg text-gray-800 leading-relaxed mb-4">
                  {exercise.verse.nativeText}
                </p>
                <div className="text-sm text-amber-700 font-medium">
                  {preferences.nativeLanguage?.flag} {preferences.nativeLanguage?.name}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meditation Exercise */}
        {exercise.type === 'meditation' && exercise.meditation && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Meditação Guiada
                </h2>
                <p className="text-sm text-gray-600">
                  {exercise.verse.reference}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-2xl p-5">
                <div className="text-sm font-medium text-blue-700 mb-2">
                  {preferences.learningLanguage?.flag} {preferences.learningLanguage?.name}
                </div>
                <p className="text-base text-gray-800 leading-relaxed">
                  {exercise.meditation.learning}
                </p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-5">
                <div className="text-sm font-medium text-amber-700 mb-2">
                  {preferences.nativeLanguage?.flag} {preferences.nativeLanguage?.name}
                </div>
                <p className="text-base text-gray-800 leading-relaxed">
                  {exercise.meditation.native}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/leitura')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-lg transition-all"
          >
            Voltar à leitura
          </button>
          <button
            onClick={handleNextExercise}
            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg"
          >
            Próximo exercício
          </button>
        </div>

        {/* Encouragement */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Continue praticando! Cada palavra aprendida é um passo na sua jornada. 🌟
          </p>
        </div>
      </div>
    </div>
  );
}
