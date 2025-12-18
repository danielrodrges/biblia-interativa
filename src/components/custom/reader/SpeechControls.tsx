'use client';

import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { SpeechState } from '@/hooks/useSpeechSynthesis';

interface SpeechControlsProps {
  state: SpeechState;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  isSupported: boolean;
}

export default function SpeechControls({
  state,
  onPlay,
  onPause,
  onResume,
  onStop,
  isSupported,
}: SpeechControlsProps) {
  if (!isSupported) {
    return (
      <div className="fixed bottom-20 left-0 right-0 z-40 bg-amber-100 dark:bg-amber-900 border-t border-amber-200 dark:border-amber-800 p-3">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ Seu navegador não suporta síntese de voz
          </p>
        </div>
      </div>
    );
  }

  const isSpeaking = state === 'speaking';
  const isPaused = state === 'paused';

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 bg-white/98 dark:bg-gray-900/98 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-[720px] mx-auto px-6 py-3">
        <div className="flex items-center justify-center gap-4">
          {/* Ícone de Volume */}
          <Volume2 className="w-5 h-5 text-gray-400" />

          {/* Play / Pause / Resume */}
          {state === 'idle' ? (
            <button
              onClick={onPlay}
              className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg transition-all"
              aria-label="Reproduzir"
            >
              <Play className="w-6 h-6 text-white fill-white" />
            </button>
          ) : isSpeaking ? (
            <button
              onClick={onPause}
              className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg transition-all"
              aria-label="Pausar"
            >
              <Pause className="w-6 h-6 text-white fill-white" />
            </button>
          ) : (
            <button
              onClick={onResume}
              className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg transition-all"
              aria-label="Continuar"
            >
              <Play className="w-6 h-6 text-white fill-white" />
            </button>
          )}

          {/* Stop */}
          <button
            onClick={onStop}
            disabled={state === 'idle'}
            className={`p-3 rounded-full transition-colors ${
              state === 'idle'
                ? 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed'
                : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
            }`}
            aria-label="Parar"
          >
            <Square className={`w-5 h-5 ${state === 'idle' ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`} />
          </button>

          {/* Status */}
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {state === 'speaking' && '🔊 Lendo...'}
            {state === 'paused' && '⏸️ Pausado'}
            {state === 'idle' && '🎧 Pronto'}
          </span>
        </div>
      </div>
    </div>
  );
}
