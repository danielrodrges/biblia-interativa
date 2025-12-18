'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Languages, Trophy, Settings, BookOpen, Calendar } from 'lucide-react';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';
import { useReadingTime } from '@/hooks/useReadingTime';

export default function PerfilPage() {
  const router = useRouter();
  const { prefs, isLoaded } = useReadingPrefs();
  const { stats, formatTime } = useReadingTime();

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

  // Calcular sequência de dias (últimos 7 dias)
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const session = stats.sessions.find(s => s.date === dateStr);
      if (session && session.minutes > 0) {
        streak++;
      } else if (i > 0) {
        // Se perdeu um dia (exceto hoje), quebra a sequência
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  return (
    <div className="h-full w-full overflow-y-auto scrollable-content bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 px-3 py-4 pb-24 sm:px-6 sm:py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                Meu Perfil
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Usuário
              </p>
            </div>
            <button
              onClick={() => router.push('/configuracoes')}
              className="p-2.5 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tempo Total de Leitura */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <span className="text-white/90 font-medium text-xs sm:text-sm uppercase tracking-wide">
              Tempo Total de Leitura
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
            {formatTime(stats.totalMinutes)}
          </div>
          <p className="text-sm sm:text-base text-blue-100">
            {stats.totalMinutes > 0 ? 'Continue assim! 📖' : 'Comece sua jornada de leitura! 🚀'}
          </p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span className="text-xs sm:text-sm text-gray-600">Sessões</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800">
              {stats.sessions.length}
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <span className="text-xs sm:text-sm text-gray-600">Sequência</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800">
              {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}
            </div>
          </div>
        </div>

        {/* Idioma Atual */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-md">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Idioma de Aprendizado
            </h2>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base sm:text-lg font-semibold text-gray-800">
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

        {/* Histórico dos Últimos 7 Dias */}
        <div className="bg-[#FAF9F6] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Últimos 7 Dias
            </h2>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - i);
              const dateStr = date.toISOString().split('T')[0];
              const session = stats.sessions.find(s => s.date === dateStr);
              const minutes = session?.minutes || 0;
              const maxMinutes = Math.max(...stats.sessions.map(s => s.minutes), 1);
              const percentage = (minutes / maxMinutes) * 100;

              const dayName = i === 0 ? 'Hoje' : 
                            i === 1 ? 'Ontem' : 
                            date.toLocaleDateString('pt-BR', { weekday: 'short' });

              return (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 w-12 sm:w-16 capitalize">{dayName}</span>
                  <div className="flex-1 h-7 sm:h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full transition-all ${
                        minutes > 0 ? 'bg-gradient-to-r from-green-400 to-green-500' : ''
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                    {minutes > 0 && (
                      <span className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-semibold text-gray-700">
                        {formatTime(minutes)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configurações de Leitura */}
        <div className="bg-[#FAF9F6] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Configurações Atuais
            </h2>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-600">Tamanho da fonte</span>
              <span className="text-sm sm:text-base font-semibold text-gray-800">
                {prefs.readerFontSize === 'S' ? 'Pequeno' : prefs.readerFontSize === 'M' ? 'Médio' : 'Grande'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-600">Idioma da voz</span>
              <span className="text-sm sm:text-base font-semibold text-gray-800">
                {prefs.speechLanguage === 'pt-BR' ? '🇧🇷 Português' : prefs.speechLanguage === 'en-US' ? '🇺🇸 English' : prefs.speechLanguage === 'es-ES' ? '🇪🇸 Español' : prefs.speechLanguage === 'it-IT' ? '🇮🇹 Italiano' : '🇫🇷 Français'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-600">Idioma do texto</span>
              <span className="text-sm sm:text-base font-semibold text-gray-800">
                {prefs.textLanguage === 'pt-BR' ? '🇧🇷 Português' : prefs.textLanguage === 'en-US' ? '🇺🇸 English' : prefs.textLanguage === 'es-ES' ? '🇪🇸 Español' : prefs.textLanguage === 'it-IT' ? '🇮🇹 Italiano' : '🇫🇷 Français'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-600">Velocidade</span>
              <span className="text-sm sm:text-base font-semibold text-gray-800">
                {prefs.speechRate?.toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-600">Legendas</span>
              <span className="text-sm sm:text-base font-semibold text-gray-800">
                {prefs.subtitleEnabled ? '✅ Ativadas' : '❌ Desativadas'}
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Configurações */}
        <button
          onClick={() => router.push('/configuracoes')}
          className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          Configurações do App
        </button>
      </div>
    </div>
  );
}
