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
      <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900 border-t border-amber-200 dark:border-amber-800 p-3 z-40">
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
    <div className="flex-shrink-0 bg-[#FAF9F6]/98 dark:bg-stone-950/98 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-40">
      <div className="max-w-[720px] mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          {/* Ícone de Volume */}
          <Volume2 className="w-4 h-4 text-stone-400" />

          {/* Play / Pause / Resume */}
          {state === 'idle' ? (
            <button
              onClick={onPlay}
              className="p-4 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 shadow-lg transition-all active:scale-95"
              aria-label="Reproduzir"
            >
              <Play className="w-5 h-5 text-white dark:text-stone-900 fill-current ml-0.5" />
            </button>
          ) : isSpeaking ? (
            <button
              onClick={onPause}
              className="p-4 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 shadow-lg transition-all active:scale-95"
              aria-label="Pausar"
            >
              <Pause className="w-5 h-5 text-white dark:text-stone-900 fill-current" />
            </button>
          ) : (
            <button
              onClick={onResume}
              className="p-4 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 shadow-lg transition-all active:scale-95"
              aria-label="Continuar"
            >
              <Play className="w-5 h-5 text-white dark:text-stone-900 fill-current ml-0.5" />
            </button>
          )}

          {/* Stop */}
          <button
            onClick={onStop}
            disabled={state === 'idle'}
            className={`p-3 rounded-full transition-colors active:scale-95 ${
              state === 'idle'
                ? 'bg-stone-100 dark:bg-stone-900 cursor-not-allowed'
                : 'bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700'
            }`}
            aria-label="Parar"
          >
            <Square className={`w-5 h-5 ${state === 'idle' ? 'text-stone-300 dark:text-stone-700' : 'text-stone-600 dark:text-stone-400 fill-current'}`} />
          </button>

          {/* Status */}
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide w-20 text-center">
            {state === 'speaking' && 'Lendo...'}
            {state === 'paused' && 'Pausado'}
            {state === 'idle' && 'Pronto'}
          </span>
        </div>
      </div>
    </div>
  );
}
