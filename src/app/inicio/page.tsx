'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Sparkles, TrendingUp, ChevronRight, Database } from 'lucide-react';
import { getPreferences } from '@/lib/preferences';
import { verseOfTheDay } from '@/lib/data';
import { UserPreferences } from '@/lib/types';

export default function InicioPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

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

  return (
    <div className="h-full w-full overflow-y-auto scrollable-content bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 px-4 py-6 md:px-6">
      <div className="max-w-lg mx-auto pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Olá! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Que Deus abençoe seu tempo de estudo
          </p>
        </div>

        {/* Verse of the Day */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-amber-100 font-medium text-sm uppercase tracking-wide">
              Versículo do Dia
            </span>
          </div>
          
          <div className="mb-4">
            <p className="text-white text-lg leading-relaxed mb-3">
              {verseOfTheDay.learningText}
            </p>
            <p className="text-blue-100 text-base leading-relaxed">
              {verseOfTheDay.nativeText}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-blue-100 font-medium">
              {verseOfTheDay.reference}
            </span>
            <button
              onClick={() => router.push('/praticar')}
              className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-all"
            >
              Praticar palavras
            </button>
          </div>
        </div>

        {/* Continue Reading */}
        {preferences.lastReading && (
          <button
            onClick={() => router.push('/leitura')}
            className="w-full bg-white rounded-2xl p-5 mb-4 shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-500 mb-1">
                  Continuar leitura
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {preferences.lastReading.book} {preferences.lastReading.chapter}
                </div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => router.push('/leitura')}
            className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800 mb-1">
                Ler Bíblia
              </div>
              <div className="text-sm text-gray-500">
                Escolha um livro
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/praticar')}
            className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800 mb-1">
                Praticar
              </div>
              <div className="text-sm text-gray-500">
                Exercícios
              </div>
            </div>
          </button>
        </div>

        {/* Demo de Gestão Bíblica */}
        <button
          onClick={() => router.push('/bible-demo')}
          className="w-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 mb-6 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-white mb-1">
                Sistema de Gestão Bíblica
              </div>
              <div className="text-sm text-purple-100">
                Traduções oficiais e leitura bilíngue
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/80" />
          </div>
        </button>

        {/* Language Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="text-sm text-amber-800 mb-3 font-medium">
            Seus idiomas de estudo:
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{preferences.nativeLanguage?.flag}</span>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {preferences.nativeLanguage?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {preferences.nativeVersion?.abbreviation}
                </div>
              </div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{preferences.learningLanguage?.flag}</span>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {preferences.learningLanguage?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {preferences.learningVersion?.abbreviation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
