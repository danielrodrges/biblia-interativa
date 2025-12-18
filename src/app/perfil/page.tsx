'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Languages, Trophy, Settings, BookOpen, Calendar } from 'lucide-react';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';

// Simulação de dados de progresso (depois virá do Supabase)
const mockUserStats = {
  totalReadingTime: 245, // minutos
  languageStats: [
    { language: 'Inglês', minutes: 120 },
    { language: 'Espanhol', minutes: 85 },
    { language: 'Francês', minutes: 40 },
  ],
  chaptersRead: 12,
  currentStreak: 7, // dias consecutivos
};

export default function PerfilPage() {
  const router = useRouter();
  const { prefs, isLoaded } = useReadingPrefs();

  useEffect(() => {
    if (isLoaded && !prefs.dominantLanguage) {
      router.push('/leitura/setup');
    }
  }, [router, isLoaded, prefs]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-6 pb-24">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Meu Perfil
              </h1>
              <p className="text-gray-600">
                Usuário
              </p>
            </div>
            <button
              onClick={() => router.push('/configuracoes')}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tempo Total de Leitura */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-white" />
            <span className="text-white/90 font-medium text-sm uppercase tracking-wide">
              Tempo Total de Leitura
            </span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">
            {formatTime(mockUserStats.totalReadingTime)}
          </div>
          <p className="text-blue-100">
            Continue assim! 📖
          </p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Capítulos</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {mockUserStats.chaptersRead}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">Sequência</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {mockUserStats.currentStreak} dias
            </div>
          </div>
        </div>

        {/* Idioma Atual */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Idioma de Aprendizado
            </h2>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-800">
                {prefs.practiceLanguage === 'pt-BR' ? 'Português' : 'Inglês'}
              </span>
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Ativo
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Idioma dominante: {prefs.dominantLanguage === 'pt-BR' ? 'Português' : 'Inglês'}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            <p>Versão da Bíblia: <span className="font-medium text-gray-700">{prefs.bibleVersion || 'NVI'}</span></p>
          </div>
        </div>

        {/* Tempo por Idioma */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Tempo por Idioma
            </h2>
          </div>

          <div className="space-y-4">
            {mockUserStats.languageStats.map((stat, index) => {
              const percentage = (stat.minutes / mockUserStats.totalReadingTime) * 100;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{stat.language}</span>
                    <span className="text-sm font-semibold text-gray-600">
                      {formatTime(stat.minutes)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-purple-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão de Configurações */}
        <button
          onClick={() => router.push('/configuracoes')}
          className="w-full mt-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Configurações do App
        </button>
      </div>
    </div>
  );
}
