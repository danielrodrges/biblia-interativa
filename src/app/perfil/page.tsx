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
      <div className="flex items-center justify-center min-h-screen bg-[#FAF9F6] dark:bg-stone-950">
        <div className="w-12 h-12 border-4 border-stone-800 dark:border-stone-200 border-t-transparent rounded-full animate-spin"></div>
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
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-stone-950 px-3 py-4 pb-24 sm:px-6 sm:py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-1">
                Meu Perfil
              </h1>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
                Usuário
              </p>
            </div>
            <button
              onClick={() => router.push('/configuracoes')}
              className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-stone-600 dark:text-stone-400" />
            </button>
          </div>
        </div>

        {/* Tempo Total de Leitura */}
        <div className="bg-stone-100 dark:bg-stone-800 rounded-3xl p-5 sm:p-7 mb-4 sm:mb-6 shadow-sm border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="p-2 bg-stone-200 dark:bg-stone-700 rounded-xl">
              <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-stone-700 dark:text-stone-300" />
            </div>
            <span className="text-stone-600 dark:text-stone-400 font-medium text-xs sm:text-sm uppercase tracking-wider">
              Tempo Total de Leitura
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">
            {formatTime(stats.totalMinutes)}
          </div>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
            {stats.totalMinutes > 0 ? 'Continue assim! 📖' : 'Comece sua jornada de leitura! 🚀'}
          </p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-100 dark:border-stone-800 hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
              <div className="p-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700 dark:text-stone-300" />
              </div>
              <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">Sessões</span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 dark:text-stone-100">
              {stats.sessions.length}
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-100 dark:border-stone-800 hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
              <div className="p-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700 dark:text-stone-300" />
              </div>
              <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">Sequência</span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 dark:text-stone-100">
              {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}
            </div>
          </div>
        </div>

        {/* Idioma Atual */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-4 sm:mb-6 shadow-sm border border-stone-100 dark:border-stone-800 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-250">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-stone-700 dark:text-stone-300" />
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-800 dark:text-stone-100">
              Idioma de Aprendizado
            </h2>
          </div>
          
          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base sm:text-lg font-serif font-semibold text-stone-800 dark:text-stone-100">
                {prefs.practiceLanguage === 'pt-BR' ? 'Português' : 'Inglês'}
              </span>
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-200 dark:bg-stone-700 px-3 py-1 rounded-full">
                Ativo
              </span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Idioma dominante: {prefs.dominantLanguage === 'pt-BR' ? 'Português' : 'Inglês'}
            </p>
          </div>

          <div className="text-sm text-stone-500 dark:text-stone-400">
            <p>Versão da Bíblia: <span className="font-medium text-stone-700 dark:text-stone-300">{prefs.bibleVersion || 'NVI'}</span></p>
          </div>
        </div>

        {/* Histórico dos Últimos 7 Dias */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-100 dark:border-stone-800 mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-stone-700 dark:text-stone-300" />
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-800 dark:text-stone-100">
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
                  <span className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 w-12 sm:w-16 capitalize">{dayName}</span>
                  <div className="flex-1 h-7 sm:h-8 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-300 ${
                        minutes > 0 ? 'bg-stone-300 dark:bg-stone-600' : ''
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                    {minutes > 0 && (
                      <span className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-semibold text-stone-700 dark:text-stone-200">
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
        <div className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-100 dark:border-stone-800 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-350">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-stone-700 dark:text-stone-300" />
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-800 dark:text-stone-100">
              Configurações Atuais
            </h2>
          </div>

          <div className="space-y-2 sm:space-y-2.5">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-700">
              <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">Tamanho da fonte</span>
              <span className="text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200">
                {prefs.readerFontSize === 'S' ? 'Pequeno' : prefs.readerFontSize === 'M' ? 'Médio' : 'Grande'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-700">
              <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">Idioma da voz</span>
              <span className="text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200">
                {prefs.speechLanguage === 'pt-BR' ? '🇧🇷 Português' : prefs.speechLanguage === 'en-US' ? '🇺🇸 English' : prefs.speechLanguage === 'es-ES' ? '🇪🇸 Español' : prefs.speechLanguage === 'it-IT' ? '🇮🇹 Italiano' : '🇫🇷 Français'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-700">
              <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">Idioma do texto</span>
              <span className="text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200">
                {prefs.textLanguage === 'pt-BR' ? '🇧🇷 Português' : prefs.textLanguage === 'en-US' ? '🇺🇸 English' : prefs.textLanguage === 'es-ES' ? '🇪🇸 Español' : prefs.textLanguage === 'it-IT' ? '🇮🇹 Italiano' : '🇫🇷 Français'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-700">
              <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">Velocidade</span>
              <span className="text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200">
                {prefs.speechRate?.toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-700">
              <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">Legendas</span>
              <span className="text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200">
                {prefs.subtitleEnabled ? '✅ Ativadas' : '❌ Desativadas'}
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Configurações */}
        <button
          onClick={() => router.push('/configuracoes')}
          className="w-full mt-4 sm:mt-6 py-4 sm:py-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl sm:rounded-3xl text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          Configurações do App
        </button>
      </div>
    </div>
  );
}
