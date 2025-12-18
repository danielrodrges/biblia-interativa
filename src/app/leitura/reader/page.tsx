'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReaderHeader from '@/components/custom/reader/ReaderHeader';
import ReaderContent from '@/components/custom/reader/ReaderContent';
import ReaderControls from '@/components/custom/reader/ReaderControls';
import SubtitleOverlay from '@/components/custom/reader/SubtitleOverlay';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSubtitleSync } from '@/hooks/useSubtitleSync';
import { mockChapter } from '@/mocks/bibleChapter';
import { mockSubtitles } from '@/mocks/subtitles';
import { mockAudioUrl } from '@/mocks/audio';
import { X, Type, Languages, Volume2 } from 'lucide-react';

export default function ReaderPage() {
  const router = useRouter();
  const { prefs, savePrefs, hasValidPrefs, isLoaded } = useReadingPrefs();
  const { state, currentTime, play, pause, stop } = useAudioPlayer(mockAudioUrl);
  const activeSubtitle = useSubtitleSync(currentTime, mockSubtitles, prefs.subtitleEnabled && state !== 'idle');
  
  const [showSettings, setShowSettings] = useState(false);

  // Verificar se tem preferências válidas
  if (isLoaded && !hasValidPrefs()) {
    router.push('/leitura/setup');
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col pb-36">
      <ReaderHeader
        book={mockChapter.book}
        chapter={mockChapter.chapter}
        onSettingsClick={() => setShowSettings(true)}
      />

      <ReaderContent
        verses={mockChapter.verses}
        fontSize={prefs.readerFontSize}
      />

      <SubtitleOverlay
        text={activeSubtitle}
        fontSize={prefs.subtitleFontSize}
        isVisible={prefs.subtitleEnabled && state !== 'idle'}
      />

      <ReaderControls
        state={state}
        onPlay={play}
        onPause={pause}
        onStop={stop}
      />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configurações</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tamanho da Fonte do Texto */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <label className="font-semibold text-gray-900 dark:text-white">
                    Tamanho do texto
                  </label>
                </div>
                <div className="flex gap-3">
                  {(['S', 'M', 'L'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => savePrefs({ readerFontSize: size })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                        prefs.readerFontSize === size
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {size === 'S' ? 'Pequeno' : size === 'M' ? 'Médio' : 'Grande'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legendas */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <label className="font-semibold text-gray-900 dark:text-white">
                      Legendas
                    </label>
                  </div>
                  <button
                    onClick={() => savePrefs({ subtitleEnabled: !prefs.subtitleEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      prefs.subtitleEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        prefs.subtitleEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {prefs.subtitleEnabled && (
                  <div className="flex gap-3 mt-3">
                    {(['S', 'M', 'L'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => savePrefs({ subtitleFontSize: size })}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          prefs.subtitleFontSize === size
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {size === 'S' ? 'P' : size === 'M' ? 'M' : 'G'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Idiomas Configurados */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Idioma de leitura:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {prefs.dominantLanguage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Versão da Bíblia:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {prefs.bibleVersion}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idioma de prática:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {prefs.practiceLanguage}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão para alterar configurações */}
              <button
                onClick={() => router.push('/leitura/setup')}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Alterar idiomas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
